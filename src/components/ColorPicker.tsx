interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function ColorPicker({ value, onChange }: Props) {
  return (
    <label className="flex items-center justify-between rounded-xl border border-stone bg-white px-3 py-2">
      <span className="text-sm font-medium">Color</span>
      <span className="flex items-center gap-2">
        <span className="text-xs uppercase text-neutral-400">{value}</span>
        <input
          aria-label="Furniture color"
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-10 cursor-pointer rounded border-0 bg-transparent p-0"
        />
      </span>
    </label>
  );
}
