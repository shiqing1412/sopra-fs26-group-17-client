import React, { useEffect, useState } from 'react';
import styles from '@/styles/trips.module.css';
import { useApi } from '@/hooks/useApi';
import { getAvatarColor, getAvatarInitial } from '@/utils/avatarColors';
import useLocalStorage from '@/hooks/useLocalStorage';
import { User } from '@/types/user';

interface Member {
  username: string;
  status: string;
  role: string;
}

interface TripLeftProps {
  readonly mapComponent?: React.ReactNode;
  readonly tripId?: string | null;
}

export default function TripLeft({ mapComponent, tripId }: TripLeftProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const apiService = useApi();
  const { value: user } = useLocalStorage<User | null>("user", null);

  useEffect(() => {
    if (!tripId) return;

    const fetchMembers = async () => {
      try {
        const fetched = await apiService.get<Member[]>(`/trips/${tripId}/members`);
        setMembers(fetched.filter((m) => m.username !== user?.username));
      } catch (error) {
        console.error("Failed to fetch members:", error);
      }
    };

    fetchMembers();
  }, [tripId]);

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
        {members.map((m) => (
          <div key={m.username} className={styles.memberItem}>
            <div
              className={styles.navAvatar}
              style={{ background: getAvatarColor(m.username) }}
            >
              {getAvatarInitial(m.username ?? null)}
            </div>
            <span>{m.username}</span>
          </div>
        ))}
      </div>

    </div>
  );
}