
import {
  BrainCircuit,
  FileText,
  Gavel,
  HeartPulse,
  MessageSquare,
  Presentation,
  Search,
  Sparkles,
  UserCheck,
  BrainCog,
  PenSquare,
  LayoutGrid,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// For Homepage
export type HomepageFeature = {
  href: string;
  label: string;
  icon: LucideIcon;
  description: string;
  badge?: "New" | "Pro" | "Most Used";
};

export type FeatureCategory = {
  title: string;
  features: HomepageFeature[];
};

export const categorizedFeatures: FeatureCategory[] = [
  {
    title: "🧠 Analysis",
    features: [
      {
        href: "/grounded-search",
        label: "Knowledge Explorer",
        icon: Search,
        description: "Get AI-powered summaries on any topic.",
        badge: "Most Used",
      },
      {
        href: "/advanced-analysis",
        label: "Advanced Analysis",
        icon: BrainCircuit,
        description: "Get deep, structured insights on complex topics.",
        badge: "Pro",
      },
      {
        href: "/cognitive-canvas",
        label: "Cognitive Canvas",
        icon: PenSquare,
        description: "Ek AI-powered digital whiteboard jo aapke ideas ko organize karta hai, mind-map banata hai aur naye connections ka sujhav deta hai.",
        badge: "New",
      },
    ],
  },
  {
    title: "✍️ Content",
    features: [
      {
        href: "/prompt-enhancer",
        label: "Prompt Enhancer",
        icon: Sparkles,
        description: "Refine your prompts for better AI output.",
      },
      {
        href: "/content-humanizer",
        label: "Content Humanizer",
        icon: UserCheck,
        description: "Make AI text sound more natural and less robotic.",
      },
      {
        href: "/presentation-guide",
        label: "Presentation Guide",
        icon: Presentation,
        description: "Generate speech outlines and presentation scripts.",
      },
       {
        href: "/neural-weaver",
        label: "Neural Weaver",
        icon: BrainCog,
        description: "Aapke kai documents ko padhkar ek naya, saaranshpoorn (coherent) document taiyar karta hai. Research aur content banane ke liye upyogi.",
        badge: "New",
      },
    ],
  },
  {
    title: "⚖️ Professional",
    features: [
      {
        href: "/indian-law-explainer",
        label: "Indian Law Explainer",
        icon: Gavel,
        description: "Simplify complex legal jargon into plain language.",
      },
      {
        href: "/document-generator",
        label: "Contract Assistant",
        icon: FileText,
        description: "Generate basic legal contracts, NDAs, and affidavits.",
      },
    ],
  },
  {
    title: "❤️ Personal",
    features: [
      {
        href: "/health-planner",
        label: "Health & Fitness Planner",
        icon: HeartPulse,
        description: "Get a personalized weekly workout and diet plan.",
      },
       {
        href: "/chatbot",
        label: "Unified Chatbot",
        icon: MessageSquare,
        description: "Converse with an AI assistant in multiple languages.",
      },
    ],
  },
];


// For Sidebar
export type MenuItem = {
  label: string;
  icon: LucideIcon;
  href?: string;
  items?: SubMenuItem[];
};

export type SubMenuItem = {
  label: string;
  href: string;
};

const categorizedMenuItems: MenuItem[] = categorizedFeatures.map(category => ({
    label: category.title.split(' ')[1],
    icon: category.features[0].icon, // Use first feature's icon for the category
    items: category.features.map(feature => ({
        label: feature.label,
        href: feature.href,
    })),
}));

// a flat list for old pages that might still use it
export const allFeatures: HomepageFeature[] = categorizedFeatures.flatMap(category => category.features);

// Add Dashboard link to the beginning of the menu items
export const menuItems: MenuItem[] = [
    {
        label: "Dashboard",
        icon: LayoutGrid,
        href: "/dashboard",
    },
    ...categorizedMenuItems,
];
