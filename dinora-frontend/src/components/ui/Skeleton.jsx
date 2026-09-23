import * as React from "react";
import { cn } from "cn";

export function Skeleton({ className = "", style }) {
  return <div className={cn("animate-pulse bg-muted/80 rounded-none", className)} style={style} />;
}

export function MenuItemSkeleton() {
  return (
    <div className="flex flex-col bg-card border border-border p-4 space-y-4 rounded-none">
      <Skeleton className="w-full aspect-[4/3]" />
      <div className="space-y-2">
        <Skeleton style={{ width: "60%", height: 16 }} />
        <Skeleton style={{ width: "90%", height: 12 }} />
        <Skeleton style={{ width: "30%", height: 20 }} />
      </div>
    </div>
  );
}

export function OrderCardSkeleton() {
  return (
    <div className="border border-border bg-card p-4 space-y-3 rounded-none">
      <Skeleton style={{ width: "40%", height: 16 }} />
      <Skeleton style={{ width: "100%", height: 12 }} />
      <Skeleton style={{ width: "70%", height: 12 }} />
    </div>
  );
}

export function TableRowSkeleton({ cols = 4 }) {
  return (
    <tr className="border-b border-border">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="p-4">
          <Skeleton style={{ width: "80%", height: 14 }} />
        </td>
      ))}
    </tr>
  );
}