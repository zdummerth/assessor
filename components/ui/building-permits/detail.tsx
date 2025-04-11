import React from "react";
import FormattedDate from "@/components/ui/formatted-date";

interface BuildingPermitDetailProps {
  permit: any;
}

const BuildingPermitDetail: React.FC<BuildingPermitDetailProps> = ({
  permit,
}) => {
  return (
    <div className="flex flex-col gap-4 border border-foreground rounded-lg p-4 w-full">
      <div>
        <strong>Permit Type:</strong> <span>{permit.permit_type}</span>
      </div>
      <div>
        <strong>Status:</strong> <span>{permit.status}</span>
      </div>
      <div>
        <strong>Request:</strong> <span>{permit.request}</span>
      </div>
      <div>
        <strong>Cost:</strong> <span>${permit.cost.toLocaleString()}</span>
      </div>
      <div>
        <strong>Issued Date:</strong>{" "}
        <FormattedDate date={permit.issued_date} />
      </div>
      <div>
        <strong>Completion Date:</strong>{" "}
        <FormattedDate date={permit.completion_date} />
      </div>
    </div>
  );
};

export default BuildingPermitDetail;
