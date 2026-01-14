import { db } from "@/lib/db";
import { posts, insertPostSchema } from "@/lib/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  const result = await db.query.posts.findMany();
  return NextResponse.json(result);
}

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = insertPostSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error }, { status: 400 });

  const [post] = await db.insert(posts).values(parsed.data).returning();
  return NextResponse.json(post);
}
