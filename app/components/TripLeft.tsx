import styles from '@/styles/trips.module.css';
import LocationMap from '@/components/LocationMap';
import { NewStopValues } from '@/components/TripCalendar';
import { useEffect, useRef } from 'react';

interface TripLeftProps {
  readonly membersComponent?: React.ReactNode;
  readonly stops?: Record<string, NewStopValues[]>;
  readonly highlightedStopId: string | null;
  readonly setHighlightedStopId: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function TripLeft({membersComponent, stops = {}, setHighlightedStopId}: TripLeftProps) {
  // remove highlighted stop when clicking outside the map
  const mapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (mapRef.current && !mapRef.current.contains(e.target as Node)) {
        setHighlightedStopId(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [setHighlightedStopId]);
    
  const markers = Object.values(stops)
    .flat()
    .filter(s => s.lat !== null && s.lng !== null)
    .map(s => ({ id: s.id, position: { lat: s.lat!, lng: s.lng! }, title: s.title }));

  return (
    <div className={styles.tripLeft}>

      {/* Map */}
      <div className={styles.tripLabels}>Map</div>
      <div className={styles.tripMap} ref={mapRef}>
        <LocationMap
            center={{ lat: 47.36667, lng: 8.55 }}
            zoom={13}
            markers={markers}
            onMarkerClick={setHighlightedStopId}
            style={{ height: '100%', width: '100%' }}
          />
      </div>

      {/* Members */}
      <div className={styles.tripLabels}>Members</div>
      <div className={styles.tripMembers}>
        {membersComponent ?? null}
      </div>

    </div>
  );
}