import { LampDesk, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "./Button";

export default function EmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-stone bg-white px-6 py-20 text-center">
      <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-sand">
        <LampDesk size={28} />
      </div>
      <h2 className="text-xl font-semibold">No designs yet</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-500">
        Create your first room design and start arranging furniture in the interactive editor.
      </p>
      <Link to="/design/new" className="mt-6 inline-block">
        <Button><Plus size={17} /> Create your first design</Button>
      </Link>
    </div>
  );
}
