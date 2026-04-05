import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import BookingList from "@/components/BookingList";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import getHotels from "@/libs/getHotels";

export default async function AdminPage() {
  const session = await getServerSession(authOptions).catch(() => null);

  if (!session) {
    redirect("/login?callbackUrl=%2Fadmin");
  }

  if (session.user.role !== "admin" && session.user.email !== "admin@example.com") {
    redirect("/");
  }

  const hotels = await getHotels();

  return (
    <main className="figma-page py-10 sm:py-12">
      <div className="figma-shell">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-figma-copy text-[2.6rem] text-[var(--figma-ink)] sm:text-[3rem]">
            User&apos;s Bookings
          </h1>
          <Link
            href="/admin/hotels"
            className="figma-button px-5 py-3 font-figma-nav text-[1.3rem]"
          >
            MANAGE HOTELS
          </Link>
        </div>
        <BookingList hotels={hotels.data} isAdmin />
      </div>
    </main>
  );
}
