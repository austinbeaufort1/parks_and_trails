import { useState, useRef, useEffect } from "react";
import { Marker, Circle, useMap } from "react-leaflet";
import L from "leaflet";

const userLocationIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      width:16px;
      height:16px;
      background:#1e90ff;
      border:3px solid white;
      border-radius:50%;
      box-shadow:0 0 6px rgba(0,0,0,0.3);
    "></div>
  `,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

export default function UserLocation() {
  const map = useMap();
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  const hasCentered = useRef(false);

  // --- Add the button handler inside the component ---
  const handleLocateClick = () => {
    if (!navigator.geolocation) return;

    // First, prompt the user
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const latlng: [number, number] = [
          pos.coords.latitude,
          pos.coords.longitude,
        ];
        setPosition(latlng);
        setAccuracy(pos.coords.accuracy);

        if (!hasCentered.current) {
          map.setView(latlng, 15);
          hasCentered.current = true;
        }

        // Start continuous tracking
        const id = navigator.geolocation.watchPosition(
          (pos) => {
            const latlng: [number, number] = [
              pos.coords.latitude,
              pos.coords.longitude,
            ];
            setPosition(latlng);
            setAccuracy(pos.coords.accuracy);
          },
          (err) => console.error(err),
          { enableHighAccuracy: true },
        );
        setWatchId(id);
      },
      (err) => console.error(err),
      { enableHighAccuracy: true },
    );
  };

  // Cleanup watch on unmount
  useEffect(() => {
    return () => {
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
    };
  }, [watchId]);

  return (
    <>
      {/* Button users click to trigger geolocation */}
      <button
        onClick={handleLocateClick}
        style={{
          position: "absolute",
          bottom: 16,
          right: 16,
          zIndex: 1000,
          background: "#1e90ff",
          color: "white",
          border: "none",
          borderRadius: 8,
          padding: "8px 12px",
          cursor: "pointer",
        }}
      >
        🧭 Locate Me
      </button>

      {position && accuracy && (
        <Circle
          center={position}
          radius={accuracy}
          pathOptions={{
            color: "#1e90ff",
            fillColor: "#1e90ff",
            fillOpacity: 0.1,
            weight: 1,
          }}
        />
      )}
      {position && <Marker position={position} icon={userLocationIcon} />}
    </>
  );
}
