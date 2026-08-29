export function generateTowers(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    height: Math.random() * 8 + 3, // 2 - 10
    position: [
      Math.random() * 128 - 64, // x: -40 to 40
      Math.random() * 128 - 64  // z: -40 to 40
    ] as [number, number]
  }));
}
