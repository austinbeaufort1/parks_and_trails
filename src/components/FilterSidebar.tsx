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

export const FilterSidebar: React.FC<Props> = ({
  trails,
  filters,
  setFilters,
  open,
  onClose,
  onReset,
}) => {
  const unique = <T,>(arr: T[]) => Array.from(new Set(arr));

  return (
    <Sidebar open={open} onClose={onClose} title="Filter Trails">
      {/* ===== LOCATION ===== */}
      <Section>
        <Label>State</Label>
        <Select
          mode="multiple"
          allowClear
          placeholder="Select states"
          value={filters.states}
          onChange={(values: string[]) =>
            setFilters({ ...filters, states: values })
          }
          style={{ width: "100%" }}
        >
          {unique(trails.map((t) => t.state)).map((s) => (
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
          value={filters.counties}
          onChange={(values: string[]) =>
            setFilters({ ...filters, counties: values })
          }
          style={{ width: "100%" }}
        >
          {unique(trails.map((t) => t.county)).map((c) => (
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
          value={filters.parks}
          onChange={(values: string[]) =>
            setFilters({ ...filters, parks: values })
          }
          style={{ width: "100%" }}
        >
          {unique(trails.map((t) => t.park_name)).map((p) => (
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
          {unique(
            trails.map((t) => getDifficultyDescription(t.difficulty_score))
          ).map((d) => (
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
          min={0}
          max={50}
          step={0.1}
          value={filters.distanceRange[1]}
          onChange={(val) =>
            setFilters({
              ...filters,
              distanceRange: [filters.distanceRange[0], val],
            })
          }
        />
      </Section>

      {/* ===== ELEVATION ===== */}
      <Section>
        <Label>Elevation Gain (ft)</Label>
        <Slider
          min={0}
          max={10000}
          step={50}
          value={filters.elevationRange[1]}
          onChange={(val) =>
            setFilters({
              ...filters,
              elevationRange: [filters.elevationRange[0], val],
            })
          }
        />
      </Section>

      <Button onClick={onReset}>Clear Filters</Button>
    </Sidebar>
  );
};
