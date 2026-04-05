import React from "react";
import { Modal, message } from "antd";
import { CopyFilled } from "@ant-design/icons";
import { Trip } from "@/types/trip";
import styles from "@/styles/trips.module.css";
import dayjs from "dayjs";

interface ShareLinkProps {
  open: boolean;
  onClose: () => void;
  trip: Trip | null;
}

const ShareLink: React.FC<ShareLinkProps> = ({ open, onClose, trip }) => {
  return (
    <Modal title="Share Link" open={open} onCancel={onClose} footer={null} zIndex={1001}>
      <div className={styles.shareLinkModal}>
        <p>Copy this link to invite others:</p>
        <div className={styles.shareLinkRow}>
          <input
            className={styles.shareLinkInput}
            readOnly
            value={`https://wandersync.com/join/${trip?.tripId}`}
          />
          <button
            className={styles.shareLinkCopyBtn}
            onClick={() => {
              navigator.clipboard.writeText(`https://wandersync.com/join/${trip?.tripId}`);
              message.success("Copied link");
            }}
          >
            <CopyFilled />
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ShareLink;