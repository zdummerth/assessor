import React from "react";
import FormattedDate from "@/components/ui/formatted-date";

interface BuildingPermitListItemProps {
  permit: any;
}

const BuildingPermitListItem: React.FC<BuildingPermitListItemProps> = ({
  permit,
}) => {
  return (
    <div className="flex flex-col gap-2 items-center border-b border-foreground rounded-md p-2 w-full">
      <div className="flex justify-between gap-4 items-center w-full">
        <div className="flex flex-col gap-1">
          <p>{permit.permit_type}</p>
        </div>
        <div className="flex flex-col gap-1 items-center">
          <span className="text-sm">Cost</span>
          <span>${permit.cost.toLocaleString()}</span>
        </div>
        <div className="flex flex-col gap-1">
          <p>{permit.status}</p>
        </div>
      </div>
      <div className="">
        <span className="text-sm">{permit.request}</span>
      </div>
      <div className="flex justify-between items-center w-full">
        <div>
          <span className="text-sm">Issued Date</span>
          <FormattedDate date={permit.issued_date} />
        </div>
        <div>
          <span className="text-sm">Completion Date</span>
          <FormattedDate date={permit.completion_date} />
        </div>
      </div>
    </div>
  );
};

export default BuildingPermitListItem;
