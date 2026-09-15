"use client";

import { useEffect } from "react";

/**
 * No UI - fires once on mount to register a visit. Mount this only on the page
 * whose visits should count (the home page), not in a shared layout, so other
 * pages (/about, /projects, etc.) don't also count as a "visit".
 */
export default function VisitorTracker() {
  useEffect(() => {
    fetch("/api/visitors", { method: "POST" }).catch(() => {
      // Visitor counting is best-effort; a failed beacon shouldn't affect the page.
    });
  }, []);

  return null;
}
