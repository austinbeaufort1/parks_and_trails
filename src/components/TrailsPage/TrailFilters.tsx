import { Select, Row, Col } from "antd";
import { TrailCard } from "../../types/trail";
import { AngleDesc } from "../../types/angle";
import { getDifficultyDescription } from "../helpers/difficulty";

const { Option } = Select;

interface TrailFiltersState {
  states: string[];
  difficulties: string[];
  angleDescs: AngleDesc[];
}

interface FiltersProps {
  filters: TrailFiltersState;
  setFilters: (f: TrailFiltersState) => void;
  trails: TrailCard[];
}

export const TrailFilters: React.FC<FiltersProps> = ({
  filters,
  setFilters,
  trails,
}) => {
  const states = Array.from(new Set(trails.map((t) => t.state)));
  const difficulties = Array.from(
    new Set(trails.map((t) => getDifficultyDescription(t.difficulty_score)))
  );

  return (
    <Row gutter={16} style={{ marginBottom: 16 }}>
      <Col xs={24} md={8}>
        <Select
          mode="multiple"
          placeholder="Filter by State"
          style={{ width: "100%" }}
          value={filters.states}
          onChange={(states) => setFilters({ ...filters, states })}
        >
          {states.map((s) => (
            <Option key={s} value={s}>
              {s}
            </Option>
          ))}
        </Select>
      </Col>

      <Col xs={24} md={8}>
        <Select
          mode="multiple"
          placeholder="Difficulty"
          style={{ width: "100%" }}
          value={filters.difficulties}
          onChange={(difficulties) => setFilters({ ...filters, difficulties })}
        >
          {difficulties.map((d) => (
            <Option key={d} value={d}>
              {d}
            </Option>
          ))}
        </Select>
      </Col>
    </Row>
  );
};
