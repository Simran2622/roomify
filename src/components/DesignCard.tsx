import { CalendarDays, Edit3, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { Design } from "../types";
import Button from "./Button";

interface Props {
  design: Design;
  onDelete: (id: string) => void;
}

export default function DesignCard({ design, onDelete }: Props) {
  return (
    <article className="overflow-hidden rounded-2xl border border-stone bg-white shadow-soft">
      <div className="aspect-[16/9] overflow-hidden bg-sand">
        {design.preview || design.roomImage ? (
          <img src={design.preview || design.roomImage} alt={`${design.name} room preview`} className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full place-items-center text-sm text-neutral-500">No preview</div>
        )}
      </div>
      <div className="p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold">{design.name}</h3>
            <p className="mt-1 text-sm text-neutral-500">{design.roomType} · {design.style}</p>
          </div>
        </div>
        <div className="mb-4 flex items-center gap-2 text-xs text-neutral-500">
          <CalendarDays size={14} />
          {new Date(design.createdAt).toLocaleDateString()}
        </div>
        <div className="flex gap-2">
          <Link to={`/design/${design.id}`} className="flex-1">
            <Button variant="secondary" className="w-full"><Edit3 size={15} /> Edit</Button>
          </Link>
          <Button variant="danger" aria-label={`Delete ${design.name}`} onClick={() => onDelete(design.id)}>
            <Trash2 size={15} />
          </Button>
        </div>
      </div>
    </article>
  );
}
