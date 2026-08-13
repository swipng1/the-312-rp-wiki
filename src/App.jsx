import React, { useState, useMemo, useRef, useEffect } from "react";
import { Shield, Crosshair, FlaskConical, Search, Dice5, ChevronRight, X } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  DATA — swap this out for your real drop tables / skill trees      */
/*  stats are 0-100 scale, used to draw the bars in the detail modal   */
/* ------------------------------------------------------------------ */

const TIERS = ["Tier 1", "Tier 1.5", "Tier 2"];
const KINDS = ["Pistol", "Rifle", "SMG"];

const CATALOG = [
  { id: "rlmicroc", name: "Ridgeline Micro Custom", cat: "Firearms", tier: "Tier 2", class: "Mythic",
    kind: "Rifle", icon: "WEAPON_RLMICROC.webp", rank: 1,
    desc: "Full-auto rifle putting out 272 DPS at 380 RPM. Holds damage better at distance than any pistol here and runs a 30-round magazine for extended fights.",
    tags: ["Full auto", "High DPS", "Stopping power", "Wide spread"],
    stats: { damage: 43, magazine: 30, fireRate: 380, dps: 272, ttk: 0.63 } },
  { id: "vs20sc", name: "Voss 20 Switch", cat: "Firearms", tier: "Tier 2", class: "Mythic",
    kind: "Pistol", icon: "WEAPON_VS20SC.webp", rank: 2,
    desc: "Switch-converted machine pistol running 600 RPM for 360 DPS. Melts anything up close; the 50-round magazine is plenty to work with.",
    tags: ["Full auto", "High DPS", "Stopping power", "Large magazine"],
    stats: { damage: 36, magazine: 50, fireRate: 600, dps: 360, ttk: 0.5 } },
  { id: "rlarpb", name: "Ridgeline ARP Blue", cat: "Firearms", tier: "Tier 2", class: "Legendary",
    kind: "Rifle", icon: "WEAPON_RLARPB.webp", rank: 3,
    desc: "Full-auto rifle putting out 237 DPS at 444 RPM. Holds damage better at distance than any pistol here and runs a 50-round magazine for extended fights.",
    tags: ["Full auto", "Large magazine", "Long range", "Penetrating"],
    stats: { damage: 32, magazine: 50, fireRate: 444, dps: 237, ttk: 0.81 } },
  { id: "rlarpsc", name: "Ridgeline ARP Shellcatcher", cat: "Firearms", tier: "Tier 2", class: "Legendary",
    kind: "Rifle", icon: "WEAPON_RLARPSC.webp", rank: 4,
    desc: "Full-auto rifle putting out 237 DPS at 444 RPM. Holds damage better at distance than any pistol here and runs a 50-round magazine for extended fights.",
    tags: ["Full auto", "Large magazine", "Long range", "Penetrating"],
    stats: { damage: 32, magazine: 50, fireRate: 444, dps: 237, ttk: 0.81 } },
  { id: "rlarpsk", name: "Ridgeline Skeleton ARP", cat: "Firearms", tier: "Tier 2", class: "Legendary",
    kind: "Rifle", icon: "WEAPON_RLARPSK.webp", rank: 5,
    desc: "Full-auto rifle putting out 237 DPS at 444 RPM. Holds damage better at distance than any pistol here and runs a 50-round magazine for extended fights.",
    tags: ["Full auto", "Large magazine", "Long range", "Penetrating"],
    stats: { damage: 32, magazine: 50, fireRate: 444, dps: 237, ttk: 0.81 } },
  { id: "vs40mosrs", name: "Voss 40 MOS Red Switch", cat: "Firearms", tier: "Tier 2", class: "Legendary",
    kind: "Pistol", icon: "WEAPON_VS40MOSRS.webp", rank: 6,
    desc: "Switch-converted machine pistol running 600 RPM for 320 DPS. Melts anything up close; the 50-round magazine is plenty to work with.",
    tags: ["Full auto", "High DPS", "Large magazine"],
    stats: { damage: 32, magazine: 50, fireRate: 600, dps: 320, ttk: 0.6 } },
  { id: "rlar9sc", name: "Ridgeline AR9 Shellcatcher", cat: "Firearms", tier: "Tier 2", class: "Legendary",
    kind: "Rifle", icon: "WEAPON_RLAR9SC.webp", rank: 7,
    desc: "Full-auto rifle putting out 237 DPS at 444 RPM. Holds damage better at distance than any pistol here and runs a 32-round magazine for extended fights.",
    tags: ["Full auto", "Long range", "Penetrating"],
    stats: { damage: 32, magazine: 32, fireRate: 444, dps: 237, ttk: 0.81 } },
  { id: "rlarp4b", name: "Ridgeline ARP 4 Blue Binary", cat: "Firearms", tier: "Tier 1.5", class: "Epic",
    kind: "Rifle", icon: "WEAPON_RLARP4B.webp", rank: 8,
    desc: "Full-auto rifle putting out 237 DPS at 444 RPM. Holds damage better at distance than any pistol here and runs a 30-round magazine for extended fights.",
    tags: ["Full auto", "Long range", "Penetrating"],
    stats: { damage: 32, magazine: 30, fireRate: 444, dps: 237, ttk: 0.81 } },
  { id: "rlarp4c", name: "Ridgeline ARP 4 Custom", cat: "Firearms", tier: "Tier 1.5", class: "Epic",
    kind: "Rifle", icon: "WEAPON_RLARP4C.webp", rank: 9,
    desc: "Full-auto rifle putting out 237 DPS at 444 RPM. Holds damage better at distance than any pistol here and runs a 30-round magazine for extended fights.",
    tags: ["Full auto", "Long range", "Penetrating"],
    stats: { damage: 32, magazine: 30, fireRate: 444, dps: 237, ttk: 0.81 } },
  { id: "rlarp75c", name: "Ridgeline ARP 7.5 Custom", cat: "Firearms", tier: "Tier 1.5", class: "Epic",
    kind: "Rifle", icon: "WEAPON_RLARP75C.webp", rank: 10,
    desc: "Full-auto rifle putting out 237 DPS at 444 RPM. Holds damage better at distance than any pistol here and runs a 30-round magazine for extended fights.",
    tags: ["Full auto", "Long range", "Penetrating"],
    stats: { damage: 32, magazine: 30, fireRate: 444, dps: 237, ttk: 0.81 } },
  { id: "rlarp762m", name: "Ridgeline ARP 762 Mini", cat: "Firearms", tier: "Tier 1.5", class: "Epic",
    kind: "Rifle", icon: "WEAPON_RLARP762M.webp", rank: 11,
    desc: "Full-auto rifle putting out 237 DPS at 444 RPM. Holds damage better at distance than any pistol here and runs a 30-round magazine for extended fights.",
    tags: ["Full auto", "Long range", "Penetrating"],
    stats: { damage: 32, magazine: 30, fireRate: 444, dps: 237, ttk: 0.81 } },
  { id: "rlminisc", name: "Ridgeline Mini Shellcatcher", cat: "Firearms", tier: "Tier 1.5", class: "Epic",
    kind: "Rifle", icon: "WEAPON_RLMINISC.webp", rank: 12,
    desc: "Full-auto rifle putting out 190 DPS at 380 RPM. Holds damage better at distance than any pistol here and runs a 50-round magazine for extended fights.",
    tags: ["Full auto", "Large magazine", "Wide spread", "Long range"],
    stats: { damage: 30, magazine: 50, fireRate: 380, dps: 190, ttk: 0.95 } },
  { id: "rlarpstc", name: "Ridgeline ARP Street Custom", cat: "Firearms", tier: "Tier 1.5", class: "Epic",
    kind: "Pistol", icon: "WEAPON_RLARPSTC.webp", rank: 13,
    desc: "Switch-converted machine pistol running 600 RPM for 280 DPS. Melts anything up close; the 50-round magazine is plenty to work with.",
    tags: ["Full auto", "High DPS", "Large magazine"],
    stats: { damage: 28, magazine: 50, fireRate: 600, dps: 280, ttk: 0.7 } },
  { id: "vs17cs", name: "Voss 17 Custom Switch", cat: "Firearms", tier: "Tier 1.5", class: "Epic",
    kind: "Pistol", icon: "WEAPON_VS17CS.webp", rank: 14,
    desc: "Switch-converted machine pistol running 600 RPM for 280 DPS. Melts anything up close; the 50-round magazine is plenty to work with.",
    tags: ["Full auto", "High DPS", "Large magazine"],
    stats: { damage: 28, magazine: 50, fireRate: 600, dps: 280, ttk: 0.7 } },
  { id: "vs17swg", name: "Voss 17 Gold Switch", cat: "Firearms", tier: "Tier 1.5", class: "Epic",
    kind: "Pistol", icon: "WEAPON_VS17SWG.webp", rank: 15,
    desc: "Switch-converted machine pistol running 600 RPM for 280 DPS. Melts anything up close; the 50-round magazine is plenty to work with.",
    tags: ["Full auto", "High DPS", "Large magazine"],
    stats: { damage: 28, magazine: 50, fireRate: 600, dps: 280, ttk: 0.7 } },
  { id: "vs20swb", name: "Voss 20 Blue Switch", cat: "Firearms", tier: "Tier 1.5", class: "Epic",
    kind: "Pistol", icon: "WEAPON_VS20SWB.webp", rank: 16,
    desc: "Switch-converted machine pistol running 600 RPM for 280 DPS. Melts anything up close; the 50-round magazine is plenty to work with.",
    tags: ["Full auto", "High DPS", "Large magazine"],
    stats: { damage: 28, magazine: 50, fireRate: 600, dps: 280, ttk: 0.7 } },
  { id: "vs20swg", name: "Voss 20 Green Switch", cat: "Firearms", tier: "Tier 1.5", class: "Epic",
    kind: "Pistol", icon: "WEAPON_VS20SWG.webp", rank: 17,
    desc: "Switch-converted machine pistol running 600 RPM for 280 DPS. Melts anything up close; the 50-round magazine is plenty to work with.",
    tags: ["Full auto", "High DPS", "Large magazine"],
    stats: { damage: 28, magazine: 50, fireRate: 600, dps: 280, ttk: 0.7 } },
  { id: "vs26swg", name: "Voss 26 Switch Green", cat: "Firearms", tier: "Tier 1.5", class: "Epic",
    kind: "Pistol", icon: "WEAPON_VS26SWG.webp", rank: 18,
    desc: "Switch-converted machine pistol running 600 RPM for 280 DPS. Melts anything up close; the 50-round magazine is plenty to work with.",
    tags: ["Full auto", "High DPS", "Large magazine"],
    stats: { damage: 28, magazine: 50, fireRate: 600, dps: 280, ttk: 0.7 } },
  { id: "vs26swp", name: "Voss 26 Switch Purple", cat: "Firearms", tier: "Tier 1.5", class: "Epic",
    kind: "Pistol", icon: "WEAPON_VS26SWP.webp", rank: 19,
    desc: "Switch-converted machine pistol running 600 RPM for 280 DPS. Melts anything up close; the 50-round magazine is plenty to work with.",
    tags: ["Full auto", "High DPS", "Large magazine"],
    stats: { damage: 28, magazine: 50, fireRate: 600, dps: 280, ttk: 0.7 } },
  { id: "vs40cs", name: "Voss 40 Custom Switch", cat: "Firearms", tier: "Tier 1.5", class: "Epic",
    kind: "Pistol", icon: "WEAPON_VS40CS.webp", rank: 20,
    desc: "Switch-converted machine pistol running 600 RPM for 280 DPS. Melts anything up close; the 50-round magazine is plenty to work with.",
    tags: ["Full auto", "High DPS", "Large magazine"],
    stats: { damage: 28, magazine: 50, fireRate: 600, dps: 280, ttk: 0.7 } },
  { id: "ih357", name: "Ironhide 357 Magnum", cat: "Firearms", tier: "Tier 1.5", class: "Rare",
    kind: "Pistol", icon: "WEAPON_IH357.webp", rank: 21,
    desc: "Break-action revolver hitting for 160 a shot \u2014 enough to drop most targets in two body hits. No damage falloff at any range, but 33 rounds per minute and a 6-round cylinder punish every miss.",
    tags: ["Semi auto", "Two-shot kill", "Low capacity", "High accuracy"],
    stats: { damage: 160, magazine: 6, fireRate: 33, dps: 87, ttk: 1.83 } },
  { id: "ih38", name: "Ironhide 38", cat: "Firearms", tier: "Tier 1.5", class: "Rare",
    kind: "Pistol", icon: "WEAPON_IH38.webp", rank: 22,
    desc: "Break-action revolver hitting for 160 a shot \u2014 enough to drop most targets in two body hits. No damage falloff at any range, but 33 rounds per minute and a 6-round cylinder punish every miss.",
    tags: ["Semi auto", "Two-shot kill", "Low capacity", "High accuracy"],
    stats: { damage: 160, magazine: 6, fireRate: 33, dps: 87, ttk: 1.83 } },
  { id: "rlcbb", name: "Ridgeline Compact Black Binary", cat: "Firearms", tier: "Tier 1.5", class: "Rare",
    kind: "Rifle", icon: "WEAPON_RLCBB.webp", rank: 23,
    desc: "Full-auto rifle putting out 190 DPS at 380 RPM. Holds damage better at distance than any pistol here and runs a 30-round magazine for extended fights.",
    tags: ["Full auto", "Wide spread", "Long range", "Penetrating"],
    stats: { damage: 30, magazine: 30, fireRate: 380, dps: 190, ttk: 0.95 } },
  { id: "rlplr16", name: "Ridgeline PLR Carbine", cat: "Firearms", tier: "Tier 1.5", class: "Rare",
    kind: "Rifle", icon: "WEAPON_RLPLR16.webp", rank: 24,
    desc: "Full-auto rifle putting out 190 DPS at 380 RPM. Holds damage better at distance than any pistol here and runs a 30-round magazine for extended fights.",
    tags: ["Full auto", "Wide spread", "Long range", "Penetrating"],
    stats: { damage: 30, magazine: 30, fireRate: 380, dps: 190, ttk: 0.95 } },
  { id: "vs22g4sb", name: "Voss 22 Gen4 Switch Blue", cat: "Firearms", tier: "Tier 1.5", class: "Rare",
    kind: "Pistol", icon: "WEAPON_VS22G4SB.webp", rank: 25,
    desc: "Switch-converted machine pistol running 600 RPM for 310 DPS. Melts anything up close; the 18-round magazine is gone in under two seconds, so trigger discipline matters.",
    tags: ["Full auto", "High DPS"],
    stats: { damage: 31, magazine: 18, fireRate: 600, dps: 310, ttk: 0.6 } },
  { id: "vs22g4sg", name: "Voss 22 Gen4 Switch Green", cat: "Firearms", tier: "Tier 1.5", class: "Rare",
    kind: "Pistol", icon: "WEAPON_VS22G4SG.webp", rank: 26,
    desc: "Switch-converted machine pistol running 600 RPM for 310 DPS. Melts anything up close; the 18-round magazine is gone in under two seconds, so trigger discipline matters.",
    tags: ["Full auto", "High DPS"],
    stats: { damage: 31, magazine: 18, fireRate: 600, dps: 310, ttk: 0.6 } },
  { id: "vs22g4sp", name: "Voss 22 Gen4 Switch Purple", cat: "Firearms", tier: "Tier 1.5", class: "Rare",
    kind: "Pistol", icon: "WEAPON_VS22G4SP.webp", rank: 27,
    desc: "Switch-converted machine pistol running 600 RPM for 310 DPS. Melts anything up close; the 18-round magazine is gone in under two seconds, so trigger discipline matters.",
    tags: ["Full auto", "High DPS"],
    stats: { damage: 31, magazine: 18, fireRate: 600, dps: 310, ttk: 0.6 } },
  { id: "vs22g4sr", name: "Voss 22 Gen4 Switch Red", cat: "Firearms", tier: "Tier 1.5", class: "Rare",
    kind: "Pistol", icon: "WEAPON_VS22G4SR.webp", rank: 28,
    desc: "Switch-converted machine pistol running 600 RPM for 310 DPS. Melts anything up close; the 18-round magazine is gone in under two seconds, so trigger discipline matters.",
    tags: ["Full auto", "High DPS"],
    stats: { damage: 31, magazine: 18, fireRate: 600, dps: 310, ttk: 0.6 } },
  { id: "vs23g5swg", name: "Voss 23 Gen5 Switch Gold", cat: "Firearms", tier: "Tier 1.5", class: "Rare",
    kind: "Pistol", icon: "WEAPON_VS23G5SWG.webp", rank: 29,
    desc: "Switch-converted machine pistol running 600 RPM for 310 DPS. Melts anything up close; the 18-round magazine is gone in under two seconds, so trigger discipline matters.",
    tags: ["Full auto", "High DPS"],
    stats: { damage: 31, magazine: 18, fireRate: 600, dps: 310, ttk: 0.6 } },
  { id: "vs24g3sws", name: "Voss 24 Gen3 Switch Street", cat: "Firearms", tier: "Tier 1.5", class: "Rare",
    kind: "Pistol", icon: "WEAPON_VS24G3SWS.webp", rank: 30,
    desc: "Switch-converted machine pistol running 600 RPM for 310 DPS. Melts anything up close; the 18-round magazine is gone in under two seconds, so trigger discipline matters.",
    tags: ["Full auto", "High DPS"],
    stats: { damage: 31, magazine: 18, fireRate: 600, dps: 310, ttk: 0.6 } },
  { id: "vs31g5gs", name: "Voss 31 Gen5 Green Switch", cat: "Firearms", tier: "Tier 1.5", class: "Rare",
    kind: "Pistol", icon: "WEAPON_VS31G5GS.webp", rank: 31,
    desc: "Switch-converted machine pistol running 600 RPM for 290 DPS. Melts anything up close; the 18-round magazine is gone in under two seconds, so trigger discipline matters.",
    tags: ["Full auto", "High DPS"],
    stats: { damage: 29, magazine: 18, fireRate: 600, dps: 290, ttk: 0.6 } },
  { id: "vs45g5rs", name: "Voss 45 Gen5 Red Switch", cat: "Firearms", tier: "Tier 1.5", class: "Rare",
    kind: "Pistol", icon: "WEAPON_VS45G5RS.webp", rank: 32,
    desc: "Switch-converted machine pistol running 600 RPM for 280 DPS. Melts anything up close; the 21-round magazine is gone in under two seconds, so trigger discipline matters.",
    tags: ["Full auto", "High DPS"],
    stats: { damage: 28, magazine: 21, fireRate: 600, dps: 280, ttk: 0.7 } },
  { id: "plp8019r", name: "Palisade P80 19 Reaper", cat: "Firearms", tier: "Tier 1", class: "Uncommon",
    kind: "Pistol", icon: "WEAPON_PLP8019R.webp", rank: 33,
    desc: "Switch-converted machine pistol running 600 RPM for 280 DPS. Melts anything up close; the 18-round magazine is gone in under two seconds, so trigger discipline matters.",
    tags: ["Full auto", "High DPS"],
    stats: { damage: 28, magazine: 18, fireRate: 600, dps: 280, ttk: 0.7 } },
  { id: "sb20frt", name: "Sable 2.0 FRT", cat: "Firearms", tier: "Tier 1", class: "Uncommon",
    kind: "Pistol", icon: "WEAPON_SB20FRT.webp", rank: 34,
    desc: "Switch-converted machine pistol running 600 RPM for 280 DPS. Melts anything up close; the 18-round magazine is gone in under two seconds, so trigger discipline matters.",
    tags: ["Full auto", "High DPS"],
    stats: { damage: 28, magazine: 18, fireRate: 600, dps: 280, ttk: 0.7 } },
  { id: "vs19g5msw", name: "Voss 19 Gen5 MOS Switch", cat: "Firearms", tier: "Tier 1", class: "Uncommon",
    kind: "Pistol", icon: "WEAPON_VS19G5MSW.webp", rank: 35,
    desc: "Switch-converted machine pistol running 600 RPM for 280 DPS. Melts anything up close; the 18-round magazine is gone in under two seconds, so trigger discipline matters.",
    tags: ["Full auto", "High DPS"],
    stats: { damage: 28, magazine: 18, fireRate: 600, dps: 280, ttk: 0.7 } },
  { id: "vs19g5rs", name: "Voss 19 Gen5 Red Switch", cat: "Firearms", tier: "Tier 1", class: "Uncommon",
    kind: "Pistol", icon: "WEAPON_VS19G5RS.webp", rank: 36,
    desc: "Switch-converted machine pistol running 600 RPM for 280 DPS. Melts anything up close; the 18-round magazine is gone in under two seconds, so trigger discipline matters.",
    tags: ["Full auto", "High DPS"],
    stats: { damage: 28, magazine: 18, fireRate: 600, dps: 280, ttk: 0.7 } },
  { id: "vs45sws", name: "Voss 45 Switch Silver", cat: "Firearms", tier: "Tier 1", class: "Uncommon",
    kind: "Pistol", icon: "WEAPON_VS45SWS.webp", rank: 37,
    desc: "Switch-converted machine pistol running 600 RPM for 280 DPS. Melts anything up close; the 18-round magazine is gone in under two seconds, so trigger discipline matters.",
    tags: ["Full auto", "High DPS"],
    stats: { damage: 28, magazine: 18, fireRate: 600, dps: 280, ttk: 0.7 } },
  { id: "rldefc", name: "Ridgeline Defender C", cat: "Firearms", tier: "Tier 1", class: "Uncommon",
    kind: "SMG", icon: "WEAPON_RLDEFC.webp", rank: 38,
    desc: "Compact automatic at 600 RPM, but only 21 damage a round \u2014 10 body shots to put someone down. Volume of fire over stopping power.",
    tags: ["Full auto", "Wide spread"],
    stats: { damage: 21, magazine: 30, fireRate: 600, dps: 210, ttk: 0.9 } },
  { id: "rldef", name: "Ridgeline Defender SMG", cat: "Firearms", tier: "Tier 1", class: "Uncommon",
    kind: "SMG", icon: "WEAPON_RLDEF.webp", rank: 39,
    desc: "Compact automatic at 600 RPM, but only 21 damage a round \u2014 10 body shots to put someone down. Volume of fire over stopping power.",
    tags: ["Full auto", "Wide spread"],
    stats: { damage: 21, magazine: 30, fireRate: 600, dps: 210, ttk: 0.9 } },
  { id: "vs40mos", name: "Voss 40 MOS", cat: "Firearms", tier: "Tier 1", class: "Uncommon",
    kind: "Pistol", icon: "WEAPON_VS40MOS.webp", rank: 40,
    desc: "Heavy semi-auto sidearm hitting for 40 a shot, 5 rounds to a kill. Tight 1.4 spread rewards aim over spray, with a 50-round magazine.",
    tags: ["Semi auto", "Stopping power", "Large magazine", "High accuracy"],
    stats: { damage: 40, magazine: 50, fireRate: 143, dps: 95, ttk: 1.68 } },
  { id: "vs21cfx", name: "Voss 21C Flex Custom", cat: "Firearms", tier: "Tier 1", class: "Uncommon",
    kind: "Pistol", icon: "WEAPON_VS21CFX.webp", rank: 41,
    desc: "Heavy semi-auto sidearm hitting for 44 a shot, 5 rounds to a kill. Tight 1.4 spread rewards aim over spray, with a 21-round magazine.",
    tags: ["Semi auto", "Stopping power", "High accuracy"],
    stats: { damage: 44, magazine: 21, fireRate: 143, dps: 105, ttk: 1.68 } },
  { id: "tl57mos", name: "Talon 57 MOS", cat: "Firearms", tier: "Tier 1", class: "Uncommon",
    kind: "Pistol", icon: "WEAPON_TL57MOS.webp", rank: 42,
    desc: "Heavy semi-auto sidearm hitting for 40 a shot, 5 rounds to a kill. Tight 1.4 spread rewards aim over spray, with a 20-round magazine.",
    tags: ["Semi auto", "Stopping power", "High accuracy"],
    stats: { damage: 40, magazine: 20, fireRate: 143, dps: 95, ttk: 1.68 } },
  { id: "pl57", name: "Palisade 57", cat: "Firearms", tier: "Tier 1", class: "Uncommon",
    kind: "Pistol", icon: "WEAPON_PL57.webp", rank: 43,
    desc: "Heavy semi-auto sidearm hitting for 37 a shot, 6 rounds to a kill. Tight 1.5 spread rewards aim over spray, with a 24-round magazine.",
    tags: ["Semi auto", "Stopping power", "High accuracy"],
    stats: { damage: 37, magazine: 24, fireRate: 162, dps: 100, ttk: 1.85 } },
  { id: "vs20cfx", name: "Voss 20C Flex Custom", cat: "Firearms", tier: "Tier 1", class: "Uncommon",
    kind: "Pistol", icon: "WEAPON_VS20CFX.webp", rank: 44,
    desc: "Heavy semi-auto sidearm hitting for 40 a shot, 5 rounds to a kill. Tight 1.4 spread rewards aim over spray, with a 18-round magazine.",
    tags: ["Semi auto", "Stopping power", "High accuracy"],
    stats: { damage: 40, magazine: 18, fireRate: 143, dps: 95, ttk: 1.68 } },
  { id: "ry57b", name: "Ryker 57 Binary", cat: "Firearms", tier: "Tier 1", class: "Uncommon",
    kind: "Pistol", icon: "WEAPON_RY57B.webp", rank: 45,
    desc: "Heavy semi-auto sidearm hitting for 35 a shot, 6 rounds to a kill. Tight 1.5 spread rewards aim over spray, with a 20-round magazine.",
    tags: ["Semi auto", "Stopping power", "High accuracy"],
    stats: { damage: 35, magazine: 20, fireRate: 162, dps: 95, ttk: 1.85 } },
  { id: "vs23b", name: "Voss 23 Beam", cat: "Firearms", tier: "Tier 1", class: "Uncommon",
    kind: "Pistol", icon: "WEAPON_VS23B.webp", rank: 46,
    desc: "Standard semi-auto sidearm \u2014 28 damage, 50-round magazine and a tight 1.75 spread. Dependable sidearm, outgunned by anything automatic up close.",
    tags: ["Semi auto", "Large magazine"],
    stats: { damage: 28, magazine: 50, fireRate: 162, dps: 76, ttk: 2.59 } },
  { id: "vs45camo", name: "Voss 45 Camo", cat: "Firearms", tier: "Tier 1", class: "Uncommon",
    kind: "Pistol", icon: "WEAPON_VS45CAMO.webp", rank: 47,
    desc: "Standard semi-auto sidearm \u2014 28 damage, 50-round magazine and a tight 1.75 spread. Dependable sidearm, outgunned by anything automatic up close.",
    tags: ["Semi auto", "Large magazine"],
    stats: { damage: 28, magazine: 50, fireRate: 162, dps: 76, ttk: 2.59 } },
  { id: "vs17g5", name: "Voss 17 Gen5 MOS", cat: "Firearms", tier: "Tier 1", class: "Uncommon",
    kind: "Pistol", icon: "WEAPON_VS17G5.webp", rank: 48,
    desc: "Standard semi-auto sidearm \u2014 27 damage, 50-round magazine and a tight 1.5 spread. Dependable sidearm, outgunned by anything automatic up close.",
    tags: ["Semi auto", "Large magazine", "High accuracy"],
    stats: { damage: 27, magazine: 50, fireRate: 162, dps: 73, ttk: 2.59 } },
  { id: "vs19xblk", name: "Voss 19X Black", cat: "Firearms", tier: "Tier 1", class: "Uncommon",
    kind: "Pistol", icon: "WEAPON_VS19XBLK.webp", rank: 49,
    desc: "Standard semi-auto sidearm \u2014 27 damage, 50-round magazine and a tight 1.5 spread. Dependable sidearm, outgunned by anything automatic up close.",
    tags: ["Semi auto", "Large magazine", "High accuracy"],
    stats: { damage: 27, magazine: 50, fireRate: 162, dps: 73, ttk: 2.59 } },
  { id: "vs19xc", name: "Voss 19X Custom", cat: "Firearms", tier: "Tier 1", class: "Uncommon",
    kind: "Pistol", icon: "WEAPON_VS19XC.webp", rank: 50,
    desc: "Standard semi-auto sidearm \u2014 27 damage, 50-round magazine and a tight 1.5 spread. Dependable sidearm, outgunned by anything automatic up close.",
    tags: ["Semi auto", "Large magazine", "High accuracy"],
    stats: { damage: 27, magazine: 50, fireRate: 162, dps: 73, ttk: 2.59 } },
  { id: "vs22", name: "Voss 22", cat: "Firearms", tier: "Tier 1", class: "Uncommon",
    kind: "Pistol", icon: "WEAPON_VS22.webp", rank: 51,
    desc: "Standard semi-auto sidearm \u2014 27 damage, 50-round magazine and a tight 1.5 spread. Dependable sidearm, outgunned by anything automatic up close.",
    tags: ["Semi auto", "Large magazine", "High accuracy"],
    stats: { damage: 27, magazine: 50, fireRate: 162, dps: 73, ttk: 2.59 } },
  { id: "sb40t", name: "Sable 40 Tan", cat: "Firearms", tier: "Tier 1", class: "Common",
    kind: "Pistol", icon: "WEAPON_SB40T.webp", rank: 52,
    desc: "Heavy semi-auto sidearm hitting for 34 a shot, 6 rounds to a kill. Tight 1.5 spread rewards aim over spray, with a 14-round magazine.",
    tags: ["Semi auto", "Stopping power", "High accuracy"],
    stats: { damage: 34, magazine: 14, fireRate: 162, dps: 92, ttk: 1.85 } },
  { id: "vs41", name: "Voss 41", cat: "Firearms", tier: "Tier 1", class: "Common",
    kind: "Pistol", icon: "WEAPON_VS41.webp", rank: 53,
    desc: "Standard semi-auto sidearm \u2014 26 damage, 50-round magazine and a tight 1.5 spread. Dependable sidearm, outgunned by anything automatic up close.",
    tags: ["Semi auto", "Large magazine", "High accuracy"],
    stats: { damage: 26, magazine: 50, fireRate: 162, dps: 70, ttk: 2.59 } },
  { id: "vsp80c", name: "Voss Custom P80", cat: "Firearms", tier: "Tier 1", class: "Common",
    kind: "Pistol", icon: "WEAPON_VSP80C.webp", rank: 54,
    desc: "Standard semi-auto sidearm \u2014 26 damage, 50-round magazine and a tight 1.5 spread. Dependable sidearm, outgunned by anything automatic up close.",
    tags: ["Semi auto", "Large magazine", "High accuracy"],
    stats: { damage: 26, magazine: 50, fireRate: 162, dps: 70, ttk: 2.59 } },
  { id: "pl20t", name: "Palisade 20 Tactical", cat: "Firearms", tier: "Tier 1", class: "Common",
    kind: "Pistol", icon: "WEAPON_PL20T.webp", rank: 55,
    desc: "Standard semi-auto sidearm \u2014 32 damage, 15-round magazine and a tight 1.5 spread. Dependable sidearm, outgunned by anything automatic up close.",
    tags: ["Semi auto", "High accuracy"],
    stats: { damage: 32, magazine: 15, fireRate: 162, dps: 86, ttk: 2.22 } },
  { id: "vs19xcoy", name: "Voss 19X Coyote", cat: "Firearms", tier: "Tier 1", class: "Common",
    kind: "Pistol", icon: "WEAPON_VS19XCOY.webp", rank: 56,
    desc: "Standard semi-auto sidearm \u2014 27 damage, 19-round magazine and a tight 1.5 spread. Dependable sidearm, outgunned by anything automatic up close.",
    tags: ["Semi auto", "High accuracy"],
    stats: { damage: 27, magazine: 19, fireRate: 162, dps: 73, ttk: 2.59 } },
  { id: "vs43xc", name: "Voss 43X Custom", cat: "Firearms", tier: "Tier 1", class: "Common",
    kind: "Pistol", icon: "WEAPON_VS43XC.webp", rank: 57,
    desc: "Standard semi-auto sidearm \u2014 29 damage, 10-round magazine and a tight 1.75 spread. Dependable sidearm, outgunned by anything automatic up close.",
    tags: ["Semi auto"],
    stats: { damage: 29, magazine: 10, fireRate: 162, dps: 78, ttk: 2.22 } },
  { id: "pl1926hh", name: "Palisade 1926 Half N Half", cat: "Firearms", tier: "Tier 1", class: "Common",
    kind: "Pistol", icon: "WEAPON_PL1926HH.webp", rank: 58,
    desc: "Standard semi-auto sidearm \u2014 28 damage, 15-round magazine and a tight 1.5 spread. Dependable sidearm, outgunned by anything automatic up close.",
    tags: ["Semi auto", "High accuracy"],
    stats: { damage: 28, magazine: 15, fireRate: 162, dps: 76, ttk: 2.59 } },
  { id: "vs17g3p80", name: "Voss 17 Gen3 P80", cat: "Firearms", tier: "Tier 1", class: "Common",
    kind: "Pistol", icon: "WEAPON_VS17G3P80.webp", rank: 59,
    desc: "Standard semi-auto sidearm \u2014 27 damage, 17-round magazine and a tight 1.5 spread. Dependable sidearm, outgunned by anything automatic up close.",
    tags: ["Semi auto", "High accuracy"],
    stats: { damage: 27, magazine: 17, fireRate: 162, dps: 73, ttk: 2.59 } },
  { id: "vs17g4c", name: "Voss 17 Gen4 Custom", cat: "Firearms", tier: "Tier 1", class: "Common",
    kind: "Pistol", icon: "WEAPON_VS17G4C.webp", rank: 60,
    desc: "Standard semi-auto sidearm \u2014 27 damage, 17-round magazine and a tight 1.5 spread. Dependable sidearm, outgunned by anything automatic up close.",
    tags: ["Semi auto", "High accuracy"],
    stats: { damage: 27, magazine: 17, fireRate: 162, dps: 73, ttk: 2.59 } },
  { id: "vs45am", name: "Voss 45 American", cat: "Firearms", tier: "Tier 1", class: "Common",
    kind: "Pistol", icon: "WEAPON_VS45AM.webp", rank: 61,
    desc: "Standard semi-auto sidearm \u2014 27 damage, 17-round magazine and a tight 1.5 spread. Dependable sidearm, outgunned by anything automatic up close.",
    tags: ["Semi auto", "High accuracy"],
    stats: { damage: 27, magazine: 17, fireRate: 162, dps: 73, ttk: 2.59 } },
  { id: "tl509c", name: "Talon 509 Custom", cat: "Firearms", tier: "Tier 1", class: "Common",
    kind: "Pistol", icon: "WEAPON_TL509C.webp", rank: 62,
    desc: "Standard semi-auto sidearm \u2014 27 damage, 15-round magazine and a tight 1.5 spread. Dependable sidearm, outgunned by anything automatic up close.",
    tags: ["Semi auto", "High accuracy"],
    stats: { damage: 27, magazine: 15, fireRate: 162, dps: 73, ttk: 2.59 } },
  { id: "ks320c", name: "Kestrel 320 Custom", cat: "Firearms", tier: "Tier 1", class: "Common",
    kind: "Pistol", icon: "WEAPON_KS320C.webp", rank: 63,
    desc: "Standard semi-auto sidearm \u2014 26 damage, 17-round magazine and a tight 1.5 spread. Dependable sidearm, outgunned by anything automatic up close.",
    tags: ["Semi auto", "High accuracy"],
    stats: { damage: 26, magazine: 17, fireRate: 162, dps: 70, ttk: 2.59 } },
  { id: "plp8019", name: "Palisade P80 19", cat: "Firearms", tier: "Tier 1", class: "Common",
    kind: "Pistol", icon: "WEAPON_PLP8019.webp", rank: 64,
    desc: "Standard semi-auto sidearm \u2014 26 damage, 15-round magazine and a tight 1.5 spread. Dependable sidearm, outgunned by anything automatic up close.",
    tags: ["Semi auto", "High accuracy"],
    stats: { damage: 26, magazine: 15, fireRate: 162, dps: 70, ttk: 2.59 } },
  { id: "sb92c", name: "Sable 9 2.0 Custom", cat: "Firearms", tier: "Tier 1", class: "Common",
    kind: "Pistol", icon: "WEAPON_SB92C.webp", rank: 65,
    desc: "Standard semi-auto sidearm \u2014 26 damage, 15-round magazine and a tight 1.5 spread. Dependable sidearm, outgunned by anything automatic up close.",
    tags: ["Semi auto", "High accuracy"],
    stats: { damage: 26, magazine: 15, fireRate: 162, dps: 70, ttk: 2.59 } },
  { id: "tl502t", name: "Talon 502 Tactical", cat: "Firearms", tier: "Tier 1", class: "Common",
    kind: "Pistol", icon: "WEAPON_TL502T.webp", rank: 66,
    desc: "Standard semi-auto sidearm \u2014 26 damage, 12-round magazine and a tight 1.5 spread. Dependable sidearm, outgunned by anything automatic up close.",
    tags: ["Semi auto", "High accuracy"],
    stats: { damage: 26, magazine: 12, fireRate: 162, dps: 70, ttk: 2.59 } },
  { id: "grnl", name: "Green Leaf", cat: "Drugs", tier: "Tier 1", class: "Common",
    desc: "Entry-level product. Cheap to move, low heat, steady baseline income for a new operation.",
    tags: ["Low heat", "Starter"],
    stats: { duration: "300s", effect: "Mild speed boost, reduced stamina drain", weight: "0.08 kg" } },
  { id: "pwdr", name: "Cut Powder", cat: "Drugs", tier: "Tier 1.5", class: "Uncommon",
    desc: "Mid-grade product with better margins. Draws more attention once volume picks up.",
    tags: ["Better margin", "Moderate heat"],
    stats: { duration: "450s", effect: "Increased stamina regen", weight: "0.05 kg" } },
  { id: "crys", name: "Crystal Batch", cat: "Drugs", tier: "Tier 2", class: "Rare",
    desc: "High-value product for established operations. Big payout, big risk if a run gets made.",
    tags: ["High value", "High heat"],
    stats: { duration: "600s", effect: "Reduced aim sway, faster reload", weight: "0.03 kg" } },
  { id: "pill", name: "Pressed Pills", cat: "Drugs", tier: "Tier 2", class: "Epic",
    desc: "Top-tier product reserved for trusted crew. Rare drop, rarely sits in stock long.",
    tags: ["Rare drop", "Trusted crew"],
    stats: { duration: "900s", effect: "Full health regen, stamina boost", weight: "0.02 kg" } },
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
  Common: "text-slate-300 border-slate-500/60",
  Uncommon: "text-emerald-300 border-emerald-500/50",
  Rare: "text-sky-300 border-sky-500/50",
  Epic: "text-fuchsia-300 border-fuchsia-500/50",
  Legendary: "text-orange-300 border-orange-500/50",
  Mythic: "text-yellow-200 border-yellow-400/60",
};

// rarity order, best first — drives sorting and the legend
const CLASS_ORDER = ["Mythic", "Legendary", "Epic", "Rare", "Uncommon", "Common"];

// Vite injects the real base path (e.g. "/the-312-rp-wiki/") here at build time,
// so asset URLs work whether the site is hosted at a domain root or a subfolder.
const ASSET_BASE = import.meta.env.BASE_URL;

const STAT_LABELS = {
  damage: "Damage", magazine: "Magazine", fireRate: "Fire Rate", dps: "DPS", ttk: "Time to Kill",
  duration: "Duration", effect: "Effect", weight: "Weight",
};

// real-world maximums across the pack, so each bar is scaled against the best weapon
// rather than a made-up 0-100 scale. `invert` = lower is better.
const STAT_SCALE = {
  damage:   { max: 160, unit: "" },
  magazine: { max: 50,  unit: " rds" },
  fireRate: { max: 600, unit: " rpm" },
  dps:      { max: 360, unit: "" },
  ttk:      { max: 2.6, unit: "s", invert: true },
};

/* ------------------------------------------------------------------ */
/*  SMALL PIECES                                                       */
/* ------------------------------------------------------------------ */

function EvidenceTag({ item, spinning, onClick, large }) {
  return (
    <button
      onClick={() => onClick(item)}
      className={`relative w-full rounded-md border border-[#2A2F37] bg-[#14171C] overflow-hidden transition-transform duration-150 text-left ${spinning ? "scale-[0.97]" : "hover:border-[#454b55]"}`}
    >
      {item.cat === "Firearms" && (
        <div className={`absolute z-10 font-mono tracking-wider rounded-sm bg-black/60 border border-[#3a3f47] text-[#5B8FC7] rotate-3 ${large ? "top-2.5 right-2.5 text-[11px] px-2 py-1" : "top-1.5 right-1.5 text-[9px] px-1.5 py-0.5"}`}>
          {item.tier.replace("Tier ", "T")}
        </div>
      )}
      <div className={`flex items-center justify-center bg-[#0E1013] border-b border-[#2A2F37] overflow-hidden ${large ? "h-36" : "h-20"}`}>
        {item.cat === "Firearms"
          ? <WeaponArt item={item} className={`${large ? "w-32 h-32" : "w-[72px] h-[72px]"} ${spinning ? "opacity-70" : ""}`} />
          : <FlaskConical size={large ? 44 : 26} className={`text-[#5b6472] ${spinning ? "animate-pulse" : ""}`} />}
      </div>
      <div className={large ? "p-3.5" : "p-2"}>
        <div className={`font-semibold text-[#EDEEF0] leading-tight truncate ${large ? "text-[16px]" : "text-[12px]"}`}>{item.name}</div>
        <div className={`font-mono mt-0.5 ${large ? "text-[12px]" : "text-[10px]"} ${CLASS_COLOR[item.class].split(" ")[0]}`}>{item.class}</div>
      </div>
    </button>
  );
}

function WinModal({ item, onClose }) {
  if (!item) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-lg border border-[#5B8FC7]/50 bg-[#0E1013] overflow-hidden shadow-[0_0_40px_-8px_rgba(91,143,199,0.5)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-40 flex items-center justify-center bg-[#14171C] border-b border-[#5B8FC7]/30">
          <button onClick={onClose} className="absolute top-3 right-3 w-7 h-7 rounded-md border border-[#2A2F37] bg-[#0B0D10]/70 flex items-center justify-center text-[#8B92A0] hover:text-[#EDEEF0] transition-colors">
            <X size={14} />
          </button>
          <div className="absolute top-3 left-3 text-[10px] font-mono tracking-[0.15em] uppercase px-1.5 py-0.5 rounded bg-black/60 border border-[#5B8FC7]/40 text-[#5B8FC7]">
            Drop Result
          </div>
          {item.cat === "Firearms"
            ? <WeaponArt item={item} className="w-28 h-28 rounded-lg" />
            : <FlaskConical size={44} className="text-[#5B8FC7]" />}
        </div>
        <div className="p-5 text-center">
          <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#5B8FC7] mb-1.5">You won</div>
          <h3 className="text-[22px] font-bold text-[#EDEEF0] mb-1" style={{ fontFamily: "'Oswald', sans-serif" }}>{item.name}</h3>
          <span className={`inline-block text-[11px] font-mono px-2 py-0.5 rounded border ${CLASS_COLOR[item.class]} mb-4`}>{item.class}</span>
          <p className="text-[13px] text-[#8B92A0] leading-relaxed mb-5">{item.desc}</p>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-md bg-[#5B8FC7] text-[#0B0D10] font-semibold text-[13px] hover:bg-[#78A5D6] transition-colors"
          >
            Nice
          </button>
        </div>
      </div>
    </div>
  );
}


function SectionLabel({ eyebrow, title, desc, right }) {
  return (
    <div className="flex items-start justify-between gap-6 flex-wrap mb-6">
      <div>
        <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#5B8FC7] mb-2">{eyebrow}</div>
        <h2 className="text-3xl md:text-4xl font-bold text-[#EDEEF0] tracking-tight" style={{ fontFamily: "'Oswald', sans-serif" }}>{title}</h2>
        {desc && <p className="text-[#8B92A0] mt-2 max-w-xl text-[14px] leading-relaxed">{desc}</p>}
      </div>
      {right}
    </div>
  );
}

function StatBar({ statKey, label, value }) {
  const sc = STAT_SCALE[statKey] ?? { max: 100, unit: "" };
  const raw = Math.max(0, Math.min(1, value / sc.max));
  const pct = Math.round((sc.invert ? 1 - raw : raw) * 100);
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] font-mono uppercase tracking-wide text-[#8B92A0]">{label}</span>
        <span className="text-[11px] font-mono text-[#EDEEF0]">{value}{sc.unit}</span>
      </div>
      <div className="h-1.5 rounded-full bg-[#1E2126] overflow-hidden">
        <div className="h-full rounded-full bg-[#5B8FC7]" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// weapon art lives in public/assets and is already tinted by rarity
function WeaponArt({ item, className = "", imgClass = "" }) {
  if (item.cat !== "Firearms" || !item.icon) {
    return <FlaskConical size={28} className={`text-[#454b55] ${imgClass}`} />;
  }
  return (
    <img
      src={`${ASSET_BASE}assets/${item.icon}`}
      alt={item.name}
      loading="lazy"
      className={`object-contain ${className}`}
    />
  );
}

function DetailModal({ item, onClose }) {
  if (!item) return null;
  const pillBase = "text-[11px] font-mono px-2.5 py-1 rounded-md border";
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-lg border border-[#2A2F37] bg-[#0E1013] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex gap-1.5 flex-wrap">
              <span className={`${pillBase} ${CLASS_COLOR[item.class]}`}>{item.class}</span>
              <span className={`${pillBase} text-[#8B92A0] border-[#2A2F37] bg-[#14171C]`}>
                {item.cat === "Firearms" ? "Weapon" : "Drug"}
              </span>
              {item.cat === "Firearms" && (
                <>
                  <span className={`${pillBase} text-[#8B92A0] border-[#2A2F37] bg-[#14171C]`}>{item.tier}</span>
                  <span className={`${pillBase} text-[#8B92A0] border-[#2A2F37] bg-[#14171C]`}>#{item.rank} of 66</span>
                </>
              )}
            </div>
            <button onClick={onClose} className="w-7 h-7 shrink-0 rounded-md border border-[#2A2F37] bg-[#14171C] flex items-center justify-center text-[#8B92A0] hover:text-[#EDEEF0] transition-colors">
              <X size={14} />
            </button>
          </div>

          {item.cat === "Firearms" && (
            <div className="flex justify-center mb-4">
              <WeaponArt item={item} className="w-32 h-32 rounded-lg" />
            </div>
          )}
          <h3 className="text-[22px] font-bold text-[#EDEEF0] mb-1" style={{ fontFamily: "'Oswald', sans-serif" }}>{item.name}</h3>
          {item.kind && <div className="text-[12px] font-mono text-[#5B8FC7] mb-3">{item.kind}</div>}
          <p className="text-[13px] text-[#8B92A0] leading-relaxed mb-5">{item.desc}</p>

          {item.stats && (
            <>
              <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#5B8FC7] mb-3">
                {item.cat === "Firearms" ? "Combat Stats" : "Item Stats"}
              </div>
              {item.cat === "Firearms" ? (
                <div className="flex flex-col gap-3 mb-5">
                  {Object.entries(item.stats).map(([key, value]) => (
                    <StatBar key={key} statKey={key} label={STAT_LABELS[key] ?? key} value={value} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-2.5 mb-5">
                  {Object.entries(item.stats).map(([key, value]) => (
                    <div key={key} className="rounded-md border border-[#2A2F37] bg-[#14171C] px-3.5 py-2.5">
                      <div className="text-[10px] font-mono tracking-[0.15em] uppercase text-[#8B92A0] mb-1">
                        {STAT_LABELS[key] ?? key}
                      </div>
                      <div className="text-[15px] font-semibold text-[#EDEEF0]">{value}</div>
                    </div>
                  ))}
                </div>
              )}
            </>
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
  const [wonItem, setWonItem] = useState(null);
  const spinTimer = useRef(null);

  const [skillTab, setSkillTab] = useState("Faction");

  const [catFilter, setCatFilter] = useState("All");
  const [classFilter, setClassFilter] = useState("All");
  const [kindFilter, setKindFilter] = useState("All");
  const [query, setQuery] = useState("");

  const [activeItem, setActiveItem] = useState(null);

  const rollPool = useMemo(
    () => CATALOG.filter((i) => i.cat === rollCat && (rollCat !== "Firearms" || i.tier === rollTier)),
    [rollCat, rollTier]
  );

  useEffect(() => {
    if (spinning) return;
    setWonItem(null);
    if (rollPool.length === 0) {
      setRollSlots(Array(8).fill(null));
      return;
    }
    setRollSlots(
      Array.from({ length: 8 }, () => rollPool[Math.floor(Math.random() * rollPool.length)])
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rollCat, rollTier]);

  const filteredCatalog = useMemo(() => {
    return CATALOG.filter((i) => {
      const catOk = catFilter === "All" || i.cat === catFilter;
      const clsOk = classFilter === "All" || i.class === classFilter;
      const kindOk = kindFilter === "All" || i.kind === kindFilter;
      const qOk = i.name.toLowerCase().includes(query.toLowerCase());
      return catOk && clsOk && kindOk && qOk;
    }).sort((a, b) => (a.rank ?? 999) - (b.rank ?? 999));
  }, [catFilter, classFilter, kindFilter, query]);

  function rollRandom() {
    if (rollPool.length === 0 || spinning) return;
    setSpinning(true);
    setWonItem(null);
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
        setRollSlots((prev) => {
          const finalPrize = prev[Math.floor(Math.random() * prev.length)];
          setWonItem(finalPrize);
          return prev;
        });
      }
    }, 70);
  }

  return (
    <div className="min-h-screen bg-[#0B0D10] text-[#EDEEF0]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
      `}</style>

      <DetailModal item={activeItem} onClose={() => setActiveItem(null)} />
      <WinModal item={wonItem} onClose={() => setWonItem(null)} />

      {/* NAV */}
      <div className="sticky top-0 z-30 backdrop-blur bg-[#0B0D10]/85 border-b border-[#1E2126]">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src={`${ASSET_BASE}assets/watermark.png`} alt="The 312 RP" className="w-7 h-7 rounded object-cover" />
            <span className="font-semibold tracking-tight text-[14px]" style={{ fontFamily: "'Oswald', sans-serif" }}>
              THE&nbsp;312&nbsp;<span className="text-[#5B8FC7]">RP</span>
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
          <h1 className="text-5xl md:text-6xl font-bold leading-[1.05] tracking-tight max-w-2xl" style={{ fontFamily: "'Oswald', sans-serif" }}>
            The 312 Illegal Wiki
          </h1>
          <p className="text-[#8B92A0] mt-5 max-w-lg text-[15px] leading-relaxed">
            Browse the supply drop, check what each skill route unlocks, and look up
            all 66 weapons and every product the streets have to offer — before you commit to a run.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <a href="#drop" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-[#5B8FC7] text-[#0B0D10] text-[13px] font-semibold hover:bg-[#78A5D6] transition-colors">
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
            desc="Roll against the current tier's pool. Odds are shown by classification — Common through Mythic. Tap any tag for full stats."
            right={
              <div className="flex flex-col items-end gap-2">
                <div className="flex gap-1 bg-[#14171C] border border-[#2A2F37] rounded-md p-1">
                  {["Firearms", "Drugs"].map((c) => (
                    <button key={c} onClick={() => setRollCat(c)}
                      className={`px-3 py-1.5 rounded text-[12px] font-medium transition-colors ${rollCat === c ? "bg-[#5B8FC7] text-[#0B0D10]" : "text-[#8B92A0] hover:text-[#EDEEF0]"}`}>
                      {c}
                    </button>
                  ))}
                </div>
                {rollCat === "Firearms" && (
                  <div className="flex gap-1 bg-[#14171C] border border-[#2A2F37] rounded-md p-1">
                    {TIERS.map((t) => (
                      <button key={t} onClick={() => setRollTier(t)}
                        className={`px-3 py-1.5 rounded text-[12px] font-medium transition-colors ${rollTier === t ? "bg-[#2A2F37] text-[#EDEEF0]" : "text-[#8B92A0] hover:text-[#EDEEF0]"}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            }
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-4">
            {rollSlots.map((item, idx) =>
              item ? (
                <EvidenceTag key={idx} item={item} spinning={spinning} onClick={setActiveItem} />
              ) : (
                <div key={idx} className="rounded-md border border-dashed border-[#2A2F37] h-[152px]" />
              )
            )}
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
                className={`px-3.5 py-1.5 rounded text-[12.5px] font-medium transition-colors ${skillTab === tab ? "bg-[#5B8FC7] text-[#0B0D10]" : "text-[#8B92A0] hover:text-[#EDEEF0]"}`}>
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
                      <div className="text-2xl font-bold text-[#5B8FC7]" style={{ fontFamily: "'Oswald', sans-serif" }}>{s.unlock}</div>
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
              <div className="rounded border border-[#5B8FC7]/30 bg-[#5B8FC7]/[0.06] p-3">
                <div className="text-[11px] font-mono uppercase tracking-wider text-[#5B8FC7] mb-1">Guide note</div>
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
            desc="Every weapon in the pack, ranked and graded on its real in-game stats — damage, magazine, fire rate, DPS and time-to-kill pulled straight from the server files. Click a card for the full breakdown."
          />

          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex flex-wrap gap-2">
              <div className="flex gap-1 bg-[#14171C] border border-[#2A2F37] rounded-md p-1">
                {["All", "Firearms", "Drugs"].map((c) => (
                  <button key={c} onClick={() => setCatFilter(c)}
                    className={`px-3.5 py-1.5 rounded text-[12.5px] font-medium transition-colors ${catFilter === c ? "bg-[#5B8FC7] text-[#0B0D10]" : "text-[#8B92A0] hover:text-[#EDEEF0]"}`}>
                    {c}
                  </button>
                ))}
              </div>
              <div className="flex gap-1 bg-[#14171C] border border-[#2A2F37] rounded-md p-1">
                {["All", ...KINDS].map((k) => (
                  <button key={k} onClick={() => setKindFilter(k)}
                    className={`px-3 py-1.5 rounded text-[12.5px] font-medium transition-colors ${kindFilter === k ? "bg-[#2A2F37] text-[#EDEEF0]" : "text-[#8B92A0] hover:text-[#EDEEF0]"}`}>
                    {k === "All" ? "Any type" : k}
                  </button>
                ))}
              </div>
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

          <div className="flex flex-wrap gap-1.5 mb-6">
            {["All", ...CLASS_ORDER].map((c) => (
              <button key={c} onClick={() => setClassFilter(c)}
                className={`text-[11px] font-mono px-2.5 py-1 rounded border transition-colors ${
                  classFilter === c
                    ? (c === "All" ? "border-[#5B8FC7] text-[#5B8FC7] bg-[#5B8FC7]/10" : `${CLASS_COLOR[c]} bg-white/[0.06]`)
                    : "border-[#2A2F37] text-[#5b6472] hover:text-[#8B92A0]"
                }`}>
                {c === "All" ? "All rarities" : c}
                {c !== "All" && (
                  <span className="ml-1.5 opacity-60">{CATALOG.filter((i) => i.class === c).length}</span>
                )}
              </button>
            ))}
          </div>

          <div className="text-[12px] font-mono text-[#5b6472] mb-4">
            {filteredCatalog.length} {filteredCatalog.length === 1 ? "item" : "items"}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCatalog.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveItem(item)}
                className="text-left rounded-md border border-[#2A2F37] bg-[#0E1013] overflow-hidden hover:border-[#454b55] transition-colors"
              >
                <div className="h-28 flex items-center justify-center bg-[#14171C] border-b border-[#2A2F37] overflow-hidden">
                  {item.cat === "Firearms"
                    ? <WeaponArt item={item} className="w-24 h-24" />
                    : <FlaskConical size={28} className="text-[#454b55]" />}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="text-[14px] font-semibold text-[#EDEEF0] leading-tight">{item.name}</span>
                    <span className={`shrink-0 text-[10px] font-mono px-1.5 py-0.5 rounded border ${CLASS_COLOR[item.class]}`}>{item.class}</span>
                  </div>
                  {item.kind && (
                    <div className="text-[11px] font-mono text-[#5b6472] mb-2">
                      {item.kind} · #{item.rank} overall
                    </div>
                  )}
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
