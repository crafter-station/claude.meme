"use client";

import { Share } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface CardData {
  id: string;
  label: string;
  image: string | null;
}

export function ShareView({ share }: { share: Share }) {
  const cards = share.cards as CardData[];

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 gap-8">
      <div className="flex flex-col items-center gap-8 px-14 py-12 bg-background">
        <header className="text-center space-y-1.5">
          <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
            {share.title}
          </h1>
          {share.subtitle && (
            <p className="text-muted-foreground text-[13px]">{share.subtitle}</p>
          )}
        </header>

        <div className="grid grid-cols-3 gap-4">
          {cards.map((card) => (
            <div
              key={card.id}
              className="relative w-44 h-52 flex flex-col rounded-lg bg-[#f4f0eb] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_2px_8px_rgba(0,0,0,0.02)]"
            >
              <div className="flex-1 flex items-center justify-center">
                {card.image ? (
                  <img
                    src={card.image}
                    alt={card.label}
                    className="w-full h-full object-contain p-4"
                  />
                ) : (
                  <img
                    src="/claude-logo.png"
                    alt="Claude"
                    className="w-24 h-auto"
                    draggable={false}
                  />
                )}
              </div>
              <div className="pb-4 text-center">
                <span className="text-[13px] text-[#888] tracking-wide">
                  {card.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Link href="/">
        <Button variant="outline">Crear el tuyo</Button>
      </Link>
    </main>
  );
}
