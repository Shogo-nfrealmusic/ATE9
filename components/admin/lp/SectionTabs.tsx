"use client";

import { cn } from "@/lib/utils";
import { Briefcase, FolderOpen, Info, LayoutDashboard, Target } from "lucide-react";

type ActiveSection = "hero" | "about" | "mission" | "services" | "portfolio";

type SectionTabsProps = {
  activeSection: ActiveSection;
  onSectionChange: (section: ActiveSection) => void;
};

const sections: {
  id: ActiveSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    id: "hero",
    label: "Hero",
    icon: LayoutDashboard,
  },
  {
    id: "about",
    label: "About",
    icon: Info,
  },
  {
    id: "mission",
    label: "Mission",
    icon: Target,
  },
  {
    id: "services",
    label: "Services",
    icon: Briefcase,
  },
  {
    id: "portfolio",
    label: "Portfolio",
    icon: FolderOpen,
  },
];

export function SectionTabs({ activeSection, onSectionChange }: SectionTabsProps) {
  return (
    <nav className="p-4 space-y-1">
      {sections.map((section) => {
        const Icon = section.icon;
        const isActive = activeSection === section.id;
        return (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
              isActive
                ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
            )}
          >
            <Icon className="w-5 h-5" />
            <span>{section.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

