import React from "react";
import CopyToClipboard from "@/components/copy-to-clipboard";
import FormattedDate from "@/components/ui/formatted-date";
import { ArrowRight } from "lucide-react";

interface AppealDetailProps {
  appeal: any;
}

const AppealDetail: React.FC<AppealDetailProps> = ({ appeal }) => {
  return (
    <div className="flex flex-col gap-4 border border-foreground rounded-lg p-4 w-full">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <strong>Appeal Number: </strong>
          <span>{appeal.appeal_number}</span>
          <CopyToClipboard
            text={appeal.appeal_number.toString().padStart(10, "0")}
          />
        </div>
        <span className="text-xs">{appeal.year}</span>
      </div>
      <div className="flex flex-col gap-2">
        <div>
          <strong>Type: </strong>
          <span>{appeal.appeal_type}</span>
        </div>
        <div>
          <strong>Status: </strong>
          <span>{appeal.status}</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div>
          <strong>Before Total: </strong>
          <span>${appeal.before_total.toLocaleString()}</span>
        </div>
        <ArrowRight size={16} className="text-gray-500" />
        <div>
          <strong>After Total: </strong>
          <span>${appeal.after_total.toLocaleString()}</span>
        </div>
      </div>
      {appeal.hearing_ts && (
        <div>
          <strong>Hearing: </strong>
          <FormattedDate date={appeal.hearing_ts} showTime />
        </div>
      )}
      {/* Additional detailed fields can be added here */}
    </div>
  );
};

export default AppealDetail;
