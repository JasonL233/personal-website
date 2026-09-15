"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SiAxios,
  SiCplusplus,
  SiDocker,
  SiFastapi,
  SiFlask,
  SiGit,
  SiGithub,
  SiGithubactions,
  SiGo,
  SiHtml5,
  SiJavascript,
  SiJsonwebtokens,
  SiKubernetes,
  SiLangchain,
  SiMongodb,
  SiNextdotjs,
  SiNodedotjs,
  SiOpencv,
  SiPostgresql,
  SiPostman,
  SiPython,
  SiPytorch,
  SiReact,
  SiRedis,
  SiSocketdotio,
  SiSqlite,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
} from "react-icons/si";
import { FaAws, FaJava } from "react-icons/fa";
import { VscVscode } from "react-icons/vsc";
import skillsData from "@/data/skillsData";

/**
 * Most brand icons come from Simple Icons; a few (AWS, Java, VS Code) only exist elsewhere.
 *
 * These MUST be named imports, never `import * as Icons from "react-icons/si"`. The icon
 * packs hold thousands of logos each, and because icons are looked up by string name below,
 * a namespace import defeats tree-shaking and ships every one of them - that alone put ~2.6MB
 * of unused logos into the About page's bundle. Adding a skill means adding its import here.
 */
const ICONS = {
  SiAxios,
  SiCplusplus,
  SiDocker,
  SiFastapi,
  SiFlask,
  SiGit,
  SiGithub,
  SiGithubactions,
  SiGo,
  SiHtml5,
  SiJavascript,
  SiJsonwebtokens,
  SiKubernetes,
  SiLangchain,
  SiMongodb,
  SiNextdotjs,
  SiNodedotjs,
  SiOpencv,
  SiPostgresql,
  SiPostman,
  SiPython,
  SiPytorch,
  SiReact,
  SiRedis,
  SiSocketdotio,
  SiSqlite,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
  FaAws,
  FaJava,
  VscVscode,
};

// Angle ranges (degrees) carve the circle into 4 quadrants; matches the reference's layout.
// Widened a bit from the reference's original ranges (reclaiming some of the buffer space
// near the crosshair lines) since backend/devops/frontend now hold more icons than before -
// gaps between quadrants stay positive so none of them actually touch. Every range must stay
// strictly within its own 90deg quadrant (i.e. never reach exactly 0/90/180/-90/-180) - crossing
// one of those means cos() or sin() flips sign, which visually flips the icon onto the WRONG
// side of the crosshair even though the code still labels it as the original quadrant. (Devops
// used to go to 92deg, 2deg past the 90deg boundary - that's what put a devops icon on the
// visual "database" side.)
const QUADRANTS = [
  { key: "frontend", label: "FRONTEND", labelPos: "top-2 left-2 sm:top-0 sm:left-0", minAngle: -160, maxAngle: -105 },
  { key: "backend", label: "BACKEND", labelPos: "top-2 right-2 sm:top-0 sm:right-0", minAngle: -78, maxAngle: -15 },
  { key: "database", label: "DATABASES", labelPos: "bottom-2 left-2 sm:bottom-0 sm:left-0", minAngle: 102, maxAngle: 168 },
  { key: "devops", label: "DEVOPS", labelPos: "bottom-2 right-2 sm:bottom-0 sm:right-0", minAngle: 12, maxAngle: 78 },
];

const RING_COLOR = "border-[var(--border)]";
const LINE_COLOR = "bg-[var(--border)]";

function polarToXY(angle, radius) {
  const rad = (angle * Math.PI) / 180;
  return { x: Math.cos(rad) * radius, y: Math.sin(rad) * radius };
}

/**
 * Random angle+radius per skill within its quadrant's bounds, retrying on overlap.
 * "Too close" is real pixel distance between the two icons' actual (x, y) positions, not
 * separate angle/radius thresholds - a fixed angle gap is a tiny gap near the center and a
 * huge gap near the edge, so comparing angle-degrees to angle-degrees doesn't reflect how
 * close two icons really are. Now that labels only show on hover (not always under the icon),
 * each icon's real footprint is just its own small box, so this simpler approach has enough
 * room to work reliably even in a crowded quadrant - the ring/grid math this used to need
 * (and its own edge cases) is gone.
 *
 * Two things are being optimized for every skill, not just one:
 *  1. Distance from every already-placed icon in this quadrant (the overlap fix from before).
 *  2. Distance from BOTH crosshair axes, specifically at least half the icon's own box width -
 *     an icon's (x, y) can be genuinely, correctly on the right side of an axis by the math,
 *     and STILL visually spill across that line once you draw an actual `itemSize`-wide box
 *     centered on that point. Checking only the sign of (x, y), like the code used to, misses
 *     this entirely.
 * Every candidate gets scored by the WORSE of these two margins, and the best-scoring candidate
 * across all attempts wins - so a crowded quadrant does the best it can on both fronts at once,
 * rather than fixing one and accidentally reintroducing the other.
 */
function placeSkills(skills, { minRadius, maxRadius, minAngle, maxAngle, minDistance, halfItem }) {
  const placed = [];
  skills.forEach((skill) => {
    let bestPoint = null;
    let bestScore = -Infinity;

    for (let attempt = 0; attempt < 150; attempt++) {
      const angle = minAngle + Math.random() * (maxAngle - minAngle);
      const radius = minRadius + Math.random() * (maxRadius - minRadius);
      const point = polarToXY(angle, radius);

      const nearestDist =
        placed.length === 0
          ? Infinity
          : Math.min(...placed.map((p) => Math.hypot(p.x - point.x, p.y - point.y)));
      const axisClearance = Math.min(Math.abs(point.x), Math.abs(point.y)) - halfItem;
      const score = Math.min(nearestDist - minDistance, axisClearance);

      if (score > bestScore) {
        bestPoint = point;
        bestScore = score;
      }
      if (score >= 0) break; // both constraints satisfied, no need to keep sampling
    }

    placed.push({ skill, ...bestPoint });
  });
  return placed;
}

function SkillIcon({ skill, x, y, index, itemSize, iconSize }) {
  const Icon = ICONS[skill.iconName];
  const [hovered, setHovered] = useState(false);
  if (!Icon) return null;

  const left = x - itemSize / 2;
  const top = y - itemSize / 2;

  return (
    <motion.div
      className="absolute flex items-center justify-center"
      style={{ width: itemSize, height: itemSize, x: left, y: top }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, delay: index * 0.1, type: "spring", stiffness: 260, damping: 20 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      role="img"
      aria-label={skill.name}
    >
      <motion.div
        className="relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-md"
        whileHover={{ scale: 1.2, rotate: [0, -10, 10, -10, 0], transition: { duration: 0.5 } }}
      >
        <Icon size={iconSize} color={["#362c27", "#000000"].includes(skill.color) ? "var(--foreground)" : skill.color} />
      </motion.div>

      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-none absolute -bottom-5 z-10 whitespace-nowrap rounded-full border border-[var(--border)] bg-[var(--surface)] px-2 py-0.5 text-[10px] font-medium text-[var(--foreground)] shadow-sm"
          >
            {skill.name}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Quadrant({ skills, bounds, itemSize, iconSize }) {
  const [placements, setPlacements] = useState([]);

  useEffect(() => {
    setPlacements(placeSkills(skills, bounds));
    // Re-roll only when the quadrant's own inputs change, not on every parent re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skills, bounds.minRadius, bounds.maxRadius, bounds.minAngle, bounds.maxAngle, bounds.minDistance, bounds.halfItem]);

  return (
    <>
      {placements.map((p, index) => (
        <SkillIcon
          key={p.skill.name}
          skill={p.skill}
          x={p.x}
          y={p.y}
          index={index}
          itemSize={itemSize}
          iconSize={iconSize}
        />
      ))}
    </>
  );
}

const SkillOrbit = () => {
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth > 0 && windowWidth < 480;
  const isTablet = windowWidth >= 480 && windowWidth < 768;

  const containerHeight = isMobile ? 420 : isTablet ? 500 : 560;
  const ringRadii = isMobile ? [60, 90, 120] : isTablet ? [80, 120, 160] : [100, 150, 200];
  // Icons alone now (labels moved to hover), so the footprint each one needs is much smaller
  // than when a text label always sat underneath it.
  const itemSize = isMobile ? 34 : 40;
  const iconSize = isMobile ? 20 : 24;
  const radiusBounds = {
    minRadius: isMobile ? 50 : isTablet ? 62 : 75,
    maxRadius: isMobile ? 120 : isTablet ? 150 : 180,
    minDistance: Math.round(itemSize * 1.15),
    halfItem: itemSize / 2,
  };

  return (
    <div
      className="relative w-full flex items-center justify-center overflow-hidden"
      style={{ height: containerHeight }}
    >
      {ringRadii.map((radius, index) => (
        <motion.div
          key={radius}
          className={`absolute border ${RING_COLOR} border-opacity-60 rounded-full`}
          style={{ width: radius * 2, height: radius * 2 }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: index * 0.2 }}
        />
      ))}

      <motion.div
        className={`absolute w-[90%] h-px ${LINE_COLOR} bg-opacity-60`}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1 }}
      />
      <motion.div
        className={`absolute w-px h-[90%] ${LINE_COLOR} bg-opacity-60`}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1 }}
      />
      <motion.div
        className={`absolute w-px h-[90%] origin-center rotate-45 ${LINE_COLOR} bg-opacity-20`}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      />
      <motion.div
        className={`absolute w-px h-[90%] origin-center -rotate-45 ${LINE_COLOR} bg-opacity-20`}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      />

      <motion.div
        className={`absolute w-2 h-2 rounded-full ${LINE_COLOR} bg-opacity-70`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.2 }}
      />

      {QUADRANTS.map((q) => (
        <Quadrant
          key={q.key}
          skills={skillsData[q.key]}
          bounds={{ ...radiusBounds, minAngle: q.minAngle, maxAngle: q.maxAngle }}
          itemSize={itemSize}
          iconSize={iconSize}
        />
      ))}

      {QUADRANTS.map((q) => (
        <motion.div
          key={q.label}
          className={`absolute ${q.labelPos} text-xs sm:text-sm font-medium text-[var(--muted)]`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          {q.label}
        </motion.div>
      ))}
    </div>
  );
};

export default SkillOrbit;
