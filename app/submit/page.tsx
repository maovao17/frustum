"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { TOOLS, CATEGORIES } from "@/lib/mockData";
import { Sparkles } from "lucide-react";

export default function SubmitPage() {
  const router  = useRouter();
  const { data: session } = useSession();

  const [form, setForm]     = useState({ title: "", prompt: "", tool: "", category: "", tags: "", image: "" });
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) { router.push("/auth/signin"); return; }

    setLoading(true);
    setError("");

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Something went wrong");
      setLoading(false);
      return;
    }

    router.push("/");
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-primary uppercase tracking-wide">Add to the gallery</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground">Drop your prompt</h1>
        <p className="text-muted-foreground mt-1 text-sm">Got a render you&apos;re proud of? Show the exact prompt you used. No fluff, just what worked.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">{error}</p>}

        {/* Image URL */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">3D Render Image URL</Label>
          <Input
            placeholder="https://i.imgur.com/your-render.png"
            value={form.image}
            onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
            className="bg-card border-border focus:border-primary/50"
            required
          />
          <p className="text-xs text-muted-foreground">Upload your render to Imgur, Cloudinary, or any image host and paste the direct link here.</p>
        </div>

        {form.image && (
          <div className="relative aspect-video rounded-xl overflow-hidden border border-border bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={form.image} alt="Preview" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = "none")} />
          </div>
        )}

        <Separator className="bg-border" />

        <div className="space-y-2">
          <Label className="text-sm font-medium">Title</Label>
          <Input placeholder="e.g. Crystalline Dragon" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="bg-card border-border focus:border-primary/50" required />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Prompt <span className="text-muted-foreground font-normal">— the exact text you typed</span></Label>
          <textarea
            rows={5}
            placeholder="A majestic crystalline dragon with translucent wings, low-poly game art style..."
            value={form.prompt}
            onChange={e => setForm(f => ({ ...f, prompt: e.target.value }))}
            className="w-full bg-card border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 resize-none font-mono leading-relaxed"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">AI Tool used</Label>
            <select value={form.tool} onChange={e => setForm(f => ({ ...f, tool: e.target.value }))} className="w-full bg-card border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50" required>
              <option value="">Select tool...</option>
              {TOOLS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Category</Label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full bg-card border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50" required>
              <option value="">Select category...</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Tags <span className="text-muted-foreground font-normal">— optional</span></Label>
          <Input placeholder="low-poly, fantasy, dragon, game-ready" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} className="bg-card border-border focus:border-primary/50" />
          <p className="text-xs text-muted-foreground">Comma-separated.</p>
        </div>

        <Button type="submit" disabled={loading} size="lg" className="w-full bg-primary hover:bg-primary/90 glow-violet font-semibold">
          <Sparkles className="w-4 h-4 mr-2" />
          {loading ? "Posting..." : "Post to Frustum"}
        </Button>
      </form>
    </div>
  );
}
