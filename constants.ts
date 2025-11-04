
import { Option } from './types';

export const SIZES: Option[] = [
  { id: '8x12', name: '8x12 Utility', price: 3200, image: 'https://picsum.photos/seed/size1/400/300' },
  { id: '10x16', name: '10x16 A-Frame', price: 4995, image: 'https://picsum.photos/seed/size2/400/300' },
  { id: '12x16', name: '12x16 Garden Retreat', price: 6749, image: 'https://picsum.photos/seed/size3/400/300' },
  { id: '12x20', name: '12x20 Lofted Barn', price: 7499, image: 'https://picsum.photos/seed/size4/400/300' },
  { id: '12x24', name: '12x24 Workshop', price: 8995, image: 'https://picsum.photos/seed/size5/400/300' },
  { id: '12x24-modern', name: '12x24 Modern Shed', price: 12500, image: 'https://picsum.photos/seed/size6/400/300' },
];

export const STYLES: Option[] = [
  { id: 'utility', name: 'Utility', price: 0, description: 'Simple, practical, and budget-friendly.', image: 'https://picsum.photos/seed/style1/400/300' },
  { id: 'a-frame', name: 'A-Frame', price: 500, description: 'Classic design with a sloped roof.', image: 'https://picsum.photos/seed/style2/400/300' },
  { id: 'lofted-barn', name: 'Lofted Barn', price: 1200, description: 'Maximizes storage with an overhead loft.', image: 'https://picsum.photos/seed/style3/400/300' },
  { id: 'modern', name: 'Modern', price: 2500, description: 'Sleek lines and a minimalist aesthetic.', image: 'https://picsum.photos/seed/style4/400/300' },
  { id: 'saltbox', name: 'Saltbox', price: 800, description: 'Asymmetric roof, great for lean-to style.', image: 'https://picsum.photos/seed/style5/400/300' },
];

export const SIDING_OPTIONS: Option[] = [
  { id: 't1-11', name: 'Smart Panel T1-11', price: 0, description: 'Standard, durable engineered wood.' },
  { id: 'vinyl', name: 'Vinyl Dutchlap', price: 1800, description: 'Low maintenance, classic look.' },
  { id: 'metal', name: 'Corrugated Metal', price: 2200, description: 'Industrial, modern, and long-lasting.' },
  { id: 'cedar', name: 'Cedar Lap Siding', price: 4500, description: 'Premium, natural wood beauty.' },
  { id: 'board-batten', name: 'Board & Batten', price: 2800, description: 'Rustic charm with vertical boards.' },
];

export const ROOF_OPTIONS: Option[] = [
  { id: 'shingles', name: 'Asphalt Shingles', price: 0, description: 'Standard 30-year architectural shingles.' },
  { id: 'metal-roof', name: 'Standing Seam Metal', price: 2500, description: 'Premium 50-year warranty, sleek look.' },
  { id: 'clear-poly', name: 'Clear Polycarbonate', price: 1800, description: 'Greenhouse-style roof for natural light.' },
];

export const ADDONS: Option[] = [
  { id: 'extra-window', name: 'Extra 24"x36" Window', price: 150 },
  { id: 'double-doors', name: 'Double Doors (72")', price: 300 },
  { id: 'loft-storage', name: '8ft Loft Storage', price: 400 },
  { id: 'electrical', name: 'Electrical Package', price: 600 },
  { id: 'insulation', name: 'Full Insulation & Drywall', price: 2800 },
  { id: 'skylight', name: '2x4 Skylight', price: 350 },
  { id: 'solar-kit', name: 'Off-Grid Solar Kit (100W)', price: 1200 },
  { id: 'ramp', name: 'Heavy Duty Ramp', price: 250 },
  { id: 'workbench', name: '8ft Built-in Workbench', price: 375 },
  { id: 'custom-paint', name: 'Custom Paint Color', price: 200 },
];
