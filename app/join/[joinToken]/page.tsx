"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Modal } from "antd";
import { useApi } from "@/hooks/useApi";
import useLocalStorage from "@/hooks/useLocalStorage";
import styles from "./join.module.css";

interface TripJoinResponse {
  tripId: number;
  tripTitle: string;
  alreadyMember: boolean;
}

const JoinTripPage: React.FC = () => {
  const { joinToken } = useParams<{ joinToken: string }>();
  const router = useRouter();
  const apiService = useApi();
  const { value: token } = useLocalStorage<string>("token", "");

  const [joining, setJoining] = useState(false);
  const [modalOpen, setModalOpen] = useState(true);

  const handleConfirm = async () => {
    if (!token) {
      // TODO: handle not logged in (issue #74)
      return;
    }

    setJoining(true);
    try {
      const response = await apiService.post<TripJoinResponse>(`/trips/join/${joinToken}`, {});
      router.push(`/trips/${response.tripId}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong.";
      alert(message);
    } finally {
      setJoining(false);
    }
  };

  const handleCancel = () => {
    router.push("/");
  };

  return (
    <div className={styles.page}>
      <div className={styles.logo}>
        Wander<span className={styles.logoAccent}>Sync</span>
      </div>

      <Modal
        open={modalOpen}
        onCancel={handleCancel}
        footer={null}
        centered
        closable={false}
        width={440}
      >
        <div className={styles.content}>
          <div className={styles.icon}>✈️</div>
          <h2 className={styles.title}>You&apos;ve Been Invited!</h2>
          <p className={styles.subtitle}>
            Join this trip and start planning together with your group.
          </p>
          <div className={styles.actions}>
            <Button onClick={handleCancel} className={styles.cancelBtn}>
              Cancel
            </Button>
            <Button
              type="primary"
              loading={joining}
              onClick={handleConfirm}
              className={styles.confirmBtn}
            >
              Join Trip
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default JoinTripPage;
