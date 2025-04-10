import React from "react";
import CopyToClipboard from "@/components/copy-to-clipboard";
import FormattedDate from "@/components/ui/formatted-date";
import { ArrowRight } from "lucide-react";

interface AppealListItemProps {
  appeal: any;
}

const AppealListItem: React.FC<AppealListItemProps> = ({ appeal }) => {
  return (
    <div className="flex flex-col gap-2 items-center border border-foreground rounded-lg p-2 w-full">
      <div className="flex justify-between items-center w-full">
        <span className="text-xs">{appeal.year}</span>
        <div className="flex gap-2 items-center">
          <div>{appeal.appeal_number}</div>
          <CopyToClipboard
            text={appeal.appeal_number.toString().padStart(10, "0")}
          />
        </div>
      </div>
      <div className="flex justify-around gap-4 items-center w-full">
        <div className="flex flex-col gap-1">
          <p>{appeal.appeal_type}</p>
        </div>
        <div className="flex flex-col gap-1">
          <p>{appeal.status}</p>
        </div>
      </div>
      <div className="flex gap-2 items-center">
        <span>${appeal.before_total.toLocaleString()}</span>
        <ArrowRight size={12} className="text-gray-500" />
        <span>${appeal.after_total.toLocaleString()}</span>
      </div>
      {appeal.hearing_ts && (
        <div>
          <span className="text-xs">Hearing </span>
          <FormattedDate date={appeal.hearing_ts} showTime />
        </div>
      )}
    </div>
  );
};

export default AppealListItem;
