export interface Location {
  id: number | null; // database ID
  placeId: string | null; // Google Place ID
  name: string | null;
  latitude: number | null;
  longitude: number | null;
}