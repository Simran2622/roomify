import type { InteriorStyle, RoomType } from "../types";

export const roomTypes: RoomType[] = ["Bedroom", "Living Room", "Kitchen", "Office"];
export const interiorStyles: InteriorStyle[] = [
  "Modern", "Minimal", "Scandinavian", "Bohemian", "Industrial"
];

export const builtInRooms = [
  {
    id: "warm",
    name: "Warm Neutral",
    value: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="1100" height="700">
        <rect width="1100" height="700" fill="#eee7dc"/>
        <rect y="0" width="1100" height="470" fill="#e9e1d5"/>
        <rect y="470" width="1100" height="230" fill="#c6ae91"/>
        <rect x="90" y="105" width="260" height="210" rx="8" fill="#f5f1ea" stroke="#d0c5b6" stroke-width="5"/>
        <rect x="130" y="145" width="180" height="135" fill="#d8c7af"/>
        <rect x="720" y="95" width="250" height="290" rx="10" fill="#f4efe7" stroke="#d0c5b6" stroke-width="5"/>
        <rect x="760" y="135" width="170" height="210" fill="#d8c7af"/>
        <path d="M0 470h1100" stroke="#ad9272" stroke-width="8"/>
      </svg>`),
  },
  {
    id: "light",
    name: "Light & Airy",
    value: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="1100" height="700">
        <rect width="1100" height="700" fill="#f5f4ef"/>
        <rect y="0" width="1100" height="470" fill="#faf9f5"/>
        <rect y="470" width="1100" height="230" fill="#ded9cf"/>
        <rect x="90" y="85" width="300" height="235" fill="#dce8e8" stroke="#ffffff" stroke-width="12"/>
        <path d="M240 85v235M90 202h300" stroke="#ffffff" stroke-width="9"/>
        <rect x="735" y="110" width="250" height="280" fill="#e5e1d7"/>
        <path d="M0 470h1100" stroke="#c8c1b5" stroke-width="8"/>
      </svg>`),
  },
  {
    id: "moody",
    name: "Moody",
    value: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="1100" height="700">
        <rect width="1100" height="700" fill="#353533"/>
        <rect y="0" width="1100" height="470" fill="#454441"/>
        <rect y="470" width="1100" height="230" fill="#5b4c3c"/>
        <rect x="95" y="105" width="260" height="205" fill="#6c7c7d" stroke="#9b9b92" stroke-width="6"/>
        <rect x="740" y="90" width="245" height="285" fill="#272827" stroke="#9b9b92" stroke-width="6"/>
        <path d="M0 470h1100" stroke="#79644d" stroke-width="8"/>
      </svg>`),
  },
];
