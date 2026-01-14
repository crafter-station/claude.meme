import sharp from "sharp";
import { writeFileSync, readFileSync } from "fs";
import path from "path";

const BRAND = {
  background: "#ece6df",
  card: "#f6f2ed",
  cardBorder: "#e4ded7",
  claude: "#c4754b",
  foreground: "#1a1a1a",
  muted: "#7a7a7a",
  mutedLight: "#9a9590",
};

const claudeLogoPath = path.join("public", "claude-logo.png");

async function generateOG(width: number, height: number, filename: string) {
  const logoSize = 120;
  const logoBuffer = await sharp(claudeLogoPath)
    .resize(logoSize, logoSize, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  const cardWidth = 120;
  const cardHeight = 150;
  const cardGap = 16;
  const totalCardsWidth = cardWidth * 3 + cardGap * 2;
  const cardsStartX = (width - totalCardsWidth) / 2;
  const cardsStartY = (height - cardHeight) / 2 + 20;

  const backgroundSvg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="cardShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="1" stdDeviation="2" flood-opacity="0.04"/>
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-opacity="0.02"/>
    </filter>
  </defs>
  
  <rect width="100%" height="100%" fill="${BRAND.background}"/>
  
  <!-- Dotted lines -->
  <line x1="20" y1="0" x2="20" y2="${height}" stroke="${BRAND.muted}" stroke-width="1" stroke-dasharray="4,4" opacity="0.15"/>
  <line x1="${width - 20}" y1="0" x2="${width - 20}" y2="${height}" stroke="${BRAND.muted}" stroke-width="1" stroke-dasharray="4,4" opacity="0.15"/>
  <line x1="0" y1="20" x2="${width}" y2="20" stroke="${BRAND.muted}" stroke-width="1" stroke-dasharray="4,4" opacity="0.15"/>
  <line x1="0" y1="${height - 20}" x2="${width}" y2="${height - 20}" stroke="${BRAND.muted}" stroke-width="1" stroke-dasharray="4,4" opacity="0.15"/>
  
  <text x="${width / 2}" y="${cardsStartY - 45}" 
        font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" 
        font-size="32" 
        font-weight="600" 
        fill="${BRAND.foreground}" 
        text-anchor="middle"
        letter-spacing="-0.5">Claude en Panales</text>
  <text x="${width / 2}" y="${cardsStartY - 18}" 
        font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" 
        font-size="14" 
        fill="${BRAND.muted}" 
        text-anchor="middle">Comparte tu equipo Claude</text>
  
  <!-- Card 1 -->
  <g filter="url(#cardShadow)">
    <rect x="${cardsStartX}" y="${cardsStartY}" width="${cardWidth}" height="${cardHeight}" rx="8" fill="${BRAND.card}"/>
    <rect x="${cardsStartX}" y="${cardsStartY}" width="${cardWidth}" height="${cardHeight}" rx="8" fill="none" stroke="${BRAND.cardBorder}" stroke-width="1"/>
    <text x="${cardsStartX + cardWidth / 2}" y="${cardsStartY + cardHeight / 2 + 5}" 
          font-family="system-ui, sans-serif" font-size="28" fill="${BRAND.mutedLight}" text-anchor="middle" opacity="0.4">?</text>
    <text x="${cardsStartX + cardWidth / 2}" y="${cardsStartY + cardHeight - 20}" 
          font-family="system-ui, sans-serif" font-size="11" fill="${BRAND.muted}" text-anchor="middle">TU</text>
  </g>
  
  <!-- Card 2 (Claude logo will be composited here) -->
  <g filter="url(#cardShadow)">
    <rect x="${cardsStartX + cardWidth + cardGap}" y="${cardsStartY}" width="${cardWidth}" height="${cardHeight}" rx="8" fill="${BRAND.card}"/>
    <rect x="${cardsStartX + cardWidth + cardGap}" y="${cardsStartY}" width="${cardWidth}" height="${cardHeight}" rx="8" fill="none" stroke="${BRAND.cardBorder}" stroke-width="1"/>
    <text x="${cardsStartX + cardWidth + cardGap + cardWidth / 2}" y="${cardsStartY + cardHeight - 20}" 
          font-family="system-ui, sans-serif" font-size="11" fill="${BRAND.muted}" text-anchor="middle">CLAUDE</text>
  </g>
  
  <!-- Card 3 -->
  <g filter="url(#cardShadow)">
    <rect x="${cardsStartX + (cardWidth + cardGap) * 2}" y="${cardsStartY}" width="${cardWidth}" height="${cardHeight}" rx="8" fill="${BRAND.card}"/>
    <rect x="${cardsStartX + (cardWidth + cardGap) * 2}" y="${cardsStartY}" width="${cardWidth}" height="${cardHeight}" rx="8" fill="none" stroke="${BRAND.cardBorder}" stroke-width="1"/>
    <text x="${cardsStartX + (cardWidth + cardGap) * 2 + cardWidth / 2}" y="${cardsStartY + cardHeight / 2 + 5}" 
          font-family="system-ui, sans-serif" font-size="28" fill="${BRAND.mutedLight}" text-anchor="middle" opacity="0.4">?</text>
    <text x="${cardsStartX + (cardWidth + cardGap) * 2 + cardWidth / 2}" y="${cardsStartY + cardHeight - 20}" 
          font-family="system-ui, sans-serif" font-size="11" fill="${BRAND.muted}" text-anchor="middle">MODELO</text>
  </g>
  
  <text x="${width / 2}" y="${cardsStartY + cardHeight + 50}" 
        font-family="system-ui, sans-serif" font-size="10" fill="${BRAND.muted}" text-anchor="middle" opacity="0.4">crafterstation.com</text>
</svg>
`;

  const logoX = Math.round(cardsStartX + cardWidth + cardGap + (cardWidth - 70) / 2);
  const logoY = Math.round(cardsStartY + 15);

  const smallLogo = await sharp(claudeLogoPath)
    .resize(70, 70, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  await sharp(Buffer.from(backgroundSvg))
    .composite([
      {
        input: smallLogo,
        left: logoX,
        top: logoY,
      },
    ])
    .png()
    .toFile(path.join("public", filename));

  console.log(`Generated ${filename}`);
}

async function generateFavicon() {
  const size = 32;
  const padding = 4;
  const logoSize = size - padding * 2;

  const background = await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 236, g: 230, b: 223, alpha: 1 },
    },
  })
    .png()
    .toBuffer();

  const roundedMask = Buffer.from(`
    <svg width="${size}" height="${size}">
      <rect width="${size}" height="${size}" rx="6" ry="6" fill="white"/>
</svg>
  `);

  const logoBuffer = await sharp(claudeLogoPath)
    .resize(logoSize, logoSize, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  const favicon32 = await sharp(background)
    .composite([
      {
        input: roundedMask,
        blend: "dest-in",
      },
      {
        input: logoBuffer,
        left: padding,
        top: padding,
      },
    ])
    .png()
    .toBuffer();

  await sharp(favicon32).toFile(path.join("public", "favicon.png"));

  const favicon16 = await sharp(favicon32).resize(16, 16).toBuffer();
  const favicon48 = await sharp(favicon32).resize(48, 48).toBuffer();

  const { default: pngToIco } = await import("png-to-ico");
  const ico = await pngToIco([favicon16, favicon32, favicon48]);
  writeFileSync(path.join("public", "favicon.ico"), ico);

  console.log("Generated favicon.ico and favicon.png");
}

async function generateAppleIcon() {
  const size = 180;
  const padding = 30;
  const logoSize = size - padding * 2;

  const background = await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 236, g: 230, b: 223, alpha: 1 },
    },
  })
    .png()
    .toBuffer();

  const logoBuffer = await sharp(claudeLogoPath)
    .resize(logoSize, logoSize, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  await sharp(background)
    .composite([
      {
        input: logoBuffer,
        left: padding,
        top: padding,
      },
    ])
    .png()
    .toFile(path.join("public", "apple-touch-icon.png"));

  console.log("Generated apple-touch-icon.png");
}

async function main() {
  console.log("Generating brand assets for Claude en Panales...\n");

  await generateOG(1200, 630, "og.png");
  await generateOG(1200, 600, "og-twitter.png");
  await generateFavicon();
  await generateAppleIcon();

  console.log("\nDone!");
}

main().catch(console.error);
