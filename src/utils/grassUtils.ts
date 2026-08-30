export interface GrassIsland {
  count: number;
  fieldSize: number;
  position: [number, number, number];
  grassScale?: number;
}

interface GenerateGrassIslandsOptions {
  count: number;
  areaSize: number;

  minSize?: number;
  maxSize?: number;

  minGrassCount?: number;
  maxGrassCount?: number;

  minDistance?: number;

  y?: number;
}

export function generateGrassIslands({
  count,
  areaSize,

  minSize = 5,
  maxSize = 12,

  minGrassCount = 500,
  maxGrassCount = 2000,

  minDistance = 5,

  y = 0,

}: GenerateGrassIslandsOptions): GrassIsland[] {

  const islands: GrassIsland[] = [];

  const halfArea = areaSize / 2;

  let attempts = 0;

  while (
    islands.length < count &&
    attempts < count * 100
  ) {

    attempts++;

    const x =
      (Math.random() - 0.5) * areaSize;

    const z =
      (Math.random() - 0.5) * areaSize;


    /*
     * Prevent islands from spawning
     * too close to each other.
     */
    const tooClose = islands.some((island) => {

      const dx =
        island.position[0] - x;

      const dz =
        island.position[2] - z;

      return Math.sqrt(
        dx * dx +
        dz * dz
      ) < minDistance;

    });

    if (tooClose) continue;


    const fieldSize =
      minSize +
      Math.random() *
      (maxSize - minSize);


    const count =
      Math.floor(
        minGrassCount +
        Math.random() *
        (maxGrassCount - minGrassCount)
      );


    islands.push({

      count,

      fieldSize,

      position: [
        x,
        y,
        z
      ],

      grassScale:
        0.8 +
        Math.random() * 0.4

    });

  }

  return islands;
}
