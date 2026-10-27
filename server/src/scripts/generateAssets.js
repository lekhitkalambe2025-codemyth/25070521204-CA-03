import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const targetDir = path.resolve(__dirname, '../../../client/public/images');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const createProductSVG = ({ name, category, subtitle, colorPrimary, colorAccent, iconShape, badgeText }) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="40%" r="65%">
      <stop offset="0%" stop-color="#FCFAF6" />
      <stop offset="60%" stop-color="#F2EDE4" />
      <stop offset="100%" stop-color="#E5DEC9" />
    </radialGradient>
    <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${colorPrimary}" />
      <stop offset="100%" stop-color="#141815" />
    </linearGradient>
    <linearGradient id="bronzeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#B68D40" />
      <stop offset="50%" stop-color="#E2C98F" />
      <stop offset="100%" stop-color="#9E7430" />
    </linearGradient>
    <filter id="dropShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="18" stdDeviation="16" flood-color="#000" flood-opacity="0.16" />
    </filter>
  </defs>

  <!-- Background -->
  <rect width="600" height="600" fill="url(#bgGrad)" />

  <!-- Studio Ambient Lighting Circles -->
  <circle cx="300" cy="270" r="210" fill="#FFFFFF" opacity="0.45" filter="blur(30px)" />
  <ellipse cx="300" cy="510" rx="170" ry="24" fill="#000000" opacity="0.14" filter="blur(10px)" />

  <!-- Category Badge -->
  <rect x="40" y="40" width="110" height="30" rx="15" fill="#4F6D48" />
  <text x="95" y="60" font-family="'Outfit', 'Inter', sans-serif" font-size="12" font-weight="600" fill="#FFFFFF" text-anchor="middle" letter-spacing="1.5">${category.toUpperCase()}</text>

  <!-- Product Container / Illustration -->
  <g filter="url(#dropShadow)">
    <!-- Main Cylinder / Tub Container -->
    <rect x="180" y="140" width="240" height="340" rx="28" fill="url(#bodyGrad)" />
    <!-- Lid / Cap -->
    <rect x="210" y="105" width="180" height="42" rx="10" fill="url(#bronzeGrad)" />
    <line x1="210" y1="126" x2="390" y2="126" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="2" />
    
    <!-- Label Surface -->
    <rect x="200" y="180" width="200" height="260" rx="8" fill="#FDFBF7" />
    
    <!-- Label Header -->
    <text x="300" y="215" font-family="'Cinzel', 'Playfair Display', serif" font-size="18" font-weight="700" fill="#1F2421" text-anchor="middle" letter-spacing="4">TATVA</text>
    <text x="300" y="232" font-family="'Inter', sans-serif" font-size="9" font-weight="600" fill="#B68D40" text-anchor="middle" letter-spacing="2">PURE BY PRINCIPLE</text>

    <!-- Horizontal Divider -->
    <line x1="230" y1="245" x2="370" y2="245" stroke="#E5DEC9" stroke-width="1.5" />

    <!-- Product Specific Graphic Icon -->
    <circle cx="300" cy="295" r="34" fill="${colorAccent}" fill-opacity="0.12" />
    <circle cx="300" cy="295" r="28" fill="none" stroke="${colorAccent}" stroke-width="2" stroke-dasharray="4 2" />
    <text x="300" y="303" font-family="'Inter', sans-serif" font-size="20" font-weight="700" fill="${colorAccent}" text-anchor="middle">${iconShape}</text>

    <!-- Product Name on Label -->
    <text x="300" y="360" font-family="'Inter', sans-serif" font-size="15" font-weight="700" fill="#1F2421" text-anchor="middle">${name.replace('TATVA ', '')}</text>
    <text x="300" y="380" font-family="'Inter', sans-serif" font-size="11" font-weight="500" fill="#757575" text-anchor="middle">${subtitle}</text>

    <!-- Label Bottom Pill -->
    <rect x="235" y="405" width="130" height="22" rx="11" fill="#4F6D48" />
    <text x="300" y="420" font-family="'Inter', sans-serif" font-size="10" font-weight="600" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">${badgeText}</text>
  </g>
</svg>
`;

const posterSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="100%" height="100%">
  <defs>
    <linearGradient id="posterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1B221E" />
      <stop offset="50%" stop-color="#242C27" />
      <stop offset="100%" stop-color="#141815" />
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#B68D40" />
      <stop offset="50%" stop-color="#E2C98F" />
      <stop offset="100%" stop-color="#9E7430" />
    </linearGradient>
  </defs>
  <rect width="1200" height="675" fill="url(#posterGrad)" />

  <!-- Subtle grid lines & geometric circle -->
  <circle cx="850" cy="337" r="280" fill="none" stroke="#FFFFFF" stroke-opacity="0.04" stroke-width="2" />
  <circle cx="850" cy="337" r="220" fill="none" stroke="#B68D40" stroke-opacity="0.15" stroke-width="1.5" stroke-dasharray="6 4" />

  <!-- Text Header -->
  <text x="120" y="210" font-family="'Inter', sans-serif" font-size="14" font-weight="700" fill="#B68D40" letter-spacing="5">ACADEMIC PROTOTYPE | SPORTS NUTRITION</text>
  <text x="120" y="280" font-family="'Cinzel', 'Playfair Display', serif" font-size="64" font-weight="800" fill="#FDFBF7" letter-spacing="3">TATVA NUTRITION</text>
  <text x="120" y="335" font-family="'Inter', sans-serif" font-size="28" font-style="italic" font-weight="300" fill="#E2C98F">Pure by Principle.</text>

  <text x="120" y="390" font-family="'Inter', sans-serif" font-size="16" font-weight="400" fill="#A0ABA4" width="500">
    Uncompromising purity, micro-filtered protein, and performance formulations.
  </text>
  <text x="120" y="415" font-family="'Inter', sans-serif" font-size="16" font-weight="400" fill="#A0ABA4">
    Crafted cleanly for disciplined athletes seeking honest results.
  </text>

  <!-- Simulated Button -->
  <rect x="120" y="460" width="190" height="48" rx="24" fill="url(#gold)" />
  <text x="215" y="490" font-family="'Inter', sans-serif" font-size="15" font-weight="700" fill="#141815" text-anchor="middle" letter-spacing="1">EXPLORE SHOP →</text>

  <!-- Right Visual Feature -->
  <g transform="translate(730, 160)">
    <rect x="60" y="30" width="160" height="280" rx="24" fill="#2E3732" stroke="#B68D40" stroke-width="2" />
    <rect x="80" y="5" width="120" height="30" rx="8" fill="url(#gold)" />
    <text x="140" y="110" font-family="'Cinzel', serif" font-size="20" font-weight="700" fill="#FDFBF7" text-anchor="middle">TATVA</text>
    <text x="140" y="135" font-family="'Inter', sans-serif" font-size="9" fill="#B68D40" text-anchor="middle">100% ISOLATE</text>
    <circle cx="140" cy="185" r="30" fill="#4F6D48" fill-opacity="0.3" />
    <text x="140" y="192" font-family="'Inter', sans-serif" font-size="16" font-weight="700" fill="#E2C98F" text-anchor="middle">27g</text>
    <text x="140" y="250" font-family="'Inter', sans-serif" font-size="12" fill="#FFFFFF" text-anchor="middle">WHEY ISOLATE</text>
  </g>
</svg>
`;

const products = [
  {
    filename: 'tatva-whey-isolate.svg',
    name: 'Whey Isolate',
    category: 'Protein',
    subtitle: 'Chocolate • 1 kg Pack',
    colorPrimary: '#28231E',
    colorAccent: '#B68D40',
    iconShape: '27g',
    badgeText: '100% ISOLATE',
  },
  {
    filename: 'tatva-micronized-creatine.svg',
    name: 'Micronized Creatine',
    category: 'Performance',
    subtitle: 'Creapure • 250 g',
    colorPrimary: '#1E252A',
    colorAccent: '#4F6D48',
    iconShape: 'ATP',
    badgeText: '200 MESH',
  },
  {
    filename: 'tatva-peanut-butter.svg',
    name: 'Peanut Butter',
    category: 'Nutrition',
    subtitle: 'Creamy Slow-Roasted • 1 kg',
    colorPrimary: '#3A2E1C',
    colorAccent: '#B68D40',
    iconShape: '10g',
    badgeText: '100% PEANUTS',
  },
  {
    filename: 'tatva-protein-shaker.svg',
    name: 'Steel Shaker Bottle',
    category: 'Accessories',
    subtitle: 'Leak-Proof • 700 ml',
    colorPrimary: '#202422',
    colorAccent: '#7F9A78',
    iconShape: '700ml',
    badgeText: 'BPA FREE',
  },
  {
    filename: 'tatva-pre-workout.svg',
    name: 'High-Ignite Pre-Workout',
    category: 'Performance',
    subtitle: 'Fruit Punch • 300 g',
    colorPrimary: '#2F1B24',
    colorAccent: '#E06D53',
    iconShape: '⚡',
    badgeText: '200mg CAFFEINE',
  },
  {
    filename: 'tatva-protein-oats.svg',
    name: 'Rolled Protein Oats',
    category: 'Nutrition',
    subtitle: 'Chocolate Banana • 1 kg',
    colorPrimary: '#2B271F',
    colorAccent: '#B68D40',
    iconShape: '12g',
    badgeText: 'HIGH FIBER',
  },
];

for (const p of products) {
  const content = createProductSVG(p);
  fs.writeFileSync(path.join(targetDir, p.filename), content);
  // Also create .png copy so any hardcoded .png path serves successfully
  fs.writeFileSync(path.join(targetDir, p.filename.replace('.svg', '.png')), content);
  console.log(`Generated: ${p.filename} and corresponding .png`);
}

fs.writeFileSync(path.join(targetDir, 'tatva-main-poster.svg'), posterSVG);
fs.writeFileSync(path.join(targetDir, 'tatva-main-poster.png'), posterSVG);
console.log('Generated: tatva-main-poster.svg and tatva-main-poster.png');
