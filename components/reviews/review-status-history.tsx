// app/(whatever)/components/review-status-history.tsx
"use client";

import * as React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { History } from "lucide-react";

type StatusRecord = {
  id: number;
  created_at: string;
  status: {
    id: number;
    name: string;
  };
};

type ReviewStatusHistoryProps = {
  statuses: StatusRecord[] | null | undefined;
  layout?: "column" | "row";
};

const fmtShortDateTime = (value: string | null | undefined) => {
  if (!value) return "Unknown date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

export function ReviewStatusHistory({
  statuses,
  layout = "row",
}: ReviewStatusHistoryProps) {
  const list = React.useMemo(() => (statuses ? [...statuses] : []), [statuses]);

  if (!list.length) {
    return (
      <div className="text-xs text-muted-foreground">No statuses yet.</div>
    );
  }

  // Sort most recent first
  const sorted = React.useMemo(
    () =>
      [...list].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ),
    [list]
  );

  const latestStatus = sorted[0];
  const history = sorted; // includes latest as first element
  const totalCount = history.length;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="cursor-pointer transition hover:border-primary/60 hover:shadow-sm">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 p-4">
            <div
              className={`${layout === "row" ? "flex flex-row items-center gap-2" : "flex flex-col gap-2"}`}
            >
              <CardTitle className="text-sm">
                {latestStatus.status.name}
              </CardTitle>
              <CardDescription className="mt-1 flex items-center gap-2 text-[11px]">
                <span className="text-muted-foreground">
                  {fmtShortDateTime(latestStatus.created_at)}
                </span>
              </CardDescription>
              <History className="h-3.5 w-3.5" />
            </div>
          </CardHeader>
        </Card>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Status history</DialogTitle>
          <DialogDescription className="flex items-center gap-2 text-xs">
            <History className="h-3.5 w-3.5" />
            <span>
              Showing {totalCount} status
              {totalCount === 1 ? "" : "es"}, most recent first.
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 max-h-72 space-y-2 overflow-y-auto text-xs">
          <ul className="divide-y rounded-md border bg-muted/30">
            {history.map((s, idx) => {
              const isCurrent = idx === 0;
              return (
                <li key={s.id} className="px-3 py-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-medium">{s.status.name}</div>
                    {isCurrent && (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">
                    {fmtShortDateTime(s.created_at)}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
