"use client";

import { useRef, useState, useCallback } from "react";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import { ClaudeLogo } from "@/components/claude-logo";
import { EditableText } from "@/components/editable-text";
import { GithubBadge } from "@/components/github-badge";
import { CrafterStationLogo } from "@/components/logos/crafter-station";
import { MoralejaDesignLogo } from "@/components/logos/moraleja-design";
import { KeboLogo } from "@/components/logos/kebo";
import { useCardsStore, CardData } from "@/lib/store";

export default function Home() {
  const captureRef = useRef<HTMLDivElement>(null);
  const { title, subtitle, cards, setTitle, setSubtitle } = useCardsStore();
  const [isSharing, setIsSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  const handleDownload = async () => {
    if (!captureRef.current) return;

    const dataUrl = await toPng(captureRef.current, {
      quality: 1,
      pixelRatio: 3,
      backgroundColor: "#ece6df",
    });

    const link = document.createElement("a");
    link.download = "claude-en-panales.png";
    link.href = dataUrl;
    link.click();
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const res = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, subtitle, cards }),
      });
      const { id } = await res.json();
      const url = `${window.location.origin}/s/${id}`;
      setShareUrl(url);
      await navigator.clipboard.writeText(url);
    } catch (error) {
      console.error("Failed to share:", error);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <>
      <GithubBadge />
      <main className="min-h-screen flex flex-col items-center justify-center p-8 gap-8 relative">
        <div
          ref={captureRef}
          className="relative flex flex-col items-center gap-8 px-14 py-12 bg-background overflow-hidden"
        >
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute left-3 top-0 bottom-0 w-px border-l border-dashed border-muted-foreground/15" />
            <div className="absolute right-3 top-0 bottom-0 w-px border-l border-dashed border-muted-foreground/15" />
            <div className="absolute top-3 left-0 right-0 h-px border-t border-dashed border-muted-foreground/15" />
            <div className="absolute bottom-3 left-0 right-0 h-px border-t border-dashed border-muted-foreground/15" />
          </div>
          <header className="text-center space-y-1.5">
            <EditableText
              value={title}
              onChange={setTitle}
              as="h1"
              className="text-[22px] font-semibold tracking-tight text-foreground justify-center"
              inputClassName="text-[22px] font-semibold tracking-tight text-foreground text-center"
            />
            <EditableText
              value={subtitle}
              onChange={setSubtitle}
              as="p"
              className="text-muted-foreground text-[13px] justify-center"
              inputClassName="text-muted-foreground text-[13px] text-center"
            />
          </header>

          <div className="grid grid-cols-3 gap-4">
            {cards.map((card, index) => (
              <RoleCard key={card.id} card={card} isUploadable={index === 0} />
            ))}
          </div>
        </div>

        <div className="flex gap-3 items-center">
          <Button
            onClick={handleDownload}
            variant="outline"
            className="cursor-pointer transition-all hover:bg-secondary/80"
          >
            <DownloadIcon />
            Download
          </Button>
          <Button
            onClick={handleShare}
            disabled={isSharing}
            className="cursor-pointer bg-claude hover:bg-claude/90 text-white"
          >
            <ShareIcon />
            {isSharing ? "Sharing..." : "Share"}
          </Button>
        </div>

        {shareUrl && (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
            <CheckIcon />
            <span>Link copied!</span>
            <a
              href={shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-green-900"
            >
              {shareUrl}
            </a>
          </div>
        )}

        <footer className="mt-8 flex flex-col items-center gap-4">
          <p className="text-xs text-muted-foreground/60">Made with care by</p>
          <div className="flex items-center gap-6">
            <a
              href="https://crafterstation.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground/40 hover:text-claude transition-colors"
              title="Crafter Station"
            >
              <CrafterStationLogo className="w-6 h-6" />
            </a>
            <a
              href="https://moraleja.co"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground/40 hover:text-claude transition-colors"
              title="Moraleja Design"
            >
              <MoralejaDesignLogo className="w-6 h-6" />
            </a>
            <a
              href="https://kebo.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground/40 hover:text-claude transition-colors"
              title="Kebo"
            >
              <KeboLogo className="w-6 h-6" />
            </a>
          </div>
        </footer>
      </main>
    </>
  );
}

function RoleCard({
  card,
  isUploadable,
}: {
  card: CardData;
  isUploadable: boolean;
}) {
  const [isHovering, setIsHovering] = useState(false);
  const updateLabel = useCardsStore((state) => state.updateLabel);
  const updateImage = useCardsStore((state) => state.updateImage);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        updateImage(card.id, event.target?.result as string);
      };
      reader.readAsDataURL(file);
    },
    [card.id, updateImage]
  );

  const handleRemoveImage = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      updateImage(card.id, null);
    },
    [card.id, updateImage]
  );

  return (
    <div className="relative w-44 h-52 flex flex-col rounded-lg bg-[#f4f0eb] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_2px_8px_rgba(0,0,0,0.02)]">
      {isUploadable && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      )}

      <div
        className={`flex-1 flex items-center justify-center relative ${isUploadable ? "cursor-pointer group" : ""}`}
        onMouseEnter={() => isUploadable && setIsHovering(true)}
        onMouseLeave={() => isUploadable && setIsHovering(false)}
        onClick={() => isUploadable && fileInputRef.current?.click()}
      >
        {isUploadable ? (
          card.image ? (
            <>
              <img
                src={card.image}
                alt={card.label}
                className="w-full h-full object-contain p-4"
              />
              {isHovering && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2 rounded-t-lg transition-opacity duration-200">
                  <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                    <UploadIcon className="w-4 h-4 text-gray-700" />
                  </button>
                  <button
                    onClick={handleRemoveImage}
                    className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                  >
                    <TrashIcon className="w-4 h-4 text-gray-700" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full">
              <div
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-dashed transition-all duration-200 ${
                  isHovering
                    ? "border-claude bg-claude/5"
                    : "border-[#d4cec6] bg-transparent"
                }`}
              >
                <div
                  className={`p-2 rounded-full transition-colors ${isHovering ? "bg-claude/10" : "bg-[#e8e2db]"}`}
                >
                  <UploadIcon
                    className={`w-5 h-5 transition-colors ${isHovering ? "text-claude" : "text-[#9a9590]"}`}
                  />
                </div>
                <span
                  className={`text-[11px] font-medium transition-colors ${isHovering ? "text-claude" : "text-[#9a9590]"}`}
                >
                  Tu foto aquí
                </span>
              </div>
            </div>
          )
        ) : (
          <ClaudeLogo className="w-24 h-auto" />
        )}
      </div>

      <div className="pb-4 flex justify-center">
        <EditableText
          value={card.label}
          onChange={(value) => updateLabel(card.id, value)}
          className="text-[13px] text-[#888] tracking-wide"
          inputClassName="text-[13px] text-[#888] tracking-wide text-center"
        />
      </div>
    </div>
  );
}

function DownloadIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mr-2"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mr-2"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
      <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}
