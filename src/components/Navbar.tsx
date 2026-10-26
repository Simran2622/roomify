import { ArrowRight, Box } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Button from "./Button";

export default function Navbar() {
  const location = useLocation();
  const isEditor = location.pathname.startsWith("/design/");
  return (
    <header className={`z-50 border-b border-stone/80 bg-white/95 backdrop-blur ${isEditor ? "sticky top-0" : ""}`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link to="/" className="flex items-center gap-2 font-bold tracking-tight" aria-label="Roomify home">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-ink text-white">
            <Box size={19} />
          </span>
          <span className="text-lg">Roomify</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-neutral-600 md:flex">
          <a href="/#features" className="hover:text-ink">Features</a>
          <a href="/#how-it-works" className="hover:text-ink">How It Works</a>
          <Link to="/dashboard" className="hover:text-ink">My Designs</Link>
        </nav>
        <Button onClick={() => window.location.assign("/design/new")}>
          Start Designing <ArrowRight size={16} />
        </Button>
      </div>
    </header>
  );
}
