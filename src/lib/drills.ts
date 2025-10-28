export class Rng {
  state: number;
  constructor(seed: number) {
    this.state = (seed + 1) | 0;
  }
  next() {
    // https://en.wikipedia.org/wiki/Xorshift
    this.state ^= this.state << 13;
    this.state ^= this.state >> 17;
    this.state ^= this.state << 5;
    return this.state;
  }
  randint(min: number, max?: number) {
    if (max === undefined) {
      max = min;
      min = 0;
    }
    const entropy = this.next();
    return (Math.abs(entropy) % (max - min)) + min;
  }
  shuffled<T>(arr: T[]): T[] {
    const slice = arr.slice();
    for (let i = slice.length - 1; i >= 1; i--) {
      const j = this.randint(i + 1);
      [slice[i], slice[j]] = [slice[j], slice[i]];
    }
    return slice;
  }
}

export const keys = [
  "Ab",
  "Eb",
  "Bb",
  "F",
  "C",
  "G",
  "D",
  "A",
  "E",
  "B",
  "F#",
  "C#",
];

export function dailyDrills(seed: number) {
  const rng = new Rng(seed);

  const drills: { [key: string]: string[] } = {};

  function drillSet(names: string[], weights: number[], count: number) {
    const distribution = [];
    for (let i = 0; i < weights.length; i++) {
      for (let j = 0; j < weights[i]; j++) {
        distribution.push(i);
      }
    }
    const buckets = names.map((_) => 0);
    for (let i = 0; i < count; i++) {
      buckets[distribution[rng.randint(distribution.length)]]++;
    }
    const output = [];
    for (let i = 0; i < buckets.length; i++) {
      const slice = rng.shuffled(keys).slice(0, buckets[i]);
      slice.sort((a, b) => keys.indexOf(a) - keys.indexOf(b));
      for (const key of slice) {
        output.push(`${key} ${names[i]}`);
      }
    }
    return output;
  }

  drills["Scales"] = drillSet(
    ["major", "natural minor", "harmonic minor", "melodic minor"],
    [3, 1, 1, 1],
    6
  );

  drills["Chords / Arpeggios"] = drillSet(
    [
      "major",
      "minor",
      "major 7",
      "dominant 7",
      "minor 7",
      "minor 7b5",
      "diminished 7",
    ],
    [3, 3, 1, 1, 1, 1, 1],
    6
  );

  return drills;
}
