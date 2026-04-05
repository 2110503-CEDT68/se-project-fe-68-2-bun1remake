"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { CommentItem } from "@/interface";
import { createComment, deleteComment, getComments } from "@/libs/commentsApi";
import { useDismissibleNotice } from "@/libs/useDismissibleNotice";
import DismissibleNotice from "@/components/DismissibleNotice";

interface HotelReviewsProps {
  hotelId: string;
}

function resolveUserId(userId: CommentItem["userId"]) {
  if (typeof userId === "string") return userId;
  if (userId && typeof userId === "object") {
    return (userId as { _id?: string; id?: string })._id ||
      (userId as { _id?: string; id?: string }).id ||
      "";
  }
  return "";
}

function resolveUserName(userId: CommentItem["userId"]) {
  if (userId && typeof userId === "object") {
    return (userId as { name?: string }).name || "Guest";
  }
  return "Guest";
}

function StarRow({ value, max = 5 }: { value: number; max?: number }) {
  const filled = Math.round(Math.min(max, Math.max(0, value)));
  return (
    <span
      aria-label={`${filled} out of ${max} stars`}
      className="text-[var(--figma-red)] tracking-wide"
    >
      {"★".repeat(filled)}
      {"☆".repeat(max - filled)}
    </span>
  );
}

export default function HotelReviews({ hotelId }: HotelReviewsProps) {
  const { data: session } = useSession();
  const token = session?.user?.token || "";
  const userId = session?.user?._id || "";
  const userRole = session?.user?.role || "";

  const [comments, setComments] = useState<CommentItem[]>([]);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { notice, showNotice, dismissNotice } = useDismissibleNotice();

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);

    getComments(hotelId)
      .then((data) => {
        if (!ignore) {
          setComments(data.data);
          setAverageRating(data.averageRating);
        }
      })
      .catch(() => {
        if (!ignore) setComments([]);
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [hotelId]);

  const recalcAverage = (list: CommentItem[]) => {
    if (list.length === 0) return null;
    return parseFloat((list.reduce((s, c) => s + c.rating, 0) / list.length).toFixed(2));
  };

  const handleSubmit = async () => {
    if (!token) return;

    if (!newComment.trim()) {
      showNotice({ type: "error", message: "Please write a comment." });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createComment(hotelId, token, {
        comment: newComment.trim(),
        rating: newRating,
      });
      const created = result.data;

      if (created) {
        const updated = [created, ...comments];
        setComments(updated);
        setAverageRating(recalcAverage(updated));
      }

      setNewComment("");
      setNewRating(5);
      showNotice({ type: "success", message: "Review submitted." });
    } catch (err) {
      showNotice({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to submit.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!token) return;

    try {
      await deleteComment(commentId, token);
      const remaining = comments.filter((c) => c._id !== commentId);
      setComments(remaining);
      setAverageRating(recalcAverage(remaining));
    } catch (err) {
      showNotice({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to delete.",
      });
    }
  };

  return (
    <section className="mt-8 border border-[rgba(171,25,46,0.08)] bg-[rgba(255,245,244,0.45)] p-5 sm:p-10">
      <div className="mb-6 flex flex-wrap items-baseline gap-4">
        <h2 className="font-figma-copy text-[2rem] text-[var(--figma-ink)] sm:text-[2.5rem]">
          Reviews
        </h2>
        {averageRating !== null ? (
          <span className="font-figma-copy text-[1.3rem] text-[var(--figma-ink-soft)]">
            {averageRating.toFixed(1)} / 5
          </span>
        ) : null}
      </div>

      {isLoading ? (
        <p className="font-figma-copy text-[1.3rem] text-[var(--figma-ink-soft)]">Loading...</p>
      ) : comments.length === 0 ? (
        <p className="font-figma-copy text-[1.3rem] text-[var(--figma-ink-soft)]">
          No ratings yet
        </p>
      ) : (
        <div className="mb-8 space-y-5">
          {comments.map((c) => {
            const commentUserId = resolveUserId(c.userId);
            const canDelete =
              userRole === "admin" ||
              (userRole === "user" && !!userId && commentUserId === userId);

            return (
              <article
                key={c._id}
                className="border-b border-[rgba(171,25,46,0.08)] pb-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <StarRow value={c.rating} />
                    <p className="mt-2 font-figma-copy text-[1.25rem] text-[var(--figma-ink)]">
                      {c.comment}
                    </p>
                    <p className="mt-1 font-figma-copy text-[1.05rem] text-[var(--figma-ink-soft)]">
                      {resolveUserName(c.userId)}
                      {" · "}
                      {new Date(c.commentDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>

                  {canDelete ? (
                    <button
                      type="button"
                      onClick={() => void handleDelete(c._id)}
                      className="figma-button-secondary shrink-0 px-3 py-1.5 font-figma-nav text-[0.95rem]"
                    >
                      DELETE
                    </button>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {token ? (
        <div className="mt-6 space-y-4 border-t border-[rgba(171,25,46,0.12)] pt-6">
          <h3 className="font-figma-copy text-[1.5rem] text-[var(--figma-ink)]">
            Write a Review
          </h3>

          <div className="flex items-center gap-3">
            <label className="font-figma-copy text-[1.2rem] text-[var(--figma-red)]">
              Rating
            </label>
            <select
              value={newRating}
              onChange={(e) => setNewRating(Number(e.target.value))}
              className="figma-input max-w-[8rem]"
            >
              {[5, 4, 3, 2, 1, 0].map((v) => (
                <option key={v} value={v}>
                  {v} / 5
                </option>
              ))}
            </select>
          </div>

          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your experience..."
            rows={3}
            className="figma-input resize-none"
          />

          <DismissibleNotice notice={notice} onClose={dismissNotice} />

          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={isSubmitting}
            className="figma-button px-6 py-3 font-figma-nav text-[1.4rem]"
          >
            {isSubmitting ? "SUBMITTING" : "SUBMIT"}
          </button>
        </div>
      ) : (
        <p className="mt-6 border-t border-[rgba(171,25,46,0.12)] pt-6 font-figma-copy text-[1.2rem] text-[var(--figma-ink-soft)]">
          <a href="/login" className="figma-link">
            Sign in
          </a>{" "}
          to leave a review.
        </p>
      )}
    </section>
  );
}
