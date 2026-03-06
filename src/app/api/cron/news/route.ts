import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const RSS_FEEDS = [
  { url: "https://vnexpress.net/rss/so-hoa.rss", source: "VnExpress", filter: true },
  { url: "https://thanhnien.vn/rss/cong-nghe.rss", source: "Thanh Nien", filter: true },
  { url: "https://tuoitre.vn/rss/nhip-song-so.rss", source: "Tuoi Tre", filter: true },
  { url: "https://genk.vn/rss/may-anh-camera.rss", source: "Genk", filter: false },
  { url: "https://tinhte.vn/rss", source: "Tinhte", filter: true },
];

const PHOTO_KEYWORDS = [
  "nhiếp ảnh", "chụp ảnh", "máy ảnh", "camera", "ống kính", "lens",
  "canon", "nikon", "sony", "fujifilm", "fuji", "leica", "sigma",
  "mirrorless", "dslr", "photo", "photographer", "photography",
  "lightroom", "photoshop", "raw", "megapixel",
  "chân dung", "phong cảnh", "macro", "flash", "đèn flash",
  "tripod", "gimbal", "filter", "bokeh", "khẩu độ", "iso",
  "tốc độ màn trập", "shutter", "aperture", "exposure",
  "gopro", "dji", "drone", "flycam", "action cam",
];

function isPhotoRelated(title: string, desc: string): boolean {
  const text = `${title} ${desc}`.toLowerCase();
  return PHOTO_KEYWORDS.some(kw => text.includes(kw));
}

interface FeedItem {
  title: string;
  description: string;
  url: string;
  source: string;
  image_url: string | null;
  published_at: string;
}

function extractText(xml: string, tag: string): string {
  const cdataRegex = new RegExp(`<${tag}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*</${tag}>`, "i");
  const cdataMatch = xml.match(cdataRegex);
  if (cdataMatch) return cdataMatch[1].trim();

  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i");
  const match = xml.match(regex);
  return match ? match[1].trim() : "";
}

function extractImage(itemXml: string): string | null {
  const mediaMatch = itemXml.match(/<media:content[^>]+url=["']([^"']+)["']/i);
  if (mediaMatch) return mediaMatch[1];
  const enclosureMatch = itemXml.match(/<enclosure[^>]+url=["']([^"']+)["']/i);
  if (enclosureMatch) return enclosureMatch[1];
  const imgMatch = itemXml.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch) return imgMatch[1];
  const thumbMatch = itemXml.match(/<media:thumbnail[^>]+url=["']([^"']+)["']/i);
  if (thumbMatch) return thumbMatch[1];
  const ogMatch = itemXml.match(/<image>[\s\S]*?<url>([^<]+)<\/url>/i);
  if (ogMatch) return ogMatch[1];
  return null;
}

function stripHtml(html: string): string {
  return html
    .replace(/<!\[CDATA\[|\]\]>/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, " ")
    .trim();
}

function parseRss(xml: string, source: string): FeedItem[] {
  const items: FeedItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];
    const title = stripHtml(extractText(itemXml, "title"));
    const link = extractText(itemXml, "link").replace(/<!\[CDATA\[|\]\]>/g, "").trim();
    const desc = stripHtml(extractText(itemXml, "description")).slice(0, 500);
    const pubDate = extractText(itemXml, "pubDate");
    const image = extractImage(itemXml);

    if (title && link) {
      items.push({
        title,
        description: desc,
        url: link,
        source,
        image_url: image,
        published_at: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
      });
    }
  }

  return items;
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let totalInserted = 0;
  const errors: string[] = [];

  for (const feed of RSS_FEEDS) {
    try {
      const res = await fetch(feed.url, {
        headers: { "User-Agent": "PhotoMaster-Academy-Bot/1.0" },
        signal: AbortSignal.timeout(10000),
      });

      if (!res.ok) {
        errors.push(`${feed.source}: HTTP ${res.status}`);
        continue;
      }

      const xml = await res.text();
      let items = parseRss(xml, feed.source);

      // Filter by photography keywords for general feeds
      if (feed.filter) {
        items = items.filter(item => isPhotoRelated(item.title, item.description));
      }

      if (items.length === 0) continue;

      const { data, error } = await supabase
        .from("news")
        .upsert(items, { onConflict: "url", ignoreDuplicates: true })
        .select();

      if (error) {
        errors.push(`${feed.source}: ${error.message}`);
      } else {
        totalInserted += data?.length || 0;
      }
    } catch (e) {
      errors.push(`${feed.source}: ${e instanceof Error ? e.message : "Unknown error"}`);
    }
  }

  return NextResponse.json({
    success: true,
    inserted: totalInserted,
    errors: errors.length > 0 ? errors : undefined,
    timestamp: new Date().toISOString(),
  });
}
