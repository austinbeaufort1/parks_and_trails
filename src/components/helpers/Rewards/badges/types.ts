export interface EarnedBadge {
  id: string;
  title: string;
  description: string;
  icon_svg: string;
  svgPath?: string;
}

export type Season = "winter" | "spring" | "summer" | "autumn";
