"use client";

import React, { useState, useEffect, useRef } from "react";
import useLocalStorage from "@/hooks/useLocalStorage";
import { Trip } from "@/types/trip";
import { User } from "@/types/user";
import styles from "@/styles/trips.module.css";
import Logout from "@/components/Logout";
import TripCalendar, { NewStopValues } from "@/components/TripCalendar";
import dayjs from "dayjs";
import Link from "next/link";
import { useProtectedRoute } from "@/components/ProtectedRoute";
import { useApi } from "@/hooks/useApi";
import ShareLink from "@/components/ShareLink";
import LeaveTrip from "@/components/LeaveTrip";
import MemberOnlineStatus from "@/components/MemberOnlineStatus";
import { getAvatarColor, getAvatarInitial } from "@/utils/avatarColors";
import { useParams, useRouter } from "next/navigation";
import { showError } from "@/utils/showError";
import TripLeft from "@/components/TripLeft";
import DeleteTrip from "@/components/DeleteTrip";
import { ApplicationError } from "@/types/error";

const Profile: React.FC = () => {
  const router = useRouter();
  const { isLoading } = useProtectedRoute();
  const { id } = useParams<{ id: string }>();

  const [shareLinkOpen, setShareLinkOpen] = useState(false);
  const [LeaveTripOpen, setLeaveTripOpen] = useState(false);
  const [deleteTripOpen, setDeleteTripOpen] = useState(false);
  const [allMembers, setAllMembers] = useState<string[]>([]);
  const [onlineMembers, setOnlineMembers] = useState<string[]>([]);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [eventRefetchTrigger, setEventRefetchTrigger] = useState(0);
  const [stops, setStops] = useState<Record<string, NewStopValues[]>>({});
  const [highlightedStopId, setHighlightedStopId] = useState<string | null>(null);

  const { value: user } = useLocalStorage<User | null>("user", null);
  const { value: storedTrip } = useLocalStorage<Trip | null>("trip", null);
  const storedTripRef = useRef(storedTrip);

  const apiService = useApi();
  const apiServiceRef = useRef(apiService);

  function formatDateRange(startDate: string | null, endDate: string | null): string {
    if (!startDate && !endDate) return "No dates set";
    if (!startDate) return `Until ${dayjs(endDate).format("MMM D, YYYY")}`;
    if (!endDate) return `From ${dayjs(startDate).format("MMM D, YYYY")}`;
  
    if (dayjs(startDate).year() !== dayjs(endDate).year()) {
      return `${dayjs(startDate).format("MMM D, YYYY")} – ${dayjs(endDate).format("MMM D, YYYY")}`;
    }
  
    return `${dayjs(startDate).format("MMM D")} – ${dayjs(endDate).format("MMM D, YYYY")}`;
  }

  function getMembers(trip: Trip | null): string[] {
    if (!trip) return [];
    return trip?.members?.map((m) => m.username) || [];
  }

  const { handleLogout } = Logout();

  useEffect(() => {
    if (storedTripRef.current && String(storedTripRef.current.tripId) === id) {
      setTrip(storedTripRef.current);
    } else {
      apiServiceRef.current.get<Trip>(`/trips/${id}`)
        .then(setTrip)
        .catch((err) => showError(err, "Failed to load trip."));
    }
  }, [id]);

  useEffect(() => {
    if (!trip?.tripId) return;

    const fetchData = async () => {
      try {
        const [memberResponse, tripResponse] = await Promise.all([
        apiService.get<{ userId: number; username: string; role: string; status: string }[]>(`/trips/${trip.tripId}/members`),
        apiService.get<Trip>(`/trips/${trip.tripId}`)
      ]);

        const usernames = memberResponse.map((m) => m.username);
        const online = memberResponse.filter((m) => m.status === "ONLINE").map((m) => m.username);

        setAllMembers(prev => {
          if (JSON.stringify(prev) === JSON.stringify(usernames)) return prev;
          return usernames;
        });
        setOnlineMembers(prev => {
          if (JSON.stringify(prev) === JSON.stringify(online)) return prev;
          return online;
        });

        setTrip(prev => {
          if (!prev) return tripResponse;  // trip is null (first load)
          if (JSON.stringify(prev) === JSON.stringify(tripResponse)) return prev;
          return { ...prev, ...tripResponse }; // merge instead of replacing
        });

      } catch (error) {
        const appError = error as ApplicationError;
        if (appError.status === 404) {
          localStorage.setItem("deletedTrip", trip?.tripTitle ?? "Trip");
          router.push(`/trips?deleted=${encodeURIComponent(trip?.tripTitle ?? "Trip")}`);
          return;
        }
        console.error("Failed to poll", error);
      }
      setEventRefetchTrigger(prev => prev + 1);
    };

    fetchData();
    const intervalId = setInterval(fetchData, 5000); // polls every 5sec

    return () => clearInterval(intervalId);
  }, [trip?.tripId]); // eslint-disable-line react-hooks/exhaustive-deps

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
            {getAvatarInitial(user?.username)}      {/* initial of username */}
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
          <span className={styles.dateRange}>{formatDateRange(trip?.startDate ?? null, trip?.endDate ?? null)} · {allMembers.length} members</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          
          {/* Online indicator for trip members */}
          <MemberOnlineStatus
            currentUser={user}
            allMembers={allMembers}
            onlineUsernames={onlineMembers}
          />
          
          <button className={styles.shareLinkBtn} onClick={() => setShareLinkOpen(true)}>
            Share Link
          </button>
          {getMembers(trip).length > 1 && (
          <button className={styles.shareLinkBtn} onClick={() => setLeaveTripOpen(true)}>
            Leave Trip
          </button>
          )}
          {trip?.owner === user?.username && (
            <button className={styles.settingsBtn} onClick={() => setDeleteTripOpen(true)}>
              Delete Trip
            </button>
          )}
        </div>
      </nav>

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

      {/* Delete Trip */}
      <DeleteTrip
        open={deleteTripOpen}
        onClose={() => setDeleteTripOpen(false)}
        trip={trip}
      />

      <div className={styles.tripBody}>
        {/* left side */}
        <TripLeft 
          tripId={trip?.tripId}
          stops={stops} 
          highlightedStopId={highlightedStopId} 
          setHighlightedStopId={setHighlightedStopId} 
        />

        {/* trip calendar */}
        {trip && (
          <TripCalendar 
            stops={stops}  
            setStops={setStops} 
            trip={trip} 
            currentUser={user} 
            refetchTrigger={eventRefetchTrigger} 
            highlightedStopId={highlightedStopId}
            />
        )}
      </div>

    </div>
  );
};

export default Profile;
