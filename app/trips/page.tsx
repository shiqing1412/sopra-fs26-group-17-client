"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Modal, Form, Input, DatePicker, Button } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useApi } from "@/hooks/useApi";
import useLocalStorage from "@/hooks/useLocalStorage";
import { Trip } from "@/types/trip";
import { User } from "@/types/user";
import styles from "@/styles/trips.module.css";
import Logout from "@/components/Logout";
import { useProtectedRoute } from "@/components/ProtectedRoute";
import { getAvatarColor } from "@/utils/avatarColors";

const ILLUSTRATIONS = ["🌍", "🗺️", "✈️", "🏖️", "🏔️", "🌴", "🗽", "🎡"];

function getIllustration(id: string | null): string {
  if (!id) return "🗺️";
  const idx = Number.parseInt(id, 10) % ILLUSTRATIONS.length;
  return ILLUSTRATIONS[Math.abs(idx)];
}

function getStatus(startDate: string | null, endDate: string | null): "active" | "upcoming" | "planning" {
  if (!startDate || !endDate) return "planning";
  const now = dayjs();
  if (now.isAfter(dayjs(startDate)) && now.isBefore(dayjs(endDate))) return "active";
  if (now.isBefore(dayjs(startDate))) return "upcoming";
  return "planning";
}

function formatDateRange(startDate: string | null, endDate: string | null): string {
  if (!startDate && !endDate) return "No dates set";
  if (!startDate) return `Until ${endDate}`;
  if (!endDate) return `From ${startDate}`;
  return `${dayjs(startDate).format("MMM D")} – ${dayjs(endDate).format("MMM D, YYYY")}`;
}

interface NewTripValues {
  title: string;
  dateRange: [Dayjs, Dayjs];
}

const Dashboard: React.FC = () => {
  const { isLoading } = useProtectedRoute();

  const router = useRouter();
  const apiService = useApi();
  const [trips, setTrips] = useState<Trip[] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form] = Form.useForm<NewTripValues>();

  useEffect(() => {
    if (modalOpen) {
      form.resetFields();
    }
  }, [modalOpen]);

  const { value: user } = useLocalStorage<User | null>("user", null);
  const { set: setStoredTrip } = useLocalStorage<Trip | null>("trip", null);

  const { handleLogout } = Logout();

  const handleNewTrip = (): void => {
    setModalOpen(true);
  };

  const handleCreateTrip = async (values: NewTripValues) => {
    setCreating(true);
    try {
      const newTrip = await apiService.post<Trip>("/trips", {
        tripTitle: values.title,
        startDate: values.dateRange[0].format("YYYY-MM-DD"),
        endDate: values.dateRange[1].format("YYYY-MM-DD"),
      });
      setTrips((prev) => (prev ? [newTrip, ...prev] : [newTrip]));
      setModalOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        form.setFields([{ name: "title", errors: [error.message] }]);
      }
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => {
    if (!user) return;

    const fetchTrips = async () => {
      try {
        const fetchedTrips = await apiService.get<Trip[]>(`/trips`);
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

  if (isLoading) return null;

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <div className={styles.logo}>
          Wander<span className={styles.logoAccent}>Sync</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div className={styles.navUser}>
            <div
              className={styles.navAvatar}
              style={{ backgroundColor: getAvatarColor(user?.username ?? null) }}>
              {user?.username?.[0]?.toUpperCase() ?? "?"}
            </div>
            <span className={styles.navUsername}>{user?.username ?? "Guest"}</span>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Log out
          </button>
        </div>
      </nav>

      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>My Trips</h1>
          <button className={styles.newTripBtn} onClick={handleNewTrip}>
            + New Trip
          </button>
        </div>

        <div className={styles.grid}>
          {/* Trip Cards */}
          {trips?.map((trip) => {
            const status = getStatus(trip.startDate, trip.endDate);
            const members = trip.collaborators
              ? trip.collaborators.split(",").filter(Boolean)
              : [user?.username ?? ""].filter(Boolean);              
            const badgeClass = status === "active"
              ? styles.badgeActive
              : status === "upcoming"
              ? styles.badgeUpcoming
              : styles.badgePlanning;
            return (
              <button
                type="button"
                key={trip.tripId}
                className={styles.card}
                onClick={() => {setStoredTrip(trip);
                  router.push(`/trips/${trip.tripId}`)}}
                  style={{ border: "none", background: "none", width: "100%", cursor: "pointer", font: "inherit", textAlign: "left", padding: 0 }}
              >
                <div className={styles.cardIllustration} style={{ background: "#f0ece6" }}>
                  {trip.illustration ?? getIllustration(trip.tripId)}
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.cardTitle}>{trip.tripTitle ?? "Untitled Trip"}</div>
                  <div className={styles.cardDate}>
                    {formatDateRange(trip.startDate, trip.endDate)}
                  </div>
                  <div className={styles.cardFooter}>
                    <div className={styles.avatarStack}>
                      {members.slice(0, 4).map((m) => (
                        <div
                          key={m}
                          className={styles.avatar}
                          style={{ background: getAvatarColor(m ?? null) }}
                          title={m}
                        >
                          {m[0]?.toUpperCase()}
                        </div>
                      ))}
                    </div>
                    <span className={`${styles.badge} ${badgeClass}`}>
                      <span className={styles.badgeDot} />
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}

          {/* New Trip Card — appar at last */}
          <button type="button" className={styles.newCard} onClick={handleNewTrip}
            style={{ border: "none", background: "none", width: "100%", cursor: "pointer", font: "inherit" }}>
            <div className={styles.newCardIcon}>+</div>
            <div className={styles.newCardLabel}>New trip</div>
            <div className={styles.newCardSub}>Plan something new</div>
          </button>
        </div>
      </main>

      {/* New Trip Modal */}
      <Modal
        title={<span style={{ color: '#000' }}>Create a New Trip</span>}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateTrip}
          size="large"
          style={{ marginTop: 16 }}
        >
          <Form.Item
            name="title"
            label="Trip Title"
            rules={[{ required: true, message: "Please enter a trip title" }]}
          >
            <Input placeholder="e.g. Summer in Europe" />
          </Form.Item>
          <style>{`
            .ant-picker-month-btn, .ant-picker-year-btn { color: #c0392b !important; }
            .ant-picker-month-btn:hover, .ant-picker-year-btn:hover { color: #c0392b !important; }
          `}</style>
          <Form.Item
            name="dateRange"
            label="Date Range"
            rules={[{ required: true, message: "Please select a start and end date" }]}
          >
            <DatePicker.RangePicker
              style={{ width: "100%" }}
              format="MMM D, YYYY"
              disabledDate={(d) => d?.isBefore(dayjs().startOf("day")) ?? false}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 8 }}>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <Button onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={creating}>
                Create Trip
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Dashboard;
