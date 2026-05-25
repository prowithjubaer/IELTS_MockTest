"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab?: string;
  onChange: (tabId: string) => void;
  className?: string;
  variant?: "default" | "pills" | "underline";
}

export function Tabs({ tabs, activeTab, onChange, className, variant = "default" }: TabsProps) {
  const [active, setActive] = useState(activeTab || tabs[0]?.id);

  const handleChange = (tabId: string) => {
    setActive(tabId);
    onChange(tabId);
  };

  const currentTab = activeTab || active;

  return (
    <div className={cn("flex gap-1", variant === "underline" ? "border-b border-gray-200" : "", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleChange(tab.id)}
          className={cn(
            "inline-flex items-center gap-2 font-medium transition-all duration-200",
            variant === "default" &&
              (currentTab === tab.id
                ? "bg-brand-navy-900 text-white px-4 py-2 rounded-lg"
                : "text-gray-600 hover:text-brand-navy-900 hover:bg-gray-100 px-4 py-2 rounded-lg"),
            variant === "pills" &&
              (currentTab === tab.id
                ? "bg-brand-red-500 text-white px-4 py-2 rounded-full"
                : "text-gray-600 hover:text-brand-red-500 hover:bg-red-50 px-4 py-2 rounded-full"),
            variant === "underline" &&
              (currentTab === tab.id
                ? "text-brand-navy-900 border-b-2 border-brand-navy-900 px-4 py-3 -mb-px"
                : "text-gray-500 hover:text-brand-navy-700 px-4 py-3 -mb-px border-b-2 border-transparent")
          )}
        >
          {tab.icon}
          <span className="text-sm">{tab.label}</span>
          {tab.count !== undefined && (
            <span
              className={cn(
                "text-xs px-1.5 py-0.5 rounded-full",
                currentTab === tab.id ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"
              )}
            >
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
