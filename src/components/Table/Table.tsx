import "../../App.css";
import React from "react";
import { Table, Columns } from "antd";
import { Tag } from "../ui/Tag";
import { ColumnType } from "antd/es/table";
import { TrailView } from "../Map/TrailsMap";
import { getDifficultyTag, getAngleTag } from "./getTagColor";
import { AngleDesc } from "../../types/angle";
import { tableColors } from "../../types/uicolors";

function getAngleDesc(angle: number): AngleDesc {
  if (angle < 1) return "Flat";
  if (angle < 2) return "Nearly Flat";
  if (angle < 4) return "Gentle Slopes";
  if (angle < 8) return "Moderate";
  if (angle < 12) return "Moderately Steep";
  if (angle < 20) return "Steep";
  if (angle < 28) return "Very Steep";
  return "Terrifying";
}

/* --------------------------------------------------
   Table Columns
-------------------------------------------------- */
const columns: ColumnType<TrailView>[] = [
  {
    title: "State",
    dataIndex: ["meta", "state"],
    key: "state",
    responsive: ["xs", "sm", "md", "lg", "xl"],
    render: (text: string) => ({
      props: { style: { background: tableColors.lightGreen } },
      children: <div>{text}</div>,
    }),
  },
  {
    title: "County",
    dataIndex: ["meta", "county"],
    key: "county",
    responsive: ["sm", "md", "lg", "xl"],
    render: (text: string) => ({
      props: { style: { background: tableColors.lightestGreen } },
      children: <div>{text}</div>,
    }),
  },
  {
    title: "Park Name",
    dataIndex: ["meta", "parkName"],
    key: "parkName",
    responsive: ["sm", "md", "lg", "xl"],
    render: (text: string) => ({
      props: { style: { background: tableColors.lightGreen } },
      children: <div>{text}</div>,
    }),
  },
  {
    title: "Trail Name",
    dataIndex: ["meta", "title"],
    key: "trailName",
    render: (text: string, record: TrailView) => ({
      props: { style: { background: tableColors.lightestGreen } },
      children: <div>{text || record.key}</div>,
    }),
  },
  {
    title: "Explore!",
    dataIndex: ["meta", "video"],
    key: "videos",
    responsive: ["sm", "md", "lg", "xl"],
    render: (video: string) => ({
      props: { style: { background: tableColors.lightBlue } },
      children: video ? (
        <a href={video} target="_blank" rel="noreferrer">
          View Adventure
        </a>
      ) : (
        <span>—</span>
      ),
    }),
  },
  {
    title: "Distance (mi)",
    dataIndex: "distanceFeet",
    key: "distance",
    sorter: (a, b) => a.distanceFeet - b.distanceFeet,
    defaultSortOrder: "descend",
    render: (distanceFeet: number) => ({
      props: { style: { background: tableColors.lightBrown } },
      children: <div>{(distanceFeet / 5280).toFixed(2)}</div>,
    }),
  },
  {
    title: "Elevation Gain (ft)",
    dataIndex: "elevationGain",
    key: "elevationGain",
    sorter: (a, b) => a.elevationGain - b.elevationGain,
    defaultSortOrder: "descend",
    render: (ele: number) => ({
      props: { style: { background: tableColors.lightestBrown } },
      children: <div>{ele.toFixed(0)}</div>,
    }),
  },
  {
    title: "Difficulty",
    dataIndex: "difficultyScore",
    key: "difficulty",
    sorter: (a, b) => a.difficultyScore - b.difficultyScore,
    defaultSortOrder: "descend",
    render: (score: number) => ({
      props: { style: { background: tableColors.lightBrown } },
      children: <div>{score.toFixed(1)}</div>,
    }),
  },
  {
    title: "Difficulty Desc.",
    dataIndex: "difficultyDescription",
    key: "difficultyDesc",
    render: (text: string) => ({
      props: { style: { background: tableColors.lightestBrown } },
      // @ts-expect-error Tag children type issue
      children: <Tag color={getDifficultyTag(text)}>{text}</Tag>,
    }),
  },
  {
    title: "Avg Angle (deg)",
    dataIndex: "avgAngle",
    key: "angle",
    sorter: (a, b) => a.avgAngle - b.avgAngle,
    render: (angle: number) => ({
      props: { style: { background: tableColors.lightBrown } },
      children: <div>{angle.toFixed(1)}</div>,
    }),
  },
  {
    title: "Avg Angle Desc.",
    dataIndex: "avgAngle",
    key: "angleDesc",
    render: (angle: number) => ({
      props: { style: { background: tableColors.lightestBrown } },
      // @ts-expect-error Tag children type issue
      children: (
        <Tag color={getAngleTag(getAngleDesc(angle))}>
          {getAngleDesc(angle)}
        </Tag>
      ),
    }),
  },
  {
    title: "Tree Cover (%)",
    dataIndex: "avgCanopy",
    key: "canopy",
    responsive: ["md", "lg", "xl"],
    render: (canopy: number) => ({
      props: { style: { background: tableColors.lightBrown } },
      children: <div>{canopy}%</div>,
    }),
  },
  {
    title: "Landcover (%)",
    dataIndex: "landcoverPercentages",
    key: "landcoverPercentages",
    responsive: ["lg", "xl"],
    render: (lcs: { type: string; percent: number }[]) => ({
      props: { style: { background: tableColors.lightestBrown } },
      children: (
        <div>{lcs.map((lc) => `${lc.type} ${lc.percent}%`).join(", ")}</div>
      ),
    }),
  },
];

/* --------------------------------------------------
   Main Table Component
-------------------------------------------------- */
interface MainTableProps {
  trails: TrailView[];
}

const MainTable: React.FC<MainTableProps> = ({ trails }) => (
  <div style={{ overflowX: "auto" }}>
    <Table
      columns={columns as Columns}
      dataSource={trails}
      pagination={{ pageSize: 10 }}
      rowKey="key"
      expandable={{
        expandedRowRender: (trail: TrailView) => {
          const cruxPoint = trail.points.reduce(
            (max, p) => (p.slopeDeg > max.slopeDeg ? p : max),
            trail.points[0]
          );
          const cruxDistanceMiles = trail.distanceFeet / 5280; // simplified
          return (
            <div style={{ textAlign: "center" }}>
              <p style={{ margin: 0 }}>
                <strong>Description: </strong>
                {trail.meta?.description || "No description"}
              </p>

              {cruxDistanceMiles === 0 ? (
                <>
                  <p>
                    <strong>Most Difficult Part (Crux) of the Trail:</strong>
                  </p>
                  <p>No crux</p>
                </>
              ) : (
                <>
                  <p>
                    <strong>Most Difficult Part (Crux) of the Trail:</strong>
                  </p>
                  <Tag color={getAngleTag(cruxPoint.slopeDeg)}>
                    {cruxPoint.slopeDeg.toFixed(1)}
                  </Tag>
                  <p>Crux Distance: {cruxDistanceMiles.toFixed(2)} mi</p>
                  <p>Crux Angle: {cruxPoint.slopeDeg.toFixed(1)}°</p>
                </>
              )}
            </div>
          );
        },
      }}
    />
  </div>
);

export default MainTable;
