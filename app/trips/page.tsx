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

const ILLUSTRATIONS = ["🌍", "🗺️", "✈️", "🏖️", "🏔️", "🌴", "🗽", "🎡"];
const AVATAR_COLORS = ["#c0392b", "#2980b9", "#27ae60", "#8e44ad", "#d35400", "#16a085"];

function getIllustration(id: string | null): string {
  if (!id) return "🗺️";
  const idx = parseInt(id, 10) % ILLUSTRATIONS.length;
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
  const router = useRouter();
  const apiService = useApi();
  const [trips, setTrips] = useState<Trip[] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form] = Form.useForm<NewTripValues>();

  const { value: user, clear: clearUser } = useLocalStorage<User | null>("user", null);
  const { clear: clearToken } = useLocalStorage<string>("token", "");

  const handleLogout = (): void => {
    //yara to do #34 
  };

  const handleNewTrip = (): void => {
    form.resetFields();
    setModalOpen(true);
  };

  const handleCreateTrip = async (values: NewTripValues) => {
    setCreating(true);
    try {
      const newTrip = await apiService.post<Trip>("/trips", {
        title: values.title,
        start_date: values.dateRange[0].format("YYYY-MM-DD"),
        end_date: values.dateRange[1].format("YYYY-MM-DD"),
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
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div className={styles.navUser}>
            <div className={styles.navAvatar}>
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
          {/* New Trip Card */}
          <div className={styles.newCard} onClick={handleNewTrip}>
            <div className={styles.newCardIcon}>+</div>
            <div className={styles.newCardLabel}>New Trip</div>
            <div className={styles.newCardSub}>Plan your next adventure</div>
          </div>

          {/* Trip Cards */}
          {trips?.map((trip) => {
            const status = getStatus(trip.startDate, trip.endDate);
            const members = trip.collaborators
              ? trip.collaborators.split(",").filter(Boolean)
              : [];
            return (
              <div
                key={trip.id}
                className={styles.card}
                onClick={() => router.push(`/trips/${trip.id}`)}
              >
                <div className={styles.cardIllustration} style={{ background: "#f0ece6" }}>
                  {trip.illustration ?? getIllustration(trip.id)}
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.cardTitle}>{trip.title ?? "Untitled Trip"}</div>
                  <div className={styles.cardDate}>
                    {formatDateRange(trip.startDate, trip.endDate)}
                  </div>
                  <div className={styles.cardFooter}>
                    <div className={styles.avatarStack}>
                      {members.slice(0, 4).map((m, i) => (
                        <div
                          key={i}
                          className={styles.avatar}
                          style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                          title={m}
                        >
                          {m[0]?.toUpperCase()}
                        </div>
                      ))}
                    </div>
                    <span
                      className={`${styles.badge} ${
                        status === "active"
                          ? styles.badgeActive
                          : status === "upcoming"
                          ? styles.badgeUpcoming
                          : styles.badgePlanning
                      }`}
                    >
                      <span className={styles.badgeDot} />
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* New Trip Modal */}
      <Modal
        title="Create a New Trip"
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

          <Form.Item
            name="dateRange"
            label="Date Range"
            rules={[{ required: true, message: "Please select a start and end date" }]}
          >
            <DatePicker.RangePicker
              style={{ width: "100%" }}
              format="MMM D, YYYY"
              disabledDate={(d) => d && d.isBefore(dayjs().startOf("day"))}
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
