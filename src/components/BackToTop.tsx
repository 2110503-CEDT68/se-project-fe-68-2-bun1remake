"use client";
import Arrow from "./Arrow";

export default function BackToTop() {
  const scrollToHeader = () => {
    // Find the element we want to scroll to
    const topElement = document.getElementById("policy-start");

    if (topElement) {
      // scrollIntoView works perfectly with the overflow-y-auto container
      topElement.scrollIntoView({ behavior: "smooth" });
    } else {
      // Fallback: Scroll the container to 0 if ID isn't found
      const scrollContainer = document.querySelector("main.overflow-y-auto");
      scrollContainer?.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <button
      onClick={scrollToHeader}
      className="figma-link font-figma-nav text-sm flex items-center gap-2 mt-12 mb-8 group cursor-pointer border-none bg-transparent p-0"
    >
      <Arrow direction="top" />
      Back to Top
    </button>
  );
}
