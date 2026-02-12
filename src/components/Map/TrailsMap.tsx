import {
  MapContainer,
  TileLayer,
  Polyline,
  Tooltip,
  Marker,
  useMap,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { useRef, useEffect, useState } from "react";
import L from "leaflet";
import { Tag } from "../ui/Tag";

import { getColoredSegments } from "../helpers/trailSegments";
import { getAngleColor, getAngleDesc } from "../helpers/angle";
import { startMarkerIcon, completedMarkerIcon } from "../helpers/icons";
import { useTrailPoints } from "../../hooks/useTrailPoints";
import { useAuth } from "../AuthContext";
import { useUserCompletionsMap } from "../../hooks/useUserCompletionsMap";
import { useCompleteTrail } from "../../hooks/useCompleteTrail";
import { useUserStats } from "../../hooks/useUserStats";

import { Sidebar } from "../Sidebar";
import styled from "styled-components";
import { TrailCard } from "../../types/trail";
import { useLocation, Link } from "react-router-dom";
import {
  HomeOutlined,
  EnvironmentOutlined,
  CompassOutlined,
  BarChartOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { CardHeaderActions } from "../CardHeaderActions";
import { TrailSidebarContent } from "../TrailSidebarContent";
import { getDifficultyDescription } from "../helpers/difficulty";
import { formatDistance, metersToMiles } from "../helpers/format";
import { estimateTrailTime } from "../helpers/estimateTrailTime";
import { getAngleTag } from "../Table/getTagColor";
import { OverlayTrailPreview } from "../OverlayTrailPreview";
import { MapClickHandler } from "../helpers/mapClickHandler";
import { EarnedToken } from "../TokenPopup";
import { EarnedBadge } from "../Badges/BadgeQueue";
import { CompletionModal } from "../CompletionModal/CompletionModal";
import { processRewards } from "../helpers/Rewards/processRewards";
import { BadgeQueue } from "../Badges/BadgeQueue";
import { TokenPopup } from "../TokenPopup";
import { initialFormData } from "../TrailsPage/TrailCard";
import { parseEstimatedMinutes } from "../helpers/Rewards/tokens/utils";
import { updateTrailMemoryFromPayload } from "../helpers/updateTrailMemory";
import { FiltersButton, FiltersButton1100 } from "../ui/Buttons";

const LittleTag = styled(Tag)`
  padding: 3px;
`;

const NavLabel = styled.span`
  white-space: nowrap;
  @media (max-width: 768px) {
    display: none;
  }
`;

const TopNav = styled.nav`
  display: flex;
  gap: 16px;
  padding: 12px;
  border-bottom: 1px solid #eee;
  font-family: "Rock Salt";
`;

export const FloatingTopNav = styled(TopNav)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1002; /* above map */
  background: rgba(
    255,
    255,
    255,
    0.7
  ); /* slightly transparent to show map behind */
`;

// export const MapWrapper = styled.div`
//   position: relative;
//   width: 100vw;
//   height: calc(100vh - 60px); /* reduce full height a bit */
//   z-index: 0;
// `;

export const MapWrapper = styled.div`
  position: fixed;
  inset: 0; /* top:0 right:0 bottom:0 left:0 */
  width: 100vw;
  height: 100dvh;
  z-index: 0;
`;

type DrawerView = "trail" | "completion";

type TrailsMapProps = {
  trails: TrailCard[];
  selectedTrailId: string | null;
  onSelectTrail: (id: string | null) => void;
  tokens: EarnedToken[];
  refreshTokens: () => void;
  isTokensRefreshing: boolean;
  onOpenFilters: () => void;
};

function PanToSelectedTrail({
  points,
}: {
  points: { lat: number; lng: number }[];
}) {
  const map = useMap();

  useEffect(() => {
    if (!points || points.length === 0) return;

    const bounds = L.latLngBounds(
      points.map((p) => [p.lat, p.lng] as [number, number]),
    );
    map.flyToBounds(bounds, {
      padding: window.innerWidth < 768 ? [30, 30] : [60, 60],
      duration: 0.6,
    });
  }, [points, map]);

  return null;
}

const NavButton: React.FC<{
  to: string;
  icon: React.ReactNode;
  label: string;
}> = ({ to, icon, label }) => {
  const location = useLocation();
  const active = location.pathname === to;

  return (
    <Link
      to={to}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        color: active ? "#005e0c" : "#555",
        textDecoration: "none",
        fontWeight: active ? 600 : 400,
      }}
    >
      <span style={{ fontSize: 20 }}>{icon}</span>
      <NavLabel>{label}</NavLabel>
    </Link>
  );
};

export default function TrailsMap({
  trails,
  selectedTrailId,
  onSelectTrail,
  tokens,
  refreshTokens,
  isTokensRefreshing,
  onOpenFilters,
}: TrailsMapProps) {
  const { user } = useAuth();
  const mapRef = useRef<L.Map | null>(null);
  const [earnedBadges, setEarnedBadges] = useState<EarnedBadge[]>([]);
  const [earnedTokens, setEarnedTokens] = useState<EarnedToken[]>([]);
  // const [earnedQuests, setEarnedQuests] = useState<QuestEvent[]>([]);

  const { completeTrail, updateTrailTokens } = useCompleteTrail();

  const selectedTrail = trails.find((t) => t.id === selectedTrailId);
  const { points: selectedPoints } = useTrailPoints(selectedTrailId);

  const { completionsMap, refresh: refreshCompletions } = useUserCompletionsMap(
    user?.id ?? null,
  );
  const { refresh: refreshStats } = useUserStats(user?.id);

  const [overlayTrail, setOverlayTrail] = useState<TrailCard | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const count = selectedTrail?.id ? completionsMap[selectedTrail?.id] : 0;
  const totalCompletions = Object.values(completionsMap).reduce(
    (sum, val) => sum + val,
    0,
  );

  const timesCompletedAfter = totalCompletions + 1;
  const [drawerView, setDrawerView] = useState<DrawerView>("trail");
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const completionStyles: string[] = selectedTrail?.details || [];
  const trailTime = estimateTrailTime(
    selectedTrail?.total_distance_m ?? 0,
    selectedTrail?.avg_angle ?? 0,
    selectedTrail?.difficulty_score ?? 0,
    selectedTrail?.landcover_percentages,
  );
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (selectedTrail) {
      setOverlayTrail(selectedTrail);
      setSidebarOpen(false);
    } else {
      setOverlayTrail(null);
      setSidebarOpen(false);
    }
  }, [selectedTrail]);

  return (
    <>
      <BadgeQueue badges={earnedBadges} onFinish={() => setEarnedBadges([])} />
      <TokenPopup
        tokens={earnedTokens} // <-- your state with new tokens earned
        onClose={() => setEarnedTokens([])} // clears popup when dismissed
      />
      {/* <QuestPopup events={earnedQuests} onClose={() => setEarnedQuests([])} /> */}

      <MapWrapper>
        {/* Button to open filters sidebar */}
        <div style={{ marginBottom: 12, textAlign: "right" }}>
          <FiltersButton1100 onClick={onOpenFilters}>Filters</FiltersButton1100>
        </div>
        <FloatingTopNav>
          <NavButton to="/" icon={<HomeOutlined />} label="Home" />
          <NavButton to="/map" icon={<EnvironmentOutlined />} label="Map" />
          <NavButton to="/trails" icon={<CompassOutlined />} label="Trails" />
          {user && (
            <NavButton to="/stats" icon={<BarChartOutlined />} label="Stats" />
          )}
          {user && (
            <NavButton to="/badges" icon={<TrophyOutlined />} label="Badges" />
          )}
        </FloatingTopNav>
        <MapContainer
          center={[40.318, -79.475]}
          zoom={8}
          ref={mapRef}
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapClickHandler
            sidebarOpen={sidebarOpen}
            overlayTrail={overlayTrail}
            onCloseSidebar={() => setSidebarOpen(false)}
            onDeselectTrail={() => onSelectTrail(null)}
          />
          {selectedTrail && selectedPoints.length > 0 && (
            <>
              <PanToSelectedTrail points={selectedPoints} />
              {getColoredSegments(selectedPoints).map((seg, i) => (
                <Polyline
                  key={`seg-${i}`}
                  positions={seg.positions}
                  pathOptions={{ color: seg.color, weight: 8, opacity: 1 }}
                >
                  <Tooltip>
                    {`Angle: ${seg.slope.toFixed(1)}° (${getAngleDesc(
                      seg.slope,
                    )})`}
                  </Tooltip>
                </Polyline>
              ))}
            </>
          )}

          {selectedTrail && selectedPoints.length === 0 && (
            <div>Loading trail...</div>
          )}

          <MarkerClusterGroup>
            {trails.map((trail) => {
              const completionsCount = completionsMap[trail.id] ?? 0;
              return (
                <Marker
                  key={trail.id}
                  position={[trail.start_lat, trail.start_lng]}
                  icon={
                    completionsCount > 0
                      ? completedMarkerIcon(completionsCount)
                      : startMarkerIcon()
                  }
                  eventHandlers={{ click: () => onSelectTrail(trail.id) }}
                />
              );
            })}
          </MarkerClusterGroup>
        </MapContainer>

        {/* Completion Modal */}
        {user && (
          <CompletionModal
            open={completeModalOpen}
            onClose={() => setCompleteModalOpen(false)}
            trailId={selectedTrailId ?? "0"}
            userId={user.id}
            estimatedTime={trailTime}
            formData={formData}
            setFormData={setFormData}
            onCompleted={async (payload) => {
              try {
                // 1️⃣ Complete trail first (no tokens)
                await completeTrail(user.id, selectedTrailId ?? "0", payload);

                // 2️⃣ Calculate rewards (tokens + badges)
                const newRewards = await processRewards({
                  userId: user.id,
                  trailId: selectedTrailId ?? "0",
                  trailDistance: selectedTrail?.total_distance_m ?? 0,
                  payload,
                  timesCompleted: timesCompletedAfter,
                  formData,
                  estimatedTimeMins: parseEstimatedMinutes(trailTime),
                  trail: trails.filter((trail) => trail.id === selectedTrailId),
                  mode: "reward",
                });

                // 3️⃣ Update the completion row with earned tokens
                await updateTrailTokens(
                  user.id,
                  selectedTrailId ?? "0",
                  newRewards.tokens,
                );

                // 4️⃣ Update trail memory / details
                await updateTrailMemoryFromPayload(
                  selectedTrailId ?? "0",
                  payload,
                );

                // 5️⃣ Update UI / state
                setEarnedBadges(newRewards.badges);
                setEarnedTokens(newRewards.tokens);
                refreshTokens();
                refreshCompletions();
                refreshStats();
                setFormData(initialFormData);
              } catch (err: any) {
                console.error("Error completing trail:", err);
              }
            }}
          />
        )}

        {overlayTrail && !sidebarOpen && (
          <OverlayTrailPreview
            trail={overlayTrail}
            trailTime={trailTime}
            setSidebarOpen={setSidebarOpen}
            setDrawerView={setDrawerView}
          />
        )}

        {selectedTrail && (
          <Sidebar
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            mapMode
            title={selectedTrail.title}
            header={
              <CardHeaderActions
                count={count}
                user={user}
                trail={selectedTrail}
                setDrawerView={setDrawerView}
                tokens={tokens}
                refreshTokens={refreshTokens}
                drawerView={drawerView}
                setSidebarOpen={setSidebarOpen}
                setCompleteModalOpen={setCompleteModalOpen}
                variant="sidebar" // 👈 if you add layout variants
              />
            }
          >
            <TrailSidebarContent
              drawerView={drawerView}
              trail={selectedTrail}
              user={user}
              count={count}
              completionStyles={completionStyles}
              tokens={tokens}
              refreshTokens={refreshTokens}
            />
          </Sidebar>
        )}
      </MapWrapper>
    </>
  );
}
