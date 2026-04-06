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
import { Form, Button, Modal } from "antd";
import Link from "next/link";
import { useProtectedRoute } from "@/components/ProtectedRoute";
import ShareLink from "@/components/ShareLink";
import LeaveTrip from "@/components/LeaveTrip";

const ILLUSTRATIONS = ["🌍", "🗺️", "✈️", "🏖️", "🏔️", "🌴", "🗽", "🎡"];

function getIllustration(id: string | null): string {
  if (!id) return "🗺️";
  const idx = Number.parseInt(id, 10) % ILLUSTRATIONS.length;
  return ILLUSTRATIONS[Math.abs(idx)];
}

const Profile: React.FC = () => {
  const { isLoading } = useProtectedRoute();
  
  const router = useRouter();
  const apiService = useApi();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [shareLinkOpen, setShareLinkOpen] = useState(false);
  const [LeaveTripOpen, setLeaveTripOpen] = useState(false);

  const { value: user } = useLocalStorage<User | null>("user", null);
  const { value: trip } = useLocalStorage<Trip | null>("trip", null);

  const { handleLogout } = Logout();
  
  const handleLeaveTrip = async (): Promise<void> => {
  };

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
          <span className={styles.dateRange}>{dayjs(trip?.startDate).format("MMM D")} – {dayjs(trip?.endDate).format("MMM D, YYYY")}</span>
        </div>
        <div>
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
        <div style={{ display: "flex", gap: "12px" }}>
          <button className={styles.shareLinkBtn} onClick={() => setShareLinkOpen(true)}>Share Link</button>
        </div>
        <Form.Item>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "8px 0" }}>
            <Button onClick={() => setLeaveTripOpen(true)}>
              Leave Trip
            </Button>
            { /* TODO: add options here */}
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
        onLeave={handleLeaveTrip}
        trip={trip}
      />

      {/* calendar view */}
      {trip && <TripCalendar trip={trip} />}

      {/* TODO new trip card, new trip, display (no) existing trips */}

    </div>
  );
};

export default Profile;
