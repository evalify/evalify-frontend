"use client";

import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Edit,
  Trash2,
  Calendar,
  User,
  LucideIcon,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export interface BaseGridItem {
  id: string | number;
  name: string;
  description?: string;
  createdAt: string;
  createdBy?: {
    name: string;
  };
}

export interface GridItemFieldConfig<T> {
  id: keyof T;
  title: keyof T;
  description?: keyof T;
  createdAt?: keyof T;
  createdBy?: keyof T;

  badge?: {
    field: keyof T;
    label?: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
    format?: (value: unknown) => string;
  };

  stats?: Array<{
    field: keyof T;
    label: string;
    icon: LucideIcon;
    format?: (value: unknown) => string | number;
  }>;
}

export interface GridItemAction<T> {
  label: string;
  icon?: LucideIcon;
  variant?: "default" | "destructive";
  onClick: (item: T, event: React.MouseEvent) => void;
  separator?: boolean;
}

export interface GridItemProps<T extends Record<string, unknown>> {
  item: T;
  isSelected: boolean;
  onToggleSelect: () => void;
  enableSelection?: boolean;
  onCardClick?: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;

  fieldConfig: GridItemFieldConfig<T>;
  actions?: GridItemAction<T>[];
  customBadge?: (item: T) => ReactNode;
  customStats?: (item: T) => ReactNode;
  customContent?: (item: T) => ReactNode;
  entityName?: string;
}

export function GridItem<T extends Record<string, unknown>>({
  item,
  isSelected,
  onToggleSelect,
  enableSelection = true,
  onCardClick,
  onEdit,
  onDelete,
  fieldConfig,
  actions = [],
  customBadge,
  customStats,
  customContent,
  entityName = "item",
}: GridItemProps<T>) {
  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(item);
    }
  };

  const getId = () => item[fieldConfig.id];
  const getTitle = () => item[fieldConfig.title];
  const getDescription = () =>
    fieldConfig.description ? item[fieldConfig.description] : null;
  const getCreatedAt = () =>
    fieldConfig.createdAt ? item[fieldConfig.createdAt] : null;
  const getCreatedBy = () =>
    fieldConfig.createdBy ? item[fieldConfig.createdBy] : null;

  const defaultActions: GridItemAction<T>[] = [
    {
      label: `Copy ${entityName} ID`,
      onClick: (item, e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(String(getId()));
      },
      separator: true,
    },
    {
      label: `Edit ${entityName}`,
      icon: Edit,
      onClick: (item, e) => {
        e.stopPropagation();
        if (onEdit) {
          onEdit(item);
        }
      },
    },
    {
      label: `Delete ${entityName}`,
      icon: Trash2,
      variant: "destructive",
      onClick: (item, e) => {
        e.stopPropagation();
        if (onDelete) {
          onDelete(item);
        }
      },
    },
  ];

  const allActions = actions.length > 0 ? actions : defaultActions;

  return (
    <Card
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-lg border bg-card text-card-foreground transition-all duration-200 hover:border-primary/40 hover:shadow-lg",
        isSelected && "border-primary ring-2 ring-primary ring-offset-2",
      )}
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {enableSelection && (
              <div
                className="p-2 -m-2 cursor-pointer rounded hover:bg-muted/50 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSelect();
                }}
              >
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={onToggleSelect}
                  onClick={(e) => e.stopPropagation()}
                  className="mt-1"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <CardTitle
                className="text-lg font-semibold line-clamp-1"
                title={String(getTitle())}
              >
                {String(getTitle())}
              </CardTitle>
              <div className="mt-1">
                {customBadge ? (
                  customBadge(item)
                ) : fieldConfig.badge ? (
                  <Badge
                    variant={fieldConfig.badge.variant || "secondary"}
                    className="text-xs"
                  >
                    {fieldConfig.badge.label && `${fieldConfig.badge.label} `}
                    {fieldConfig.badge.format
                      ? fieldConfig.badge.format(item[fieldConfig.badge.field])
                      : String(item[fieldConfig.badge.field])}
                  </Badge>
                ) : null}
              </div>
            </div>
          </div>

          {allActions.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="sr-only">Open menu</span>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                {allActions.map((action, index) => (
                  <div key={index}>
                    {action.separator && <DropdownMenuSeparator />}
                    <DropdownMenuItem
                      className={
                        action.variant === "destructive"
                          ? "text-destructive"
                          : ""
                      }
                      onClick={(e) => action.onClick(item, e)}
                    >
                      {action.icon && <action.icon className="mr-2 h-4 w-4" />}
                      {action.label}
                    </DropdownMenuItem>
                  </div>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {getDescription() && (
          <div>
            <p
              className="text-sm text-muted-foreground line-clamp-2"
              title={String(getDescription())}
            >
              {String(getDescription())}
            </p>
          </div>
        )}

        {customContent ? (
          customContent(item)
        ) : (
          <div className="space-y-2">
            {customStats ? (
              customStats(item)
            ) : (
              <>
                {fieldConfig.stats?.map((stat, index) => {
                  const value = item[stat.field];
                  const displayValue = stat.format
                    ? stat.format(value)
                    : String(value);

                  return (
                    <div key={index} className="flex items-center text-sm">
                      <stat.icon className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="font-medium">{displayValue}</span>
                      <span className="text-muted-foreground ml-1">
                        {stat.label}
                      </span>
                    </div>
                  );
                })}
              </>
            )}
            {getCreatedBy() && (
              <div className="flex items-center text-sm">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">by</span>
                <span
                  className="ml-1 font-medium truncate"
                  title={(() => {
                    const createdBy = getCreatedBy();
                    return typeof createdBy === "object" &&
                      createdBy !== null &&
                      "name" in createdBy
                      ? String((createdBy as { name: unknown }).name)
                      : String(createdBy);
                  })()}
                >
                  {(() => {
                    const createdBy = getCreatedBy();
                    return typeof createdBy === "object" &&
                      createdBy !== null &&
                      "name" in createdBy
                      ? String((createdBy as { name: unknown }).name)
                      : String(createdBy);
                  })()}
                </span>
              </div>
            )}
            {getCreatedAt() && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                <span>
                  {new Date(String(getCreatedAt())).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export const GridItemSkeleton = () => {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border bg-card p-4">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Skeleton className="h-6 w-6 rounded" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <Skeleton className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <div className="flex justify-between pt-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
};
