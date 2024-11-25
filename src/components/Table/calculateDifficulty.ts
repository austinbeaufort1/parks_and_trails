import { CalculatedFields, DistanceElevation, AngleDesc, DifficultyDesc, HighestPoint, Crux } from "./tableTypes";
import { calculateAngleNearestHudredth } from "./calculateAngle";

export function getCalculatedFields(distance: number, elevationGain: number, highestPoint: HighestPoint): CalculatedFields {
  const { difficulty, angle } = calculateDifficultyAndAngle(distance, elevationGain, highestPoint);

  return {
    distance,
    elevationGain,
    difficulty,
    angle,
    ...desc.difficultyAndAngle(difficulty, angle),
  }
}

function calculateDifficultyAndAngle(distance: number, elevationGain: number, highestPoint: HighestPoint): DistanceElevation {
  return {
    difficulty: calculateDifficulty(distance, elevationGain),
    angle: calculateAngleNearestHudredth(distance, elevationGain, highestPoint),
  };
}

function calculateDifficulty(distance: number, elevationGain: number): number {
  return Math.round(Math.sqrt((elevationGain * 2) * distance));
}

export function getCruxDetails(distance: number, elevationGain: number, highestPoint: HighestPoint): Crux {
  const angle = calculateAngleNearestHudredth(distance, elevationGain, highestPoint);
  return {
    distance,
    angle,
    angleDesc: desc.angle(angle),
  }
}

const desc = {
  difficultyAndAngle: (difficulty: number, angle: number): { difficultyDesc: DifficultyDesc, angleDesc: AngleDesc } => ({
    difficultyDesc: desc.difficulty(difficulty),
    angleDesc: desc.angle(angle),
  }),

  difficulty: (difficulty: number): DifficultyDesc =>
    difficulty <= 49
      ? 'Easy'
      : difficulty < 100
        ? 'Moderate'
        : difficulty < 150
          ? 'Moderately Strenuous'
          : difficulty < 200
            ? 'Strenuous'
            : difficulty < 250
              ? 'Very Strenuous'
              : difficulty < 500
                ? 'Challenging'
                : 'Bomber',

  angle: (angle: number): AngleDesc =>
    angle < 2
      ? 'Flat'
      : angle < 4
        ? 'Nearly Flat'
        : angle < 8
          ? 'Gentle Slope'
          : angle < 12
            ? 'Moderately Steep'
            : angle < 20
              ? 'Steep'
              : 'Terrifying',
}
