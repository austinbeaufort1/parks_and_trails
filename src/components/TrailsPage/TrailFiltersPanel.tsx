import React from "react";
import { Row, Col, Select, Slider, Button } from "antd";
import { TrailCard } from "../../types/trail";
import { getAngleDesc } from "../helpers/angle";
import { getDifficultyDescription } from "../helpers/difficulty";
import { TrailFilters } from "../../types/filters";
import { TrailAccordion } from "../TrailAccordiion"; // <- our custom accordion

interface Props {
  trails: TrailCard[];
  filters: TrailFilters;
  setFilters: (f: TrailFilters) => void;
  onReset: () => void;
}

const unique = <T,>(arr: T[]) => Array.from(new Set(arr));

export const TrailFiltersPanel: React.FC<Props> = ({
  trails,
  filters,
  setFilters,
  onReset,
}) => {
  const forestGreen = "rgb(0, 94, 12)";

  return (
    <TrailAccordion
      items={[
        {
          key: "filters",
          label: (
            <span
              style={{
                fontWeight: 600,
                fontSize: "16px",
                color: forestGreen,
                fontFamily: "Permanent Marker",
              }}
            >
              Filter Trails
            </span>
          ),
          content: (
            <div
              style={{
                border: "2px solid rgb(197, 219, 190)",
                borderRadius: 8,
                backgroundColor: "#fafafa",
                padding: "12px 16px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                marginTop: 12,
                transition: "opacity 0.2s",
              }}
            >
              {/* LOCATION */}
              <Row gutter={[12, 12]} justify="center">
                <Col xs={24} md={10}>
                  <Select
                    mode="multiple"
                    placeholder="State"
                    value={filters.states}
                    onChange={(states) => setFilters({ ...filters, states })}
                    options={unique(trails.map((t) => t.state)).map((s) => ({
                      label: s,
                      value: s,
                    }))}
                    style={{ width: "100%" }}
                  />
                </Col>

                <Col xs={24} md={10}>
                  <Select
                    mode="multiple"
                    placeholder="County"
                    value={filters.counties}
                    onChange={(counties) =>
                      setFilters({ ...filters, counties })
                    }
                    options={unique(trails.map((t) => t.county)).map((c) => ({
                      label: c,
                      value: c,
                    }))}
                    style={{ width: "100%" }}
                  />
                </Col>
              </Row>

              {/* PARK & DIFFICULTY */}
              <Row gutter={[12, 12]} style={{ marginTop: 12 }} justify="center">
                <Col xs={24} md={10}>
                  <Select
                    mode="multiple"
                    placeholder="Park"
                    value={filters.parks}
                    onChange={(parks) => setFilters({ ...filters, parks })}
                    options={unique(trails.map((t) => t.park_name)).map(
                      (p) => ({
                        label: p,
                        value: p,
                      })
                    )}
                    style={{ width: "100%" }}
                  />
                </Col>

                <Col xs={24} md={10}>
                  <Select
                    mode="multiple"
                    placeholder="Difficulty"
                    value={filters.difficultyDescs}
                    onChange={(difficultyDescs) =>
                      setFilters({ ...filters, difficultyDescs })
                    }
                    options={unique(
                      trails.map((t) =>
                        getDifficultyDescription(t.difficulty_score)
                      )
                    ).map((d) => ({ label: d, value: d }))}
                    style={{ width: "100%" }}
                  />
                </Col>
              </Row>

              {/* AVG ANGLE & CRUX ANGLE */}
              <Row gutter={[12, 12]} style={{ marginTop: 12 }} justify="center">
                <Col xs={24} md={10}>
                  <Select
                    mode="multiple"
                    placeholder="Avg Angle"
                    value={filters.angleDescs}
                    onChange={(angleDescs) =>
                      setFilters({ ...filters, angleDescs })
                    }
                    options={unique(
                      trails.map((t) => getAngleDesc(t.avg_angle))
                    ).map((a) => ({ label: a, value: a }))}
                    style={{ width: "100%" }}
                  />
                </Col>

                <Col xs={24} md={10}>
                  <Select
                    mode="multiple"
                    placeholder="Crux Angle"
                    value={filters.cruxAngleDescs}
                    onChange={(cruxAngleDescs) =>
                      setFilters({ ...filters, cruxAngleDescs })
                    }
                    options={unique(
                      trails.map((t) => getAngleDesc(t.max_angle))
                    ).map((c) => ({ label: c, value: c }))}
                    style={{ width: "100%" }}
                  />
                </Col>
              </Row>

              {/* LAND COVER */}
              <Row gutter={[12, 12]} style={{ marginTop: 12 }} justify="center">
                <Col
                  xs={24}
                  md={10}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Select
                    mode="multiple"
                    placeholder="Land Cover"
                    value={filters.landCoverTypes}
                    onChange={(landCoverTypes) =>
                      setFilters({ ...filters, landCoverTypes })
                    }
                    options={unique(
                      trails.flatMap((t) =>
                        t.landcover_percentages.map((l) => l.type)
                      )
                    ).map((l) => ({ label: l, value: l }))}
                    style={{ width: "80%" }}
                  />
                </Col>
              </Row>

              {/* DISTANCE & ELEVATION */}
              <Row gutter={[12, 12]} style={{ marginTop: 12 }} justify="center">
                <Col
                  xs={24}
                  md={8}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div>Distance (mi)</div>
                  <Slider
                    range
                    min={0}
                    max={20}
                    step={0.1}
                    value={filters.distanceRange}
                    onChange={(distanceRange) =>
                      setFilters({ ...filters, distanceRange })
                    }
                    style={{ width: "80%" }}
                  />
                </Col>

                <Col
                  xs={24}
                  md={8}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div>Elevation Gain (ft)</div>
                  <Slider
                    range
                    min={0}
                    max={8000}
                    step={50}
                    value={filters.elevationRange}
                    onChange={(elevationRange) =>
                      setFilters({ ...filters, elevationRange })
                    }
                    style={{ width: "80%" }}
                  />
                </Col>
              </Row>

              {/* MIN TREE COVER */}
              <Row gutter={[12, 12]} style={{ marginTop: 12 }} justify="center">
                <Col
                  xs={24}
                  md={10}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div>Min Tree Cover (%)</div>
                  <Slider
                    min={0}
                    max={100}
                    value={filters.minTreeCover}
                    onChange={(minTreeCover) =>
                      setFilters({ ...filters, minTreeCover })
                    }
                    style={{ width: "80%" }}
                  />
                </Col>
              </Row>

              {/* ACTIONS */}
              <Row justify="center" style={{ marginTop: 16 }}>
                <Button className="font-rock-salt" onClick={onReset}>
                  Clear Filters
                </Button>
              </Row>
            </div>
          ),
        },
      ]}
    />
  );
};
