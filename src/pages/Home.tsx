import { ArrowRight, Check, Move, Palette, Save, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Button from "../components/Button";

export default function Home() {
  return (
    <div className="min-h-screen bg-sand">
      <Navbar />
      <main>
        <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-stone bg-white px-3 py-1.5 text-xs font-semibold text-neutral-600">
              <Sparkles size={14} /> A simple 2D design studio
            </div>
            <h1 className="max-w-2xl text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
              Design Your Room, Your Way.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-neutral-600">
              Build room layouts visually, move furniture around freely, customize pieces, and save your ideas — all directly in your browser.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/design/new"><Button className="px-5 py-3">Start Designing <ArrowRight size={17} /></Button></Link>
              <Link to="/dashboard"><Button variant="secondary" className="px-5 py-3">View My Designs</Button></Link>
            </div>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-[2rem] border border-stone bg-white p-3 shadow-soft">
              <div className="overflow-hidden rounded-[1.5rem] bg-[#e8e1d6]">
                <div className="relative h-[420px]">
                  <div className="absolute inset-x-0 top-0 h-2/3 bg-[#e9e1d5]" />
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[#c7af92]" />
                  <div className="absolute left-10 top-12 h-36 w-48 rounded-lg border-8 border-white bg-[#cbd8d5]" />
                  <div className="absolute bottom-20 left-1/2 h-24 w-64 -translate-x-1/2 rounded-3xl bg-[#a98f74] shadow-lg" />
                  <div className="absolute bottom-28 left-1/2 h-12 w-52 -translate-x-1/2 rounded-2xl bg-[#c1ab91]" />
                  <div className="absolute bottom-16 right-16 h-24 w-16 rounded-b-xl bg-[#a97a55]" />
                  <div className="absolute bottom-36 right-20 h-24 w-8 rounded-full bg-[#71886d]" />
                  <div className="absolute bottom-44 right-9 h-16 w-20 rounded-full bg-[#7d9477]" />
                  <div className="absolute bottom-40 right-24 h-16 w-20 rounded-full bg-[#7d9477]" />
                </div>
              </div>
            </div>
            <div className="absolute -bottom-5 -left-5 rounded-2xl border border-stone bg-white p-4 shadow-soft">
              <p className="text-xs font-semibold text-neutral-500">LIVE CANVAS</p>
              <p className="mt-1 font-semibold">Drag. Resize. Rotate.</p>
            </div>
          </div>
        </section>

        <section id="features" className="border-y border-stone bg-white">
          <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[.2em] text-accent">Everything you need</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight">A focused workspace for room ideas.</h2>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[
                [Move, "Interactive 2D editor", "Arrange every piece directly on the room canvas."],
                [ArrowRight, "Drag & drop furniture", "Add sofas, beds, chairs, desks and more with one click."],
                [Palette, "Customize your layout", "Resize, rotate and recolor simple furniture elements."],
                [Save, "Save & export", "Keep designs in your browser and export the finished canvas as PNG."],
              ].map(([Icon, title, desc]) => {
                const I = Icon as typeof Move;
                return <div key={title as string} className="rounded-2xl border border-stone bg-sand p-6">
                  <div className="mb-5 grid h-11 w-11 place-items-center rounded-xl bg-white"><I size={20} /></div>
                  <h3 className="font-semibold">{title as string}</h3>
                  <p className="mt-2 text-sm leading-6 text-neutral-600">{desc as string}</p>
                </div>;
              })}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.2em] text-accent">How it works</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight">From blank room to finished idea in four steps.</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {["Choose your room", "Add furniture", "Customize your design", "Save or export"].map((item, i) => (
                <div key={item} className="flex gap-4 rounded-2xl border border-stone bg-white p-5">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink text-xs font-bold text-white">{i + 1}</span>
                  <div><h3 className="font-semibold">{item}</h3><p className="mt-1 text-sm text-neutral-500">Make the next simple choice in the editor.</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 pb-20 lg:px-8">
          <div className="mx-auto max-w-7xl rounded-3xl bg-ink px-6 py-14 text-white sm:px-12">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tight">Have a room in mind?</h2>
              <p className="mt-3 leading-7 text-white/70">Start with a simple layout and turn your idea into something you can see.</p>
              <Link to="/design/new" className="mt-7 inline-block"><Button variant="secondary">Create a design <ArrowRight size={16} /></Button></Link>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-stone bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-8 text-sm text-neutral-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <span className="font-semibold text-ink">Roomify</span>
          <span>Frontend-only room design studio.</span>
        </div>
      </footer>
    </div>
  );
}
