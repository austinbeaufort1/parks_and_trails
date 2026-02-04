import { checkTokens, Mode } from "./checkTokens";
import { checkBadges } from "./checkBadges";
import { checkQuests } from "./checkQuests";
import { initialFormData } from "../../TrailsPage/TrailCard";

export const processRewards = async ({
  userId,
  trailId,
  payload,
  timesCompleted,
  trailDistance,
  formData,
  estimatedTime,
  trail,
  mode,
}: {
  userId: string;
  trailId: string;
  payload: any;
  timesCompleted: number;
  trailDistance: number;
  formData: typeof initialFormData;
  estimatedTime: number;
  trail: any;
  mode: Mode;
}) => {
  const tokens = await checkTokens({
    userId,
    trailId,
    timesCompleted,
    formData,
    trailDistance,
    estimatedTime,
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
