// referenced from
// https://nextui.org/docs/components/pagination

"use client";

import { Pagination, PaginationItemType, PaginationItemRenderProps } from "@nextui-org/react";
import { clsx as cn } from "clsx";

export default function CustomPagination({ total, initialPage, className, onChange }: { total: number; initialPage: number; className?: string; onChange?: (current: number) => void }) {
  const renderItem = ({ ref, key, value, isActive, onNext, onPrevious, setPage, className }: PaginationItemRenderProps) => {
    if (value === PaginationItemType.NEXT) {
      return (
        <button key={key} className={cn(className, "bg-default-200/50 min-w-8 w-8 h-8")} onClick={onNext}>
          &gt;
        </button>
      );
    }

    if (value === PaginationItemType.PREV) {
      return (
        <button key={key} className={cn(className, "bg-default-200/50 min-w-8 w-8 h-8")} onClick={onPrevious}>
          &lt;
        </button>
      );
    }

    if (value === PaginationItemType.DOTS) {
      return (
        <button key={key} className={className}>
          ...
        </button>
      );
    }

    // cursor is the default item
    return (
      <button ref={ref} key={key} className={cn(className, isActive && "text-white bg-gradient-to-r from-custom-color1 to-custom-color2 font-bold")} onClick={() => setPage(value)}>
        {value}
      </button>
    );
  };

  return (
    <Pagination
      disableCursorAnimation
      showControls
      total={total}
      initialPage={initialPage}
      className={cn("gap-2", `${className} gap-2`)}
      onChange={(current) => {
        onChange && onChange(current);
      }}
      radius="full"
      renderItem={renderItem}
      variant="light"
    />
  );
}
