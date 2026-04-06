import React from "react";
import { Button, Form, Modal } from "antd";
import dayjs from "dayjs";
import { Trip } from "@/types/trip";

const ILLUSTRATIONS = ["🌍", "🗺️", "✈️", "🏖️", "🏔️", "🌴", "🗽", "🎡"];

function getIllustration(id: string | null): string {
  if (!id) return "🗺️";
  const idx = Number.parseInt(id, 10) % ILLUSTRATIONS.length;
  return ILLUSTRATIONS[Math.abs(idx)];
}

interface LeaveTripProps {
  open: boolean;
  onClose: () => void;
  onLeave: () => Promise<void>;
  trip: Trip | null;
}

const LeaveTrip: React.FC<LeaveTripProps> = ({ open, onClose, onLeave, trip }) => {
  return (
    <Modal
      title={
        <div style={{ textAlign: "center", padding: "8px 0" }}>
          <div style={{ fontSize: 40 }}>👋</div>
          <div style={{ color: "#000", fontSize: 25, fontWeight: 600, marginTop: 8 }}>Leave this trip?</div>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={[
        <Form.Item key="leave-trip" style={{ marginBottom: 0, marginTop: 8 }}>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Button onClick={onClose} style={{ flex: 2 }}>Stay</Button>
            <Button type="primary" onClick={onLeave} style={{ flex: 3 }}>Leave</Button>
          </div>
        </Form.Item>
      ]}
    >
      <div style={{ background: "#f5f5f5", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, margin: "16px 0" }}>
        <div style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 25 }}>
          {trip?.illustration ?? getIllustration(trip?.tripId ?? null)}
        </div>
        <div>
          <div style={{ fontWeight: 600, color: "#111", fontSize: 16 }}>{trip?.tripTitle}</div>
          <div style={{ color: "#888", fontSize: 13 }}>
            {dayjs(trip?.startDate).format("MMM D")} – {dayjs(trip?.endDate).format("MMM D, YYYY")}
          </div>
        </div>
      </div>
      <div style={{ textAlign: "center", color: "#888", fontSize: 15, fontWeight: 400, marginTop: 12, marginBottom: 25 }}>
        The trip and all its events will remain visible to the other members.
      </div>
    </Modal>
  );
};

export default LeaveTrip;