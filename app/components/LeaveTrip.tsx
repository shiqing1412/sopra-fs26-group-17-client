import React from "react";
import { Button, Form, Modal, Select } from "antd";
import { showError } from "@/utils/showError";
import dayjs from "dayjs";
import { Trip, TripMember } from "@/types/trip";
import { useApi } from "@/hooks/useApi";
import { User } from "@/types/user";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useRouter } from "next/navigation";

const ILLUSTRATIONS = ["🌍", "🗺️", "✈️", "🏖️", "🏔️", "🌴", "🗽", "🎡"];

function getIllustration(id: string | null): string {
  if (!id) return "🗺️";
  const idx = Number.parseInt(id, 10) % ILLUSTRATIONS.length;
  return ILLUSTRATIONS[Math.abs(idx)];
}

interface LeaveTripProps {
  open: boolean;
  onClose: () => void;
  trip: Trip | null;
}

function formatDateRange(startDate: string | null, endDate: string | null): string {
  if (!startDate && !endDate) return "No dates set";
  if (!startDate) return `Until ${dayjs(endDate).format("MMM D, YYYY")}`;
  if (!endDate) return `From ${dayjs(startDate).format("MMM D, YYYY")}`;
  
  if (dayjs(startDate).year() !== dayjs(endDate).year()) {
    return `${dayjs(startDate).format("MMM D, YYYY")} – ${dayjs(endDate).format("MMM D, YYYY")}`;
  }
  
  return `${dayjs(startDate).format("MMM D")} – ${dayjs(endDate).format("MMM D, YYYY")}`;
}

function getMembers(trip: Trip | null): TripMember[] {
  if (!trip) return [];
  return trip?.members?.filter((m) => m.role !== "OWNER") || [];
}

const LeaveTrip: React.FC<LeaveTripProps> = ({ open, onClose, trip }) => {
  const apiService = useApi();
  const router = useRouter();
  const [isLeaving, setIsLeaving] = React.useState(false);
  const [isTransfering, setIsTransfering] = React.useState(false);
  const [selectedNewOwner, setSelectedNewOwner] = React.useState<TripMember | null>(null);
  const { value: user } = useLocalStorage<User | null>("user", null);
  
  const handleLeaveTrip = async (): Promise<void> => {
    setIsLeaving(true);
    try {
      await apiService.delete(`/trips/${trip?.tripId}/members/me`);
      onClose();
      router.push("/trips");
    } catch (error) {
      showError(error, "Failed to leave trip. Please try again.");
    } finally {
      setIsLeaving(false);
    }
  };

  const handleTransferOwnership = async(): Promise<void> => {
    if (!selectedNewOwner) {
      showError(null, "Please select a new owner before transferring.");
      return;
    }
    try { 
      await apiService.patch(`/trips/${trip?.tripId}/members/${selectedNewOwner?.userId}/owner`);
      await handleLeaveTrip();
      setIsTransfering(false);
    } catch (error) {
      showError(error, "Failed to transfer ownership. Please try again.");
    } 
  };

  const handleLeaveTripClick = () => {
    if (trip?.owner === user?.username) {
      setIsTransfering(true);
    } else {
      handleLeaveTrip();
    }
  };

  return (
    <>
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
              <Button 
                type="primary" 
                onClick={handleLeaveTripClick} 
                loading={isLeaving}
                disabled={isLeaving}
                style={{ flex: 3 }}
              >
                Leave
              </Button>
            </div>
          </Form.Item>
        ]}
      >
        <div style={{ background: "#f5f5f5", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, margin: "16px 0" }}>
          <div style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 25 }}>
            {trip?.illustration ?? getIllustration(trip?.tripId ?? null)}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 600, color: "#111", fontSize: 16, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{trip?.tripTitle}</div>
            <div style={{ color: "#888", fontSize: 13 }}>
              {formatDateRange(trip?.startDate ?? null, trip?.endDate ?? null)}
            </div>
          </div>
        </div>
        <div style={{ textAlign: "center", color: "#888", fontSize: 15, fontWeight: 400, marginTop: 12, marginBottom: 25 }}>
          The trip and all its events will remain visible to the other members.
        </div>
      </Modal>

      {/* transfer ownership */}
      <Modal 
        title={
            <div style={{ textAlign: "center", padding: "8px 0" }}>
              <div style={{ fontSize: 25, fontWeight: 600, marginTop: 8 }}>Transfer Ownership</div>
            </div>
        }
        open={isTransfering}
        onCancel={() => {setIsTransfering(false)}}
        footer={[
          <Form.Item key="leave-trip" style={{ marginBottom: 0, marginTop: 8 }}>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <Button onClick={() => {setIsTransfering(false)}} style={{ flex: 2 }}>Cancel</Button>
              <Button 
                type="primary" 
                onClick={handleTransferOwnership} 
                style={{ flex: 3 }}
              >
                Transfer & Leave
              </Button>
            </div>
          </Form.Item>
        ]}
      >
        <p style={{ textAlign: "center" }}>You are the owner of this trip.</p>
        <p style={{ textAlign: "center" }}>Please transfer ownership to another member before leaving.</p>
        <Form.Item style ={{ marginBottom: 0, marginTop: 16 }}>
          <Select
            placeholder="Select new owner"
            style={{ width: '100%', marginTop: 12, marginBottom: 16, backgroundColor: "#ffffff" }}
            onChange={(value) => {
              const newOwner = getMembers(trip).find((m) => m.userId === value) ?? null;
              setSelectedNewOwner(newOwner); 
            }}
            value={selectedNewOwner?.userId}
          >
          {getMembers(trip)
            .filter((member) => member.userId !== user?.id)
            .map((member) => (
            <Select.Option key={member.userId} value={member.userId}>
              {member.username}
            </Select.Option>
            )
          )}
          </Select>
        </Form.Item>
      </Modal>
    </>
  );
};

export default LeaveTrip;