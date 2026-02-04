import { supabase } from "../../connection/supabase";

type TrailCompletionPayload = {
  duration_seconds: number;
  details: any;
};

export async function updateTrailMemoryFromPayload(
  trailId: string,
  payload: TrailCompletionPayload,
) {
  const { details } = payload;
  if (!details) return;

  const categories: Record<string, string[]> = {};

  // --- Weight (TYPE ONLY) ---
  if (details.weight?.length) {
    categories["weight"] = details.weight
      .map((w: any) => w?.type)
      .filter(Boolean);
  }

  // --- Movement ---
  if (details.movement?.type) {
    categories["movement"] = [details.movement.type];
  }

  // --- Surface Rules ---
  if (details.surface?.surface) {
    categories["surface"] = [details.surface.surface];
  }

  // --- Trail Adjacent ---
  if (details.trailAdjacent) {
    categories["trail_adjacent"] = ["yes"];
  }

  // --- Perception ---
  if (details.perception?.length) {
    categories["perception"] = details.perception.filter(Boolean);
  }

  // --- Environment (TYPE ONLY) ---
  if (details.environment?.length) {
    categories["environment"] = details.environment
      .map((e: any) => e?.type)
      .filter(Boolean);
  }

  // --- Circus Stunts ---
  if (details.circusStunts?.length) {
    categories["circus_stunts"] = details.circusStunts.filter(Boolean);
  }

  // --- Wildlife ---
  if (details.wildlife?.length) {
    categories["wildlife"] = details.wildlife
      .flatMap((w: string) => w.split(","))
      .map((w: string) => w.trim())
      .filter(Boolean);
  }

  // --- Update memory in Supabase ---
  for (const [category, items] of Object.entries(categories)) {
    if (!items.length) continue;

    const sortedItems = [...items].sort();

    try {
      // Fetch existing rows for this trail + category
      const { data: rows, error } = await supabase
        .from("trail_memory")
        .select("id, count, items")
        .eq("trail_id", trailId)
        .eq("category", category);

      if (error) {
        console.error("Error fetching trail memory:", error);
        continue;
      }

      // Find exact combo match
      const match = rows?.find(
        (row) =>
          Array.isArray(row.items) &&
          row.items.length === sortedItems.length &&
          row.items.every((v: string, i: number) => v === sortedItems[i]),
      );

      if (match) {
        await supabase
          .from("trail_memory")
          .update({
            count: match.count + 1,
            last_updated: new Date().toISOString(),
          })
          .eq("id", match.id);
      } else {
        await supabase.from("trail_memory").insert({
          trail_id: trailId,
          category,
          items: sortedItems,
          count: 1,
        });
      }
    } catch (err) {
      console.error("Error updating trail memory:", err);
    }
  }
}
