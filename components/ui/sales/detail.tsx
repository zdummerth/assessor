import React from "react";
import FormattedDate from "@/components/ui/formatted-date";

interface SalesDetailProps {
  sale: any;
}

const SalesDetail: React.FC<SalesDetailProps> = ({ sale }) => {
  return (
    <div className="flex flex-col gap-4 border border-foreground rounded-lg p-4 w-full">
      <div>
        <strong>Sale Type:</strong>{" "}
        <span>{sale.sale_type ? sale.sale_type : "Pending Sale Type"}</span>
      </div>
      <div>
        <strong>Date of Sale:</strong>{" "}
        <FormattedDate date={sale.date_of_sale} className="ml-2" />
      </div>
      <div>
        <strong>Net Selling Price:</strong>{" "}
        <span>${sale.net_selling_price?.toLocaleString()}</span>
      </div>
      {/* Additional detailed fields can be added here */}
    </div>
  );
};

export default SalesDetail;
