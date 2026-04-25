"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostCard from "@/components/PostCard";
import { TOOLS, CATEGORIES } from "@/lib/mockData";
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";

export default function HomePage() {
  const [posts, setPosts]       = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [sort, setSort]         = useState("trending");
  const [tool, setTool]         = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ sort });
    if (tool)     params.set("tool", tool);
    if (category) params.set("category", category);

    fetch(`/api/posts?${params}`)
      .then(r => r.json())
      .then(data => { setPosts(data.posts ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [sort, tool, category]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero */}
      <section className="relative py-20 text-center overflow-hidden dot-grid">
        <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
          <div className="w-[700px] h-[400px] bg-violet-600/15 rounded-full blur-3xl animate-float" />
        </div>
        <div className="absolute top-10 right-10 -z-10 w-48 h-48 bg-fuchsia-600/10 rounded-full blur-3xl pointer-events-none animate-float delay-200" />
        <div className="absolute bottom-10 left-10 -z-10 w-40 h-40 bg-violet-400/10 rounded-full blur-2xl pointer-events-none animate-float delay-400" />

        <div className="flex items-center justify-center gap-2 mb-5 animate-fade-in-up">
          <div className="bg-primary/10 border border-primary/20 text-primary text-xs font-semibold px-3 py-1.5 rounded-full">
            Built for the 3D AI community
          </div>
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-5 animate-fade-in-up delay-100">
          Great 3D starts with a <span className="gradient-text">great prompt.</span>
        </h1>

        <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed animate-fade-in-up delay-200">
          Real prompts. Real renders. Stop guessing what to type — see what actually works, voted by people who've been in the tool.
        </p>

        <div className="flex items-center justify-center gap-3 animate-fade-in-up delay-300">
          <Link href="/submit">
            <Button size="lg" className="bg-primary hover:bg-primary/90 glow-violet font-semibold px-6">
              Share a prompt <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
          <Link href="#gallery">
            <Button size="lg" variant="outline" className="border-border hover:border-primary/50">
              See what&apos;s working
            </Button>
          </Link>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="pb-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <Tabs value={sort} onValueChange={setSort}>
            <TabsList className="bg-muted/50 border border-border">
              <TabsTrigger value="trending" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-sm">Trending</TabsTrigger>
              <TabsTrigger value="new"      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-sm">New</TabsTrigger>
              <TabsTrigger value="top"      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-sm">Top All Time</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2">
            <select value={tool} onChange={e => setTool(e.target.value)} className="text-sm bg-card border border-border rounded-lg px-3 py-1.5 text-muted-foreground focus:outline-none focus:border-primary/50 cursor-pointer">
              <option value="">All Tools</option>
              {TOOLS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <select value={category} onChange={e => setCategory(e.target.value)} className="text-sm bg-card border border-border rounded-lg px-3 py-1.5 text-muted-foreground focus:outline-none focus:border-primary/50 cursor-pointer">
              <option value="">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground">
            <p className="text-lg font-medium mb-2">Nothing here yet.</p>
            <p className="text-sm mb-6">You could be the first one. Drop a prompt that actually worked.</p>
            <Link href="/submit">
              <Button className="bg-primary hover:bg-primary/90">Go first</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {posts.map((post, i) => (
                <div
                  key={post._id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <PostCard
                    id={post._id}
                    title={post.title}
                    prompt={post.prompt}
                    tool={post.tool}
                    category={post.category}
                    image={post.image}
                    upvotes={post.upvotes}
                    trending={post.upvotes > 50}
                    author={{
                      name:     post.author?.name     ?? "Unknown",
                      username: post.author?.username ?? "unknown",
                      avatar:   post.author?.avatar   ?? "",
                    }}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
