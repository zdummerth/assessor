import React from "react";
import CopyToClipboard from "@/components/copy-to-clipboard";
import FormattedDate from "@/components/ui/formatted-date";
import Address from "../address";
import ParcelNumber from "../parcel-number";
import { ArrowRight } from "lucide-react";

interface AppealListItemProps {
  appeal: any;
}

const AppealListItem: React.FC<AppealListItemProps> = ({ appeal }) => (
  <div className="group bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow rounded-xl p-4 w-full">
    <div className="flex justify-between items-center mb-2">
      <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
        {appeal.year}
      </span>
      <div className="flex items-center space-x-1">
        <span className="text-base font-mono text-gray-700 dark:text-gray-200">
          {appeal.appeal_number}
        </span>
        <CopyToClipboard
          text={appeal.appeal_number.toString().padStart(10, "0")}
        />
      </div>
    </div>

    <div className="flex flex-wrap justify-between gap-4 mb-3">
      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
        {appeal.appeal_type}
      </span>
      <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
        {appeal.status}
      </span>
    </div>

    <div className="flex items-center justify-start text-lg font-semibold mb-3 space-x-2">
      <span className="text-gray-700 dark:text-gray-200">
        ${appeal.before_total.toLocaleString()}
      </span>
      <ArrowRight size={16} className="text-gray-400" />
      <span className="text-gray-700 dark:text-gray-200">
        ${appeal.after_total.toLocaleString()}
      </span>
    </div>

    <div className="grid grid-cols-2 gap-4 mb-3 text-sm text-gray-600 dark:text-gray-400">
      <div className="flex flex-col items-center space-x-1">
        <span className="font-medium">Parcel:</span>
        <span className="font-mono">
          <ParcelNumber parcelNumber={appeal.parcel_year.parcel_number} />
        </span>
      </div>
      <div className="flex flex-col items-center space-x-1">
        <span className="font-medium">Address:</span>
        <span className="font-mono">
          <Address
            address={`
              
              ${appeal.parcel_year.site_street_number || ""}
              ${appeal.parcel_year.prefix_directional || ""}
              ${appeal.parcel_year.site_street_name || ""}
              ${appeal.parcel_year.site_zip_code || ""}
              `}
          />
        </span>
      </div>
      <div className="flex flex-col items-center space-x-1">
        <span className="font-medium">Appraised:</span>
        <span>${appeal.parcel_year.appraised_total.toLocaleString()}</span>
      </div>
      <div className="flex flex-col items-center space-x-1">
        <span className="font-medium">Neighborhood:</span>
        <span>{appeal.parcel_year.neighborhood}</span>
      </div>
      <div className="flex flex-col items-center space-x-1">
        <span className="font-medium">Appraiser:</span>
        <span>{appeal.appeal_appraiser}</span>
      </div>
    </div>

    <div className="text-sm">
      {appeal.hearing_ts ? (
        <div className="flex items-center space-x-1">
          <span className="font-medium">Hearing:</span>
          <FormattedDate date={appeal.hearing_ts} showTime />
        </div>
      ) : (
        <span className="text-gray-400 italic">No hearing scheduled</span>
      )}
    </div>
  </div>
);

export default AppealListItem;
