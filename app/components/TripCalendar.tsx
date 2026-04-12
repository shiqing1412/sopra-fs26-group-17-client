import type { Trip } from "@/types/trip";
import styles from "@/styles/trips.module.css";
import { useState } from "react";
import { Button, ConfigProvider, Form, Input, Modal, TimePicker } from "antd";
import { Dayjs } from "dayjs";
import PlaceAutocomplete from "./LocationSearch";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];
 
interface TripCalendarValues {
  trip: Trip;
}

interface NewStopValues {
  title: string;
  location: string;
  startTime: Dayjs | null;
  endTime: Dayjs | null;
  notes: string;
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
 
function DayColumn({ date, dayNumber, onAddStopClick, stops }: Readonly<{ date: Date; dayNumber: number; onAddStopClick: () => void; stops: (NewStopValues & { id: string })[] }>) {
  return (
    <div className={styles.calendarDayColumn}>
      <div className={styles.calendarDayHeader}>
        <span className={styles.calendarDayLabel}>DAY {dayNumber}</span>
        <span className={styles.calendarDayNumber}>{date.getDate()}</span>
        <span className={styles.calendarDayName}>{DAY_NAMES[date.getDay()]}, {MONTH_NAMES[date.getMonth()]}</span>
      </div>
      <div className={styles.calendarDayStops}>
        {stops.map(stop => (
          <div key={stop.id} className={styles.calendarStopCard}>
            <div className={styles.calendarStopTime}>
              {stop.startTime?.format("HH:mm")} {stop.endTime ? `→ ${stop.endTime.format("HH:mm")}` : ""}
            </div>
            <div className={styles.calendarStopTitle}>{stop.title}</div>
            <div className={styles.calendarStopLocation}>📍{stop.location}</div>
            <div className={styles.calendarStopNotes}>{stop.notes}</div>
          </div>
        ))}
        <button className={styles.calendarAddStopBtn} onClick={onAddStopClick}>
          + Add stop
        </button>
      </div>
    </div>
  );
}
 
function TripCalendar({ trip }: TripCalendarValues) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const days = getDaysBetween(trip.startDate ?? "", trip.endDate ?? "");
  const [form] = Form.useForm<NewStopValues>();
  const [stops, setStops] = useState<Record<string, (NewStopValues & { id: string })[]>>({});

  const handleAddStop = (values: NewStopValues) => {
    if (!selectedDate) return;
    const key = selectedDate.toISOString();
    const newStop: NewStopValues & { id: string } = { ...values, id: crypto.randomUUID() };
    setStops(prev => ({ ...prev, [key]: [...(prev[key] ?? []), newStop] })); // keeping existing stops, adding new stops
    form.resetFields(); 
    setSelectedDate(null); // close modal after adding stop
  };

  const [selectedPlace, setSelectedPlace] = useState<any>(null)

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
      </ConfigProvider>
    </div>
  );
}

export default TripCalendar;
