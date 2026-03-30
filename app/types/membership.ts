import { User } from "./user";
import { Trip } from "./trip";
 
export type MembershipRole = "owner" | "member";
 
export interface Membership {
  membershipId: number;
  joinedAt: Date;
  role: MembershipRole;
  trip: Trip;
  user: User;
}