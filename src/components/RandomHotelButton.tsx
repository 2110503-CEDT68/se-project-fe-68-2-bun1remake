"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, CircularProgress } from "@mui/material";
import { fetchHotelsAction } from "@/libs/actionGetHotels";
import {
  getDateRangeFromSearchParams,
  buildDateRangeHref,
} from "@/libs/dateRangeParams";

export default function RandomHotelButton() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  const handleRandomize = async () => {
    setLoading(true);
    try {
      // 1. Fetch data on demand via the Server Action
      const hotelsJson = await fetchHotelsAction();
      const hotels = hotelsJson.data || [];

      if (hotels.length === 0) return;

      // 2. Pick random
      const randomHotel = hotels[Math.floor(Math.random() * hotels.length)];
      const id = randomHotel.id || randomHotel._id;

      // 3. Pull dates/guests from the current page URL
      const currentUrlParams = getDateRangeFromSearchParams(searchParams);

      // 4. Navigate
      const href = buildDateRangeHref(`/hotel/${id}`, currentUrlParams);
      router.push(href);
    } catch (error) {
      console.error("Randomizer failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="contained"
      className="!px-1 figma-button font-figma-display"
      onClick={handleRandomize}
      sx={{
        minWidth: "",
        borderRadius: "6px !important",
        padding: "0 !important",
        "& .MuiButton-startIcon": {
          margin: 0,
        },
        backgroundColor: "var(--figma-red)",
        "&:hover": {
          backgroundColor: "var(--figma-red)",
          filter: "brightness(0.9)",
        },
        py: "4px !important",
      }}
      disableElevation
    >
      <img
        src="/dice.svg"
        alt=""
        style={{ width: 30, height: 30, filter: "invert(1)" }}
      />
    </Button>
  );
}
