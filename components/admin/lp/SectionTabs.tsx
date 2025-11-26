'use client';

import { cn } from '@/lib/utils';
import { Briefcase, FolderOpen, Info, LayoutDashboard, Sparkles } from 'lucide-react';
import type { JSX } from 'react';

export type ActiveSection = 'hero' | 'about' | 'services' | 'portfolio' | 'brandPhilosophy';

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
    id: 'hero',
    label: 'Hero',
    icon: LayoutDashboard,
  },
  {
    id: 'brandPhilosophy',
    label: 'Brand Philosophy',
    icon: Sparkles,
  },
  {
    id: 'about',
    label: 'About',
    icon: Info,
  },
  {
    id: 'services',
    label: 'Services',
    icon: Briefcase,
  },
  {
    id: 'portfolio',
    label: 'Portfolio',
    icon: FolderOpen,
  },
];

export function SectionTabs({ activeSection, onSectionChange }: SectionTabsProps): JSX.Element {
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
              'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer',
              isActive ? 'bg-ate9-red text-white shadow-md' : 'text-white/70 hover:bg-white/5',
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
