"use client";

export default function BackToTop() {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="figma-link font-figma-nav text-sm flex items-center gap-2 mb-8 group cursor-pointer"
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        className="group-hover:-translate-y-1 transition-transform"
      >
        <path
          d="M6 10V2M6 2L2 6M6 2L10 6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Back to Top
    </button>
  );
}
