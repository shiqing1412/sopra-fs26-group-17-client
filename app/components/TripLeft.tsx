import React from 'react';
import styles from '@/styles/trips.module.css';

interface TripLeftProps {
  readonly mapComponent?: React.ReactNode;
  readonly membersComponent?: React.ReactNode;
}

export default function TripLeft({ mapComponent, membersComponent }: TripLeftProps) {
  return (
    <div className={styles.tripLeft}>

      {/* Map */}
      <div className={styles.tripLabels}>Map</div>
      <div className={styles.tripMap}>
        {mapComponent ?? null}
      </div>

      {/* Members */}
      <div className={styles.tripLabels}>Members</div>
      <div className={styles.tripMembers}>
        {membersComponent ?? null}
      </div>

    </div>
  );
}