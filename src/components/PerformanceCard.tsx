// src/components/PerformanceCard.tsx
import { Card } from "antd";
import { formatDistance } from "./helpers/format";

type Props = {
  title: string;
  current: number;
  previous: number;
  changePercent: number | null;
};

export function PerformanceCard({
  title,
  current,
  previous,
  changePercent,
}: Props) {
  let trend = "➡️";
  let trendColor = "gray";

  if (changePercent !== null) {
    if (changePercent > 0) {
      trend = "↑";
      trendColor = "green";
    } else if (changePercent < 0) {
      trend = "↓";
      trendColor = "red";
    }
  }

  return (
    <Card
      style={{
        background: "rgba(255, 255, 255, 0.85)",
        marginBottom: 16,
        border: "2px solid rgb(0,94,12)",
      }}
    >
      <h3 style={{ marginBottom: 8 }}>{title}</h3>
      <p style={{ margin: 2 }}>
        This period: <strong>{formatDistance(current)}</strong>
      </p>
      <p style={{ margin: 2 }}>
        Last period: <strong>{formatDistance(previous)}</strong>{" "}
        {changePercent !== null && (
          <span style={{ color: trendColor, fontWeight: "bold" }}>
            ({changePercent.toFixed(0)}% {trend})
          </span>
        )}
      </p>
    </Card>
  );
}
