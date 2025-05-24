import { LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  badge?: string | null;
  subItems?: SubNavItem[];
}

export interface SubNavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

export interface SidebarConfig {
  brandName: string;
  brandSubtitle?: string;
  showBadges: boolean;
  collapsible: boolean;
  defaultCollapsed: boolean;
}

export const DEFAULT_SIDEBAR_CONFIG: SidebarConfig = {
  brandName: "Evalify",
  brandSubtitle: "Education Platform",
  showBadges: true,
  collapsible: true,
  defaultCollapsed: false,
};

export function isActiveRoute(
  pathname: string,
  itemUrl: string,
  subItems?: SubNavItem[],
): boolean {
  if (pathname === itemUrl) return true;
  if (subItems && subItems.some((sub) => pathname === sub.url)) return true;
  return pathname.startsWith(itemUrl + "/");
}

export function getBadgeVariant(
  count: string | number,
): "default" | "secondary" | "destructive" {
  const numCount = typeof count === "string" ? parseInt(count, 10) : count;
  if (numCount > 50) return "destructive";
  if (numCount > 10) return "default";
  return "secondary";
}

export function formatBadgeCount(count: string | number): string {
  const numCount = typeof count === "string" ? parseInt(count, 10) : count;
  if (numCount > 999) return "999+";
  if (numCount > 99) return "99+";
  return numCount.toString();
}

export function getNavItemId(title: string): string {
  return `nav-${title.toLowerCase().replace(/\s+/g, "-")}`;
}

export function shouldShowTooltip(
  isCollapsed: boolean,
  hasLabel: boolean,
): boolean {
  return isCollapsed || !hasLabel;
}

export const SIDEBAR_ANIMATION_DURATION = 200;
export const SIDEBAR_BREAKPOINT = 768;
export const SIDEBAR_WIDTH_EXPANDED = 280;
export const SIDEBAR_WIDTH_COLLAPSED = 64;

export const KEYBOARD_SHORTCUTS = {
  TOGGLE_SIDEBAR: "cmd+b",
  NAVIGATE_UP: "ArrowUp",
  NAVIGATE_DOWN: "ArrowDown",
  EXPAND_ITEM: "ArrowRight",
  COLLAPSE_ITEM: "ArrowLeft",
  ACTIVATE_ITEM: "Enter",
} as const;

export type KeyboardShortcut =
  (typeof KEYBOARD_SHORTCUTS)[keyof typeof KEYBOARD_SHORTCUTS];
