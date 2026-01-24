"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { publishDeedAbstract, unpublishDeedAbstract } from "../actions";
import type { DeedAbstract } from "../types";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

type PublishToggleButtonProps = {
  deedAbstract: DeedAbstract;
};

export function PublishToggleButton({
  deedAbstract,
}: PublishToggleButtonProps) {
  const [isPending, startTransition] = useTransition();
  const isPublished = !!deedAbstract.published_at;

  const handleToggle = () => {
    startTransition(async () => {
      const result = isPublished
        ? await unpublishDeedAbstract(deedAbstract.id)
        : await publishDeedAbstract(deedAbstract.id);

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <Button
      size="sm"
      variant={isPublished ? "default" : "outline"}
      onClick={handleToggle}
      disabled={isPending}
    >
      {isPublished ? (
        <>
          <EyeOff className="h-4 w-4 mr-2" />
          Unpublish
        </>
      ) : (
        <>
          <Eye className="h-4 w-4 mr-2" />
          Publish
        </>
      )}
    </Button>
  );
}
