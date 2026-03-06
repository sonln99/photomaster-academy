import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Keywords to categorize scraped hashtags
const PHOTO_KEYWORDS = [
  "photo", "camera", "canon", "nikon", "sony", "fuji", "leica", "sigma",
  "portrait", "landscape", "street", "macro", "bokeh", "lens", "mirrorless",
  "dslr", "lightroom", "photoshop", "retouching", "retouch", "colorgrading",
  "goldenhour", "chụp", "nhiếp", "ảnh", "wedding", "fashion", "model",
  "aesthetic", "film", "analog", "35mm", "exposure", "aperture", "shutter",
];

const VIDEO_KEYWORDS = [
  "video", "film", "cinematic", "filmmaker", "vlog", "drone", "dji",
  "gimbal", "premiere", "davinci", "resolve", "finalcut", "capcut",
  "transition", "slowmo", "timelapse", "hyperlapse", "reel", "creator",
  "behindthescenes", "bts", "edit", "editing", "quay",
];

const VIRAL_KEYWORDS = [
  "viral", "trending", "fyp", "foryou", "foryoupage", "growth", "algorithm",
  "tip", "trick", "hack", "howto", "tutorial", "learn", "boost",
  "engage", "content", "strategy", "follow",
];

function categorize(hashtag: string): string {
  const h = hashtag.toLowerCase();
  if (PHOTO_KEYWORDS.some((kw) => h.includes(kw))) return "photography";
  if (VIDEO_KEYWORDS.some((kw) => h.includes(kw))) return "videography";
  if (VIRAL_KEYWORDS.some((kw) => h.includes(kw))) return "viral_tips";
  return "trending";
}

interface ScrapedHashtag {
  hashtagName: string;
  publishCnt: number;
  videoViews: number;
  trend: Array<{ time: number; value: number }>;
  rank: number;
}

interface SampleVideo {
  id: string;
  desc: string;
  cover: string;
  plays: number;
  author: string;
}

async function scrapeCreativeCenter(countryCode = ""): Promise<ScrapedHashtag[]> {
  const results: ScrapedHashtag[] = [];
  const url = countryCode
    ? `https://ads.tiktok.com/business/creativecenter/inspiration/popular/hashtag/pc/en?countryCode=${countryCode}`
    : "https://ads.tiktok.com/business/creativecenter/inspiration/popular/hashtag/pc/en";

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(20000),
    });

    if (!res.ok) return results;

    const html = await res.text();
    const match = html.match(/__NEXT_DATA__[^>]*>(.*?)<\/script>/);
    if (!match) return results;

    const nextData = JSON.parse(match[1]);
    const queries = nextData?.props?.pageProps?.dehydratedState?.queries || [];

    for (const q of queries) {
      const pages = q?.state?.data?.pages;
      if (!pages) continue;
      for (const page of pages) {
        if (page?.list) results.push(...page.list);
      }
    }
  } catch (err) {
    console.error("[Trends] Scrape error:", err);
  }

  return results;
}

async function scrapeHashtagVideos(hashtag: string): Promise<SampleVideo[]> {
  const videos: SampleVideo[] = [];

  try {
    const res = await fetch(`https://www.tiktok.com/embed/tag/${encodeURIComponent(hashtag)}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) return videos;
    const html = await res.text();

    const videoPattern =
      /\{"id":"(\d{15,})","desc":"((?:[^"\\]|\\.)*)","height":\d+,"width":\d+,"ratio":"[^"]*","coverUrl":"((?:[^"\\]|\\.)*)","originCoverUrl":"((?:[^"\\]|\\.)*)","dynamicCoverUrl":"[^"]*","playAddr":"[^"]*","playCount":(\d+),"privateItem":(true|false),"authorUniqueId":"([^"]*)"/g;
    let match;
    while ((match = videoPattern.exec(html)) !== null) {
      if (match[6] === "false") {
        videos.push({
          id: match[1],
          desc: match[2]
            .replace(/\\u[\dA-Fa-f]{4}/g, (m) => String.fromCharCode(parseInt(m.slice(2), 16)))
            .replace(/\\n/g, "\n")
            .replace(/\\"/g, '"'),
          cover: (match[4] || match[3]).replace(/\\u0026/g, "&"),
          plays: parseInt(match[5]),
          author: match[7],
        });
      }
    }
  } catch (err) {
    console.error(`[Trends] Error scraping videos for #${hashtag}:`, err);
  }

  return videos;
}

// Curated popular hashtags in our niche
const CURATED_PHOTO_HASHTAGS = [
  "photography", "photographer", "photooftheday", "portrait", "streetphotography",
  "landscapephotography", "naturephotography", "canonphotography", "sonyphotography",
  "nikonphotography", "fujifilm", "lightroom", "photoshop", "colorgrading",
  "weddingphotography", "fashionphotography", "retouching", "goldenhour",
  "35mm", "filmisnotdead", "analogphotography", "bokeh", "macro",
];

const CURATED_VIDEO_HASHTAGS = [
  "videography", "filmmaking", "cinematography", "filmmaker", "cinematic",
  "behindthescenes", "drone", "djimini", "capcut", "videoediting",
  "slowmotion", "timelapse", "transitions", "vlog", "contentcreator",
  "reels", "shortfilm",
];

const CURATED_VIRAL_HASHTAGS = [
  "fyp", "viral", "trending", "foryoupage", "tiktoktrends",
  "tiktoktips", "contentcreator", "growthtips", "algorithm",
  "viralvideo", "howtogoviral", "editingtips", "creatortips",
];

interface TrendRow {
  category: string;
  hashtag: string;
  post_count: number;
  view_count: number;
  trend_score: number;
  region: string;
  sample_videos: SampleVideo[];
  crawled_at: string;
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const allTrends: TrendRow[] = [];
  const seen = new Set<string>();
  const now = new Date().toISOString();

  // 1. Scrape general trending from Creative Center
  const scraped = await scrapeCreativeCenter();
  console.log(`[Trends] Scraped ${scraped.length} hashtags from Creative Center`);

  for (const item of scraped) {
    if (!item.hashtagName || seen.has(item.hashtagName.toLowerCase())) continue;
    seen.add(item.hashtagName.toLowerCase());

    const trendValues = item.trend?.map((t) => t.value) || [];
    const trendScore = trendValues.length > 0
      ? trendValues.reduce((a, b) => a + b, 0) / trendValues.length * 100
      : 0;

    allTrends.push({
      category: categorize(item.hashtagName),
      hashtag: item.hashtagName,
      post_count: item.publishCnt || 0,
      view_count: item.videoViews || 0,
      trend_score: Math.round(trendScore),
      region: "VN",
      sample_videos: [],
      crawled_at: now,
    });
  }

  // 2. Also scrape VN-specific trending
  const scrapedVN = await scrapeCreativeCenter("VN");
  console.log(`[Trends] Scraped ${scrapedVN.length} VN-specific hashtags`);

  for (const item of scrapedVN) {
    if (!item.hashtagName || seen.has(item.hashtagName.toLowerCase())) continue;
    seen.add(item.hashtagName.toLowerCase());

    const trendValues = item.trend?.map((t) => t.value) || [];
    const trendScore = trendValues.length > 0
      ? trendValues.reduce((a, b) => a + b, 0) / trendValues.length * 100
      : 0;

    allTrends.push({
      category: categorize(item.hashtagName),
      hashtag: item.hashtagName,
      post_count: item.publishCnt || 0,
      view_count: item.videoViews || 0,
      trend_score: Math.round(trendScore),
      region: "VN",
      sample_videos: [],
      crawled_at: now,
    });
  }

  // 3. Add curated niche hashtags
  const curated = [
    ...CURATED_PHOTO_HASHTAGS.map((h) => ({ hashtag: h, category: "photography" })),
    ...CURATED_VIDEO_HASHTAGS.map((h) => ({ hashtag: h, category: "videography" })),
    ...CURATED_VIRAL_HASHTAGS.map((h) => ({ hashtag: h, category: "viral_tips" })),
  ];

  for (const item of curated) {
    if (seen.has(item.hashtag.toLowerCase())) continue;
    seen.add(item.hashtag.toLowerCase());
    allTrends.push({
      category: item.category,
      hashtag: item.hashtag,
      post_count: 0,
      view_count: 0,
      trend_score: 10,
      region: "VN",
      sample_videos: [],
      crawled_at: now,
    });
  }

  // 4. Scrape sample videos for all hashtags (top ones first)
  const sorted = [...allTrends].sort((a, b) => b.trend_score - a.trend_score);
  let videoScrapeCount = 0;
  for (const trend of sorted) {
    if (videoScrapeCount >= 50) break; // Limit to avoid timeout
    const videos = await scrapeHashtagVideos(trend.hashtag);
    if (videos.length > 0) {
      // Find the trend in allTrends and attach videos (keep top 10)
      const idx = allTrends.findIndex((t) => t.hashtag === trend.hashtag);
      if (idx >= 0) allTrends[idx].sample_videos = videos.slice(0, 10);
    }
    videoScrapeCount++;
  }

  console.log(`[Trends] Scraped videos for ${videoScrapeCount} hashtags`);

  if (allTrends.length === 0) {
    return NextResponse.json({ message: "No trends found", count: 0 });
  }

  // Clear old data and insert new
  await supabase.from("tiktok_trends").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  const { error } = await supabase.from("tiktok_trends").insert(allTrends);

  if (error) {
    console.error("[Trends] Insert error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const withVideos = allTrends.filter((t) => t.sample_videos.length > 0).length;

  return NextResponse.json({
    success: true,
    count: allTrends.length,
    with_videos: withVideos,
    categories: {
      photography: allTrends.filter((t) => t.category === "photography").length,
      videography: allTrends.filter((t) => t.category === "videography").length,
      viral_tips: allTrends.filter((t) => t.category === "viral_tips").length,
      trending: allTrends.filter((t) => t.category === "trending").length,
    },
    timestamp: now,
  });
}
