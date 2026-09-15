"use client";

import { useState } from "react";
import Image from "next/image";
import {
  CpuChipIcon,
  AcademicCapIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";
import educationData from "@/data/educationData";
import awardsData from "@/data/awardsData";
import SkillOrbit from "./SkillOrbit";

const TABS = [
  { id: "skills", label: "Skills", Icon: CpuChipIcon },
  { id: "school", label: "School", Icon: AcademicCapIcon },
  { id: "awards", label: "Awards", Icon: TrophyIcon },
];

function TabButton({ id, label, Icon, active, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      aria-pressed={active}
      className={`flex items-center gap-1.5 rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? "border-[var(--accent)] bg-[var(--highlight)] text-[var(--highlight-ink)]"
          : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:bg-[var(--background)]"
      }`}
    >
      <Icon className="h-4 w-4" aria-hidden />
      {label}
    </button>
  );
}

function SkillsPanel() {
  return <SkillOrbit />;
}

function LogoCard({ logo, title, lines }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-white ring-1 ring-[var(--border)]">
        <Image src={logo} alt={`${title} logo`} fill sizes="56px" className="object-contain p-1.5" />
      </div>
      <div className="min-w-0">
        <p className="font-semibold text-[var(--foreground)]">{title}</p>
        {lines.map((line) => (
          <p key={line} className="text-sm text-[var(--muted)]">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}

function SchoolPanel() {
  return (
    <div className="grid gap-4">
      {educationData.map((edu) => (
        <LogoCard
          key={edu.school}
          logo={edu.logo}
          title={edu.school}
          lines={[edu.degree, edu.period]}
        />
      ))}
    </div>
  );
}

function AwardsPanel() {
  return (
    <div className="grid gap-4">
      {awardsData.map((award) => (
        <LogoCard
          key={award.name}
          logo={award.logo}
          title={award.name}
          lines={[award.result, award.date]}
        />
      ))}
    </div>
  );
}

const PANELS = {
  skills: SkillsPanel,
  school: SchoolPanel,
  awards: AwardsPanel,
};

const AboutTabs = () => {
  const [activeTab, setActiveTab] = useState("skills");
  const ActivePanel = PANELS[activeTab];

  return (
    <section className="mt-14 sm:mt-20">
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        {TABS.map((tab) => (
          <TabButton
            key={tab.id}
            id={tab.id}
            label={tab.label}
            Icon={tab.Icon}
            active={activeTab === tab.id}
            onSelect={setActiveTab}
          />
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-7">
        <ActivePanel />
      </div>
    </section>
  );
};

export default AboutTabs;
