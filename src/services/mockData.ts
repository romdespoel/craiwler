import type {
  OpeningScenarioResponse,
  SubOptionResponse,
  ActionResolutionResponse,
  CustomInputValidation,
  HighLevelOption,
} from "../types/game";

// ─── Turn 1: Opening ─────────────────────────────────────────

export const MOCK_OPENING: OpeningScenarioResponse = {
  narration:
    "The stairway crumbles behind you as you descend into the Crumbling Halls. Torchlight flickers across ancient stone — ahead, a corridor splits in two. To the left, the scraping of claws against rock. To the right, a faint golden glow and the smell of old incense.",
  location: "Entrance Hall — The Fork",
  biome: "Crumbling Halls",
  entities: [
    {
      name: "Tunnel Rats",
      type: "hostile",
      description: "A swarm of oversized rats with yellowed fangs, nesting in the left passage.",
    },
    {
      name: "Hooded Pilgrim",
      type: "neutral",
      description: "A cloaked figure kneeling before a cracked shrine in the right passage.",
    },
  ],
  objects: ["Cracked Shrine", "Collapsed Rubble", "Rusted Iron Gate"],
  environment_tags: ["dim lighting", "echoing stone", "damp air", "unstable ceiling"],
  options: [
    {
      id: 1,
      label: "Investigate Left Passage",
      emoji: "🐀",
      hint: "The scraping sounds grow louder — something territorial lurks in the dark.",
      wild: false,
    },
    {
      id: 2,
      label: "Approach the Pilgrim",
      emoji: "🕯️",
      hint: "The hooded figure hasn't acknowledged your presence. They mutter prayers to something.",
      wild: false,
    },
    {
      id: 3,
      label: "Search the Rubble",
      emoji: "🔍",
      hint: "The collapsed ceiling may hide something — or may collapse further.",
      wild: false,
    },
    {
      id: 4,
      label: "Kick Down the Gate",
      emoji: "💥",
      hint: "Forget subtlety. That rusted gate looks weak enough to shatter.",
      wild: true,
    },
  ],
};

// ─── Turn 1: Sub-options for "Investigate Left Passage" ──────

export const MOCK_SUB_OPTIONS_INVESTIGATE: SubOptionResponse = {
  sub_options: [
    {
      id: 101,
      label: "Sneak past the rats",
      description: "Move silently through the shadows, avoiding the swarm entirely.",
      stat_check: "creativity",
      difficulty: 4,
      wild: false,
    },
    {
      id: 102,
      label: "Charge through with weapon drawn",
      description: "Cut a path through the vermin with brute force.",
      stat_check: "strength",
      difficulty: 3,
      wild: false,
    },
    {
      id: 103,
      label: "Lure them out with rations",
      description: "Toss some food to draw the rats away from the passage.",
      stat_check: "charisma",
      difficulty: 5,
      wild: false,
    },
    {
      id: 104,
      label: "Collapse the ceiling on them",
      description: "Strike the weak supports and bury the swarm — along with whatever else is down there.",
      stat_check: "strength",
      difficulty: 6,
      wild: true,
    },
  ],
};

// ─── Turn 1: Sub-options for "Approach the Pilgrim" ──────────

export const MOCK_SUB_OPTIONS_PILGRIM: SubOptionResponse = {
  sub_options: [
    {
      id: 201,
      label: "Greet them respectfully",
      description: "Announce yourself with courtesy and see if they'll share information.",
      stat_check: "charisma",
      difficulty: 3,
      wild: false,
    },
    {
      id: 202,
      label: "Observe from the shadows",
      description: "Watch quietly to learn what they're doing before revealing yourself.",
      stat_check: "creativity",
      difficulty: 4,
      wild: false,
    },
    {
      id: 203,
      label: "Demand answers",
      description: "Step forward aggressively — this is no place for pleasantries.",
      stat_check: "strength",
      difficulty: 5,
      wild: false,
    },
    {
      id: 204,
      label: "Pickpocket them while praying",
      description: "Their devotion is your opportunity. Deft fingers find their coin purse.",
      stat_check: "creativity",
      difficulty: 7,
      wild: true,
    },
  ],
};

// ─── Turn 1: Sub-options for "Search the Rubble" ─────────────

export const MOCK_SUB_OPTIONS_RUBBLE: SubOptionResponse = {
  sub_options: [
    {
      id: 301,
      label: "Carefully sift through stones",
      description: "Take your time, testing each piece before moving it.",
      stat_check: "creativity",
      difficulty: 3,
      wild: false,
    },
    {
      id: 302,
      label: "Heave the largest boulders aside",
      description: "Use raw strength to clear the debris quickly.",
      stat_check: "strength",
      difficulty: 4,
      wild: false,
    },
    {
      id: 303,
      label: "Look for structural weak points",
      description: "Find the keystone — remove it and the whole pile shifts.",
      stat_check: "creativity",
      difficulty: 5,
      wild: false,
    },
    {
      id: 304,
      label: "Use the rubble as a weapon cache",
      description: "Improvise jagged throwing stones for later encounters.",
      stat_check: "strength",
      difficulty: 4,
      wild: true,
    },
  ],
};

// ─── Turn 1: Sub-options for "Kick Down the Gate" ────────────

export const MOCK_SUB_OPTIONS_GATE: SubOptionResponse = {
  sub_options: [
    {
      id: 401,
      label: "Full-body shoulder charge",
      description: "Throw your entire weight against the rusted hinges.",
      stat_check: "strength",
      difficulty: 5,
      wild: false,
    },
    {
      id: 402,
      label: "Find a pry bar in the rubble",
      description: "A bit of leverage goes a long way against corroded metal.",
      stat_check: "creativity",
      difficulty: 4,
      wild: false,
    },
    {
      id: 403,
      label: "Taunt whatever's behind it",
      description: "\"HEY! Come open this door!\" — let them do the work.",
      stat_check: "charisma",
      difficulty: 7,
      wild: true,
    },
    {
      id: 404,
      label: "Swing from the ceiling pipes",
      description: "Grab the overhead pipes and use momentum for a flying kick.",
      stat_check: "strength",
      difficulty: 8,
      wild: true,
    },
  ],
};

// ─── Sub-options lookup by high-level option id ──────────────

const SUB_OPTIONS_MAP: Record<number, SubOptionResponse> = {
  1: MOCK_SUB_OPTIONS_INVESTIGATE,
  2: MOCK_SUB_OPTIONS_PILGRIM,
  3: MOCK_SUB_OPTIONS_RUBBLE,
  4: MOCK_SUB_OPTIONS_GATE,
  // Turn 2 options
  5: {
    sub_options: [
      {
        id: 501,
        label: "Strike at the glowing veins",
        description: "Shatter the pulsing fungal arteries to weaken the colony.",
        stat_check: "strength",
        difficulty: 5,
        wild: false,
      },
      {
        id: 502,
        label: "Harvest spore samples",
        description: "Collect the luminous spores — they could be valuable or useful.",
        stat_check: "creativity",
        difficulty: 4,
        wild: false,
      },
      {
        id: 503,
        label: "Hold your breath and sprint",
        description: "Run through the spore cloud before it thickens.",
        stat_check: "strength",
        difficulty: 6,
        wild: false,
      },
      {
        id: 504,
        label: "Eat one of the mushrooms",
        description: "They look almost edible. What could go wrong?",
        stat_check: "none",
        difficulty: 0,
        wild: true,
      },
    ],
  },
  6: {
    sub_options: [
      {
        id: 601,
        label: "Diplomatic introduction",
        description: "Approach with open hands and calm words.",
        stat_check: "charisma",
        difficulty: 5,
        wild: false,
      },
      {
        id: 602,
        label: "Offer a trade",
        description: "Show something of value to pique their interest.",
        stat_check: "charisma",
        difficulty: 4,
        wild: false,
      },
      {
        id: 603,
        label: "Intimidate them",
        description: "Make it clear you're not to be trifled with.",
        stat_check: "strength",
        difficulty: 6,
        wild: false,
      },
      {
        id: 604,
        label: "Challenge them to a riddle contest",
        description: "\"I wager my passage against your wit.\"",
        stat_check: "creativity",
        difficulty: 7,
        wild: true,
      },
    ],
  },
  7: {
    sub_options: [
      {
        id: 701,
        label: "Examine the walls closely",
        description: "The fungal patterns seem intentional — almost like a map.",
        stat_check: "creativity",
        difficulty: 5,
        wild: false,
      },
      {
        id: 702,
        label: "Follow the water trail",
        description: "A thin stream of water flows deeper — follow it.",
        stat_check: "none",
        difficulty: 0,
        wild: false,
      },
      {
        id: 703,
        label: "Smash through the weak wall",
        description: "The stone here is thin. You can hear air on the other side.",
        stat_check: "strength",
        difficulty: 5,
        wild: false,
      },
      {
        id: 704,
        label: "Sing to the fungus",
        description: "The bioluminescence pulses rhythmically. Maybe it responds to sound?",
        stat_check: "creativity",
        difficulty: 8,
        wild: true,
      },
    ],
  },
  8: {
    sub_options: [
      {
        id: 801,
        label: "Set up a defensive position",
        description: "Use the narrow tunnel to your advantage.",
        stat_check: "strength",
        difficulty: 4,
        wild: false,
      },
      {
        id: 802,
        label: "Create a diversion",
        description: "Throw something to draw attention away from you.",
        stat_check: "creativity",
        difficulty: 5,
        wild: false,
      },
      {
        id: 803,
        label: "Negotiate passage",
        description: "Perhaps the creatures here can be reasoned with.",
        stat_check: "charisma",
        difficulty: 6,
        wild: false,
      },
      {
        id: 804,
        label: "Charge headfirst into the dark",
        description: "Whatever awaits, meet it with fury.",
        stat_check: "strength",
        difficulty: 7,
        wild: true,
      },
    ],
  },
};

// ─── Resolution responses keyed by sub-option id ────────────

function makeResolution(
  outcome: string,
  tier: ActionResolutionResponse["success_tier"],
  overrides: Partial<ActionResolutionResponse> = {}
): ActionResolutionResponse {
  return {
    outcome_narration: outcome,
    success_tier: tier,
    stat_changes: { strength: 0, charisma: 0, creativity: 0 },
    hp_change: 0,
    max_hp_change: 0,
    items_gained: [],
    items_lost: [],
    gold_change: 0,
    reputation_changes: {},
    world_state_updates: {
      entities: [],
      objects: [],
      environment_tags: [],
      flags: {},
      floor_advance: false,
    },
    next_narration:
      "The passage opens into a cavern thick with bioluminescent fungus. The air hums with spore-laden currents. Ahead, three tunnels branch outward — one glowing faintly blue, another dripping with moisture, and the third cloaked in total darkness. Something moves in the blue tunnel.",
    next_location: "Fungal Grotto — The Branching",
    next_options: [
      {
        id: 5,
        label: "Enter the Blue Tunnel",
        emoji: "🔵",
        hint: "The bioluminescent glow pulses like a heartbeat. Something lives in there.",
        wild: false,
      },
      {
        id: 6,
        label: "Hail the Shapes Ahead",
        emoji: "👥",
        hint: "Figures shuffle in the distance — not rats, but not quite human either.",
        wild: false,
      },
      {
        id: 7,
        label: "Explore the Dripping Tunnel",
        emoji: "💧",
        hint: "Water means life — or a way deeper. The moisture seems fresh.",
        wild: false,
      },
      {
        id: 8,
        label: "Plunge into Darkness",
        emoji: "🕳️",
        hint: "The third tunnel swallows all light. Only a fool or a hero enters blind.",
        wild: true,
      },
    ],
    ...overrides,
  };
}

const RESOLUTION_MAP: Record<number, (tier?: string) => ActionResolutionResponse> = {
  // Turn 1 — Investigate Left (rats)
  101: (tier) =>
    makeResolution(
      tier === "failure"
        ? "You creep forward, but your foot catches a loose stone. The rats surge toward you, biting at your ankles before you can retreat."
        : tier === "partial"
        ? "You manage to slip past most of the swarm, but a few bold rats nip at your heels. You make it through, shaken but mostly intact."
        : "You move like a shadow, each step deliberate and silent. The rats never notice you pass. Beyond them, a narrow stairway descends.",
      tier as ActionResolutionResponse["success_tier"],
      {
        hp_change: tier === "failure" ? -2 : tier === "partial" ? -1 : 0,
        stat_changes: {
          strength: 0,
          charisma: 0,
          creativity: tier === "success" || tier === "critical_success" ? 1 : 0,
        },
      }
    ),
  102: (tier) =>
    makeResolution(
      tier === "failure"
        ? "You swing wildly but the rats scatter and regroup, overwhelming you from all sides."
        : "Your blade arcs through the swarm. Rats scatter, squealing. The passage is yours.",
      tier as ActionResolutionResponse["success_tier"],
      {
        hp_change: tier === "failure" ? -3 : 0,
        stat_changes: {
          strength: tier === "critical_success" ? 1 : 0,
          charisma: 0,
          creativity: 0,
        },
        items_gained: tier === "critical_success" ? ["Rat King's Tooth"] : [],
      }
    ),
  103: (tier) =>
    makeResolution(
      tier === "failure"
        ? "The rats ignore your offering and go straight for the hand holding it."
        : "The rats swarm the rations greedily. While they feast, you slip past unnoticed.",
      tier as ActionResolutionResponse["success_tier"],
      {
        hp_change: tier === "failure" ? -1 : 0,
        items_lost: tier !== "failure" ? [] : [],
      }
    ),
  104: (tier) =>
    makeResolution(
      tier === "failure"
        ? "The ceiling collapses — but on YOU. Stone and dust bury you waist-deep. The rats celebrate."
        : tier === "critical_success"
        ? "The supports shatter perfectly. Tons of rock entomb the swarm. In the dust, you spot a glint — a buried chest, now exposed!"
        : "Rock crashes down, sealing the passage and the rats with it. Dust chokes the air but you're alive.",
      tier as ActionResolutionResponse["success_tier"],
      {
        hp_change: tier === "failure" ? -4 : tier === "partial" ? -1 : 0,
        items_gained: tier === "critical_success" ? ["Ancient Lockbox"] : [],
        gold_change: tier === "critical_success" ? 15 : 0,
      }
    ),

  // Turn 1 — Approach Pilgrim
  201: (tier) =>
    makeResolution(
      tier === "failure"
        ? "The pilgrim hisses something unintelligible and turns away. They want nothing to do with you."
        : "The pilgrim looks up with hollow eyes. \"Another soul descends,\" they rasp. \"Take this — you'll need it more than the dead.\" They press a vial into your hand.",
      tier as ActionResolutionResponse["success_tier"],
      {
        items_gained: tier !== "failure" ? ["Pilgrim's Vial"] : [],
        reputation_changes: tier !== "failure" ? { "Hooded Pilgrim": 1 } : {},
      }
    ),
  202: (tier) =>
    makeResolution(
      tier === "failure"
        ? "You step on a loose flagstone. The pilgrim spins around, dagger drawn."
        : "From the shadows you watch them place something inside the shrine — a small key, glowing faintly. They leave it and walk away.",
      tier as ActionResolutionResponse["success_tier"],
      {
        hp_change: tier === "failure" ? -1 : 0,
        items_gained: tier === "success" || tier === "critical_success" ? ["Shrine Key"] : [],
        stat_changes: {
          strength: 0,
          charisma: 0,
          creativity: tier === "critical_success" ? 1 : 0,
        },
      }
    ),
  203: (tier) =>
    makeResolution(
      tier === "failure"
        ? "The pilgrim is faster than they look. A blade flashes and you stagger back, bleeding."
        : "Your commanding presence startles them. \"F-fine!\" they stammer. \"The left passage leads to the deep stair. The right is a dead end. Now leave me!\"",
      tier as ActionResolutionResponse["success_tier"],
      {
        hp_change: tier === "failure" ? -2 : 0,
        stat_changes: {
          strength: tier === "critical_success" ? 1 : 0,
          charisma: 0,
          creativity: 0,
        },
      }
    ),
  204: (tier) =>
    makeResolution(
      tier === "failure"
        ? "Their hand snaps around your wrist like a vice. \"THIEF!\" The shrine begins to glow red."
        : tier === "critical_success"
        ? "Your fingers dance into their cloak and return laden. A coin purse, a dagger, and — a map of the first three floors. The pilgrim prays on, oblivious."
        : "You palm a few coins while they're deep in prayer. Not a fortune, but it's something.",
      tier as ActionResolutionResponse["success_tier"],
      {
        hp_change: tier === "failure" ? -3 : 0,
        gold_change: tier === "critical_success" ? 25 : tier !== "failure" ? 8 : 0,
        items_gained: tier === "critical_success" ? ["Floor Map (1-3)", "Pilgrim's Dagger"] : [],
        reputation_changes: tier === "failure" ? { "Hooded Pilgrim": -2 } : {},
      }
    ),

  // Turn 1 — Search Rubble
  301: (tier) =>
    makeResolution(
      "You sift through the debris carefully, finding a few coins wedged between the stones and a tarnished ring.",
      tier as ActionResolutionResponse["success_tier"],
      {
        gold_change: 5,
        items_gained: tier !== "failure" ? ["Tarnished Ring"] : [],
      }
    ),
  302: (tier) =>
    makeResolution(
      tier === "failure"
        ? "A boulder shifts wrong and pins your hand. You wrench free, but not without damage."
        : "Stone by stone, you clear a path. Beneath the largest boulder: a small alcove with supplies left by a previous explorer.",
      tier as ActionResolutionResponse["success_tier"],
      {
        hp_change: tier === "failure" ? -2 : 0,
        items_gained: tier !== "failure" ? ["Explorer's Rations"] : [],
        stat_changes: {
          strength: tier === "critical_success" ? 1 : 0,
          charisma: 0,
          creativity: 0,
        },
      }
    ),
  303: (tier) =>
    makeResolution(
      tier === "failure"
        ? "You yank the wrong stone. The pile shifts ominously but holds. Nothing gained."
        : "You spot it — a single wedge-shaped stone holding everything in place. One careful pull and the rubble cascades to reveal a hidden chamber.",
      tier as ActionResolutionResponse["success_tier"],
      {
        items_gained: tier === "critical_success" ? ["Crumbling Halls Map"] : [],
        stat_changes: {
          strength: 0,
          charisma: 0,
          creativity: tier !== "failure" ? 1 : 0,
        },
      }
    ),
  304: (tier) =>
    makeResolution(
      tier === "failure"
        ? "You grab a sharp stone but it crumbles in your hand. Dust and nothing else."
        : "The rubble yields an impressive array of sharp fragments. You wrap the best ones in cloth — improvised throwing knives.",
      tier as ActionResolutionResponse["success_tier"],
      {
        items_gained: tier !== "failure" ? ["Throwing Stones (x3)"] : [],
      }
    ),

  // Turn 1 — Gate
  401: (tier) =>
    makeResolution(
      tier === "failure"
        ? "Your shoulder hits solid iron. The gate doesn't budge. Your shoulder, however, pops."
        : "The hinges explode outward in a shower of rust. Beyond: a stairway descending into phosphorescent green light.",
      tier as ActionResolutionResponse["success_tier"],
      {
        hp_change: tier === "failure" ? -2 : 0,
        stat_changes: {
          strength: tier === "critical_success" ? 1 : 0,
          charisma: 0,
          creativity: 0,
        },
      }
    ),
  402: (tier) =>
    makeResolution(
      "You find a bent iron bar among the rubble and jam it into the gate's hinges. With a satisfying screech, the gate gives way.",
      tier as ActionResolutionResponse["success_tier"],
      {
        items_gained: tier === "critical_success" ? ["Iron Pry Bar"] : [],
        stat_changes: {
          strength: 0,
          charisma: 0,
          creativity: tier !== "failure" ? 1 : 0,
        },
      }
    ),
  403: (tier) =>
    makeResolution(
      tier === "failure"
        ? "Silence. Then a guttural laugh from the other side. The gate rattles but stays shut."
        : "\"WHO DARES?\" booms a voice. Then locks click open. A bewildered goblin stares up at you. \"You're... not the password.\"\n\"Neither are you,\" you say, stepping past.",
      tier as ActionResolutionResponse["success_tier"],
      {
        gold_change: tier === "critical_success" ? 10 : 0,
        stat_changes: {
          strength: 0,
          charisma: tier !== "failure" ? 1 : 0,
          creativity: 0,
        },
        world_state_updates: {
          entities: tier !== "failure"
            ? [{ name: "Bewildered Goblin", type: "neutral", description: "A small goblin who opened the gate, now deeply confused." }]
            : [],
          objects: [],
          environment_tags: [],
          flags: {},
          floor_advance: false,
        },
      }
    ),
  404: (tier) =>
    makeResolution(
      tier === "failure"
        ? "You grab the pipes. They snap. You crash onto the gate face-first. The pipes leak something foul on your head."
        : tier === "critical_success"
        ? "You swing from the pipes in a perfect arc, feet connecting with the gate in an explosion of rust and glory. The gate flies off its hinges and takes out a rat swarm on the other side. Legendary."
        : "The pipes groan but hold. Your momentum carries you into the gate — it buckles and falls with a tremendous crash.",
      tier as ActionResolutionResponse["success_tier"],
      {
        hp_change: tier === "failure" ? -3 : 0,
        stat_changes: {
          strength: tier === "critical_success" ? 1 : 0,
          charisma: 0,
          creativity: tier === "critical_success" ? 1 : 0,
        },
      }
    ),

  // Turn 2 — Blue Tunnel
  501: (tier) =>
    makeResolution(
      "You strike the fungal veins. Bioluminescent fluid sprays outward — the cavern dims and the colony shrinks back.",
      tier as ActionResolutionResponse["success_tier"],
      {
        hp_change: tier === "failure" ? -2 : 0,
        world_state_updates: { entities: [], objects: [], environment_tags: ["dimmed fungus"], flags: {}, floor_advance: true },
      }
    ),
  502: (tier) =>
    makeResolution(
      "You carefully collect the glowing spores into a makeshift pouch. They pulse warmly against your hip.",
      tier as ActionResolutionResponse["success_tier"],
      {
        items_gained: ["Luminous Spore Pouch"],
        stat_changes: { strength: 0, charisma: 0, creativity: 1 },
        world_state_updates: { entities: [], objects: [], environment_tags: [], flags: {}, floor_advance: true },
      }
    ),
  503: (tier) =>
    makeResolution(
      tier === "failure"
        ? "You inhale a lungful of spores. Your vision swims and your chest burns."
        : "You bolt through the cloud, lungs screaming. You emerge on the far side, gasping but alive.",
      tier as ActionResolutionResponse["success_tier"],
      {
        hp_change: tier === "failure" ? -3 : tier === "partial" ? -1 : 0,
        world_state_updates: { entities: [], objects: [], environment_tags: [], flags: {}, floor_advance: true },
      }
    ),
  504: () =>
    makeResolution(
      "You pop a glowing mushroom in your mouth. It tastes like electricity and regret. Your vision explodes into colours that don't exist. When it fades, you feel... different. Permanently.",
      "critical_success",
      {
        hp_change: -2,
        max_hp_change: 2,
        stat_changes: { strength: -1, charisma: 0, creativity: 2 },
        world_state_updates: { entities: [], objects: [], environment_tags: ["hallucination residue"], flags: { ate_mushroom: true }, floor_advance: true },
      }
    ),

  // Turn 2 — Hail Shapes
  601: (tier) =>
    makeResolution(
      tier === "failure"
        ? "They don't understand your words. One throws a rock."
        : "The shapes resolve into fungal goblins. Your calm approach earns a wary truce.",
      tier as ActionResolutionResponse["success_tier"],
      {
        hp_change: tier === "failure" ? -1 : 0,
        reputation_changes: tier !== "failure" ? { "Fungal Goblins": 1 } : {},
        world_state_updates: { entities: [], objects: [], environment_tags: [], flags: {}, floor_advance: true },
      }
    ),
  602: (tier) =>
    makeResolution(
      "You show them the coins. Their eyes go wide — they've never seen gold before. They offer passage and a crude map.",
      tier as ActionResolutionResponse["success_tier"],
      {
        gold_change: -5,
        items_gained: tier !== "failure" ? ["Crude Tunnel Map"] : [],
        world_state_updates: { entities: [], objects: [], environment_tags: [], flags: {}, floor_advance: true },
      }
    ),
  603: (tier) =>
    makeResolution(
      tier === "failure"
        ? "They don't scare easily. Three of them rush you at once."
        : "You tower over them, snarling. They scatter into the walls, leaving their belongings behind.",
      tier as ActionResolutionResponse["success_tier"],
      {
        hp_change: tier === "failure" ? -3 : 0,
        gold_change: tier !== "failure" ? 8 : 0,
        world_state_updates: { entities: [], objects: [], environment_tags: [], flags: {}, floor_advance: true },
      }
    ),
  604: (tier) =>
    makeResolution(
      tier === "failure"
        ? "\"What has legs but cannot walk?\" you ask. \"YOU, SOON\" they reply, and attack."
        : "The goblin chief accepts. Three riddles later, you've won passage, their respect, and a strange amulet.",
      tier as ActionResolutionResponse["success_tier"],
      {
        hp_change: tier === "failure" ? -2 : 0,
        items_gained: tier !== "failure" ? ["Fungal Amulet"] : [],
        reputation_changes: tier !== "failure" ? { "Fungal Goblins": 2 } : { "Fungal Goblins": -1 },
        world_state_updates: { entities: [], objects: [], environment_tags: [], flags: {}, floor_advance: true },
      }
    ),

  // Turn 2 — Dripping Tunnel
  701: (tier) =>
    makeResolution(
      "The patterns are a map — ancient, but legible. You trace the route deeper.",
      tier as ActionResolutionResponse["success_tier"],
      {
        stat_changes: { strength: 0, charisma: 0, creativity: 1 },
        world_state_updates: { entities: [], objects: [], environment_tags: [], flags: {}, floor_advance: true },
      }
    ),
  702: () =>
    makeResolution(
      "The stream leads you steadily downward through a narrow passage that opens into the next level.",
      "success",
      {
        world_state_updates: { entities: [], objects: [], environment_tags: [], flags: {}, floor_advance: true },
      }
    ),
  703: (tier) =>
    makeResolution(
      tier === "failure"
        ? "The wall is thicker than expected. You bruise your fists on stone."
        : "The wall shatters to reveal a shortcut — and a cache of supplies from some long-dead adventurer.",
      tier as ActionResolutionResponse["success_tier"],
      {
        hp_change: tier === "failure" ? -1 : 0,
        items_gained: tier !== "failure" ? ["Adventurer's Pack"] : [],
        world_state_updates: { entities: [], objects: [], environment_tags: [], flags: {}, floor_advance: true },
      }
    ),
  704: (tier) =>
    makeResolution(
      tier === "failure"
        ? "The fungus recoils and releases a cloud of toxic spores directly into your face."
        : tier === "critical_success"
        ? "Your voice echoes through the cavern. The fungus RESPONDS — it reshapes, opening a glowing corridor just for you. The dungeon itself seems impressed."
        : "The bioluminescence brightens to your melody. A hidden path illuminates in the wall.",
      tier as ActionResolutionResponse["success_tier"],
      {
        hp_change: tier === "failure" ? -3 : 0,
        stat_changes: { strength: 0, charisma: tier === "critical_success" ? 1 : 0, creativity: tier !== "failure" ? 1 : 0 },
        world_state_updates: { entities: [], objects: [], environment_tags: [], flags: { sang_to_fungus: true }, floor_advance: true },
      }
    ),

  // Turn 2 — Darkness
  801: (tier) =>
    makeResolution(
      "You wedge yourself into a narrow gap and wait. Shapes pass in the dark — but none can reach you.",
      tier as ActionResolutionResponse["success_tier"],
      {
        world_state_updates: { entities: [], objects: [], environment_tags: [], flags: {}, floor_advance: true },
      }
    ),
  802: (tier) =>
    makeResolution(
      "You hurl a stone into the darkness. Something shrieks and scuttles away. The path clears.",
      tier as ActionResolutionResponse["success_tier"],
      {
        stat_changes: { strength: 0, charisma: 0, creativity: tier !== "failure" ? 1 : 0 },
        world_state_updates: { entities: [], objects: [], environment_tags: [], flags: {}, floor_advance: true },
      }
    ),
  803: (tier) =>
    makeResolution(
      tier === "failure"
        ? "The darkness doesn't negotiate. Something cold grabs your ankle."
        : "You speak into the void. Something ancient listens. It releases you — this time.",
      tier as ActionResolutionResponse["success_tier"],
      {
        hp_change: tier === "failure" ? -2 : 0,
        world_state_updates: { entities: [], objects: [], environment_tags: [], flags: {}, floor_advance: true },
      }
    ),
  804: (tier) =>
    makeResolution(
      tier === "failure"
        ? "You charge blindly into a stone wall. Stars explode behind your eyes."
        : tier === "critical_success"
        ? "You barrel through the darkness screaming a war cry. Whatever lived there flees in terror. You emerge on the other side having conquered fear itself."
        : "Blind courage carries you through. You trip, stumble, but keep running until light returns.",
      tier as ActionResolutionResponse["success_tier"],
      {
        hp_change: tier === "failure" ? -4 : tier === "partial" ? -1 : 0,
        stat_changes: {
          strength: tier === "critical_success" ? 1 : 0,
          charisma: tier === "critical_success" ? 1 : 0,
          creativity: 0,
        },
        world_state_updates: { entities: [], objects: [], environment_tags: [], flags: {}, floor_advance: true },
      }
    ),
};

// ─── Load More options ───────────────────────────────────────

export const MOCK_LOAD_MORE_TURN_1: HighLevelOption[] = [
  {
    id: 50,
    label: "Listen to the Walls",
    emoji: "👂",
    hint: "Press your ear to the stone. The dungeon has a heartbeat — if you know how to find it.",
    wild: false,
  },
  {
    id: 51,
    label: "Scream Into the Void",
    emoji: "🗣️",
    hint: "Let the dungeon know you've arrived. Consequences be damned.",
    wild: true,
  },
];

// Sub-options for load-more options
SUB_OPTIONS_MAP[50] = {
  sub_options: [
    { id: 5001, label: "Press ear to stone", description: "Focus on the vibrations.", stat_check: "creativity", difficulty: 4, wild: false },
    { id: 5002, label: "Tap in patterns", description: "Use old mining codes.", stat_check: "creativity", difficulty: 5, wild: false },
    { id: 5003, label: "Feel for air currents", description: "Drafts reveal passages.", stat_check: "none", difficulty: 0, wild: false },
    { id: 5004, label: "Lick the wall", description: "Mineral taste tells stories. Disgusting stories.", stat_check: "creativity", difficulty: 7, wild: true },
  ],
};
SUB_OPTIONS_MAP[51] = {
  sub_options: [
    { id: 5101, label: "Berserker roar", description: "Pure intimidation.", stat_check: "strength", difficulty: 4, wild: false },
    { id: 5102, label: "Echoing song", description: "See what resonates.", stat_check: "charisma", difficulty: 5, wild: false },
    { id: 5103, label: "Mock the dungeon", description: "\"Is that all you've got?\"", stat_check: "charisma", difficulty: 7, wild: true },
    { id: 5104, label: "Primal scream therapy", description: "Let it ALL out.", stat_check: "none", difficulty: 0, wild: true },
  ],
};

// Fallback resolutions for load-more sub-options
for (const id of [5001, 5002, 5003, 5004, 5101, 5102, 5103, 5104]) {
  RESOLUTION_MAP[id] = (tier) =>
    makeResolution(
      tier === "failure"
        ? "That... did not work as intended. The dungeon punishes hubris."
        : "An unconventional approach, but it works. You discover something others would have missed.",
      tier as ActionResolutionResponse["success_tier"],
      {
        hp_change: tier === "failure" ? -1 : 0,
        stat_changes: { strength: 0, charisma: 0, creativity: tier !== "failure" ? 1 : 0 },
      }
    );
}

// ─── Custom input validation ────────────────────────────────

export const MOCK_CUSTOM_VALIDATION_VALID: CustomInputValidation = {
  valid: true,
  interpretation: "Improvised creative action",
  stat_check: "creativity",
  difficulty: 5,
  rejection_narration: null,
};

export const MOCK_CUSTOM_VALIDATION_REJECTED: CustomInputValidation = {
  valid: false,
  interpretation: "",
  stat_check: "none",
  difficulty: 0,
  rejection_narration: "The dungeon does not bend to such whims. Your words dissolve into the stone, unheard and unheeded.",
};

// ─── Mock API functions ──────────────────────────────────────

const MOCK_DELAY = 400; // ms, simulates network latency

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function mockGenerateOpeningScenario(): Promise<OpeningScenarioResponse> {
  await delay(MOCK_DELAY);
  return structuredClone(MOCK_OPENING);
}

export async function mockGenerateSubOptions(
  optionId: number
): Promise<SubOptionResponse> {
  await delay(MOCK_DELAY);
  const subs = SUB_OPTIONS_MAP[optionId];
  if (subs) return structuredClone(subs);
  // Fallback for unknown option ids
  return structuredClone(MOCK_SUB_OPTIONS_INVESTIGATE);
}

export async function mockResolveAction(
  subOptionId: number,
  tier: string
): Promise<ActionResolutionResponse> {
  await delay(MOCK_DELAY);
  const resolver = RESOLUTION_MAP[subOptionId];
  if (resolver) return structuredClone(resolver(tier));
  // Fallback
  return structuredClone(
    makeResolution(
      "Your action unfolds with mixed results. The dungeon accepts your offering.",
      tier as ActionResolutionResponse["success_tier"]
    )
  );
}

export async function mockValidateCustomInput(): Promise<CustomInputValidation> {
  await delay(MOCK_DELAY);
  // Accept most custom inputs in debug mode
  return structuredClone(MOCK_CUSTOM_VALIDATION_VALID);
}

export async function mockLoadMoreOptions(): Promise<{ options: HighLevelOption[] }> {
  await delay(MOCK_DELAY);
  return { options: structuredClone(MOCK_LOAD_MORE_TURN_1) };
}

export { SUB_OPTIONS_MAP, RESOLUTION_MAP };
