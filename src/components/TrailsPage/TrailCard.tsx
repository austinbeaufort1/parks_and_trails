import { useState, useRef, useEffect } from "react";
import { ActionButton } from "../ui/Buttons";
import { StyledCard as Card } from "../StyledCard";
import { formatDistance, formatElevation } from "../helpers/format";
import { TrailCard as TrailCardType } from "../../types/trail";
import { getDifficultyDescription } from "../helpers/difficulty";
import { useAuth } from "../AuthContext";
import { useUserCompletionsMap } from "../../hooks/useUserCompletionsMap";
import { useState as useLocalState } from "react";
import { useUserStats } from "../../hooks/useUserStats";
import { CompletionModal } from "../CompletionModal/CompletionModal";
import { estimateTrailTime } from "../helpers/estimateTrailTime";
import { TrailLocation } from "../ui/TrailLocation";
import { ParkName } from "../ui/ParkName";
import { TrailTitle } from "../ui/TrailTitle";
import { TrailDetails } from "../ui/TrailDetails";
import styled from "styled-components";
import { Sidebar } from "../SideBar";
import { BadgeQueue } from "../Badges/BadgeQueue";
import { useCompleteTrail } from "../../hooks/useCompleteTrail";
import { CardHeaderActions } from "../CardHeaderActions";
import { TrailSidebarContent } from "../TrailSidebarContent";
import { getAngleDesc, getAngleColor } from "../helpers/angle";
import { processRewards } from "../helpers/Rewards/processRewards";
import { EarnedBadge } from "../Badges/BadgeQueue";
import { TokenPopup, EarnedToken } from "../TokenPopup";
import { useTrailTokens } from "../../hooks/useTrailTokens";

type DrawerView = "trail" | "completion";

interface TrailCardProps {
  trail: TrailCardType;
  onViewMap: (trailId: string) => void;
}

export const initialFormData = {
  durationMinutes: null as number | null,
  weight: [] as string[],
  weightInputs: {} as Record<string, number>,
  movement: [] as string[],
  movementContinuity: null as "continuous" | "intermittent" | null,
  trailAdjacent: false,
  surfaceRule: null as string | null,
  perception: [] as string[],
  environment: [] as string[],
  windSpeed: null as number | null,
  tempHeat: null as number | null,
  tempCold: null as number | null,
  snowDepth: null as number | null,
  circusStunts: [] as string[],
  circusStuntsContinuity: null as "continuous" | "intermittent" | null,
  sports: [] as string[],
  sportsContinuity: null as "continuous" | "intermittent" | null,
  awkwardObject: "",
  otherWildlife: "",
};

export const TrailCard: React.FC<TrailCardProps> = ({ trail, onViewMap }) => {
  const { user } = useAuth();
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useLocalState(false);
  const [drawerView, setDrawerView] = useState<DrawerView>("trail");
  const [overflowOpen, setOverflowOpen] = useState(false);
  const overflowRef = useRef<HTMLDivElement>(null);
  const [earnedBadges, setEarnedBadges] = useState<EarnedBadge[]>([]);
  const [earnedTokens, setEarnedTokens] = useState<EarnedToken[]>([]);
  const { tokens, refresh: refreshTokens } = useTrailTokens(user?.id, trail.id);
  const [formData, setFormData] = useState(initialFormData);

  const { completeTrail } = useCompleteTrail();
  const { completionsMap, refresh: refreshCompletions } = useUserCompletionsMap(
    user?.id ?? null,
  );
  const { refresh: refreshStats } = useUserStats(user?.id);

  const count = completionsMap[trail.id] ?? 0;
  const timesCompletedAfter = count + 1;

  const trailTime = estimateTrailTime(
    trail.total_distance_m,
    trail.avg_angle,
    trail.difficulty_score,
    trail.landcover_percentages,
  );

  const completionStyles: string[] = trail.details || [];

  // Close overflow when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        overflowRef.current &&
        !overflowRef.current.contains(event.target as Node)
      ) {
        setOverflowOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <BadgeQueue badges={earnedBadges} onFinish={() => setEarnedBadges([])} />
      <TokenPopup
        tokens={earnedTokens} // <-- your state with new tokens earned
        onClose={() => setEarnedTokens([])} // clears popup when dismissed
      />

      <Card
        style={{
          marginBottom: 16,
          width: "100%",
          maxWidth: 480,
          minWidth: 0,
          border: "2px solid rgb(0, 94, 12)",
          boxShadow: "3px 3px 3px 3px rgba(0,0,0,0.2)",
          position: "relative",
          boxSizing: "border-box",
        }}
      >
        {/* Header: Checkmark left, overflow right */}
        <CardHeaderActions
          count={count}
          user={user}
          trail={trail}
          setDrawerView={setDrawerView}
          setSidebarOpen={setSidebarOpen}
          setCompleteModalOpen={setCompleteModalOpen}
          onViewMap={onViewMap}
        />

        {/* Trail Info */}
        <CardContent>
          <TrailLocation>
            {trail.county}, {trail.state}
          </TrailLocation>

          <ParkName>{trail.park_name}</ParkName>

          <TrailTitle>{trail.title}</TrailTitle>

          <TrailDetails>
            <span style={{ marginBottom: "-5px" }}>
              Difficulty: ({trail.difficulty_score}){" "}
              {getDifficultyDescription(trail.difficulty_score)}
            </span>
          </TrailDetails>

          <TrailDetails>
            <span>
              <i>Distance: {formatDistance(trail.total_distance_m)}</i>
            </span>
            {" · "}
            <span>
              <i>Est. {trailTime}</i>
            </span>
            <div
              style={{
                display: "flex",
                fontSize: "14px",
                marginTop: "-10px",
                marginBottom: "-10px",
              }}
            >
              <p
                style={{
                  borderBottom: `3px solid ${getAngleColor(trail.avg_angle)}`,
                  borderTop: `3px solid ${getAngleColor(trail.avg_angle)}`,
                  paddingLeft: "2px",
                  paddingRight: "2px",
                  marginRight: "10px",
                }}
              >
                Avg°: {getAngleDesc(trail.avg_angle)}
              </p>
              <p
                style={{
                  borderBottom: `3px solid ${getAngleColor(trail.max_angle)}`,
                  borderTop: `3px solid ${getAngleColor(trail.max_angle)}`,
                  paddingLeft: "2px",
                  paddingRight: "2px",
                }}
              >
                Max°: {getAngleDesc(trail.max_angle)}
              </p>
            </div>
            <span>
              <i>Elevation: {formatElevation(trail.elevation_gain_m)}</i>
            </span>
          </TrailDetails>

          {/* Primary action */}
          <ActionButton
            onClick={() => {
              setDrawerView("trail");
              setSidebarOpen(true);
            }}
          >
            View Details
          </ActionButton>
        </CardContent>

        {/* Completion Modal */}
        {user && (
          <CompletionModal
            open={completeModalOpen}
            onClose={() => setCompleteModalOpen(false)}
            trailId={trail.id}
            userId={user.id}
            estimatedTime={trailTime}
            formData={formData}
            setFormData={setFormData}
            onCompleted={async (payload) => {
              await completeTrail(user.id, trail.id, payload);

              const newRewards = await processRewards({
                userId: user.id,
                trailId: trail.id,
                trailDistance: trail.total_distance_m,
                payload,
                timesCompleted: timesCompletedAfter,
                formData,
              });

              setEarnedBadges(newRewards.badges);
              setEarnedTokens(newRewards.tokens);
              refreshTokens();
              refreshCompletions();
              refreshStats();
            }}
          />
        )}
      </Card>

      {/* Sidebar Drawer */}
      <Sidebar
        open={sidebarOpen}
        count={count}
        onClose={() => setSidebarOpen(false)}
        title={drawerView === "trail" ? "Trail Details" : "Completion Details"}
        header={
          <CardHeaderActions
            count={count}
            user={user}
            trail={trail}
            setDrawerView={setDrawerView}
            drawerView={drawerView}
            setSidebarOpen={setSidebarOpen}
            setCompleteModalOpen={setCompleteModalOpen}
            onViewMap={onViewMap}
            variant="sidebar" // 👈 if you add layout variants
          />
        }
      >
        <TrailSidebarContent
          drawerView={drawerView}
          trail={trail}
          user={user}
          count={count}
          completionStyles={completionStyles}
          tokens={tokens}
          refreshTokens={refreshTokens}
        />
      </Sidebar>
    </>
  );
};

const CardContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 0 12px 12px 12px;
`;
