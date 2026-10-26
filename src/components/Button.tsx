import type { ButtonHTMLAttributes, ReactNode } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
}

export default function Button({ children, variant = "primary", className = "", ...props }: Props) {
  const styles = {
    primary: "bg-ink text-white hover:bg-[#3b3934]",
    secondary: "border border-stone bg-white text-ink hover:bg-sand",
    ghost: "text-ink hover:bg-sand",
    danger: "bg-red-50 text-red-700 hover:bg-red-100",
  };
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-accent/40 disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
