export const AVATAR_COLORS = ["#c0392b", "#2980b9", "#27ae60", "#8e44ad", "#d35400", "#16a085"];

export function getAvatarColor(username: string | null): string {
  if (!username) return AVATAR_COLORS[0];
  const index = (username.codePointAt(0) ?? 0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}
