import React from "react";
import FormattedDate from "@/components/ui/formatted-date";

interface SalesListItemProps {
  sale: any;
}

const SalesListItem: React.FC<SalesListItemProps> = ({ sale }) => {
  return (
    <div className="border-b border-foreground rounded-md p-2 w-full">
      <div className="flex justify-between items-center gap-2">
        {sale.sale_type ? (
          <span className="text-sm">{sale.sale_type}</span>
        ) : (
          <span className="text-sm">Pending Sale Type</span>
        )}
        <FormattedDate className="text-sm" date={sale.date_of_sale} />
      </div>
      <span>${sale.net_selling_price?.toLocaleString()}</span>
    </div>
  );
};

export default SalesListItem;
