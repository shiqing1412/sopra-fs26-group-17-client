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
  markers = [],
  onMarkerClick,
}: {
  center?: LatLng;
  zoom?: number;
  style?: React.CSSProperties;
  markers?: Array<{ id:string, position: LatLng; title?: string }>;
  onMarkerClick?: (id: string) => void;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerInstancesRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const userInteractingRef = useRef(false);
  const boundsFittedRef = useRef(false);

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
        mapId: "ad75625746e20fc2519442a1",
        fullscreenControl: true,
        zoomControl: true,
        streetViewControl: false,
        cameraControl: false,
        mapTypeControl: false,
      });
      mapInstanceRef.current.addListener("dragstart", () => { userInteractingRef.current = true; });
      mapInstanceRef.current.addListener("zoom_changed", () => { userInteractingRef.current = true; });
      mapInstanceRef.current.addListener("click", () => { userInteractingRef.current = true; });
    } catch {
      setError("Failed to initialize Google Maps.");
    }

    const handleOutsideClick = (e: MouseEvent) => {
      if (mapRef.current && !mapRef.current.contains(e.target as Node)) {
        userInteractingRef.current = false;
        boundsFittedRef.current = false;
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [isLoaded]);

  // Sync markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    markerInstancesRef.current.forEach((m) => m.map = null);
    markerInstancesRef.current = [];

    // Add new markers
    markers.forEach(({ id, position, title }) => {
      const pin = document.createElement("div");
      pin.textContent = "📍";
      pin.style.fontSize = "2rem";
      pin.style.cursor = "pointer";
      pin.addEventListener("click", () => { onMarkerClick?.(id); });

      const marker = new window.google.maps.marker.AdvancedMarkerElement({
        position,
        map,
        title,
        content: pin,
      });
      markerInstancesRef.current.push(marker);
    });

    // adjust map to fit all markers
    if (markers.length === 0) return;
    if (!userInteractingRef.current && !boundsFittedRef.current) {
      if (markers.length === 1) {
        map.setCenter(markers[0].position);
        map.setZoom(13);
      } else {
        const bounds = new window.google.maps.LatLngBounds();
        markers.forEach(({ position }) => bounds.extend(position));
        map.fitBounds(bounds);
      }
      boundsFittedRef.current = true;
    }
  }, [markers, isLoaded]);
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