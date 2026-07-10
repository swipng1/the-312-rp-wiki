import React, { useState, useMemo, useRef } from "react";
import { Shield, Crosshair, FlaskConical, Search, Dice5, ChevronRight, Radio, X } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  DATA — swap this out for your real drop tables / skill trees      */
/*  stats are 0-100 scale, used to draw the bars in the detail modal   */
/* ------------------------------------------------------------------ */

const TIERS = ["Tier 1", "Tier 1.5", "Tier 2"];

const CATALOG = [
  { id: "gk19", name: "Glock 19", cat: "Firearms", tier: "Tier 1", class: "Common",
    desc: "Light sidearm for new runners. Cheap ammo, fast draw, forgiving recoil for early street work.",
    tags: ["Low recoil", "Fast draw"],
    stats: { damage: 28, range: 35, fireRate: 72, recoil: 20 } },
  { id: "cp01", name: "Combat Pistol", cat: "Firearms", tier: "Tier 1", class: "Common",
    desc: "Bigger magazine than the Glock. Built for extended stand-offs where reload timing matters.",
    tags: ["High ammo", "Reliable"],
    stats: { damage: 32, range: 38, fireRate: 65, recoil: 25 } },
  { id: "msmg", name: "Mini SMG", cat: "Firearms", tier: "Tier 1.5", class: "Rare",
    desc: "Compact automatic built for vehicle fights and alley pushes. Close range only.",
    tags: ["Close range", "Vehicle use"],
    stats: { damage: 24, range: 20, fireRate: 85, recoil: 45 } },
  { id: "smg1", name: "SMG", cat: "Firearms", tier: "Tier 1.5", class: "Uncommon",
    desc: "Standard submachine gun with steady spray control. Solid on foot or in a chase.",
    tags: ["Spray control", "Versatile"],
    stats: { damage: 30, range: 40, fireRate: 78, recoil: 38 } },
  { id: "pshot", name: "Pump Shotgun", cat: "Firearms", tier: "Tier 1.5", class: "Uncommon",
    desc: "Slow but devastating up close. One shot ends most indoor disputes.",
    tags: ["Close range", "High damage"],
    stats: { damage: 90, range: 15, fireRate: 18, recoil: 70 } },
  { id: "hvp", name: "Heavy Pistol", cat: "Firearms", tier: "Tier 1.5", class: "Rare",
    desc: "Upgraded stopping power over the standard sidearm. Common secondary for mid-tier crews.",
    tags: ["Stopping power", "Secondary"],
    stats: { damage: 45, range: 42, fireRate: 55, recoil: 40 } },
  { id: "carb", name: "Carbine Rifle", cat: "Firearms", tier: "Tier 2", class: "Epic",
    desc: "Full-auto mid-range rifle for crews who've earned it. Strong damage, open-street engagements.",
    tags: ["Mid range", "Full auto"],
    stats: { damage: 55, range: 70, fireRate: 68, recoil: 48 } },
  { id: "scarb", name: "Special Carbine", cat: "Firearms", tier: "Tier 2", class: "Epic",
    desc: "Upgraded carbine variant with tighter handling — preferred for medium-range pushes.",
    tags: ["Accuracy", "Mid range"],
    stats: { damage: 58, range: 75, fireRate: 70, recoil: 35 } },
  { id: "grnl", name: "Green Leaf", cat: "Drugs", tier: "Tier 1", class: "Common",
    desc: "Entry-level product. Cheap to move, low heat, steady baseline income for a new operation.",
    tags: ["Low heat", "Starter"],
    stats: { value: 20, heat: 15, demand: 45 } },
  { id: "pwdr", name: "Cut Powder", cat: "Drugs", tier: "Tier 1.5", class: "Uncommon",
    desc: "Mid-grade product with better margins. Draws more attention once volume picks up.",
    tags: ["Better margin", "Moderate heat"],
    stats: { value: 45, heat: 40, demand: 60 } },
  { id: "crys", name: "Crystal Batch", cat: "Drugs", tier: "Tier 2", class: "Rare",
    desc: "High-value product for established operations. Big payout, big risk if a run gets made.",
    tags: ["High value", "High heat"],
    stats: { value: 75, heat: 70, demand: 55 } },
  { id: "pill", name: "Pressed Pills", cat: "Drugs", tier: "Tier 2", class: "Epic",
    desc: "Top-tier product reserved for trusted crew. Rare drop, rarely sits in stock long.",
    tags: ["Rare drop", "Trusted crew"],
    stats: { value: 90, heat: 60, demand: 80 } },
];

const SKILLS = {
  Faction: {
    note: "Real skill list. These unlocks come directly from the faction progression track.",
    items: [
      { unlock: 3, name: "Nametags", desc: "Enables viewing nametags above players. Must be in a faction for /mark.", tags: ["Faction", "Vision utility"] },
      { unlock: 5, name: "Improvement", desc: "Allows faction members to add an additional slot to their vehicles.", tags: ["Faction", "Vehicle upgrade"] },
      { unlock: 7, name: "Tazer Resistance", desc: "No effect from tasers, once per 30 seconds.", tags: ["Faction", "Combat defense"] },
      { unlock: 7, name: "Take Cover", desc: "Grants access to Q-peek while in cover.", tags: ["Faction", "Peek access"] },
      { unlock: 9, name: "Masked Identity", desc: "Prevents your name from being logged by nearby cameras while masked.", tags: ["Faction", "Stealth"] },
    ],
  },
  Civilian: {
    note: "Placeholder starter track — shown so players can see the shape of the path before it's built out.",
    items: [
      { unlock: 2, name: "Steady Hands", desc: "Reduces sway while performing timed civilian jobs.", tags: ["Civilian", "Utility"] },
      { unlock: 4, name: "Quick Talk", desc: "Shortens dialogue wait time when interacting with job NPCs.", tags: ["Civilian", "Quality of life"] },
    ],
  },
  "Illegal Civilian": {
    note: "Placeholder starter track — shown so players can see the shape of the path before it's built out.",
    items: [
      { unlock: 3, name: "Low Profile", desc: "Slightly reduces wanted gain from minor infractions.", tags: ["Illegal", "Heat control"] },
      { unlock: 6, name: "Fence Contact", desc: "Unlocks a discreet sell option for hot goods.", tags: ["Illegal", "Economy"] },
    ],
  },
};

const CLASS_COLOR = {
  Common: "text-slate-300 border-slate-600/60",
  Uncommon: "text-emerald-300 border-emerald-500/50",
  Rare: "text-sky-300 border-sky-500/50",
  Epic: "text-amber-300 border-amber-500/50",
};

// Vite injects the real base path (e.g. "/the-312-rp-wiki/") here at build time,
// so asset URLs work whether the site is hosted at a domain root or a subfolder.
const ASSET_BASE = import.meta.env.BASE_URL;

const STAT_LABELS = {
  damage: "Damage", range: "Range", fireRate: "Fire Rate", recoil: "Recoil",
  value: "Value", heat: "Heat", demand: "Demand",
};

/* ------------------------------------------------------------------ */
/*  SMALL PIECES                                                       */
/* ------------------------------------------------------------------ */

function EvidenceTag({ item, spinning, onClick }) {
  return (
    <button
      onClick={() => onClick(item)}
      className={`relative shrink-0 w-[132px] rounded-md border border-[#2A2F37] bg-[#14171C] overflow-hidden transition-transform duration-150 text-left ${spinning ? "scale-[0.97]" : "hover:border-[#454b55]"}`}
    >
      <div className="absolute top-1.5 right-1.5 z-10 text-[9px] font-mono tracking-wider px-1.5 py-0.5 rounded-sm bg-black/60 border border-[#3a3f47] text-[#C9722D] rotate-3">
        {item.tier.replace("Tier ", "T")}
      </div>
      <div className="h-20 flex items-center justify-center bg-[#0E1013] border-b border-[#2A2F37]">
        {item.cat === "Firearms" ? <Crosshair size={26} className="text-[#5b6472]" /> : <FlaskConical size={26} className="text-[#5b6472]" />}
      </div>
      <div className="p-2">
        <div className="text-[12px] font-semibold text-[#EDEEF0] leading-tight truncate">{item.name}</div>
        <div className={`text-[10px] font-mono mt-0.5 ${CLASS_COLOR[item.class].split(" ")[0]}`}>{item.class}</div>
      </div>
    </button>
  );
}

function SectionLabel({ eyebrow, title, desc, right }) {
  return (
    <div className="flex items-start justify-between gap-6 flex-wrap mb-6">
      <div>
        <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#C9722D] mb-2">{eyebrow}</div>
        <h2 className="text-3xl md:text-4xl font-bold text-[#EDEEF0] tracking-tight" style={{ fontFamily: "'Oswald', sans-serif" }}>{title}</h2>
        {desc && <p className="text-[#8B92A0] mt-2 max-w-xl text-[14px] leading-relaxed">{desc}</p>}
      </div>
      {right}
    </div>
  );
}

function StatBar({ label, value }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] font-mono uppercase tracking-wide text-[#8B92A0]">{label}</span>
        <span className="text-[11px] font-mono text-[#EDEEF0]">{value}</span>
      </div>
      <div className="h-1.5 rounded-full bg-[#1E2126] overflow-hidden">
        <div className="h-full rounded-full bg-[#C9722D]" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function DetailModal({ item, onClose }) {
  if (!item) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-lg border border-[#2A2F37] bg-[#0E1013] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-36 flex items-center justify-center bg-[#14171C] border-b border-[#2A2F37]">
          {item.cat === "Firearms" ? <Crosshair size={40} className="text-[#454b55]" /> : <FlaskConical size={40} className="text-[#454b55]" />}
          <button onClick={onClose} className="absolute top-3 right-3 w-7 h-7 rounded-md border border-[#2A2F37] bg-[#0B0D10]/70 flex items-center justify-center text-[#8B92A0] hover:text-[#EDEEF0] transition-colors">
            <X size={14} />
          </button>
          <div className="absolute top-3 left-3 text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/60 border border-[#3a3f47] text-[#C9722D]">
            {item.tier}
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[18px] font-semibold text-[#EDEEF0]" style={{ fontFamily: "'Oswald', sans-serif" }}>{item.name}</h3>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${CLASS_COLOR[item.class]}`}>{item.class}</span>
          </div>
          <p className="text-[13px] text-[#8B92A0] leading-relaxed mb-4">{item.desc}</p>

          {item.stats && (
            <div className="flex flex-col gap-3 mb-4">
              {Object.entries(item.stats).map(([key, value]) => (
                <StatBar key={key} label={STAT_LABELS[key] ?? key} value={value} />
              ))}
            </div>
          )}

          <div className="flex gap-1.5 flex-wrap">
            {item.tags.map((t) => (
              <span key={t} className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-[#2A2F37] text-[#8B92A0]">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MAIN                                                                */
/* ------------------------------------------------------------------ */

export default function IllegalHelperSite() {
  const [rollCat, setRollCat] = useState("Firearms");
  const [rollTier, setRollTier] = useState("Tier 1");
  const [rollSlots, setRollSlots] = useState(() => Array(8).fill(CATALOG[0]));
  const [spinning, setSpinning] = useState(false);
  const spinTimer = useRef(null);

  const [skillTab, setSkillTab] = useState("Faction");

  const [catFilter, setCatFilter] = useState("All");
  const [query, setQuery] = useState("");

  const [activeItem, setActiveItem] = useState(null);

  const rollPool = useMemo(
    () => CATALOG.filter((i) => i.cat === rollCat && i.tier === rollTier),
    [rollCat, rollTier]
  );

  const filteredCatalog = useMemo(() => {
    return CATALOG.filter((i) => {
      const catOk = catFilter === "All" || i.cat === catFilter;
      const qOk = i.name.toLowerCase().includes(query.toLowerCase());
      return catOk && qOk;
    });
  }, [catFilter, query]);

  function rollRandom() {
    if (rollPool.length === 0 || spinning) return;
    setSpinning(true);
    let ticks = 0;
    clearInterval(spinTimer.current);
    spinTimer.current = setInterval(() => {
      ticks++;
      setRollSlots((prev) =>
        prev.map(() => rollPool[Math.floor(Math.random() * rollPool.length)])
      );
      if (ticks > 12) {
        clearInterval(spinTimer.current);
        setSpinning(false);
      }
    }, 70);
  }

  return (
    <div className="min-h-screen bg-[#0B0D10] text-[#EDEEF0]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
      `}</style>

      <DetailModal item={activeItem} onClose={() => setActiveItem(null)} />

      {/* NAV */}
      <div className="sticky top-0 z-30 backdrop-blur bg-[#0B0D10]/85 border-b border-[#1E2126]">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src={`${ASSET_BASE}assets/watermark.png`} alt="The 312 RP" className="w-7 h-7 rounded object-cover" />
            <span className="font-semibold tracking-tight text-[14px]" style={{ fontFamily: "'Oswald', sans-serif" }}>
              THE&nbsp;312&nbsp;<span className="text-[#C9722D]">RP</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-[13px] text-[#8B92A0]">
            <a href="#drop" className="hover:text-[#EDEEF0] transition-colors">Supply Drop</a>
            <a href="#skills" className="hover:text-[#EDEEF0] transition-colors">Skill Tree</a>
            <a href="#catalog" className="hover:text-[#EDEEF0] transition-colors">Catalog</a>
          </div>
        </div>
      </div>

      {/* HERO */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: `url('${ASSET_BASE}assets/banner.png')` }}
        />
        {/* fade to bg color so text stays readable, heaviest on the left where copy sits */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0D10] via-[#0B0D10]/85 to-[#0B0D10]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D10] via-transparent to-[#0B0D10]/40" />

        <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-14">
          <div className="flex items-center gap-2 text-[11px] font-mono tracking-[0.2em] uppercase text-[#8B92A0] mb-5">
            <Radio size={12} className="text-[#C9722D]" />
            The 312 RP — Case File Open
          </div>
          <h1 className="text-5xl md:text-6xl font-bold leading-[1.05] tracking-tight max-w-2xl" style={{ fontFamily: "'Oswald', sans-serif" }}>
            Everything your crew<br />needs on record.
          </h1>
          <p className="text-[#8B92A0] mt-5 max-w-lg text-[15px] leading-relaxed">
            Browse the supply drop, check what each skill route unlocks, and look up
            every weapon and product the streets have to offer — before you commit to a run.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <a href="#drop" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-[#C9722D] text-[#0B0D10] text-[13px] font-semibold hover:bg-[#dd7f34] transition-colors">
              <Dice5 size={15} /> Open supply drop
            </a>
            <a href="#catalog" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md border border-[#2A2F37] text-[13px] font-medium hover:border-[#454b55] transition-colors">
              <Crosshair size={15} /> View catalog
            </a>
            <a href="#skills" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md border border-[#2A2F37] text-[13px] font-medium hover:border-[#454b55] transition-colors">
              <ChevronRight size={15} /> Skill tree
            </a>
          </div>
        </div>
      </div>

      {/* SUPPLY DROP / ROLL */}
      <div id="drop" className="border-t border-[#1E2126]">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <SectionLabel
            eyebrow="Random Draw"
            title="Supply Drop"
            desc="Roll against the current tier's pool. Odds are shown by classification — Common through Epic. Tap any tag for full stats."
            right={
              <div className="flex flex-col items-end gap-2">
                <div className="flex gap-1 bg-[#14171C] border border-[#2A2F37] rounded-md p-1">
                  {["Firearms", "Drugs"].map((c) => (
                    <button key={c} onClick={() => setRollCat(c)}
                      className={`px-3 py-1.5 rounded text-[12px] font-medium transition-colors ${rollCat === c ? "bg-[#C9722D] text-[#0B0D10]" : "text-[#8B92A0] hover:text-[#EDEEF0]"}`}>
                      {c}
                    </button>
                  ))}
                </div>
                <div className="flex gap-1 bg-[#14171C] border border-[#2A2F37] rounded-md p-1">
                  {TIERS.map((t) => (
                    <button key={t} onClick={() => setRollTier(t)}
                      className={`px-3 py-1.5 rounded text-[12px] font-medium transition-colors ${rollTier === t ? "bg-[#2A2F37] text-[#EDEEF0]" : "text-[#8B92A0] hover:text-[#EDEEF0]"}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            }
          />

          <div className="flex gap-3 overflow-x-auto pb-2 mb-4">
            {rollSlots.map((item, idx) => (
              <EvidenceTag key={idx} item={item} spinning={spinning} onClick={setActiveItem} />
            ))}
          </div>

          <button
            onClick={rollRandom}
            disabled={rollPool.length === 0}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-md bg-[#EDEEF0] text-[#0B0D10] font-semibold text-[14px] tracking-wide hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Dice5 size={17} className={spinning ? "animate-spin" : ""} />
            {rollPool.length === 0 ? "No items in this tier yet" : "ROLL RANDOM"}
          </button>
        </div>
      </div>

      {/* SKILLS */}
      <div id="skills" className="border-t border-[#1E2126]">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <SectionLabel
            eyebrow="New Roleplayer Helper"
            title="Skill Information"
            desc="A clear guide for players to check what each route can unlock. Faction reflects the real skill list; the other tracks are placeholders for future expansion."
            right={
              <div className="text-[11px] font-mono px-2.5 py-1 rounded border border-[#2A2F37] text-[#8B92A0] flex items-center gap-1.5 h-fit">
                <Shield size={12} /> {Object.keys(SKILLS).length} character paths
              </div>
            }
          />

          <div className="flex gap-1 bg-[#14171C] border border-[#2A2F37] rounded-md p-1 w-fit mb-6">
            {Object.keys(SKILLS).map((tab) => (
              <button key={tab} onClick={() => setSkillTab(tab)}
                className={`px-3.5 py-1.5 rounded text-[12.5px] font-medium transition-colors ${skillTab === tab ? "bg-[#C9722D] text-[#0B0D10]" : "text-[#8B92A0] hover:text-[#EDEEF0]"}`}>
                {tab}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-[1fr_280px] gap-5 items-start">
            <div className="rounded-md border border-[#2A2F37] bg-[#0E1013]">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#2A2F37]">
                <span className="text-[13px] font-semibold text-[#EDEEF0]">{skillTab} skill tree</span>
                <span className="text-[11px] font-mono text-[#8B92A0]">{SKILLS[skillTab].items.length} skills listed</span>
              </div>
              <div className="divide-y divide-[#1E2126]">
                {SKILLS[skillTab].items.map((s, i) => (
                  <div key={i} className="flex gap-4 px-4 py-4">
                    <div className="shrink-0 w-12 text-center">
                      <div className="text-[9px] font-mono tracking-widest text-[#8B92A0] uppercase">Unlock</div>
                      <div className="text-2xl font-bold text-[#C9722D]" style={{ fontFamily: "'Oswald', sans-serif" }}>{s.unlock}</div>
                    </div>
                    <div>
                      <div className="text-[14px] font-semibold text-[#EDEEF0]">{s.name}</div>
                      <div className="text-[13px] text-[#8B92A0] mt-0.5 leading-relaxed">{s.desc}</div>
                      <div className="flex gap-1.5 mt-2">
                        {s.tags.map((t) => (
                          <span key={t} className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-[#2A2F37] text-[#8B92A0]">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-md border border-[#2A2F37] bg-[#0E1013] p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px] font-semibold">Other path tabs</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-[#2A2F37] text-[#8B92A0]">Placeholder sets</span>
              </div>
              <div className="rounded border border-[#C9722D]/30 bg-[#C9722D]/[0.06] p-3">
                <div className="text-[11px] font-mono uppercase tracking-wider text-[#C9722D] mb-1">Guide note</div>
                <p className="text-[12.5px] text-[#a8adb8] leading-relaxed">{SKILLS[skillTab].note}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CATALOG */}
      <div id="catalog" className="relative border-t border-[#1E2126] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-[position:center_20%] opacity-[0.12]"
          style={{ backgroundImage: `url('${ASSET_BASE}assets/icg_collage_1920x1080.png')` }}
        />
        <div className="absolute inset-0 bg-[#0B0D10]/70" />

        <div className="relative max-w-6xl mx-auto px-6 py-14">
          <SectionLabel
            eyebrow="All Items + Descriptions"
            title="Weapon & Product Catalog"
            desc="A full browse area so players can see every main reward, what it's good for, and which playstyle it fits before pulling the random selector. Click a card for full stats."
          />

          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex gap-1 bg-[#14171C] border border-[#2A2F37] rounded-md p-1">
              {["All", "Firearms", "Drugs"].map((c) => (
                <button key={c} onClick={() => setCatFilter(c)}
                  className={`px-3.5 py-1.5 rounded text-[12.5px] font-medium transition-colors ${catFilter === c ? "bg-[#C9722D] text-[#0B0D10]" : "text-[#8B92A0] hover:text-[#EDEEF0]"}`}>
                  {c}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-[#2A2F37] bg-[#14171C] w-full sm:w-64">
              <Search size={14} className="text-[#8B92A0]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search items..."
                className="bg-transparent outline-none text-[13px] text-[#EDEEF0] placeholder:text-[#5b6472] w-full"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCatalog.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveItem(item)}
                className="text-left rounded-md border border-[#2A2F37] bg-[#0E1013] overflow-hidden hover:border-[#454b55] transition-colors"
              >
                <div className="h-28 flex items-center justify-center bg-[#14171C] border-b border-[#2A2F37]">
                  {item.cat === "Firearms" ? <Crosshair size={28} className="text-[#454b55]" /> : <FlaskConical size={28} className="text-[#454b55]" />}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[14px] font-semibold text-[#EDEEF0]">{item.name}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${CLASS_COLOR[item.class]}`}>{item.class}</span>
                  </div>
                  <p className="text-[12.5px] text-[#8B92A0] leading-relaxed mb-3">{item.desc}</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {item.tags.map((t) => (
                      <span key={t} className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-[#2A2F37] text-[#8B92A0]">{t}</span>
                    ))}
                  </div>
                </div>
              </button>
            ))}
            {filteredCatalog.length === 0 && (
              <div className="col-span-full text-center py-12 text-[#5b6472] text-[13px]">No items match that search.</div>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-[#1E2126] py-8">
        <div className="max-w-6xl mx-auto px-6 text-[11px] font-mono text-[#5b6472] text-center">
          THE 312 RP — internal helper, not affiliated with Rockstar Games or Take-Two Interactive.
        </div>
      </div>
    </div>
  );
}
