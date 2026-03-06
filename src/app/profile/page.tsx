"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/lib/LanguageContext";

const ROLES = ["master", "admin", "photo", "makeup", "model", "guest"] as const;
const ROLE_COLORS: Record<string, string> = {
  master: "from-yellow-400 to-amber-500",
  admin: "from-red-400 to-rose-500",
  photo: "from-blue-400 to-cyan-500",
  makeup: "from-pink-400 to-fuchsia-500",
  model: "from-purple-400 to-violet-500",
  guest: "from-gray-400 to-gray-500",
};
const ROLE_BADGE_COLORS: Record<string, string> = {
  master: "bg-yellow-400 shadow-yellow-400/50",
  admin: "bg-red-400 shadow-red-400/50",
  photo: "bg-blue-400 shadow-blue-400/50",
  makeup: "bg-pink-400 shadow-pink-400/50",
  model: "bg-purple-400 shadow-purple-400/50",
  guest: "bg-gray-400 shadow-gray-400/50",
};

interface Profile {
  user_id: string;
  user_name: string;
  user_image: string | null;
  role: string;
  bio: string | null;
  phone: string | null;
  camera_bodies: string[];
  lenses: string[];
  birth_year: number | null;
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const { t } = useLanguage();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    role: "guest", bio: "", phone: "", cameraBodies: [""], lenses: [""], birthYear: "",
  });

  const currentUserId = session?.user
    ? (session.user as Record<string, unknown>).id as string || session.user.name || ""
    : "";

  useEffect(() => {
    if (!currentUserId) { setLoading(false); return; }
    fetch(`/api/profile?userId=${currentUserId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d && d.user_id) {
          setProfile(d);
          setForm({
            role: d.role || "guest",
            bio: d.bio || "",
            phone: d.phone || "",
            cameraBodies: d.camera_bodies?.length ? d.camera_bodies : [""],
            lenses: d.lenses?.length ? d.lenses : [""],
            birthYear: d.birth_year ? String(d.birth_year) : "",
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [currentUserId]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (saving || !currentUserId) return;
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUserId,
          userName: session?.user?.name || "Anonymous",
          userImage: session?.user?.image || null,
          role: form.role,
          bio: form.bio,
          phone: form.phone,
          cameraBodies: form.cameraBodies.filter((b) => b.trim()),
          lenses: form.lenses.filter((l) => l.trim()),
          birthYear: form.birthYear ? parseInt(form.birthYear) : null,
        }),
      });
      const saved = await res.json();
      if (saved?.user_id) setProfile(saved);
    } catch {}
    setSaving(false);
  }

  if (!currentUserId) {
    return (
      <>
        
        <main className="pt-4 pb-16 max-w-2xl mx-auto px-4 text-center">
          <p className="text-[var(--text-secondary)] mt-20">{t.profile.loginRequired}</p>
        </main>
      </>
    );
  }

  return (
    <>
      
      <main className="pt-4 pb-16 max-w-2xl mx-auto px-4">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1">{t.profile.title}</h1>
        <p className="text-sm text-[var(--text-secondary)] mb-8">{t.profile.desc}</p>

        {loading ? (
          <div className="text-center py-20 text-[var(--text-secondary)]">...</div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            {/* User info preview */}
            <div className="p-5 rounded-2xl border border-white/[0.08] bg-[var(--bg-card)] flex items-center gap-4">
              {session?.user?.image ? (
                <img src={session.user.image} alt="" className="w-14 h-14 rounded-full ring-2 ring-white/10" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xl font-bold text-black">
                  {(session?.user?.name || "?").charAt(0)}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{session?.user?.name}</span>
                  {profile?.role && (
                    <span className={`inline-block w-2.5 h-2.5 rounded-full animate-pulse shadow-lg ${ROLE_BADGE_COLORS[profile.role] || ROLE_BADGE_COLORS.guest}`} />
                  )}
                </div>
                <p className="text-xs text-[var(--text-secondary)]">{session?.user?.email}</p>
                {profile?.role && (
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-black bg-gradient-to-r ${ROLE_COLORS[profile.role] || ROLE_COLORS.guest}`}>
                    {t.profile.roles[profile.role as keyof typeof t.profile.roles]}
                  </span>
                )}
              </div>
            </div>

            {/* Role selection */}
            <div>
              <label className="block text-xs text-[var(--text-secondary)] mb-2">{t.profile.roleLabel}</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ROLES.map((role) => (
                  <button key={role} type="button" onClick={() => setForm({ ...form, role })}
                    className={`px-3 py-2.5 rounded-xl text-sm font-medium transition flex items-center gap-2 ${
                      form.role === role
                        ? `bg-gradient-to-r ${ROLE_COLORS[role]} text-black`
                        : "bg-white/[0.04] border border-[var(--border)] text-[var(--text-secondary)] hover:bg-white/[0.06]"
                    }`}>
                    <span className={`w-2 h-2 rounded-full ${form.role === role ? "bg-black/30" : ""} ${ROLE_BADGE_COLORS[role]}`} />
                    {t.profile.roles[role as keyof typeof t.profile.roles]}
                  </button>
                ))}
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-xs text-[var(--text-secondary)] mb-1.5">{t.profile.bioLabel}</label>
              <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} maxLength={500} rows={3}
                className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-[var(--border)] text-sm focus:outline-none focus:border-amber-500/50 transition resize-none" />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs text-[var(--text-secondary)] mb-1.5">{t.profile.phoneLabel}</label>
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-[var(--border)] text-sm focus:outline-none focus:border-amber-500/50 transition" />
            </div>

            {/* Birth year */}
            <div>
              <label className="block text-xs text-[var(--text-secondary)] mb-1.5">{t.profile.birthYearLabel}</label>
              <input type="number" min="1950" max="2015" value={form.birthYear} onChange={(e) => setForm({ ...form, birthYear: e.target.value })} placeholder="1990"
                className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-[var(--border)] text-sm focus:outline-none focus:border-amber-500/50 transition" />
            </div>

            {/* Camera equipment (only for photo role) */}
            {form.role === "photo" && (
              <div className="p-5 rounded-2xl border border-blue-500/20 bg-blue-500/[0.04] space-y-4">
                <h3 className="text-sm font-semibold text-blue-400 flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3"/><path d="M3 9a2 2 0 0 1 2-2h.93a2 2 0 0 0 1.664-.89l.812-1.22A2 2 0 0 1 10.07 4h3.86a2 2 0 0 1 1.664.89l.812 1.22A2 2 0 0 0 18.07 7H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  </svg>
                  {t.profile.equipmentTitle}
                </h3>

                {/* Camera Bodies */}
                <div>
                  <label className="block text-xs text-[var(--text-secondary)] mb-1.5">{t.profile.bodiesLabel}</label>
                  {form.cameraBodies.map((body, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <input type="text" value={body} placeholder={`Body ${i + 1}`}
                        onChange={(e) => { const nb = [...form.cameraBodies]; nb[i] = e.target.value; setForm({ ...form, cameraBodies: nb }); }}
                        className="flex-1 px-3 py-2 rounded-xl bg-white/[0.04] border border-[var(--border)] text-sm focus:outline-none focus:border-blue-500/50 transition" />
                      {form.cameraBodies.length > 1 && (
                        <button type="button" onClick={() => setForm({ ...form, cameraBodies: form.cameraBodies.filter((_, j) => j !== i) })}
                          className="px-2 text-red-400 hover:bg-red-500/10 rounded-lg transition">✕</button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => setForm({ ...form, cameraBodies: [...form.cameraBodies, ""] })}
                    className="text-xs text-blue-400 hover:underline">+ {t.profile.addBody}</button>
                </div>

                {/* Lenses */}
                <div>
                  <label className="block text-xs text-[var(--text-secondary)] mb-1.5">{t.profile.lensesLabel}</label>
                  {form.lenses.map((lens, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <input type="text" value={lens} placeholder={`Lens ${i + 1}`}
                        onChange={(e) => { const nl = [...form.lenses]; nl[i] = e.target.value; setForm({ ...form, lenses: nl }); }}
                        className="flex-1 px-3 py-2 rounded-xl bg-white/[0.04] border border-[var(--border)] text-sm focus:outline-none focus:border-blue-500/50 transition" />
                      {form.lenses.length > 1 && (
                        <button type="button" onClick={() => setForm({ ...form, lenses: form.lenses.filter((_, j) => j !== i) })}
                          className="px-2 text-red-400 hover:bg-red-500/10 rounded-lg transition">✕</button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => setForm({ ...form, lenses: [...form.lenses, ""] })}
                    className="text-xs text-blue-400 hover:underline">+ {t.profile.addLens}</button>
                </div>
              </div>
            )}

            <button type="submit" disabled={saving}
              className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black text-sm font-semibold hover:opacity-90 transition disabled:opacity-50 shadow-lg shadow-orange-500/25">
              {saving ? "..." : t.profile.save}
            </button>
          </form>
        )}
      </main>
    </>
  );
}
