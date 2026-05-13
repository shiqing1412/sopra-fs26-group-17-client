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
  highlightedMarkerId,
}: {
  readonly center?: LatLng;
  readonly zoom?: number;
  readonly style?: React.CSSProperties;
  readonly markers?: ReadonlyArray<{ readonly id:string, readonly position: LatLng; readonly title?: string }>;
  readonly onMarkerClick?: (id: string) => void;
  readonly highlightedMarkerId?: string | null;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerInstancesRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const markerMapRef = useRef<Map<string, { marker: google.maps.marker.AdvancedMarkerElement; position: LatLng; pin: HTMLElement }>>(new Map());
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const userInteractingRef = useRef(false);
  const boundsFittedRef = useRef(false);
  const lastHighlightTimeRef = useRef<number>(0);

  // load google maps script
  useEffect(() => {
    if (typeof globalThis.window === "undefined") return;
    const check = () => {
      if (globalThis.window.google?.maps) setIsLoaded(true);
      else setTimeout(check, 100);
    };
    check();
  }, []);

  // initialize map
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;
    try {
      mapInstanceRef.current = new globalThis.window.google.maps.Map(mapRef.current, {
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
    markerMapRef.current.clear();

    // Count how many markers share the same position
    const positionCount = new Map<string, number>();

    // Add new markers
    markers.forEach(({ id, position, title }) => {
      const key = `${position.lat},${position.lng}`;
      const count = positionCount.get(key) ?? 0;
      positionCount.set(key, count + 1);

      // Offset each duplicate by a small amount
      const angle = count * (Math.PI * 0.7);
      const radius = count === 0 ? 0 : 0.001 * Math.ceil(count / 6);
      const offsetPosition = {
        lat: position.lat + radius * Math.cos(angle),
        lng: position.lng + radius * Math.sin(angle),
      };

      const pin = document.createElement("div");
      pin.textContent = "📍";
      pin.style.fontSize = "2rem";
      pin.style.cursor = "pointer";
      pin.addEventListener("click", () => { onMarkerClick?.(id); });

      const marker = new globalThis.window.google.maps.marker.AdvancedMarkerElement({
        position: offsetPosition,
        map,
        title,
        content: pin,
      });
      markerInstancesRef.current.push(marker);
      markerMapRef.current.set(id, { marker, position: offsetPosition, pin });
    });

    // adjust map to fit all markers
    if (markers.length === 0) return;
    if (!userInteractingRef.current && !boundsFittedRef.current) {
      const timeSinceHighlight = Date.now() - lastHighlightTimeRef.current;
      if (timeSinceHighlight < 5000) return; // skip if highlighted in last 5 seconds
      if (markers.length === 1) {
        map.setCenter(markers[0].position);
        map.setZoom(13);
      } else {
        const bounds = new globalThis.window.google.maps.LatLngBounds();
        markers.forEach(({ position }) => bounds.extend(position));
        map.fitBounds(bounds);
      }
      boundsFittedRef.current = true;
    }
  }, [markers, isLoaded, onMarkerClick]);

  // zoom into pin when stop is clicked
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !highlightedMarkerId) return;
    const entry = markerMapRef.current.get(highlightedMarkerId);
    if (!entry) return;

    map.panTo(entry.position);
    map.setZoom(15);
    lastHighlightTimeRef.current = Date.now();

    // scale up the pin
    markerMapRef.current.forEach(({ pin }, id) => {
      pin.style.fontSize = id === highlightedMarkerId ? "2.8rem" : "2rem";
      pin.style.filter = id === highlightedMarkerId ? "drop-shadow(0 0 6px rgba(0,0,0,0.4))" : "none";
    });
  }, [highlightedMarkerId]);


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