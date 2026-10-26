import { useCallback, useEffect, useState } from "react";
import { getDesignById, updateDesign } from "../services/localStorage";
import type { Design, FurnitureElement } from "../types";

export function useDesign(id: string | undefined) {
  const [design, setDesign] = useState<Design | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    getDesignById(id)
      .then((result) => { if (!cancelled) setDesign(result); })
      .catch(() => { if (!cancelled) setDesign(null); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [id]);

  const saveElements = useCallback(async (elements: FurnitureElement[], preview?: string) => {
    if (!id) return;
    const updated = await updateDesign(id, {
      elements,
      ...(preview ? { preview } : {}),
    });
    setDesign(updated);
  }, [id]);

  return { design, setDesign, loading, saveElements };
}
