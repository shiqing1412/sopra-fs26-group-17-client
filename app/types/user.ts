export interface User {
  id: number | null;
  username: string | null;
  token: string | null;
  status: string | null;
  password: string | null;
  lastActive: Date | null;
}