"use client";

import { Share } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import { GithubBadge } from "@/components/github-badge";
import { CrafterStationLogo } from "@/components/logos/crafter-station";
import { MoralejaDesignLogo } from "@/components/logos/moraleja-design";
import { KeboLogo } from "@/components/logos/kebo";
import Link from "next/link";

interface CardData {
  id: string;
  label: string;
  image: string | null;
}

export function ShareView({ share }: { share: Share }) {
  const cards = share.cards as CardData[];

  return (
    <>
      <GithubBadge />
      <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 gap-6 sm:gap-8">
      <div className="relative flex flex-col items-center gap-6 sm:gap-8 px-6 sm:px-14 py-8 sm:py-12 bg-background overflow-hidden scale-[0.85] sm:scale-100 origin-top">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute left-3 top-0 bottom-0 w-px border-l border-dashed border-muted-foreground/30" />
          <div className="absolute right-3 top-0 bottom-0 w-px border-l border-dashed border-muted-foreground/30" />
          <div className="absolute top-3 left-0 right-0 h-px border-t border-dashed border-muted-foreground/30" />
          <div className="absolute bottom-3 left-0 right-0 h-px border-t border-dashed border-muted-foreground/30" />
        </div>

        <header className="text-center space-y-1">
          <h1 className="text-lg sm:text-[22px] font-semibold tracking-tight text-foreground">
            {share.title}
          </h1>
          {share.subtitle && (
            <p className="text-muted-foreground text-xs sm:text-[13px]">{share.subtitle}</p>
          )}
        </header>

        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {cards.map((card) => (
            <div
              key={card.id}
              className="relative w-28 h-36 sm:w-44 sm:h-52 flex flex-col rounded-lg bg-[#f4f0eb] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_2px_8px_rgba(0,0,0,0.02)]"
            >
              <div className="flex-1 flex items-center justify-center">
                {card.image ? (
                  <img
                    src={card.image}
                    alt={card.label}
                    className="w-full h-full object-contain p-2 sm:p-4"
                  />
                ) : (
                  <img
                    src="/claude-logo.png"
                    alt="Claude"
                    className="w-16 sm:w-24 h-auto"
                    draggable={false}
                  />
                )}
              </div>
              <div className="pb-2 sm:pb-4 text-center">
                <span className="text-[10px] sm:text-[13px] text-[#888] tracking-wide">
                  {card.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3 mt-1 sm:mt-2">
          <CrafterStationLogo className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground/30" />
          <MoralejaDesignLogo className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground/30" />
          <KeboLogo className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground/30" />
          <span className="text-[8px] sm:text-[10px] text-muted-foreground/40 ml-1">crafterstation.com</span>
        </div>
      </div>

      <Link href="/">
        <Button variant="outline">Crear el tuyo</Button>
      </Link>
    </main>
    </>
  );
}
