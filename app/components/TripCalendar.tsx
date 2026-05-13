import type { Trip } from "@/types/trip";
import { User } from "@/types/user";
import styles from "@/styles/trips.module.css";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { Button, ConfigProvider, Form, Modal } from "antd";
import { showError } from "@/utils/showError";
import { ApiService } from "@/api/apiService";
import dayjs, { Dayjs } from "dayjs";
import { getAvatarColor, getAvatarInitial } from "@/utils/avatarColors";
import StopModal, { StopFormValues } from "./StopModal";

const HOUR_HEIGHT = 56; // px per hour
const TIME_LABEL_WIDTH = 44; // px for hour labels column
const COLUMN_WIDTH = 264; // total day column width
const CONTENT_WIDTH = COLUMN_WIDTH - TIME_LABEL_WIDTH; // 220px for events
const MIN_EVENT_HEIGHT = 22; // px minimum card height
const STACK_GAP_MIN = 30; // events closer than this are shown side-by-side, not stacked

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

function timeInMinutes(t: Dayjs | null): number {
  if (!t) return 0;
  return t.hour() * 60 + t.minute();
}

function yToTime(y: number, startHour: number): Dayjs {
  const raw = (y / HOUR_HEIGHT) * 60 + startHour * 60;
  const snapped = Math.max(0, Math.min(Math.round(raw / 15) * 15, 23 * 60 + 45));
  return dayjs().hour(Math.floor(snapped / 60)).minute(snapped % 60).second(0);
}

interface PositionedStop {
  stop: NewStopValues & { id: string };
  column: number;
  totalColumns: number;
  depth: number; // how many earlier events in the same column overlap this one (for visual indent)
}

type StopWithId = NewStopValues & { id: string };

function endMinutes(stop: StopWithId): number {
  const start = timeInMinutes(stop.startTime);
  return stop.endTime ? timeInMinutes(stop.endTime) : start + 30;
}

// Pure time overlap — no buffer
function overlaps(a: StopWithId, b: StopWithId): boolean {
  return timeInMinutes(a.startTime) < endMinutes(b) && endMinutes(a) > timeInMinutes(b.startTime);
}

function buildClusters(sorted: StopWithId[]): StopWithId[][] {
  const clusters: StopWithId[][] = [];
  for (const stop of sorted) {
    const matching = clusters.filter(c => c.some(e => overlaps(stop, e)));
    if (matching.length === 0) {
      clusters.push([stop]);
    } else {
      const merged: StopWithId[] = [stop, ...matching.flat()];
      for (const c of matching) clusters.splice(clusters.indexOf(c), 1);
      clusters.push(merged);
    }
  }
  return clusters;
}

function assignColumns(cluster: StopWithId[]): PositionedStop[] {
  const sorted = [...cluster].sort((a, b) => timeInMinutes(a.startTime) - timeInMinutes(b.startTime));
  // Each entry is the list of events assigned to that column
  const columns: StopWithId[][] = [];
  const colMap = new Map<string, number>();

  for (const stop of sorted) {
    const stopStart = timeInMinutes(stop.startTime);
    // Find the first column with no side-by-side conflict.
    // Conflict = this stop overlaps an existing event AND their start times are < STACK_GAP_MIN apart.
    let foundCol = columns.findIndex(col =>
      !col.some(e => overlaps(stop, e) && stopStart - timeInMinutes(e.startTime) < STACK_GAP_MIN)
    );
    if (foundCol === -1) foundCol = columns.length;
    if (!columns[foundCol]) columns[foundCol] = [];
    columns[foundCol].push(stop);
    colMap.set(stop.id, foundCol);
  }

  const totalColumns = columns.length;
  return cluster.map(stop => {
    const col = colMap.get(stop.id) ?? 0;
    const stopStart = timeInMinutes(stop.startTime);
    // Depth = number of earlier events in the same column that this one overlaps (for visual indent)
    const depth = columns[col].filter(
      e => e.id !== stop.id && timeInMinutes(e.startTime) < stopStart && overlaps(e, stop)
    ).length;
    return { stop, column: col, totalColumns, depth };
  });
}

function computeEventLayouts(stops: StopWithId[]): PositionedStop[] {
  const timed = stops.filter(s => s.startTime !== null);
  if (timed.length === 0) return [];
  const sorted = [...timed].sort((a, b) => timeInMinutes(a.startTime) - timeInMinutes(b.startTime));
  return buildClusters(sorted).flatMap(assignColumns);
}

interface EventMemberDTO {
  userId: number;
  username: string;
}

interface EventGetDTO {
  eventId: number;
  eventTitle: string;
  date: string;
  time: string;
  endTime: string | null;
  notes: string;
  placeName: string;
  placeId: string | null;
  lat: number;
  lng: number;
  createdBy: string;
  members: EventMemberDTO[];
  userStatus: "JOINED" | "DISMISSED" | "OPTED OUT" | "NONE";
  hasConflict: boolean
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
  highlightedStopId: string | null;
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
  members: { userId: number; username: string }[];
  hasConflict: boolean;
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

function EventMemberAvatars({ members }: Readonly<{ members: { userId: number; username: string }[] }>) {
  if (!members || members.length === 0) return null;
 
  return (
    <div className={styles.eventMember}>
      {members.map((member) => (
        <div
          key={member.userId}
          className={styles.eventMemberAvatar}
          style={{ backgroundColor: getAvatarColor(member.username) }}
          title={member.username}
        >
          {getAvatarInitial(member.username)}
        </div>
      ))}
    </div>
  );
}
 
function DayColumn({ onAddStopClick, onStopClick, stops, highlightedStopId, earlyHoursExpanded }: Readonly<{
  onAddStopClick: (times?: { startTime: Dayjs; endTime: Dayjs }) => void;
  onStopClick: (stop: StopWithId) => void;
  stops: StopWithId[];
  highlightedStopId: string | null;
  earlyHoursExpanded: boolean;
}>) {
  const untimedStops = stops.filter(s => !s.startTime);
  const layouts = computeEventLayouts(stops);

  const startHour = earlyHoursExpanded ? 0 : 6;
  const visibleHours = 24 - startHour;
  const hourOffset = startHour * HOUR_HEIGHT;

  // Drag-to-create state
  const timelineRef = useRef<HTMLDivElement>(null);
  const dragActiveRef = useRef(false);
  const dragStartYRef = useRef(0);
  const startHourRef = useRef(startHour);
  startHourRef.current = startHour;
  const onAddStopClickRef = useRef(onAddStopClick);
  onAddStopClickRef.current = onAddStopClick;
  const [dragBox, setDragBox] = useState<{ top: number; height: number } | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragActiveRef.current) return;
      const rect = timelineRef.current?.getBoundingClientRect();
      if (!rect) return;
      const currentY = Math.max(0, Math.min(e.clientY - rect.top, rect.height));
      const top = Math.min(dragStartYRef.current, currentY);
      const height = Math.abs(currentY - dragStartYRef.current);
      setDragBox({ top, height });
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!dragActiveRef.current) return;
      dragActiveRef.current = false;
      const rect = timelineRef.current?.getBoundingClientRect();
      if (!rect) return;
      const currentY = Math.max(0, Math.min(e.clientY - rect.top, rect.height));
      const topY = Math.min(dragStartYRef.current, currentY);
      const bottomY = Math.max(dragStartYRef.current, currentY);
      setDragBox(null);
      if (bottomY - topY > 10) {
        const startTime = yToTime(topY, startHourRef.current);
        const endTime = yToTime(bottomY, startHourRef.current);
        onAddStopClickRef.current({ startTime, endTime });
      }
    };

    globalThis.addEventListener("mousemove", handleMouseMove);
    globalThis.addEventListener("mouseup", handleMouseUp);
    return () => {
      globalThis.removeEventListener("mousemove", handleMouseMove);
      globalThis.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleTimelineMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button")) return;
    e.preventDefault();
    const rect = timelineRef.current?.getBoundingClientRect();
    if (!rect) return;
    const y = Math.max(0, e.clientY - rect.top);
    dragActiveRef.current = true;
    dragStartYRef.current = y;
    setDragBox({ top: y, height: 0 });
  };

  return (
    <div className={styles.calendarDayColumn}>
      {untimedStops.length > 0 && (
        <div className={styles.calendarUntimedStops}>
          {untimedStops.map(stop => (
            <button key={stop.id} className={styles.calendarStopCard} onClick={() => onStopClick(stop)}>
              <div className={styles.calendarStopTitle}>{stop.title}</div>
              {stop.location && <div className={styles.calendarStopLocation}>📍{stop.location}</div>}
            </button>
          ))}
        </div>
      )}

      <div
        ref={timelineRef}
        className={styles.calendarTimeline}
        style={{ height: visibleHours * HOUR_HEIGHT, cursor: "crosshair" }}
        onMouseDown={handleTimelineMouseDown}
      >
        {Array.from({ length: visibleHours }, (_, i) => {
          const h = startHour + i;
          return (
            <div key={h} className={styles.calendarHourRow} style={{ top: i * HOUR_HEIGHT }}>
              <span className={styles.calendarHourLabel}>{String(h).padStart(2, "0")}:00</span>
              <div className={styles.calendarHourLine} />
            </div>
          );
        })}

        {layouts.map(({ stop, column, totalColumns, depth }) => {
          const startMin = timeInMinutes(stop.startTime);
          const durationMin = Math.max(endMinutes(stop) - startMin, MIN_EVENT_HEIGHT * (60 / HOUR_HEIGHT));
          const top = (startMin / 60) * HOUR_HEIGHT - hourOffset;
          const height = Math.max((durationMin / 60) * HOUR_HEIGHT, MIN_EVENT_HEIGHT);
          const creatorColor = getAvatarColor(stop.createdBy?.username ?? null);
          const colWidth = Math.floor(CONTENT_WIDTH / totalColumns);
          const indent = depth * 10;
          const left = TIME_LABEL_WIDTH + column * colWidth + indent;
          return (
            <button
              key={stop.id}
              className={`${styles.calendarTimelineEvent} ${highlightedStopId === stop.id ? styles.calendarTimelineEventHighlighted : ""}`}
              style={{
                top: `${top}px`,
                height: `${height}px`,
                left: `${left}px`,
                width: `${colWidth - 2 - indent}px`,
                backgroundColor: `${creatorColor}28`,
                borderLeftColor: creatorColor,
                zIndex: Math.round(100000 / Math.max(height, 1)),
              }}
              onClick={() => onStopClick(stop)}
            >
              <div
                className={styles.calendarEventCreator}
                title={stop.createdBy?.username ?? ""}
                style={{ backgroundColor: creatorColor }}
              >
                {getAvatarInitial(stop.createdBy?.username)}
              </div>
              <div className={styles.calendarEventTime}>
                {stop.startTime?.format("HH:mm")}{stop.endTime ? `–${stop.endTime.format("HH:mm")}` : ""}
              </div>
              <div className={styles.calendarEventTitle}>{stop.title}</div>
              {height > 52 && stop.location && (
                <div className={styles.calendarEventLocation}>📍{stop.location}</div>
              )}
            </button>
          );
        })}
        <button className={styles.calendarAddStopBtn} onClick={() => onAddStopClick()}>
          + Add stop
        </button>
        
        {dragBox && dragBox.height > 0 && (
          <div
            style={{
              position: "absolute",
              left: TIME_LABEL_WIDTH,
              width: CONTENT_WIDTH - 2,
              top: dragBox.top,
              height: dragBox.height,
              backgroundColor: "rgba(192, 57, 43, 0.12)",
              border: "1.5px dashed #c0392b",
              borderRadius: 4,
              pointerEvents: "none",
              zIndex: 10,
            }}
          />
        )}
      </div>
    </div>
  );
}
 
function TripCalendar({ trip, currentUser, refetchTrigger, stops, setStops, highlightedStopId  }: Readonly<TripCalendarValues>) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dragTimes, setDragTimes] = useState<{ startTime: Dayjs; endTime: Dayjs } | null>(null);
  const days = getDaysBetween(trip.startDate ?? "", trip.endDate ?? "");
  const [form] = Form.useForm<StopFormValues>();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stickyHeaderRef = useRef<HTMLDivElement>(null);
  const [earlyHoursExpanded, setEarlyHoursExpanded] = useState(false);
  const prevExpandedRef = useRef(false);

  // JS-based sticky: counteract vertical scroll so the header stays pinned at y=0
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const handleScroll = () => {
      if (stickyHeaderRef.current) {
        stickyHeaderRef.current.style.transform = `translateY(${el.scrollTop}px)`;
      }
    };
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  // After expanding early hours, scroll so 6am stays at the same visual position
  useLayoutEffect(() => {
    if (earlyHoursExpanded && !prevExpandedRef.current && wrapperRef.current) {
      const newScrollTop = 6 * HOUR_HEIGHT;
      wrapperRef.current.scrollTop = newScrollTop;
      if (stickyHeaderRef.current) {
        stickyHeaderRef.current.style.transform = `translateY(${newScrollTop}px)`;
      }
    }
    prevExpandedRef.current = earlyHoursExpanded;
  }, [earlyHoursExpanded]);

  // Expand early hours when user scrolls up past the top of the timeline
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY < 0 && el.scrollTop <= 0 && !earlyHoursExpanded) {
        setEarlyHoursExpanded(true);
      }
    };
    el.addEventListener("wheel", handleWheel, { passive: true });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [earlyHoursExpanded]);
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
        endTime: values.endTime?.format("HH:mm:ss") ?? null,
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
        members: response.members ?? [],
        hasConflict: response.hasConflict ?? false,
      };

      setStops(prev => ({ ...prev, [key]: [...(prev[key] ?? []), newStop] }));
      setSelectedPlace(null);
    } catch (error) {
      showError(error, "Failed to add stop.");
    }
  };

  useEffect(() => {
    if (!trip?.tripId) return;

    const fetchEvents = async () => {
      try {
        
        const api = new ApiService();
        const res = await api.get<{days: DayDTO[]}>(`/trips/${trip.tripId}/events`);

        const fetched: Record<string, (NewStopValues & { id: string })[]> = {};
        for (const day of res.days) {
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
            endTime: event.endTime ? dayjs(event.endTime, "HH:mm:ss") : null,
            notes: event.notes ?? "",
            createdBy: { username: event.createdBy } as User,
            members: event.members ?? [],
            hasConflict: event.hasConflict ?? false,
          }));
        }
        setStops(fetched);
      } catch (error) {
        showError(error, "Failed to load events.");
      }
    };

    fetchEvents();
  }, [trip.tripId, refetchTrigger, setStops]);

  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.Place | null>(null);
  const [viewingStop, setViewingStop] = useState<{ stop: NewStopValues; date: Date } | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editingStop, setEditingStop] = useState<{ stop: NewStopValues; date: Date } | null>(null);
  const [optOutLoading, setOptOutLoading] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);

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
    } catch (error) {
      showError(error, "Failed to delete the stop. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleOptOut = async () => {
    if (!viewingStop || !currentUser) return;
    const key = dateKey(viewingStop.date);
    setOptOutLoading(true);
    try {
      const api = new ApiService();
      const result = await api.delete<EventGetDTO>(`/trips/${trip.tripId}/events/${viewingStop.stop.id}/join`);
      const updatedStop = { ...viewingStop.stop, members: result.members ?? [] };
      setStops(prev => {
        console.log("available keys:", Object.keys(prev));
        return {
          ...prev,
          [key]: prev[key].map(s => s.id === viewingStop.stop.id ? updatedStop : s),
        };
      });
      setViewingStop(null);
    } catch (error) {
      showError(error, "Failed to opt out. Please try again.");
    } finally {
      setOptOutLoading(false);
    }
  };

const handleJoin = async () => {
  if (!viewingStop || !currentUser) return;
  const key = dateKey(viewingStop.date);
  setJoinLoading(true);
  try {
    const api = new ApiService();
    const result = await api.post<EventGetDTO>(`/trips/${trip.tripId}/events/${viewingStop.stop.id}/join`, {});
    const updatedStop = { ...viewingStop.stop, members: result.members ?? [] };
    setStops(prev => ({
      ...prev,
      [key]: prev[key].map(s => s.id === viewingStop.stop.id ? updatedStop : s),
    }));
    setViewingStop(null);
  } catch (error) {
    showError(error, "Failed to join event. Please try again.");
  } finally {
    setJoinLoading(false);
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
        endTime: values.endTime?.format("HH:mm:ss") ?? null,
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
        members: editingStop.stop.members,
        hasConflict: editingStop.stop.hasConflict,
      };

      setStops(prev => {
        const next = { ...prev };
        next[oldKey] = (next[oldKey] ?? []).filter(s => s.id !== editingStop.stop.id);
        next[newKey] = [...(next[newKey] ?? []), updatedStop];
        return next;
      });
      setEditingStop(null);

    } catch (error) {
      showError(error, "Failed to edit stop.");
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
      showError(error, "Failed to save stop.");
    }
  };

  return (
    <div className={styles.calendarScrollWrapper} ref={wrapperRef}>
      <div className={styles.calendarStickyHeaderRow} ref={stickyHeaderRef}>
        {days.map((date, i) => (
          <div key={dateKey(date)} className={styles.calendarDayHeader}>
            <span className={styles.calendarDayLabel}>DAY {i + 1}</span>
            <span className={styles.calendarDayNumber}>{date.getDate()}</span>
            <span className={styles.calendarDayName}>{DAY_NAMES[date.getDay()]}, {MONTH_NAMES[date.getMonth()]}</span>
          </div>
        ))}
      </div>
      <div className={styles.calendarGrid}>
        {days.map((date) => (
          <DayColumn
            key={dateKey(date)}
            onAddStopClick={(times) => { setSelectedDate(date); setDragTimes(times ?? null); }}
            stops={stops[dateKey(date)] ?? []}
            onStopClick={(stop) => setViewingStop({ stop, date })}
            highlightedStopId={highlightedStopId}
            earlyHoursExpanded={earlyHoursExpanded}
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
            setDragTimes(null);
          }}
          onFinish={handleFinish}
          initialData={editingStop}
          selectedDate={selectedDate}
          tripStartDate={trip.startDate}
          tripEndDate={trip.endDate}
          form={form}
          setSelectedPlace={setSelectedPlace}
          prefillTimes={dragTimes}
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
              <EventMemberAvatars members={viewingStop?.stop.members ?? []}/>
            </button>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Button danger onClick={() => setConfirmingDelete(true)}>Delete</Button>
              <Button
                type="default"
                onClick={handleJoin}
                loading={joinLoading}
                disabled={viewingStop?.stop.members.some(m => m.username === currentUser?.username)}>Join</Button>
              <Button
                onClick={handleOptOut}
                loading={optOutLoading}
                disabled={!viewingStop?.stop.members.some(m => m.username === currentUser?.username)}>Opt out</Button>
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
