export type RoomType = "Bedroom" | "Living Room" | "Kitchen" | "Office";
export type InteriorStyle = "Modern" | "Minimal" | "Scandinavian" | "Bohemian" | "Industrial";

export interface FurnitureElement {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  color: string;
}

export interface Design {
  id: string;
  name: string;
  roomType: RoomType;
  style: InteriorStyle;
  roomImage: string;
  elements: FurnitureElement[];
  createdAt: string;
  updatedAt: string;
  preview?: string;
}
