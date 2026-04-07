"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Modal } from "antd";
import styles from "./join.module.css";

const JoinTripPage: React.FC = () => {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(true);

  const handleConfirm = () => {
    // TODO: implement join logic (issue #103, #104)
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
