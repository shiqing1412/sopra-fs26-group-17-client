import { User } from "./user";
import { Location } from "./location";
 
export interface Event {
  eventId: number | null;
  date: Date | null;
  time: string | null; // "HH:mm" format
  notes: string | null;
  creator: User | null;
  location: Location | null;
  tripId: number | null;
}