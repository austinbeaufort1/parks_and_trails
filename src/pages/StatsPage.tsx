// src/pages/StatsPage.tsx
import { Spin, Alert, Card } from "antd";
import { useAuth } from "../components/AuthContext";
import { useUserStats } from "../hooks/useUserStats";
import { formatDistance, formatElevation } from "../components/helpers/format";
import { LabelValue } from "../components/LabelValue";

function StatsPage() {
  const { user } = useAuth();
  const { stats, loading, error } = useUserStats(user?.id ?? null);

  const forestGreen = "rgb(0, 94, 12)";
  const rust = "rgb(78, 38, 12)";

  if (!user)
    return <Alert message="Please log in to see your stats." type="info" />;

  if (loading) return <Spin tip="Loading stats..." />;

  if (error) return <Alert message={error} type="error" />;

  return (
    <div style={{ padding: 24, fontFamily: "'Rock Salt', cursive" }}>
      <h1
        style={{
          color: forestGreen,
          fontFamily: "'Rock Salt', cursive",
          fontSize: "2.2rem",
          marginBottom: 24,
        }}
      >
        User Stats
      </h1>

      <Card
        style={{
          marginBottom: 16,
          border: `2px solid ${forestGreen}`,
          boxShadow: "3px 3px 10px rgba(0,0,0,0.15)",
          borderRadius: 8,
        }}
      >
        <LabelValue
          label="Total Trails Completed"
          value={stats.totalCompleted}
        />
        <LabelValue
          label="Total Distance Hiked"
          value={formatDistance(stats.totalDistance)}
        />
        <LabelValue
          label="Total Elevation Gained"
          value={formatElevation(stats.totalElevation)}
        />
        <LabelValue
          label="Steepest Trail Completed"
          value={
            <>
              {stats.steepestTrail
                ? `${stats.steepestTrail.title} (${
                    stats.steepestTrail.park_name
                  }) — ${stats.steepestTrail.maxAngle.toFixed(1)}°`
                : "N/A"}
            </>
          }
        />
        <LabelValue
          label="Longest Trail Completed"
          value={
            <>
              {stats.longestTrail
                ? `${stats.longestTrail.title} (${
                    stats.longestTrail.park_name
                  }) — ${formatDistance(stats.longestTrail.distance)}`
                : "N/A"}
            </>
          }
        />
      </Card>
    </div>
  );
}

export default StatsPage;
