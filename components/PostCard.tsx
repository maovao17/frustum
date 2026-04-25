import Link from "next/link";
import { ArrowUp, Flame } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TOOL_COLORS, type Tool } from "@/lib/mockData";

interface PostCardProps {
  id: string;
  title: string;
  prompt: string;
  tool: Tool;
  category: string;
  image: string;
  upvotes: number;
  author: { name: string; username: string; avatar: string };
  trending?: boolean;
}

export default function PostCard({
  id, title, prompt, tool, category, image, upvotes, author, trending,
}: PostCardProps) {
  return (
    <Link href={`/post/${id}`}>
      <div className="group bg-card border border-border rounded-2xl overflow-hidden card-hover cursor-pointer">

        {/* Image — title overlaid on gradient */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          {/* Dark gradient overlay — always present, stronger on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/90 transition-all duration-300" />

          {/* Top badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <span className={`text-[11px] px-2.5 py-0.5 rounded-full border font-semibold backdrop-blur-sm ${TOOL_COLORS[tool]}`}>
              {tool}
            </span>
            {trending && (
              <div className="flex items-center gap-1 bg-amber-400 text-amber-950 text-[11px] font-bold px-2 py-0.5 rounded-full shadow-lg">
                <Flame className="w-2.5 h-2.5" />
                Hot
              </div>
            )}
          </div>

          {/* Bottom — title + upvote overlaid on image */}
          <div className="absolute bottom-0 left-0 right-0 p-3.5">
            <h3 className="font-bold text-sm text-white leading-snug mb-1.5 line-clamp-1 drop-shadow">
              {title}
            </h3>
            <p className="text-[11px] text-white/60 line-clamp-1 leading-relaxed mb-2">
              {category}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Avatar className="w-5 h-5 border border-white/20">
                  <AvatarImage src={author.avatar} />
                  <AvatarFallback className="text-[9px] bg-primary/80 text-white">{author.name[0]}</AvatarFallback>
                </Avatar>
                <span className="text-[11px] text-white/70">{author.name}</span>
              </div>
              <div className="flex items-center gap-1 bg-white/10 hover:bg-primary/80 backdrop-blur-sm text-white px-2 py-0.5 rounded-full transition-colors border border-white/20">
                <ArrowUp className="w-3 h-3" />
                <span className="text-[11px] font-semibold">{upvotes}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Prompt preview strip below the image */}
        <div className="px-3.5 py-2.5 border-t border-border/50">
          <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed font-mono">
            {prompt}
          </p>
        </div>
      </div>
    </Link>
  );
}
