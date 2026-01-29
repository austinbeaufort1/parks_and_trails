import { formatDistance, formatElevation } from "../helpers/format";
import { LabelValue } from "../LabelValue";
import { EarnedToken } from "../TokenPopup";
import { TokenTag } from "../ui/Tag";
import Tooltip from "antd/lib/Tooltip";

interface CompletionDetailsPanelProps {
  count: number;
  distancePerCompletion: number;
  elevationPerCompletion: number;
  completionStyles?: string[];
  tokens: EarnedToken[];
}

export const CompletionDetailsPanel: React.FC<CompletionDetailsPanelProps> = ({
  count,
  distancePerCompletion,
  elevationPerCompletion,
  completionStyles = [],
  tokens = [],
}) => {
  if (count <= 0) return null;

  return (
    <div className="trail-completion-details">
      <LabelValue label="Completed" value={count + "x"} />
      <LabelValue
        label="Total Distance Walked"
        value={formatDistance(count * distancePerCompletion)}
      />
      <LabelValue
        label="Total Elevation Gained"
        value={formatElevation(count * elevationPerCompletion)}
      />

      {tokens.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <strong>Tokens Earned (Tap to View Description)</strong>
          <div
            style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}
          >
            {tokens.map((token) => (
              <Tooltip
                title={token.description}
                trigger={["hover", "click"]}
                placement="top"
              >
                <TokenTag color="#2e7d32">
                  {token.icon_emoji} {token.title}
                </TokenTag>
              </Tooltip>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
