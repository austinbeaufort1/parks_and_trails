import { DifficultyDesc, AngleDesc, difficultyTagColors, DifficultyTagColors, angleTagColors, AngleTagColors } from "./tableTypes";

export function getDifficultyTag(text: DifficultyDesc): DifficultyTagColors {
  return text === 'Easy'
    ? difficultyTagColors.easy
    : text === 'Moderate'
      ? difficultyTagColors.moderate
      : text === 'Moderately Strenuous'
        ? difficultyTagColors.moderatelyStrenuous
        : text === 'Strenuous'
          ? difficultyTagColors.strenous
          : text === 'Very Strenuous'
            ? difficultyTagColors.veryStrenuous
            : text === 'Challenging'
              ? difficultyTagColors.challenging
              : difficultyTagColors.bomber
}

export function getAngleTag(angle: AngleDesc): AngleTagColors {
  return angle === 'Flat' || angle == 'Nearly Flat'
    ? angleTagColors.flat
    : angle === 'Gentle Slopes'
      ? angleTagColors.nearlyFlat
      : angle === 'Moderate'
        ? angleTagColors.gentleSlope
        : angle === 'Moderately Steep'
          ? angleTagColors.moderatelySteep
          : angle === 'Steep'
            ? angleTagColors.steep
            : angleTagColors.verySteep
}
