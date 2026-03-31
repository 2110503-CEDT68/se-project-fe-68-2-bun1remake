import { HotelJson } from "../interface";
import { buildBackendUrl } from "@/libs/backendApiBase";

interface GetHotelsOptions {
  noStore?: boolean;
}

export default async function getVenues(options?: GetHotelsOptions) {
  const response = await fetch(
    buildBackendUrl("/hotels"),
    options?.noStore ? { cache: "no-store" } : { next: { revalidate: 60 } },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch venues");
  }

  const data = await response.json();

  return data as HotelJson;
}
