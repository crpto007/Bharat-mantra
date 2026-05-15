
"use client";

import { useEffect } from 'react';

// Generates a deterministic, yet unique-looking color based on the day
function generateColorForDay(day: number): number {
  // Use sine waves with different frequencies and phases for each color component
  const r = Math.sin(day * 0.1 + 0) * 180 + 180;
  const g = Math.sin(day * 0.1 + 2) * 180 + 180;
  const b = Math.sin(day * 0.1 + 4) * 180 + 180;

  // Simple hashing to get a hue value between 0 and 360
  const hue = ((r * 31 + g * 17 + b * 43) % 360 + 360) % 360;
  
  return hue;
}

// Function to generate a full color palette
function generateDailyPalette() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  
  const primaryHue = generateColorForDay(dayOfYear);
  // Create a triadic color scheme for the accent color
  const accentHue = (primaryHue + 120) % 360; 

  return {
    '--primary-hue': primaryHue,
    '--accent-hue': accentHue,
  };
}

export function DailyTheme() {
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const KEY = 'daily-theme-last-updated';
        const today = new Date().toDateString();
        const lastUpdated = localStorage.getItem(KEY);

        // Only update the theme if it hasn't been updated today
        if (lastUpdated !== today) {
            const palette = generateDailyPalette();
            const root = document.documentElement;

            Object.entries(palette).forEach(([key, value]) => {
                root.style.setProperty(key, value.toString());
            });

            localStorage.setItem(KEY, today);
        }
    }, []);

    return null; // This component does not render anything
}
