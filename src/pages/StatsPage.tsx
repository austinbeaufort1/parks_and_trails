// src/pages/StatsPage.tsx
import { Alert } from "antd";
import { useAuth } from "../components/AuthContext";
import { useUserStats } from "../hooks/useUserStats";
import { formatDistance, formatElevation } from "../components/helpers/format";
import { LabelValue } from "../components/LabelValue";
import { usePerformanceStats } from "../hooks/usePerformanceStats";
import { PerformanceCard } from "../components/PerformanceCard";
import { LoadSpinner } from "../components/Loader";
import styled from "styled-components";

function StatsPage() {
  const { user } = useAuth();
  const { completedTrails, stats, loading, error } = useUserStats(
    user?.id ?? null,
  );

  const completedTrailsData = completedTrails.map((row) => ({
    total_distance_m: row.total_distance_m ?? 0,
    completedAt: new Date(row.completedAt),
  }));

  const performanceStats = usePerformanceStats(completedTrailsData);

  if (!user)
    return <Alert message="Please log in to see your stats." type="info" />;

  if (loading)
    return (
      <Centered>
        <LoadSpinner size={150} />
      </Centered>
    );

  if (error) return <Alert message={error} type="error" />;

  return (
    <PageWrapper>
      <PageTitle style={{ fontFamily: "Rock Salt" }}>User Stats</PageTitle>

      <StatsCard>
        <CardTitle>Grand Totals</CardTitle>
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
            stats.steepestTrail
              ? `${stats.steepestTrail.title} (${stats.steepestTrail.park_name}) — ${stats.steepestTrail.maxAngle.toFixed(1)}°`
              : "N/A"
          }
        />
        <LabelValue
          label="Longest Trail Completed"
          value={
            stats.longestTrail
              ? `${stats.longestTrail.title} (${stats.longestTrail.park_name}) — ${formatDistance(stats.longestTrail.distance)}`
              : "N/A"
          }
        />
      </StatsCard>

      {stats.recentMomentum && (
        <StatsCard highlight>
          <CardTitle>Recent Momentum (Last 30 Days)</CardTitle>
          <LabelValue
            label="Trails Completed"
            value={stats.recentMomentum.trailsCompleted}
          />
          <LabelValue
            label="Distance"
            value={formatDistance(stats.recentMomentum.distance)}
          />
          <LabelValue
            label="Elevation Gained"
            value={formatElevation(stats.recentMomentum.elevation)}
          />
          <LabelValue
            label="Active Days"
            value={stats.recentMomentum.activeDays}
          />
        </StatsCard>
      )}

      {stats.consistency && (
        <StatsCard>
          <CardTitle>Consistency & Habits</CardTitle>
          <LabelValue
            label="Longest Streak (days)"
            value={stats.consistency.longestStreak}
          />
          <LabelValue
            label="Current Streak (days)"
            value={stats.consistency.currentStreak}
          />
          <LabelValue
            label="Average Trails per Week"
            value={stats.consistency.avgTrailsPerWeek}
          />
          <LabelValue
            label="Most Active Weekday"
            value={stats.consistency.mostActiveWeekday}
          />
        </StatsCard>
      )}

      {stats.firstsAndBests && (
        <StatsCard highlight>
          <CardTitle>Firsts & Bests</CardTitle>
          {stats.firstsAndBests.firstTrail && (
            <LabelValue
              label="First Trail Completed"
              value={`${stats.firstsAndBests.firstTrail.title} — ${stats.firstsAndBests.firstTrail.date}`}
            />
          )}
          {stats.firstsAndBests.firstPark && (
            <LabelValue
              label="First Park Explored"
              value={`${stats.firstsAndBests.firstPark.park_name} — ${stats.firstsAndBests.firstPark.date}`}
            />
          )}
          {stats.firstsAndBests.highestElevationDay && (
            <LabelValue
              label="Most Elevation Gained in a Day"
              value={`${formatElevation(stats.firstsAndBests.highestElevationDay.elevation)} — ${stats.firstsAndBests.highestElevationDay.date}`}
            />
          )}
        </StatsCard>
      )}

      {stats.style && (
        <StatsCard>
          <CardTitle>Style & Terrain</CardTitle>
          <LabelValue
            label="Average Elevation per Mile"
            value={`${formatElevation(stats.style.averageElevationPerMile)}`}
          />
          <LabelValue
            label="Typical Trail Length"
            value={`${formatDistance(stats.style.typicalTrailLength)}`}
          />
          {stats.style.favoritePark && (
            <LabelValue
              label="Favorite Park"
              value={stats.style.favoritePark}
            />
          )}
        </StatsCard>
      )}

      <SectionTitle>Performance Over Time</SectionTitle>
      <PerformanceGrid>
        {performanceStats.daily && (
          <PerformanceCard
            title="Daily Distance"
            current={performanceStats.daily.current}
            previous={performanceStats.daily.previous}
            changePercent={performanceStats.daily.changePercent}
          />
        )}
        {performanceStats.weekly && (
          <PerformanceCard
            title="Weekly Distance"
            current={performanceStats.weekly.current}
            previous={performanceStats.weekly.previous}
            changePercent={performanceStats.weekly.changePercent}
          />
        )}
        {performanceStats.monthly && (
          <PerformanceCard
            title="Monthly Distance"
            current={performanceStats.monthly.current}
            previous={performanceStats.monthly.previous}
            changePercent={performanceStats.monthly.changePercent}
          />
        )}
        {performanceStats.yearly && (
          <PerformanceCard
            title="Yearly Distance"
            current={performanceStats.yearly.current}
            previous={performanceStats.yearly.previous}
            changePercent={performanceStats.yearly.changePercent}
          />
        )}
      </PerformanceGrid>
    </PageWrapper>
  );
}

export default StatsPage;

///////////////////////////
// Styled Components
///////////////////////////

const PageWrapper = styled.div`
  padding: 2rem;
  font-family: "Roboto", sans-serif;

  background-image:
    linear-gradient(
      to bottom,
      rgba(0, 150, 200, 0.35) 0%,
      rgba(0, 180, 160, 0.25) 15%,
      rgba(0, 200, 150, 0.12) 30%,
      rgba(0, 200, 150, 0) 40%
    ),
    url("./badges/logo10.jpeg");
  border-radius: 12px;
  background-position: center;
  background-size: auto, 50vw;
  background-repeat: no-repeat;
  background-attachment: scroll, fixed;

  max-width: 1100px;
  margin: 0 auto;

  @media (max-width: 900px) {
    background-size: auto, 60vw;
  }

  @media (max-width: 600px) {
    background-size: auto, 70vw;
    background-position:
      center,
      center 50%;
  }

  @media (max-width: 420px) {
    background-size: auto, 80vw;
    background-position:
      center,
      center 50%;
  }
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  color: rgb(0, 94, 12);
  background: rgba(191, 255, 234, 0.5);
  padding-top: 20px;
  padding-bottom: 20px;
  margin-bottom: 2rem;
  text-align: center;
`;

const StatsCard = styled.div<{ highlight?: boolean }>`
  background: ${(props) =>
    props.highlight
      ? "rgba(253, 246, 240, 0.85)"
      : "rgba(255, 255, 255, 0.85)"};
  border: 2px solid
    ${(props) => (props.highlight ? "rgb(78,38,12)" : "rgb(0,94,12)")};
  border-radius: 12px;
  padding: 1.8rem;
  padding-top: 0.5rem;
  margin-bottom: 1.8rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  }
`;

const CardTitle = styled.h3`
  font-size: 1.6rem;
  color: inherit;
  margin-bottom: 1rem;
  font-family: Permanent Marker;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  color: rgb(0, 94, 12);
  text-align: left;
  font-family: Rock Salt;
  background: rgba(191, 255, 234, 0.5);
  padding-top: 20px;
  padding-bottom: 20px;
  text-align: center;
`;

const PerformanceGrid = styled.div`
  display: grid;
  gap: 1.5rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const Centered = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
`;
