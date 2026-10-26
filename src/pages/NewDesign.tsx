import { ImagePlus, ArrowRight } from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Navbar from "../components/Navbar";
import { builtInRooms, interiorStyles, roomTypes } from "../data/roomStyles";
import { createDesign, makeId } from "../services/localStorage";
import type { InteriorStyle, RoomType } from "../types";

export default function NewDesign() {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [roomType, setRoomType] = useState<RoomType>("Living Room");
  const [style, setStyle] = useState<InteriorStyle>("Modern");
  const [roomImage, setRoomImage] = useState(builtInRooms[0].value);
  const [error, setError] = useState("");

  const handleUpload = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setRoomImage(String(reader.result));
    reader.readAsDataURL(file);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please give your design a name.");
      return;
    }
    const id = makeId();
    try {
      await createDesign({
      id,
      name: name.trim(),
      roomType,
      style,
      roomImage,
      elements: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      });
      navigate(`/design/${id}`);
    } catch {
      setError("Could not save your design. Make sure the Roomify backend is running.");
    }
  };

  return (
    <div className="min-h-screen bg-sand">
      <Navbar />
      <main className="mx-auto max-w-5xl px-5 py-10 lg:px-8 lg:py-16">
        <div className="mb-9">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-accent">New project</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Create a room design</h1>
          <p className="mt-2 text-neutral-500">Set the basics, then arrange everything in the editor.</p>
        </div>
        <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <div className="rounded-2xl border border-stone bg-white p-6 shadow-soft">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold">Design name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Cozy Living Room" className="w-full rounded-xl border border-stone px-4 py-3 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20" />
            </label>
            <label className="mt-6 block">
              <span className="mb-2 block text-sm font-semibold">Room type</span>
              <select value={roomType} onChange={(e) => setRoomType(e.target.value as RoomType)} className="w-full rounded-xl border border-stone bg-white px-4 py-3 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20">
                {roomTypes.map((type) => <option key={type}>{type}</option>)}
              </select>
            </label>
            <div className="mt-6">
              <span className="mb-2 block text-sm font-semibold">Interior style</span>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {interiorStyles.map((item) => (
                  <button type="button" key={item} onClick={() => setStyle(item)} className={`rounded-xl border px-3 py-3 text-sm font-medium ${style === item ? "border-ink bg-ink text-white" : "border-stone hover:bg-sand"}`}>
                    {item}
                  </button>
                ))}
              </div>
            </div>
            {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
            <Button type="submit" className="mt-7 w-full py-3.5">Start Designing <ArrowRight size={17} /></Button>
          </div>

          <div className="rounded-2xl border border-stone bg-white p-6 shadow-soft">
            <div className="mb-4">
              <h2 className="font-semibold">Room background</h2>
              <p className="mt-1 text-sm text-neutral-500">Choose a built-in scene or upload your own room image.</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {builtInRooms.map((room) => (
                <button type="button" key={room.id} onClick={() => setRoomImage(room.value)} className={`overflow-hidden rounded-xl border-2 ${roomImage === room.value ? "border-ink" : "border-transparent"}`}>
                  <img src={room.value} alt={room.name} className="aspect-video w-full object-cover" />
                  <span className="block bg-white px-2 py-2 text-left text-xs font-medium">{room.name}</span>
                </button>
              ))}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e.target.files?.[0])} />
            <button type="button" onClick={() => fileRef.current?.click()} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-stone px-4 py-4 text-sm font-semibold hover:bg-sand">
              <ImagePlus size={18} /> Upload room image
            </button>
            <div className="mt-5 overflow-hidden rounded-2xl bg-sand">
              <img src={roomImage} alt="Selected room background preview" className="aspect-video w-full object-cover" />
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
