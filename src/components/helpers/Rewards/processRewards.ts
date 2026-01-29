import { checkTokens } from "./checkTokens";
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
}: {
  userId: string;
  trailId: string;
  payload: any;
  timesCompleted: number;
  trailDistance: number;
  formData: typeof initialFormData;
}) => {
  const tokens = await checkTokens({
    userId,
    trailId,
    timesCompleted,
    formData,
  });
  const badges = await checkBadges(userId);
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
