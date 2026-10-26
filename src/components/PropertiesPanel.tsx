import { Copy, RotateCw, Trash2 } from "lucide-react";
import Button from "./Button";
import ColorPicker from "./ColorPicker";
import type { FurnitureElement } from "../types";

interface Props {
  element?: FurnitureElement;
  onChange: (changes: Partial<FurnitureElement>) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export default function PropertiesPanel({ element, onChange, onDuplicate, onDelete }: Props) {
  if (!element) {
    return (
      <aside className="border-t border-stone bg-white p-5 lg:w-72 lg:border-l lg:border-t-0">
        <h2 className="font-semibold">Properties</h2>
        <p className="mt-2 text-sm leading-6 text-neutral-500">
          Select a furniture item on the canvas to edit its position, size, rotation, and color.
        </p>
      </aside>
    );
  }

  const numberField = (label: string, key: keyof FurnitureElement, value: number, min = 0) => (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-neutral-500">{label}</span>
      <input
        type="number"
        min={min}
        value={Math.round(value)}
        onChange={(e) => onChange({ [key]: Number(e.target.value) } as Partial<FurnitureElement>)}
        className="w-full rounded-xl border border-stone px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
      />
    </label>
  );

  return (
    <aside className="border-t border-stone bg-white p-5 lg:w-72 lg:border-l lg:border-t-0">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="font-semibold capitalize">{element.type}</h2>
          <p className="mt-0.5 text-xs text-neutral-500">Selected item</p>
        </div>
        <RotateCw size={18} className="text-neutral-400" />
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {numberField("X", "x", element.x)}
          {numberField("Y", "y", element.y)}
          {numberField("Width", "width", element.width, 20)}
          {numberField("Height", "height", element.height, 20)}
        </div>
        <label className="block">
          <div className="mb-1.5 flex justify-between text-xs font-semibold text-neutral-500">
            <span>Rotation</span><span>{Math.round(element.rotation)}°</span>
          </div>
          <input
            aria-label="Rotation"
            type="range"
            min="-180"
            max="180"
            value={element.rotation}
            onChange={(e) => onChange({ rotation: Number(e.target.value) })}
            className="w-full accent-[#8B6F47]"
          />
        </label>
        <ColorPicker value={element.color} onChange={(color) => onChange({ color })} />
        <div className="grid grid-cols-2 gap-2 pt-2">
          <Button variant="secondary" onClick={onDuplicate}><Copy size={15} /> Duplicate</Button>
          <Button variant="danger" onClick={onDelete}><Trash2 size={15} /> Delete</Button>
        </div>
      </div>
    </aside>
  );
}
