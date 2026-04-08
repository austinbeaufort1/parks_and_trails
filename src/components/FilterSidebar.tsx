// src/components/FilterSidebar.tsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Sidebar } from "./Sidebar";
import { TrailCard as TrailCardType } from "../types/trail";
import { TrailFilters } from "../types/filters";
import { getDifficultyDescription } from "./helpers/difficulty";
import { getAngleDesc } from "./helpers/angle";
import { Button, CloudButton } from "./ui/Buttons";
import { Select, Slider, Tag } from "antd";

const { CheckableTag } = Tag;

const Section = styled.div`
  margin-bottom: 16px;
  width: 80%;
  margin-left: auto;
  margin-right: auto;
`;

const Label = styled.label`
  font-weight: 600;
  font-size: 14px;
  display: block;
  margin-bottom: 4px;
`;

interface Props {
  trails: TrailCardType[];
  filters: TrailFilters;
  setFilters: (filters: TrailFilters) => void;
  open: boolean;
  onClose: () => void;
  onReset: () => void;
}

const METERS_TO_MILES = 0.000621371;
const METERS_TO_FEET = 3.28084;

export const FilterSidebar: React.FC<Props> = ({
  trails,
  filters,
  setFilters,
  open,
  onClose,
  onReset,
}) => {
  const [showAllTags, setShowAllTags] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  const unique = <T,>(arr: T[]) => Array.from(new Set(arr));

  // ✅ your tags source
  const tags = [...new Set(trails.flatMap((trail) => trail.tags))];

  const elevationRangeFeet: [number, number] = [
    filters.elevationRange[0] * METERS_TO_FEET,
    filters.elevationRange[1] * METERS_TO_FEET,
  ];

  const distanceRangeMiles: [number, number] = [
    filters.distanceRange[0] * METERS_TO_MILES,
    filters.distanceRange[1] * METERS_TO_MILES,
  ];

  const maxDistanceMiles = trails.length
    ? Math.max(...trails.map((t) => t.total_distance_m)) * METERS_TO_MILES
    : 50;

  const maxElevationFeet = trails.length
    ? Math.max(...trails.map((t) => t.elevation_gain_m)) * METERS_TO_FEET
    : 10000;

  const TAG_GROUPS: Record<string, string[]> = {
    lake: ["lake_view", "lake_adjacent", "lake_loop"],
    river: ["river_view", "river_adjacent", "river_loop"],
    stream: ["stream_view", "stream_adjacent", "stream_loop"],
  };

  // close dropdown on outside click
  useEffect(() => {
    const handleClick = () => setOpenGroup(null);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return (
    <Sidebar open={open} onClose={onClose} title="Filter Trails">
      <StickyFooter>
        <CloudButton
          onClick={onReset}
          style={{
            padding: "5px 20px",
            fontSize: "1rem",
            fontFamily: "Patrick Hand",
          }}
        >
          Clear Filters
        </CloudButton>
      </StickyFooter>
      {/* ===== TRAIL TAGS (NEW) ===== */}
      <Section>
        <Label>
          Tags {filters.tags.length > 0 && `(${filters.tags.length})`}
        </Label>

        {(() => {
          const commonTags = ["hike", "walk"];
          const otherTags = tags
            .filter((t) => !commonTags.includes(t))
            .sort((a, b) => a.localeCompare(b));
          const sortedTags = [
            ...commonTags.filter((t) => tags.includes(t)), // only if present
            ...otherTags,
          ];

          const visibleTags = showAllTags
            ? sortedTags
            : sortedTags.slice(0, 10);

          return (
            <>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {visibleTags.map((tag) => {
                  const checked = filters.tags.includes(tag);

                  return (
                    <CheckableTag
                      key={tag}
                      checked={checked}
                      onChange={(isChecked) => {
                        setFilters({
                          ...filters,
                          tags: isChecked
                            ? [...filters.tags, tag]
                            : filters.tags.filter((t) => t !== tag),
                        });
                      }}
                    >
                      {tag}
                    </CheckableTag>
                  );
                })}
              </div>

              {sortedTags.length > 10 && (
                <Button
                  type="link"
                  onClick={() => setShowAllTags(!showAllTags)}
                  style={{
                    paddingTop: 0,
                    paddingBottom: 0,
                    paddingLeft: "5px",
                    paddingRight: "5px",
                    marginTop: 6,
                    fontFamily: "monospace",
                  }}
                >
                  {showAllTags ? "Show less" : "Show more"}
                </Button>
              )}
            </>
          );
        })()}
      </Section>

      {/* ===== LOCATION ===== */}
      <Section>
        <Label>State</Label>
        <Select
          mode="multiple"
          allowClear
          placeholder="Select states"
          value={[...filters.states].sort()}
          onChange={(values: string[]) =>
            setFilters({ ...filters, states: values })
          }
          style={{ width: "100%" }}
        >
          {unique(trails.map((t) => t.state))
            .sort((a, b) => a.localeCompare(b))
            .map((s) => (
              <Select.Option key={s} value={s}>
                {s}
              </Select.Option>
            ))}
        </Select>
      </Section>

      <Section>
        <Label>County</Label>
        <Select
          mode="multiple"
          allowClear
          placeholder="Select counties"
          value={[...filters.counties].sort()}
          onChange={(values: string[]) =>
            setFilters({ ...filters, counties: values })
          }
          style={{ width: "100%" }}
        >
          {unique(trails.map((t) => t.county))
            .sort((a, b) => a.localeCompare(b))
            .map((c) => (
              <Select.Option key={c} value={c}>
                {c}
              </Select.Option>
            ))}
        </Select>
      </Section>

      <Section>
        <Label>Park</Label>
        <Select
          mode="multiple"
          allowClear
          placeholder="Select parks"
          value={[...filters.parks].sort()}
          onChange={(values: string[]) =>
            setFilters({ ...filters, parks: values })
          }
          style={{ width: "100%" }}
        >
          {unique(trails.map((t) => t.park_name))
            .sort((a, b) => a.localeCompare(b))
            .map((p) => (
              <Select.Option key={p} value={p}>
                {p}
              </Select.Option>
            ))}
        </Select>
      </Section>

      {/* ===== DIFFICULTY ===== */}
      <Section>
        <Label>Difficulty</Label>
        <Select
          mode="multiple"
          allowClear
          placeholder="Select difficulties"
          value={filters.difficultyDescs}
          onChange={(values: string[]) =>
            setFilters({ ...filters, difficultyDescs: values })
          }
          style={{ width: "100%" }}
        >
          {[
            "🐣",
            "🌱",
            "🟢",
            "🟢🟢",
            "🟢🟢🟢",
            "🟡",
            "🟡🟡",
            "🟡🟡🟡",
            "🟠",
            "🟠🟠",
            "🟠🟠🟠",
            "🔴",
            "🔴🔴",
            "🔴🔴🔴",
            "🟣",
            "🟣🟣",
            "🟣🟣🟣",
            "⚫",
            "⚫⚫",
            "⚫⚫⚫",
            "🔥",
            "🔥🔥",
            "🔥🔥🔥",
            "🌋",
            "🌋🌋",
            "🌋🌋🌋",
            "💠",
            "💠💠",
            "💠💠💠",
            "💎",
            "💎💎",
            "💎💎💎",
            "👑",
            "👑👑",
            "👑👑👑",
            "🌟",
            "🌟🌟",
            "🌟🌟🌟",
            "🪐",
            "🪐🪐",
            "🪐🪐🪐",
            "🧙",
            "🧙🧙",
            "🧙🧙🧙",
            "🐉",
            "🐉🐉",
            "🐉🐉🐉",
            "🦄",
            "🦄🟢",
            "🦄🟡",
            "🦄🟠",
            "🦄🔴",
            "🦄🟣",
            "🦄⚫",
            "🦄⚡",
            "🦄🌋",
            "🦄🦄",
            "🦄🦄🟢",
            "🦄🦄🟡",
            "🦄🦄🟠",
            "🦄🦄🔴",
            "🦄🦄🟣",
            "🦄🦄⚫",
            "🦄🦄⚡",
            "🦄🦄🌋",
            "🦄🦄🦄",
          ]
            .filter((d) =>
              trails.some(
                (t) => getDifficultyDescription(t.difficulty_score) === d,
              ),
            )
            .map((d) => (
              <Select.Option key={d} value={d}>
                {d}
              </Select.Option>
            ))}
        </Select>
      </Section>

      {/* ===== ANGLE ===== */}
      <Section>
        <Label>Avg Angle</Label>
        <Select
          mode="multiple"
          allowClear
          placeholder="Select avg angles"
          value={filters.angleDescs}
          onChange={(values: string[]) =>
            setFilters({ ...filters, angleDescs: values })
          }
          style={{ width: "100%" }}
        >
          {unique(trails.map((t) => getAngleDesc(t.avg_angle))).map((a) => (
            <Select.Option key={a} value={a}>
              {a}
            </Select.Option>
          ))}
        </Select>
      </Section>

      <Section>
        <Label>Crux Angle</Label>
        <Select
          mode="multiple"
          allowClear
          placeholder="Select crux angles"
          value={filters.cruxAngleDescs}
          onChange={(values: string[]) =>
            setFilters({ ...filters, cruxAngleDescs: values })
          }
          style={{ width: "100%" }}
        >
          {unique(trails.map((t) => getAngleDesc(t.max_angle))).map((c) => (
            <Select.Option key={c} value={c}>
              {c}
            </Select.Option>
          ))}
        </Select>
      </Section>

      {/* ===== DISTANCE ===== */}
      <Section>
        <Label>Distance (mi)</Label>
        <Slider
          range
          min={0}
          max={maxDistanceMiles}
          step={0.1}
          value={distanceRangeMiles}
          onChange={(val) =>
            setFilters({
              ...filters,
              distanceRange: [
                (val as [number, number])[0] / METERS_TO_MILES,
                (val as [number, number])[1] / METERS_TO_MILES,
              ],
            })
          }
          tooltip={{ open: false }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 12,
          }}
        >
          <span>{distanceRangeMiles[0].toFixed(1)} mi</span>
          <span>{distanceRangeMiles[1].toFixed(1)} mi</span>
        </div>
      </Section>

      {/* ===== ELEVATION ===== */}
      <Section>
        <Label>Elevation Gain (ft)</Label>
        <Slider
          range
          min={0}
          max={maxElevationFeet}
          step={50}
          value={elevationRangeFeet}
          onChange={(val) =>
            setFilters({
              ...filters,
              elevationRange: [
                (val as [number, number])[0] / METERS_TO_FEET,
                (val as [number, number])[1] / METERS_TO_FEET,
              ],
            })
          }
          tooltip={{ open: false }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 12,
          }}
        >
          <span>{Math.round(elevationRangeFeet[0])} ft</span>
          <span>{Math.round(elevationRangeFeet[1])} ft</span>
        </div>
      </Section>
    </Sidebar>
  );
};

const StickyFooter = styled.div`
  position: sticky;
  bottom: 0;
  padding: 16px;
  background: white; // match sidebar background
  border-top: 1px solid #eee;
  text-align: center;
  z-index: 10;
`;
