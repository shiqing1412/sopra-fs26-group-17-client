import styles from '@/styles/trips.module.css';
import LocationMap from '@/components/LocationMap';

interface TripLeftProps {
  readonly membersComponent?: React.ReactNode;
}

export default function TripLeft({membersComponent}: TripLeftProps) {
  return (
    <div className={styles.tripLeft}>

      {/* Map */}
      <div className={styles.tripLabels}>Map</div>
      <div className={styles.tripMap}>
        <LocationMap
            center={{ lat: 47.36667, lng: 8.55 }}
            zoom={13}
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