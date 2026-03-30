import { User } from "./user";
import { Trip } from "./trip";
 
export type MembershipRole = "owner" | "member";
 
export interface Membership {
  id: number | null;
  joinedAt: Date | null;
  role: MembershipRole;
  trip: Trip | null;
  user: User | null;
}