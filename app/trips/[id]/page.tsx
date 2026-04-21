"use client";

import React, { useState, useEffect } from "react";
import useLocalStorage from "@/hooks/useLocalStorage";
import { Trip } from "@/types/trip";
import { User } from "@/types/user";
import styles from "@/styles/trips.module.css";
import Logout from "@/components/Logout";
import TripCalendar from "@/components/TripCalendar";
import dayjs from "dayjs";
import { Form, Button, Modal } from "antd";
import Link from "next/link";
import { useProtectedRoute } from "@/components/ProtectedRoute";
import { useApi } from "@/hooks/useApi";
import ShareLink from "@/components/ShareLink";
import LeaveTrip from "@/components/LeaveTrip";
import MemberOnlineStatus from "@/components/MemberOnlineStatus";
import { getAvatarColor } from "@/utils/avatarColors";
import { useParams } from "next/navigation";

const Profile: React.FC = () => {
  const { isLoading } = useProtectedRoute();
  const { id } = useParams<{ id: string }>();

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [shareLinkOpen, setShareLinkOpen] = useState(false);
  const [LeaveTripOpen, setLeaveTripOpen] = useState(false);
  const [allMembers, setAllMembers] = useState<string[]>([]);
  const [trip, setTrip] = useState<Trip | null>(null);

  const { value: user } = useLocalStorage<User | null>("user", null);
  const { value: storedTrip } = useLocalStorage<Trip | null>("trip", null);

  const apiService = useApi();

  const { handleLogout } = Logout();

  useEffect(() => {
    if (storedTrip && String(storedTrip.tripId) === id) {
      setTrip(storedTrip);
    } else {
      apiService.get<Trip>(`/trips/${id}`)
        .then(setTrip)
        .catch((err) => console.error("Failed to fetch trip", err));
    }
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!trip?.tripId) return;

    const fetchData = async () => {
      try {
        const [memberResponse, tripResponse] = await Promise.all([ // use promise to load simultaneously
        apiService.get<{ members: string[] }>(`/trips/${trip.tripId}/members`),
        apiService.get<Trip>(`/trips/${trip.tripId}`)
      ]);

        setAllMembers(prev => {
          const next = memberResponse.members ?? [];
          if (JSON.stringify(prev) === JSON.stringify(next)) return prev;
          return next;
        });

        setTrip(prev => {
          if (!prev) return tripResponse;  // trip is null (first load)
          if (JSON.stringify(prev) === JSON.stringify(tripResponse)) return prev;
          return { ...prev, ...tripResponse }; // merge instead of replacing
        });

      } catch (error) {
        console.error("Failed to poll", error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 5000); // polls every 5sec

    return () => clearInterval(intervalId);
  }, [trip?.tripId]); // eslint-disable-line react-hooks/exhaustive-deps

  {/* todo functions: addStop, editStop */}
  if (isLoading) return null;

  return (
    <div className={styles.page}> 
      <nav className={styles.nav}> {/* start header */}
        <div className={styles.logo}>
          Wander<span className={styles.logoAccent}>Sync</span>
        </div>
        <div className={styles.navUser}>
          <div
            className={styles.navAvatar}
            style={{ background: getAvatarColor(user?.username ?? null) }}>
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
          <span className={styles.dateRange}>{dayjs(trip?.startDate).format("MMM D")} – {dayjs(trip?.endDate).format("MMM D, YYYY")} · {allMembers.length} members</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          
          {/* Online indicator for trip members */}
          <MemberOnlineStatus
            trip={trip}
            currentUser={user}
            allMembers={allMembers}
          />
          
          <button className={styles.settingsBtn} onClick={() => setSettingsOpen(true)}>
            ⚙︎ Settings
          </button>
        </div>
      </nav>
      <Modal
        title={<span style={{ color: "black" }}>Trip Settings</span>}
        open={settingsOpen}
        onCancel={() => setSettingsOpen(false)}
        footer={null}
      >
        <Form.Item>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "8px 0" }}>
            <Button type="primary" onClick={() => setShareLinkOpen(true)}>
              Share Link
            </Button>
            <Button type="primary" onClick={() => setLeaveTripOpen(true)}>
              Leave Trip
            </Button>
          </div>
        </Form.Item>

      </Modal>

      {/* Share Link */}
      <ShareLink
        open={shareLinkOpen}
        onClose={() => setShareLinkOpen(false)}
        trip={trip}
      />

      {/* Leave Trip */}
      <LeaveTrip
        open={LeaveTripOpen}
        onClose={() => setLeaveTripOpen(false)}
        trip={trip}
      />

      {/* calendar view */}
      {trip && <TripCalendar trip={trip} currentUser={user} />}

    </div>
  );
};

export default Profile;
