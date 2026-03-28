"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import useLocalStorage from "@/hooks/useLocalStorage";
import { Trip } from "@/types/trip";
import { User } from "@/types/user";
import styles from "@/styles/trips.module.css";


const Dashboard: React.FC = () => {
  const router = useRouter();
  const apiService = useApi();
  const [trips, setTrips] = useState<Trip[] | null>(null);
 
  const {
    value: user
  } = useLocalStorage<User | null>("user", null); // read logged-in user
  const {
    clear: clearToken
  } = useLocalStorage<string>("token", "");
 
  const handleLogout = (): void => {
    // Yara TODO --------------------------------------------------------------
  };

  const handleNewTrip = (): void => {
    // Yara TODO ---------------------------------------------------------------
  };

  useEffect(() => {
    if (!user) return;

    const fetchTrips = async () => {
      try {
        const fetchedTrips = await apiService.get<Trip[]>(`/users/${user.id}/trips`);
        setTrips(fetchedTrips ?? []);
      } catch (error) {
        if (error instanceof Error) {
          alert(`Failed to fetch trips:\n${error.message}`);
        } else {
          console.error("An unknown error occurred while fetching trips.");
        }
      }
    };

    fetchTrips();
  }, [apiService, user]);

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
        </div>

        {/* TODO new trip card, new trip, display (no) existing trips, logout button */}

      </nav>
    </div>
  );
};

export default Dashboard;