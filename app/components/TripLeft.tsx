import styles from '@/styles/trips.module.css';
import LocationMap from '@/components/LocationMap';
import { NewStopValues } from '@/components/TripCalendar';

interface TripLeftProps {
  readonly membersComponent?: React.ReactNode;
  readonly stops?: Record<string, NewStopValues[]>;
}

export default function TripLeft({membersComponent, stops = {}}: TripLeftProps) {
  const markers = Object.values(stops)
    .flat()
    .filter(s => s.lat !== null && s.lng !== null)
    .map(s => ({ position: { lat: s.lat!, lng: s.lng! }, title: s.title }));

  return (
    <div className={styles.tripLeft}>

      {/* Map */}
      <div className={styles.tripLabels}>Map</div>
      <div className={styles.tripMap}>
        <LocationMap
            center={{ lat: 47.36667, lng: 8.55 }}
            zoom={13}
            markers={markers}
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