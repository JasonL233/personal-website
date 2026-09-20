"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./ProjectSection.module.css";

// How long the track must stay still before it counts as settled. Only a fallback: browsers
// with the `scrollend` event (via onScrollEnd) settle as soon as scrolling actually stops.
const SETTLE_DELAY = 140;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * A looping carousel built on a native scroll-snap track.
 *
 * So the last slide slides straight into the first (and back) instead of rewinding through
 * every image, the track holds a copy of the last slide in front and a copy of the first slide
 * at the end: [last′, 1, 2, …, n, first′]. Stepping past either end lands on a copy, which looks
 * identical to its original; once the track comes to rest there it silently jumps to the
 * original. Because the loop lives in the track itself, the buttons, arrow keys, mouse drag and
 * native touch/trackpad swipes all get it without special-casing each one.
 */
export default function ProjectGallery({ title, images, descriptions }) {
  const count = images.length;
  const loop = count > 1;
  const slides = loop ? [images[count - 1], ...images, images[0]] : images;
  const lastPosition = slides.length - 1;

  const trackRef = useRef(null);
  const dragRef = useRef(null);
  const touchingRef = useRef(false);
  const settleTimerRef = useRef(null);
  // Position within `slides` (copies included) - distinct from the image index shown to people.
  const positionRef = useRef(loop ? 1 : 0);
  const [imageIndex, setImageIndex] = useState(0);

  const toImageIndex = (position) => (loop ? (position - 1 + count) % count : position);
  // Fractional width, not clientWidth: rounding drifts further off the snap points each slide.
  const slideWidth = () => trackRef.current.getBoundingClientRect().width;

  function scrollToPosition(position, behavior) {
    trackRef.current.scrollTo({ left: position * slideWidth(), behavior });
  }

  // Resting on a copy? Swap in the original it duplicates - identical pixels, so it's invisible.
  function settle() {
    clearTimeout(settleTimerRef.current);
    if (!loop || dragRef.current || touchingRef.current) return;
    const width = slideWidth();
    if (!width) return;
    const exact = trackRef.current.scrollLeft / width;
    const position = Math.round(exact);
    if (Math.abs(exact - position) > 0.02) return; // still between slides
    if (position === 0) scrollToPosition(count, "instant");
    else if (position === lastPosition) scrollToPosition(1, "instant");
  }

  function scheduleSettle() {
    clearTimeout(settleTimerRef.current);
    settleTimerRef.current = setTimeout(settle, SETTLE_DELAY);
  }

  function goToPosition(target) {
    if (!slideWidth()) return;
    const reduced = prefersReducedMotion();
    if (!loop) {
      scrollToPosition(Math.max(0, Math.min(lastPosition, target)), reduced ? "instant" : "smooth");
      return;
    }
    // A quick second click can ask to step past a copy before `settle` has swapped it out.
    // Hop to the original first so the step still lands on a real slide.
    if (target > lastPosition) {
      scrollToPosition(1, "instant");
      target -= count;
    } else if (target < 0) {
      scrollToPosition(count, "instant");
      target += count;
    }
    if (reduced) {
      // No slide animation to preserve, so skip the copies entirely.
      if (target === 0) target = count;
      else if (target === lastPosition) target = 1;
      scrollToPosition(target, "instant");
      return;
    }
    scrollToPosition(target, "smooth");
  }

  useLayoutEffect(() => {
    const track = trackRef.current;
    const align = () =>
      track.scrollTo({ left: positionRef.current * track.getBoundingClientRect().width, behavior: "instant" });
    // Open on the first real slide rather than the copy of the last one parked in front of it -
    // before paint, so that copy never flashes.
    align();
    // Keep the same slide in view whenever the width changes.
    const observer = new ResizeObserver(align);
    observer.observe(track);
    return () => {
      observer.disconnect();
      clearTimeout(settleTimerRef.current);
    };
  }, []);

  function handleScroll() {
    const width = slideWidth();
    if (!width) return;
    const position = Math.max(0, Math.min(lastPosition, Math.round(trackRef.current.scrollLeft / width)));
    positionRef.current = position;
    setImageIndex(toImageIndex(position));
    if (loop) scheduleSettle();
  }

  function startDrag(event) {
    // Touch and trackpad scrolling use the browser's native momentum and scroll snap.
    if (event.pointerType !== "mouse" || event.button !== 0 || !event.isPrimary || count < 2) return;
    settle(); // if resting on a copy, swap it out before the drag records where it started
    const track = event.currentTarget;
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      scrollLeft: track.scrollLeft,
      position: positionRef.current,
      dragging: false,
    };
    track.setPointerCapture(event.pointerId);
    track.focus({ preventScroll: true });
  }

  function moveDrag(event) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (!drag.dragging && (Math.abs(dx) < 8 || Math.abs(dx) <= Math.abs(dy))) return;
    drag.dragging = true;
    const track = event.currentTarget;
    track.dataset.dragging = "true";
    track.style.scrollSnapType = "none";
    track.scrollLeft = drag.scrollLeft - dx;
  }

  function finishDrag(event, cancelled = false) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    const track = event.currentTarget;
    const distance = drag.startX - event.clientX;
    const threshold = Math.min(60, track.clientWidth * 0.15);
    const direction = !cancelled && drag.dragging && Math.abs(distance) >= threshold ? Math.sign(distance) : 0;
    delete track.dataset.dragging;
    track.style.scrollSnapType = "";
    if (track.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId);
    goToPosition(drag.position + direction);
  }

  function startTouch() {
    settle(); // same as startDrag: never let a swipe begin on a copy
    touchingRef.current = true;
  }

  function endTouch() {
    touchingRef.current = false;
    scheduleSettle(); // a swipe with no momentum produces no further scroll events to settle on
  }

  return (
    <div className={styles.gallery} role="region" aria-roledescription="carousel" aria-label={`${title} image gallery`}>
      <p className={styles.galleryHint}>Drag or swipe to browse</p>
      <div
        ref={trackRef}
        className={styles.galleryTrack}
        tabIndex={0}
        role="group"
        aria-label={`${title} images. Swipe, scroll horizontally, or use the left and right arrow keys.`}
        onScroll={handleScroll}
        onScrollEnd={settle}
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={finishDrag}
        onPointerCancel={(event) => finishDrag(event, true)}
        onLostPointerCapture={(event) => finishDrag(event, true)}
        onTouchStart={startTouch}
        onTouchEnd={endTouch}
        onTouchCancel={endTouch}
        onDragStart={(event) => event.preventDefault()}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            goToPosition(positionRef.current + (event.key === "ArrowRight" ? 1 : -1));
          }
        }}
      >
        {slides.map((src, position) => {
          const isCopy = loop && (position === 0 || position === lastPosition);
          const index = toImageIndex(position);
          const key = isCopy ? (position === 0 ? "copy-of-last" : "copy-of-first") : typeof src === "string" ? src : src.src;
          return (
            <div
              className={styles.gallerySlide}
              key={key}
              {...(isCopy
                ? { "aria-hidden": true }
                : { role: "group", "aria-roledescription": "slide", "aria-label": `${index + 1} of ${count}` })}
            >
              <Image
                src={src}
                alt={isCopy ? "" : descriptions?.[index] || `${title} gallery image ${index + 1} of ${count}`}
                fill
                sizes="(max-width: 700px) calc(100vw - 40px), (max-width: 1200px) 85vw, 1000px"
                className={styles.contain}
                draggable={false}
                // The copies only ever appear mid-transition, so they must be loaded already or
                // the loop flashes blank. (The copy of the first slide is served from cache.)
                loading={isCopy ? "eager" : undefined}
              />
            </div>
          );
        })}
      </div>
      {descriptions && <p className={styles.galleryCaption}>{descriptions[imageIndex]}</p>}
      <div className={styles.galleryControls}>
        <button type="button" onClick={() => goToPosition(positionRef.current - 1)} aria-label={`Previous ${title} image`}>
          <span aria-hidden="true">←</span> Previous
        </button>
        <span aria-live="polite" aria-atomic="true">{imageIndex + 1} / {count}</span>
        <button type="button" onClick={() => goToPosition(positionRef.current + 1)} aria-label={`Next ${title} image`}>
          Next <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}
