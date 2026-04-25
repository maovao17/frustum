import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Copy, Calendar, Flame } from "lucide-react";
import { TOOL_COLORS } from "@/lib/mockData";
import UpvoteButton from "@/components/UpvoteButton";

async function getPost(id: string) {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/posts/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json(); // returns { post, upvoted }
}

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getPost(id);
  if (!data) notFound();
  const { post, upvoted } = data;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to gallery
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Image */}
        <div className="lg:col-span-3">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-border bg-muted glow-violet">
            <Image src={post.image} alt={post.title} fill className="object-cover" unoptimized />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            {post.upvotes > 50 && (
              <div className="absolute top-3 left-3 flex items-center gap-1 bg-amber-400 text-amber-950 text-xs font-bold px-2.5 py-1 rounded-full">
                <Flame className="w-3 h-3" /> Trending
              </div>
            )}
            <div className="absolute bottom-4 left-4 right-4">
              <h1 className="text-2xl font-bold text-white drop-shadow">{post.title}</h1>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${TOOL_COLORS[post.tool as keyof typeof TOOL_COLORS] ?? TOOL_COLORS["Other"]}`}>
              {post.tool}
            </span>
            <Badge variant="outline" className="border-border text-muted-foreground">{post.category}</Badge>
          </div>

          <UpvoteButton postId={post._id} initial={post.upvotes} initialUpvoted={upvoted} />

          <Separator className="bg-border" />

          {/* Prompt */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">Prompt</p>
              <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors px-2 py-1 rounded hover:bg-primary/10">
                <Copy className="w-3 h-3" /> Copy
              </button>
            </div>
            <div className="relative bg-muted/40 border border-border rounded-xl p-4 hover:border-primary/30 transition-colors">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary rounded-l-xl" />
              <p className="text-sm text-muted-foreground leading-relaxed font-mono pl-2">{post.prompt}</p>
            </div>
          </div>

          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map((tag: string) => (
                <span key={tag} className="text-xs bg-muted/50 border border-border text-muted-foreground px-2 py-0.5 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <Separator className="bg-border" />

          {/* Author */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Posted by</p>
            <Link href={`/u/${post.author?.username}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors group">
              <Avatar className="w-10 h-10 border border-border">
                <AvatarImage src={post.author?.avatar} />
                <AvatarFallback className="bg-primary/20 text-primary text-sm font-bold">{post.author?.name?.[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{post.author?.name}</p>
                <p className="text-xs text-muted-foreground">@{post.author?.username}</p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground pl-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{new Date(post.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
