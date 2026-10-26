import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import DesignCard from "../components/DesignCard";
import EmptyState from "../components/EmptyState";
import { deleteDesign, getDesigns } from "../services/localStorage";
import type { Design } from "../types";

export default function Dashboard() {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [error, setError] = useState("");

  const loadDesigns = async () => {
    try {
      setDesigns(await getDesigns());
      setError("");
    } catch {
      setError("Could not connect to the Roomify backend. Make sure the server is running.");
    }
  };

  useEffect(() => { void loadDesigns(); }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this design? This cannot be undone.")) return;
    try {
      await deleteDesign(id);
      await loadDesigns();
    } catch {
      setError("Could not delete this design. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-sand">
      <Navbar />
      <main className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
        <div className="mb-9 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.2em] text-accent">Workspace</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">My Designs</h1>
            <p className="mt-2 text-neutral-500">Your saved room concepts live here.</p>
          </div>
          <Link to="/design/new"><Button><Plus size={17} /> Create New Design</Button></Link>
        </div>
        {error && <p role="alert" className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        {designs.length === 0 ? <EmptyState /> : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {designs.map((design) => <DesignCard key={design.id} design={design} onDelete={handleDelete} />)}
          </div>
        )}
      </main>
    </div>
  );
}
