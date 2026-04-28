import type { Trip } from "@/types/trip";
import { User } from "@/types/user";
import styles from "@/styles/trips.module.css";
import { useState, useEffect } from "react";
import { Button, ConfigProvider, Form, message, Modal } from "antd";
import { ApiService } from "@/api/apiService";
import dayjs, { Dayjs } from "dayjs";
import { getAvatarColor } from "@/utils/avatarColors";
import StopModal, { StopFormValues } from "./StopModal";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

interface EventGetDTO {
  eventId: number;
  eventTitle: string;
  date: string;
  time: string;
  notes: string;
  placeName: string;
  placeId: string | null;
  lat: number;
  lng: number;
  createdBy: string;
}

interface DayDTO {
  date: string;
  events: EventGetDTO[];
}
 
interface TripCalendarValues {
  stops: Record<string, NewStopValues[]>;
  setStops: React.Dispatch<React.SetStateAction<Record<string, NewStopValues[]>>>;
  trip: Trip;
  currentUser: User | null;
  refetchTrigger?: number;
}

export interface NewStopValues {
  id: string;
  title: string;
  pickedDate?: Dayjs;
  location: string;
  placeId: string | null;
  lat: number | null;
  lng: number | null;
  startTime: Dayjs | null;
  endTime: Dayjs | null;
  notes: string;
  createdBy: User | null;
}

function getDaysBetween(start: string, end: string): Date[] {
  const days: Date[] = [];
  const current = new Date(start);
  current.setHours(0, 0, 0, 0);
  const last = new Date(end);
  last.setHours(0, 0, 0, 0);
  while (current <= last) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return days;
}
 
function DayColumn({ date, dayNumber, onAddStopClick, onStopClick, stops }: Readonly<{ date: Date; dayNumber: number; onAddStopClick: () => void; onStopClick: (stop: NewStopValues & { id: string }) => void; stops: (NewStopValues & { id: string })[] }>) {
  const sortedStops = [...stops].sort((a, b) => {
    const timeA = a.startTime?.valueOf() ?? 0;
    const timeB = b.startTime?.valueOf() ?? 0;
    return timeA - timeB;
  });

  
  return (
    <div className={styles.calendarDayColumn}>
      <div className={styles.calendarDayHeader}>
        <span className={styles.calendarDayLabel}>DAY {dayNumber}</span>
        <span className={styles.calendarDayNumber}>{date.getDate()}</span>
        <span className={styles.calendarDayName}>{DAY_NAMES[date.getDay()]}, {MONTH_NAMES[date.getMonth()]}</span>
      </div>
      <div className={styles.calendarDayStops}>
        {sortedStops.map(stop => (
          <button key={stop.id} className={styles.calendarStopCard} onClick={() => onStopClick(stop)}>
            <div className={styles.calendarStopTime}>
              {stop.startTime?.format("HH:mm")} {stop.endTime ? `→ ${stop.endTime.format("HH:mm")}` : ""}
            </div>
            <div 
              className={styles.calendarStopAvatars} 
              title={stop.createdBy?.username ?? ""}
              style={{ backgroundColor: getAvatarColor(stop.createdBy?.username ?? null) }}
            >
              {stop.createdBy?.username?.[0]?.toUpperCase() ?? "?"}
            </div>
            <div className={styles.calendarStopTitle}>{stop.title}</div>
            <div className={styles.calendarStopLocation}>📍{stop.location}</div>
            <div className={styles.calendarStopNotes}>{stop.notes}</div>
          </button>
        ))}
        <button className={styles.calendarAddStopBtn} onClick={onAddStopClick}>
          + Add stop
        </button>
      </div>
    </div>
  );
}
 
function TripCalendar({ trip, currentUser, refetchTrigger, stops, setStops }: Readonly<TripCalendarValues>) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const days = getDaysBetween(trip.startDate ?? "", trip.endDate ?? "");
  const [form] = Form.useForm<StopFormValues>();
  const dateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

  const handleAddStop = async (values: Partial<NewStopValues>) => {
    if (!selectedDate) return;
    const key = dateKey(selectedDate);

    try {
      const api = new ApiService();
      const eventPostDTO = {
        eventTitle: values.title,
        date: key,
        time: values.startTime?.format("HH:mm:ss") ?? null,
        notes: values.notes ?? "",
        placeId: selectedPlace?.id ?? null,
        placeName: selectedPlace?.displayName ?? values.location,
        lat: selectedPlace?.location?.lat() ?? null,
        lng: selectedPlace?.location?.lng() ?? null,
      };

      const response = await api.post<EventGetDTO>(`/trips/${trip.tripId}/events`, eventPostDTO);

      const newStop: NewStopValues = {
        id: String(response.eventId),
        title: response.eventTitle,
        location: response.placeName ?? values.location,
        placeId: response.placeId ?? null,
        lat: response.lat ?? null,
        lng: response.lng ?? null,
        startTime: values.startTime ?? null,
        endTime: values.endTime ?? null,
        notes: response.notes ?? "",
        createdBy: currentUser,
      };

      setStops(prev => ({ ...prev, [key]: [...(prev[key] ?? []), newStop] }));
      setSelectedPlace(null);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      message.error(`Failed to add stop: ${msg}`);
      console.error(error);
    }
  };

  useEffect(() => {
    if (!trip?.tripId) return;

    const fetchEvents = async () => {
      try {
        
        const api = new ApiService();
        const days = await api.get<DayDTO[]>(`/trips/${trip.tripId}/events`);

        const fetched: Record<string, (NewStopValues & { id: string })[]> = {};
        for (const day of days) {
          const date = new Date(day.date + "T00:00:00");
          date.setHours(0, 0, 0, 0);
          const key = day.date;
          fetched[key] = day.events.map(event => ({
            id: String(event.eventId),
            title: event.eventTitle,
            location: event.placeName ?? "",
            placeId: event.placeId ?? null,
            lat: event.lat ?? null,
            lng: event.lng ?? null,
            startTime: event.time ? dayjs(event.time, "HH:mm:ss") : null,
            endTime: null,
            notes: event.notes ?? "",
            createdBy: { username: event.createdBy } as User,
          }));
        }
        setStops(fetched);
      } catch (error) {
        console.error("Failed to fetch events", error);
      }
    };

    fetchEvents();
  }, [trip.tripId, refetchTrigger]); // eslint-disable-line react-hooks/exhaustive-deps

  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.Place | null>(null);
  const [viewingStop, setViewingStop] = useState<{ stop: NewStopValues; date: Date } | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editingStop, setEditingStop] = useState<{ stop: NewStopValues; date: Date } | null>(null);

  const handleDeleteStop = async () => {
    if (!viewingStop) return;
    const key = dateKey(viewingStop.date);
    setDeleteLoading(true);
    try {
      const api = new ApiService();
      await api.delete(`/trips/${trip.tripId}/events/${viewingStop.stop.id}`);
      setStops(prev => ({
        ...prev,
        [key]: prev[key].filter(s => s.id !== viewingStop.stop.id),
      }));
      setConfirmingDelete(false);
      setViewingStop(null);
    } catch {
      message.error("Failed to delete the stop. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEditStop = async (values: NewStopValues) => {
    if (!editingStop) return;

    try {
      const api = new ApiService();
      const oldKey = dateKey(editingStop.date);
      const newKey = values.pickedDate ? values.pickedDate.format("YYYY-MM-DD") : oldKey;
      const eventPutDTO = {
        eventId: editingStop.stop.id,
        eventTitle: values.title,
        date: newKey,
        time: values.startTime?.format("HH:mm:ss") ?? null,
        notes: values.notes ?? "",
        placeId: selectedPlace?.id ?? editingStop.stop.placeId ?? null,
        placeName: selectedPlace?.displayName ?? values.location,
        lat: selectedPlace?.location?.lat() ?? editingStop.stop.lat ?? null,
        lng: selectedPlace?.location?.lng() ?? editingStop.stop.lng ?? null,
      };

      await api.put<void>(`/trips/${trip.tripId}/events/${editingStop.stop.id}`, eventPutDTO);

      const updatedStop: NewStopValues = {
        id: editingStop.stop.id,
        title: values.title,
        location: selectedPlace?.displayName ?? values.location,
        startTime: values.startTime,
        endTime: values.endTime,
        notes: values.notes ?? "",
        placeId: selectedPlace?.id ?? editingStop.stop.placeId ?? null,
        lat: selectedPlace?.location?.lat() ?? editingStop.stop.lat ?? null,
        lng: selectedPlace?.location?.lng() ?? editingStop.stop.lng ?? null,
        createdBy: editingStop.stop.createdBy,
      };

      setStops(prev => {
        const next = { ...prev };
        next[oldKey] = (next[oldKey] ?? []).filter(s => s.id !== editingStop.stop.id);
        next[newKey] = [...(next[newKey] ?? []), updatedStop];
        return next;
      });
      setEditingStop(null);

    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      alert(`Failed to edit stop: ${msg}`);
    }
  };

  const handleFinish = async (values: StopFormValues) => {
    try {
      if (editingStop) {
        const updatedStop: NewStopValues = {
          ...values,
          id: editingStop.stop.id,
          createdBy: editingStop.stop.createdBy,
        };
        await handleEditStop(updatedStop);
        setEditingStop(null);
      } else {
        await handleAddStop(values);
        setSelectedDate(null);
      }
    } catch (error) {
      console.error("Failed to save stop:", error);
    }
  };

  return (
    <div className={styles.calendarScrollWrapper}>
      <div className={styles.calendarGrid}>
        {days.map((date, i) => (
          <DayColumn 
            key={dateKey(date)} 
            date={date} 
            dayNumber={i + 1} 
            onAddStopClick={() => setSelectedDate(date)} 
            stops={stops[dateKey(date)] ?? []} 
            onStopClick={(stop) => setViewingStop({ stop, date })}
          />
        ))}
      </div>
      <ConfigProvider theme={{
        token: {
          colorText: '#000000',
          colorBgContainer: '#ffffff',
        },
        components: {
          Form: {
            labelColor: '#000000',
          }
        }
      }}>

        {/* Add/Edit Stop Modal */}
        <StopModal 
          isOpen={selectedDate !== null || !!editingStop}
          onClose={() => {
            setSelectedDate(null);
            setEditingStop(null);
          }}
          onFinish={handleFinish}
          initialData={editingStop} 
          selectedDate={selectedDate}
          tripStartDate={trip.startDate}
          tripEndDate={trip.endDate}
          form={form}
          setSelectedPlace={setSelectedPlace}
        />

        {/* View Stop Modal */}
        <Modal
          title={
            <div>
              <div style={{ color: "#000", fontSize: 18, fontWeight: 600 }}>
                {viewingStop?.date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </div>
            </div>
          }
          open={viewingStop !== null}
          onCancel={() => setViewingStop(null)}
          footer={null}
        >
          <div className={styles.calendarDayStops}>
              <button className={styles.calendarStopCard}>
                <div className={styles.calendarStopTime}>
                    {viewingStop?.stop.startTime?.format("HH:mm")} {viewingStop?.stop.endTime ? `→ ${viewingStop?.stop.endTime.format("HH:mm")}` : ""}
                </div>
                <div className={styles.calendarStopTitle}>{viewingStop?.stop.title}</div>
                <div className={styles.calendarStopLocation}>📍{viewingStop?.stop.location}</div>
                <div className={styles.calendarStopNotes}>{viewingStop?.stop.notes}</div>
              </button>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Button danger onClick={() => setConfirmingDelete(true)}>Delete</Button>
              <Button type="primary" onClick={() => {
                if (viewingStop) form.setFieldsValue({
                  ...viewingStop.stop,
                  startTime: viewingStop.stop.startTime ? dayjs(viewingStop.stop.startTime) : null,
                  endTime: viewingStop.stop.endTime ? dayjs(viewingStop.stop.endTime) : null,
                });
                setEditingStop(viewingStop); 
                setViewingStop(null)}}>
                  Edit
                </Button>
            </div>
          </div>
        </Modal>

        {/* Delete Stop Modal */}
        <Modal
          open={confirmingDelete}
          onCancel={() => setConfirmingDelete(false)}
          footer={null}
          centered
        >
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: "#000", marginBottom: 8 }}>
              Delete &quot;{viewingStop?.stop.title}&quot;?
            </div>
            <div style={{ color: "#888", marginBottom: 24 }}>
              This action cannot be undone.
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
              <Button onClick={() => setConfirmingDelete(false)}>Cancel</Button>
              <Button danger type="primary" loading={deleteLoading} onClick={handleDeleteStop}>Delete</Button>
            </div>
          </div>
        </Modal>

      </ConfigProvider>
    </div>
  );
}

export default TripCalendar;
