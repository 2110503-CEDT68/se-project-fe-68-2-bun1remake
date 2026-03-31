import { SingleHotelJson } from "@/interface";
import { buildBackendUrl } from "@/libs/backendApiBase";

export default async function getVenue(vid: string) {
  // const hotel = hotels.data.find((h) => h.id === vid || h._id === vid);
  // return { success: !!hotel, data: hotel ?? null };
  const response = await fetch(buildBackendUrl(`/hotels/${encodeURIComponent(vid)}`),
    {cache: "no-store"},

  );
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error("Failed to fetch hotel");
  }
  console.log("Fetched hotel data:", data);
  return data as SingleHotelJson;
}
// TODO: update this to fetch from backend instead of local data, and handle errors properly
