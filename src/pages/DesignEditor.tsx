import { Download, Eraser, Menu, Save, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Konva from "konva";
import Button from "../components/Button";
import FurniturePanel from "../components/FurniturePanel";
import Navbar from "../components/Navbar";
import PropertiesPanel from "../components/PropertiesPanel";
import RoomCanvas from "../components/RoomCanvas";
import { getFurnitureDefinition } from "../data/furniture";
import { useDesign } from "../hooks/useDesign";
import { makeId } from "../services/localStorage";
import type { FurnitureElement } from "../types";

export default function DesignEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { design, loading, saveElements } = useDesign(id);
  const [elements, setElements] = useState<FurnitureElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobilePanel, setMobilePanel] = useState<"furniture" | "properties" | null>(null);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const stageRef = useRef<Konva.Stage | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (design && !initialized.current) {
      setElements(design.elements);
      initialized.current = true;
    }
  }, [design]);

  if (loading) return <div className="grid min-h-screen place-items-center bg-sand text-sm text-neutral-500">Loading design…</div>;

  if (!design) {
    return (
      <div className="grid min-h-screen place-items-center bg-sand px-5 text-center">
        <div><h1 className="text-2xl font-bold">Design not found</h1><p className="mt-2 text-neutral-500">This design may have been deleted or local storage was cleared.</p><Link to="/dashboard" className="mt-5 inline-block"><Button>Back to dashboard</Button></Link></div>
      </div>
    );
  }

  const selected = elements.find((item) => item.id === selectedId);

  const addFurniture = (item: ReturnType<typeof getFurnitureDefinition>) => {
    if (!item) return;
    const next: FurnitureElement = {
      id: makeId(),
      type: item.type,
      x: 300 + Math.random() * 180,
      y: 170 + Math.random() * 120,
      width: item.width,
      height: item.height,
      rotation: 0,
      color: item.color,
    };
    setElements((current) => [...current, next]);
    setSelectedId(next.id);
  };

  const changeElement = (elementId: string, changes: Partial<FurnitureElement>) => {
    setElements((current) => current.map((item) => item.id === elementId ? { ...item, ...changes } : item));
  };

  const duplicate = () => {
    if (!selected) return;
    const copy = { ...selected, id: makeId(), x: selected.x + 25, y: selected.y + 25 };
    setElements((current) => [...current, copy]);
    setSelectedId(copy.id);
  };

  const remove = () => {
    if (!selected) return;
    setElements((current) => current.filter((item) => item.id !== selected.id));
    setSelectedId(null);
  };

  const clear = () => {
    if (elements.length && !window.confirm("Clear every item from this canvas?")) return;
    setElements([]);
    setSelectedId(null);
  };

  const save = async () => {
    const preview = stageRef.current?.toDataURL({ pixelRatio: 1 });
    try {
      await saveElements(elements, preview);
      setSaveError("");
      setSaved(true);
      window.setTimeout(() => setSaved(false), 1800);
    } catch {
      setSaved(false);
      setSaveError("Could not save. Check that the Roomify backend is running.");
    }
  };

  const exportPng = () => {
    const dataUrl = stageRef.current?.toDataURL({ pixelRatio: 2 });
    if (!dataUrl) return;
    const link = document.createElement("a");
    link.download = `${design.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`;
    link.href = dataUrl;
    link.click();
  };

  const changeAndPersist = (changes: Partial<FurnitureElement>) => {
    if (!selected) return;
    changeElement(selected.id, changes);
  };

  return (
    <div className="flex min-h-screen flex-col bg-sand">
      <Navbar />
      <div className="border-b border-stone bg-white">
        <div className="mx-auto flex min-h-14 max-w-[1500px] items-center justify-between gap-3 px-4 py-2 lg:px-6">
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">{design.name}</div>
            <div className="text-xs text-neutral-500">{design.roomType} · {design.style}</div>
          </div>
          <div className="flex items-center gap-2">
            {saved && <span className="hidden text-xs font-semibold text-emerald-700 sm:block">Saved to database</span>}
            <Button variant="secondary" onClick={save}><Save size={16} /> <span className="hidden sm:inline">Save</span></Button>
            <Button onClick={exportPng}><Download size={16} /> <span className="hidden sm:inline">Export PNG</span></Button>
          </div>
        </div>
      </div>

      {saveError && <p role="alert" className="bg-red-50 px-4 py-2 text-center text-sm text-red-700">{saveError}</p>}

      <div className="flex flex-wrap gap-2 border-b border-stone bg-white px-4 py-2 lg:hidden">
        <Button variant="secondary" onClick={() => setMobilePanel("furniture")}><Menu size={16} /> Furniture</Button>
        <Button variant="secondary" onClick={() => setMobilePanel("properties")}>Properties</Button>
        <Button variant="secondary" onClick={clear}><Eraser size={16} /> Clear</Button>
      </div>

      <main className="mx-auto flex w-full max-w-[1500px] flex-1 flex-col lg:flex-row">
        <div className="hidden lg:flex"><FurniturePanel onAdd={addFurniture} /></div>
        <RoomCanvas
          roomImage={design.roomImage}
          elements={elements}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onChange={changeElement}
          stageRef={stageRef}
        />
        <div className="hidden lg:flex"><PropertiesPanel element={selected} onChange={changeAndPersist} onDuplicate={duplicate} onDelete={remove} /></div>
      </main>

      <div className="hidden border-t border-stone bg-white px-6 py-3 text-xs text-neutral-500 lg:flex lg:justify-between">
        <span>Tip: drag an item to move it. Select it to reveal resize and rotation handles.</span>
        <button onClick={clear} className="font-semibold text-red-700 hover:underline">Clear canvas</button>
      </div>

      {mobilePanel && (
        <div className="fixed inset-0 z-[60] bg-black/30 lg:hidden" onClick={() => setMobilePanel(null)}>
          <div className="absolute inset-x-0 bottom-0 max-h-[80vh] overflow-auto rounded-t-3xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-stone px-5 py-4">
              <h2 className="font-semibold">{mobilePanel === "furniture" ? "Furniture & Decor" : "Properties"}</h2>
              <button aria-label="Close panel" onClick={() => setMobilePanel(null)} className="rounded-lg p-2 hover:bg-sand"><X size={19} /></button>
            </div>
            {mobilePanel === "furniture"
              ? <FurniturePanel onAdd={addFurniture} />
              : <PropertiesPanel element={selected} onChange={changeAndPersist} onDuplicate={duplicate} onDelete={remove} />}
          </div>
        </div>
      )}
    </div>
  );
}
