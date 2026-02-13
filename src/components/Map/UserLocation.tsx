import { useState, useRef } from "react";
import { Marker, useMap, Circle } from "react-leaflet";
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

function UserLocation() {
  const map = useMap();
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const hasCentered = useRef(false);
  const watchIdRef = useRef<number | null>(null);

  const startTracking = () => {
    if (!navigator.geolocation) return;

    setIsTracking(true);

    watchIdRef.current = navigator.geolocation.watchPosition(
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
      },
      (err) => {
        console.error("Geolocation error:", err);
      },
      {
        enableHighAccuracy: true,
      },
    );
  };

  // Optional: stop tracking if component unmounts
  // (good practice)
  if (watchIdRef.current && !isTracking) {
    navigator.geolocation.clearWatch(watchIdRef.current);
  }

  return (
    <>
      {!isTracking && (
        <button
          onClick={startTracking}
          style={{
            position: "absolute",
            bottom: 30,
            right: 20,
            zIndex: 1000,
            padding: "12px 16px",
            background: "#3399ff", // Dodger Blue
            color: "white", // text/icon contrast
            borderRadius: 12, // rounded pill shape
            border: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 14,
            display: "flex",
            alignItems: "center",
            gap: 6,
            transition: "transform 0.1s, background 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "scale(1.05)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          🧭 Locate Me
        </button>
      )}

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

export default UserLocation;
