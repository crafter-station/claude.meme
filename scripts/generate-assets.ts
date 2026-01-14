import sharp from "sharp";
import { writeFileSync } from "fs";
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

const crafterStationPath = `M116.419 16.3268C109.59 11.5679 97.9222 5.96914 90.2388 3.72965C72.8798 -1.58913 59.1794 1.40491 50.114 4.56947C32.4704 10.7281 21.3721 18.8462 11.412 33.6828C-4.23949 56.6375 -1.96292 93.869 17.1035 114.864C21.3721 119.903 23.6487 119.063 40.1539 107.026C40.723 106.466 38.4465 102.827 35.0316 98.6278C27.3481 89.11 22.7949 71.754 25.0715 61.9563C32.4704 31.1634 70.3187 14.6472 94.7919 31.4433C100.199 35.0825 117.273 50.199 132.64 65.0356C155.691 86.8706 162.52 91.9094 168.212 91.3496C173.903 90.7897 175.895 88.8301 176.464 82.6715C177.318 75.9531 174.757 72.034 161.667 60.2767C152.845 52.1585 145.731 44.8802 145.731 43.4805C145.731 42.3608 151.707 37.6019 159.105 33.1229C206.914 3.1698 258.421 62.7961 218.581 101.987C213.459 107.026 204.353 112.345 198.377 114.024C191.547 115.704 159.959 117.104 120.688 117.104C47.2683 117.104 43.2842 117.943 23.9332 135.02C-0.824636 157.134 -6.51609 194.926 10.8429 222.359C33.3241 258.191 81.7016 267.149 115.85 241.675L128.372 232.157L142.885 241.675C166.504 257.351 185.571 260.431 208.621 252.872C254.722 237.476 271.796 179.809 241.916 141.178C238.501 136.979 236.794 136.699 232.241 138.939C218.297 146.777 218.581 146.217 226.834 163.013C233.094 175.89 234.233 180.929 232.81 190.727C228.826 215.361 210.044 231.877 186.14 231.877C167.643 231.877 161.667 228.238 127.518 195.486C109.59 178.689 93.0845 164.693 90.8079 164.693C86.5393 164.693 77.433 173.371 77.433 177.57C77.433 178.689 85.1165 187.647 94.7919 197.165L112.151 214.241L101.906 222.08C65.7655 249.233 14.2578 216.761 26.2098 174.211C29.9093 161.333 42.9996 147.057 55.5209 142.578C60.3586 140.618 90.2388 139.498 130.648 139.498C204.922 139.498 213.744 138.099 230.818 123.542C281.757 80.9919 252.161 0.930299 185.571 1.21023C166.22 1.21023 155.691 5.12933 137.762 18.2863L128.656 25.0048L116.419 16.3268Z`;

const keboPath1 = `M186.341 135.743L186.274 135.659L186.206 135.726L167.398 134.951L27.3013 129.132C12.4371 128.508 0.0166016 137.919 0.0166016 150.163V183.774C0.0166016 196.017 12.4371 205.411 27.3013 204.77L117.329 200.908L37.2107 276.732C26.9811 286.412 26.9811 300.038 37.2107 306.818L64.1246 324.661C73.5284 330.901 88.342 328.017 97.2234 318.556L167.382 243.761V312.603C167.382 322.62 175.724 328.928 185.768 326.752L211.991 321.035C221.091 319.062 228.288 310.022 228.288 300.797V154.143C228.288 144.935 221.091 137.16 211.991 136.772L186.341 135.71V135.743Z`;
const keboPath2 = `M205.856 196.878L205.924 196.945L205.991 196.861L223.788 196.119L316.411 192.274C323.438 191.987 329 185.173 329 177.062V154.783C329 146.672 323.421 139.858 316.411 139.555L263.695 137.295L311.49 87.949C316.546 82.7209 316.546 73.243 311.49 66.5815L297.165 47.7437C291.789 40.6606 282.874 38.9404 277.245 44.0672L223.771 92.8903V27.5736C223.771 18.062 216.103 8.68526 206.413 6.57719L178.42 0.472195C167.685 -1.87199 158.753 4.60403 158.753 14.9758V180.064C158.753 190.435 167.685 198.48 178.42 198.024L205.856 196.878Z`;

const moralejaPath = `M125.1,94.2c1.7,2,3.9,3.6,6,5.1,10.6,7.8,23.6,14.9,33.6,23.2,2,1.6,6.8,5.7,4.1,8.3s-7.1,1.2-9.8,1.1c-14.7-1-31.3-2.8-45.9-5.1-4.2-.7-5.1-2.7-8.7.9-5.5,5.5-11.9,14.4-16.9,20.7-4.1,5.3-8.8,13.2-13.1,17.7-2,2.1-3.4,2.1-4.7-.6-1.1-12-1.9-24-3.1-36-.6-5.5-1-11.2-2.2-16.6-.9-.7-10.4,3.1-12.2,3.7-2.5.8-5.1,1.3-7.6,2-7.7,2.3-16.9,6-24.7,7.4-3.2.6-6.5-.3-4.4-4.1,1.7-3.1,12.7-11.9,16-14.8,8.9-7.7,18.3-15.1,27.4-22.6l.8-1.1c0-.8-2.9-4.3-3.6-5.2-8.8-11.1-19.2-22-27.2-33.8-1.3-1.9-5.1-6.5-1.6-7.8,2.2-.9,6.5,1.4,8.7,2.3,9.8,4.3,19,10.1,28.6,15,4.1,2.1,11.2,6,15.3,7.3s.7.3,1.2,0c.5-2.2,1.3-4.4,2-6.5,4-10.9,7.8-22.6,12.2-33.2.8-1.9,1.8-6.3,4.8-5.2,1.8.7,2.8,7.1,4.1,8.8l10.4,36.9c7.8-.8,15.5-3,23.2-4.3,5.9-1,12.6-2.1,18.5-2.5,19.7-1.4,6.1,9.6-.9,15.8-8.5,7.5-18.9,15.3-28.1,21.9s-1.3.9-2.1,1.1Z`;

async function generateOG(width: number, height: number, filename: string) {
  const cardWidth = 120;
  const cardHeight = 150;
  const cardGap = 16;
  const totalCardsWidth = cardWidth * 3 + cardGap * 2;
  const cardsStartX = (width - totalCardsWidth) / 2;
  const cardsStartY = (height - cardHeight) / 2 + 30;
  
  const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="cardShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="1" stdDeviation="2" flood-opacity="0.04"/>
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-opacity="0.02"/>
    </filter>
    <linearGradient id="claudeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${BRAND.claude}"/>
      <stop offset="100%" stop-color="#b5684a"/>
    </linearGradient>
  </defs>
  
  <rect width="100%" height="100%" fill="${BRAND.background}"/>
  
  <text x="${width / 2}" y="${cardsStartY - 50}" 
        font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" 
        font-size="32" 
        font-weight="600" 
        fill="${BRAND.foreground}" 
        text-anchor="middle"
        letter-spacing="-0.5">Claude en Panales</text>
  <text x="${width / 2}" y="${cardsStartY - 22}" 
        font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" 
        font-size="14" 
        fill="${BRAND.muted}" 
        text-anchor="middle">Comparte tu equipo Claude</text>
  
  <g filter="url(#cardShadow)">
    <rect x="${cardsStartX}" y="${cardsStartY}" width="${cardWidth}" height="${cardHeight}" rx="8" fill="${BRAND.card}"/>
    <rect x="${cardsStartX}" y="${cardsStartY}" width="${cardWidth}" height="${cardHeight}" rx="8" fill="none" stroke="${BRAND.cardBorder}" stroke-width="1"/>
    <g transform="translate(${cardsStartX + 34}, ${cardsStartY + 35}) scale(0.16)">
      <path d="${crafterStationPath}" fill="${BRAND.mutedLight}"/>
    </g>
    <text x="${cardsStartX + cardWidth / 2}" y="${cardsStartY + cardHeight - 20}" 
          font-family="system-ui, sans-serif" font-size="11" fill="${BRAND.muted}" text-anchor="middle">TU</text>
  </g>
  
  <g filter="url(#cardShadow)">
    <rect x="${cardsStartX + cardWidth + cardGap}" y="${cardsStartY}" width="${cardWidth}" height="${cardHeight}" rx="8" fill="${BRAND.card}"/>
    <rect x="${cardsStartX + cardWidth + cardGap}" y="${cardsStartY}" width="${cardWidth}" height="${cardHeight}" rx="8" fill="none" stroke="${BRAND.cardBorder}" stroke-width="1"/>
    <g transform="translate(${cardsStartX + cardWidth + cardGap + 35}, ${cardsStartY + 38}) scale(0.14)">
      <path d="${moralejaPath}" fill="${BRAND.claude}"/>
    </g>
    <text x="${cardsStartX + cardWidth + cardGap + cardWidth / 2}" y="${cardsStartY + cardHeight - 20}" 
          font-family="system-ui, sans-serif" font-size="11" fill="${BRAND.muted}" text-anchor="middle">CLAUDE</text>
  </g>
  
  <g filter="url(#cardShadow)">
    <rect x="${cardsStartX + (cardWidth + cardGap) * 2}" y="${cardsStartY}" width="${cardWidth}" height="${cardHeight}" rx="8" fill="${BRAND.card}"/>
    <rect x="${cardsStartX + (cardWidth + cardGap) * 2}" y="${cardsStartY}" width="${cardWidth}" height="${cardHeight}" rx="8" fill="none" stroke="${BRAND.cardBorder}" stroke-width="1"/>
    <g transform="translate(${cardsStartX + (cardWidth + cardGap) * 2 + 38}, ${cardsStartY + 40}) scale(0.15)">
      <path d="${keboPath1}" fill="${BRAND.mutedLight}"/>
      <path d="${keboPath2}" fill="${BRAND.mutedLight}" opacity="0.5"/>
    </g>
    <text x="${cardsStartX + (cardWidth + cardGap) * 2 + cardWidth / 2}" y="${cardsStartY + cardHeight - 20}" 
          font-family="system-ui, sans-serif" font-size="11" fill="${BRAND.muted}" text-anchor="middle">MODELO</text>
  </g>
  
  <g transform="translate(${width / 2 - 55}, ${cardsStartY + cardHeight + 40})">
    <rect x="0" y="0" width="110" height="32" rx="6" fill="${BRAND.claude}"/>
    <text x="55" y="21" font-family="system-ui, sans-serif" font-size="12" font-weight="500" fill="white" text-anchor="middle">Compartir</text>
  </g>
</svg>
`;

  await sharp(Buffer.from(svg)).png().toFile(path.join("public", filename));
  console.log(`Generated ${filename}`);
}

async function generateFavicon() {
  const size = 32;

  const svg = `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="${BRAND.background}" rx="6"/>
  <g transform="translate(4, 4) scale(0.13)">
    <path d="${moralejaPath}" fill="${BRAND.claude}"/>
  </g>
</svg>
`;

  const favicon32 = await sharp(Buffer.from(svg)).png().toBuffer();
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
  
  const svg = `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="${BRAND.background}"/>
  <g transform="translate(30, 25) scale(0.65)">
    <path d="${moralejaPath}" fill="${BRAND.claude}"/>
  </g>
</svg>
`;

  await sharp(Buffer.from(svg)).png().toFile(path.join("public", "apple-touch-icon.png"));
  console.log("Generated apple-touch-icon.png");
}

async function generateClaudeLogo() {
  const size = 200;
  
  const svg = `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(10, 5) scale(1.0)">
    <path d="${moralejaPath}" fill="${BRAND.claude}"/>
  </g>
</svg>
`;

  await sharp(Buffer.from(svg)).png().toFile(path.join("public", "claude-logo.png"));
  console.log("Generated claude-logo.png");
}

async function main() {
  console.log("Generating brand assets for Claude en Panales...\n");

  await generateOG(1200, 630, "og.png");
  await generateOG(1200, 600, "og-twitter.png");
  await generateFavicon();
  await generateAppleIcon();
  await generateClaudeLogo();

  console.log("\nDone!");
}

main().catch(console.error);
