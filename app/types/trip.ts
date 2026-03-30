import { User } from "./user";
import { Event } from "./event";
 
export interface Trip {
  id: string | null;
  title: string | null;
  startDate: string | null;
  endDate: string | null;
  shareCode: string | null;
  status: string | null;
  collaborators: string | null;
  illustration: string | null;
  owner: User | null;
  events: Event[] | null;
}