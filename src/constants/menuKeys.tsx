import React from "react";
import { PATH } from "@/constants/path";
import { LogOutIcon, PenTool, Sparkles, Target, Briefcase } from "lucide-react";

export const MENU_KEYS = {
  // Main App Features
  PROOFREAD: "proofread",
  SPECIAL_LESSON: "special-lesson",
  IELTS: "ielts",
  TOEIC: "toeic",
  BUSINESS_ENGLISH: "business-english",

  // Common
  LOGOUT: "logout",
} as const;

export type MenuKey = (typeof MENU_KEYS)[keyof typeof MENU_KEYS];

export interface SidebarItemConfig {
  label: string;
  path?: string;
  functionality?: () => void | Promise<void>;
  icon: React.ReactNode;
  activeColor?: string;
}

export const SIDEBAR_CONFIG: Record<MenuKey, SidebarItemConfig> = {
  // Main Features
  [MENU_KEYS.PROOFREAD]: {
    label: "Proofread / 英語添削",
    path: PATH.PROOFREAD,
    icon: <PenTool className="h-5 w-5" />,
    activeColor: "text-blue-600 dark:text-blue-400",
  },
  [MENU_KEYS.SPECIAL_LESSON]: {
    label: "Special Lesson",
    path: PATH.SPECIAL_LESSON,
    icon: <Sparkles className="h-5 w-5" />,
    activeColor: "text-amber-500 dark:text-amber-400",
  },
  [MENU_KEYS.TOEIC]: {
    label: "TOEIC Analytics",
    path: PATH.TOEIC,
    icon: <Target className="h-5 w-5" />,
    activeColor: "text-red-600 dark:text-red-400",
  },
  [MENU_KEYS.BUSINESS_ENGLISH]: {
    label: "Business English",
    path: PATH.BUSINESS_ENGLISH,
    icon: <Briefcase className="h-5 w-5" />,
    activeColor: "text-sky-600 dark:text-sky-400",
  },

  [MENU_KEYS.IELTS]: {
    label: "IELTS Analytics",
    path: PATH.IELTS,
    icon: <Target className="h-5 w-5" />,
    activeColor: "text-red-600 dark:text-red-400",
  },

  // Common Items
  [MENU_KEYS.LOGOUT]: {
    label: "ログアウト",
    functionality: async () => {
      alert("Logout functionality called");
    },
    icon: <LogOutIcon />,
  },
};

export const mainSidebar: MenuKey[] = [
  MENU_KEYS.PROOFREAD,
  MENU_KEYS.SPECIAL_LESSON,
  MENU_KEYS.IELTS,
  MENU_KEYS.TOEIC,
  MENU_KEYS.BUSINESS_ENGLISH,
];

export const footerSidebar: MenuKey[] = [MENU_KEYS.LOGOUT];
