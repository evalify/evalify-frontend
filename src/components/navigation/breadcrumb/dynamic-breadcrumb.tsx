"use client";

import React from "react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb";
import { useNavigation, NavigationConfig } from "@/hooks/use-navigation";
import { cn } from "@/lib/utils";

interface DynamicBreadcrumbProps {
  customConfig?: NavigationConfig;
  maxItems?: number;
  mobileMaxItems?: number;
  className?: string;
}

export function DynamicBreadcrumb({
  customConfig,
  maxItems = 5,
  mobileMaxItems = 2,
  className,
}: DynamicBreadcrumbProps) {
  const { breadcrumbs } = useNavigation(customConfig);

  if (breadcrumbs.length === 0) {
    return null;
  }

  // Different logic for mobile and desktop
  const getVisibleBreadcrumbs = (isMobile: boolean) => {
    const limit = isMobile ? mobileMaxItems : maxItems;

    if (breadcrumbs.length <= limit) {
      return { breadcrumbs, showEllipsis: false };
    }

    if (isMobile) {
      // On mobile, show first and last
      return {
        breadcrumbs: [breadcrumbs[0], breadcrumbs[breadcrumbs.length - 1]],
        showEllipsis: breadcrumbs.length > 2,
      };
    }

    // On desktop, show first and last few
    return {
      breadcrumbs: [breadcrumbs[0], ...breadcrumbs.slice(-limit + 1)],
      showEllipsis: true,
    };
  };

  const mobileView = getVisibleBreadcrumbs(true);
  const desktopView = getVisibleBreadcrumbs(false);

  const renderBreadcrumbs = (
    visibleBreadcrumbs: typeof mobileView.breadcrumbs,
    showEllipsis: boolean,
    originalLength: number,
  ) => (
    <>
      {visibleBreadcrumbs.map((segment, index) => (
        <React.Fragment key={`${segment.href}-${index}`}>
          {/* Show ellipsis between first and last item if needed */}
          {showEllipsis &&
            index === 1 &&
            originalLength > visibleBreadcrumbs.length && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbEllipsis />
                </BreadcrumbItem>
              </>
            )}

          {/* Show separator before item (except for first or after ellipsis) */}
          {index > 0 &&
            !(
              showEllipsis &&
              index === 1 &&
              originalLength > visibleBreadcrumbs.length
            ) && <BreadcrumbSeparator />}

          <BreadcrumbItem>
            {segment.isCurrentPage && !segment.isDynamicSegment ? (
              <BreadcrumbPage className="max-w-[150px] truncate sm:max-w-none">
                {segment.label}
              </BreadcrumbPage>
            ) : (
              <BreadcrumbLink asChild>
                <Link
                  href={segment.href}
                  className={cn(
                    "max-w-[150px] truncate sm:max-w-none",
                    segment.isDynamicSegment &&
                      "hover:text-primary transition-colors",
                  )}
                  title={
                    segment.isDynamicSegment
                      ? `Go back to ${segment.href.split("/").pop() || "previous page"} list`
                      : `Go to ${segment.label}`
                  }
                >
                  {segment.label}
                </Link>
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>
        </React.Fragment>
      ))}
    </>
  );

  return (
    <Breadcrumb className={cn("overflow-hidden", className)}>
      <BreadcrumbList className="flex-nowrap">
        {/* Mobile view */}
        <div className="flex items-center gap-1.5 sm:hidden">
          {renderBreadcrumbs(
            mobileView.breadcrumbs,
            mobileView.showEllipsis,
            breadcrumbs.length,
          )}
        </div>

        {/* Desktop view */}
        <div className="hidden sm:flex sm:items-center sm:gap-1.5">
          {renderBreadcrumbs(
            desktopView.breadcrumbs,
            desktopView.showEllipsis,
            breadcrumbs.length,
          )}
        </div>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
