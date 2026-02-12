// src/components/FilterSidebar.tsx
import React from "react";
import styled from "styled-components";
import { Sidebar } from "./SideBar"; // your reusable sidebar
import { TrailCard as TrailCardType } from "../types/trail";
import { TrailFilters } from "../types/filters";
import { getDifficultyDescription } from "./helpers/difficulty";
import { getAngleDesc } from "./helpers/angle";
import { Button } from "./ui/Buttons";
import { Select, Slider } from "antd";

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
  const unique = <T,>(arr: T[]) => Array.from(new Set(arr));
  console.log("FILTERS", filters);
  // Convert distance and elevation ranges for slider display
  const elevationRangeFeet: [number, number] = [
    filters.elevationRange[0] * METERS_TO_FEET,
    filters.elevationRange[1] * METERS_TO_FEET,
  ];

  // Convert meters → miles for slider display
  const distanceRangeMiles: [number, number] = [
    filters.distanceRange[0] * METERS_TO_MILES,
    filters.distanceRange[1] * METERS_TO_MILES,
  ];

  // Find max trail distance in miles for slider max
  const maxDistanceMiles = trails.length
    ? Math.max(...trails.map((t) => t.total_distance_m)) * METERS_TO_MILES
    : 50;

  const maxElevationFeet = trails.length
    ? Math.max(...trails.map((t) => t.elevation_gain_m)) * METERS_TO_FEET
    : 10000;

  return (
    <Sidebar open={open} onClose={onClose} title="Filter Trails">
      {/* ===== LOCATION ===== */}
      <Section>
        <Label>State</Label>
        <Select
          mode="multiple"
          allowClear
          placeholder="Select states"
          value={[...filters.states].sort()} // make a copy and sort
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
          value={[...filters.counties].sort()} // sorted copy for value
          onChange={(values: string[]) =>
            setFilters({ ...filters, counties: values })
          }
          style={{ width: "100%" }}
        >
          {unique(trails.map((t) => t.county))
            .sort((a, b) => a.localeCompare(b)) // sort options alphabetically
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
          value={[...filters.parks].sort()} // sorted copy for value
          onChange={(values: string[]) =>
            setFilters({ ...filters, parks: values })
          }
          style={{ width: "100%" }}
        >
          {unique(trails.map((t) => t.park_name))
            .sort((a, b) => a.localeCompare(b)) // sort options alphabetically
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
            "⚠️",
            "⚠️⚠️",
            "⚠️⚠️⚠️",
            "☠️",
            "☠️☠️",
            "☠️☠️☠️",
            "👑",
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
                (val as [number, number])[0] / METERS_TO_MILES, // back to meters
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
          max={maxElevationFeet} // max based on trails
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

      <Button onClick={onReset}>Clear Filters</Button>
    </Sidebar>
  );
};
