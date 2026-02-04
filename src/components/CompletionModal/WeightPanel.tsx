import React from "react";
import { Panel } from "antd/lib/collapse"; // optional, just for typing
import { Checkbox, InputNumber, Input, Tooltip } from "antd";

interface WeightPanelProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  weightRules: Record<string, string>;
}

export const WeightPanel: React.FC<WeightPanelProps> = ({
  formData,
  setFormData,
  weightRules,
}) => {
  const handleWeightChange = (
    key: string,
    val: number | undefined | string,
  ) => {
    if (key === "awkward") {
      setFormData((prev) => ({ ...prev, awkwardObject: val as string }));
    } else {
      setFormData((prev) => ({
        ...prev,
        weightInputs: {
          ...prev.weightInputs,
          [key]: val as number | undefined,
        },
      }));
    }
  };

  return (
    <Panel header="🏋️ Weight Bearing" key="weight">
      <Checkbox.Group
        value={formData.weight}
        onChange={(vals) =>
          setFormData((prev) => ({ ...prev, weight: vals as string[] }))
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { key: "pack", label: "🎒 Pack" },
            { key: "front", label: "📦 Front carry" },
            { key: "overhead", label: "🏋️ Overhead carry" },
            { key: "vest", label: "🦺 Weighted vest" },
            { key: "uneven", label: "⚖️ Uneven load" },
            { key: "awkward", label: "🪵 Awkward object" },
          ].map(({ key, label }) => (
            <Checkbox key={key} value={key}>
              <Tooltip title={weightRules[key]}>{label}</Tooltip>
            </Checkbox>
          ))}
        </div>
      </Checkbox.Group>

      {formData.weight.map((w: string) => {
        if (w === "awkward") {
          return (
            <Input
              key={w}
              placeholder="What object did you carry?"
              value={formData.awkwardObject}
              onChange={(e) => handleWeightChange("awkward", e.target.value)}
              style={{ marginTop: 10 }}
            />
          );
        } else {
          return (
            <InputNumber
              key={w}
              min={1}
              placeholder={`${w} weight (lbs)`}
              value={formData.weightInputs[w]}
              onChange={(val) => handleWeightChange(w, val ?? undefined)}
              style={{ marginTop: 10, width: "100%" }}
            />
          );
        }
      })}
    </Panel>
  );
};
