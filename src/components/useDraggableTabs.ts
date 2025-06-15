
import { useRef, useState } from "react";

// Hook for drag-and-drop tab reordering
export function useDraggableTabs(items: string[], onMove: (updated: string[]) => void) {
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const dragging = useRef<string | null>(null);

  const listeners = {
    onDragStart: (idx: number) => {
      setDraggedIdx(idx);
      dragging.current = items[idx];
    },
    onDragEnter: (idx: number) => {
      setHoverIdx(idx);
    },
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
    },
    onDrop: (idx: number) => {
      if (draggedIdx !== null && draggedIdx !== idx) {
        const updated = [...items];
        const [moved] = updated.splice(draggedIdx, 1);
        updated.splice(idx, 0, moved);
        onMove(updated);
      }
      setDraggedIdx(null);
      setHoverIdx(null);
      dragging.current = null;
    },
    onDragEnd: () => {
      setDraggedIdx(null);
      setHoverIdx(null);
      dragging.current = null;
    },
  };

  return { draggedIdx, hoverIdx, listeners };
}
