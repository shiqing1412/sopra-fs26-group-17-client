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

const Profile: React.FC = () => {
  const router = useRouter();
  const apiService = useApi();
   
  const { value: user } = useLocalStorage<User | null>("user", null);
  const { value: trip } = useLocalStorage<Trip | null>("trip", null);

  const { handleLogout } = Logout();
  
  {/* todo functions: addStop, editStop, leaveTrip */}

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
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

        {/* calendar view */}
        {trip && trip.startDate && trip.endDate && <TripCalendar trip={trip} />}
      
        {/* TODO new trip card, new trip, display (no) existing trips */}

      </nav>
    </div>
  );
};

export default Profile;