import { User } from "./user";
import { Event } from "./event";
 
export interface Trip {
  tripId: number | null;
  title: string | null;
  startDate: Date | null;
  endDate: Date | null;
  shareCode: string | null;
  owner: User | null;
  events: Event[] | null;
}