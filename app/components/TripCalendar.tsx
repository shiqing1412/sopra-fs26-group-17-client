import type { Trip } from "@/types/trip";
import styles from "@/styles/trips.module.css";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];
 
interface TripCalendarValues {
  trip: Trip;
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
 
function DayColumn({ date, dayNumber }: { date: Date; dayNumber: number }) {
  return (
    <div className={styles.calendarDayColumn}>
      <div className={styles.calendarDayHeader}>
        <span className={styles.calendarDayLabel}>DAY {dayNumber}</span>
        <span className={styles.calendarDayNumber}>{date.getDate()}</span>
        <span className={styles.calendarDayName}>{DAY_NAMES[date.getDay()]}, {MONTH_NAMES[date.getMonth()]}</span>
      </div>
      <div className={styles.calendarDayStops}>
        {/* event cards will go here */}
        <button className={styles.calendarAddStopBtn} onClick={() => { /* add stop for this date */ }}>
          + Add stop
        </button>
      </div>
    </div>
  );
}
 
function TripCalendar({ trip }: TripCalendarValues) {
  const days = getDaysBetween(trip.startDate ?? "", trip.endDate ?? "");

  return (
    <div className={styles.calendarScrollWrapper}>
      <div className={styles.calendarGrid}>
        {days.map((date, i) => (
          <DayColumn key={date.toISOString()} date={date} dayNumber={i + 1} />
        ))}
      </div>
    </div>
  );
}

export default TripCalendar;