import { useMapEvent } from "react-leaflet";
import { TrailCard } from "../../types/trail";

export function MapClickHandler({
  sidebarOpen,
  overlayTrail,
  onCloseSidebar,
  onDeselectTrail,
}: {
  sidebarOpen: boolean;
  overlayTrail: TrailCard | null;
  onCloseSidebar: () => void;
  onDeselectTrail: () => void;
}) {
  useMapEvent("click", () => {
    if (sidebarOpen) {
      onCloseSidebar(); // close sidebar only
    } else if (overlayTrail) {
      onDeselectTrail(); // deselect trail
    }
  });

  return null;
}
