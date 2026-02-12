import { checkTokens } from "./tokens/index";
import { Mode } from "./tokens/types";
import { checkBadges } from "./badges/index";
import { initialFormData } from "../../TrailsPage/TrailCard";

export const processRewards = async ({
  userId,
  trailId,
  payload,
  timesCompleted,
  trailDistance,
  formData,
  estimatedTimeMins,
  trail,
  mode,
}: {
  userId: string;
  trailId: string;
  payload: any;
  timesCompleted: number;
  trailDistance: number;
  formData: typeof initialFormData;
  estimatedTimeMins: number;
  trail: any;
  mode: Mode;
}) => {
  const tokens = await checkTokens({
    userId,
    trailId,
    timesCompleted,
    formData,
    trailDistance,
    estimatedTimeMins,
    trail,
    mode,
  });
  const badges = await checkBadges(userId, trailId);
  //   const questEvents = await checkQuests({
  //     userId,
  //     timesCompleted,
  //     trailDistance,
  //   });
  //   notifyUserIfRewards(completion);
  return {
    tokens,
    badges,
    // quests: questEvents,
  };
};
