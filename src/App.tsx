// src/App.tsx
import { useEffect, useState } from "react";
import { LeafletMarkerStyles } from "./components/ui/LeafletMarkers";
import { LeafletClusterStyles } from "./components/ui/LeafletClusterStyles";
import styled from "styled-components";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
  Link,
} from "react-router-dom";
import { useAuth } from "./components/AuthContext";
import Home from "./pages/Home";
import MapPage from "./pages/MapPage";
import { TrailListPage } from "./pages/TrailListPage";
import StatsPage from "./pages/StatsPage";
import RewardsPage from "./pages/RewardsPage";
import { useTrails } from "./hooks/useTrails";
import { useTrailFilters } from "./hooks/useTrailFilters";
import { FilterSidebar } from "./components/FilterSidebar";
import { useTrailTokens } from "./hooks/useTrailTokens";
import UpdatesPage from "./pages/UpdatesPage";

import {
  HomeOutlined,
  EnvironmentOutlined,
  CompassOutlined,
  BarChartOutlined,
  TrophyOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { UserTrailCombosPage } from "./pages/TrailCombosPage";
import { LoadSpinner } from "./components/Loader";
import { FullLoadSpinner } from "./components/FullLoadSpinner";
import Contact from "./pages/Contact";

const STORAGE_KEY = "activeRoute";

function App() {
  const mapLocation = useLocation();
  const isMapPage = mapLocation.pathname === "/map";
  const { user } = useAuth();
  const { trails, loading: isTrailsFetching, error } = useTrails();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedTrailId, setSelectedTrailId] = useState<string | null>(null);
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false);
  const {
    tokens,
    loading: isTokensRefreshing,
    refresh: refreshTokens,
  } = useTrailTokens(user?.id, selectedTrailId ?? undefined);

  // ===== Use hook for filters =====
  const { filters, setFilters, filteredTrails, resetFilters } =
    useTrailFilters(trails);

  // Persist last route
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, location.pathname);
  }, [location.pathname]);

  // Restore last route on load
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && saved !== location.pathname) {
      navigate(saved);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <p style={{ color: "red" }}>Error: {error}</p>
      </div>
    );
  }

  return (
    <>
      {" "}
      <LeafletMarkerStyles />
      <LeafletClusterStyles />
      <AppContainer>
        {/* ===== DESKTOP TOP NAV ===== */}
        {!isMapPage && (
          <TopNav>
            <NavButton to="/" icon={<HomeOutlined />} label="Home" />
            <NavButton to="/map" icon={<EnvironmentOutlined />} label="Map" />
            <NavButton to="/trails" icon={<CompassOutlined />} label="Trails" />
            {user && (
              <NavButton
                to="/stats"
                icon={<BarChartOutlined />}
                label="Stats"
              />
            )}
            {user && (
              <NavButton
                to="/badges"
                icon={<TrophyOutlined />}
                label="Badges"
              />
            )}
            <NavButton
              to="/contact"
              icon={<MessageOutlined />}
              label="Contact Us"
            />
          </TopNav>
        )}

        {/* ===== ROUTES ===== */}
        <Routes>
          <Route path="/" element={<Home trails={trails} />} />
          <Route path="/combos" element={<UserTrailCombosPage />} />
          <Route
            path="/trails/:trailId/combos"
            element={<UserTrailCombosPage />}
          />
          <Route
            path="/map"
            element={
              <MapPage
                trails={filteredTrails}
                selectedTrailId={selectedTrailId}
                onSelectTrail={setSelectedTrailId}
                onOpenFilters={() => setFilterSidebarOpen(true)}
                tokens={tokens}
                refreshTokens={refreshTokens}
                isTokensRefreshing={isTokensRefreshing}
                isTrailsFetching={isTrailsFetching}
              />
            }
          />

          <Route
            path="/trails"
            element={
              <TrailListPage
                trails={trails}
                filteredTrails={filteredTrails}
                filters={filters}
                loading={isTrailsFetching}
                error={error}
                onViewMap={(id) => {
                  setSelectedTrailId(id);
                  navigate("/map");
                }}
                onOpenFilters={() => setFilterSidebarOpen(true)}
              />
            }
          />

          <Route path="/updates" element={<UpdatesPage />} />
          <Route path="/contact" element={<Contact />} />

          {user && <Route path="/stats" element={<StatsPage />} />}
          {user && (
            <Route path="/badges" element={<RewardsPage userId={user.id} />} />
          )}

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        {/* ===== FILTER SIDEBAR ===== */}
        <FilterSidebar
          open={filterSidebarOpen}
          onClose={() => setFilterSidebarOpen(false)}
          trails={trails}
          filters={filters}
          setFilters={setFilters}
          onReset={resetFilters}
        />

        {/* ===== MOBILE BOTTOM NAV ===== */}
        {!isMapPage && <BottomNav user={user} />}
      </AppContainer>
    </>
  );
}

// ================= NAV COMPONENTS =================
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

const BottomNav: React.FC<{ user: any }> = ({ user }) => {
  const location = useLocation();
  const items = [
    { to: "/", icon: <HomeOutlined /> },
    { to: "/map", icon: <EnvironmentOutlined /> },
    { to: "/trails", icon: <CompassOutlined /> },
    ...(user ? [{ to: "/stats", icon: <BarChartOutlined /> }] : []),
    ...(user ? [{ to: "/badges", icon: <TrophyOutlined /> }] : []),
    { to: "/contacts", icon: <MessageOutlined /> },
  ];

  return (
    <BottomNavContainer>
      {items.map((i) => (
        <Link
          key={i.to}
          to={i.to}
          style={{
            color: location.pathname === i.to ? "#005e0c" : "#888",
            fontSize: 22,
          }}
        >
          {i.icon}
        </Link>
      ))}
    </BottomNavContainer>
  );
};

// ================= STYLED =================
// const AppContainer = styled.div`
//   min-height: 100vh;
//   padding-bottom: 64px;
// `;

const AppContainer = styled.div`
  min-height: 100vh;
  padding-bottom: 64px;

  /* Move Leaflet zoom buttons below the top navbar on map page */
  .leaflet-control-zoom {
    top: 60px !important; /* adjust to match your map navbar height */
    left: 10px; /* default left padding */
  }

  /* Optional: adjust for smaller mobile screens */
  @media (max-width: 768px) {
    .leaflet-control-zoom {
      top: 50px !important; /* slightly smaller top offset on mobile */
    }
  }
`;

const TopNav = styled.nav`
  width: 100%;
  display: flex;
  justify-content: start; /* 🔑 always center nav items */
  gap: 16px;
  padding: 12px;
  border-bottom: 1px solid #eee;
  font-family: "Rock Salt";
  background: #ffffff;
`;

const NavLabel = styled.span`
  white-space: nowrap;
  @media (max-width: 768px) {
    display: none;
  }
`;

const BottomNavContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  padding: 8px;
  background: #fff;
  border-top: 1px solid #eee;
`;

export default App;
