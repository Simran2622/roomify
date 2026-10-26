import {
  BedDouble, Armchair, Sofa, Table2, BriefcaseBusiness, TreePine,
  LampDesk, Image as ImageIcon, CircleDot
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface FurnitureDefinition {
  type: string;
  name: string;
  category: "Furniture" | "Decor";
  icon: LucideIcon;
  width: number;
  height: number;
  color: string;
}

export const furnitureItems: FurnitureDefinition[] = [
  { type: "sofa", name: "Sofa", category: "Furniture", icon: Sofa, width: 220, height: 95, color: "#B7A38B" },
  { type: "bed", name: "Bed", category: "Furniture", icon: BedDouble, width: 210, height: 150, color: "#C9B8A4" },
  { type: "chair", name: "Chair", category: "Furniture", icon: Armchair, width: 95, height: 95, color: "#9A8369" },
  { type: "table", name: "Table", category: "Furniture", icon: Table2, width: 125, height: 85, color: "#A9825E" },
  { type: "desk", name: "Desk", category: "Furniture", icon: BriefcaseBusiness, width: 155, height: 75, color: "#9A8065" },
  { type: "plant", name: "Plant", category: "Decor", icon: TreePine, width: 75, height: 105, color: "#78916F" },
  { type: "lamp", name: "Lamp", category: "Decor", icon: LampDesk, width: 65, height: 95, color: "#D2B36D" },
  { type: "painting", name: "Painting", category: "Decor", icon: ImageIcon, width: 110, height: 75, color: "#7F7468" },
  { type: "rug", name: "Rug", category: "Decor", icon: CircleDot, width: 190, height: 120, color: "#B59C83" },
];

export const getFurnitureDefinition = (type: string) =>
  furnitureItems.find((item) => item.type === type);
