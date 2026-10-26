import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { furnitureItems } from "../data/furniture";
import type { FurnitureDefinition } from "../data/furniture";

interface Props {
  onAdd: (item: FurnitureDefinition) => void;
}

export default function FurniturePanel({ onAdd }: Props) {
  const [open, setOpen] = useState<"Furniture" | "Decor">("Furniture");

  return (
    <aside className="flex w-full flex-col border-b border-stone bg-white lg:w-60 lg:border-b-0 lg:border-r">
      <div className="border-b border-stone p-5">
        <h2 className="font-semibold">Furniture</h2>
        <p className="mt-1 text-xs text-neutral-500">Click an item to add it.</p>
      </div>
      <div className="scrollbar-thin flex-1 overflow-y-auto p-3">
        {(["Furniture", "Decor"] as const).map((category) => (
          <section key={category} className="mb-2">
            <button
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider text-neutral-500 hover:bg-sand"
              onClick={() => setOpen(open === category ? category : category)}
              aria-expanded={open === category}
            >
              {category}<ChevronDown size={15} className={open === category ? "rotate-180" : ""} />
            </button>
            {open === category && (
              <div className="grid grid-cols-2 gap-2 p-1">
                {furnitureItems.filter((item) => item.category === category).map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.type}
                      onClick={() => onAdd(item)}
                      className="group rounded-xl border border-stone bg-white p-3 text-left transition hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                      title={`Add ${item.name}`}
                    >
                      <span className="grid h-10 w-10 place-items-center rounded-lg bg-sand text-ink">
                        <Icon size={21} strokeWidth={1.7} />
                      </span>
                      <span className="mt-2 block text-xs font-medium">{item.name}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        ))}
      </div>
    </aside>
  );
}
