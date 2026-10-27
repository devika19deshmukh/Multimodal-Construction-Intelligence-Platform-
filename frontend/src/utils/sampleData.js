// High-quality SVG Data URIs for instant testing without external dependencies

export const SAMPLE_SAFETY_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <defs>
    <linearGradient id="sky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="%2338bdf8"/>
      <stop offset="100%" stop-color="%23bae6fd"/>
    </linearGradient>
    <linearGradient id="beam" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="%23e2e8f0"/>
      <stop offset="50%" stop-color="%2394a3b8"/>
      <stop offset="100%" stop-color="%23475569"/>
    </linearGradient>
    <pattern id="concrete" width="20" height="20" patternUnits="userSpaceOnUse">
      <rect width="20" height="20" fill="%2364748b"/>
      <circle cx="5" cy="5" r="1.5" fill="%23475569"/>
      <circle cx="15" cy="12" r="2" fill="%23334155"/>
      <circle cx="10" cy="18" r="1" fill="%2394a3b8"/>
    </pattern>
  </defs>

  <!-- Sky -->
  <rect width="800" height="600" fill="url(%23sky)"/>

  <!-- Tower Crane in Background -->
  <path d="M 620 600 L 630 120 L 640 600" stroke="%23f59e0b" stroke-width="4" fill="none"/>
  <line x1="625" y1="120" x2="625" y2="70" stroke="%23f59e0b" stroke-width="6"/>
  <line x1="520" y1="90" x2="780" y2="90" stroke="%23f59e0b" stroke-width="5"/>
  <line x1="560" y1="90" x2="625" y2="70" stroke="%23f59e0b" stroke-width="2"/>
  <line x1="625" y1="70" x2="750" y2="90" stroke="%23f59e0b" stroke-width="2"/>

  <!-- Concrete Structural Deck -->
  <rect x="0" y="380" width="800" height="220" fill="url(%23concrete)"/>
  <rect x="0" y="380" width="800" height="15" fill="%23334155"/>

  <!-- Steel Columns and Framing -->
  <rect x="60" y="160" width="30" height="220" fill="url(%23beam)"/>
  <rect x="710" y="160" width="30" height="220" fill="url(%23beam)"/>
  <rect x="50" y="160" width="700" height="25" fill="url(%23beam)"/>

  <!-- Scaffolding on Left -->
  <g stroke="%23d97706" stroke-width="3">
    <line x1="120" y1="185" x2="120" y2="380"/>
    <line x1="220" y1="185" x2="220" y2="380"/>
    <line x1="120" y1="250" x2="220" y2="250"/>
    <line x1="120" y1="315" x2="220" y2="315"/>
    <line x1="120" y1="250" x2="220" y2="315"/>
    <line x1="120" y1="315" x2="220" y2="250"/>
  </g>

  <!-- Worker 1: Missing Hard Hat! (High risk zone det_01) -->
  <g id="worker1">
    <!-- Body -->
    <rect x="270" y="310" width="55" height="75" rx="8" fill="%23f97316"/>
    <!-- Head (NO HELMET - Dark Hair) -->
    <circle cx="297" cy="285" r="16" fill="%23854d0e"/>
    <circle cx="297" cy="285" r="14" fill="%23fcd34d"/>
    <!-- Legs -->
    <rect x="276" y="385" width="18" height="55" fill="%231e3a8a"/>
    <rect x="303" y="385" width="18" height="55" fill="%231e3a8a"/>
    <!-- Boots -->
    <rect x="273" y="435" width="22" height="12" fill="%2378350f" rx="3"/>
    <rect x="303" y="435" width="22" height="12" fill="%2378350f" rx="3"/>
  </g>

  <!-- Worker 2: Fully Compliant (Hard Hat + High Vis) -->
  <g id="worker2">
    <!-- Body & Vest -->
    <rect x="420" y="300" width="50" height="75" rx="8" fill="%2384cc16"/>
    <rect x="430" y="315" width="30" height="8" fill="%23f8fafc"/>
    <rect x="430" y="340" width="30" height="8" fill="%23f8fafc"/>
    <!-- Head with YELLOW HARD HAT -->
    <circle cx="445" cy="280" r="14" fill="%23fde047"/>
    <path d="M 428 278 Q 445 258 462 278 Z" fill="%23eab308"/>
    <!-- Legs -->
    <rect x="425" y="375" width="16" height="60" fill="%231e293b"/>
    <rect x="449" y="375" width="16" height="60" fill="%231e293b"/>
  </g>

  <!-- Hazardous Edge without Toeboard (Fall Hazard det_02) -->
  <g id="unprotected-edge">
    <line x1="560" y1="380" x2="780" y2="380" stroke="%23ef4444" stroke-width="4" stroke-dasharray="8 6"/>
    <text x="590" y="415" font-family="sans-serif" font-size="14" font-weight="bold" fill="%23fca5a5">! UNPROTECTED LEADING EDGE !</text>
  </g>

  <!-- Loose Power Cables (Trip Hazard) -->
  <path d="M 330 430 Q 380 445 420 425 T 520 440 T 600 420" stroke="%23eab308" stroke-width="6" fill="none"/>
</svg>`;

export const SAMPLE_CRACK_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <defs>
    <linearGradient id="concrete-surface" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="%2394a3b8"/>
      <stop offset="50%" stop-color="%2364748b"/>
      <stop offset="100%" stop-color="%23475569"/>
    </linearGradient>
    <filter id="noise" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" result="noise"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.5   0 0 0 0 0.5   0 0 0 0 0.5  0 0 0 0.35 0"/>
      <feComposite in2="SourceGraphic" in="gl" operator="arithmetic" k1="0" k2="1" k3="1" k4="0"/>
    </filter>
  </defs>

  <!-- Background Concrete Wall -->
  <rect width="800" height="600" fill="url(%23concrete-surface)"/>

  <!-- Concrete Chamfer Border & Texture -->
  <rect x="40" y="40" width="720" height="520" fill="none" stroke="%23334155" stroke-width="4"/>
  <line x1="40" y1="180" x2="760" y2="180" stroke="%23475569" stroke-width="3"/>

  <!-- Formwork Tie Holes -->
  <circle cx="120" cy="110" r="14" fill="%231e293b"/>
  <circle cx="120" cy="110" r="8" fill="%230f172a"/>
  <circle cx="680" cy="110" r="14" fill="%231e293b"/>
  <circle cx="680" cy="110" r="8" fill="%230f172a"/>

  <!-- Major 45-Degree Shear Structural Crack -->
  <g>
    <!-- Crack shadow depth -->
    <path d="M 180 500 Q 240 430 310 380 T 430 270 T 520 180 T 610 90" 
          stroke="%230f172a" stroke-width="8" stroke-linecap="round" fill="none"/>
    <path d="M 180 500 Q 240 430 310 380 T 430 270 T 520 180 T 610 90" 
          stroke="%2318181b" stroke-width="5" stroke-linecap="round" fill="none"/>

    <!-- Micro branch cracks -->
    <path d="M 310 380 Q 340 370 380 390" stroke="%2318181b" stroke-width="2.5" fill="none"/>
    <path d="M 430 270 Q 420 230 405 210" stroke="%2318181b" stroke-width="3" fill="none"/>
    <path d="M 520 180 Q 550 170 580 190" stroke="%2318181b" stroke-width="2" fill="none"/>

    <!-- Concrete spalling / chipping around main crack -->
    <polygon points="305,375 315,385 320,370" fill="%23cbd5e1"/>
    <polygon points="425,265 435,275 440,260" fill="%23cbd5e1"/>
  </g>

  <!-- Technical Caliper Reference Scale Overlay -->
  <g transform="translate(60, 480)">
    <rect width="140" height="35" rx="6" fill="%230f172a" fill-opacity="0.85"/>
    <line x1="15" y1="18" x2="125" y2="18" stroke="%23f59e0b" stroke-width="2"/>
    <line x1="15" y1="12" x2="15" y2="24" stroke="%23f59e0b" stroke-width="2"/>
    <line x1="125" y1="12" x2="125" y2="24" stroke="%23f59e0b" stroke-width="2"/>
    <text x="35" y="15" font-family="monospace" font-size="11" fill="%23fde68a">SCALE: 50 mm</text>
  </g>
</svg>`;

// Convert SVG Data URI to a File object for multipart upload
export function dataUrlToFile(dataUrl, filename = 'sample_inspection.svg') {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1].includes(';base64') ? arr[1] : unescape(encodeURIComponent(arr[1])));
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime || 'image/svg+xml' });
}

// Preset Quick Demonstrations
export const SAMPLE_PROJECT_PLAN = {
  project_name: 'Metropolis Tower Phase 3',
  building_type: 'Commercial High-Rise & Mixed Retail',
  total_sqft: 85000,
  budget_usd: 24500000,
  target_duration_months: 20,
  location: 'Austin Downtown Financial District',
  soil_condition: 'Dense limestone bedrock with shallow clay loam cap',
  project_scope: '2-level subterranean parking, 14-story reinforced concrete structural frame, double-glazed curtain wall, full MEP infrastructure, LEED Gold target.'
};

export const SAMPLE_WEATHER_CONDITIONS = {
  storm: {
    location: 'Metropolis Site #2 (Austin, TX)',
    temperature_c: 24.0,
    wind_speed_kmh: 46.5,
    precipitation_prob_pct: 85,
    precipitation_amount_mm: 22.0,
    weather_condition: 'Thunderstorm & High Winds',
    active_tasks: [
      'Tower Crane Steel Beam Erection',
      'Level 5 Concrete Slab Pouring',
      'Curtain Wall Glazing Installation',
      'Perimeter Excavation & Trenching',
      'Electrical Conduit Rough-In'
    ]
  },
  heatwave: {
    location: 'Phoenix Desert Hub Project',
    temperature_c: 41.2,
    wind_speed_kmh: 18.0,
    precipitation_prob_pct: 5,
    precipitation_amount_mm: 0.0,
    weather_condition: 'Extreme Heat & Direct Sunlight',
    active_tasks: [
      'Structural Concrete Slab Pouring',
      'Roofing Torch-Down Membrane',
      'Structural Steel Welding',
      'Interior Drywall Framing'
    ]
  },
  ideal: {
    location: 'Denver Commercial Center',
    temperature_c: 21.5,
    wind_speed_kmh: 12.0,
    precipitation_prob_pct: 10,
    precipitation_amount_mm: 0.0,
    weather_condition: 'Clear & Calm',
    active_tasks: [
      'Tower Crane Pick & Place',
      'Concrete Placement & Finishing',
      'Curtain Wall Glazing',
      'MEP Energization'
    ]
  }
};

export const SAMPLE_VALUATION_PROPERTIES = {
  commercial: {
    property_type: 'Mixed-Use Commercial & Tech Office',
    location_tier: 'Tier 1 Urban Core (Austin Downtown)',
    total_sqft: 75000,
    plot_size_sqft: 28000,
    floors: 10,
    construction_quality: 'Ultra Luxury LEED Gold',
    completion_status_pct: 70,
    year_built: 2026,
    expected_rental_yield_pct: 7.2,
    amenities: ['Rooftop Solar Terrace', 'Smart HVAC IoT Network', 'EV Fleet Charging', 'Subterranean Parking (150 spaces)']
  },
  residential: {
    property_type: 'Luxury Multi-Family Residential Tower',
    location_tier: 'Tier 1 Urban Core (Austin Downtown)',
    total_sqft: 120000,
    plot_size_sqft: 35000,
    floors: 16,
    construction_quality: 'Premium Architectural Grade',
    completion_status_pct: 85,
    year_built: 2026,
    expected_rental_yield_pct: 6.5,
    amenities: ['Sky Lounge & Pool', 'Concierge Lobby', 'Fitness Center & Spa', 'Co-Working Suites']
  }
};

export const SAMPLE_COMPLIANCE_QUERIES = [
  'What are the mandatory OSHA fall protection requirements for employees working on unprotected leading edges at or above 6 feet?',
  'What is the minimum stairway width and egress corridor clearance required under IBC 2024 for an occupant load of 450?',
  'What are the maximum tolerable concrete crack widths specified by ACI 224R for reinforced elements exposed to humid air?',
  'What soil sloping and trench box protective systems are mandated by OSHA 1926.652 for excavations exceeding 5 feet in Type B soil?',
  'What are the municipal zoning setback and Floor Area Ratio (FAR) limits for downtown high-density commercial developments?'
];
