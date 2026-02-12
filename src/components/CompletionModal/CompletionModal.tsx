// src/components/CompletionModal.tsx
import React, { useState } from "react";
import {
  Modal,
  Button,
  Collapse,
  Checkbox,
  InputNumber,
  Input,
  Tooltip,
} from "antd";
import { useCompleteTrail } from "../../hooks/useCompleteTrail";
import { initialFormData } from "../TrailsPage/TrailCard";
import {
  sportsRules,
  circusRules,
  weightRules,
  environmentRules,
  perceptionRules,
  surfaceRules,
  movementConstraintRules,
} from "./formDescriptions";
import { metersToFeet } from "../helpers/format";
import { TrailCard } from "../../types/trail";
import { calculatePar } from "../helpers/parCalculator";

const { Panel } = Collapse;

interface CompletionModalProps {
  open: boolean;
  onClose: () => void;
  trailId: string;
  estimatedTime: string;
  userId: string;
  formData: typeof initialFormData;
  setFormData: React.Dispatch<React.SetStateAction<typeof initialFormData>>;
  onCompleted?: (payload: any) => void;
  trail: TrailCard;
}

type WeightInputs = {
  pack?: number;
  front?: number;
  overhead?: number;
  vest?: number;
};

/* Sports tooltip rules */

export const CompletionModal: React.FC<CompletionModalProps> = ({
  open,
  onClose,
  trailId,
  userId,
  estimatedTime,
  onCompleted,
  formData,
  setFormData,
  trail,
}) => {
  const { completeTrail, loading } = useCompleteTrail();

  // Accordion states
  const [showDetails, setShowDetails] = useState(false);
  const [showCreativeDetails, setShowCreativeDetails] = useState(false);
  // Filter out Disc Golf from the sports for continuity question
  const sportsForContinuity = formData.sports.filter((s) => s !== "Disc Golf");
  const circusForcontinuity =
    formData.circusStunts.length > 0 &&
    !formData.circusStunts.every(
      (stunt) =>
        stunt === "Juggling" ||
        stunt === "Unicycling" ||
        stunt === "Handstand Walk",
    );

  const handleComplete = async () => {
    const details: any = {};

    if (showDetails) {
      // Weight
      details.weight = formData.weight.map((w) => {
        if (w === "pack")
          return { type: w, pounds: formData.weightInputs.pack };
        if (w === "front")
          return { type: w, pounds: formData.weightInputs.front };
        if (w === "overhead")
          return { type: w, pounds: formData.weightInputs.overhead };
        if (w === "vest")
          return { type: w, pounds: formData.weightInputs.vest };
        if (w === "awkward") return { type: w, item: formData.awkwardObject };
        return { type: w };
      });

      // Movement
      details.movement = formData.movement.length
        ? {
            type: formData.movement[0],
            howPerformed: formData.movementContinuity || null,
          }
        : null;

      // Surface
      details.surface = formData.surfaceRule
        ? { surface: formData.surfaceRule }
        : null;
      details.trailAdjacent = formData.trailAdjacent;

      // Perception
      details.perception = formData.perception;

      // Environment
      details.environment = formData.environment.map((env) => {
        const envObj: any = { type: env };
        if (env === "High wind") envObj.mph = formData.windSpeed;
        if (env === "Extreme heat") envObj.fahrenheit = formData.tempHeat;
        if (env === "Extreme cold") envObj.fahrenheit = formData.tempCold;
        if (env === "Snow on trail") envObj.inches = formData.snowDepth;
        return envObj;
      });

      // circus stunts
      details.circusStunts = formData.circusStunts;

      // Wildlife
      details.wildlife = formData.otherWildlife ? [formData.otherWildlife] : [];
    }

    // Only include details if there’s something
    const payload = {
      duration_seconds: formData.durationMinutes
        ? formData.durationMinutes * 60
        : null,
      details: Object.keys(details).length ? details : null,
    };

    onCompleted?.(payload);
    onClose();
  };

  return (
    <Modal
      title="Mark Trail as Complete"
      open={open}
      onCancel={onClose}
      footer={null} // Remove footer buttons, X button available
    >
      {/* Complete Trail Button */}
      <Button
        type="primary"
        block
        style={{ marginBottom: 12 }}
        loading={loading}
        onClick={handleComplete}
      >
        Complete Trail
      </Button>

      {/* Duration with Estimated Trail Time */}
      <label>Estimated Trail Time: {estimatedTime}</label>
      <p style={{ color: "#555", marginTop: "-5px" }}>
        How long did your hike take?
      </p>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <div>
          <label>Hours</label>
          <InputNumber
            min={0}
            value={formData.durationHours ?? undefined}
            onChange={(v) =>
              setFormData((prev) => ({ ...prev, durationHours: v ?? null }))
            }
            style={{ width: "100%" }}
            placeholder="0"
          />
        </div>
        <div>
          <label>Minutes</label>
          <InputNumber
            min={0}
            max={59}
            value={formData.durationMinutes ?? undefined}
            onChange={(v) =>
              setFormData((prev) => ({ ...prev, durationMinutes: v ?? null }))
            }
            style={{ width: "100%" }}
            placeholder="0"
          />
        </div>
      </div>
      <small
        style={{
          color: "#555",
          fontStyle: "italic",
          display: "block",
          marginBottom: 8,
        }}
      >
        Optional — adding details can earn tokens or badges!
      </small>

      {/* Add Challenge Details Toggle */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <Button block onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? "Hide Details" : "Add Details"}
        </Button>

        <Button
          block
          onClick={() => setShowCreativeDetails(!showCreativeDetails)}
        >
          {showCreativeDetails ? "Hide Creative" : "Add Creative"}
        </Button>
      </div>

      {showDetails && (
        <>
          <small style={{ opacity: 0.7 }}>
            Practical details that affected how the trail was completed.
          </small>
          <Collapse accordion>
            {/* Weight */}
            <Panel header="🏋️ Weight Bearing" key="weight">
              <Checkbox.Group
                value={formData.weight}
                onChange={(vals) =>
                  setFormData((prev) => ({ ...prev, weight: vals as string[] }))
                }
              >
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 6 }}
                >
                  <Checkbox value="pack">
                    <Tooltip title={weightRules.pack}>
                      <span>🎒 Pack</span>
                    </Tooltip>
                  </Checkbox>
                  <Checkbox value="front">
                    <Tooltip title={weightRules.front}>
                      <span>📦 Front carry</span>
                    </Tooltip>
                  </Checkbox>
                  <Checkbox value="overhead">
                    <Tooltip title={weightRules.overhead}>
                      <span>🏋️ Overhead carry</span>
                    </Tooltip>
                  </Checkbox>
                  <Checkbox value="vest">
                    <Tooltip title={weightRules.vest}>
                      <span>🦺 Weighted vest</span>
                    </Tooltip>
                  </Checkbox>
                  <Checkbox value="uneven">
                    <Tooltip title={weightRules.uneven}>
                      <span>⚖️ Uneven load</span>
                    </Tooltip>
                  </Checkbox>
                  <Checkbox value="awkward">
                    <Tooltip title={weightRules.awkward}>
                      <span>🪵 Awkward object</span>
                    </Tooltip>
                  </Checkbox>
                </div>
              </Checkbox.Group>

              {/* Individual weight inputs */}
              {formData.weight.includes("pack") && (
                <InputNumber
                  min={1}
                  placeholder="Pack weight (lbs)"
                  value={formData.weightInputs.pack}
                  onChange={(val) =>
                    setFormData((prev) => ({
                      ...prev,
                      weightInputs: {
                        ...prev.weightInputs,
                        pack: val ?? undefined,
                      },
                    }))
                  }
                  style={{ marginTop: 10, width: "100%" }}
                />
              )}

              {formData.weight.includes("front") && (
                <InputNumber
                  min={1}
                  placeholder="Front carry weight (lbs)"
                  value={formData.weightInputs.front}
                  onChange={(val) =>
                    setFormData((prev) => ({
                      ...prev,
                      weightInputs: {
                        ...prev.weightInputs,
                        front: val ?? undefined,
                      },
                    }))
                  }
                  style={{ marginTop: 10, width: "100%" }}
                />
              )}

              {formData.weight.includes("overhead") && (
                <InputNumber
                  min={1}
                  placeholder="Overhead carry weight (lbs)"
                  value={formData.weightInputs.overhead}
                  onChange={(val) =>
                    setFormData((prev) => ({
                      ...prev,
                      weightInputs: {
                        ...prev.weightInputs,
                        overhead: val ?? undefined,
                      },
                    }))
                  }
                  style={{ marginTop: 10, width: "100%" }}
                />
              )}

              {formData.weight.includes("vest") && (
                <InputNumber
                  min={1}
                  placeholder="Vest weight (lbs)"
                  value={formData.weightInputs.vest}
                  onChange={(val) =>
                    setFormData((prev) => ({
                      ...prev,
                      weightInputs: {
                        ...prev.weightInputs,
                        vest: val ?? undefined,
                      },
                    }))
                  }
                  style={{ marginTop: 10, width: "100%" }}
                />
              )}

              {formData.weight.includes("uneven") && (
                <InputNumber
                  min={1}
                  placeholder="Uneven weight (lbs)"
                  value={formData.weightInputs.uneven}
                  onChange={(val) =>
                    setFormData((prev) => ({
                      ...prev,
                      weightInputs: {
                        ...prev.weightInputs,
                        uneven: val ?? undefined,
                      },
                    }))
                  }
                  style={{ marginTop: 10, width: "100%" }}
                />
              )}

              {formData.weight.includes("awkward") && (
                <Input
                  placeholder="What object did you carry?"
                  value={formData.awkwardObject}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      awkwardObject: e.target.value,
                    }))
                  }
                  style={{ marginTop: 10 }}
                />
              )}
            </Panel>

            {/* Environment */}
            <Panel header="🌧️ Environment" key="environment">
              <Checkbox.Group
                value={formData.environment}
                onChange={(vals) => {
                  let newVals = vals as string[];

                  // mutually exclusive logic
                  if (
                    newVals.includes("Rained whole time") &&
                    newVals.includes("Snowed whole time")
                  )
                    newVals = newVals.filter((v) => v !== "Snowed whole time");
                  if (
                    newVals.includes("Snowed whole time") &&
                    newVals.includes("Extreme heat")
                  )
                    newVals = newVals.filter((v) => v !== "Snowed whole time");
                  if (
                    newVals.includes("Extreme heat") &&
                    newVals.includes("Extreme cold")
                  )
                    newVals = newVals.filter((v) => v !== "Extreme cold");
                  if (
                    newVals.includes("Extreme heat") &&
                    newVals.includes("Snow on trail")
                  )
                    newVals = newVals.filter((v) => v !== "Snow on trail");

                  setFormData((prev) => ({
                    ...prev,
                    environment: newVals,
                    windSpeed: newVals.includes("High wind")
                      ? prev.windSpeed
                      : null,
                    tempHeat: newVals.includes("Extreme heat")
                      ? prev.tempHeat
                      : null,
                    tempCold: newVals.includes("Extreme cold")
                      ? prev.tempCold
                      : null,
                    snowDepth: newVals.includes("Snow on trail")
                      ? prev.snowDepth
                      : null,
                  }));
                }}
              >
                <Checkbox
                  value="Rained whole time"
                  disabled={formData.environment.includes("Snowed whole time")}
                >
                  <Tooltip title={environmentRules.rain}>
                    Rained whole time
                  </Tooltip>
                </Checkbox>
                <Checkbox
                  value="Snowed whole time"
                  disabled={
                    formData.environment.includes("Rained whole time") ||
                    formData.environment.includes("Extreme heat")
                  }
                >
                  <Tooltip title={environmentRules.snowWholeTime}>
                    Snowed whole time
                  </Tooltip>
                </Checkbox>
                <Checkbox
                  value="Snow on trail"
                  disabled={formData.environment.includes("Extreme heat")}
                >
                  <Tooltip title={environmentRules.snowOnTrail}>
                    Snow on trail
                  </Tooltip>
                </Checkbox>
                <Checkbox value="High wind">
                  <Tooltip title={environmentRules.windy}>Windy</Tooltip>
                </Checkbox>
                <Checkbox
                  value="Extreme heat"
                  disabled={
                    formData.environment.includes("Extreme cold") ||
                    formData.environment.includes("Snowed whole time") ||
                    formData.environment.includes("Snow on trail")
                  }
                >
                  <Tooltip title={environmentRules.extremeHeat}>
                    Extreme heat
                  </Tooltip>
                </Checkbox>
                <Checkbox
                  value="Extreme cold"
                  disabled={formData.environment.includes("Extreme heat")}
                >
                  <Tooltip title={environmentRules.extremeCold}>
                    Extreme cold
                  </Tooltip>
                </Checkbox>
              </Checkbox.Group>

              {/* Conditional Inputs */}
              {formData.environment.includes("High wind") && (
                <InputNumber
                  placeholder="Wind speed (mph)"
                  value={formData.windSpeed ?? undefined}
                  onChange={(v) =>
                    setFormData((prev) => ({ ...prev, windSpeed: v ?? null }))
                  }
                  style={{ width: "100%", marginTop: 6 }}
                />
              )}
              {formData.environment.includes("Extreme heat") && (
                <InputNumber
                  placeholder="Temp (°F) for Extreme Heat"
                  value={formData.tempHeat ?? undefined}
                  onChange={(v) =>
                    setFormData((prev) => ({ ...prev, tempHeat: v ?? null }))
                  }
                  style={{ width: "100%", marginTop: 6 }}
                />
              )}
              {formData.environment.includes("Extreme cold") && (
                <InputNumber
                  placeholder="Temp (°F) for Extreme Cold"
                  value={formData.tempCold ?? undefined}
                  onChange={(v) =>
                    setFormData((prev) => ({ ...prev, tempCold: v ?? null }))
                  }
                  style={{ width: "100%", marginTop: 6 }}
                />
              )}
              {formData.environment.includes("Snow on trail") && (
                <InputNumber
                  placeholder="Inches deep"
                  value={formData.snowDepth ?? undefined}
                  onChange={(v) =>
                    setFormData((prev) => ({ ...prev, snowDepth: v ?? null }))
                  }
                  style={{ width: "100%", marginTop: 6 }}
                />
              )}
            </Panel>

            {/* Perception */}
            <Panel header="🌙 Perception" key="perception">
              <Checkbox.Group
                value={formData.perception}
                onChange={(vals) =>
                  setFormData((prev) => ({
                    ...prev,
                    perception:
                      vals.length > 1
                        ? [vals[vals.length - 1]]
                        : (vals as string[]),
                  }))
                }
              >
                {["Dusk", "Dawn", "Night", "After Midnight"].map((opt) => (
                  <Checkbox
                    key={opt}
                    value={opt}
                    disabled={
                      formData.perception.length > 0 &&
                      !formData.perception.includes(opt)
                    }
                  >
                    <Tooltip title={perceptionRules[opt]}>{opt}</Tooltip>
                  </Checkbox>
                ))}
              </Checkbox.Group>
            </Panel>

            {/* Surface Rules */}
            <Panel header="🪨 Surface Rules" key="surface">
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Checkbox
                  checked={formData.trailAdjacent}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      trailAdjacent: e.target.checked,
                    }))
                  }
                >
                  <Tooltip title={surfaceRules.trailAdjacent}>
                    Trail-adjacent (off-trail, parallel route)
                  </Tooltip>
                </Checkbox>
                <div style={{ marginTop: 8 }}>
                  <strong>Surface constraint</strong>
                </div>

                <Checkbox.Group
                  value={formData.surfaceRule ? [formData.surfaceRule] : []}
                  onChange={(vals) =>
                    setFormData((prev) => ({
                      ...prev,
                      surfaceRule: vals.length ? (vals[0] as string) : null,
                    }))
                  }
                >
                  {["Rock Only", "Wood Only", "No Bare Ground"].map((opt) => (
                    <Checkbox
                      key={opt}
                      value={opt}
                      disabled={
                        !!formData.surfaceRule && formData.surfaceRule !== opt
                      }
                    >
                      <Tooltip title={surfaceRules[opt]}>{opt}</Tooltip>
                    </Checkbox>
                  ))}
                </Checkbox.Group>
              </div>
            </Panel>

            {/* Wildlife Seen */}
            <Panel header="🦉 Wildlife Seen" key="wildlife">
              <Input.TextArea
                placeholder="Type any wildlife you saw (separate multiple with commas)"
                value={formData.otherWildlife}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    otherWildlife: e.target.value,
                  }))
                }
                autoSize={{ minRows: 3, maxRows: 6 }}
                style={{ width: "100%" }}
              />
              <small style={{ color: "#555" }}>
                Examples: Deer, Rabbit, Raccoon, Bird, Snake
              </small>
            </Panel>
          </Collapse>
        </>
      )}

      {showCreativeDetails && (
        <>
          <small style={{ opacity: 0.7 }}>
            Optional challenges you chose to make the hike more interesting.
          </small>

          <Collapse accordion>
            {/* Movement Constraints */}
            <Panel header="🦵 Movement Constraints" key="movement">
              <Checkbox.Group
                value={formData.movement}
                onChange={(vals) =>
                  setFormData((prev) => ({
                    ...prev,
                    movement:
                      vals.length > 1
                        ? [vals[vals.length - 1]]
                        : (vals as string[]),
                    movementContinuity: null, // reset continuity if changed
                  }))
                }
              >
                {[
                  "One-Footed",
                  "Low Crawl",
                  "Backwards",
                  "Hopping",
                  "Duck Walk",
                  "Hands First",
                  "Silly Walk",
                ].map((opt) => (
                  <Checkbox
                    key={opt}
                    value={opt}
                    disabled={
                      formData.movement.length > 0 &&
                      !formData.movement.includes(opt)
                    }
                  >
                    <Tooltip title={movementConstraintRules[opt]}>
                      {opt}
                    </Tooltip>
                  </Checkbox>
                ))}
              </Checkbox.Group>

              {formData.movement.length === 1 && (
                <div style={{ marginTop: 12 }}>
                  <strong>How was this performed?</strong>
                  <div style={{ marginTop: 8 }}>
                    <Checkbox.Group
                      value={
                        formData.movementContinuity
                          ? [formData.movementContinuity]
                          : []
                      }
                      onChange={(vals) =>
                        setFormData((prev) => ({
                          ...prev,
                          movementContinuity: vals[0] as
                            | "continuous"
                            | "intermittent",
                        }))
                      }
                    >
                      <Checkbox value="continuous">
                        Continuous (Entire trail, no breaks, dropping, etc.)
                      </Checkbox>
                      <Checkbox value="intermittent">
                        Non-continuous (breaks allowed, but more than 50% of the
                        time)
                      </Checkbox>
                    </Checkbox.Group>
                  </div>
                </div>
              )}
            </Panel>

            {/* Sports */}
            <Panel header="🥎 Sports" key="sports">
              <Checkbox.Group
                value={formData.sports}
                onChange={(vals) =>
                  setFormData((prev) => ({
                    ...prev,
                    sports: vals as string[],
                  }))
                }
              >
                {[
                  "Soccer Dribble",
                  "Basketball Dribble",
                  "Hockey Control",
                  "Lacrosse Cradle",
                  "Paddle Ball Bounce",
                  "Disc Golf", // updated name
                  "Baseball Glove Carry",
                ].map((opt) => (
                  <Checkbox key={opt} value={opt}>
                    <Tooltip title={sportsRules[opt]}>
                      <span>{opt}</span>
                    </Tooltip>
                  </Checkbox>
                ))}
              </Checkbox.Group>

              {formData.sports.includes("Disc Golf") && (
                <div style={{ marginTop: 12 }}>
                  <strong>Number of throws to complete the trail</strong>
                  <div style={{ marginTop: 4, fontSize: 12, color: "#555" }}>
                    Par: {Math.ceil(metersToFeet(trail.total_distance_m) / 30)}{" "}
                    throws
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <InputNumber
                      min={1}
                      value={formData.discGolfThrows ?? undefined}
                      onChange={(val) =>
                        setFormData((prev) => ({
                          ...prev,
                          discGolfThrows: val as number,
                        }))
                      }
                      placeholder="Enter number of throws"
                    />
                  </div>
                </div>
              )}

              {sportsForContinuity.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  <strong>How was this performed?</strong>
                  <em
                    style={{
                      display: "block",
                      marginTop: 4,
                      fontSize: 12,
                      opacity: 0.75,
                    }}
                  >
                    Not applicable to disc golf.
                  </em>

                  <div style={{ marginTop: 8 }}>
                    <Checkbox.Group
                      value={
                        formData.sportsContinuity
                          ? [formData.sportsContinuity]
                          : []
                      }
                      onChange={(vals) =>
                        setFormData((prev) => ({
                          ...prev,
                          sportsContinuity: vals[0] as
                            | "continuous"
                            | "intermittent",
                        }))
                      }
                    >
                      <Checkbox value="continuous">
                        Continuous (Entire trail, no breaks, dropping, etc.)
                      </Checkbox>
                      <Checkbox value="intermittent">
                        Non-continuous (Entire trail, but breaks allowed. If a
                        break is taken, item is dropped, etc., then start a few
                        feet prior to the break spot.)
                      </Checkbox>
                    </Checkbox.Group>
                  </div>
                </div>
              )}
            </Panel>

            {/* Circus Stunts */}
            <Panel header="🎪 Circus Stunts" key="circus">
              <Checkbox.Group
                value={formData.circusStunts}
                onChange={(vals) =>
                  setFormData((prev) => ({
                    ...prev,
                    circusStunts: vals as string[],
                  }))
                }
              >
                {[
                  "Juggling",
                  "Unicycling",
                  "Stilt Walking",
                  "Handstand Walk",
                  "Poi Spinning",
                  "Staff Spinning",
                  "Hula Hooping",
                  "Slacklining",
                ].map((opt) => (
                  <Checkbox key={opt} value={opt}>
                    <Tooltip title={circusRules[opt]}>
                      <span>{opt}</span>
                    </Tooltip>
                  </Checkbox>
                ))}
              </Checkbox.Group>

              {formData.circusStunts.includes("Juggling") && (
                <div style={{ marginTop: 12 }}>
                  <strong>Juggling Details</strong>
                  <div style={{ marginTop: 8 }}>
                    <label>
                      Ball Count:
                      <select
                        value={formData.jugglingBalls || 3}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            jugglingBalls: Number(e.target.value),
                          }))
                        }
                      >
                        <option value={3}>3 Balls</option>
                        <option value={4}>4 Balls</option>
                        <option value={5}>5 Balls</option>
                      </select>
                    </label>
                    <div style={{ marginTop: 4, fontSize: 12, color: "#555" }}>
                      Par: {calculatePar(trail, 150)} drops
                    </div>
                    <label>
                      Drops on trail:
                      <InputNumber
                        min={0}
                        value={formData.jugglingDrops}
                        onChange={(val) =>
                          setFormData((prev) => ({
                            ...prev,
                            jugglingDrops: val ?? 0, // ensures it's a number
                          }))
                        }
                      />
                    </label>
                  </div>
                </div>
              )}

              {formData.circusStunts.includes("Unicycling") && (
                <div style={{ marginTop: 12 }}>
                  <strong>Unicycling Details</strong>
                  <div style={{ marginTop: 4, fontSize: 12, color: "#555" }}>
                    Par: {calculatePar(trail, 100)} dismounts
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <label>
                      Falls on trail:
                      <InputNumber
                        min={0}
                        value={formData.unicycleFalls || 0}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            unicycleFalls: e || 0,
                          }))
                        }
                      />
                    </label>
                  </div>
                </div>
              )}

              {formData.circusStunts.includes("Handstand Walk") && (
                <div style={{ marginTop: 12 }}>
                  <strong>Handstand Walk Details</strong>
                  <div style={{ marginTop: 8 }}>
                    <Checkbox
                      checked={formData.handstand50m || false}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          handstand50m: e.target.checked,
                        }))
                      }
                    >
                      Walked more than 50 meters total on hands (breaks allowed)
                    </Checkbox>
                  </div>
                </div>
              )}

              {/* Continuous / intermittent for other stunts */}
              {circusForcontinuity && (
                <div style={{ marginTop: 12 }}>
                  <strong>Performance Style</strong>
                  <em
                    style={{
                      display: "block",
                      marginTop: 4,
                      fontSize: 12,
                      opacity: 0.75,
                    }}
                  >
                    Applies to stilt walking, poi and staff spinning, hula
                    hooping, and slacklining only.
                  </em>
                  <div style={{ marginTop: 8 }}>
                    <Checkbox.Group
                      value={
                        formData.circusStuntsContinuity
                          ? [formData.circusStuntsContinuity]
                          : []
                      }
                      onChange={(vals) =>
                        setFormData((prev) => ({
                          ...prev,
                          circusStuntsContinuity: vals[0] as
                            | "continuous"
                            | "intermittent",
                        }))
                      }
                    >
                      <Checkbox value="continuous">
                        Continuous (Entire trail, no breaks, dropping, etc.)
                      </Checkbox>
                      <Checkbox value="intermittent">
                        Non-continuous (Entire trail, but breaks allowed. If a
                        break is taken, item is dropped, etc., then start a few
                        feet prior to the break spot.)
                      </Checkbox>
                    </Checkbox.Group>
                  </div>
                </div>
              )}
            </Panel>
          </Collapse>
        </>
      )}
    </Modal>
  );
};
