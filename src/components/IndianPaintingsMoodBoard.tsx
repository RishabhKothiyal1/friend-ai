import React, { useState, useEffect } from "react";
import { 
  Paintbrush, 
  MapPin, 
  Award, 
  FileText, 
  Sparkles, 
  Search, 
  Filter, 
  BookOpen, 
  Heart, 
  RotateCcw,
  Volume2,
  Wind,
  Info,
  Maximize2,
  X,
  Play,
  Pause,
  ChevronRight,
  HelpCircle,
  TrendingUp,
  Clock,
  Shield,
  History
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PaintingDetail {
  id: string;
  name: string;
  region: string;
  category: "Folk" | "Tribal" | "Classical";
  format: string;
  materials: string;
  identifier: string;
  giStatus: "Yes" | "No" | "Partial";
  colorPalette: string[];
  motifs: string[];
  description: string;
  lore: string;
}

const INDIAN_PAINTINGS: PaintingDetail[] = [
  {
    id: "madhubani",
    name: "Madhubani Painting",
    region: "Bihar",
    category: "Folk",
    format: "Paper / Mud Walls",
    materials: "Fingers, twigs, matchsticks; natural dyes",
    identifier: "Double-line borders; Horror Vacui (no empty spaces)",
    giStatus: "Yes",
    colorPalette: ["#be2222", "#d97706", "#2563eb", "#059669", "#000000"],
    motifs: ["Sun & Moon", "Lotus", "Fish", "Deities", "Birds"],
    description: "Also known as Mithila Art, this tradition is legendary for filling every spare inch with intricate patterns (Horror Vacui). Historically, it is a matrilineal practice passed down through generations of women.",
    lore: "Traditionally linked to the epic Ramayana; King Janaka was said to have commissioned local artists to decorate the city of Mithila for Sita's wedding."
  },
  {
    id: "warli",
    name: "Warli Painting",
    region: "Maharashtra",
    category: "Tribal",
    format: "Walls / Cloth",
    materials: "White rice paste on red ochre mud base",
    identifier: "Geometric stick figures (triangles, circles); Tarpa dance",
    giStatus: "Yes",
    colorPalette: ["#ffffff", "#aa5e3c"],
    motifs: ["Tarpa Instrument", "Swaying Trees", "Concentric Dance Circles", "Hunting & Farming Scenes"],
    description: "One of India's oldest living tribal art forms. Characterized by a monochromatic stark aesthetic: white rice-clay strokes over a rich, red-brown clay background. It celebrates community, nature, and cyclical time instead of individual deities.",
    lore: "Form of eco-centric expression centering around the Mother Goddess Palaghata and the Tarpa wind instrument dance, symbolizing the cyclical flow of life."
  },
  {
    id: "pattachitra",
    name: "Pattachitra Painting",
    region: "Odisha / West Bengal",
    category: "Folk",
    format: "Cloth (Patta)",
    materials: "Tamarind seed paste, stone-polished fabric, natural stone dusts",
    identifier: "Sharp large eyes; Krishna-Lila themes; leather-like finish",
    giStatus: "Yes",
    colorPalette: ["#852222", "#cf9d1a", "#1050a5", "#000000", "#fafafa"],
    motifs: ["Lord Jagannath", "Lotus Petals", "Epic Battles", "Graceful Gopis"],
    description: "A highly disciplined, ornate, and color-intensive tradition closely bound to the Jagannath temple of Puri. It uses a 23-step natural organic process to achieve a leather-like polished finish.",
    lore: "Acts as a sacred functional substitute for deities. During the 'Anavasara' period, when temple idols are closed from public view, these paintings are worshipped in their place."
  },
  {
    id: "kalamkari",
    name: "Kalamkari Painting",
    region: "Andhra Pradesh / Telangana",
    category: "Classical",
    format: "Cotton Cloth",
    materials: "Kalam (Bamboo pen); 23-step natural dyeing",
    identifier: "Srikalahasti freehand vs Machilipatnam block-print",
    giStatus: "Yes",
    colorPalette: ["#542518", "#2d4530", "#baa058", "#121d28"],
    motifs: ["Tree of Life", "Peacocks", "Divine Chariots", "Lata patterns"],
    description: "Derived from 'Kalam' (pen) and 'Kari' (craft). It represents a magnificent historic convergence of art, silk/cotton trade routes, and spiritual storytelling executed using hand-crafted organic bamboo inkwells.",
    lore: "Extremely popular with medieval Persian merchants who referred to it as 'Chintz'. It features deep, rich natural indigo, root madder, and iron-rust layers."
  },
  {
    id: "gond",
    name: "Gond Painting",
    region: "Madhya Pradesh",
    category: "Tribal",
    format: "Paper / Canvas",
    materials: "Intricate infilling with lines, dots, and dashes",
    identifier: "'Textured' or 'Breathing' patterns; Tree of Life motif",
    giStatus: "Yes",
    colorPalette: ["#de3469", "#facd12", "#1290de", "#12ad44", "#a355de"],
    motifs: ["Animated Trees", "Intricate Birds", "Glow-worms", "Leaping Tigers"],
    description: "Born from the cosmological beliefs of the Gond tribe, who believe that all elements of nature—trees, wind, spirits—are interconnected and alive. Every shape is meticulously populated with rhythmic lines, patterns, and dots.",
    lore: "Pioneered into the global fine arts medium by Jangarh Singh Shyam under the style 'Jangarh Kalam'—bringing forest folklore onto paper."
  },
  {
    id: "bhil_art",
    name: "Bhil Art",
    region: "Madhya Pradesh / Gujarat",
    category: "Tribal",
    format: "Walls / Paper",
    materials: "Uniform rhythmic multi-colored dots",
    identifier: "Dots representing 'Seeds of Life' or ancestors",
    giStatus: "No",
    colorPalette: ["#ff5722", "#ffeb3b", "#4caf50", "#2196f3", "#ec407a"],
    motifs: ["Wild Horses", "Ears of corn", "Tribal worshipers", "Ancestors as light nodes"],
    description: "The Bhil tribe uses uniform, beautiful points and dots of paint to fill the outlines of animals, deities, and clay walls. Each dot reflects a secret grain, seed of life, or memory of ancestors.",
    lore: "Bhuri Bai was the pathbreaking artist who carried this traditional mud-wall layout into brilliant synthetic acrylic mediums."
  },
  {
    id: "phad",
    name: "Phad Painting",
    region: "Rajasthan",
    category: "Folk",
    format: "15-30ft horizontal scrolls",
    materials: "Horizontal cloth scroll; vegetable stone colors",
    identifier: "Mobile temple; narrated by Bhopas (priest-singers)",
    giStatus: "Yes",
    colorPalette: ["#c62828", "#fcc02a", "#2e7d32", "#ffffff"],
    motifs: ["Folk hero deities Pabuji & Devnarayan", "Horses", "Castles", "Bards"],
    description: "A monumental scroll tradition from Rajasthan functioning as a portable traveling temple. Bards (Bhopas) unroll the giant scroll at night, sing heroic legends with string instruments (Ravanahatha) while lit by dynamic oil lamps.",
    lore: "An absolute fusion of visual folk art, theatrical performance, and string instruments where the painting itself serves as the stage."
  },
  {
    id: "pichwai",
    name: "Pichwai Painting",
    region: "Rajasthan",
    category: "Folk",
    format: "Temple hanging cloth",
    materials: "Cloth; Gold/Silver foil, rare natural stone pigments",
    identifier: "Shrinathji (Krishna) backdrop; ultra-detailed lotus / cows",
    giStatus: "Yes",
    colorPalette: ["#0b162c", "#ff9800", "#e91e63", "#a1a1a5", "#ffd700"],
    motifs: ["Lotus Bloomed Ponds", "Kamadhenu Cows", "Full Moon (Sharad Purnima)", "Shrinathji Deity"],
    description: "Exquisite devotional hangings created as direct backdrops for the deity of Shrinathji in Nathdwara. Famous for its ultra-fine gold outlines, beautiful symmetric lotus ponds, and deep devotional reverence.",
    lore: "Literally meaning 'that which hangs at the back'. It changes cyclically according to the specific festival, weather season, and daily worship hours."
  },
  {
    id: "pithora",
    name: "Pithora Painting",
    region: "Gujarat / Madhya Pradesh",
    category: "Tribal",
    format: "Ritual mud-chalk wall",
    materials: "White clay (Kadi) base; natural bamboo brush",
    identifier: "Seven Horses motif; Votive art (fulfilled wishes)",
    giStatus: "Yes",
    colorPalette: ["#e53935", "#1e88e5", "#43a047", "#fdd835", "#ffffff"],
    motifs: ["Seven Holy Horses", "Rathwa Deities", "Tigers", "Suns", "Farmer tools"],
    description: "A highly sacred votive ritual wall tradition practiced by the Rathwa and Bhilala communities. Commissioned in response to a crisis (illness, drought) and executed under the direct guidance of a priest shaman (Badwa).",
    lore: "The seven horses represent the prominent holy hills of the border region, embodying the spirit of the local deity Baba Pithora."
  },
  {
    id: "kalighat",
    name: "Kalighat Painting",
    region: "West Bengal",
    category: "Folk",
    format: "Inexpensive Paper (Bazar Art)",
    materials: "Watercolors; bold flowing brush strokes",
    identifier: "Satirical 'Baboo culture' commentary; bold silhouettes",
    giStatus: "Partial",
    colorPalette: ["#1e293b", "#ef4444", "#eab308", "#64748b"],
    motifs: ["Babu culture figures", "Strumming courtesans", "Satirical animals", "Deities"],
    description: "An urban modern evolution of traditional folk scrolls created near the Kalighat temple of Kolkata. Famous for its quick, sweeping, continuous ink lines and satirical humor mocking colonial lifestyles.",
    lore: "Associated with the historic 'Bazar School', this style was a massive influence on modern Indian painters like Jamini Roy."
  },
  {
    id: "cheriyal",
    name: "Cheriyal Scroll Painting",
    region: "Telangana",
    category: "Folk",
    format: "Vertical Scroll",
    materials: "Red ochre base; tamarind & wood resin mix",
    identifier: "Crimson red background; cinematic storyline panels",
    giStatus: "Yes",
    colorPalette: ["#b91c1c", "#fbbf24", "#ffffff", "#047857"],
    motifs: ["Story panels", "Mythological kings", "Village markets", "Farmers"],
    description: "A highly stylized story panel scroll tradition practiced by the Nakashi community. Long vertical rolls are unrolled panel-by-panel, telling sequential folktales like a comic strip.",
    lore: "An endangered treasure: only a handful of families in Cheriyal village still specialize in formulating this stunning red-ochre background scroll."
  },
  {
    id: "saura",
    name: "Saura Painting",
    region: "Odisha",
    category: "Tribal",
    format: "Wall Murals",
    materials: "White rice pigment on red / yellow mud background",
    identifier: "Fish-bone borders; elongated geometric stick figures",
    giStatus: "Yes",
    colorPalette: ["#ffffff", "#7c2d12", "#eab308"],
    motifs: ["Hierarchical human structures", "Tigers", "Elephants", "Fish-bones", "Ancestral ladders"],
    description: "Also known as Lanjia Saura art or Ikon (Idital). Visually resembling Warli, it is a deeply ritualistic tribal mural style representing family ties, ancestral communications, and eco-centric cycles.",
    lore: "The shaman painter acts as the vessel to translate sacred dreams into wall geometric alignments to ward off crop failure and illnesses."
  },
  {
    id: "sohrai_khovar",
    name: "Sohrai-Khovar Painting",
    region: "Jharkhand",
    category: "Tribal",
    format: "Mud Walls",
    materials: "Comb-cut (Sgraffito) black & white mud clay",
    identifier: "Marriage (Khovar) vs Harvest (Sohrai) seasonal murals",
    giStatus: "Yes",
    colorPalette: ["#1e1b4b", "#f9fafb", "#7c2d12", "#ca8a04"],
    motifs: ["Forest beasts", "Lush vines", "Lotus flower cages", "Birds", "Labyrinths"],
    description: "Twin seasonal mud-mural arts. Khovar ('bridal room') uses black charcoal coat covered by white clay which is combed out (Sgraffito) to draw fertility symbols. Sohrai is a post-harvest festival art showcasing animals.",
    lore: "Maintained and protected as a matrilineal oral legacy by tribal women in the coal-rich Hazaribagh forests."
  },
  {
    id: "manjusha",
    name: "Manjusha Painting",
    region: "Bihar",
    category: "Folk",
    format: "Jute / Paper Boxes",
    materials: "Strict 3-color palette (Pink, Green, Yellow)",
    identifier: "Snake motifs; Tells the Bihula-Bishahari legend",
    giStatus: "No",
    colorPalette: ["#ec4899", "#22c55e", "#eab308"],
    motifs: ["Snakes", "Lotus petals", "Bihula on her boat", "Champa flowers"],
    description: "Also known as Angika Art or 'Snake Painting', this highly structured style utilizes only three colors (pink, green, yellow) and tells the specific legend of Bihula's journey to save her husband from snakebite.",
    lore: "Named after the 'Manjusha'—the boxes made of jute and bamboo decorated with these protective paintings for the snake goddess festival."
  },
  {
    id: "paitkar",
    name: "Paitkar Painting",
    region: "Jharkhand / West Bengal",
    category: "Tribal",
    format: "Scroll",
    materials: "Natural stone/leaf pigments; Santhal tribal style",
    identifier: "'Eye-giving' ritual; themes of life after death",
    giStatus: "No",
    colorPalette: ["#78350f", "#fef3c7", "#ca8a04", "#7f1d1d"],
    motifs: ["Santhal houses", "Souls under judgment", "River structures", "Spirits"],
    description: "An ancient scroll-based tribal art of the Santhal community. The painters, historically known as Jadu Patuas (magic painters), traveled from home to home depicting folklore, afterlife, and ancestors.",
    lore: "Includes the magic 'Chaksudana' (Eye-Giving) ritual: if someone died, the painter brought a portrait without eyes and painted the pupils in exchange for rice, freeing the soul."
  },
  {
    id: "chittara",
    name: "Chittara Painting",
    region: "Karnataka",
    category: "Folk",
    format: "Mud Walls",
    materials: "Rice paste on red clay base; geometric precision",
    identifier: "Deevaru community; intricate straight-line patterns",
    giStatus: "No",
    colorPalette: ["#7f1d1d", "#ffffff", "#ca8a04", "#111827"],
    motifs: ["Symmetric lattices", "Sacred shrines", "Wedding Mandapas", "Ears of rice"],
    description: "A highly geometric, symmetric ritual wall art passed down through maternal lineages of the Deevaru community in the Malnad region. Structured using strict vertical, horizontal, and diagonal line alignments.",
    lore: "Created as auspicious thresholds during weddings and harvest cycles, using red mud, rice paste, and wild plant juices."
  },
  {
    id: "kalamezhuthu",
    name: "Kalamezhuthu Painting",
    region: "Kerala",
    category: "Classical",
    format: "Temple Floor",
    materials: "Five natural powders (Green, Red, Black, Yellow, White)",
    identifier: "Ephemeral floor art; ritualistically erased after worship",
    giStatus: "No",
    colorPalette: ["#166534", "#991b1b", "#111827", "#ca8a04", "#ffffff"],
    motifs: ["Bhadrakali (goddess)", "Holy Serpents", "Dynamic third eye", "Weaponry"],
    description: "An entirely ephemeral floor art of Kerala temples. Large sacred figures representing cosmological forces are drawn using natural powders (leaf dust, rice, turmeric, burnt paddy husk). After the ritual song, the art is erased.",
    lore: "Synthesizes fine art, traditional percussion, and costumed spirit dance, emphasizing the cyclical impermanence of all creations."
  },
  {
    id: "aipan",
    name: "Aipan Painting",
    region: "Uttarakhand",
    category: "Folk",
    format: "Floor / Wall",
    materials: "Geru (red clay) base + white rice paste",
    identifier: "Kumaoni geometric/floral mandalas; Vasudhara lines",
    giStatus: "Yes",
    colorPalette: ["#991b1b", "#ffffff"],
    motifs: ["Swastika", "Footprints of Lakshmi", "Intricate Mandalas", "Vertical bar lines"],
    description: "A ritual floor and threshold art of Uttarakhand's Kumaon hills. The ground is prepared with red rust clay (Geru) and layered with pristine white rice paste (Biswar) applied with the fingertips.",
    lore: "Features the 'Vasudhara'—thick vertical red and white stripes drawn on the home entrance representing the flow of wealth and ancestral protection."
  },
  {
    id: "rogan",
    name: "Rogan Painting",
    region: "Gujarat",
    category: "Folk",
    format: "Cloth / Textile",
    materials: "Boiled castor oil paste, rare pigments, metal stylus",
    identifier: "Folded symmetry; intricate thread-like lines",
    giStatus: "Yes",
    colorPalette: ["#0a1931", "#fdd835", "#e91e63", "#00b0ff", "#ffffff"],
    motifs: ["Tree of Life", "Flourishing vines", "Peacocks in lattices", "Mandorla arcs"],
    description: "An incredibly difficult textile printing art practiced by the Khatri family of Kutch. Boiled castor oil is whipped into a sticky paste, mixed with pigment, and stretched as thread-fine loops with a metal pen over fabric.",
    lore: "Rogan means 'oil-based' in Persian. By printing one half of the cloth and folding it over, a flawless symmetrical transfer is completed without sketching."
  },
  {
    id: "thangka",
    name: "Thangka Painting",
    region: "Himalayan Belt",
    category: "Classical",
    format: "Silk / Cotton",
    materials: "Mineral pigments, real gold dust, linen base",
    identifier: "Symmetric Mandala structure; central deity in assembly",
    giStatus: "No",
    colorPalette: ["#1e3a8a", "#dc2626", "#d97706", "#047857", "#ca8a04"],
    motifs: ["Golden halo lines", "Cosmic wheels", "Lotus seating", "Eight auspicious symbols"],
    description: "Highly regulated Tibetan Buddhist scroll painting depicting deities, celestial realms, and intricate teaching mandalas. Done on fine linen using real gold lining and framed by rich silk brocade.",
    lore: "Used as visual meditation maps by traveling monastic bards, drawn in absolute quietness following strict geometric formulas of the sutras."
  }
];

interface RegionInfo {
  id: string;
  name: string;
  defaultColor: string;
}

const PAINTING_REGIONS: { [paintingId: string]: RegionInfo[] } = {
  madhubani: [
    { id: "outer_border", name: "Double Outer Border", defaultColor: "#be2222" },
    { id: "inner_border", name: "Floral Inner Border", defaultColor: "#059669" },
    { id: "lotus_petal_1", name: "Sacred Lotus Petal (North)", defaultColor: "#be2222" },
    { id: "lotus_petal_2", name: "Sacred Lotus Petal (South)", defaultColor: "#be2222" },
    { id: "lotus_petal_3", name: "Sacred Lotus Petal (East)", defaultColor: "#d97706" },
    { id: "lotus_petal_4", name: "Sacred Lotus Petal (West)", defaultColor: "#d97706" },
    { id: "lotus_center", name: "Lotus Heart Receptacle", defaultColor: "#2563eb" },
    { id: "fish_1", name: "Fertility Carp (Upper)", defaultColor: "#2563eb" },
    { id: "fish_2", name: "Fertility Carp (Lower)", defaultColor: "#d97706" },
    { id: "sun_deity", name: "Shining Sun (Surya Dev)", defaultColor: "#d97706" },
    { id: "moon_deity", name: "Chandra Moon Companion", defaultColor: "#ffffff" },
    { id: "canvas_background", name: "Grounded Mud Paper background", defaultColor: "#fdfaf2" }
  ],
  warli: [
    { id: "canvas_background", name: "Terracotta Red Mud base", defaultColor: "#8c3d1e" },
    { id: "sun", name: "Venerable Solar Circle", defaultColor: "#ffffff" },
    { id: "tree_branches", name: "Swaying Tree Foliage", defaultColor: "#ffffff" },
    { id: "tarpa_horn", name: "Tarpa Wind Instrument", defaultColor: "#ffffff" },
    { id: "tarpa_musician", name: "Central Tarpa Musician", defaultColor: "#ffffff" },
    { id: "dancer_1", name: "Sacred Circle Dancer A", defaultColor: "#ffffff" },
    { id: "dancer_2", name: "Sacred Circle Dancer B", defaultColor: "#ffffff" },
    { id: "dancer_3", name: "Sacred Circle Dancer C", defaultColor: "#ffffff" },
    { id: "dancer_4", name: "Sacred Circle Dancer D", defaultColor: "#ffffff" },
    { id: "birds_and_wheat", name: "Harvest Sprouts & Swallows", defaultColor: "#ffffff" }
  ],
  gond: [
    { id: "canvas_background", name: "Cosmic Charcoal-Teal Ground", defaultColor: "#0d1e3d" },
    { id: "trunk", name: "Whispering Tree Trunk", defaultColor: "#facd12" },
    { id: "vines_left", name: "Symmetric Vine Creepers (Left)", defaultColor: "#de3469" },
    { id: "vines_right", name: "Symmetric Vine Creepers (Right)", defaultColor: "#12ad44" },
    { id: "peacock", name: "Spirited Forest Peacock", defaultColor: "#1290de" },
    { id: "deer", name: "Horned Deer (Nature Companion)", defaultColor: "#a355de" },
    { id: "spirit_orbs", name: "Floating Ancestral Glow Worms", defaultColor: "#ffffff" }
  ],
  pichwai: [
    { id: "canvas_background", name: "Divine Indigo Sky backdrop", defaultColor: "#030612" },
    { id: "gold_shrine_arch", name: "Nathdwara Temple Arch", defaultColor: "#ffd700" },
    { id: "big_central_lotus", name: "Full Blooming Saffron Lotus", defaultColor: "#e91e63" },
    { id: "left_kamadhenu", name: "Venerated Kamadhenu Cow (Left)", defaultColor: "#ffffff" },
    { id: "right_kamadhenu", name: "Venerated Kamadhenu Cow (Right)", defaultColor: "#ffffff" },
    { id: "ornaments_border", name: "Traditional Gilded Frame border", defaultColor: "#ffd700" }
  ],
  aipan: [
    { id: "canvas_background", name: "Vipon Geru Terracotta floor", defaultColor: "#8b1414" },
    { id: "vasudhara_lines", name: "Vasudhara Streams (White Rice)", defaultColor: "#ffffff" },
    { id: "inner_mandala_ring", name: "Intricate Concentric Mandala", defaultColor: "#ffffff" },
    { id: "goddess_footprint_1", name: "Lakshmi Footprint (Entrance)", defaultColor: "#ffffff" },
    { id: "goddess_footprint_2", name: "Lakshmi Footprint (Inner Home)", defaultColor: "#ffffff" },
    { id: "swastika_symbol_center", name: "Auspicious Swastika Core", defaultColor: "#ffffff" }
  ]
};

const PIGMENT_INFO: { [hex: string]: { name: string; source: string; lore: string } } = {
  "#be2222": { name: "Ochre / Geru", source: "Iron-rich Red Soil", lore: "A sacred ground plaster used since the Vedic era to bless thresholds and ward off negativity." },
  "#8c3d1e": { name: "Ochre / Geru", source: "Iron-rich Red Soil", lore: "A sacred ground plaster used since the Vedic era to bless thresholds and ward off negativity." },
  "#8b1414": { name: "Ochre / Geru", source: "Iron-rich Red Soil", lore: "A sacred ground plaster used since the Vedic era to bless thresholds and ward off negativity." },
  "#cf9d1a": { name: "Turmeric / Haldi", source: "Ground Turmeric Rhizomes", lore: "The color of warmth, dawn, and intellectual purity; traditionally ground daily by women." },
  "#facd12": { name: "Turmeric / Haldi", source: "Ground Turmeric Rhizomes", lore: "The color of warmth, dawn, and intellectual purity; traditionally ground daily by women." },
  "#d97706": { name: "Turmeric / Haldi", source: "Ground Turmeric Rhizomes", lore: "The color of warmth, dawn, and intellectual purity; traditionally ground daily by women." },
  "#2563eb": { name: "Neel / Indigo", source: "Indigofera Leaf Fermentation", lore: "Representing cosmic consciousness, the deep seas, and Lord Krishna's divine radiance." },
  "#1050a5": { name: "Neel / Indigo", source: "Indigofera Leaf Fermentation", lore: "Representing cosmic consciousness, the deep seas, and Lord Krishna's divine radiance." },
  "#1290de": { name: "Neel / Indigo", source: "Indigofera Leaf Fermentation", lore: "Representing cosmic consciousness, the deep seas, and Lord Krishna's divine radiance." },
  "#1e3a8a": { name: "Neel / Indigo", source: "Indigofera Leaf Fermentation", lore: "Representing cosmic consciousness, the deep seas, and Lord Krishna's divine radiance." },
  "#059669": { name: "Harit / Green", source: "Crushed Wild Beans & Leaves", lore: "Symbolizing abundance, fertility, and the dense monsoon forests of the Vindhya mountains." },
  "#12ad44": { name: "Harit / Green", source: "Crushed Wild Beans & Leaves", lore: "Symbolizing abundance, fertility, and the dense monsoon forests of the Vindhya mountains." },
  "#000000": { name: "Kajal / Lampblack", source: "Mustard Oil Wick Smoke", lore: "Formulated by collecting soot under earthen covers, believed to protect homes from evil eyes." },
  "#111827": { name: "Kajal / Lampblack", source: "Mustard Oil Wick Smoke", lore: "Formulated by collecting soot under earthen covers, believed to protect homes from evil eyes." },
  "#ffffff": { name: "Biswar / Rice Paste", source: "Steeped Rice Powder", lore: "Made by soaking and grinding new harvest rice; applied with fingers to create light-reflecting lines." },
  "#fafafa": { name: "Biswar / Rice Paste", source: "Steeped Rice Powder", lore: "Made by soaking and grinding new harvest rice; applied with fingers to create light-reflecting lines." },
  "#e91e63": { name: "Palash / Saffron-Rose", source: "Palash (Flame of Forest) Flowers", lore: "Squeezed liquid from spring blooms; produces high-vibrancy devotional pink and saffron." },
  "#de3469": { name: "Palash / Saffron-Rose", source: "Palash (Flame of Forest) Flowers", lore: "Squeezed liquid from spring blooms; produces high-vibrancy devotional pink and saffron." },
  "#ffd700": { name: "Swarna Vardh", source: "Pure Gold Flakes + Acacia Gum", lore: "Reserved for high-status devotional pieces since medieval times; reflects light beautifully in temples." },
  "#a355de": { name: "Jamun / Deep Berry", source: "Fermented Wild Berries", lore: "An organic deep violet pigment representing forest spirits and sacred mountain groves." },
};

function getPaintingRegions(id: string, paletteRef: string[] = ["#852222", "#cf9d1a", "#1050a5", "#ffffff"]) {
  if (PAINTING_REGIONS[id]) {
    return PAINTING_REGIONS[id];
  }
  // Dynamic mandala for custom paintings to make EVERY painting a playable coloring platform!
  return [
    { id: "canvas_background", name: "Traditional Canvas base", defaultColor: paletteRef[1] || "#f5f2eb" },
    { id: "outer_border", name: "Double-Line Temple Frame", defaultColor: paletteRef[0] || "#991b1b" },
    { id: "mandala_ring", name: "Aesthetic Lotus Mandala Ring", defaultColor: paletteRef[2] || "#1e3a8a" },
    { id: "pinnacle_circle", name: "Sacred Core Pinnacle", defaultColor: paletteRef[3] || "#ffffff" },
    { id: "corner_motifs", name: "Intricate Corner Peacocks", defaultColor: paletteRef[4] || paletteRef[0] || "#3e2723" }
  ];
}

function getPigmentInfo(hex: string) {
  const normalized = hex.toLowerCase();
  for (const key of Object.keys(PIGMENT_INFO)) {
    if (key.toLowerCase() === normalized) {
      return PIGMENT_INFO[key];
    }
  }
  return {
    name: "Natural Extract",
    source: "Mineral Stones & Ground Bark",
    lore: "A finely ground master-crafted pigment sourced from native mountain stones."
  };
}

export default function IndianPaintingsMoodBoard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedGI, setSelectedGI] = useState<string>("All");
  const [activePaintingId, setActivePaintingId] = useState<string>("warli");
  const [animationPlaying, setAnimationPlaying] = useState(true);
  const [breathSync, setBreathSync] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [isBreatheIn, setIsBreatheIn] = useState(true);
  const [isExpandedViewer, setIsExpandedViewer] = useState(false);

  // NEW: Interactive coloring workshop states
  const [paintingMode, setPaintingMode] = useState<"simulator" | "coloring">("coloring");
  const [selectedBrush, setSelectedBrush] = useState<string>("");
  const [coloringFills, setColoringFills] = useState<{ [key: string]: string }>({});
  const [sparkleTrigger, setSparkleTrigger] = useState(false);
  const [certificateOpen, setCertificateOpen] = useState(false);
  const [artSignature, setArtSignature] = useState("");
  const [unlockedCertificates, setUnlockedCertificates] = useState<string[]>([]);
  const [lastColoredRegionMessage, setLastColoredRegionMessage] = useState<string>("");

  // Sync brush color when active painting selection shifts
  useEffect(() => {
    const activeArtInfo = INDIAN_PAINTINGS.find((p) => p.id === activePaintingId);
    if (activeArtInfo && activeArtInfo.colorPalette && activeArtInfo.colorPalette.length > 0) {
      setSelectedBrush(activeArtInfo.colorPalette[0]);
    }
  }, [activePaintingId]);

  // Breathing loop simulation (6 second cycle: 3s inhale, 3s exhale)
  useEffect(() => {
    let interval: any = null;
    if (breathSync) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          const nextSec = prev + 1;
          if (nextSec % 3 === 0) {
            setIsBreatheIn((b) => !b);
          }
          return nextSec;
        });
      }, 1000);
    } else {
      setSeconds(0);
      setIsBreatheIn(true);
    }
    return () => clearInterval(interval);
  }, [breathSync]);

  const activeArt = INDIAN_PAINTINGS.find((p) => p.id === activePaintingId) || INDIAN_PAINTINGS[1];

  // Dynamic metrics for the interactive coloring canvas detail
  const currentRegions = getPaintingRegions(activeArt.id, activeArt.colorPalette);
  const totalRegionsCount = currentRegions.length;
  const coloringCount = currentRegions.filter(reg => coloringFills[`${activeArt.id}-${reg.id}`]).length;
  const completionPercentage = totalRegionsCount > 0 ? Math.round((coloringCount / totalRegionsCount) * 100) : 0;

  const handleAutoColorize = () => {
    const newFills = { ...coloringFills };
    currentRegions.forEach(reg => {
      newFills[`${activeArt.id}-${reg.id}`] = reg.defaultColor.startsWith("#") ? reg.defaultColor : (activeArt.colorPalette[3] || "#ffffff");
    });
    setColoringFills(newFills);
    setSparkleTrigger(true);
    setTimeout(() => setSparkleTrigger(false), 2000);
  };

  const handleClearCanvas = () => {
    const newFills = { ...coloringFills };
    currentRegions.forEach(reg => {
      delete newFills[`${activeArt.id}-${reg.id}`];
    });
    setColoringFills(newFills);
  };

  const filteredPaintings = INDIAN_PAINTINGS.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.identifier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesGI = selectedGI === "All" || p.giStatus === selectedGI;
    return matchesSearch && matchesCategory && matchesGI;
  });

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSelectedGI("All");
  };

  // Helper to render high-fidelity, interactive SVGs with distinct clickable segments to fill with colours
  const renderInteractiveColoringSVG = (id: string, isBig = false) => {
    const sizeClasses = isBig ? "w-full h-full min-h-[300px] md:min-h-[420px]" : "w-full h-64 md:h-80";
    
    // A quick helper to fill in the color
    const getFillColor = (regionId: string, defaultFallback: string) => {
      const key = `${id}-${regionId}`;
      return coloringFills[key] || defaultFallback;
    };

    const handleFillAction = (regionId: string, regionName: string) => {
      const key = `${id}-${regionId}`;
      const newFills = {
        ...coloringFills,
        [key]: selectedBrush
      };
      setColoringFills(newFills);
      setLastColoredRegionMessage(`Painted "${regionName}" with traditional pigment`);
    };

    switch (id) {
      case "warli":
        return (
          <div className={`relative flex items-center justify-center bg-[#8c3d1e] overflow-hidden rounded-2xl ${sizeClasses} transition-all border border-[#ebdcb9]/40 shadow-inner`}>
            <motion.svg 
              viewBox="0 0 200 200" 
              className="w-[85%] h-[85%] z-10 select-none drop-shadow-md"
              animate={animationPlaying ? { rotate: [0, 0.5, -0.5, 0] } : {}}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            >
              {/* Canvas Background */}
              <rect 
                x="0" 
                y="0" 
                width="200" 
                height="200" 
                fill={getFillColor("canvas_background", "#aa5e3c")} 
                className="cursor-crosshair transition-colors duration-300 hover:brightness-110 border-2"
                stroke="#6d3010"
                strokeWidth="1.5"
                onClick={() => handleFillAction("canvas_background", "Red Terracotta Mud Ground")}
              />
              {/* Sun Deity */}
              <motion.circle 
                cx="100" 
                cy="52" 
                r="13" 
                fill={getFillColor("sun", "#fbf5eb")} 
                stroke="#4a3020" 
                strokeWidth="1.5" 
                strokeDasharray="2,2"
                className="cursor-crosshair transition-colors duration-300"
                onClick={() => handleFillAction("sun", "Venerable Sun")}
                whileHover={{ scale: 1.08 }}
              />
              
              {/* Left Tree Leaves */}
              <motion.path 
                d="M 15,35 C 5,50 15,65 25,55 C 35,45 25,30 15,35 Z" 
                fill={getFillColor("tree_branches", "#eae5da")} 
                stroke="#4a3020" 
                strokeWidth="1"
                className="cursor-crosshair transition-all duration-300"
                onClick={() => handleFillAction("tree_branches", "Tribal Sacred Tree foliage")}
                whileHover={{ scale: 1.05 }}
              />
              {/* Left Tree Trunk */}
              <line x1="25" y1="55" x2="25" y2="90" stroke="#4a3020" strokeWidth="3" strokeLinecap="round" />

              {/* Right Tree Leaves */}
              <motion.path 
                d="M 185,35 C 175,50 185,65 175,55 C 165,45 175,30 185,35 Z" 
                fill={getFillColor("tree_branches", "#eae5da")} 
                stroke="#4a3020" 
                strokeWidth="1"
                className="cursor-crosshair transition-all duration-300"
                onClick={() => handleFillAction("tree_branches", "Tribal Sacred Tree foliage")}
                whileHover={{ scale: 1.05 }}
              />
              {/* Right Tree Trunk */}
              <line x1="175" y1="55" x2="175" y2="90" stroke="#4a3020" strokeWidth="3" strokeLinecap="round" />

              {/* Tarpa Musician */}
              {/* Tarpa horn */}
              <motion.path 
                d="M100 112 Q125 95 145 78 L142 70 Q120 88 95 110 Z" 
                fill={getFillColor("tarpa_horn", "#9e9185")} 
                stroke="#4a3020" 
                strokeWidth="1" 
                className="cursor-crosshair transition-colors duration-300"
                onClick={() => handleFillAction("tarpa_horn", "Ancient Tarpa Wind Instrument")}
                whileHover={{ scale: 1.05 }}
              />
              {/* Musician figure */}
              <motion.g 
                className="cursor-crosshair"
                onClick={() => handleFillAction("tarpa_musician", "Tarpa Musician")}
                whileHover={{ scale: 1.08 }}
              >
                <circle cx="100" cy="100" r="5" fill={getFillColor("tarpa_musician", "#eae5da")} stroke="#4a3020" />
                <path d="M100 105 L100 125 L92 145 M100 125 L108 145" stroke={getFillColor("tarpa_musician", "#eae5da")} strokeWidth="2.5" strokeLinecap="round" />
                <path d="M96 112 L104 112 M100 112 L98 122 L100 125" stroke={getFillColor("tarpa_musician", "#eae5da")} strokeWidth="2.5" strokeLinecap="round" />
              </motion.g>

              {/* Dancers in circle */}
              {/* Dancer 1 */}
              <motion.g 
                transform="translate(65, 130)" 
                className="cursor-crosshair"
                onClick={() => handleFillAction("dancer_1", "Circle Dancer A")}
                whileHover={{ scale: 1.1 }}
              >
                <circle cx="0" cy="-12" r="4.5" fill={getFillColor("dancer_1", "#dbd2be")} stroke="#4a3020" strokeWidth="1" />
                <path d="M-6 -6 L6 -6 L0 1 Z" fill={getFillColor("dancer_1", "#dbd2be")} stroke="#4a3020" strokeWidth="1" />
                <path d="M-6 8 L6 8 L0 1 Z" fill={getFillColor("dancer_1", "#dbd2be")} stroke="#4a3020" strokeWidth="1" />
                <path d="M-5 8 L-8 18 M5 8 L8 18" stroke="#4a3020" strokeWidth="2" strokeLinecap="round" />
              </motion.g>

              {/* Dancer 2 */}
              <motion.g 
                transform="translate(135, 130)" 
                className="cursor-crosshair"
                onClick={() => handleFillAction("dancer_2", "Circle Dancer B")}
                whileHover={{ scale: 1.1 }}
              >
                <circle cx="0" cy="-12" r="4.5" fill={getFillColor("dancer_2", "#dbd2be")} stroke="#4a3020" strokeWidth="1" />
                <path d="M-6 -6 L6 -6 L0 1 Z M-6 8 L6 8 L0 1 Z" fill={getFillColor("dancer_2", "#dbd2be")} stroke="#4a3020" strokeWidth="1" />
                <path d="M-5 8 L-8 18 M5 8 L8 18" stroke="#4a3020" strokeWidth="2" strokeLinecap="round" />
              </motion.g>

              {/* Dancer 3 */}
              <motion.g 
                transform="translate(80, 168)" 
                className="cursor-crosshair"
                onClick={() => handleFillAction("dancer_3", "Circle Dancer C")}
                whileHover={{ scale: 1.1 }}
              >
                <circle cx="0" cy="-12" r="4.5" fill={getFillColor("dancer_3", "#dbd2be")} stroke="#4a3020" strokeWidth="1" />
                <path d="M-6 -6 L6 -6 L0 1 Z M-6 8 L6 8 L0 1 Z" fill={getFillColor("dancer_3", "#dbd2be")} stroke="#4a3020" strokeWidth="1" />
                <path d="M-5 8 L-8 18 M5 8 L8 18" stroke="#4a3020" strokeWidth="2" strokeLinecap="round" />
              </motion.g>

              {/* Dancer 4 */}
              <motion.g 
                transform="translate(120, 168)" 
                className="cursor-crosshair"
                onClick={() => handleFillAction("dancer_4", "Circle Dancer D")}
                whileHover={{ scale: 1.1 }}
              >
                <circle cx="0" cy="-12" r="4.5" fill={getFillColor("dancer_4", "#dbd2be")} stroke="#4a3020" strokeWidth="1" />
                <path d="M-6 -6 L6 -6 L0 1 Z M-6 8 L6 8 L0 1 Z" fill={getFillColor("dancer_4", "#dbd2be")} stroke="#4a3020" strokeWidth="1" />
                <path d="M-5 8 L-8 18 M5 8 L8 18" stroke="#4a3020" strokeWidth="2" strokeLinecap="round" />
              </motion.g>

              {/* Birds and Wheat stalks */}
              <motion.path 
                d="M 20,130 Q 30,120 45,130 M 180,130 Q 170,120 155,130" 
                stroke={getFillColor("birds_and_wheat", "#9e9185")} 
                strokeWidth="2.5" 
                fill="none" 
                strokeLinecap="round"
                className="cursor-crosshair"
                onClick={() => handleFillAction("birds_and_wheat", "Wheat Germs & Flight Birds")}
                whileHover={{ scaleY: 1.15 }}
              />
            </motion.svg>
            <span className="absolute bottom-2.5 left-3 text-[9px] font-mono tracking-widest text-[#f5ebd6]/60 uppercase z-10">Warli Clay & Rice Paste Activity</span>
          </div>
        );

      case "madhubani":
        return (
          <div className={`relative flex items-center justify-center bg-[#fdfaf2] border-4 border-double border-[#be2222] overflow-hidden rounded-2xl ${sizeClasses} transition-all`}>
            <motion.svg 
              viewBox="0 0 200 200" 
              className="w-[90%] h-[90%] z-10"
              animate={animationPlaying ? { scale: [1, 1.01, 1] } : {}}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Ground canvas background */}
              <rect
                x="0"
                y="0"
                width="200"
                height="200"
                fill={getFillColor("canvas_background", "#f9f6e8")}
                className="cursor-crosshair"
                onClick={() => handleFillAction("canvas_background", "Mithila Handmade Paper wash")}
              />

              {/* Outer double border */}
              <rect 
                x="8" 
                y="8" 
                width="184" 
                height="184" 
                fill="none" 
                stroke={getFillColor("outer_border", "#be2222")} 
                strokeWidth="6" 
                className="cursor-crosshair transition-colors duration-200"
                onClick={() => handleFillAction("outer_border", "Red Madder Ground Border")}
              />
              <rect 
                x="14" 
                y="14" 
                width="172" 
                height="172" 
                fill="none" 
                stroke={getFillColor("inner_border", "#059669")} 
                strokeWidth="3.5" 
                className="cursor-crosshair transition-colors duration-200"
                onClick={() => handleFillAction("inner_border", "Green Forest Vines Border")}
              />

              {/* Sun Deity (Surya) top left */}
              <motion.g 
                transform="translate(42, 42)" 
                className="cursor-pointer"
                onClick={() => handleFillAction("sun_deity", "Splendid Surya (Sun Deity)")}
                whileHover={{ scale: 1.05 }}
              >
                <circle cx="0" cy="0" r="14" fill={getFillColor("sun_deity", "#e69e2e")} stroke="#000" strokeWidth="1.2" />
                <path d="M-18 0 H18 M0 -18 V18 M-12 -12 L12 12 M-12 12 L12 -12" stroke="#000" strokeWidth="0.8" />
              </motion.g>

              {/* Moon deity (Chandra) top right */}
              <motion.g 
                transform="translate(158, 42)" 
                className="cursor-pointer"
                onClick={() => handleFillAction("moon_deity", "Chandra (Crescent Moon Decor)")}
                whileHover={{ scale: 1.05 }}
              >
                <path d="M-10 -10 A 14 14 0 0 0 10 10 A 10 10 0 0 1 -10 -10 Z" fill={getFillColor("moon_deity", "#ffffff")} stroke="#000" strokeWidth="1.2" />
              </motion.g>

              {/* Central Lotus Flower */}
              <g transform="translate(100, 100)">
                <circle cx="0" cy="0" r="12" fill={getFillColor("lotus_center", "#2563eb")} stroke="#000" strokeWidth="1.2" className="cursor-crosshair" onClick={() => handleFillAction("lotus_center", "Central Lotus Receptacle")} />
                
                {/* Petal North */}
                <path d="M0 -12 Q-15 -35 0 -48 Q15 -35 0 -12 Z" fill={getFillColor("lotus_petal_1", "#b02a2a")} stroke="#000" strokeWidth="1.2" className="cursor-crosshair" onClick={() => handleFillAction("lotus_petal_1", "Sacred Lotus Petal (North)")} />
                {/* Petal South */}
                <path d="M0 12 Q-15 35 0 48 Q15 35 0 12 Z" fill={getFillColor("lotus_petal_2", "#b02a2a")} stroke="#000" strokeWidth="1.2" className="cursor-crosshair" onClick={() => handleFillAction("lotus_petal_2", "Sacred Lotus Petal (South)")} />
                {/* Petal East */}
                <path d="M12 0 Q35 -15 48 0 Q35 15 12 0 Z" fill={getFillColor("lotus_petal_3", "#cf9d1a")} stroke="#000" strokeWidth="1.2" className="cursor-crosshair" onClick={() => handleFillAction("lotus_petal_3", "Auspicious Lotus Petal (East)")} />
                {/* Petal West */}
                <path d="-12 0 Q-35 -15 -48 0 Q-35 15 -12 0 Z" fill={getFillColor("lotus_petal_4", "#cf9d1a")} stroke="#000" strokeWidth="1.2" className="cursor-crosshair" onClick={() => handleFillAction("lotus_petal_4", "Auspicious Lotus Petal (West)")} />
              </g>

              {/* Fish Swimming Bottom Left */}
              <motion.g 
                transform="translate(48, 145) scale(0.7) rotate(20)" 
                className="cursor-crosshair"
                onClick={() => handleFillAction("fish_1", "Sacred river carp (Lower Left)")}
                whileHover={{ scale: 1.08 }}
              >
                <path d="M-30 0 C-10 -20 20 -20 40 0 C20 20 -10 20 -30 0 Z" fill={getFillColor("fish_1", "#2563eb")} stroke="#000" strokeWidth="1.5" />
                <path d="M40 0 L55 -15 L48 0 L55 15 Z" fill={getFillColor("fish_1", "#2563eb")} stroke="#000" strokeWidth="1.2" />
                <circle cx="25" cy="-4" r="2" fill="#fff" />
              </motion.g>

              {/* Fish Swimming Bottom Right */}
              <motion.g 
                transform="translate(145, 145) scale(0.7) rotate(-20)" 
                className="cursor-crosshair"
                onClick={() => handleFillAction("fish_2", "Sacred fertility carp (Lower Right)")}
                whileHover={{ scale: 1.08 }}
              >
                <path d="M-30 0 C-10 -20 20 -20 40 0 C20 20 -10 20 -30 0 Z" fill={getFillColor("fish_2", "#cf9d1a")} stroke="#000" strokeWidth="1.5" />
                <path d="M40 0 L55 -15 L48 0 L55 15 Z" fill={getFillColor("fish_2", "#cf9d1a")} stroke="#000" strokeWidth="1.2" />
                <circle cx="25" cy="-4" r="2" fill="#fff" />
              </motion.g>

            </motion.svg>
            <span className="absolute bottom-2.5 left-3 text-[9px] font-mono tracking-widest text-[#be2222] uppercase font-bold">Madhubani Double-Line Workshop</span>
          </div>
        );

      case "gond":
        return (
          <div className={`relative flex items-center justify-center bg-[#0d1e3d] overflow-hidden rounded-2xl ${sizeClasses} transition-all`}>
            <motion.svg 
              viewBox="0 0 200 200" 
              className="w-[90%] h-[90%] z-10"
              animate={animationPlaying ? { rotate: [0, 0.4, -0.4, 0] } : {}}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
            >
              {/* Canvas ground background */}
              <rect
                x="0"
                y="0"
                width="200"
                height="200"
                fill={getFillColor("canvas_background", "#0d1e3d")}
                className="cursor-crosshair"
                onClick={() => handleFillAction("canvas_background", "Deep Gond Charcoal Noctrune")}
              />

              {/* Cosmic Tree of Life */}
              {/* Trunk */}
              <motion.path 
                d="M100 190 Q105 130 100 100 Q90 80 50 65 L55 60 Q90 75 100 95 L100 190"
                fill={getFillColor("trunk", "#fccd12")} 
                stroke="#ffffff" 
                strokeWidth="1.5" 
                className="cursor-crosshair"
                onClick={() => handleFillAction("trunk", "Cosmic Tree of Life Trunk")}
              />

              {/* Vine creepers left */}
              <motion.path 
                d="M100 130 Q70 120 40 148 Q60 162 100 130" 
                fill={getFillColor("vines_left", "#de3469")}
                stroke="#fff" 
                strokeWidth="1"
                className="cursor-crosshair"
                onClick={() => handleFillAction("vines_left", "Forest Vines Left")}
                whileHover={{ scale: 1.05 }}
              />
              {/* Vine creepers right */}
              <motion.path 
                d="M100 115 Q140 110 160 140 Q130 160 100 115"
                fill={getFillColor("vines_right", "#12ad44")}
                stroke="#fff" 
                strokeWidth="1"
                className="cursor-crosshair"
                onClick={() => handleFillAction("vines_right", "Forest Vines Right")}
                whileHover={{ scale: 1.05 }}
              />

              {/* Spirited tribal Peacock */}
              <motion.g 
                transform="translate(125, 60) scale(0.8) rotate(-15)" 
                className="cursor-crosshair"
                onClick={() => handleFillAction("peacock", "Spirited forest Peacock")}
                whileHover={{ scale: 1.08 }}
              >
                <path d="M0 25 C20 15 35 15 45 42 Q25 45 10 40 C-3 35 0 25 0 25 Z" fill={getFillColor("peacock", "#1290de")} stroke="#fff" strokeWidth="1" />
                <path d="M45 42 L52 35 M45 42 L50 49" stroke="#facd12" strokeWidth="1.5" />
                <circle cx="12" cy="30" r="1.5" fill="#fff" />
              </motion.g>

              {/* Forest Jumping Deer */}
              <motion.g 
                transform="translate(35, 78) scale(0.7) rotate(10)" 
                className="cursor-crosshair"
                onClick={() => handleFillAction("deer", "Horned forest Deer")}
                whileHover={{ scale: 1.08 }}
              >
                <path d="M5 25 Q18 20 32 30 L32 55 L24 55 L24 38 L10 38 L10 55 L0 55 Z" fill={getFillColor("deer", "#a355de")} stroke="#fff" strokeWidth="1" />
                <path d="M30 30 Q35 15 48 2 M30 30 Q25 15 15 6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
              </motion.g>

              {/* Spirit glow worms */}
              <motion.circle cx="45" cy="35" r="5.5" fill={getFillColor("spirit_orbs", "#ffffff")} stroke="#facd12" strokeWidth="1" className="cursor-crosshair" onClick={() => handleFillAction("spirit_orbs", "Ancestral light nodes")} whileHover={{ scale: 1.25 }} />
              <motion.circle cx="165" cy="110" r="4.5" fill={getFillColor("spirit_orbs", "#ffffff")} stroke="#de3469" strokeWidth="1" className="cursor-crosshair" onClick={() => handleFillAction("spirit_orbs", "Ancestral light nodes")} whileHover={{ scale: 1.25 }} />
              <motion.circle cx="155" cy="25" r="5" fill={getFillColor("spirit_orbs", "#ffffff")} stroke="#12ad44" strokeWidth="1" className="cursor-crosshair" onClick={() => handleFillAction("spirit_orbs", "Ancestral light nodes")} whileHover={{ scale: 1.25 }} />

            </motion.svg>
            <span className="absolute bottom-2.5 right-3 text-[9px] text-[#facd12] font-mono tracking-widest uppercase font-bold">Gond Textured Art Activity</span>
          </div>
        );

      case "pichwai":
        return (
          <div className={`relative flex items-center justify-center bg-[#030612] overflow-hidden rounded-2xl ${sizeClasses} transition-all`}>
            <div className="absolute inset-0 border border-amber-500/20 rounded-2xl m-3 pointer-events-none" />
            <motion.svg 
              viewBox="0 0 200 200" 
              className="w-[90%] h-[90%] z-10"
              animate={animationPlaying ? { scale: [1, 1.01, 1] } : {}}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <rect
                x="0"
                y="0"
                width="200"
                height="200"
                fill={getFillColor("canvas_background", "#040816")}
                className="cursor-crosshair"
                onClick={() => handleFillAction("canvas_background", "Deep Temple Midnight")}
              />
              <rect
                x="12"
                y="12"
                width="176"
                height="176"
                fill="none"
                stroke={getFillColor("ornaments_border", "#ffd700")}
                strokeWidth="4"
                className="cursor-crosshair"
                onClick={() => handleFillAction("ornaments_border", "Golden outline frame border")}
              />
              <motion.path
                d="M 28,188 L 28,68 Q100,5 172,68 L 172,188 Z"
                fill="none"
                stroke={getFillColor("gold_shrine_arch", "#6b5c2d")}
                strokeWidth="5"
                className="cursor-crosshair"
                onClick={() => handleFillAction("gold_shrine_arch", "Nathdwara Temple Archway")}
              />
              <g transform="translate(100, 108)">
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, k) => (
                  <g key={k} transform={`rotate(${angle})`}>
                    <motion.path 
                      d="M0 0 C-10 -20 0 -38 0 -38 C0 -38 10 -20 0 0 Z" 
                      fill={getFillColor("big_central_lotus", "#cc1852")} 
                      stroke="#ffd700" 
                      strokeWidth="1"
                      className="cursor-crosshair"
                      onClick={() => handleFillAction("big_central_lotus", "Lotus Bloom Petal")}
                      whileHover={{ scale: 1.05 }}
                    />
                  </g>
                ))}
                <circle cx="0" cy="0" r="11" fill={getFillColor("gold_shrine_arch", "#ffd700")} stroke="#cc1852" strokeWidth="1" />
                <circle cx="0" cy="0" r="6" fill="#030612" />
              </g>
              <motion.g 
                transform="translate(38, 128) scale(0.65)" 
                className="cursor-crosshair"
                onClick={() => handleFillAction("left_kamadhenu", "Sacred cow Left")}
              >
                <path d="M10 20 Q40 20 60 30 L60 55 L52 55 L52 38 L25 38 L25 55 L16 55 L12 35 Q5 35 0 30 L5 20 Z" fill={getFillColor("left_kamadhenu", "#fdfaf0")} stroke="#ffd700" strokeWidth="1.2" />
                <circle cx="10" cy="24" r="2.5" fill="#e91e63" />
              </motion.g>
              <motion.g 
                transform="translate(162, 128) scale(0.65) scaleX(-1)" 
                className="cursor-crosshair"
                onClick={() => handleFillAction("right_kamadhenu", "Sacred cow Right")}
              >
                <path d="M10 20 Q40 20 60 30 L60 55 L52 55 L52 38 L25 38 L25 55 L16 55 L12 35 Q5 35 0 30 L5 20 Z" fill={getFillColor("right_kamadhenu", "#fdfaf0")} stroke="#ffd700" strokeWidth="1.2" />
                <circle cx="10" cy="24" r="2.5" fill="#e91e63" />
              </motion.g>
            </motion.svg>
            <span className="absolute bottom-2.5 left-3 text-[9px] font-mono tracking-widest text-[#ffd700] uppercase font-bold">Pichwai Lotus Devotional Canvas</span>
          </div>
        );

      case "aipan":
        return (
          <div className={`relative flex items-center justify-center bg-[#8b1414] overflow-hidden rounded-2xl ${sizeClasses} transition-all`}>
            <motion.svg 
              viewBox="0 0 200 200" 
              className="w-[90%] h-[90%] z-10 text-white"
              animate={animationPlaying ? { rotate: [0, 0.2, -0.2, 0] } : {}}
              transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
            >
              <rect 
                x="0" 
                y="0" 
                width="200" 
                height="200" 
                fill={getFillColor("canvas_background", "#8b1414")} 
                className="cursor-crosshair"
                onClick={() => handleFillAction("canvas_background", "Aipan Terracotta Geru mud ground")}
              />
              <motion.rect
                x="14" y="10" width="6" height="180" 
                fill={getFillColor("vasudhara_lines", "#eaeaea")} 
                className="cursor-crosshair"
                onClick={() => handleFillAction("vasudhara_lines", "Vasudhara whitewash band")}
              />
              <motion.rect
                x="24" y="10" width="6" height="180" 
                fill={getFillColor("vasudhara_lines", "#eaeaea")} 
                className="cursor-crosshair"
                onClick={() => handleFillAction("vasudhara_lines", "Vasudhara whitewash band")}
              />
              <motion.rect
                x="34" y="10" width="6" height="180" 
                fill={getFillColor("vasudhara_lines", "#eaeaea")} 
                className="cursor-crosshair"
                onClick={() => handleFillAction("vasudhara_lines", "Vasudhara whitewash band")}
              />
              <g transform="translate(118, 100)">
                <motion.circle 
                  cx="0" cy="0" r="46" 
                  fill="none" 
                  stroke={getFillColor("inner_mandala_ring", "#ffffff")} 
                  strokeWidth="2.5" 
                  className="cursor-crosshair"
                  onClick={() => handleFillAction("inner_mandala_ring", "Geometric Inner Mandala bounds")}
                />
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                  <path 
                    key={deg}
                    d="M0 0 C-5 -12 0 -24 0 -24 C0 -24 5 -12 0 0" 
                    fill="none" 
                    stroke={getFillColor("inner_mandala_ring", "#ffffff")} 
                    strokeWidth="1.2" 
                    transform={`rotate(${deg})`} 
                    className="cursor-crosshair"
                    onClick={() => handleFillAction("inner_mandala_ring", "Concentric petals mandala")}
                  />
                ))}
                <motion.path 
                  d="M-10 0 H10 M0 -10 V10 M-10 -10 H0 V0 M10 10 H0 V0" 
                  stroke={getFillColor("swastika_symbol_center", "#ffffff")} 
                  strokeWidth="2.5" 
                  className="cursor-crosshair"
                  onClick={() => handleFillAction("swastika_symbol_center", "Sacred Swastika Core center")}
                />
                <g transform="translate(-14, 22) scale(0.65)" className="cursor-crosshair" onClick={() => handleFillAction("goddess_footprint_1", "Lakshmi entrance footprint (left)")}>
                  <path d="M4 12 C1 12 1 18 4 18 C7 18 7 12 4 12" fill={getFillColor("goddess_footprint_1", "#ffffff")} />
                  <circle cx="2.2" cy="9.5" r="1" fill={getFillColor("goddess_footprint_1", "#ffffff")} />
                  <circle cx="3.8" cy="8" r="1.2" fill={getFillColor("goddess_footprint_1", "#ffffff")} />
                  <circle cx="6" cy="8" r="1.2" fill={getFillColor("goddess_footprint_1", "#ffffff")} />
                  <circle cx="7.8" cy="9.5" r="1" fill={getFillColor("goddess_footprint_1", "#ffffff")} />
                </g>
                <g transform="translate(4, 22) scale(0.65)" className="cursor-crosshair" onClick={() => handleFillAction("goddess_footprint_2", "Lakshmi entrance footprint (right)")}>
                  <path d="M4 12 C1 12 1 18 4 18 C7 18 7 12 4 12" fill={getFillColor("goddess_footprint_2", "#ffffff")} />
                  <circle cx="2.2" cy="9.5" r="1" fill={getFillColor("goddess_footprint_2", "#ffffff")} />
                  <circle cx="3.8" cy="8" r="1.2" fill={getFillColor("goddess_footprint_2", "#ffffff")} />
                  <circle cx="6" cy="8" r="1.2" fill={getFillColor("goddess_footprint_2", "#ffffff")} />
                  <circle cx="7.8" cy="9.5" r="1" fill={getFillColor("goddess_footprint_2", "#ffffff")} />
                </g>
              </g>
            </motion.svg>
            <span className="absolute bottom-2.5 left-3 text-[9px] font-mono tracking-widest text-[#f9fafb]/60 uppercase">Uttarakhand Ritual Aipan Mandalas</span>
          </div>
        );

      default:
        return renderTraditionalArtwork(id, isBig, true, getFillColor, handleFillAction);
    }
  };

    const renderTraditionalArtwork = (id: string, isBig: boolean, isColoring: boolean, getFillColor?: (regionId: string, defaultColor: string) => string, handleFillAction?: (regionId: string, regionName: string) => void) => {
    const sizeClasses = isBig ? "w-full h-full min-h-[300px] md:min-h-[420px]" : "w-full h-64 md:h-80";
    const simSizeClasses = isBig ? "w-full h-full min-h-[300px] md:min-h-[420px]" : "w-full h-32";
    const containerClasses = isColoring 
      ? `relative flex items-center justify-center overflow-hidden rounded-2xl ${sizeClasses} transition-all border border-[#ebdcb9]/40 shadow-inner`
      : `relative flex items-center justify-center overflow-hidden rounded-2xl ${simSizeClasses} transition-all`;

    const getFill = (regionId: string, defaultFallback: string) => {
      if (isColoring && getFillColor) {
        return getFillColor(regionId, defaultFallback);
      }
      return defaultFallback;
    };

    const handleClick = (regionId: string, regionName: string) => {
      if (isColoring && handleFillAction) {
        handleFillAction(regionId, regionName);
      }
    };

    const painting = INDIAN_PAINTINGS.find(p => p.id === id) || INDIAN_PAINTINGS[0];
    const palette = painting.colorPalette;

    switch (id) {
      case "pattachitra":
        return (
          <div className={containerClasses} style={{ backgroundColor: getFill("canvas_background", "#fbf6e8") }}>
            <motion.svg viewBox="0 0 200 200" className="w-[85%] h-[85%] z-10 drop-shadow-md">
              <rect x="5" y="5" width="190" height="190" fill="none" stroke={getFill("outer_border", palette[0] || "#852222")} strokeWidth="4" onClick={() => handleClick("outer_border", "Ornate Border Line")} />
              <rect x="12" y="12" width="176" height="176" fill="none" stroke={getFill("mandala_ring", palette[1] || "#cf9d1a")} strokeWidth="2" strokeDasharray="3,3" onClick={() => handleClick("mandala_ring", "Dotted Inner Border")} />
              
              <path d="M30 180 V80 Q100 20 170 80 V180 Z" fill="none" stroke={getFill("outer_border", palette[0] || "#852222")} strokeWidth="3" onClick={() => handleClick("outer_border", "Sacred Temple Arch")} />
              
              <g transform="translate(100, 100)">
                <circle cx="0" cy="-10" r="35" fill={getFill("pinnacle_circle", "#ffffff")} stroke={getFill("outer_border", palette[3] || "#000000")} strokeWidth="2.5" onClick={() => handleClick("pinnacle_circle", "Central Deity Halo")} />
                
                <ellipse cx="-15" cy="-10" rx="10" ry="6" fill={getFill("pinnacle_circle", "#ffffff")} stroke={getFill("outer_border", "#000000")} strokeWidth="2" onClick={() => handleClick("pinnacle_circle", "Lotus Eyes (Left)")} />
                <circle cx="-15" cy="-10" r="4.5" fill={getFill("outer_border", "#000000")} />
                <circle cx="-15" cy="-10" r="1.5" fill="#ffffff" />
                
                <ellipse cx="15" cy="-10" rx="10" ry="6" fill={getFill("pinnacle_circle", "#ffffff")} stroke={getFill("outer_border", "#000000")} strokeWidth="2" onClick={() => handleClick("pinnacle_circle", "Lotus Eyes (Right)")} />
                <circle cx="15" cy="-10" r="4.5" fill={getFill("outer_border", "#000000")} />
                <circle cx="15" cy="-10" r="1.5" fill="#ffffff" />
                
                <path d="M-4 -35 Q0 -25 4 -35 Q1 -15 0 0 Q-1 -15 -4 -35 Z" fill={getFill("corner_motifs", palette[2] || "#1050a5")} onClick={() => handleClick("corner_motifs", "Auspicious Tilak Mark")} />
                
                <path d="M-45 30 C-30 20 -15 40 0 30 C15 40 30 20 45 30 L40 45 H-40 Z" fill={getFill("corner_motifs", palette[0] || "#852222")} stroke={getFill("outer_border", "#000000")} strokeWidth="1.5" onClick={() => handleClick("corner_motifs", "Lotus Pedestal Seat")} />
              </g>
            </motion.svg>
            <span className="absolute bottom-2 left-3 text-[8.5px] font-mono tracking-widest text-stone-550 dark:text-stone-400 uppercase z-10">Puri Pattachitra Temple Scroll</span>
          </div>
        );

      case "kalamkari":
        return (
          <div className={containerClasses} style={{ backgroundColor: getFill("canvas_background", "#f3eeda") }}>
            <motion.svg viewBox="0 0 200 200" className="w-[85%] h-[85%] z-10 drop-shadow-md">
              <rect x="6" y="6" width="188" height="188" fill="none" stroke={getFill("outer_border", palette[0] || "#542518")} strokeWidth="3" onClick={() => handleClick("outer_border", "Srikalahasti Border Frame")} />
              
              <path d="M100 190 Q95 150 85 130 Q70 100 75 70 T105 30 T130 50" fill="none" stroke={getFill("mandala_ring", palette[0] || "#542518")} strokeWidth="6" strokeLinecap="round" onClick={() => handleClick("mandala_ring", "Tree of Life Trunk")} />
              
              <path d="M85 130 Q60 120 45 100 T50 70" fill="none" stroke={getFill("mandala_ring", palette[0] || "#542518")} strokeWidth="3.5" strokeLinecap="round" onClick={() => handleClick("mandala_ring", "Left Branch")} />
              <path d="M78 95 Q110 80 125 70 T150 90" fill="none" stroke={getFill("mandala_ring", palette[0] || "#542518")} strokeWidth="3.5" strokeLinecap="round" onClick={() => handleClick("mandala_ring", "Right Branch")} />
              
              {[
                { cx: 50, cy: 70, rx: 8, ry: 13, rot: -30, color: palette[1] || "#2d4530" },
                { cx: 45, cy: 100, rx: 7, ry: 11, rot: -60, color: palette[2] || "#baa058" },
                { cx: 105, cy: 30, rx: 9, ry: 14, rot: 15, color: palette[1] || "#2d4530" },
                { cx: 130, cy: 50, rx: 8, ry: 12, rot: 45, color: palette[2] || "#baa058" },
                { cx: 150, cy: 90, rx: 7, ry: 11, rot: 60, color: palette[1] || "#2d4530" },
                { cx: 75, cy: 70, rx: 6, ry: 10, rot: -10, color: palette[2] || "#baa058" },
                { cx: 125, cy: 70, rx: 6, ry: 10, rot: 20, color: palette[1] || "#2d4530" }
              ].map((leaf, idx) => (
                <ellipse 
                  key={idx} 
                  cx={leaf.cx} 
                  cy={leaf.cy} 
                  rx={leaf.rx} 
                  ry={leaf.ry} 
                  transform={`rotate(${leaf.rot}, ${leaf.cx}, ${leaf.cy})`}
                  fill={getFill("pinnacle_circle", leaf.color)}
                  stroke={palette[0]}
                  strokeWidth="1.2"
                  className="cursor-crosshair"
                  onClick={() => handleClick("pinnacle_circle", "Sacred Tree Leaf")}
                />
              ))}

              <g transform="translate(110, 100) scale(0.65)" onClick={() => handleClick("corner_motifs", "Auspicious Peacock")} className="cursor-crosshair">
                <path d="M 0 40 Q -15 30 -10 10 Q -5 0 -15 -10 Q -10 -25 5 -20 Q 20 -10 10 20 Q 25 30 30 50 Z" fill={getFill("corner_motifs", palette[3] || "#121d28")} stroke={palette[0]} strokeWidth="1.5" />
                <path d="M -15 -10 Q -25 -20 -35 -15 M -12 -15 Q -22 -30 -30 -32" stroke={palette[0]} strokeWidth="2.5" strokeLinecap="round" />
              </g>
            </motion.svg>
            <span className="absolute bottom-2 left-3 text-[8.5px] font-mono tracking-widest text-stone-550 dark:text-stone-400 uppercase z-10">Kalamkari Tree of Life</span>
          </div>
        );

      case "bhil_art":
        return (
          <div className={containerClasses} style={{ backgroundColor: getFill("canvas_background", "#fdfaf2") }}>
            <motion.svg viewBox="0 0 200 200" className="w-[85%] h-[85%] z-10 drop-shadow-md">
              <rect x="5" y="5" width="190" height="190" fill="none" stroke={getFill("outer_border", palette[0] || "#ff5722")} strokeWidth="4.5" onClick={() => handleClick("outer_border", "Ochre Clay Border")} />
              
              <path 
                d="M 40,110 C 50,110 65,95 70,80 C 72,70 65,55 70,45 C 75,35 85,35 90,45 C 92,55 82,75 88,85 C 105,85 130,80 150,95 C 160,102 165,115 160,125 C 150,135 125,130 110,132 C 85,135 55,130 40,110 Z" 
                fill={getFill("mandala_ring", palette[1] || "#ffeb3b")} 
                stroke={palette[0]} 
                strokeWidth="2" 
                className="cursor-crosshair"
                onClick={() => handleClick("mandala_ring", "Ritual Horse Base Silhouette")} 
              />
              
              <path d="M 50,110 L 40,165 M 65,108 L 58,165 M 130,118 L 132,165 M 150,123 L 158,165" stroke={palette[0]} strokeWidth="4" strokeLinecap="round" />
              
              <path d="M 82,40 Q 88,25 90,20 M 86,42 Q 95,30 96,25" stroke={palette[0]} strokeWidth="3.5" strokeLinecap="round" />
              <path d="M 160,115 Q 175,135 180,160" stroke={palette[0]} strokeWidth="3" strokeLinecap="round" />

              {[
                { cx: 50, cy: 105 }, { cx: 62, cy: 98 }, { cx: 70, cy: 88 }, { cx: 72, cy: 75 }, 
                { cx: 70, cy: 62 }, { cx: 73, cy: 50 }, { cx: 80, cy: 45 }, { cx: 88, cy: 52 },
                { cx: 84, cy: 65 }, { cx: 82, cy: 78 }, { cx: 88, cy: 90 }, { cx: 100, cy: 90 },
                { cx: 112, cy: 90 }, { cx: 125, cy: 92 }, { cx: 138, cy: 96 }, { cx: 148, cy: 102 },
                { cx: 154, cy: 110 }, { cx: 150, cy: 120 }, { cx: 138, cy: 122 }, { cx: 125, cy: 124 },
                { cx: 112, cy: 125 }, { cx: 100, cy: 125 }, { cx: 88, cy: 122 }, { cx: 75, cy: 120 },
                { cx: 62, cy: 115 }, { cx: 100, cy: 108 }, { cx: 112, cy: 108 }, { cx: 125, cy: 110 }
              ].map((dot, dIdx) => (
                <circle 
                  key={dIdx} 
                  cx={dot.cx} 
                  cy={dot.cy} 
                  r="2.5" 
                  fill={getFill("pinnacle_circle", palette[2 + (dIdx % 3)] || "#4caf50")} 
                  className="cursor-crosshair"
                  onClick={() => handleClick("pinnacle_circle", "Bhil Ancestral Seeds of Life Dots")}
                />
              ))}
            </motion.svg>
            <span className="absolute bottom-2 left-3 text-[8.5px] font-mono tracking-widest text-stone-550 dark:text-stone-400 uppercase z-10">Bhil Rhythmic Dot Art</span>
          </div>
        );

      case "phad":
        return (
          <div className={containerClasses} style={{ backgroundColor: getFill("canvas_background", "#ffeaa7") }}>
            <motion.svg viewBox="0 0 200 200" className="w-[85%] h-[85%] z-10 drop-shadow-md">
              <rect x="5" y="5" width="190" height="190" fill="none" stroke={getFill("outer_border", palette[0] || "#c62828")} strokeWidth="4.5" onClick={() => handleClick("outer_border", "Traditional Phad Frame")} />
              
              <path d="M20,30 L180,30 L160,45 L40,45 Z" fill={getFill("outer_border", palette[0] || "#c62828")} onClick={() => handleClick("outer_border", "Royal Canopy")} />
              
              <g transform="translate(20, 45) scale(0.85)">
                <path d="M50,110 Q70,90 90,80 Q105,70 120,40 Q130,50 125,65 Q115,85 125,95 C145,95 160,105 170,120 C175,130 155,140 140,142 C110,145 70,140 50,110 Z" fill={getFill("mandala_ring", palette[3] || "#ffffff")} stroke="#c62828" strokeWidth="2.5" onClick={() => handleClick("mandala_ring", "Heroic Pabuji Steed")} />
                
                <g transform="translate(100, 50)" className="cursor-crosshair" onClick={() => handleClick("pinnacle_circle", "Folk Hero Pabuji")}>
                  <path d="M-10,35 L10,35 L5,15 L-5,15 Z" fill={getFill("pinnacle_circle", palette[2] || "#2e7d32")} />
                  <circle cx="0" cy="5" r="8" fill={getFill("pinnacle_circle", palette[1] || "#fcc02a")} />
                  <path d="M-4,10 L-25,-10 L-21,-14 L0,5 Z" fill="#78350f" />
                </g>
                
                <path d="M120,38 L145,20 L130,42 Z" fill={getFill("corner_motifs", palette[1] || "#fcc02a")} onClick={() => handleClick("corner_motifs", "Royal Standard Banner")} />
              </g>
            </motion.svg>
            <span className="absolute bottom-2 left-3 text-[8.5px] font-mono tracking-widest text-stone-550 dark:text-stone-400 uppercase z-10">Rajasthani Phad Temple Scroll</span>
          </div>
        );

      case "pithora":
        return (
          <div className={containerClasses} style={{ backgroundColor: getFill("canvas_background", "#fefdfa") }}>
            <motion.svg viewBox="0 0 200 200" className="w-[85%] h-[85%] z-10 drop-shadow-md">
              <rect x="8" y="8" width="184" height="184" fill="none" stroke={getFill("outer_border", palette[0] || "#e53935")} strokeWidth="3" onClick={() => handleClick("outer_border", "Baba Pithora Sacred Frame")} />
              
              {[
                { tx: 25, ty: 45, color: palette[0] || "#e53935", name: "Red Holy Horse" },
                { tx: 85, ty: 75, color: palette[1] || "#1e88e5", name: "Blue Holy Horse" },
                { tx: 40, ty: 110, color: palette[3] || "#fdd835", name: "Yellow Holy Horse" }
              ].map((horse, idx) => (
                <g key={idx} transform={`translate(${horse.tx}, ${horse.ty}) scale(0.6)`} className="cursor-crosshair" onClick={() => handleClick("mandala_ring", horse.name)}>
                  <path d="M10,40 Q30,25 45,15 Q55,5 60,18 Q55,30 60,35 C75,35 85,42 90,52 C95,58 85,65 75,66 C55,68 30,65 10,40 Z" fill={getFill("mandala_ring", horse.color)} stroke="#000000" strokeWidth="1.5" />
                  <line x1="20" y1="40" x2="15" y2="75" stroke="#000000" strokeWidth="3" />
                  <line x1="32" y1="42" x2="28" y2="75" stroke="#000000" strokeWidth="3" />
                  <line x1="65" y1="46" x2="62" y2="75" stroke="#000000" strokeWidth="3" />
                  <line x1="75" y1="48" x2="78" y2="75" stroke="#000000" strokeWidth="3" />
                </g>
              ))}

              <circle cx="35" cy="30" r="10" fill={getFill("pinnacle_circle", palette[3] || "#fdd835")} onClick={() => handleClick("pinnacle_circle", "Sun Deity")} />
              <path d="M155,25 Q165,25 170,35 Q160,38 155,25" fill={getFill("pinnacle_circle", palette[4] || "#ffffff")} onClick={() => handleClick("pinnacle_circle", "Moon Companion")} />
            </motion.svg>
            <span className="absolute bottom-2 left-3 text-[8.5px] font-mono tracking-widest text-stone-550 dark:text-stone-400 uppercase z-10">Rathwa Pithora Mural</span>
          </div>
        );

      case "kalighat":
        return (
          <div className={containerClasses} style={{ backgroundColor: getFill("canvas_background", "#fafafa") }}>
            <motion.svg viewBox="0 0 200 200" className="w-[85%] h-[85%] z-10 drop-shadow-md">
              <rect x="5" y="5" width="190" height="190" fill="none" stroke={getFill("outer_border", palette[3] || "#64748b")} strokeWidth="2" onClick={() => handleClick("outer_border", "Fine Line Margin")} />
              
              <g transform="translate(100, 100) scale(0.9)" className="cursor-crosshair" onClick={() => handleClick("mandala_ring", "Babu Satirical Cat Body")}>
                <path d="M-40,60 C-60,40 -50,-10 -20,-30 C-30,-45 -10,-55 0,-35 C15,-55 30,-45 20,-30 C50,-10 60,40 40,60 C35,68 -35,68 -40,60 Z" fill={getFill("mandala_ring", palette[0] || "#1e293b")} />
                
                <ellipse cx="-12" cy="-22" rx="6" ry="3" fill="#ffffff" />
                <circle cx="-12" cy="-22" r="2.5" fill="#000000" />
                <ellipse cx="12" cy="-22" rx="6" ry="3" fill="#ffffff" />
                <circle cx="12" cy="-22" r="2.5" fill="#000000" />
                
                <g transform="translate(0, -5) scale(0.85)" onClick={(e) => { e.stopPropagation(); handleClick("pinnacle_circle", "Sacred Silver Fish"); }}>
                  <path d="M-35,0 C-15,-10 15,-10 35,0 C15,10 -15,10 -35,0 Z" fill={getFill("pinnacle_circle", palette[2] || "#eab308")} stroke="#000000" strokeWidth="1.5" />
                  <path d="M35,0 L48,-8 L42,0 L48,8 Z" fill={getFill("pinnacle_circle", palette[1] || "#ef4444")} />
                  <circle cx="-25" cy="-2" r="2.5" fill="#ffffff" />
                  <circle cx="-25" cy="-2" r="1" fill="#000000" />
                </g>

                <path d="M35,50 Q75,30 80,0 Q82,-20 70,-22" fill="none" stroke={getFill("mandala_ring", palette[0] || "#1e293b")} strokeWidth="8" strokeLinecap="round" />
              </g>
            </motion.svg>
            <span className="absolute bottom-2 left-3 text-[8.5px] font-mono tracking-widest text-stone-550 dark:text-stone-400 uppercase z-10">Bazar Kalighat Cat Art</span>
          </div>
        );

      case "cheriyal":
        return (
          <div className={containerClasses} style={{ backgroundColor: getFill("canvas_background", "#b91c1c") }}>
            <motion.svg viewBox="0 0 200 200" className="w-[85%] h-[85%] z-10 drop-shadow-md">
              <line x1="10" y1="100" x2="190" y2="100" stroke={getFill("outer_border", palette[3] || "#047857")} strokeWidth="4.5" onClick={() => handleClick("outer_border", "Scroll Panels Divider")} />
              <rect x="5" y="5" width="190" height="190" fill="none" stroke={getFill("outer_border", palette[3] || "#047857")} strokeWidth="4.5" onClick={() => handleClick("outer_border", "Sacred Border Frame")} />
              
              <g transform="translate(100, 50) scale(0.85)" className="cursor-crosshair" onClick={() => handleClick("pinnacle_circle", "Epic Narrative King")}>
                <circle cx="0" cy="0" r="28" fill={getFill("pinnacle_circle", palette[1] || "#fbbf24")} stroke="#000000" strokeWidth="2" />
                <path d="M-15,-8 Q0,-15 15,-8" stroke="#000000" strokeWidth="3" fill="none" />
                <ellipse cx="-10" cy="-2" rx="5" ry="3.5" fill="#ffffff" stroke="#000000" strokeWidth="1" />
                <circle cx="-9" cy="-2" r="2" fill="#000000" />
                <ellipse cx="10" cy="-2" rx="5" ry="3.5" fill="#ffffff" stroke="#000000" strokeWidth="1" />
                <circle cx="9" cy="-2" r="2" fill="#000000" />
                <path d="M-15,10 Q0,25 15,10" fill="none" stroke="#000000" strokeWidth="2.5" />
                
                <path d="M-22,-20 L-26,-40 L0,-30 L26,-40 L22,-20 Z" fill={getFill("corner_motifs", palette[2] || "#ffffff")} stroke="#000000" strokeWidth="1.5" />
              </g>

              <g transform="translate(100, 150) scale(0.65)" className="cursor-crosshair" onClick={() => handleClick("mandala_ring", "Folk Performers")}>
                <g transform="translate(-40, 0)">
                  <circle cx="0" cy="-24" r="8" fill={getFill("mandala_ring", "#ffffff")} />
                  <path d="M-12,-12 L12,-12 L0,15 Z" fill={getFill("pinnacle_circle", palette[1] || "#fbbf24")} />
                  <line x1="0" y1="15" x2="-8" y2="35" stroke="#ffffff" strokeWidth="2.5" />
                  <line x1="0" y1="15" x2="8" y2="35" stroke="#ffffff" strokeWidth="2.5" />
                </g>
                <g transform="translate(40, 0)">
                  <circle cx="0" cy="-24" r="8" fill={getFill("mandala_ring", "#ffffff")} />
                  <path d="M-12,-12 L12,-12 L0,15 Z" fill={getFill("pinnacle_circle", palette[1] || "#fbbf24")} />
                  <line x1="0" y1="15" x2="-8" y2="35" stroke="#ffffff" strokeWidth="2.5" />
                  <line x1="0" y1="15" x2="8" y2="35" stroke="#ffffff" strokeWidth="2.5" />
                </g>
              </g>
            </motion.svg>
            <span className="absolute bottom-2 left-3 text-[8.5px] font-mono tracking-widest text-[#ffffff]/60 uppercase z-10">Cheriyal Story Scroll</span>
          </div>
        );

      case "saura":
        return (
          <div className={containerClasses} style={{ backgroundColor: getFill("canvas_background", "#7c2d12") }}>
            <motion.svg viewBox="0 0 200 200" className="w-[85%] h-[85%] z-10 drop-shadow-md">
              <rect x="8" y="8" width="184" height="184" fill="none" stroke={getFill("outer_border", palette[0] || "#ffffff")} strokeWidth="4.5" onClick={() => handleClick("outer_border", "Fish-Bone Border Frame")} />
              {[15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180].map((pos) => (
                <g key={pos} stroke={getFill("outer_border", palette[0] || "#ffffff")} strokeWidth="1">
                  <line x1={pos} y1="8" x2={pos + 5} y2="14" />
                  <line x1={pos} y1="192" x2={pos + 5} y2="186" />
                  <line x1="8" y1={pos} x2="14" y2={pos + 5} />
                  <line x1="192" y1={pos} x2="186" y2={pos + 5} />
                </g>
              ))}
              
              <g transform="translate(100, 100)" className="cursor-crosshair" onClick={() => handleClick("pinnacle_circle", "Ancestral Spirit Ladder")}>
                <line x1="-8" y1="-50" x2="-8" y2="50" stroke={getFill("pinnacle_circle", "#ffffff")} strokeWidth="2" />
                <line x1="8" y1="-50" x2="8" y2="50" stroke={getFill("pinnacle_circle", "#ffffff")} strokeWidth="2" />
                {[-40, -25, -10, 5, 20, 35].map((yVal) => (
                  <line key={yVal} x1="-8" y1={yVal} x2="8" y2={yVal} stroke={getFill("pinnacle_circle", "#ffffff")} strokeWidth="1.8" />
                ))}
              </g>

              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                <g 
                  key={deg} 
                  transform={`translate(100, 100) rotate(${deg}) translate(0, -62)`}
                  className="cursor-crosshair"
                  onClick={() => handleClick("mandala_ring", "Ritual Circle Dancers")}
                >
                  <circle cx="0" cy="-8" r="3" fill={getFill("mandala_ring", "#ffffff")} />
                  <path d="M-4,0 L4,0 L0,7 Z" fill={getFill("mandala_ring", "#ffffff")} />
                  <path d="M-4,7 L4,7 L0,0 Z" fill={getFill("mandala_ring", "#ffffff")} />
                  <line x1="-3" y1="7" x2="-5" y2="14" stroke={getFill("mandala_ring", "#ffffff")} strokeWidth="1" />
                  <line x1="3" y1="7" x2="5" y2="14" stroke={getFill("mandala_ring", "#ffffff")} strokeWidth="1" />
                </g>
              ))}
            </motion.svg>
            <span className="absolute bottom-2 left-3 text-[8.5px] font-mono tracking-widest text-stone-300 uppercase z-10">Lanjia Saura Ancestral Mural</span>
          </div>
        );

      case "sohrai_khovar":
        return (
          <div className={containerClasses} style={{ backgroundColor: getFill("canvas_background", "#1c1917") }}>
            <motion.svg viewBox="0 0 200 200" className="w-[85%] h-[85%] z-10 drop-shadow-md">
              <rect x="6" y="6" width="188" height="188" fill="none" stroke={getFill("outer_border", palette[2] || "#7c2d12")} strokeWidth="5.5" onClick={() => handleClick("outer_border", "Earthen Clay Outer Border")} />
              
              <path d="M20,35 Q60,10 100,30 T180,25" fill="none" stroke={getFill("corner_motifs", palette[3] || "#ca8a04")} strokeWidth="3" strokeLinecap="round" onClick={() => handleClick("corner_motifs", "Sacred Forest Vine")} />
              
              <g transform="translate(100, 115) scale(0.95)" className="cursor-crosshair" onClick={() => handleClick("mandala_ring", "Matrilineal Forest Elephant")}>
                <path d="M-40,15 C-60,-5 -50,-40 -15,-45 C15,-48 30,-30 40,-15 C45,-5 40,22 15,25 C-10,24 -25,25 -40,15 Z" fill={getFill("mandala_ring", palette[1] || "#f9fafb")} />
                
                <rect x="-35" y="15" width="10" height="30" fill={getFill("mandala_ring", palette[1] || "#f9fafb")} />
                <rect x="-15" y="18" width="9" height="28" fill={getFill("mandala_ring", palette[1] || "#f9fafb")} />
                <rect x="5" y="18" width="9" height="28" fill={getFill("mandala_ring", palette[1] || "#f9fafb")} />
                <rect x="22" y="15" width="10" height="30" fill={getFill("mandala_ring", palette[1] || "#f9fafb")} />

                <path d="M40,-15 Q55,-10 60,10 Q62,25 54,28 Q48,22 52,15" fill="none" stroke={getFill("mandala_ring", palette[1] || "#f9fafb")} strokeWidth="10" strokeLinecap="round" />

                <path d="M42,-6 Q58,-4 65,-8" fill="none" stroke={getFill("pinnacle_circle", "#ffffff")} strokeWidth="3.5" strokeLinecap="round" onClick={(e) => { e.stopPropagation(); handleClick("pinnacle_circle", "Sacred White Tusk"); }} />
                <circle cx="28" cy="-22" r="2.5" fill={getFill("pinnacle_circle", "#1e1b4b")} />
              </g>
            </motion.svg>
            <span className="absolute bottom-2 left-3 text-[8.5px] font-mono tracking-widest text-[#f9fafb]/50 uppercase z-10">Hazaribagh Sohrai Mud Mural</span>
          </div>
        );

      case "manjusha":
        return (
          <div className={containerClasses} style={{ backgroundColor: getFill("canvas_background", "#fffbeb") }}>
            <motion.svg viewBox="0 0 200 200" className="w-[85%] h-[85%] z-10 drop-shadow-md">
              <rect x="5" y="5" width="190" height="190" fill="none" stroke={getFill("outer_border", palette[0] || "#ec4899")} strokeWidth="4.5" onClick={() => handleClick("outer_border", "Pink Clay Outer Border")} />
              <rect x="12" y="12" width="176" height="176" fill="none" stroke={getFill("mandala_ring", palette[1] || "#22c55e")} strokeWidth="2.5" onClick={() => handleClick("mandala_ring", "Green Inner Border")} />
              
              <path d="M25,120 Q100,165 175,120 L168,135 Q100,175 32,135 Z" fill={getFill("outer_border", palette[0] || "#ec4899")} onClick={() => handleClick("outer_border", "Bihula Snake Boat")} />
              
              <g transform="translate(100, 75)" className="cursor-crosshair" onClick={() => handleClick("pinnacle_circle", "Sacred Snake Deities")}>
                <path d="M-40,30 Q-65,0 -40,-30 T-40,-50" fill="none" stroke={getFill("pinnacle_circle", palette[1] || "#22c55e")} strokeWidth="4" strokeLinecap="round" />
                <circle cx="-40" cy="-52" r="3.5" fill={getFill("outer_border", palette[0] || "#ec4899")} />
                <path d="M40,30 Q65,0 40,-30 T 40,-50" fill="none" stroke={getFill("pinnacle_circle", palette[1] || "#22c55e")} strokeWidth="4" strokeLinecap="round" />
                <circle cx="40" cy="-52" r="3.5" fill={getFill("outer_border", palette[0] || "#ec4899")} />
              </g>

              <circle cx="100" cy="80" r="16" fill={getFill("corner_motifs", palette[2] || "#eab308")} onClick={() => handleClick("corner_motifs", "Sacred Lotus Hub")} />
            </motion.svg>
            <span className="absolute bottom-2 left-3 text-[8.5px] font-mono tracking-widest text-[#ec4899] uppercase font-bold">Angika Manjusha Snake Art</span>
          </div>
        );

      case "paitkar":
        return (
          <div className={containerClasses} style={{ backgroundColor: getFill("canvas_background", "#e7d8c0") }}>
            <motion.svg viewBox="0 0 200 200" className="w-[85%] h-[85%] z-10 drop-shadow-md">
              <rect x="7" y="7" width="186" height="186" fill="none" stroke={getFill("outer_border", palette[0] || "#78350f")} strokeWidth="4" onClick={() => handleClick("outer_border", "earthen border scroll")} />
              
              <path d="M25,180 Q100,-10 175,180" fill="none" stroke={getFill("corner_motifs", palette[2] || "#ca8a04")} strokeWidth="3" strokeDasharray="6,3" onClick={() => handleClick("corner_motifs", "jungle tree arch")} />
              
              <g transform="translate(100, 110) scale(0.85)" className="cursor-crosshair" onClick={() => handleClick("mandala_ring", "Santhal tribal assembly")}>
                <g transform="translate(-25, 0)">
                  <circle cx="0" cy="-22" r="6" fill={getFill("mandala_ring", palette[0] || "#78350f")} />
                  <path d="M-6,-10 L6,-10 L3,25 L-3,25 Z" fill={getFill("pinnacle_circle", palette[3] || "#7f1d1d")} />
                  <path d="M0,25 L-5,50 M0,25 L5,50" stroke={palette[0]} strokeWidth="2.5" />
                </g>
                <g transform="translate(25, 5)">
                  <circle cx="0" cy="-22" r="6" fill={getFill("mandala_ring", palette[0] || "#78350f")} />
                  <path d="M-6,-10 L6,-10 L3,25 L-3,25 Z" fill={getFill("pinnacle_circle", palette[2] || "#ca8a04")} />
                  <path d="M0,25 L-5,45 M0,25 L5,45" stroke={palette[0]} strokeWidth="2.5" />
                  <circle cx="12" cy="0" r="7" fill={getFill("pinnacle_circle", palette[3] || "#7f1d1d")} />
                </g>
              </g>
            </motion.svg>
            <span className="absolute bottom-2 left-3 text-[8.5px] font-mono tracking-widest text-stone-600 uppercase z-10">Santhal Paitkar Scroll</span>
          </div>
        );

      case "chittara":
        return (
          <div className={containerClasses} style={{ backgroundColor: getFill("canvas_background", "#7f1d1d") }}>
            <motion.svg viewBox="0 0 200 200" className="w-[85%] h-[85%] z-10 drop-shadow-md">
              <rect x="10" y="10" width="180" height="180" fill="none" stroke={getFill("outer_border", "#ffffff")} strokeWidth="2" onClick={() => handleClick("outer_border", "White Outer Border")} />
              <rect x="15" y="15" width="170" height="170" fill="none" stroke={getFill("outer_border", "#ffffff")} strokeWidth="1" />
              
              <g transform="translate(100, 100)" className="cursor-crosshair" onClick={() => handleClick("mandala_ring", "Geometric Wedding Mandapa")}>
                <line x1="-70" y1="-70" x2="70" y2="70" stroke={getFill("mandala_ring", "#ffffff")} strokeWidth="1.5" />
                <line x1="70" y1="-70" x2="-70" y2="70" stroke={getFill("mandala_ring", "#ffffff")} strokeWidth="1.5" />
                
                <polygon points="0,-72 72,0 0,72 -72,0" fill="none" stroke={getFill("mandala_ring", "#ffffff")} strokeWidth="2" />
                <polygon points="0,-48 48,0 0,48 -48,0" fill="none" stroke={getFill("pinnacle_circle", palette[2] || "#ca8a04")} strokeWidth="1.8" onClick={(e) => { e.stopPropagation(); handleClick("pinnacle_circle", "Yellow Sacred Core"); }} />
                
                <line x1="-75" y1="0" x2="75" y2="0" stroke={getFill("mandala_ring", "#ffffff")} strokeWidth="2.5" />
                <line x1="0" y1="-75" x2="0" y2="75" stroke={getFill("mandala_ring", "#ffffff")} strokeWidth="2.5" />
              </g>

              {[
                { x: 30, y: 30 },
                { x: 170, y: 30 },
                { x: 30, y: 170 },
                { x: 170, y: 170 }
              ].map((pos, idx) => (
                <circle 
                  key={idx} 
                  cx={pos.x} 
                  cy={pos.y} 
                  r="7" 
                  fill={getFill("corner_motifs", palette[2] || "#ca8a04")} 
                  className="cursor-crosshair"
                  onClick={() => handleClick("corner_motifs", "Ears of Rice Motif")}
                />
              ))}
            </motion.svg>
            <span className="absolute bottom-2 left-3 text-[8.5px] font-mono tracking-widest text-[#ffffff]/60 uppercase">Deevaru Chittara Lattice</span>
          </div>
        );

      case "kalamezhuthu":
        return (
          <div className={containerClasses} style={{ backgroundColor: getFill("canvas_background", "#111827") }}>
            <motion.svg viewBox="0 0 200 200" className="w-[85%] h-[85%] z-10 drop-shadow-md">
              <circle cx="100" cy="100" r="92" fill="none" stroke={getFill("outer_border", palette[3] || "#ca8a04")} strokeWidth="3" onClick={() => handleClick("outer_border", "Sacred Boundary Circle")} />
              
              <g transform="translate(100, 100) scale(0.9)" className="cursor-crosshair" onClick={() => handleClick("mandala_ring", "Bhadrakali Deity Face")}>
                <path d="M-30,-20 L0,-75 L30,-20 Z" fill={getFill("corner_motifs", palette[3] || "#ca8a04")} stroke="#ffffff" strokeWidth="1.5" onClick={(e) => { e.stopPropagation(); handleClick("corner_motifs", "Gilded Kireedam Crown"); }} />
                
                <path d="M-30,-20 C-45,10 -35,50 0,55 C35,50 45,10 30,-20 Z" fill={getFill("mandala_ring", palette[1] || "#991b1b")} />
                
                <ellipse cx="0" cy="-2" rx="4" ry="7" fill={getFill("pinnacle_circle", "#ffffff")} stroke="#000000" strokeWidth="1.2" onClick={(e) => { e.stopPropagation(); handleClick("pinnacle_circle", "Goddess Third Eye"); }} />
                <circle cx="0" cy="-2" r="2.2" fill={getFill("outer_border", "#991b1b")} />
                
                <path d="M-12,28 L0,42 L12,28 Z" fill={getFill("pinnacle_circle", "#ffffff")} />
                <path d="M-6,28 V38 H6 V28 Z" fill={getFill("outer_border", "#991b1b")} />
              </g>
            </motion.svg>
            <span className="absolute bottom-2 left-3 text-[8.5px] font-mono tracking-widest text-[#ca8a04] uppercase font-bold">Kerala Kalamezhuthu Floor Art</span>
          </div>
        );

      case "rogan":
        return (
          <div className={containerClasses} style={{ backgroundColor: getFill("canvas_background", "#0a1931") }}>
            <motion.svg viewBox="0 0 200 200" className="w-[85%] h-[85%] z-10 drop-shadow-md">
              <path d="M25,180 A80,80 0 0,1 175,180" fill="none" stroke={getFill("outer_border", palette[1] || "#fdd835")} strokeWidth="4.5" onClick={() => handleClick("outer_border", "Gilded Rogan Arch")} />
              
              <g transform="translate(100, 180)" className="cursor-crosshair" onClick={() => handleClick("mandala_ring", "Symmetrical Rogan Tree")}>
                <line x1="0" y1="0" x2="0" y2="-90" stroke={getFill("mandala_ring", palette[1] || "#fdd835")} strokeWidth="4" />
                
                {[
                  { dLeft: "M0,-25 Q-30,-35 -40,-60", dRight: "M0,-25 Q30,-35 40,-60" },
                  { dLeft: "M0,-50 Q-25,-55 -32,-80", dRight: "M0,-50 Q25,-55 32,-80" },
                  { dLeft: "M0,-75 Q-15,-80 -20,-95", dRight: "M0,-75 Q15,-80 20,-95" }
                ].map((branch, bIdx) => (
                  <g key={bIdx} fill="none" stroke={getFill("mandala_ring", palette[1] || "#fdd835")} strokeWidth="2">
                    <path d={branch.dLeft} />
                    <path d={branch.dRight} />
                    <circle cx={-40 + bIdx*8} cy={-60 - bIdx*10} r="3.5" fill={getFill("pinnacle_circle", palette[2] || "#e91e63")} onClick={(e) => { e.stopPropagation(); handleClick("pinnacle_circle", "Traditional Castor Oil Loop"); }} />
                    <circle cx={40 - bIdx*8} cy={-60 - bIdx*10} r="3.5" fill={getFill("pinnacle_circle", palette[2] || "#e91e63")} onClick={(e) => { e.stopPropagation(); handleClick("pinnacle_circle", "Traditional Castor Oil Loop"); }} />
                  </g>
                ))}
              </g>
            </motion.svg>
            <span className="absolute bottom-2 left-3 text-[8.5px] font-mono tracking-widest text-[#fdd835] uppercase font-bold">Kutch Rogan Silk Art</span>
          </div>
        );

      case "thangka":
        return (
          <div className={containerClasses} style={{ backgroundColor: getFill("canvas_background", "#0f172a") }}>
            <motion.svg viewBox="0 0 200 200" className="w-[85%] h-[85%] z-10 drop-shadow-md">
              <rect x="5" y="5" width="190" height="190" fill="none" stroke={getFill("outer_border", palette[1] || "#dc2626")} strokeWidth="4" onClick={() => handleClick("outer_border", "Silk Brocade Border")} />
              
              <g transform="translate(100, 100)" className="cursor-crosshair" onClick={() => handleClick("mandala_ring", "Meditative Buddha Silhouette")}>
                <circle cx="0" cy="-24" r="32" fill="none" stroke={getFill("corner_motifs", palette[4] || "#ca8a04")} strokeWidth="2.5" onClick={(e) => { e.stopPropagation(); handleClick("corner_motifs", "Golden Meditation Halo"); }} />
                
                <path d="M-30,40 L30,40 L0,-12 Z" fill={getFill("mandala_ring", palette[2] || "#d97706")} />
                
                <circle cx="0" cy="-22" r="10" fill={getFill("mandala_ring", palette[2] || "#d97706")} />
                
                <path d="M-40,40 C-20,32 -10,48 0,40 C10,48 20,32 40,40 L35,50 H-35 Z" fill={getFill("pinnacle_circle", palette[1] || "#dc2626")} stroke="#ffffff" strokeWidth="1" onClick={(e) => { e.stopPropagation(); handleClick("pinnacle_circle", "Lotus Seating Throne"); }} />
              </g>
            </motion.svg>
            <span className="absolute bottom-2 left-3 text-[8.5px] font-mono tracking-widest text-[#ca8a04] uppercase font-bold">Himalayan Thangka Scroll</span>
          </div>
        );

      default:
        return (
          <div className={containerClasses}>
            <span>Traditional artwork</span>
          </div>
        );
    }
  };


  // Helper to render responsive, high-fidelity SVGs that capture the essence/style of each art
  const renderArtSimulation = (id: string, isBig = false) => {
    const sizeClasses = isBig ? "w-full h-full min-h-[300px] md:min-h-[420px]" : "w-full h-32";
    
    switch (id) {
      case "warli":
        return (
          <div className={`relative flex items-center justify-center bg-[#8c3d1e] overflow-hidden rounded-2xl ${sizeClasses}`}>
            {/* Red ochre texture */}
            <div className="absolute inset-0 bg-[#8c3d1e] opacity-95" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08),transparent_70%)]" />
            
            <motion.svg 
              viewBox="0 0 200 200" 
              className="w-[85%] h-[85%] text-white z-10 select-none"
              animate={animationPlaying ? { rotate: breathSync ? (isBreatheIn ? 12 : -12) : 2 } : {}}
              transition={{ repeat: Infinity, duration: breathSync ? 3 : 8, ease: "easeInOut", repeatType: "reverse" }}
            >
              <circle cx="100" cy="100" r="12" fill="none" stroke="white" strokeWidth="2" />
              <path d="M100 112 L100 135 L88 160 M100 135 L112 165" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M100 115 L120 125 L108 108" fill="none" stroke="white" strokeWidth="2.5" /> 
              
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, k) => {
                const radius = breathSync ? (isBreatheIn ? 58 : 65) : 58;
                const radian = (angle * Math.PI) / 180;
                const cx = 100 + radius * Math.cos(radian);
                const cy = 100 + radius * Math.sin(radian);
                
                return (
                  <motion.g 
                    key={k} 
                    transform={`translate(${cx}, ${cy}) rotate(${angle + 90})`}
                    animate={animationPlaying ? { y: [0, -3, 0], scale: [1, 1.05, 1] } : {}}
                    transition={{ repeat: Infinity, duration: 1.5, delay: k * 0.15 }}
                  >
                    <circle cx="0" cy="-14" r="3.5" fill="white" />
                    <path d="M-5 -7 L5 -7 L0 0 Z" fill="white" />
                    <path d="M-5 7 L5 7 L0 0 Z" fill="white" />
                    <path d="M-3 7 L-5 16 M2 7 L4 16" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M-5 -3 L-12 -6 M5 -3 L12 -6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  </motion.g>
                );
              })}
              
              <g transform="translate(25, 25) scale(0.6)">
                <path d="M15 35 L15 5 M15 15 L25 5 M15 20 L5 12 M15 25 L28 18" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
              </g>
              <g transform="translate(160, 25) scale(0.6)">
                <path d="M15 35 L15 5 M15 12 L5 5 M15 18 L25 10 M15 24 L4 18" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
              </g>
            </motion.svg>
            <span className="absolute bottom-2.5 left-3 text-[9px] font-mono tracking-widest text-[#f5ebd6]/60 uppercase z-10">Monochromatic White on Red Clay</span>
          </div>
        );

      case "madhubani":
        return (
          <div className={`relative flex items-center justify-center bg-[#fdfaf2] border-4 border-double border-[#be2222] overflow-hidden rounded-2xl ${sizeClasses}`}>
            <motion.svg 
              viewBox="0 0 200 200" 
              className="w-[90%] h-[90%] z-10"
              animate={animationPlaying ? { scale: breathSync ? (isBreatheIn ? 1.04 : 0.98) : 1 } : {}}
              transition={{ duration: 3, ease: "easeInOut" }}
            >
              <rect x="5" y="5" width="190" height="190" fill="none" stroke="#be2222" strokeWidth="2.5" />
              <rect x="10" y="10" width="180" height="180" fill="none" stroke="#059669" strokeWidth="1.5" />
              
              <g transform="translate(100, 100)">
                <motion.g
                  animate={animationPlaying ? { x: [-5, 5, -5], y: [-2, 2, -2] } : {}}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                >
                  <path d="M-60 0 C-40 -25 20 -25 40 0 C20 25 -40 25 -60 0 Z" fill="none" stroke="#2563eb" strokeWidth="2" />
                  <path d="M-55 0 C-38 -20 18 -20 35 0 M-38 18 C-18 10 10 10 30 0" stroke="#000" strokeWidth="0.8" strokeDasharray="2,1" />
                  <circle cx="22" cy="-3" r="5" fill="white" stroke="#be2222" strokeWidth="1.5" />
                  <circle cx="22" cy="-3" r="2" fill="black" />
                  <path d="M-60 0 L-76 -18 L-70 0 L-76 18 Z" fill="none" stroke="#be2222" strokeWidth="2" />
                </motion.g>
                
                <circle cx="-35" cy="-35" r="14" fill="none" stroke="#d97706" strokeWidth="2" />
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 275, 300, 330].map((deg) => (
                  <line 
                    key={deg} 
                    x1={-35 + 14 * Math.cos((deg * Math.PI) / 180)} 
                    y1={-35 + 14 * Math.sin((deg * Math.PI) / 180)} 
                    x2={-35 + 23 * Math.cos((deg * Math.PI) / 180)} 
                    y2={-35 + 23 * Math.sin((deg * Math.PI) / 180)} 
                    stroke="#d97706" 
                    strokeWidth="1.3" 
                  />
                ))}
                
                <path d="M30 35 C15 35 10 50 30 65 C50 50 45 35 30 35" fill="none" stroke="#be2222" strokeWidth="1.8" />
                <path d="M30 35 C22 25 5 35 15 50" fill="none" stroke="#be2222" strokeWidth="1.5" />
                <path d="M30 35 C38 25 55 35 45 50" fill="none" stroke="#be2222" strokeWidth="1.5" />
              </g>
              
              <path d="M15 150 Q45 135 60 170" fill="none" stroke="#059669" strokeWidth="1.5" />
              <path d="M155 140 Q175 145 160 180" fill="none" stroke="#059669" strokeWidth="1.5" />
            </motion.svg>
            <span className="absolute bottom-2 left-2 text-[8px] bg-white dark:bg-black px-1.5 py-0.5 border border-red-500 rounded font-mono text-[#be2222] font-bold z-10">Mithila Horror Vacui</span>
          </div>
        );

      case "gond":
        return (
          <div className={`relative flex items-center justify-center bg-[#0d1e3d] overflow-hidden rounded-2xl ${sizeClasses}`}>
            <motion.svg 
              viewBox="0 0 200 200" 
              className="w-[90%] h-[90%] z-10"
              animate={animationPlaying ? { rotate: [0, 1.5, -1.5, 0] } : {}}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            >
              <motion.g
                animate={animationPlaying ? { scale: breathSync ? (isBreatheIn ? 1.05 : 0.95) : [1, 1.02, 1] } : {}}
                transition={{ duration: 3, ease: "easeInOut" }}
              >
                <path d="M100 180 Q105 140 100 110 Q90 90 60 80 M100 110 Q115 85 140 70 M100 145 Q125 135 155 145" fill="none" stroke="#facd12" strokeWidth="4" strokeLinecap="round" />
                <path d="M100 180 Q105 140 100 110 Q90 90 60 80 M100 110 Q115 85 140 70 M100 145 Q125 135 155 145" fill="none" stroke="#de3469" strokeWidth="2.5" strokeDasharray="1,4.5" strokeLinecap="round" />
                
                <g transform="translate(50, 70) scale(0.7)">
                  <path d="M0 0 C15 -15 30 -5 40 10 C20 15 5 15 0 0 Z" fill="#1290de" stroke="#fff" strokeWidth="1" />
                  <path d="M40 10 L48 1 M40 10 L46 15" stroke="#de3469" strokeWidth="1.5" />
                  <circle cx="10" cy="3" r="1.5" fill="white" />
                  <path d="M5 4 Q20 8 30 7" stroke="#facd12" strokeWidth="1.5" strokeDasharray="1,2" />
                </g>

                <g transform="translate(125, 110) scale(0.6) rotate(-15)">
                  <path d="M0 0 C15 -15 30 -5 40 10 C20 15 5 15 0 0 Z" fill="#de3469" stroke="#fff" strokeWidth="1" />
                  <path d="M40 10 L45 0" stroke="#1290de" strokeWidth="1.5" />
                  <circle cx="10" cy="3" r="1.5" fill="white" />
                </g>
                
                <circle cx="60" cy="80" r="4" fill="#12ad44" />
                <circle cx="140" cy="70" r="5" fill="#a355de" />
                <circle cx="155" cy="145" r="4" fill="#1290de" />
              </motion.g>
              
              {[
                { x: 25, y: 35, c: "#1290de" }, { x: 170, y: 40, c: "#facd12" },
                { x: 40, y: 150, c: "#12ad44" }, { x: 175, y: 160, c: "#de3469" },
                { x: 165, y: 95, c: "#a355de" }, { x: 30, y: 100, c: "#fff" }
              ].map((pt, idx) => (
                <motion.circle 
                  key={idx}
                  cx={pt.x} 
                  cy={pt.y} 
                  r="2" 
                  fill={pt.c} 
                  animate={animationPlaying ? { opacity: [0.3, 1, 0.3], scale: [0.8, 1.4, 0.8] } : {}}
                  transition={{ repeat: Infinity, duration: 2.5, delay: idx * 0.4 }}
                />
              ))}
            </motion.svg>
            <span className="absolute bottom-2.5 right-3 text-[9px] text-teal-350 font-mono tracking-widest uppercase">Intricate "Breathing" Microdots</span>
          </div>
        );

      case "pichwai":
        return (
          <div className={`relative flex items-center justify-center bg-[#030612] overflow-hidden rounded-2xl ${sizeClasses}`}>
            <div className="absolute inset-0 border border-amber-500/25 rounded-2xl m-3" />
            <motion.svg 
              viewBox="0 0 200 200" 
              className="w-[90%] h-[90%] z-10"
              animate={animationPlaying ? { scale: breathSync ? (isBreatheIn ? 1.05 : 0.95) : 1 } : {}}
              transition={{ duration: 3, ease: "easeInOut" }}
            >
              <g transform="translate(100, 100)">
                <motion.circle 
                  cx="0" 
                  cy="0" 
                  r="55" 
                  fill="none" 
                  stroke="#ffd700" 
                  strokeWidth="0.8" 
                  strokeDasharray="4,6" 
                  animate={animationPlaying ? { rotate: 360 } : {}}
                  transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
                />
                
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, k) => {
                  return (
                    <g key={k} transform={`rotate(${angle})`}>
                      <motion.path 
                        d="M0 0 C-15 -25 0 -42 0 -42 C0 -42 15 -25 0 0 Z" 
                        fill="#e91e63" 
                        stroke="#ffd700" 
                        strokeWidth="1.2"
                        animate={animationPlaying ? { scaleY: breathSync ? (isBreatheIn ? 1.15 : 0.92) : [1, 1.06, 1] } : {}}
                        transition={{ duration: 3, delay: k * 0.1, ease: "easeInOut" }}
                      />
                    </g>
                  );
                })}

                <circle cx="0" cy="0" r="14" fill="#ffd700" stroke="#e91e63" strokeWidth="1" />
                <circle cx="0" cy="0" r="7" fill="#030612" />
                <circle cx="0" cy="0" r="3" fill="#ffd700" />
                
                <g transform="translate(-25, 45) scale(0.55)">
                  <path d="M10 20 Q40 20 60 30 L60 55 L52 55 L52 38 L25 38 L25 55 L16 55 L12 35 Q5 35 0 30 L5 20 Z" fill="#ffd700" opacity="0.85" />
                  <circle cx="10" cy="24" r="2.5" fill="#e91e63" />
                </g>
              </g>
            </motion.svg>
            <span className="absolute bottom-2.5 left-3 text-[9px] font-mono tracking-widest text-[#ffd700] uppercase font-bold">Gold Foil & Devotional Lotus</span>
          </div>
        );

      case "aipan":
        return (
          <div className={`relative flex items-center justify-center bg-[#8b1414] overflow-hidden rounded-2xl ${sizeClasses}`}>
            <div className="absolute inset-0 bg-[#8b1414]" />
            <motion.svg 
              viewBox="0 0 200 200" 
              className="w-[90%] h-[90%] z-10 text-white"
              animate={animationPlaying ? { scale: breathSync ? (isBreatheIn ? 1.06 : 0.96) : 1 } : {}}
              transition={{ duration: 3, ease: "easeInOut" }}
            >
              {[10, 15, 20].map((x) => (
                <line key={x} x1={x} y1="10" x2={x} y2="190" stroke="white" strokeWidth="1" opacity="0.6" />
              ))}
              <line x1="25" y1="10" x2="25" y2="190" stroke="white" strokeWidth="2" />

              <g transform="translate(110, 100)">
                <circle cx="0" cy="0" r="48" fill="none" stroke="white" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="44" fill="none" stroke="white" strokeWidth="0.8" strokeDasharray="2,2" />
                
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                  <path 
                    key={deg}
                    d="M0 0 C-4 -12 0 -22 0 -22 C0 -22 4 -12 0 0" 
                    fill="none" 
                    stroke="white" 
                    strokeWidth="1.2" 
                    transform={`rotate(${deg})`} 
                  />
                ))}

                <path 
                  d="M-10 0 H10 M0 -10 V10 M-10 -10 H0 V0 M10 10 H0 V0" 
                  stroke="white" 
                  strokeWidth="2.5" 
                />
                <g transform="translate(-14, 22) scale(0.65)">
                  <path d="M4 12 C1 12 1 18 4 18 C7 18 7 12 4 12" fill="white" />
                  <circle cx="2.2" cy="9.5" r="1" fill="white" />
                  <circle cx="3.8" cy="8" r="1.2" fill="white" />
                  <circle cx="6" cy="8" r="1.2" fill="white" />
                  <circle cx="7.8" cy="9.5" r="1" fill="white" />
                </g>
                <g transform="translate(4, 22) scale(0.65)">
                  <path d="M4 12 C1 12 1 18 4 18 C7 18 7 12 4 12" fill="white" />
                  <circle cx="2.2" cy="9.5" r="1" fill="white" />
                  <circle cx="3.8" cy="8" r="1.2" fill="white" />
                  <circle cx="6" cy="8" r="1.2" fill="white" />
                  <circle cx="7.8" cy="9.5" r="1" fill="white" />
                </g>
              </g>
            </motion.svg>
            <span className="absolute bottom-2.5 left-3 text-[9px] font-mono tracking-widest text-[#f9fafb]/60 uppercase">Geru Mud & Rice Paste "Vasudhara"</span>
          </div>
        );

      default:
        return renderTraditionalArtwork(id, isBig, false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full text-left font-sans select-none animate-fade-in">
      
      {/* Decorative Ornate Folk Art Header block */}
      <div className="border-4 border-double border-rose-800/40 bg-[#fffdfa]/60 dark:bg-[#121214]/60 backdrop-blur-md p-6 rounded-3xl relative overflow-hidden flex flex-col gap-2.5 shadow-sm dark:shadow-slate-900/30">
        {/* Double Outline borders symbolizing Madhubani and Pattachitra borders */}
        <div className="absolute inset-1 border border-rose-700/10 rounded-2xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10 font-bold text-[120px] leading-none pointer-events-none text-rose-800 select-none">🎨</div>
        
        <div className="flex flex-col gap-1 z-10 text-left">
          <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-rose-800 dark:text-rose-400 font-extrabold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-750 dark:bg-rose-500 animate-pulse" />
            Vedic Cultural Sanctuary
          </span>
          <h2 className="text-xl md:text-2xl font-bold font-serif text-[#3e2723] dark:text-[#f3e5d8] leading-tight">
            Traditional Folk Art &amp; Masterpieces Gallery
          </h2>
          <p className="text-xs text-stone-600 dark:text-stone-300 max-w-3xl leading-relaxed font-sans">
            An elegant interactive gallery celebrating 20 masterpiece folk paintings of India. Explore tribal and traditional motifs, experiment with coloring workshops, or sync respiratory rhythms to match the organic pulse of folk symmetry.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-sans">
        
        {/* Left Canvas Panel */}
        <div className="lg:col-span-8 space-y-4">
          <div className="p-6 bg-white/60 dark:bg-black/60 border border-[#ebdcb9]/40 dark:border-white/10 rounded-3xl shadow-md flex flex-col gap-4 text-left backdrop-blur-md">
            {/* Header with selectors */}
            <div className="flex flex-col gap-3 border-b pb-3 border-dashed border-[#ebdcb9]">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-extrabold tracking-tight text-neutral-800 dark:text-stone-305 uppercase font-mono">Guild Workshop Frame</h4>
                  <p className="text-[10px] text-stone-500 font-sans">Symmetric geometries rendered as vector paths</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => setIsExpandedViewer(true)}
                    className="p-1 px-1.5 text-stone-500 bg-stone-50 hover:bg-stone-100 dark:bg-stone-900 dark:text-stone-400 dark:hover:bg-stone-850 rounded-lg cursor-pointer flex items-center justify-center border border-stone-200/40"
                    title="Fullscreen Immersion View"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Sub-mode selector */}
              <div className="grid grid-cols-2 p-1 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-200/50 dark:border-white/10">
                <button
                  onClick={() => setPaintingMode("simulator")}
                  className={`py-1.5 text-[10.5px] font-bold rounded-lg cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                    paintingMode === "simulator"
                      ? "bg-stone-850 dark:bg-white dark:text-black text-white shadow-xs"
                      : "text-stone-600 dark:text-stone-400 hover:text-stone-850 dark:hover:text-stone-200"
                  }`}
                >
                  <span>💫 Living Breath</span>
                </button>
                <button
                  onClick={() => setPaintingMode("coloring")}
                  className={`py-1.5 text-[10.5px] font-bold rounded-lg cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                    paintingMode === "coloring"
                      ? "bg-rose-800 text-white shadow-xs"
                      : "text-stone-600 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200"
                  }`}
                >
                  <span>🎨 Coloring Workshop</span>
                </button>
              </div>
            </div>

            {/* Viewport Canvas container */}
            <div className="relative group flex justify-center bg-stone-50/30 dark:bg-stone-950/20 rounded-2xl p-4 border border-stone-100 dark:border-white/5">
              {paintingMode === "simulator" ? (
                <div className="relative w-full max-w-lg">
                  {renderArtSimulation(activeArt.id, false)}
                  
                  {/* Controls overlay for simulator */}
                  <div className="absolute top-2.5 right-2 z-10 flex items-center gap-1 bg-white/95 dark:bg-black/90 backdrop-blur-xs p-1 rounded-lg border border-stone-250 dark:border-white/10 shadow-xs">
                    <button 
                      onClick={() => setAnimationPlaying(!animationPlaying)}
                      className="p-1 px-2 text-[9px] font-extrabold font-mono uppercase hover:bg-stone-100 dark:hover:bg-stone-900 text-stone-700 dark:text-stone-300 rounded-md cursor-pointer"
                    >
                      {animationPlaying ? "⏸ Pause" : "▶ Play"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative w-full max-w-lg">
                  {renderInteractiveColoringSVG(activeArt.id, false)}
                </div>
              )}
            </div>
          </div>

          {/* Below Canvas: 2-column info & controls grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Dynamic lore card */}
            <div className="space-y-3 p-4 bg-[#fffbf2] dark:bg-[#12100e]/30 border border-[#ebdcb9]/60 dark:border-yellow-950/40 rounded-2xl shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-rose-800 dark:text-rose-455 uppercase tracking-widest font-mono">🔍 Visual Detail</span>
                <span className={`text-[8px] font-mono px-2 py-0.5 rounded font-extrabold ${
                  activeArt.giStatus === "Yes" ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-450 border border-emerald-250 dark:border-emerald-800" : "bg-stone-100 dark:bg-stone-900 text-stone-500"
                }`}>
                  {activeArt.giStatus === "Yes" ? "🏆 GI Tagged" : "Traditional Form"}
                </span>
              </div>
              <h3 className="text-[13px] font-bold font-serif text-[#3e2723] dark:text-[#f3e5d8]">{activeArt.name}</h3>
              <p className="text-[11px] leading-relaxed text-stone-600 dark:text-stone-400">{activeArt.description}</p>
              <div className="text-[10px] bg-white dark:bg-black border border-stone-150 dark:border-white/10 p-2.5 rounded-xl text-stone-500 dark:text-stone-400 leading-normal">
                <strong>Sacred Lore &amp; Context:</strong> {activeArt.lore}
              </div>
            </div>

            {/* Coloring Swatch / Pigment Swatch panel OR Breath Resonance card */}
            {paintingMode === "coloring" ? (
              <div className="space-y-3.5 bg-[#fffbf4] dark:bg-[#1c1612]/30 border border-[#ebdcb9]/40 dark:border-yellow-950/40 p-4 rounded-2xl shadow-2xs flex flex-col justify-between">
                <div>
                  {/* Progress segment */}
                  <div className="flex items-center justify-between text-[10px] uppercase font-mono tracking-wider font-extrabold text-[#5c3e35] dark:text-stone-400">
                    <span>🎨 Progress:</span>
                    <span className="text-rose-800 dark:text-rose-450">{coloringCount} / {totalRegionsCount} ({completionPercentage}%)</span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-stone-200/50 dark:bg-stone-850 h-1.5 rounded-full overflow-hidden mt-1.5">
                    <motion.div 
                      className="bg-rose-700 dark:bg-rose-600 h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${completionPercentage}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                </div>

                {/* Pigment Swatch selectors */}
                <div className="space-y-1.5">
                  <span className="text-[9px] uppercase font-mono tracking-wider text-stone-400 dark:text-stone-500 block font-bold">Pigment:</span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {activeArt.colorPalette.map((col, idx) => {
                      const info = getPigmentInfo(col);
                      const isBrush = selectedBrush === col;
                      return (
                        <button
                          key={idx}
                          onClick={() => setSelectedBrush(col)}
                          style={{ backgroundColor: col }}
                          className={`w-6 h-6 rounded-full border shadow-2xs relative transition-all duration-200 hover:scale-115 cursor-pointer ${
                            isBrush ? "ring-2 ring-rose-750 dark:ring-rose-500 ring-offset-1 scale-110" : "border-black/10"
                          }`}
                          title={`${info.name}: Sourced from ${info.source}`}
                        >
                          {isBrush && (
                            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-extrabold text-white drop-shadow-md">✓</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Active brush lore */}
                {selectedBrush && (
                  <div className="bg-white/80 dark:bg-black/60 border border-stone-200/50 dark:border-white/10 p-2 rounded-xl text-left text-[10px] leading-relaxed text-stone-600 dark:text-stone-400">
                    <div className="flex items-center gap-1 font-bold text-stone-800 dark:text-stone-300">
                      <Paintbrush className="w-2.5 h-2.5 text-rose-700" />
                      <span>{getPigmentInfo(selectedBrush).name}</span>
                    </div>
                    <p className="text-stone-550 dark:text-stone-500 text-[9.5px] italic truncate">
                      "{getPigmentInfo(selectedBrush).lore}"
                    </p>
                  </div>
                )}

                {/* Sandboxing controls */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleAutoColorize}
                    className="py-1 px-2.5 text-[9px] font-mono font-bold uppercase bg-stone-100 hover:bg-stone-200 dark:bg-stone-900 dark:hover:bg-stone-800 dark:text-stone-300 dark:border-white/10 text-stone-700 rounded-lg border border-stone-250 cursor-pointer text-center"
                  >
                    Auto-Color
                  </button>
                  <button
                    onClick={handleClearCanvas}
                    className="py-1 px-2.5 text-[9px] font-mono font-bold uppercase bg-stone-100 hover:bg-stone-200 dark:bg-stone-900 dark:hover:bg-stone-800 dark:text-stone-300 dark:border-white/10 text-stone-700 rounded-lg border border-stone-250 cursor-pointer text-center"
                  >
                    Clear
                  </button>
                </div>

                <button
                  onClick={() => setCertificateOpen(true)}
                  className={`w-full py-1 rounded-lg text-[9.5px] font-bold uppercase font-mono cursor-pointer transition-all flex items-center justify-center gap-1 border ${
                    completionPercentage === 100
                      ? "bg-amber-600 hover:bg-amber-700 border-amber-600 text-white shadow-md animate-pulse"
                      : "bg-stone-100 hover:bg-[#ebd0a3]/20 dark:bg-stone-900 dark:hover:bg-stone-800 dark:text-stone-400 dark:border-white/10 text-stone-600 border-stone-200/60"
                  }`}
                >
                  <Award className="w-3 h-3" />
                  <span>Claim Certificate</span>
                </button>
              </div>
            ) : (
              <div className="border border-emerald-200/50 dark:border-emerald-800/40 p-4 rounded-2xl bg-emerald-50/20 dark:bg-emerald-950/10 text-left flex flex-col justify-between h-full shadow-2xs">
                <div className="flex items-center gap-1.5 justify-between">
                  <span className="text-[10px] font-extrabold text-emerald-850 dark:text-emerald-400 uppercase tracking-wider font-mono flex items-center gap-1">
                    <Wind className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                    Respiratory Mirror Sync
                  </span>
                  <button
                    onClick={() => setBreathSync(!breathSync)}
                    className={`px-2 py-0.8 text-[9px] font-bold font-mono rounded-lg border transition-all cursor-pointer ${
                      breathSync 
                        ? "bg-emerald-750 text-white border-emerald-800" 
                        : "bg-white dark:bg-black hover:bg-emerald-50 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60"
                    }`}
                  >
                    {breathSync ? "Active" : "Sync Pulse"}
                  </button>
                </div>
                <p className="text-[10.5px] text-stone-500 dark:text-stone-400 leading-relaxed mt-1">
                  Folk visual patterns reflect organic respiration frequencies. Use this mode to align your breath pacing with the canvas expansions.
                </p>
                {breathSync && (
                  <div className="flex items-center justify-between text-[9px] font-mono text-emerald-700 bg-white/70 dark:bg-black/80 px-2.5 py-1.5 rounded-lg border border-emerald-200/40">
                    <span>{isBreatheIn ? "Inhale (Expanding)" : "Exhale (Stabilizing)"}</span>
                    <span className="font-extrabold">Timer: {seconds}s</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Comparative Folk, Tribal & Classical Matrix */}
          <div className="border-t pt-4 border-stone-200 space-y-3 text-left">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#3e2723] font-bold block">Comparative Folk, Tribal &amp; Classical Matrix</span>
            <div className="overflow-x-auto border border-stone-200 rounded-xl">
              <table className="w-full text-[10.5px] text-stone-700 leading-normal font-sans border-collapse">
                <thead>
                  <tr className="bg-[#fcf7ee] border-b border-stone-200 font-serif font-bold text-[#3e2723]">
                    <th className="p-2.5 text-left font-serif">Feature</th>
                    <th className="p-2.5 text-left font-serif">Folk Paintings</th>
                    <th className="p-2.5 text-left font-serif">Tribal Paintings</th>
                    <th className="p-2.5 text-left font-serif">Classical Paintings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-150">
                  <tr>
                    <td className="p-2.5 font-bold text-[#3e2723] bg-stone-50/40">Origins</td>
                    <td className="p-2.5 leading-relaxed">Rooted in rural communities; linked to agrarian festivals, localized rituals, and non-codified village legends.</td>
                    <td className="p-2.5 leading-relaxed">Rooted in deep indigenous forest tribes; closely bound to animism, forest animal spirits, and ancestor worship.</td>
                    <td className="p-2.5 leading-relaxed">Emerged under royal patronage, courts, or major temples; guided by written codes like the Shilpa Shastras.</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-[#3e2723] bg-stone-50/40">Technique</td>
                    <td className="p-2.5 leading-relaxed">Transmitted orally through community preserves; highly stylized but structured household practices.</td>
                    <td className="p-2.5 leading-relaxed">Highly ritualistic, instinctive and collective; murals executed directly on prepared cow-dung mud soils.</td>
                    <td className="p-2.5 leading-relaxed">Highly formalized guild structures (Guru-Shishya parampara); rigorous geometric proportions and gold gildings.</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-[#3e2723] bg-stone-50/40">Themes</td>
                    <td className="p-2.5 leading-relaxed">Socio-religious local epics, wedding enclosures (Kohbar), daily village bazaars, and harvest seasons.</td>
                    <td className="p-2.5 leading-relaxed">Cosmic "Tree of Life", animal spirits (tigers, fish, deer), shaman dream journeys, and fertility blessings.</td>
                    <td className="p-2.5 leading-relaxed">Codified religious iconography, mythological assemblies (Puranic deities), and detailed courts of kings.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Paintings Catalog Grid */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 bg-white/60 dark:bg-black/60 border border-[#ebdcb9]/40 dark:border-white/10 rounded-3xl shadow-md text-left backdrop-blur-md">
            
            {/* Search & filters */}
            <div className="flex flex-col gap-3 pb-4 border-b border-stone-150 dark:border-white/5">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, region..."
                  className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-white/10 rounded-xl text-xs pl-9 pr-3 py-2 text-stone-800 dark:text-stone-200 outline-none focus:border-rose-700 dark:focus:border-rose-600 transition-all font-sans placeholder-stone-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-white/10 rounded-xl text-[11px] font-bold text-stone-700 dark:text-stone-300 px-2 py-2 outline-none focus:border-rose-700 dark:focus:border-rose-600 cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  <option value="Folk">Folk Art</option>
                  <option value="Tribal">Tribal Art</option>
                  <option value="Classical">Classical Art</option>
                </select>

                <select
                  value={selectedGI}
                  onChange={(e) => setSelectedGI(e.target.value)}
                  className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-white/10 rounded-xl text-[11px] font-bold text-stone-700 dark:text-stone-300 px-2 py-2 outline-none focus:border-rose-700 dark:focus:border-rose-600 cursor-pointer"
                >
                  <option value="All">GI Status</option>
                  <option value="Yes">GI Tagged Only</option>
                  <option value="No">No GI Tag</option>
                </select>
              </div>

              {(searchTerm || selectedCategory !== "All" || selectedGI !== "All") && (
                <button
                  onClick={handleResetFilters}
                  className="w-full py-1.5 bg-rose-800/10 text-rose-800 hover:bg-rose-800/20 text-xs font-bold rounded-xl cursor-pointer transition-all dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20"
                >
                  Reset Active Filters
                </button>
              )}
            </div>

            {/* Catalog Items list */}
            <div className="flex flex-col gap-2.5 my-4 max-h-[500px] overflow-y-auto pr-1 no-scrollbar">
              {filteredPaintings.length === 0 ? (
                <div className="py-8 text-center text-stone-450 text-xs italic font-serif">
                  No masterpieces match the filters.
                </div>
              ) : (
                filteredPaintings.map((art) => {
                  const isActive = art.id === activePaintingId;
                  return (
                    <button
                      key={art.id}
                      onClick={() => setActivePaintingId(art.id)}
                      className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer relative overflow-hidden group ${
                        isActive 
                          ? "bg-[#fffcf3] dark:bg-rose-950/25 border-rose-800 dark:border-rose-600 shadow-sm scale-[1.01]" 
                          : "bg-[#fffdf9]/40 hover:bg-stone-100/60 dark:bg-stone-900/20 dark:hover:bg-stone-900/50 border-stone-200/50 dark:border-white/5"
                      }`}
                    >
                      {/* Motif circular badge */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 border uppercase font-serif ${
                        isActive ? "bg-rose-850 dark:bg-rose-700 text-white border-rose-900 dark:border-rose-600" : "bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-white/10"
                      }`}>
                        {art.name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1 leading-tight text-left">
                        <h4 className="text-[11.5px] font-bold text-[#3e2723] dark:text-stone-200 truncate group-hover:text-rose-800 dark:group-hover:text-rose-400 transition-colors">{art.name}</h4>
                        <p className="text-[9.5px] text-stone-550 dark:text-stone-400 font-medium truncate mt-0.5">{art.region} • {art.category}</p>
                      </div>
                      {isActive && (
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-800 dark:bg-rose-600 shrink-0 shadow-sm" />
                      )}
                    </button>
                  );
                })
              )}
            </div>

          </div>
        </div>

      </div>

      {/* Dynamic Masterpiece Scroll Certificate Modal Overlay */}
      <AnimatePresence>
        {certificateOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-lg w-full bg-[#fdfaf2] border-8 border-double border-amber-600 rounded-3xl p-6.5 shadow-2xl overflow-hidden font-serif text-center"
            >
              {/* Traditional watermarked pattern background */}
              <div className="absolute inset-0 bg-[radial-gradient(#ebdcb9_1.5px,transparent_1.5px)] [background-size:16px_16px] opacity-15 pointer-events-none" />
              
              {/* Guild seal watermark overlay */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border-4 border-dashed border-amber-650/10 flex items-center justify-center pointer-events-none select-none">
                <span className="text-[10px] font-mono tracking-widest text-[#ebdcb9] font-bold uppercase rotate-12">LALIT KALA GUILD</span>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setCertificateOpen(false)}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-stone-100 text-stone-500 cursor-pointer transition-colors z-20"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Certificate content inside standard parchment scroll */}
              <div className="border border-amber-600/30 p-5 rounded-2xl bg-[#fffcf8]/90 relative space-y-4">
                
                {/* Scroll Top Crown heading */}
                <div className="space-y-1 text-center">
                  <span className="text-[10px] font-mono tracking-widest text-amber-700 font-extrabold uppercase block text-center">Traditional Guild Masterpiece Scroll</span>
                  <div className="flex items-center justify-center gap-1">
                    <div className="h-[1px] w-8 bg-amber-600" />
                    <Award className="w-4 h-4 text-amber-600" />
                    <div className="h-[1px] w-8 bg-amber-600" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-amber-900 tracking-tight leading-tight pt-1">
                    LALIT KALA ACADEMIC PARISHAD
                  </h3>
                  <p className="text-[9.5px] font-mono uppercase tracking-wider text-stone-400">
                    Mithila, Kumaon &amp; Sahyadri Heritage Division
                  </p>
                </div>

                <div className="h-[1.5px] bg-gradient-to-r from-transparent via-amber-600/40 to-transparent my-1.5" />

                {/* Main certification summary statement */}
                <div className="space-y-3 font-sans text-center">
                  <p className="text-stone-500 text-xs italic">
                    "Art, like the breath, mirrors the organic cyclical rhythms of our universe"
                  </p>
                  
                  <p className="text-[12.5px] leading-relaxed text-stone-700 font-serif">
                    This scroll certifies that the candidate has engaged rigorously in the practice of digital pigment-grinding and meticulous traditional line recreation of:
                  </p>
                  
                  {/* Masterpiece Showcase display */}
                  <div className="p-3 bg-amber-50/40 border border-amber-600/20 rounded-xl space-y-1">
                    <span className="text-[14px] font-extrabold text-amber-950 font-serif block">{activeArt.name}</span>
                    <span className="text-[10px] font-mono uppercase text-rose-800 tracking-wider">Style of {activeArt.region} ({activeArt.category})</span>
                  </div>

                  <p className="text-[11.5px] text-stone-600 font-sans leading-relaxed">
                    By completing this session, the aspirant has demonstrated deep intellectual sensitivity toward the 
                    traditional motifs of <strong>"{activeArt.motifs.slice(0, 3).join(', ')}"</strong>.
                  </p>
                </div>

                <div className="h-[1.5px] bg-gradient-to-r from-transparent via-amber-600/40 to-transparent my-1.5" />

                {/* Signature Block */}
                <div className="space-y-2 text-left bg-stone-50/80 p-3 rounded-xl border border-stone-200">
                  <label className="text-[9px] uppercase font-mono tracking-widest text-[#5c3e35] font-extrabold block">Authorized Signature of the Artisan:</label>
                  <input
                    type="text"
                    value={artSignature}
                    onChange={(e) => setArtSignature(e.target.value)}
                    placeholder="Type your name to sign scroll..."
                    className="w-full bg-white dark:bg-black border border-stone-300 font-serif text-sm p-2 rounded-lg text-amber-900 focus:outline-none focus:ring-1 focus:ring-amber-600 focus:border-amber-600 placeholder:text-stone-400"
                  />
                  {artSignature && (
                    <div className="pt-2 text-center border-t border-dashed border-stone-300">
                      <span className="font-serif italic text-lg text-amber-800 tracking-wider font-semibold block select-none px-2 py-1 transform -rotate-1">
                        ✒️ {artSignature}
                      </span>
                      <span className="text-[8px] font-mono text-stone-400 uppercase tracking-widest block pt-0.5">Verified Digital Signatory</span>
                    </div>
                  )}
                </div>

                {/* Register masterwork button controls */}
                <div className="pt-2">
                  <button
                    onClick={() => {
                      if (!artSignature) {
                        return;
                      }
                      const certKey = `${activeArt.id}-${Date.now()}`;
                      setUnlockedCertificates(prev => [...prev, certKey]);
                      setCertificateOpen(false);
                      setLastColoredRegionMessage(`Registered scroll for "${activeArt.name}" under signature "${artSignature}"`);
                    }}
                    className="w-full bg-amber-700 hover:bg-amber-800 text-white font-mono font-bold text-xs uppercase py-2.5 px-4 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Award className="w-4 h-4" />
                    <span>Register Masterwork &amp; Persist Scroll</span>
                  </button>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Expanded Interactive Fullscreen overlay modal */}
      <AnimatePresence>
        {isExpandedViewer && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-fade-in font-sans text-left">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-4xl bg-stone-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[90vh]"
            >
              <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/30 text-white shrink-0">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono uppercase bg-red-600 px-2.5 py-0.5 rounded font-bold tracking-widest text-[#fdf9f5]">Immersion view</span>
                  <h3 className="text-base font-bold font-serif">{activeArt.name} - Motif Focus Simulation</h3>
                </div>
                <button
                  onClick={() => setIsExpandedViewer(false)}
                  className="p-1 px-3 text-xs font-bold text-slate-400 dark:text-slate-500 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white rounded-xl cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 min-h-0 flex flex-col md:flex-row relative">
                {/* Large Canvas left */}
                <div className="flex-1 bg-black flex items-center justify-center p-6 border-r border-white/10 relative h-[60%] md:h-full">
                  {renderArtSimulation(activeArt.id, true)}
                </div>

                {/* Right narrative panel details */}
                <div className="w-full md:w-80 bg-stone-950 p-6 flex flex-col justify-between text-stone-300 overflow-y-auto leading-relaxed text-xs h-[40%] md:h-full border-t md:border-t-0 border-white/10">
                  <div className="space-y-4">
                    <div className="pb-3 border-b border-white/5">
                      <span className="text-[9.5px] uppercase font-mono tracking-widest text-slate-450 block font-bold">Origin Region</span>
                      <p className="text-base font-bold text-white font-serif">{activeArt.region}</p>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[9.5px] uppercase font-mono tracking-widest text-slate-455 block font-bold">Identifier Key</span>
                      <p className="text-white font-medium italic">"{activeArt.identifier}"</p>
                    </div>

                    <div className="space-y-2 pt-2 text-slate-400 dark:text-slate-555 leading-relaxed font-sans">
                      <span className="text-[9.5px] uppercase font-mono tracking-widest text-slate-455 block font-semibold">Detailed lore</span>
                      <p className="text-[11px] leading-relaxed">{activeArt.description}</p>
                      <p className="text-slate-500 dark:text-slate-400 bg-[#070b13] p-3 rounded-xl border border-white/5 text-[10.5px] leading-relaxed font-sans">
                        <strong>Technique summary:</strong> {activeArt.materials}
                      </p>
                    </div>
                  </div>

                  {/* Somatic breath integration indicator */}
                  <div className="pt-6 border-t border-white/5 mt-4 space-y-3 shrink-0">
                    <button
                      onClick={() => setBreathSync(!breathSync)}
                      className={`w-full py-3 rounded-2xl font-bold font-mono text-[11px] uppercase tracking-wider cursor-pointer border transition-all ${
                        breathSync 
                          ? "bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-900/30" 
                          : "bg-white/5 hover:bg-white/10 text-white border-white/10"
                      }`}
                    >
                      {breathSync ? "⏸ Pause Respiration Sync" : "🌬 Sync Breath Symmetry"}
                    </button>
                    <p className="text-[9px] text-slate-500 dark:text-slate-400 text-center uppercase tracking-widest font-mono">Simulates biological rhythm inside the art</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
