import { useState, useEffect, useRef } from "react";
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
  const hasCentered = useRef(false);

  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const latlng: [number, number] = [
          pos.coords.latitude,
          pos.coords.longitude,
        ];

        setPosition(latlng);
        setAccuracy(pos.coords.accuracy);

        // Only auto-center once (prevents annoying snapping)
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

    return () => navigator.geolocation.clearWatch(watchId);
  }, [map]);

  if (!position) return null;

  return (
    <>
      {accuracy && (
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
      <Marker position={position} icon={userLocationIcon} />
    </>
  );
}

export default UserLocation;
