"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import useLocalStorage from "@/hooks/useLocalStorage";
import { Trip } from "@/types/trip";
import { User } from "@/types/user";
import styles from "@/styles/trips.module.css";
import Logout from "@/components/Logout";
import TripCalendar from "@/components/TripCalendar";
import { Trispace } from "next/font/google";
import dayjs, { Dayjs } from "dayjs";
import { Modal } from "antd";
import Link from "next/link";

const Profile: React.FC = () => {
  const router = useRouter();
  const apiService = useApi();
  const [settingsOpen, setSettingsOpen] = useState(false);
   
  const { value: user } = useLocalStorage<User | null>("user", null);
  const { value: trip } = useLocalStorage<Trip | null>("trip", null);

  const { handleLogout } = Logout();
  
  {/* todo functions: addStop, editStop, leaveTrip */}

  return (
    <div className={styles.page}> 
      <nav className={styles.nav}> {/* start header */}
        <div className={styles.logo}>
          Wander<span className={styles.logoAccent}>Sync</span>
        </div>
        <div className={styles.navUser}>
          <div className={styles.navAvatar}>
            {user?.username?.[0]?.toUpperCase() ?? "?"}      {/* initial of username */}
          </div>
          <span className={styles.navUsername}>
            {user?.username ?? "Guest"}                      {/* username from localStorage */}
          </span>
          <button className={styles.logoutBtn} onClick={handleLogout}>
          Log out
          </button>
        </div>
      </nav>
      <nav className={styles.nav}> {/* start sub header */}
        <div className={styles.subHeader}>
          <Link href="/trips" style={{ color: "#444", fontWeight: 300 }}>← Trips</Link>
          <span className={styles.tripTitle}>{trip?.tripTitle}</span>
          <span className={styles.dateRange}>{dayjs(trip?.startDate).format("MMM D")} – {dayjs(trip?.endDate).format("MMM D, YYYY")}</span>
        </div>
        <div>
          <button className={styles.settingsBtn} onClick={() => setSettingsOpen(true)}>
            ⚙︎ Settings
          </button>
        </div>
      </nav>
      <Modal
        title="Trip Settings"
        open={settingsOpen}
        onCancel={() => setSettingsOpen(false)}
        footer={null}
      >
      </Modal>

        {/* calendar view */}
        {trip && <TripCalendar trip={trip} />}

        {/* TODO new trip card, new trip, display (no) existing trips */}

    </div>
  );
};

export default Profile;