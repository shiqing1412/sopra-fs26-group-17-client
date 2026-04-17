import type { Trip } from "@/types/trip";
import { User } from "@/types/user";
import styles from "@/styles/trips.module.css";
import { useState, useEffect } from "react";
import { Button, ConfigProvider, Form, Input, message, Modal, TimePicker } from "antd";
import { ApiService } from "@/api/apiService";
import dayjs, { Dayjs } from "dayjs";
import PlaceAutocomplete from "./LocationSearch";
import { getAvatarColor } from "@/utils/avatarColors";

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
  lat: number;
  lng: number;
  createdBy: string;
}

interface DayDTO {
  date: string;
  events: EventGetDTO[];
}
 
interface TripCalendarValues {
  trip: Trip;
  currentUser: User | null;
}

interface NewStopValues {
  title: string;
  location: string;
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
 
function TripCalendar({ trip, currentUser }: Readonly<TripCalendarValues>) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const days = getDaysBetween(trip.startDate ?? "", trip.endDate ?? "");
  const [form] = Form.useForm<NewStopValues>();
  const [stops, setStops] = useState<Record<string, (NewStopValues & { id: string })[]>>({});

  const handleAddStop = async (values: NewStopValues) => {
    if (!selectedDate) return;
    const key = selectedDate.toISOString();

    try {
      const api = new ApiService();
      const eventPostDTO = {
        eventTitle: values.title,
        dayDate: `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`,
        time: values.startTime?.format("HH:mm:ss") ?? null,
        notes: values.notes ?? "",
        placeId: selectedPlace?.id ?? null,
        placeName: selectedPlace?.displayName ?? values.location,
        lat: selectedPlace?.location?.lat() ?? null,
        lng: selectedPlace?.location?.lng() ?? null,
      };

      const response = await api.post<EventGetDTO>(`/trips/${trip.tripId}/events`, eventPostDTO);

      const newStop: NewStopValues & { id: string } = {
        id: String(response.eventId),
        title: response.eventTitle,
        location: response.placeName ?? values.location,
        startTime: values.startTime,
        endTime: values.endTime,
        notes: response.notes ?? "",
        createdBy: currentUser,
      };

      setStops(prev => ({ ...prev, [key]: [...(prev[key] ?? []), newStop] }));
      form.resetFields();
      setSelectedDate(null);
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
          const key = date.toISOString();
          fetched[key] = day.events.map(event => ({
            id: String(event.eventId),
            title: event.eventTitle,
            location: event.placeName ?? "",
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
  }, [trip.tripId]); // eslint-disable-line react-hooks/exhaustive-deps

  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.Place | null>(null);
  const [viewingStop, setViewingStop] = useState<{ stop: NewStopValues & { id: string }; date: Date } | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editingStop, setEditingStop] = useState<{ stop: NewStopValues & { id: string }; date: Date } | null>(null);

  const handleDeleteStop = async () => {
    if (!viewingStop) return;
    const key = viewingStop.date.toISOString();
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
  };

  console.log(editingStop?.stop.location)
  return (
    <div className={styles.calendarScrollWrapper}>
      <div className={styles.calendarGrid}>
        {days.map((date, i) => (
          <DayColumn 
            key={date.toISOString()} 
            date={date} 
            dayNumber={i + 1} 
            onAddStopClick={() => setSelectedDate(date)} 
            stops={stops[date.toISOString()] ?? []} 
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

        {/* Add Stop Modal */}
        <Modal
          title={
            <div>
              <div style={{ color: "#000", fontSize: 18, fontWeight: 600 }}>Add a Stop</div>
              <div style={{ color: "#888", fontSize: 14, fontWeight: 400 }}>
                {selectedDate?.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </div>
            </div>
          }
          open={selectedDate !== null}
          onCancel={() => setSelectedDate(null)}
          footer={null}
          destroyOnHidden
        >
          <Form form={form} layout="vertical" size="large" style={{ marginTop: 16 }} onFinish={handleAddStop}>
            <Form.Item name="title" label="TITLE" rules={[{ required: true, message: "Please enter a title" }]} style={{ marginBottom: 12}}>
              <Input placeholder="e.g. Karaoke Night" />
            </Form.Item>
            <Form.Item name="location" label="LOCATION" rules={[{ required: true, message: "Please enter a location" }]} style={{ marginBottom: 12}}>
              <PlaceAutocomplete onPlaceSelect={setSelectedPlace} />
            </Form.Item>
            <Form.Item label="TIME" rules={[{ required: true, message: "Please enter a time" }]} style={{ marginBottom: 12}}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Form.Item name="startTime" noStyle>
                  <TimePicker format="HH:mm" placeholder="From" style={{ flex: 1 }} needConfirm={false} />
                </Form.Item>
                <span style={{ color: "#c0392b" }}>→</span>
                <Form.Item name="endTime" noStyle>
                  <TimePicker 
                    format="HH:mm" 
                    placeholder="To" 
                    style={{ flex: 1 }} 
                    needConfirm={false}
                    disabledTime={() => {
                    const start = form.getFieldValue("startTime");
                    if (!start) return {};
                    return {
                      disabledHours: () => Array.from({ length: start.hour() }, (_, i) => i),
                      disabledMinutes: (hour) =>
                        hour === start.hour()
                          ? Array.from({ length: start.minute() + 1 }, (_, i) => i)
                          : [],
                    };
                    }} 
                  />
                </Form.Item>
              </div>
            </Form.Item>
            <Form.Item name="notes" label="NOTES">
              <Input.TextArea placeholder="Reservations, tips, reminders…" rows={3} />
            </Form.Item>
            <Form.Item style={{ marginBottom: 0, marginTop: 8 }}>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                <Button onClick={() => setSelectedDate(null)}>Cancel</Button>
                <Button type="primary" htmlType="submit">Add Stop</Button>
              </div>
            </Form.Item>
          </Form>
        </Modal> 

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
          <Form form={form} layout="vertical" size="large" style={{ marginTop: 16 }} onFinish={handleAddStop}>
            <Form.Item name="title" label="TITLE" rules={[{ required: true, message: "Please enter a title" }]} style={{ marginBottom: 12}}>
              <Input placeholder={viewingStop?.stop.title} disabled />
            </Form.Item>
            <Form.Item name="location" label="LOCATION" rules={[{ required: true, message: "Please enter a location" }]} style={{ marginBottom: 12}}>
              <Input placeholder={viewingStop?.stop.location} disabled />
            </Form.Item>
            <Form.Item label="TIME" rules={[{ required: true, message: "Please enter a time" }]} style={{ marginBottom: 12}}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Form.Item name="startTime" noStyle>
                  <Input placeholder={viewingStop?.stop.startTime?.format("HH:mm")} disabled />
                </Form.Item>
                <span style={{ color: "#c0392b" }}>→</span>
                <Form.Item name="endTime" noStyle>
                  <Input placeholder={viewingStop?.stop.endTime?.format("HH:mm")} disabled />
                </Form.Item>
              </div>
            </Form.Item>
            <Form.Item name="notes" label="NOTES">
              <Input.TextArea placeholder={viewingStop?.stop.notes} rows={3} disabled />
            </Form.Item>
            <Form.Item style={{ marginBottom: 0, marginTop: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Button danger onClick={() => setConfirmingDelete(true)}>Delete</Button>
                <Button type="primary" onClick={() => {
                  if (viewingStop) form.setFieldsValue({
                    ...viewingStop.stop,
                    startTime: viewingStop.stop.startTime ? dayjs(viewingStop.stop.startTime) : null,
                    endTime: viewingStop.stop.endTime ? dayjs(viewingStop.stop.endTime) : null,
                  });
                  setEditingStop(viewingStop); 
                  setViewingStop(null)}}>Edit</Button>
              </div>
            </Form.Item>
          </Form>
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

        {/* Edit Stop Modal */}
        <Modal
          title={
            <div>
              <div style={{ color: "#000", fontSize: 18, fontWeight: 600 }}>
                {editingStop?.date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </div>
            </div>
          }
          open={!!editingStop}
          onCancel={() => { setEditingStop(null); form.resetFields(); }}
          footer={null}
        >
          <Form form={form} layout="vertical" size="large" style={{ marginTop: 16 }} onFinish={handleEditStop}>
            <Form.Item name="title" label="TITLE" rules={[{ required: true, message: "Please enter a title" }]} style={{ marginBottom: 12}}>
              <Input placeholder={editingStop?.stop.title} />
            </Form.Item>
            <Form.Item name="location" label="LOCATION" rules={[{ required: true, message: "Please enter a location" }]} style={{ marginBottom: 12}}>
              <PlaceAutocomplete 
                key={editingStop?.stop.location}
                onPlaceSelect={setSelectedPlace}
                value={editingStop?.stop.location}
              />
            </Form.Item>
            <Form.Item label="TIME" rules={[{ required: true, message: "Please enter a time" }]} style={{ marginBottom: 12}}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Form.Item name="startTime" noStyle>
                  <TimePicker format="HH:mm" placeholder="From" style={{ flex: 1 }} needConfirm={false} />
                </Form.Item>
                <span style={{ color: "#c0392b" }}>→</span>
                <Form.Item name="endTime" noStyle>
                  <TimePicker 
                    format="HH:mm" 
                    placeholder="To" 
                    style={{ flex: 1 }} 
                    needConfirm={false}
                    disabledTime={() => {
                    const start = form.getFieldValue("startTime");
                    if (!start) return {};
                    return {
                      disabledHours: () => Array.from({ length: start.hour() }, (_, i) => i),
                      disabledMinutes: (hour) =>
                        hour === start.hour()
                          ? Array.from({ length: start.minute() + 1 }, (_, i) => i)
                          : [],
                    };
                    }} 
                  />
                </Form.Item>
              </div>
            </Form.Item>
            <Form.Item name="notes" label="NOTES">
              <Input.TextArea placeholder={editingStop?.stop.notes} rows={3} />
            </Form.Item>
            <Form.Item style={{ marginBottom: 0, marginTop: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Button onClick={() => {setEditingStop(null); form.resetFields();}}>Cancel</Button>
                <Button type="primary" htmlType="submit">Save</Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      </ConfigProvider>
    </div>
  );
}

export default TripCalendar;
