"use client";

import { useEffect, useRef, useState } from "react";

interface LatLng {
  lat: number;
  lng: number;
}

export default function LocationMap({
  center = { lat: 47.36667, lng: 8.55 },
  zoom = 13,
  style,
}: {
  center?: LatLng;
  zoom?: number;
  style?: React.CSSProperties;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // load google maps script
  useEffect(() => {
    if (typeof window === "undefined") return;
    const check = () => {
      if (window.google?.maps) setIsLoaded(true);
      else setTimeout(check, 100);
    };
    check();
  }, []);

  // initialize map
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;
    try {
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center,
        zoom,
        fullscreenControl: true,
        zoomControl: true,
        streetViewControl: false,
        cameraControl: false,
        mapTypeControl: false,
        styles: [{ featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] }],
      });
    } catch {
      setError("Failed to initialize Google Maps.");
    }
  }, [isLoaded]);

  // update center/zoom when props change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.setCenter(center);
    map.setZoom(zoom);
  }, [center, zoom]);

  if (error) return <div style={style}>Map failed to load.</div>;

  return (
    <div style={{ position: "relative", ...style }}>
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
      {!isLoaded && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "#e5e7eb" }}>
          <span style={{ color: "#9ca3af", fontSize: "0.875rem" }}>Loading map…</span>
        </div>
      )}
    </div>
  );
}