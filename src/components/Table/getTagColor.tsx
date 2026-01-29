import { DifficultyDesc } from "../../types/difficulty";
import { AngleDesc } from "../../types/angle";
import {
  DifficultyTagColors,
  difficultyTagColors,
  angleTagColors,
  AngleTagColors,
} from "../../types/uicolors";

export function getDifficultyTag(text: DifficultyDesc): DifficultyTagColors {
  return text === "Easy"
    ? difficultyTagColors.easy
    : text === "Moderate"
    ? difficultyTagColors.moderate
    : text === "Moderately Strenuous"
    ? difficultyTagColors.moderatelyStrenuous
    : text === "Strenuous"
    ? difficultyTagColors.strenous
    : text === "Very Strenuous"
    ? difficultyTagColors.veryStrenuous
    : text === "Challenging"
    ? difficultyTagColors.challenging
    : difficultyTagColors.bomber;
}

export function getAngleTag(angle: AngleDesc): AngleTagColors {
  return angle === "Flat" || angle == "Nearly Flat"
    ? angleTagColors.flat
    : angle === "Gentle Slopes"
    ? angleTagColors.nearlyFlat
    : angle === "Moderate"
    ? angleTagColors.gentleSlope
    : angle === "Moderately Steep"
    ? angleTagColors.moderatelySteep
    : angle === "Steep"
    ? angleTagColors.steep
    : angle === "Very Steep"
    ? angleTagColors.verySteep
    : angleTagColors.terrifying;
}
