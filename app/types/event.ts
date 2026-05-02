import { User } from "./user";
import { Location } from "./location";
 
export interface Event {
  id: number | null;
  title: string | null;
  date: Date | null;
  time: string | null;
  endTime: string | null; // "HH:mm" format
  notes: string | null;
  creator: User | null;
  location: Location | null;
  tripId: number | null;
  members: { userId: number; username: string }[];
  userStatus: "JOINED" | "DISMISSED" | "OPTED OUT" | "NONE";
  hasConflict: boolean
}