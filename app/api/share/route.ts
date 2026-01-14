import { db } from "@/lib/db";
import { shares } from "@/lib/db/schema";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { title, subtitle, cards } = body;

  const id = nanoid(10);

  const [share] = await db
    .insert(shares)
    .values({
      id,
      title,
      subtitle,
      cards,
    })
    .returning();

  return NextResponse.json({ id: share.id });
}
