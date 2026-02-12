import { Link } from "react-router-dom";
import { useUserTrailCombos } from "../../hooks/useUserTrailCombos";
import { useEffect } from "react";
import { TrailCard } from "../../types/trail";
import { useAuth } from "../AuthContext";
import { formatDistance, formatElevation } from "../helpers/format";
import { buildTopCombos } from "../helpers/Rewards/badgeCombos";
import { LabelValue } from "../LabelValue";
import { EarnedToken } from "../TokenPopup";
import { TokenTag } from "../ui/Tag";
import Tooltip from "antd/lib/Tooltip";
import { Flex } from "antd";

interface CompletionDetailsPanelProps {
  count: number;
  distancePerCompletion: number;
  elevationPerCompletion: number;
  completionStyles?: string[];
  tokens: EarnedToken[];
  distance_m: number;
  trail: TrailCard;
}

const tierOf = (t: EarnedToken) =>
  parseInt(t.title.match(/Tier (\d+)/)?.[1] || "0", 10);

const isDiscGolf = (t: EarnedToken) => /\bDisc Golf\b/.test(t.title);
const isSpeedToken = (t: EarnedToken) => t.title.startsWith("Swiftfoot");

/**
 * Logical identity for UI display.
 */
const tokenKey = (t: EarnedToken): string => {
  if (isDiscGolf(t)) return `disc-golf:tier-${tierOf(t)}`;
  if (t.title.startsWith("Familiar - ")) return `familiar:${t.title}`;
  if (isSpeedToken(t)) return `speed:${t.title}`;
  return `id:${t.id}`;
};

const uniqueByTokenKey = (tokens: EarnedToken[]) => {
  const map = new Map<string, EarnedToken>();
  for (const t of tokens) map.set(tokenKey(t), t);
  return Array.from(map.values());
};

export const CompletionDetailsPanel: React.FC<CompletionDetailsPanelProps> = ({
  count,
  distancePerCompletion,
  elevationPerCompletion,
  completionStyles = [],
  tokens = [],
  distance_m,
  trail,
}) => {
  const { user } = useAuth();
  // ✅ Call hook unconditionally with fallback nulls
  const {
    rows: completionsRows = [],
    loading: combosLoading,
    refresh: refreshTrailCombos,
  } = useUserTrailCombos(trail?.id ?? null, user?.id ?? null);

  useEffect(() => {
    if (!tokens.length) return;
    refreshTrailCombos();
  }, [tokens.length, refreshTrailCombos]);

  if (count <= 0) return null;

  // Build top combos safely
  const validCompletions = completionsRows
    .map((row) => {
      let tokens: string[] = [];
      if (row.completion_tokens) {
        try {
          tokens = JSON.parse(row.completion_tokens);
        } catch {
          console.warn(
            "Failed to parse completion_tokens:",
            row.completion_tokens,
          );
          tokens = [];
        }
      }
      return { completion_tokens: tokens };
    })
    .filter((row) => row.completion_tokens.length >= 2); // only combos with 2+ tokens

  const topCombos = buildTopCombos(validCompletions);

  // const topCombos = buildTopCombos(completionsRows);

  // --- Familiar (highest tier)
  const highestFamiliarToken = tokens
    .filter((t) => t.title.startsWith("Familiar - "))
    .sort((a, b) => tierOf(a) - tierOf(b))
    .at(-1);

  // --- Load Class
  const loadStyles = [
    "Pack Hauler",
    "Front Loader",
    "Overhead Operator",
    "Vest Bound",
    "Balance Tested",
    "Awkward Advantage",
  ];
  const highestLoadTokens = loadStyles
    .map((style) =>
      tokens
        .filter((t) => t.title.startsWith(`${style} - Load Class`))
        .sort((a, b) => tierOf(a) - tierOf(b))
        .at(-1),
    )
    .filter(Boolean) as EarnedToken[];

  // --- Circus
  const highestCircusTokens: EarnedToken[] = [];
  const jugglingGroups: Record<string, EarnedToken[]> = {};
  for (const t of tokens.filter((t) => t.title.startsWith("Juggling -"))) {
    const balls = t.title.match(/(\d+) Balls/)?.[1];
    if (!balls) continue;
    jugglingGroups[balls] ??= [];
    jugglingGroups[balls].push(t);
  }
  for (const group of Object.values(jugglingGroups)) {
    highestCircusTokens.push(
      group.sort((a, b) => tierOf(a) - tierOf(b)).at(-1)!,
    );
  }
  const otherCircusStyles = [
    "Unicycling",
    "Handstand Walk",
    "Stilt Walking",
    "Poi Spinning",
    "Staff Spinning",
    "Hula Hooping",
    "Slacklining",
  ];
  for (const style of otherCircusStyles) {
    const best = tokens
      .filter((t) => t.title.startsWith(style))
      .sort((a, b) => tierOf(a) - tierOf(b))
      .at(-1);
    if (best) highestCircusTokens.push(best);
  }

  // --- Sports
  const bestDiscGolf = tokens
    .filter(isDiscGolf)
    .sort((a, b) => tierOf(a) - tierOf(b))
    .at(-1);
  const otherSports = [
    "Soccer Dribble",
    "Basketball Dribble",
    "Hockey Control",
    "Lacrosse Cradle",
    "Paddle Ball Bounce",
    "Baseball Glove Carry",
  ];
  const otherSportTokens = otherSports
    .map((sport) => tokens.filter((t) => t.title.startsWith(sport)).at(-1))
    .filter(Boolean) as EarnedToken[];

  // --- Speed Tokens
  const highestSpeedToken = tokens
    .filter(isSpeedToken)
    .sort((a, b) => {
      const aFactor = parseFloat(a.metadata?.speedFactor ?? "0");
      const bFactor = parseFloat(b.metadata?.speedFactor ?? "0");
      return aFactor - bFactor;
    })
    .at(-1);

  // --- Final token list
  const tokensToDisplay = uniqueByTokenKey([
    ...(highestFamiliarToken ? [highestFamiliarToken] : []),
    ...highestLoadTokens,
    ...highestCircusTokens,
    ...(bestDiscGolf ? [bestDiscGolf] : []),
    ...otherSportTokens,
    ...(highestSpeedToken ? [highestSpeedToken] : []),
  ]);

  const displayedKeys = new Set(tokensToDisplay.map(tokenKey));

  const leftovers = tokens.filter((t) => !displayedKeys.has(tokenKey(t)));

  tokensToDisplay.push(...leftovers);

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

      {tokensToDisplay.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <strong>Imprints (What the trail noticed about you)</strong>
          <div
            style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}
          >
            {tokensToDisplay.map((token) => (
              <Tooltip
                key={tokenKey(token)}
                title={token.description}
                trigger={["hover", "click"]}
                placement="top"
              >
                <TokenTag color={isSpeedToken(token) ? "#1565c0" : "#2e7d32"}>
                  {token.icon_emoji} {token.title}
                  {isSpeedToken(token) && token.metadata?.speedFactor
                    ? ` ×${token.metadata.speedFactor}`
                    : ""}
                </TokenTag>
              </Tooltip>
            ))}
          </div>

          {topCombos.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <div>
                <strong>Combos</strong>
              </div>
              <Flex style={{ gap: "8px", flexWrap: "wrap" }}>
                <Link
                  to={`/trails/${trail.id}/combos`}
                  style={{
                    fontSize: 12,
                    marginTop: 4,
                    display: "inline-block",
                    padding: "4px 8px",
                    border: "1px solid #005e0c", // dark green border like your cards
                    borderRadius: 4,
                    textDecoration: "none",
                    color: "#005e0c",
                    transition: "all 0.2s",
                  }}
                >
                  Trail Combos →
                </Link>

                <Link
                  to={`/combos`}
                  style={{
                    fontSize: 12,
                    marginTop: 4,
                    display: "inline-block",
                    padding: "4px 8px",
                    border: "1px solid #005e0c",
                    borderRadius: 4,
                    textDecoration: "none",
                    color: "#005e0c",
                    transition: "all 0.2s",
                  }}
                >
                  All Combos →
                </Link>
              </Flex>
              <h5 style={{ marginTop: "10px", marginBottom: 0 }}>
                Most Frequent Combos on this Trail
              </h5>
              <div style={{ marginTop: 6 }}>
                {topCombos.map((combo) => (
                  <div
                    key={combo.key}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 12,
                      marginBottom: 4,
                    }}
                  >
                    <span
                      style={{ borderBottom: "1px solid black", width: "100%" }}
                    >
                      {combo.tokens.map((t) => `[${t}]`).join(" + ")}
                    </span>
                    <span style={{ opacity: 0.7 }}>×{combo.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
