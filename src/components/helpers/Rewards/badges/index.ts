import { EarnedBadge } from "./types";
import { checkFirstSteps } from "./checkFirstSteps";
import { checkStateBadges } from "./checkStateBadges";
import { checkCountyBadges } from "./checkCountyBadges";
import { checkNationalParkBadges } from "./checkNationalParkBadges";
import { checkStateParkBadges } from "./checkStateParkBadges";
import { checkSeasonBadges } from "./checkSeasonBadges";
import { checkHolidayBadges } from "./checkHolidayBadges";
import { checkStreakBadges } from "./checkStreakBadges";
import { checkUniqueTrailBadges } from "./checkUniqueTrailBadges";
import { checkTotalElevationBadge } from "./checkTotalElevation";
import { checkTotalDistanceBadges } from "./checkTotalDistanceBadges";
import { checkStateCollectionBadges } from "./checkStateCollectionBadges";

export async function checkBadges(
  userId: string,
  trailId: string,
): Promise<EarnedBadge[]> {
  const earnedBadges: EarnedBadge[] = [];

  const badgeChecks = [
    checkFirstSteps(userId),
    checkStateBadges(userId, trailId),
    checkCountyBadges(userId, trailId),
    checkNationalParkBadges(userId, trailId),
    checkStateParkBadges(userId, trailId),
    checkSeasonBadges(userId),
    checkHolidayBadges(userId),
    checkStreakBadges(userId),
    checkUniqueTrailBadges(userId),
    checkTotalElevationBadge(userId),
    checkTotalDistanceBadges(userId),
    checkStateCollectionBadges(userId),
  ];

  const results = await Promise.all(badgeChecks);

  for (const badges of results) {
    if (!badges) continue;
    if (Array.isArray(badges)) earnedBadges.push(...badges);
    else earnedBadges.push(badges);
  }

  return earnedBadges;
}
