import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { useUserTrailCombos } from "../hooks/useUserTrailCombos";
import { buildTopCombos } from "../components/helpers/Rewards/badgeCombos";
import { Tag, Tooltip, Select } from "antd";
import styled from "styled-components";

const { Option } = Select;

/* 🌿 Nature palette */
const NATURE_THEME = {
  bgPage: "#f0fdf4",
  bgCard: "#ecfdf5",
  bgHover: "#d1fae5",
  border: "#a7f3d0",
  textPrimary: "#064e3b",
  textSecondary: "#355f4b",
};

/* Nature-inspired token colors */
const NATURE_COLORS: Record<string, string> = {
  "🏋️": "#4d7c0f",
  "🌧️": "#2563eb",
  "🌙": "#6b21a8",
  "🪨": "#713f12",
  "🦉": "#78350f",
  "🦵": "#047857",
  "🥎": "#ca8a04",
  "🎪": "#b45309",
  default: "#74624e",
};

const PageWrapper = styled.div`
  padding: 1.25rem;
  max-width: 720px;
  margin: 0 auto;
  min-height: 100vh;
  font-family: "Segoe UI", sans-serif;
  background: ${NATURE_THEME.bgPage};
`;

const Title = styled.h2`
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: ${NATURE_THEME.textPrimary};
`;

const ControlsWrapper = styled.div`
  margin-bottom: 1rem;
`;

const ComboRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  padding: 0.65rem 0.75rem;
  border-radius: 14px;

  background: ${NATURE_THEME.bgCard};
  border: 1px solid ${NATURE_THEME.border};

  transition: all 0.2s ease;

  &:hover {
    background: ${NATURE_THEME.bgHover};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(6, 78, 59, 0.12);
  }
`;

const TokensWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
`;

const ComboCount = styled.span`
  margin-left: auto;
  font-weight: 600;
  color: ${NATURE_THEME.textSecondary};
`;

export const UserTrailCombosPage = () => {
  const { trailId } = useParams<{ trailId: string }>();
  const { user } = useAuth();
  const [sortBy, setSortBy] = useState<"frequency" | "size">("frequency");
  const [trailTitle, setTrailTitle] = useState("");

  const {
    rows: completionsRows,
    loading,
    refresh: refreshTrailCombos,
  } = useUserTrailCombos(trailId ?? null, user?.id ?? null);

  // ✅ Set trail title after data loads
  useEffect(() => {
    if (trailId && completionsRows.length > 0) {
      setTrailTitle(completionsRows[0].trail_title ?? "");
    }
  }, [trailId, completionsRows]);

  if (loading) return <PageWrapper>Loading combos…</PageWrapper>;
  if (!completionsRows.length)
    return <PageWrapper>No combos yet for this trail.</PageWrapper>;

  const validCompletions = completionsRows
    .map((row) => {
      let tokens: string[] = [];
      if (row.completion_tokens) {
        if (typeof row.completion_tokens === "string") {
          try {
            tokens = JSON.parse(row.completion_tokens);
          } catch {
            tokens = [];
          }
        } else if (Array.isArray(row.completion_tokens)) {
          tokens = row.completion_tokens;
        }
      }
      return { completion_tokens: tokens };
    })
    .filter((row) => row.completion_tokens.length >= 2);

  const allCombos = buildTopCombos(validCompletions, 999);

  if (sortBy === "frequency") {
    allCombos.sort((a, b) => b.count - a.count);
  } else {
    allCombos.sort((a, b) => b.tokens.length - a.tokens.length);
  }

  return (
    <PageWrapper>
      <Title>
        {trailId ? `Combos for ${trailTitle}` : "Your combos across all trails"}
      </Title>

      <ControlsWrapper>
        <Select
          value={sortBy}
          onChange={(val) => setSortBy(val)}
          size="small"
          style={{
            width: 220,
            backgroundColor: NATURE_THEME.bgCard,
            borderRadius: 8,
          }}
        >
          <Option value="frequency">Most Frequent Combos</Option>
          <Option value="size">Biggest Combos</Option>
        </Select>
      </ControlsWrapper>

      {allCombos.map((combo) => (
        <ComboRow key={combo.key}>
          <TokensWrapper>
            {combo.tokens.map((t) => (
              <Tooltip key={t} title={t} placement="top">
                <Tag
                  color={NATURE_COLORS[t] || NATURE_COLORS.default}
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    borderRadius: "999px",
                    padding: "0 8px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {t}
                </Tag>
              </Tooltip>
            ))}
          </TokensWrapper>
          <ComboCount>×{combo.count}</ComboCount>
        </ComboRow>
      ))}
    </PageWrapper>
  );
};
