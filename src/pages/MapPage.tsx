// src/pages/MapPage.tsx
import { Layout, Button } from "antd";
import TrailsMap from "../components/Map/TrailsMap";
import { TrailCard } from "../types/trail";
import { FiltersButton } from "../components/ui/Buttons";
import { EarnedToken } from "../components/TokenPopup";
import { LoadSpinner } from "../components/Loader";

const { Content } = Layout;

type MapPageProps = {
  trails: TrailCard[];
  selectedTrailId: string | null;
  onSelectTrail: (id: string | null) => void;
  onOpenFilters: () => void;
  tokens: EarnedToken[];
  refreshTokens: () => void;
  isTokensRefreshing: boolean;
  isTrailsFetching: boolean;
};

const MapPage = ({
  trails,
  selectedTrailId,
  onSelectTrail,
  onOpenFilters,
  tokens,
  refreshTokens,
  isTokensRefreshing,
  isTrailsFetching,
}: MapPageProps) => {
  if (isTrailsFetching)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center", // horizontal centering
          alignItems: "center", // vertical centering
          height: "60vh", // adjust so it’s roughly centered in the viewport
        }}
      >
        <LoadSpinner size={200} />
      </div>
    );

  return (
    <Content style={{ width: "100%", padding: 16 }}>
      <TrailsMap
        trails={trails}
        selectedTrailId={selectedTrailId}
        onSelectTrail={onSelectTrail}
        style={{ width: "100%", height: "600px" }}
        tokens={tokens}
        refreshTokens={refreshTokens}
        isTokensRefreshing={isTokensRefreshing}
        onOpenFilters={onOpenFilters}
      />
    </Content>
  );
};

export default MapPage;
