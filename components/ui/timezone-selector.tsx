"use client";

import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Common timezones with their display names
const timezones = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "Europe/London", label: "London (GMT)" },
  { value: "Europe/Paris", label: "Paris (CET)" },
  { value: "Europe/Berlin", label: "Berlin (CET)" },
  { value: "Asia/Kolkata", label: "India (IST)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
  { value: "Asia/Shanghai", label: "Shanghai (CST)" },
  { value: "Asia/Dubai", label: "Dubai (GST)" },
  { value: "Australia/Sydney", label: "Sydney (AEDT)" },
  { value: "Pacific/Auckland", label: "Auckland (NZDT)" },
] as const;

interface TimezoneSelectorProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export function TimezoneSelector({
  value,
  onValueChange,
  placeholder = "Select timezone...",
}: TimezoneSelectorProps) {
  const selectedTimezone = timezones.find((tz) => tz.value === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between"
        >
          {selectedTimezone ? selectedTimezone.label : placeholder}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full min-w-[200px]">
        {timezones.map((timezone) => (
          <DropdownMenuItem
            key={timezone.value}
            onClick={() => onValueChange(timezone.value)}
            className="flex items-center justify-between"
          >
            {timezone.label}
            <Check
              className={cn(
                "h-4 w-4",
                value === timezone.value ? "opacity-100" : "opacity-0"
              )}
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}