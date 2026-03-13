import type { LevelContent } from "./types";

// Explicit imports keep data in JSON; add one line when adding a new level.
import data1 from "./data/1-keys.json";
import data2 from "./data/2-events.json";
import data3 from "./data/3-relays.json";
import data4 from "./data/4-nips.json";
import data5 from "./data/5-advanced.json";
import data6 from "./data/6-nip-core.json";
import data7 from "./data/7-nip-identity.json";
import data8 from "./data/8-nip-browser.json";
import data9 from "./data/9-nip-zaps.json";
import data10 from "./data/10-nip-relays.json";
import data11 from "./data/11-nip-social.json";

const ALL_LEVELS: LevelContent[] = [
  data1 as LevelContent,
  data2 as LevelContent,
  data3 as LevelContent,
  data4 as LevelContent,
  data5 as LevelContent,
  data6 as LevelContent,
  data7 as LevelContent,
  data8 as LevelContent,
  data9 as LevelContent,
  data10 as LevelContent,
  data11 as LevelContent,
];

/** Load all level content from JSON files. Data lives in ./data/*.json. */
export function loadLevels(): LevelContent[] {
  return [...ALL_LEVELS].sort((a, b) => a.id - b.id);
}
