import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import PostCard from "@/components/PostCard";
import { ArrowUp, Grid3X3 } from "lucide-react";

async function getUserData(username: string) {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/users/${username}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const data = await getUserData(username);
  if (!data) notFound();

  const { user, posts, totalUpvotes } = data;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-10">
        <Avatar className="w-20 h-20 border-2 border-primary/30 glow-violet-sm">
          <AvatarImage src={user.avatar} />
          <AvatarFallback className="text-2xl bg-muted">{user.name?.[0]}</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">{user.name}</h1>
          <p className="text-muted-foreground text-sm">@{user.username}</p>
          {user.bio && <p className="text-sm text-foreground mt-2 max-w-md">{user.bio}</p>}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 text-center">
          <div>
            <p className="text-2xl font-bold text-foreground">{posts.length}</p>
            <p className="text-xs text-muted-foreground">Prompts</p>
          </div>
          <Separator orientation="vertical" className="h-10 bg-border" />
          <div>
            <div className="flex items-center gap-1 justify-center">
              <ArrowUp className="w-4 h-4 text-primary" />
              <p className="text-2xl font-bold text-foreground">{totalUpvotes}</p>
            </div>
            <p className="text-xs text-muted-foreground">Total upvotes</p>
          </div>
        </div>
      </div>

      <Separator className="bg-border mb-8" />

      {/* Posts Grid */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Grid3X3 className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">Submissions</h2>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((post: any) => (
              <PostCard
                key={post._id}
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
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-sm">No prompts submitted yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
