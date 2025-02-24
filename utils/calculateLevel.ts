const LEVEL_PER_POINT = 100;
const HEALT_WEIGHT = 0.6;
const HAPPINESS_WEIGHT = 0.4;

export default function calculateLevel(health: number, happiness: number): number {
  const weightedScore = health * HEALT_WEIGHT + happiness * HAPPINESS_WEIGHT;
  return Math.max(1, Math.floor(weightedScore / LEVEL_PER_POINT));
}

export function untilNextLevel(health: number, happiness: number): number {
  const currentLevel = calculateLevel(health, happiness);
  const nextLevel = currentLevel + 1;
  const nextLevelThreshold = nextLevel * LEVEL_PER_POINT;
  const currentScore = health * HEALT_WEIGHT + happiness * HAPPINESS_WEIGHT;
  return Math.max(0, nextLevelThreshold - currentScore);
}
