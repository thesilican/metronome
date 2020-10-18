export const noop = () => {};

export async function sleep(ms: number) {
  return new Promise((res) => {
    setTimeout(res, ms);
  });
}

export function debounce<T extends Array<any>>(
  callback: (...args: T) => void,
  delay: number
) {
  let timeout: NodeJS.Timeout;
  return (...args: T) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => callback(...args), delay);
  };
}

export function range(start: number, stop?: number, step = 1): number[] {
  if (!stop) {
    stop = start;
    start = 0;
  }
  return Array.from(Array(Math.floor((stop - start) / step))).map(
    (_, i) => start + i * step
  );
}

export function irange(start: number, stop?: number, step = 1): number[] {
  if (!stop) {
    stop = start;
    start = 0;
  }
  return Array.from(Array(Math.floor((stop - start) / step + 1))).map(
    (_, i) => start + i * step
  );
}

export const commonTempos = [
  ...range(40, 60, 2),
  ...range(60, 72, 3),
  ...range(72, 120, 4),
  ...range(120, 144, 6),
  ...irange(144, 208, 8),
];
// export const commonTempos = range(40, 200, 5);

export function nextCommonTempoUp(num: number) {
  for (let i = 0; i < commonTempos.length; i++) {
    const tempo = commonTempos[i];
    if (tempo > num) {
      return tempo;
    }
  }
  return commonTempos[commonTempos.length - 1];
}

export function nextCommonTempoDown(num: number) {
  for (let i = commonTempos.length - 1; i >= 0; i--) {
    const tempo = commonTempos[i];
    if (tempo < num) {
      return tempo;
    }
  }
  return commonTempos[0];
}

export function closestCommonTempo(num: number) {
  if (commonTempos.includes(num)) return num;
  const up = nextCommonTempoUp(num);
  const down = nextCommonTempoDown(num);
  return Math.abs(up - num) < Math.abs(down - num) ? up : down;
}
