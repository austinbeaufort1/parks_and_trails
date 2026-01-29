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
}

type WeightInputs = {
  pack?: number;
  front?: number;
  overhead?: number;
  vest?: number;
};

/* Sports tooltip rules */
const sportsRules: Record<string, string> = {
  "Soccer Dribble":
    "Dribble a soccer ball along the trail, keeping it within 10ft of the path at all times.",
  "Basketball Dribble":
    "Bounce a basketball along the trail without losing control or going off-path.",
  "Floor Hockey Control":
    "Guide a puck or ball with a hockey stick along the trail, staying within 10ft of the path at all times.",
  "Lacrosse Cradle":
    "Cradle a lacrosse ball on your stick while moving along the trail without dropping it.",
  "Paddle Ball Bounce":
    "Bounce a tennis, pickleball, or table tennis ball along the trail while keeping control.",
  "Disc Control":
    "Navigate the trail by throwing and catching a disc to yourself. You cannot move while holding the disc—step forward only between throws. Dropping the disc ends your run.",
  "Baseball Glove Carry":
    "Carry one or two baseballs in one or two gloves without dropping any.",
};

const circusRules: Record<string, string> = {
  Juggling:
    "Keep three or more objects in the air at the same time while moving along the trail.",
  Unicycling:
    "Ride a unicycle along the trail without touching the ground with your feet.",
  "Stilt Walking":
    "Walk along the trail using stilts, staying upright the entire time.",
  "Handstand Walk": "Walk at least 25 feet along the trail on your hands only.",
  "Poi Spinning":
    "Spin poi (or similar objects) continuously while moving along the trail.",
  "Staff Spinning":
    "Spin a staff or baton continuously while moving along the trail.",
  "Hula Hooping":
    "Keep a hula hoop spinning around your waist while moving along the trail.",
  Slacklining:
    "Cross a slackline anchored between two points; each new line must start where the last ended.",
};

const weightRules: Record<string, string> = {
  Pack: "Carry a backpack or hiking pack along the trail.",
  "Front carry": "Carry a load in front of your torso while on the trail.",
  "Overhead carry":
    "Hold a weight or object above your head while hiking the trail.",
  "Weighted vest": "Wear a weighted vest while hiking the trail.",
  "Uneven load": "Carry items of unequal weight or asymmetrical shape.",
  "Awkward object":
    "Carry an irregularly shaped or bulky object that is difficult to handle.",
};

export const CompletionModal: React.FC<CompletionModalProps> = ({
  open,
  onClose,
  trailId,
  userId,
  estimatedTime,
  onCompleted,
  formData,
  setFormData,
}) => {
  const { completeTrail, loading } = useCompleteTrail();

  // Accordion states
  const [showDetails, setShowDetails] = useState(false);

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
      <div style={{ marginBottom: 12 }}>
        <label>Estimated Trail Time: {estimatedTime}</label>
        <InputNumber
          min={1}
          value={formData.durationMinutes ?? undefined}
          onChange={(v) =>
            setFormData((prev) => ({ ...prev, durationMinutes: v ?? null }))
          }
          placeholder="Enter your actual time (minutes)"
          style={{ width: "100%", marginTop: 4 }}
        />
        <small style={{ color: "#555" }}>
          Enter how long it took you. Beat the estimate for bragging rights!
        </small>
      </div>

      {/* Add Challenge Details Toggle */}
      <Button
        type="dashed"
        block
        style={{ marginBottom: 12 }}
        onClick={() => setShowDetails(!showDetails)}
      >
        {showDetails ? "Hide Challenge Details" : "Add Challenge Details"}
      </Button>

      {showDetails && (
        <Collapse accordion>
          {/* Weight */}
          <Panel header="🏋️ Weight Bearing" key="weight">
            <Checkbox.Group
              value={formData.weight}
              onChange={(vals) =>
                setFormData((prev) => ({ ...prev, weight: vals as string[] }))
              }
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
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
                "One-footed",
                "Army crawl",
                "Backwards",
                "Hopping",
                "Duck walk",
                "Hands first",
                "Silly walk",
              ].map((opt) => (
                <Checkbox
                  key={opt}
                  value={opt}
                  disabled={
                    formData.movement.length > 0 &&
                    !formData.movement.includes(opt)
                  }
                >
                  {opt}
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
                      Continuous (entire trail, no breaks, dropping, etc.)
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
                Trail-adjacent (off-trail, parallel route)
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
                {["Rock only", "Wood only", "No bare ground"].map((opt) => (
                  <Checkbox
                    key={opt}
                    value={opt}
                    disabled={
                      !!formData.surfaceRule && formData.surfaceRule !== opt
                    }
                  >
                    {opt}
                  </Checkbox>
                ))}
              </Checkbox.Group>
            </div>
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
              {["Dusk", "Dawn", "Night", "After midnight"].map((opt) => (
                <Checkbox
                  key={opt}
                  value={opt}
                  disabled={
                    formData.perception.length > 0 &&
                    !formData.perception.includes(opt)
                  }
                >
                  {opt}
                </Checkbox>
              ))}
            </Checkbox.Group>
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
                Rained whole time
              </Checkbox>
              <Checkbox
                value="Snowed whole time"
                disabled={
                  formData.environment.includes("Rained whole time") ||
                  formData.environment.includes("Extreme heat")
                }
              >
                Snowed whole time
              </Checkbox>
              <Checkbox
                value="Snow on trail"
                disabled={formData.environment.includes("Extreme heat")}
              >
                Snow on trail
              </Checkbox>
              <Checkbox value="High wind">Windy</Checkbox>
              <Checkbox
                value="Extreme heat"
                disabled={
                  formData.environment.includes("Extreme cold") ||
                  formData.environment.includes("Snowed whole time") ||
                  formData.environment.includes("Snow on trail")
                }
              >
                Extreme heat
              </Checkbox>
              <Checkbox
                value="Extreme cold"
                disabled={formData.environment.includes("Extreme heat")}
              >
                Extreme cold
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
                "Disc Control",
                "Baseball Glove Carry",
              ].map((opt) => (
                <Checkbox key={opt} value={opt}>
                  <Tooltip title={sportsRules[opt]}>
                    <span>{opt}</span>
                  </Tooltip>
                </Checkbox>
              ))}
            </Checkbox.Group>

            {formData.sports.length > 0 && (
              <div style={{ marginTop: 12 }}>
                <strong>How was this performed?</strong>
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
                      Continuous (entire trail, no breaks, dropping, etc.)
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

            {formData.circusStunts.length > 0 && (
              <div style={{ marginTop: 12 }}>
                <strong>How was this performed?</strong>
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
                      Continuous (entire trail, no breaks, dropping, etc.)
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
        </Collapse>
      )}
    </Modal>
  );
};
