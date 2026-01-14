import { db } from "@/lib/db";
import { shares } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ShareView } from "./share-view";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const share = await db.query.shares.findFirst({
    where: eq(shares.id, id),
  });

  if (!share) {
    return { title: "Not Found" };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  return {
    title: share.title,
    description: share.subtitle || "Claude en pañales",
    openGraph: {
      title: share.title,
      description: share.subtitle || "Claude en pañales",
      images: [
        {
          url: `${baseUrl}/s/${id}/og`,
          width: 1200,
          height: 630,
          alt: share.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: share.title,
      description: share.subtitle || "Claude en pañales",
      images: [`${baseUrl}/s/${id}/og`],
    },
  };
}

export default async function SharePage({ params }: Props) {
  const { id } = await params;

  const share = await db.query.shares.findFirst({
    where: eq(shares.id, id),
  });

  if (!share) {
    notFound();
  }

  return <ShareView share={share} />;
}
