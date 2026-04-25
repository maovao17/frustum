"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const router = useRouter();

  const [form, setForm] = useState({ name: "", bio: "", avatar: "" });
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!session) { router.push("/auth/signin"); return; }

    fetch("/api/users/me")
      .then(r => r.json())
      .then(({ user }) => {
        setForm({
          name:   user.name   ?? "",
          bio:    user.bio    ?? "",
          avatar: user.avatar ?? "",
        });
        setPreview(user.avatar ?? "");
      });
  }, [session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    await fetch("/api/users/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    await update({ image: form.avatar, name: form.name });
    setSaved(true);
    setLoading(false);
  };

  if (!session) return null;

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 flex items-center gap-2">
        <Settings className="w-5 h-5 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Profile Settings</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar preview */}
        <div className="flex items-center gap-5">
          <Avatar className="w-20 h-20 border-2 border-primary/30">
            {preview && <AvatarImage src={preview} />}
            <AvatarFallback className="text-2xl bg-primary/20 text-primary font-bold">
              {form.name?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1.5">
            <Label className="text-sm font-medium">Profile Photo URL</Label>
            <Input
              placeholder="https://i.imgur.com/your-photo.jpg"
              value={form.avatar}
              onChange={e => { setForm(f => ({ ...f, avatar: e.target.value })); setPreview(e.target.value.trim()); }}
              className="bg-card border-border focus:border-primary/50"
            />
            <p className="text-xs text-muted-foreground">Paste a direct image link from Imgur, Cloudinary, etc.</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Display Name</Label>
          <Input
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="bg-card border-border focus:border-primary/50"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Bio <span className="text-muted-foreground font-normal">— optional</span></Label>
          <textarea
            rows={3}
            placeholder="3D artist · obsessed with low-poly"
            value={form.bio}
            onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
            className="w-full bg-card border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 resize-none leading-relaxed"
          />
        </div>

        {saved && (
          <p className="text-sm text-green-400 bg-green-400/10 border border-green-400/20 rounded-lg px-3 py-2">
            Profile updated successfully.
          </p>
        )}

        <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 glow-violet-sm font-semibold">
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}
