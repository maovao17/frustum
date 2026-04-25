"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UpvoteButton({ postId, initial, initialUpvoted = false }: { postId: string; initial: number; initialUpvoted?: boolean }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [upvotes, setUpvotes] = useState(initial);
  const [upvoted, setUpvoted] = useState(initialUpvoted);
  const [loading, setLoading] = useState(false);

  const handleUpvote = async () => {
    if (!session) { router.push("/auth/signin"); return; }
    setLoading(true);

    const res = await fetch(`/api/posts/${postId}/upvote`, { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      setUpvotes(data.upvotes);
      setUpvoted(data.upvoted);
    }
    setLoading(false);
  };

  return (
    <Button
      size="lg"
      onClick={handleUpvote}
      disabled={loading}
      className={`w-full font-bold text-base transition-all duration-200 ${
        upvoted
          ? "bg-primary text-white border-primary glow-violet"
          : "bg-primary/15 hover:bg-primary text-primary hover:text-white border border-primary/40 hover:border-primary glow-violet-sm"
      }`}
    >
      <ArrowUp className="w-5 h-5 mr-2" />
      {upvoted ? "Upvoted" : "Upvote"} · {upvotes}
    </Button>
  );
}
