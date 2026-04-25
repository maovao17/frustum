export const TOOLS = ["DekNek3D", "Meshy", "Tripo", "Spline", "Other"] as const;
export type Tool = (typeof TOOLS)[number];

export const CATEGORIES = [
  "Character", "Architecture", "Game Asset", "Fantasy", "Sci-Fi",
  "Product", "Nature", "Vehicle", "Abstract", "Other",
] as const;

export const TOOL_COLORS: Record<Tool, string> = {
  "DekNek3D": "bg-violet-500/15 text-violet-400 border-violet-500/20",
  "Meshy":    "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
  "Tripo":    "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  "Spline":   "bg-orange-500/15 text-orange-400 border-orange-500/20",
  "Other":    "bg-zinc-500/15 text-zinc-400 border-zinc-500/20",
};

export const mockPosts = [
  {
    id: "1",
    title: "Crystalline Dragon",
    prompt: "A majestic crystalline dragon with translucent glowing wings, iridescent scales reflecting purple and blue light, perched on a jagged mountain peak, low-poly game art style, dramatic rim lighting, 4k render",
    tool: "DekNek3D" as Tool,
    category: "Fantasy",
    image: "https://picsum.photos/seed/dragon3d/600/420",
    upvotes: 247,
    author: { name: "Aryan Mehta", username: "aryan3d", avatar: "https://i.pravatar.cc/40?u=aryan" },
    createdAt: "2026-04-22",
    trending: true,
  },
  {
    id: "2",
    title: "Cyberpunk Street Market",
    prompt: "Neon-lit cyberpunk street market at night, holographic signs in Japanese, rain-slicked pavement reflections, detailed stall structures, atmospheric fog, Blade Runner aesthetic, isometric view",
    tool: "Meshy" as Tool,
    category: "Sci-Fi",
    image: "https://picsum.photos/seed/cyberpunk3d/600/420",
    upvotes: 189,
    author: { name: "Priya Sharma", username: "priya_creates", avatar: "https://i.pravatar.cc/40?u=priya" },
    createdAt: "2026-04-21",
    trending: true,
  },
  {
    id: "3",
    title: "Ancient Ruin Temple",
    prompt: "Overgrown ancient stone temple ruins, moss-covered columns, golden afternoon sunlight filtering through jungle canopy, high detail photorealistic texture, cinematic depth of field",
    tool: "Tripo" as Tool,
    category: "Architecture",
    image: "https://picsum.photos/seed/temple3d/600/420",
    upvotes: 156,
    author: { name: "Ravi Kumar", username: "ravi3dart", avatar: "https://i.pravatar.cc/40?u=ravi" },
    createdAt: "2026-04-20",
    trending: false,
  },
  {
    id: "4",
    title: "Space Station Interior",
    prompt: "Futuristic space station interior corridor, metallic panels with glowing blue trim, astronaut silhouette in distance, lens flare, volumetric lighting, hard surface modeling style",
    tool: "DekNek3D" as Tool,
    category: "Sci-Fi",
    image: "https://picsum.photos/seed/space3d/600/420",
    upvotes: 134,
    author: { name: "Meera Nair", username: "meera3d", avatar: "https://i.pravatar.cc/40?u=meera" },
    createdAt: "2026-04-19",
    trending: false,
  },
  {
    id: "5",
    title: "Kawaii Robot Companion",
    prompt: "Cute chibi robot companion with big round glowing eyes, pastel color scheme, soft rounded body, small antenna with heart, anime game character style, white background, clean topology",
    tool: "Meshy" as Tool,
    category: "Character",
    image: "https://picsum.photos/seed/robot3d/600/420",
    upvotes: 312,
    author: { name: "Yash Patel", username: "yash3d", avatar: "https://i.pravatar.cc/40?u=yash" },
    createdAt: "2026-04-18",
    trending: true,
  },
  {
    id: "6",
    title: "Floating Sky Island",
    prompt: "Lush floating sky island with waterfalls cascading into clouds below, small medieval village on top, warm sunset lighting, stylized fantasy art, birds flying around, Ghibli-inspired atmosphere",
    tool: "Spline" as Tool,
    category: "Fantasy",
    image: "https://picsum.photos/seed/island3d/600/420",
    upvotes: 98,
    author: { name: "Aditi Joshi", username: "aditi_3d", avatar: "https://i.pravatar.cc/40?u=aditi" },
    createdAt: "2026-04-17",
    trending: false,
  },
];

export const mockUser = {
  name: "Aryan Mehta",
  username: "aryan3d",
  avatar: "https://i.pravatar.cc/120?u=aryan",
  bio: "3D artist & prompt engineer. Obsessed with low-poly and sci-fi aesthetics.",
  totalUpvotes: 847,
  posts: mockPosts.filter((p) => p.author.username === "aryan3d"),
};
