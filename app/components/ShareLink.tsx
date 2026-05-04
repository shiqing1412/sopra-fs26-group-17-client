"use client";
import React, { useState } from "react";
import { Modal } from "antd";
import { CopyFilled, CheckOutlined } from "@ant-design/icons";
import { Trip } from "@/types/trip";
import styles from "@/styles/trips.module.css";

interface ShareLinkProps {
  open: boolean;
  onClose: () => void;
  trip: Trip | null;
}

const ShareLink: React.FC<ShareLinkProps> = ({ open, onClose, trip }) => {
  // copied is false by default 
  const [copied, setCopied] = useState(false);

  const shareUrl = `https://sopra-fs26-group-17-client.vercel.app/join/${trip?.shareCode}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal 
      title={<div style={{ color: "#000" }}>Share Link</div>} 
      open={open} 
      onCancel={onClose} 
      footer={null} 
      zIndex={1001}
    >
      <div className={styles.shareLinkModal}>
        <p>Copy this link to invite others:</p>
        <div className={styles.shareLinkRow}>
          <input
            className={styles.shareLinkInput}
            readOnly
            value={shareUrl}
          />
          <button className={styles.shareLinkCopyBtn} onClick={handleCopy}>
            {copied ? <CheckOutlined /> : <CopyFilled />}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ShareLink;