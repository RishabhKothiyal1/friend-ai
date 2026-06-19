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

  // Active Tab: "gallery" | "syllabus" | "pitch"
  const [activeSubTab, setActiveSubTab] = useState<"gallery" | "syllabus" | "pitch">("gallery");

  // Syllabus Tab Collapsible States
  const [expandedSyllabus, setExpandedSyllabus] = useState<string | null>("ivc");

  // Clickable UPSC practice questions state
  const [answeredQuestion, setAnsweredQuestion] = useState<{ [key: string]: string }>({});
  const [showUpscMainsFeedback, setShowUpscMainsFeedback] = useState(false);

  // 4-Minute Presentation Carousel State
  const [activePitchSlide, setActivePitchSlide] = useState<number>(0);
  const [pitchTimerActive, setPitchTimerActive] = useState<boolean>(false);
  const [pitchProgress, setPitchProgress] = useState<number>(0);

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

  // Startup Pitch Timer Player simulation
  useEffect(() => {
    let interval: any = null;
    if (pitchTimerActive) {
      interval = setInterval(() => {
        setPitchProgress((prev) => {
          if (prev >= 100) {
            // Next Slide
            setActivePitchSlide((s) => (s + 1) % PITCH_SLIDES.length);
            return 0;
          }
          return prev + 1.66; // approx 60 seconds total loop per slide
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [pitchTimerActive]);

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
                <g transform="translate(-14, 25) scale(0.65)" className="cursor-crosshair" onClick={() => handleFillAction("goddess_footprint_1", "Lakshmi entrance footprint (left)")}>
                  <path d="M4 12 C1 12 1 18 4 18 C7 18 7 12 4 12" fill={getFillColor("goddess_footprint_1", "#ffffff")} />
                  <circle cx="3" cy="8" r="1.5" fill={getFillColor("goddess_footprint_1", "#ffffff")} />
                </g>
                <g transform="translate(4, 25) scale(0.65)" className="cursor-crosshair" onClick={() => handleFillAction("goddess_footprint_2", "Lakshmi entrance footprint (right)")}>
                  <path d="M4 12 C1 12 1 18 4 18 C7 18 7 12 4 12" fill={getFillColor("goddess_footprint_2", "#ffffff")} />
                  <circle cx="3" cy="8" r="1.5" fill={getFillColor("goddess_footprint_2", "#ffffff")} />
                </g>
              </g>
            </motion.svg>
            <span className="absolute bottom-2.5 left-3 text-[9px] font-mono tracking-widest text-[#f9fafb]/60 uppercase">Uttarakhand Ritual Aipan Mandalas</span>
          </div>
        );

      default:
        const paletteRef = activeArt.colorPalette;
        return (
          <div className="relative flex flex-col items-center justify-center bg-[#422c1e] text-orange-200 overflow-hidden rounded-2xl w-full h-64 md:h-80 border border-orange-500/10 shadow-lg">
            <motion.svg 
              viewBox="0 0 100 100" 
              className="w-48 h-48 drop-shadow-md z-10"
              animate={animationPlaying ? { rotate: 360 } : {}}
              transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
            >
              <circle 
                cx="50" 
                cy="50" 
                r="48" 
                fill={getFillColor("canvas_background", "#160f0a")} 
                className="cursor-crosshair"
                onClick={() => handleFillAction("canvas_background", "Traditional Mud Clay Core")}
              />
              <circle 
                cx="50" 
                cy="50" 
                r="42" 
                fill="none" 
                stroke={getFillColor("outer_border", paletteRef[0] || "#991b1b")} 
                strokeWidth="2.5" 
                className="cursor-crosshair"
                onClick={() => handleFillAction("outer_border", "Double-Line Border Frame")}
              />
              <circle 
                cx="50" 
                cy="50" 
                r="30" 
                fill="none" 
                stroke={getFillColor("mandala_ring", paletteRef[2] || "#1e3a8a")} 
                strokeWidth="1.5" 
                strokeDasharray="3,3" 
                className="cursor-crosshair"
                onClick={() => handleFillAction("mandala_ring", "Symmetric Lotus Mandala Ring")}
              />
              <circle 
                cx="50" 
                cy="50" 
                r="10" 
                fill={getFillColor("pinnacle_circle", paletteRef[3] || "#ffffff")} 
                stroke={paletteRef[0] || "#991b1b"} 
                strokeWidth="1" 
                className="cursor-crosshair"
                onClick={() => handleFillAction("pinnacle_circle", "Sacred Core Pinnacle Bindu")}
              />
              {[45, 135, 225, 315].map((deg) => (
                <line 
                  key={deg} 
                  x1="50" 
                  y1="50" 
                  x2={50 + 20 * Math.cos((deg * Math.PI) / 180)} 
                  y2={50 + 20 * Math.sin((deg * Math.PI) / 180)} 
                  stroke={getFillColor("corner_motifs", paletteRef[4] || paletteRef[0] || "#facd12")} 
                  strokeWidth="1" 
                  className="cursor-crosshair"
                  onClick={() => handleFillAction("corner_motifs", "Auspicious Corner Peacocks")}
                />
              ))}
            </motion.svg>
            <span className="absolute bottom-2 left-3 text-[8.5px] font-mono tracking-widest text-[#facd12]/50 uppercase z-10">Dynamic Guild Mandala Activity</span>
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
            <span className="absolute bottom-2 left-2 text-[8px] bg-white dark:bg-slate-900 px-1.5 py-0.5 border border-red-500 rounded font-mono text-[#be2222] font-bold z-10">Mithila Horror Vacui</span>
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

                <g transform="translate(-8, -8) scale(0.8)">
                  <path d="M4 12 C1 12 1 18 4 18 C7 18 7 12 4 12" fill="white" />
                  <circle cx="3" cy="8" r="1.5" fill="white" />
                  <circle cx="5" cy="7" r="1.2" fill="white" />
                  <circle cx="7" cy="8.2" r="1" fill="white" />

                  <path d="M12 12 C9 12 9 18 12 18 C15 18 15 12 12 12" fill="white" />
                  <circle cx="11" cy="8" r="1.5" fill="white" />
                  <circle cx="13" cy="7" r="1.2" fill="white" />
                  <circle cx="15" cy="8.2" r="1" fill="white" />
                </g>
              </g>
            </motion.svg>
            <span className="absolute bottom-2.5 left-3 text-[9px] font-mono tracking-widest text-[#f9fafb]/60 uppercase">Geru Mud & Rice Paste "Vasudhara"</span>
          </div>
        );

      default:
        // Render beautiful, organic abstract geometric floral representation for other arts
        return (
          <div className="relative flex items-center justify-center bg-[#5c4033] overflow-hidden rounded-2xl w-full h-32">
            <div className="absolute inset-x-0 top-0 h-1 bg-[#d97706]/40" />
            <div className="absolute inset-x-0 bottom-0 h-1 bg-[#d97706]/40" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(253,186,116,0.1)_0%,transparent_65%)]" />
            
            <motion.svg 
              viewBox="0 0 100 100" 
              className="w-20 h-20 text-orange-200 z-10"
              animate={animationPlaying ? { rotate: 360 } : {}}
              transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
            >
              <circle cx="50" cy="50" r="32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4,4" />
              <circle cx="50" cy="50" r="24" fill="none" stroke="#d97706" strokeWidth="1" />
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                <line 
                  key={deg} 
                  x1="50" 
                  y1="50" 
                  x2={50 + 24 * Math.cos((deg * Math.PI) / 180)} 
                  y2={50 + 24 * Math.sin((deg * Math.PI) / 180)} 
                  stroke="currentColor" 
                  strokeWidth="0.8" 
                />
              ))}
              <circle cx="50" cy="50" r="4.5" fill="#d97706" />
            </motion.svg>
            <span className="absolute bottom-1.5 right-2 text-[7px] font-mono uppercase text-orange-100/40">Organic Pigment Wash Layout</span>
          </div>
        );
    }
  };

  const activePitchSlideContent = PITCH_SLIDES[activePitchSlide];

  return (
    <div className="flex flex-col gap-6 w-full text-left font-sans select-none animate-fade-in">
      
      {/* Decorative Ornate Folk Art Header block */}
      <div className="border-4 border-double border-rose-800 bg-[#fbf5eb] p-6 rounded-3xl relative overflow-hidden flex flex-col gap-2.5 shadow-sm dark:shadow-slate-900/30">
        {/* Double Outline borders symbolizing Madhubani and Pattachitra borders */}
        <div className="absolute inset-1 border border-yellow-700/20 rounded-2xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10 font-bold text-[120px] leading-none pointer-events-none text-rose-800 select-none">🎨</div>
        
        <div className="flex flex-col gap-1 z-10 text-left">
          <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-rose-800 font-extrabold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-700 animate-pulse" />
            Vedic Cultural Sanctuary
          </span>
          <h2 className="text-xl md:text-2xl font-bold font-serif text-[#3e2723] leading-tight">
            Indian Art, Civilizational Study &amp; Startup Pitch
          </h2>
          <p className="text-xs text-stone-600 max-w-3xl leading-relaxed font-sans">
            An elegant integration celebrating the 20 masterpiece folk paintings of India, historical UPSC academic studies ranging from the Indus Valley Civilization to modern eras, and Project Friend AI's 4-minute investor validation deck.
          </p>
        </div>

        {/* 3 major sub tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-4 z-10 border-t pt-4 border-stone-200">
          <button
            onClick={() => setActiveSubTab("gallery")}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl cursor-pointer transition-all flex items-center gap-1.5 ${
              activeSubTab === "gallery"
                ? "bg-rose-850 hover:bg-rose-900 text-white shadow-sm dark:shadow-slate-900/30 font-serif"
                : "text-stone-650 hover:bg-stone-100/60 hover:text-stone-850"
            }`}
          >
            🎨 Interactive Folk Art Manuscript
          </button>
          
          <button
            onClick={() => setActiveSubTab("syllabus")}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl cursor-pointer transition-all flex items-center gap-1.5 ${
              activeSubTab === "syllabus"
                ? "bg-rose-850 hover:bg-rose-900 text-white shadow-sm dark:shadow-slate-900/30 font-serif"
                : "text-stone-650 hover:bg-stone-100/60 hover:text-stone-850"
            }`}
          >
            🏛️ Civilizational Chronicles (UPSC)
          </button>

          <button
            onClick={() => setActiveSubTab("pitch")}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl cursor-pointer transition-all flex items-center gap-1.5 ${
              activeSubTab === "pitch"
                ? "bg-rose-850 hover:bg-rose-900 text-white shadow-sm dark:shadow-slate-900/30 font-serif"
                : "text-stone-650 hover:bg-stone-100/60 hover:text-stone-850"
            }`}
          >
            ⏱️ Startup Pitch (4-Min Presentation)
          </button>
        </div>
      </div>

      {/* RENDER ACTIVE SUBTAB CONTENT */}

      {/* TAB 1: FOLK ART INTERACTIVE MANUSCRIPT */}
      {activeSubTab === "gallery" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-sans">
          
          {/* Left Canvas Panel */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 bg-white dark:bg-slate-900 border border-[#ebdcb9] rounded-2xl shadow-xs flex flex-col gap-4 text-left">
              {/* Header with high fidelity selectors */}
              <div className="flex flex-col gap-3 border-b pb-3 border-dashed border-[#ebdcb9]">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-extrabold tracking-tight text-neutral-800 uppercase font-mono">Guild Workshop Frame</h4>
                    <p className="text-[10px] text-stone-500 font-sans">Symmetric geometries rendered as vector paths</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => setIsExpandedViewer(true)}
                      className="p-1 px-1.5 text-stone-500 bg-stone-50 hover:bg-stone-100 rounded-lg cursor-pointer flex items-center justify-center border border-stone-200/40"
                      title="Fullscreen Immersion View"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Sub-mode selector */}
                <div className="grid grid-cols-2 p-1 bg-stone-55 rounded-xl border border-stone-200/50">
                  <button
                    onClick={() => setPaintingMode("simulator")}
                    className={`py-1.5 text-[10.5px] font-bold rounded-lg cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                      paintingMode === "simulator"
                        ? "bg-stone-850 text-white shadow-xs"
                        : "text-stone-600 hover:text-stone-850"
                    }`}
                  >
                    <span>💫 Living Breath</span>
                  </button>
                  <button
                    onClick={() => setPaintingMode("coloring")}
                    className={`py-1.5 text-[10.5px] font-bold rounded-lg cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                      paintingMode === "coloring"
                        ? "bg-rose-800 text-white shadow-xs"
                        : "text-stone-600 hover:text-stone-800"
                    }`}
                  >
                    <span>🎨 Coloring Workshop</span>
                  </button>
                </div>
              </div>

              {/* Viewport Canvas container */}
              <div className="relative group">
                {paintingMode === "simulator" ? (
                  <div className="relative">
                    {renderArtSimulation(activeArt.id, false)}
                    
                    {/* Controls overlay for simulator */}
                    <div className="absolute top-2.5 right-2 z-10 flex items-center gap-1 bg-white/90 backdrop-blur-xs p-1 rounded-lg border border-stone-250 shadow-xs">
                      <button 
                        onClick={() => setAnimationPlaying(!animationPlaying)}
                        className="p-1 px-2 text-[9px] font-extrabold font-mono uppercase hover:bg-stone-100 text-stone-700 rounded-md cursor-pointer"
                      >
                        {animationPlaying ? "⏸ Pause" : "▶ Play"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    {renderInteractiveColoringSVG(activeArt.id, false)}
                  </div>
                )}
              </div>

              {/* Dynamic coloring details and indicators */}
              {paintingMode === "coloring" && (
                <div className="space-y-3.5 bg-[#fffbf4] border border-[#ebdcb9]/40 p-3 rounded-xl">
                  {/* Progress segment */}
                  <div className="flex items-center justify-between text-[10px] uppercase font-mono tracking-wider font-extrabold text-[#5c3e35]">
                    <span>📜 Artwork Completion Progress:</span>
                    <span className="text-rose-800">{coloringCount} / {totalRegionsCount} details ({completionPercentage}%)</span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-stone-200/50 h-1.5 rounded-full overflow-hidden">
                    <motion.div 
                      className="bg-rose-700 h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${completionPercentage}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>

                  {/* Pigment Swatch selectors */}
                  <div className="space-y-1.5 pt-0.5">
                    <span className="text-[9px] uppercase font-mono tracking-wider text-stone-400 block font-bold">Choose Traditional Pigment:</span>
                    <div className="flex flex-wrap items-center gap-2">
                      {activeArt.colorPalette.map((col, idx) => {
                        const info = getPigmentInfo(col);
                        const isBrush = selectedBrush === col;
                        return (
                          <button
                            key={idx}
                            onClick={() => setSelectedBrush(col)}
                            style={{ backgroundColor: col }}
                            className={`w-7 h-7 rounded-full border shadow-xs relative transition-all duration-200 hover:scale-115 cursor-pointer ${
                              isBrush ? "ring-2 ring-rose-700 ring-offset-1 scale-110" : "border-black/10"
                            }`}
                            title={`${info.name}: Sourced from ${info.source}`}
                          >
                            {isBrush && (
                              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-extrabold text-white drop-shadow-md">✓</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Active brush lore */}
                  {selectedBrush && (
                    <div className="bg-white/80 border border-stone-200/50 p-2.5 rounded-lg text-left text-[10.5px] leading-relaxed text-stone-600 transition-all">
                      <div className="flex items-center gap-1.5 font-bold text-stone-800 mb-0.5">
                        <Paintbrush className="w-3 h-3 text-rose-700" />
                        <span>Active Brush: {getPigmentInfo(selectedBrush).name}</span>
                        <span className="text-[8px] font-mono text-stone-400">({getPigmentInfo(selectedBrush).source})</span>
                      </div>
                      <p className="text-stone-500 text-[10px] font-sans italic">
                        "{getPigmentInfo(selectedBrush).lore}"
                      </p>
                    </div>
                  )}

                  {/* Sandboxing controls */}
                  <div className="grid grid-cols-2 gap-2 pt-0.5">
                    <button
                      onClick={handleAutoColorize}
                      className="py-1 px-2.5 text-[9.5px] font-mono font-bold uppercase bg-stone-105 hover:bg-stone-200 text-stone-700 rounded-lg border border-stone-250 cursor-pointer flex items-center justify-center gap-1"
                    >
                      <span>✨ Auto-Colorize</span>
                    </button>
                    <button
                      onClick={handleClearCanvas}
                      className="py-1 px-2.5 text-[9.5px] font-mono font-bold uppercase bg-stone-105 hover:bg-stone-200 text-stone-700 rounded-lg border border-stone-250 cursor-pointer flex items-center justify-center gap-1"
                    >
                      <span>🧹 Clear Canvas</span>
                    </button>
                  </div>

                  {/* Certificate triggering button or action info */}
                  <div className="pt-0.5">
                    <button
                      onClick={() => setCertificateOpen(true)}
                      className={`w-full py-1.5 px-3 rounded-lg text-[10.5px] font-bold uppercase font-mono cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                        completionPercentage === 100
                          ? "bg-amber-600 hover:bg-amber-700 text-white shadow-md animate-pulse"
                          : "bg-stone-100 hover:bg-[#ebd0a3]/20 text-stone-600 border border-stone-200/60"
                      }`}
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>{completionPercentage === 100 ? "🏆 Claim Masterpiece Scroll!" : "📜 Traditional Art Certificate"}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Dynamic lore card (rendered for both, showing visual information) */}
              <div className="space-y-3 p-3 bg-[#fffbf2] border border-[#ebdcb9]/60 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-rose-800 uppercase tracking-widest font-mono">🔍 Visual Detail</span>
                  <span className={`text-[8px] font-mono px-2 py-0.5 rounded font-extrabold ${
                    activeArt.giStatus === "Yes" ? "bg-emerald-500/10 text-emerald-700 border border-emerald-250" : "bg-stone-100 text-stone-500"
                  }`}>
                    {activeArt.giStatus === "Yes" ? "🏆 GI Tagged Art" : "Traditional Form"}
                  </span>
                </div>
                <h3 className="text-[13px] font-bold font-serif text-[#3e2723]">{activeArt.name}</h3>
                <p className="text-[11px] leading-relaxed text-stone-600">{activeArt.description}</p>
                <div className="text-[10px] bg-white dark:bg-slate-900 border border-stone-150 p-2 rounded-lg text-stone-500">
                  <strong>Sacred Lore &amp; Context:</strong> {activeArt.lore}
                </div>
              </div>

              {/* Quick breath resonance card (only in simulator mode) */}
              {paintingMode === "simulator" && (
                <div className="border border-emerald-200/50 p-3 rounded-xl bg-emerald-50/20 text-left flex flex-col gap-2">
                  <div className="flex items-center gap-1.5 justify-between">
                    <span className="text-[10px] font-extrabold text-emerald-850 uppercase tracking-wider font-mono flex items-center gap-1">
                      <Wind className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                      Respiratory Mirror Sync
                    </span>
                    <button
                      onClick={() => setBreathSync(!breathSync)}
                      className={`px-2 py-0.8 text-[9.5px] font-bold font-mono rounded-lg border transition-all cursor-pointer ${
                        breathSync 
                          ? "bg-emerald-750 text-white border-emerald-800" 
                          : "bg-white dark:bg-slate-900 hover:bg-emerald-50 text-emerald-800 border-emerald-200"
                      }`}
                    >
                      {breathSync ? "Active ✓" : "Sync Pulse"}
                    </button>
                  </div>
                  <p className="text-[10px] text-stone-500 leading-relaxed">
                    Borders and geometric lines in tribal art mirror natural cyclical rhythms. Click "Sync Pulse" to watch the canvas gently inhale and exhale at an organic rate.
                  </p>
                  {breathSync && (
                    <div className="flex items-center justify-between text-[9px] font-mono text-emerald-700 bg-white/70 px-2 py-1 rounded">
                      <span>Active Cycle: {isBreatheIn ? "🌬 Inhale (Expanding)" : "💨 Exhale (Stabilizing)"}</span>
                      <span className="font-extrabold">Timer: {seconds}s</span>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>

          {/* Right Paintings Catalog Grid */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-4.5 bg-white dark:bg-slate-900 border border-[#ebdcb9] rounded-2xl shadow-xs text-left">
              
              {/* Search & filters */}
              <div className="flex flex-col md:flex-row gap-3 items-stretch justify-between pb-4 border-b border-stone-150">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name, origin region, or identifiers..."
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl text-xs pl-9 pr-3 py-2 text-stone-800 outline-none focus:border-rose-700 transition-all font-sans placeholder-stone-400"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-stone-50 border border-stone-200 rounded-xl text-[11px] font-bold text-stone-700 px-2.5 py-2 outline-none focus:border-rose-700 cursor-pointer"
                  >
                    <option value="All">All Categories</option>
                    <option value="Folk">Folk Art</option>
                    <option value="Tribal">Tribal Art</option>
                    <option value="Classical">Classical Art</option>
                  </select>

                  <select
                    value={selectedGI}
                    onChange={(e) => setSelectedGI(e.target.value)}
                    className="bg-stone-50 border border-stone-200 rounded-xl text-[11px] font-bold text-stone-700 px-2.5 py-2 outline-none focus:border-rose-700 cursor-pointer"
                  >
                    <option value="All">GI Tagged - All</option>
                    <option value="Yes">Has GI Tag Only</option>
                    <option value="No">No GI Tag</option>
                  </select>

                  {(searchTerm || selectedCategory !== "All" || selectedGI !== "All") && (
                    <button
                      onClick={handleResetFilters}
                      className="p-2 bg-[#be2222]/10 text-rose-800 hover:bg-[#be2222]/15 text-xs font-bold rounded-xl cursor-pointer"
                      title="Clear active filters"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>

              {/* Catalog Items list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-4 max-h-[460px] overflow-y-auto pr-1 no-scrollbar">
                {filteredPaintings.length === 0 ? (
                  <div className="col-span-2 py-8 text-center text-stone-450 text-xs italic font-serif">
                    No traditional masterpieces found matching current filters. Try resetting search parameters.
                  </div>
                ) : (
                  filteredPaintings.map((art) => {
                    const isActive = art.id === activePaintingId;
                    return (
                      <button
                        key={art.id}
                        onClick={() => setActivePaintingId(art.id)}
                        className={`p-3 rounded-xl border text-left transition-all flex items-start gap-4 cursor-pointer relative overflow-hidden group ${
                          isActive 
                            ? "bg-[#fffcf3] border-rose-800 shadow-md scale-[1.01]" 
                            : "bg-stone-50/50 hover:bg-stone-100/50 border-stone-200"
                        }`}
                      >
                        {/* Motif circular badge */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 border uppercase font-serif ${
                          isActive ? "bg-rose-850 text-white border-rose-900" : "bg-white dark:bg-slate-900 text-stone-600 border-stone-200"
                        }`}>
                          {art.name.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1 leading-tight text-left">
                          <h4 className="text-[12px] font-extrabold text-[#3e2723] truncate group-hover:text-rose-800 transition-colors">{art.name}</h4>
                          <p className="text-[10px] text-stone-500 font-bold truncate mt-0.5">{art.region} • {art.category}</p>
                          <p className="text-[9.5px] text-stone-550 italic truncate mt-1">Key: {art.identifier}</p>
                        </div>
                        {isActive && (
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-800 shrink-0 mt-1 shadow-sm dark:shadow-slate-900/30" />
                        )}
                      </button>
                    );
                  })
                )}
              </div>

              {/* Major Folk Paintings Table */}
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
          </div>

        </div>
      )}

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
                    traditional motifs of <strong>"{activeArt.motifs.slice(0, 3).join(', ')}"</strong> as documented in the Civilizational Archives for the UPSC.
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
                    className="w-full bg-white dark:bg-slate-900 border border-stone-300 font-serif text-sm p-2 rounded-lg text-amber-900 focus:outline-none focus:ring-1 focus:ring-amber-600 focus:border-amber-600 placeholder:text-stone-400"
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

      {/* TAB 2: CIVILIZATIONAL CHRONICLES (UPSC) */}
      {activeSubTab === "syllabus" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-sans animate-fade-in">
          
          {/* Syllabus Topics Accordion - Column left */}
          <div className="lg:col-span-8 space-y-4">
            <div className="p-5 bg-white dark:bg-slate-900 border border-[#ebdcb9] rounded-2xl shadow-xs text-left space-y-4.5">
              
              <div className="border-b pb-3 border-stone-200">
                <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-rose-800 font-extrabold block">Academics &amp; Civilizational Legacy Archive</span>
                <h3 className="text-lg font-bold font-serif text-[#3e2723] mt-1">UPSC GS Paper-I syllabus: Indian Art &amp; Socio-Economic History</h3>
                <p className="text-xs text-stone-500 mt-1">
                  Dive into the core dynamics of pre-colonial agrarian communities, civilizational bonds originating from the Indus Valley, and critical socio-religious transitions.
                </p>
              </div>

              {/* Accordion list */}
              <div className="space-y-3 font-sans">
                
                {/* 1. Decline of IVC */}
                <div className="border border-stone-200 rounded-xl overflow-hidden shadow-2xs">
                  <button
                    onClick={() => setExpandedSyllabus(expandedSyllabus === "ivc" ? null : "ivc")}
                    className="w-full bg-stone-50/40 hover:bg-stone-50 p-3 flex items-center justify-between text-left cursor-pointer border-b border-stone-150"
                  >
                    <span className="text-xs font-bold font-serif text-[#3e2723] flex items-center gap-2">
                      <span className="text-red-700 font-mono">I.</span> The Twilight of Indus: Decline of Indus Valley Civilization
                    </span>
                    <span className="text-stone-400 text-xs font-mono">{expandedSyllabus === "ivc" ? "[ Collapse ]" : "[ Expand ]"}</span>
                  </button>
                  {expandedSyllabus === "ivc" && (
                    <motion.div 
                      initial={{ height: 0 }} 
                      animate={{ height: "auto" }} 
                      className="p-4 bg-white dark:bg-slate-900 text-xs leading-relaxed text-stone-600 font-sans space-y-3"
                    >
                      <p>
                        The decline of the <strong>Indus Valley Civilization (IVC)</strong> around 1900 BCE represents one of the most studied transitions in ancient history. The decline was not a sudden cataclysmic event caused by a single invasion, but a gradual, century-long process of urban disintegration.
                      </p>
                      <h5 className="font-bold text-[#3e2723] font-serif">Primary Contributing Factors:</h5>
                      <ul className="list-disc pl-4 space-y-1.5 leading-relaxed font-sans">
                        <li><strong>Hydro-Climatic Shifts:</strong> The gradual drying up of the Gaggar-Hakra river system coupled with erratic monsoon shifts severely compromised the agricultural base of primary hubs like Harappa and Mohenjo-daro.</li>
                        <li><strong>Tectonic Disruptions:</strong> Tectonic block elevations near the coast resulted in extensive flooding, transforming urban settlements into unusable waterlogged areas or entirely swamping the ports.</li>
                        <li><strong>Ecological Over-exploitation:</strong> The extensive manufacturing of baked terracotta bricks required massive deforestation, destroying the surrounding ecosystem and intensifying soil salinity or desertification.</li>
                        <li><strong>De-urbanization Patterns:</strong> Instead of immediate extinction, the population migrated eastward and southward towards the Ganges basin, exchanging grid-planned cities for localized, decentralized farming setups.</li>
                      </ul>
                      <div className="p-3 bg-red-50/40 border border-red-200 rounded-lg text-red-950 font-serif">
                        💡 <strong>Civilizational Bond:</strong> Mohenjo-daro ("Graves of the Dead") represents this rich heritage. Persia in the West and Indonesia in the East traded with ancient India, testifying to a deep-rooted trade and cultural footprint.
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* 2. Second Urbanization */}
                <div className="border border-stone-200 rounded-xl overflow-hidden shadow-2xs">
                  <button
                    onClick={() => setExpandedSyllabus(expandedSyllabus === "urbanization" ? null : "urbanization")}
                    className="w-full bg-stone-50/40 hover:bg-stone-50 p-3 flex items-center justify-between text-left cursor-pointer border-b border-stone-150"
                  >
                    <span className="text-xs font-bold font-serif text-[#3e2723] flex items-center gap-2">
                      <span className="text-red-700 font-mono">II.</span> The Second Urbanization of India
                    </span>
                    <span className="text-stone-400 text-xs font-mono">{expandedSyllabus === "urbanization" ? "[ Collapse ]" : "[ Expand ]"}</span>
                  </button>
                  {expandedSyllabus === "urbanization" && (
                    <div className="p-4 bg-white dark:bg-slate-900 text-xs leading-relaxed text-stone-600 font-sans space-y-2">
                      <p>
                        Occurring around the 6th Century BCE in the Ganga Valley, the <strong>Second Urbanization</strong> marks a dramatic departure from nomadic agrarian life to dense city layouts and organized state power.
                      </p>
                      <ul className="list-disc pl-4 space-y-1 leading-normal font-sans">
                        <li><strong>Iron Metallurgy (The Catalyst):</strong> The discovery of hard iron tools allowed communities to clear the dense forests of the Ganga basin, bringing vast, highly fertile terrains under plow agriculture.</li>
                        <li><strong>Agricultural Surpluses:</strong> Wet paddy transplantation increased agrarian yields. The resulting surplus enabled a diverse population (craftsmen, soldiers, priests) to live in cities, separating production from food collection.</li>
                        <li><strong>Emergence of Mahajanapadas:</strong> The surplus and territory struggles gave rise to 16 great territorial states (Mahajanapadas), with Magadha emerging as the pre-eminent empire due to local iron/elephant reserves.</li>
                        <li><strong>Monetized Economy:</strong> The introduction of punch-marked silver and copper coins replaced barter trade, cementing market relations and commercial networks across guilds.</li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* 3. Varna vs Jati */}
                <div className="border border-stone-200 rounded-xl overflow-hidden shadow-2xs">
                  <button
                    onClick={() => setExpandedSyllabus(expandedSyllabus === "caste" ? null : "caste")}
                    className="w-full bg-stone-50/40 hover:bg-stone-50 p-3 flex items-center justify-between text-left cursor-pointer border-b border-stone-150"
                  >
                    <span className="text-xs font-bold font-serif text-[#3e2723] flex items-center gap-2">
                      <span className="text-red-700 font-mono">III.</span> Stratification dynamics: Varna vs Jati
                    </span>
                    <span className="text-stone-400 text-xs font-mono">{expandedSyllabus === "caste" ? "[ Collapse ]" : "[ Expand ]"}</span>
                  </button>
                  {expandedSyllabus === "caste" && (
                    <div className="p-4 bg-white dark:bg-slate-900 text-xs leading-relaxed text-stone-600 font-sans space-y-2">
                      <p>
                        A major focus of UPSC socio-anthropological study is explaining the difference between the scriptural Varna system and the operational Jati system.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
                        <div className="p-3 bg-[#fffbf2] border border-[#ebdcb9] rounded-xl text-stone-700">
                          <h6 className="font-bold text-[#3e2723] uppercase text-[10px] font-mono tracking-widest pb-1 border-b">The Varna Framework</h6>
                          <p className="mt-1.5 leading-relaxed text-[11px]">
                            A rigid, four-fold textual classification (Brahmin, Kshatriya, Vaishya, Shudra) originating in Vedic texts (Purusha Sukta). It is highly standardized, theoretical, and does not capture local region-based craft dynamics.
                          </p>
                        </div>
                        <div className="p-3 bg-[#fffbf2] border border-[#ebdcb9] rounded-xl text-stone-700">
                          <h6 className="font-bold text-[#3e2723] uppercase text-[10px] font-mono tracking-widest pb-1 border-b">The Jati Reality</h6>
                          <p className="mt-1.5 leading-relaxed text-[11px]">
                            An operational occupational unit numbering in the thousands. Jatis are highly localized, endogamous groups bound to specific tasks, guilds, or crafts. Jati relationships drive the actual productive relations on the ground.
                          </p>
                        </div>
                      </div>
                      <p>
                        Across the subcontinent, this order of caste imposed itself on incoming groups, absorbing new communities with minimal friction but cementing strict social divisions, creating a distinct civilization framework.
                      </p>
                    </div>
                  )}
                </div>

                {/* 4. Delhi Sultanate and 17th Century Economics */}
                <div className="border border-stone-200 rounded-xl overflow-hidden shadow-2xs">
                  <button
                    onClick={() => setExpandedSyllabus(expandedSyllabus === "medieval" ? null : "medieval")}
                    className="w-full bg-stone-50/40 hover:bg-stone-50 p-3 flex items-center justify-between text-left cursor-pointer border-b border-stone-150"
                  >
                    <span className="text-xs font-bold font-serif text-[#3e2723] flex items-center gap-2">
                      <span className="text-red-700 font-mono">IV.</span> Medieval Dynasties &amp; 17th Century Economy
                    </span>
                    <span className="text-stone-400 text-xs font-mono">{expandedSyllabus === "medieval" ? "[ Collapse ]" : "[ Expand ]"}</span>
                  </button>
                  {expandedSyllabus === "medieval" && (
                    <div className="p-4 bg-white dark:bg-slate-900 text-xs leading-relaxed text-stone-600 font-sans space-y-3">
                      <div>
                        <h5 className="font-bold font-serif text-[#3e2723]">Delhi Sultanate Changes:</h5>
                        <p className="mt-1 text-stone-605 text-[11px]">
                          The period was defined by rapid dynastic shifts (Mamluk, Khalji, Tughlaq, Sayyid, Lodi). Alauddin Khalji introduced price fixing and direct crop measures (Iqta reforms). Muhammad bin Tughlaq tested token brass currencies and centralized administrative techniques. These reforms broke the power of localized rural intermediaries, creating central tax-receiving nodes.
                        </p>
                      </div>
                      <div className="border-t pt-3.5 border-stone-150">
                        <h5 className="font-bold font-serif text-[#3e2723]">Factors Contributing to the 17th Century Economic Boom:</h5>
                        <p className="mt-1 text-stone-605 text-[11px]">
                          As European traders arrived, India maintained a highly advanced position under late Muajir empires. Primary factors:
                        </p>
                        <ul className="list-disc pl-4 mt-1 space-y-1.5 text-[11px] leading-relaxed">
                          <li><strong>High Agrarian Yields:</strong> Encouragement of cash crops (indigo, cotton, sugarcane, tobacco), supported by structured tax concessions and loan systems (Taqavi).</li>
                          <li><strong>Banking Infrastructure:</strong> Highly organized capital networks driven by merchant bankers (Sethi, Shroffs) utilizing reliable promissory notes (*Hundis*) across trans-continental routes.</li>
                          <li><strong>Textile Dominance:</strong> Cotton hand-weavings and dyed fabrics became the number-one global export; Kalamkari styled prints (*Chintz*) were prized across Europe, drawing massive trade and precious metals into India.</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                {/* 5. WW1 aftermath and Print culture */}
                <div className="border border-stone-200 rounded-xl overflow-hidden shadow-2xs">
                  <button
                    onClick={() => setExpandedSyllabus(expandedSyllabus === "modern" ? null : "modern")}
                    className="w-full bg-stone-50/40 hover:bg-stone-50 p-3 flex items-center justify-between text-left cursor-pointer border-b border-stone-150"
                  >
                    <span className="text-xs font-bold font-serif text-[#3e2723] flex items-center gap-2">
                      <span className="text-red-700 font-mono">V.</span> Modern Transition: World War I &amp; Colonial Print Culture
                    </span>
                    <span className="text-stone-400 text-xs font-mono">{expandedSyllabus === "modern" ? "[ Collapse ]" : "[ Expand ]"}</span>
                  </button>
                  {expandedSyllabus === "modern" && (
                    <div className="p-4 bg-white dark:bg-slate-900 text-xs leading-relaxed text-stone-600 font-sans space-y-3">
                      <div>
                        <h5 className="font-bold font-serif text-[#3e2723]">Impact of World War I on India:</h5>
                        <p className="mt-1 text-[11px]">
                          The war placed massive burdens on India. The British administration introduced military expenditures, high customs duties, and direct income tax. Food prices skyrocketed, causing severe distress among common workers. However, the resulting shortage of British imports acted as a shield, allowing domestic industrial groups (like Birla and Tata) to expand.
                        </p>
                      </div>
                      <div className="border-t pt-3.5 border-stone-150">
                        <h5 className="font-bold font-serif text-[#3e2723]">Role of Print Culture in Colonial India:</h5>
                        <p className="mt-1 text-[11px]">
                          The introduction of vernacular presses became India's foremost anti-colonial tool. Print transformed a set of localized, dispersed struggles into a unified national community. It allowed regional languages (Hindi, Bengali, Tamil, Marathi) to debate social issues, critique British administration techniques, and celebrate traditional styles of Indian folk art as emblems of local pride.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

              </div>

            </div>
          </div>

          {/* Interactive Live Clickable UPSC Question Cards - Column right */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-4 bg-[#fbf8f0] border border-[#ebdcb9] rounded-2xl text-left space-y-4 shadow-sm dark:shadow-slate-900/30">
              <div className="flex items-center gap-2 pb-2.5 border-b border-[#ebdcb9]">
                <HelpCircle className="w-5 h-5 text-amber-800" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#3e2723] font-serif">Practice UPSC Board</h4>
                  <p className="text-[9px] text-stone-500 font-sans">Click options to check answers and hints</p>
                </div>
              </div>

              {/* Question 1 */}
              <div className="p-3 bg-white dark:bg-slate-900 border border-stone-200 rounded-xl flex flex-col gap-2">
                <span className="text-[9px] bg-amber-100 text-amber-900 border border-amber-200 font-bold font-mono px-2 py-0.5 rounded-full select-none w-max">
                  Prelims 2015 Question
                </span>
                <p className="text-[11px] font-bold text-[#3e2723] leading-relaxed">
                  The Kalamkari painting refers to:
                </p>
                <div className="flex flex-col gap-1.5 text-[10px] mt-1.5">
                  {[
                    { key: "a", text: "A hand-painted cotton textile in South India." },
                    { key: "b", text: "A handmade drawing on bamboo handicrafts in North-East India." },
                    { key: "c", text: "A block-painted woollen cloth in Western Himalayan region." },
                    { key: "d", text: "A hand-painted decorative silk cloth in North-Western India." }
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => setAnsweredQuestion({ ...answeredQuestion, q1: opt.key })}
                      className={`p-2 rounded-lg text-left transition-all border cursor-pointer ${
                        answeredQuestion.q1 === opt.key 
                          ? opt.key === "a" 
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300 font-bold" 
                            : "bg-red-50 text-rose-800 border-red-300"
                          : "bg-stone-50 hover:bg-stone-100 border-stone-150"
                      }`}
                    >
                      ({opt.key}) {opt.text}
                      {answeredQuestion.q1 === opt.key && (
                        <span className="block text-[9px] font-mono mt-1 text-stone-500">
                          {opt.key === "a" ? "✓ Correct! Kalamkari uses organic kalam (pen) on cotton textiles." : "❌ Incorrect. Try again!"}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2 */}
              <div className="p-3 bg-white dark:bg-slate-900 border border-stone-200 rounded-xl flex flex-col gap-2">
                <span className="text-[9px] bg-amber-100 text-amber-900 border border-amber-200 font-bold font-mono px-2 py-0.5 rounded-full select-none w-max">
                  Prelims 2013 Question
                </span>
                <p className="text-[11px] font-bold text-[#3e2723] leading-relaxed">
                  Which of the following historical places is/are known for mural paintings?
                  <br />
                  <span className="font-normal block mt-1 text-stone-605">1. Ajanta Caves • 2. Lepakshi Temple • 3. Sanchi Stupa</span>
                </p>
                <div className="flex flex-col gap-1.5 text-[10px] mt-1">
                  {[
                    { key: "a", text: "1 only" },
                    { key: "b", text: "1 and 2 only" },
                    { key: "c", text: "1, 2 and 3" },
                    { key: "d", text: "None of the above" }
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => setAnsweredQuestion({ ...answeredQuestion, q2: opt.key })}
                      className={`p-2 rounded-lg text-left transition-all border cursor-pointer ${
                        answeredQuestion.q2 === opt.key 
                          ? opt.key === "b" 
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300 font-bold" 
                            : "bg-red-50 text-rose-800 border-red-300"
                          : "bg-stone-50 hover:bg-stone-100 border-stone-150"
                      }`}
                    >
                      ({opt.key}) {opt.text}
                      {answeredQuestion.q2 === opt.key && (
                        <span className="block text-[9px] font-mono mt-1 text-stone-500">
                          {opt.key === "b" ? "✓ Correct. Ajanta and Lepakshi contain magnificent ceiling/wall murals. Sanchi Stupa has ornate stone carvings, not murals." : "❌ Incorrect. Sanchi stupa only features carvings."}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mains Writing Board */}
              <div className="p-3 bg-white dark:bg-slate-900 border border-[#ebdcb9] rounded-xl flex flex-col gap-2">
                <span className="text-[9px] bg-yellow-100 text-yellow-850 font-bold font-mono px-2 py-0.5 rounded-full w-max">
                  UPSC Mains Corner
                </span>
                <h5 className="text-[11px] font-bold text-[#3e2723] leading-tight font-serif">
                  Q. "Safeguarding the Indian Art Heritage is the need of the moment." Discuss. (15 Marks)
                </h5>
                <button
                  onClick={() => setShowUpscMainsFeedback(!showUpscMainsFeedback)}
                  className="w-full text-center py-2 bg-rose-850 hover:bg-rose-900 text-white font-bold text-[10px] font-serif rounded-lg transition-all cursor-pointer"
                >
                  {showUpscMainsFeedback ? "Hide Analysis Answer" : "Unfold Model Essay Structure"}
                </button>
                {showUpscMainsFeedback && (
                  <div className="p-2.5 bg-rose-50/40 rounded-lg text-[10.5px] text-stone-600 leading-relaxed font-sans space-y-1.5 border border-rose-100 animate-fade-in">
                    <p><strong>Model Structure:</strong></p>
                    <p>1. <strong>Introduction:</strong> Define Indian art as a living archives of community memory (Gond, Phad, Aipan). Mention Geographical Indication (GI) tag protective laws.</p>
                    <p>2. <strong>Major Threats:</strong> Commercial exploitation, dilution of natural pigment techniques (replacing minerals with synthetics), loss of oral storytelling lineages (Bhopas of Phad scrolls).</p>
                    <p>3. <strong>Solutions:</strong> Skill preservation programs, craft-based micro-enterprise tourism (such as Amadubi's Paitkar village), and digital registration of indigenous designs.</p>
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>
      )}

      {/* TAB 3: STARTUP PITCH PLATFORM */}
      {activeSubTab === "pitch" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-sans animate-fade-in">
          
          {/* Slide Deck presentation - Column left */}
          <div className="lg:col-span-8 space-y-4">
            <div className="p-5 bg-white dark:bg-slate-900 border-4 border-double border-orange-900/30 rounded-2xl shadow-sm dark:shadow-slate-900/30 text-left relative overflow-hidden">
              <div className="absolute inset-1 border border-amber-900/10 rounded-xl pointer-events-none" />
              
              {/* Timeline Progress Header */}
              <div className="flex items-center justify-between border-b pb-3 border-stone-200">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#aa6b51] font-extrabold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#aa6b51]" />
                    Slide Presentation: {activePitchSlideContent.timeMark}
                  </span>
                  <h3 className="text-base font-bold font-serif text-[#3e2723]">
                    {activePitchSlideContent.slideTitle}
                  </h3>
                </div>
                
                {/* Timer Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setPitchTimerActive(!pitchTimerActive);
                      if (!pitchTimerActive) setPitchProgress(0);
                    }}
                    className={`p-1.5 px-3 text-[10px] font-bold font-mono uppercase rounded-lg cursor-pointer transition-all ${
                      pitchTimerActive 
                        ? "bg-[#be2222]/10 text-rose-800 border border-[#be2222]/20"
                        : "bg-[#aa6b51] hover:bg-[#aa6b51]/90 text-white border border-transparent"
                    }`}
                  >
                    {pitchTimerActive ? "⏸ Pause Timeline" : "▶ Start Autoplay"}
                  </button>
                  <span className="text-[10px] font-mono font-bold text-stone-500 bg-stone-100 p-1 px-2 rounded-lg">
                    {activePitchSlide + 1} / {PITCH_SLIDES.length}
                  </span>
                </div>
              </div>

              {/* Autoplay Loading Bar */}
              {pitchTimerActive && (
                <div className="w-full h-1 bg-stone-100 rounded-full overflow-hidden mt-1 mx-0">
                  <div className="h-full bg-[#aa6b51] transition-all" style={{ width: `${pitchProgress}%` }} />
                </div>
              )}

              {/* Dynamic Slide Visual Component */}
              <div className={`my-5 py-6 px-5 rounded-2xl border flex flex-col justify-between min-h-[190px] relative overflow-hidden transition-all duration-300 ${activePitchSlideContent.themeClass}`}>
                <div className="absolute right-3.5 top-3.5 font-bold text-[85px] text-white/5 opacity-20 pointer-events-none select-none">
                  {activePitchSlide + 1}
                </div>
                
                <div className="z-10 text-left space-y-2">
                  <span className="text-[9px] uppercase font-mono tracking-widest bg-white/20 text-white p-1 px-2 rounded w-max block font-bold">
                    Slide Contents Overview
                  </span>
                  <h4 className="text-base font-bold text-white font-serif tracking-tight leading-tight">
                    {activePitchSlideContent.header}
                  </h4>
                  <p className="text-[11.5px] leading-relaxed text-white/90 max-w-xl">
                    {activePitchSlideContent.description}
                  </p>
                </div>

                {/* Sub features grid in slide */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 border-t pt-4 border-white/20 mt-4 z-10 text-left">
                  {activePitchSlideContent.bulletPoints.map((pt, k) => (
                    <div key={k} className="p-2 bg-white/10 rounded-lg text-white">
                      <h5 className="font-bold text-[10.5px] font-mono leading-none">{pt.title}</h5>
                      <span className="text-[8.5px] opacity-75 mt-1 block leading-tight">{pt.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Full script text blocks */}
              <div className="space-y-3.5 p-4 bg-[#fbfaf6] border border-dashed border-[#ebdcb9] rounded-xl text-left">
                <div className="flex items-center gap-1.5 pb-2 border-b border-stone-200 justify-between">
                  <span className="text-[9.5px] uppercase font-mono tracking-wider font-extrabold text-[#3e2723]">
                    🎙 Pitch Script (Read Aloud)
                  </span>
                  <span className="text-[9px] bg-amber-50 text-amber-900 border border-amber-200 px-1.5 py-0.2 rounded font-mono font-bold select-none">
                    {activePitchSlideContent.timeMark}
                  </span>
                </div>
                <p className="text-xs text-stone-705 leading-relaxed font-sans italic whitespace-pre-wrap select-text selection:bg-rose-100">
                  "{activePitchSlideContent.script}"
                </p>
              </div>

              {/* Slide controls carousel */}
              <div className="flex items-center justify-between pt-4 mt-1 border-t border-stone-150">
                <button
                  disabled={activePitchSlide === 0}
                  onClick={() => {
                    setActivePitchSlide((s) => s - 1);
                    setPitchProgress(0);
                  }}
                  className="px-2.5 py-1.5 bg-stone-50 hover:bg-stone-100 disabled:opacity-40 text-stone-605 text-[11px] font-bold rounded-lg cursor-pointer border border-stone-200 transition-all flex items-center gap-1"
                >
                  Back Slide
                </button>
                <div className="flex items-center gap-1.5">
                  {PITCH_SLIDES.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setActivePitchSlide(idx);
                        setPitchProgress(0);
                      }}
                      className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                        idx === activePitchSlide ? "bg-[#aa6b51] w-5" : "bg-stone-200 hover:bg-stone-300"
                      }`}
                    />
                  ))}
                </div>
                <button
                  disabled={activePitchSlide === PITCH_SLIDES.length - 1}
                  onClick={() => {
                    setActivePitchSlide((s) => s + 1);
                    setPitchProgress(0);
                  }}
                  className="px-2.5 py-1.5 bg-rose-850 hover:bg-rose-900 text-white text-[11px] font-bold rounded-lg cursor-pointer transition-all flex items-center gap-1"
                >
                  Next Slide
                </button>
              </div>

            </div>
          </div>

          {/* Slide Deck Info & Sidebar Pitch Metadata */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Slide Index navigator */}
            <div className="p-4 bg-white dark:bg-slate-900 border border-[#ebdcb9] rounded-2xl text-left space-y-3 shadow-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#3e2723] font-serif border-b pb-2">Pitch Overview Cards</h4>
              
              <div className="flex flex-col gap-2">
                {PITCH_SLIDES.map((slide, idx) => {
                  const isActive = idx === activePitchSlide;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setActivePitchSlide(idx);
                        setPitchProgress(0);
                      }}
                      className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex items-center gap-3.5 ${
                        isActive 
                          ? "bg-[#fffbf6] border-[#aa6b51] shadow-xs"
                          : "bg-stone-50/60 hover:bg-stone-100/60 border-stone-150"
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-md flex items-center justify-center font-mono font-extrabold text-[10px] shrink-0 ${
                        isActive ? "bg-[#aa6b51] text-white" : "bg-stone-200 text-stone-605"
                      }`}>
                        M{idx + 1}
                      </span>
                      <div className="min-w-0 flex-1 leading-tight text-left">
                        <h5 className="font-extrabold text-[#3e2723] text-[11px] truncate">{slide.slideTitle}</h5>
                        <p className="text-[9.5px] text-stone-500 truncate mt-0.5">{slide.timeMark}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Strategic slides meta details */}
            <div className="p-4 bg-[#fdf9f2] border border-[#ebdcb9] rounded-2xl text-left space-y-3 shadow-xs">
              <div className="flex items-center gap-1 pb-1.5 border-b border-[#ebdcb9]">
                <span className="text-base select-none">📈</span>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#3e2723] font-serif">Strategy Blueprint</h4>
              </div>
              
              <div className="space-y-2.5 text-xs text-stone-600 leading-relaxed font-sans">
                <div className="p-2.5 bg-white dark:bg-slate-900 border border-stone-150 rounded-xl space-y-1">
                  <span className="font-bold text-[#3e2723] text-[10.5px] block font-serif">Corporate Valuation</span>
                  <p className="text-[10px] leading-normal font-sans">
                    <strong>Pre-Seed Block:</strong> ₹4.78 Crores ($500K USD) on a ₹57 Crore ($6M USD) Post-Money SAFE arrangement.
                  </p>
                </div>
                
                <div className="p-2.5 bg-white dark:bg-slate-900 border border-stone-150 rounded-xl space-y-1">
                  <span className="font-bold text-[#3e2723] text-[10.5px] block font-serif">Product Target</span>
                  <p className="text-[10px] leading-normal font-sans">
                    <strong>Use of Funds:</strong> Establish production-grade client offline sandboxes. Scale secure offline nodes to 10,000 active monthly clients.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

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
                      <span className="text-[9.5px] uppercase font-mono tracking-widest text-slate-450 block font-bold">Identifier Key</span>
                      <p className="text-white font-medium italic">"{activeArt.identifier}"</p>
                    </div>

                    <div className="space-y-2 pt-2 text-slate-400 dark:text-slate-500 leading-relaxed font-sans">
                      <span className="text-[9.5px] uppercase font-mono tracking-widest text-slate-450 block font-semibold">Detailed lore</span>
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

// Startup Presentation Slides data structure
interface PitchSlide {
  slideTitle: string;
  timeMark: string;
  header: string;
  description: string;
  themeClass: string;
  bulletPoints: { title: string; desc: string }[];
  script: string;
}

const PITCH_SLIDES: PitchSlide[] = [
  {
    slideTitle: "The Hook & The 'Loud Room'",
    timeMark: "[0:00 - 1:00]",
    header: "Countering the 'AI Psychosis' with a Quiet Room sanctuary",
    description: "Most modern mental-health systems maximize screens, dynamic slot machines, fake notifications, and artificial visual proxies to command your time. Project Friend AI does the exact opposite—acting as a 'Quiet Sanctuary' respect-boundary mechanism.",
    themeClass: "bg-[#9c2a1b] border-[#d4af37]/40 text-stone-100", // Aipan Rust Theme
    bulletPoints: [
      { title: "No False Pretense", desc: "Never attempts to pretend to be a real human being." },
      { title: "Boundary Guard", desc: "No hooks, no virtual girlfriend scripts, zero addiction loops." },
      { title: "Calming Breath", desc: "Designed explicitly for moments when your mind feels too noisy." },
      { title: "Plural Harmony", desc: "Originating in Indus Valley community bonds to support internal diversity." }
    ],
    script: "Imagine your brain is a room. When you get stressed, sad, or overwhelmed, that room gets incredibly noisy. Right now, most tech companies build AI apps to do one thing: push their way into your room, turn on a loud TV, hand you a slot machine, and throw a fake friend in your face. They do this just to keep your eyes glued to the screen, because your screen-time makes them money. But all that noise leaves people feeling trapped, anxious, and completely disconnected. Project Friend AI is the exact opposite. It is a 'Quiet Room' designed for moments when the mind feels too loud. Our app has one single rule: it does not pretend to be a real human being. It doesn’t try to hook you, it doesn’t try to become your virtual girlfriend or boyfriend, and it never tries to maximize your screen time. Its only job is to help you sit down, take a deep breath, and feel steady again."
  },
  {
    slideTitle: "Absolute Privacy & The Safe Map",
    timeMark: "[1:00 - 2:00]",
    header: "Your secrets locked on the device, paired with a safe supportive map",
    description: "No emails required. No user databases. Everything is encrypted on-device. If a high-risk language threshold triggers, a hard-coded local LGBTQIA+ friendly helpline directory takes over instantly with supportive legal counsel referrals.",
    themeClass: "bg-[#0c1b40] border-[#e6c35c]/40 text-stone-100", // Pichwai Blue
    bulletPoints: [
      { title: "Zero Database", desc: "No cloud telemetry or tracking footprint saved." },
      { title: "Direct Referrals", desc: "Triage is handed off straight to real human medical teams." },
      { title: "LGBTQIA+ Friendly", desc: "Personally curated helplines for marginalized groups." },
      { title: "Secure Vaults", desc: "On-device pins seed robust AES-256 local partitions." }
    ],
    script: "Because this is a safe space for your mind, it has to be a safe space for your secrets. When someone uses Project Friend AI, we don’t ask for their name, their email, or their data. Everything stays completely locked on the user's own phone. We don't track them, we don't store their conversations on a cloud server, and we can't see what they say. But sometimes, a quiet room isn't enough. Sometimes, a person is in a real-world emergency. We don't let an AI try to chat someone out of a real medical or legal crisis. Instead, the app instantly pauses the conversation and shows our International Crisis and Support Directory. As a queer and non-binary founder, I know firsthand that traditional helplines aren't always safe spaces for marginalized communities. That is why this directory is personally curated to be explicitly LGBTQIA+ friendly. It acts as a safe, local map that connects the user directly to real human experts: psychiatrists, clinical psychologists, supportive therapists, and even lawyers for complex medico-legal cases."
  },
  {
    slideTitle: "How We Keep It Running",
    timeMark: "[2:00 - 3:00]",
    header: "100% Free & Open Access: Unrestricted Specialized Grounding Protocols",
    description: "Ethical design focused on public health. Every specialized somatic, dialectical-behavioral, or cognitive reframing mode is completely free and instantly unlocked with zero paywalls.",
    themeClass: "bg-[#521313] border-[#ca8a04]/40 text-stone-100", // Chittara Rust
    bulletPoints: [
      { title: "The Hope Protocol", desc: "Witness mode focused on deep listening & validating." },
      { title: "The Abhay Protocol", desc: "CBT reframings using clear, analytic structured logic." },
      { title: "The Raag Protocol", desc: "Somatic steps, low-tempo ragas and physical grounding." },
      { title: "The Rooh Protocol", desc: "DBT emotional regulation to tolerate high distress waves." }
    ],
    script: "To make sure this tool is globally accessible, we offer every specialized advanced 'Support Protocol' completely free of charge with zero paywalls or tiers. These premium-mode reframings do not change the AI into a 'fake person' with a fictional story. Instead, they change how the AI helps you think. I named these protocols after the family members who inspired me to build this: The Hope Protocol: A compassionate witnessing mode that focuses entirely on listening, validating, and making the user feel deeply heard... The Abhay Protocol: An analytical reframing mode that uses structured logic to help break down looping, stressful thoughts... The Raag Protocol: A practical, action-oriented mode that gives the user tiny, clear physical steps to ground themselves... The Rooh Protocol: An emotional regulation mode designed to help people tolerate high distress when a wave of panic hits."
  },
  {
    slideTitle: "The Tech Behind the Privacy",
    timeMark: "[3:00 - 4:00]",
    header: "Sovereign local-first safety net and stateless fetching",
    description: "Built using Friend AI. Catching high-risk distress vocabulary instantly. Complete off-the-grid architecture with zero tracking coordinates, device identifiers, or server footprints.",
    themeClass: "bg-[#0b4a2e] border-[#ebdcb9]/40 text-stone-100", // Rogan Kutch
    bulletPoints: [
      { title: "Friend AI Safety", desc: "Utilizing safety filters to trigger directories flawlessly." },
      { title: "Sovereign Storage", desc: "International support lists reside right in client code." },
      { title: "Stateless Updates", desc: "Fetches static files for number updates & logs off." },
      { title: "Zero Servers", desc: "Complete cryptographic data sanitizations locally." }
    ],
    script: "We built this entire prototype using Friend AI because its advanced safety classifiers allow us to catch high-risk language instantly and trigger our safety nets flawlessly. But our biggest technical achievement is how we keep this system completely off the grid: First, Local Storage: The entire international emergency directory is saved right inside the code on the user's device. The phone never has to ping a database or reveal a user's location to find a local doctor or lawyer. Second, Stateless Updates: When we need to update phone numbers or add new inclusive doctors to the directory, the app uses stateless fetching. It checks a static file, downloads the text updates, and logs off. No user tracking, no device IDs, no server footprints."
  }
];
