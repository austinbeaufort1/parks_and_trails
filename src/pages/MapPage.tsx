// src/pages/MapPage.tsx
import { Layout, Button } from "antd";
import TrailsMap from "../components/Map/TrailsMap";
import { TrailCard } from "../types/trail";
import { FiltersButton } from "../components/ui/Buttons";
import { EarnedToken } from "../components/TokenPopup";

const { Content } = Layout;

type MapPageProps = {
  trails: TrailCard[];
  selectedTrailId: string | null;
  onSelectTrail: (id: string | null) => void;
  onOpenFilters: () => void;
  tokens: EarnedToken[];
  refreshTokens: () => void;
};

const MapPage = ({
  trails,
  selectedTrailId,
  onSelectTrail,
  onOpenFilters,
  tokens,
  refreshTokens,
}: MapPageProps) => {
  return (
    <Content style={{ width: "100%", padding: 16 }}>
      {/* Button to open filters sidebar */}
      <div style={{ marginBottom: 12, textAlign: "right" }}>
        <FiltersButton onClick={onOpenFilters}>Filters</FiltersButton>
      </div>

      <TrailsMap
        trails={trails}
        selectedTrailId={selectedTrailId}
        onSelectTrail={onSelectTrail}
        style={{ width: "100%", height: "600px" }}
        tokens={tokens}
        refreshTokens={refreshTokens}
      />
    </Content>
  );
};

export default MapPage;
