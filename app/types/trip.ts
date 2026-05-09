import { Event } from "./event";

export interface TripMember {
  userId: number;
  username: string;
  role: string;
  status: string;
  active: boolean | null;
  currentUser: boolean | null;
}

export interface Trip {
  tripId: string | null;
  joinToken: string;
  tripTitle: string | null;
  startDate: string | null;
  endDate: string | null;
  shareCode: string | null;
  status: string | null;
  members: TripMember[] | null;
  illustration: string | null;
  owner: string | null;
  events: Event[] | null;
}