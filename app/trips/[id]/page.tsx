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

const Profile: React.FC = () => {
  const { isLoading } = useProtectedRoute();

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [shareLinkOpen, setShareLinkOpen] = useState(false);
  const [LeaveTripOpen, setLeaveTripOpen] = useState(false);
  const [allMembers, setAllMembers] = useState<string[]>([]);

  const { value: user } = useLocalStorage<User | null>("user", null);
  const { value: trip } = useLocalStorage<Trip | null>("trip", null);

  const apiService = useApi();

  const { handleLogout } = Logout();

  useEffect(() => {
    if (!trip?.tripId) return;

    const fetchMembers = async () => {
      try {
        // check for correctness when get members is implemented
        const response = await apiService.get<{ members: string[] }>(`/trips/${trip.tripId}/members`);
        setAllMembers(response.members || []);
      } catch (error) {
        console.error("Failed to fetch members", error);
      }
    };

    fetchMembers();
  }, [trip?.tripId]);

  {/* todo functions: addStop, editStop */}
  if (isLoading) return null;

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
      {trip && <TripCalendar trip={trip} />}

    </div>
  );
};

export default Profile;
