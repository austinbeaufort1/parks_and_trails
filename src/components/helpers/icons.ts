import L from "leaflet";

// default start marker
export const startMarkerIcon = (number: number = 1) =>
  L.divIcon({
    className: "start-marker",
    html: `<div class="start-marker-inner">${number}</div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });

// completed start marker (different color / emoji)
export const completedMarkerIcon = (completions: number = 1) =>
  L.divIcon({
    className: "start-marker completed", // extra class for styling
    html: `<div class="start-marker-inner">${
      completions > 0 ? "😊" : completions
    }</div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
