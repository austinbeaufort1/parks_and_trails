import { supabase } from "../../../connection/supabase";

export type QuestEvent =
  | { type: "unlocked"; questId: string; title: string; level: number }
  | {
      type: "leveled_up";
      questId: string;
      title: string;
      level: number;
      progress: number;
    }
  | { type: "completed"; questId: string; title: string };

export const checkQuests = async ({
  userId,
  trailDistance = 0,
}: {
  userId: string;
  trailDistance?: number;
}): Promise<QuestEvent[] | null> => {
  if (!userId) return null;

  const events: QuestEvent[] = [];

  // 1️⃣ Fetch the quest
  const { data: quest, error: questError } = await supabase
    .from("quests")
    .select("id, title, max_level, condition")
    .eq("title", "Walking Challenge")
    .maybeSingle();

  if (questError || !quest) {
    console.error("Quest fetch failed", questError);
    return null;
  }

  const QUEST_ID = quest.id;
  const milestones: number[] = quest.condition.milestones ?? [];
  if (milestones.length === 0) {
    console.error("Quest milestones missing!");
    return null;
  }

  // 2️⃣ Fetch quest_levels
  const { data: questLevels, error: levelsError } = await supabase
    .from("quest_levels")
    .select("*")
    .eq("quest_id", QUEST_ID)
    .order("level", { ascending: true });

  if (levelsError || !questLevels || questLevels.length === 0) {
    console.error("Quest levels fetch failed", levelsError);
    return null;
  }

  // 3️⃣ Calculate cumulative distance
  const { data: completedTrails, error: completedError } = await supabase
    .from("user_completed_trails")
    .select("distance")
    .eq("user_id", userId);

  if (completedError) {
    console.error("Error fetching completed trails:", completedError);
    return null;
  }

  const totalDistanceSoFar = (completedTrails ?? []).reduce(
    (sum, row: { distance: number }) => sum + row.distance,
    0
  );

  const cumulativeDistance = totalDistanceSoFar + trailDistance;

  // 4️⃣ Fetch user's quest row
  const { data: userQuest } = await supabase
    .from("user_quests")
    .select("*")
    .eq("user_id", userId)
    .eq("quest_id", QUEST_ID)
    .maybeSingle();

  // 5️⃣ Unlock quest if missing
  if (!userQuest && cumulativeDistance >= milestones[0]) {
    const firstLevel = questLevels[0];

    const { error: insertError } = await supabase.from("user_quests").insert({
      user_id: userId,
      quest_id: QUEST_ID,
      quest_level_id: firstLevel.id,
      current_level: firstLevel.level,
      progress: { distance: cumulativeDistance },
      earned_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (insertError) {
      console.error("Failed to insert user_quest:", insertError);
      return null;
    }

    events.push({
      type: "unlocked",
      questId: QUEST_ID,
      title: quest.title,
      level: firstLevel.level,
    });

    return events;
  }

  // 6️⃣ Update progress if quest already unlocked
  if (userQuest) {
    let progressDistance = userQuest.progress?.distance ?? 0;
    progressDistance += trailDistance;

    // Determine new level based on milestones
    let newLevelIndex = 0;
    for (let i = 0; i < milestones.length; i++) {
      if (progressDistance >= milestones[i]) newLevelIndex = i;
    }

    const newLevel = questLevels[newLevelIndex];

    // Update DB
    const { error: updateError } = await supabase
      .from("user_quests")
      .update({
        quest_level_id: newLevel.id,
        current_level: newLevel.level,
        progress: { distance: progressDistance },
        updated_at: new Date().toISOString(),
      })
      .eq("id", userQuest.id);

    if (updateError) {
      console.error("Failed to update user_quest:", updateError);
      return null;
    }

    // Emit level-up if user advanced
    if (newLevel.level > userQuest.current_level) {
      events.push({
        type: "leveled_up",
        questId: QUEST_ID,
        title: quest.title,
        level: newLevel.level,
        progress: progressDistance,
      });
    }

    // Emit completion if max level reached
    if (newLevel.level >= quest.max_level) {
      events.push({
        type: "completed",
        questId: QUEST_ID,
        title: quest.title,
      });
    }
  }

  return events.length ? events : null;
};
