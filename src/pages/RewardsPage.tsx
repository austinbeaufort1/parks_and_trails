import { useEffect, useState } from "react";
import { supabase } from "../connection/supabase";
import { Badge } from "../components/Badges/Badge";

interface EarnedBadge {
  id: string;
  title: string;
  description?: string;
  icon_svg?: string;
  earned_at: string;
}

const RewardsPage = ({ userId }: { userId: string }) => {
  const [badges, setBadges] = useState<EarnedBadge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    async function fetchBadges() {
      const { data, error } = await supabase
        .from("user_badges")
        .select(
          `
          earned_at,
          extra_data,
          badges (
            id,
            title,
            description,
            icon_svg
          )
        `,
        )
        .eq("user_id", userId)
        .order("earned_at", { ascending: false });

      if (!error && data) {
        const formatted = data.map((row: any) => ({
          id: row.badges.id,
          title: row.badges.title,
          description: row.badges.description,
          icon_svg: row.badges.icon_svg,
          earned_at: row.earned_at,
        }));
        setBadges(formatted);
      }

      setLoading(false);
    }

    fetchBadges();
  }, [userId]);

  return (
    <div>
      <h3>Earned Badges</h3>

      {loading && <p>Loading badges…</p>}
      {!loading && badges.length === 0 && <p>No badges yet — get hiking!</p>}

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        {badges.map((badge) => (
          <Badge key={badge.id} badge={badge} />
        ))}
      </div>
    </div>
  );
};

export default RewardsPage;
