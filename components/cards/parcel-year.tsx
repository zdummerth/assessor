"use client";
import React, { useState } from "react";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";

const ParcelCard: React.FC<{ data: any }> = ({ data }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const total_appraised =
    data.appraised_res_land +
    data.appraised_res_building +
    data.appraised_agr_land +
    data.appraised_agr_building +
    data.appraised_com_land +
    data.appraised_com_building;

  return (
    <div className="bg-background shadow-lg rounded-lg border border-gray-200 p-2">
      <div className="flex items-center justify-between">
        <p className="text-md font-bold">{data.year}</p>
        <p className="text-md font-bold">{data.tax_status}</p>
        <p className="font-semibold">${total_appraised.toLocaleString()}</p>
        <button
          onClick={toggleCollapse}
          className="hover:bg-blue-600 rounded-full"
        >
          {isCollapsed ? (
            <ArrowDownCircle size={24} />
          ) : (
            <ArrowUpCircle size={24} />
          )}
        </button>
      </div>

      {!isCollapsed && (
        <div className="mt-4 space-y-2 text-gray-600">
          <h3 className="text-lg font-semibold text-gray-800 mt-4">Owner:</h3>
          {data.owner_attn && (
            <p className="font-semibold">{data.owner_attn}</p>
          )}
          <p>{data.owner_name}</p>

          <p>{data.owner_address_1}</p>
          <p>
            {data.owner_city}, {data.owner_state && data.owner_state}{" "}
            {data.owner_zip}
          </p>
          <h3 className="text-lg font-semibold text-gray-800 mt-4">Situs:</h3>

          <p>{`${data.site_address_1}, ${data.site_zip}`} </p>

          <h3 className="text-lg font-semibold text-gray-800 mt-4">Details:</h3>
          <div>
            <p>
              <span className="font-semibold">Tax Status: </span>
              {data.tax_status}
            </p>
            <p>
              <span className="font-semibold">Land Use: </span>
              {data.land_use}
            </p>
            <p>
              <span className="font-semibold">Occupancy: </span>
              {data.occupancy}
            </p>
            <p>
              <span className="font-semibold">Occupancy Description: </span>
              {data.occupancy_description}
            </p>
            <p>
              <span className="font-semibold">Tax Code: </span>
              {data.tax_code}
            </p>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mt-4">
            Appraisal Values:
          </h3>
          <div>
            <p>
              <span className="font-semibold">Residential Land: </span>$
              {data.appraised_res_land.toLocaleString()}
            </p>
            <p>
              <span className="font-semibold">Residential Building: </span>$
              {data.appraised_res_building.toLocaleString()}
            </p>
            <p>
              <span className="font-semibold">New Construction: </span>$
              {data.appraised_res_new_construction.toLocaleString()}
            </p>
            <p>
              <span className="font-semibold">Agricultural Land: </span>$
              {data.appraised_agr_land.toLocaleString()}
            </p>
            <p>
              <span className="font-semibold">Agricultural Building: </span>$
              {data.appraised_agr_building.toLocaleString()}
            </p>
            <p>
              <span className="font-semibold">Commercial Land: </span>$
              {data.appraised_com_land.toLocaleString()}
            </p>
            <p>
              <span className="font-semibold">Commercial Building: </span>$
              {data.appraised_com_building.toLocaleString()}
            </p>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mt-4">
            Assessment Values:
          </h3>
          <div>
            <p>
              <span className="font-semibold">Residential Land: </span>$
              {data.assessed_res_land.toLocaleString()}
            </p>
            <p>
              <span className="font-semibold">Residential Building: </span>$
              {data.assessed_res_building.toLocaleString()}
            </p>
            <p>
              <span className="font-semibold">New Construction: </span>$
              {data.assessed_res_new_construction.toLocaleString()}
            </p>
            <p>
              <span className="font-semibold">Agricultural Land: </span>$
              {data.assessed_agr_land.toLocaleString()}
            </p>
            <p>
              <span className="font-semibold">Commercial Land: </span>$
              {data.assessed_com_land.toLocaleString()}
            </p>
            <p>
              <span className="font-semibold">Commercial Building: </span>$
              {data.assessed_com_building.toLocaleString()}
            </p>
            <p>
              <span className="font-semibold">Total: </span>$
              {data.assessed_total.toLocaleString()}
            </p>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mt-4">
            Additional Info:
          </h3>
          <p>
            <span className="font-semibold">Property Class: </span>
            {data.property_class}
          </p>
          <p>
            <span className="font-semibold">Neighborhood: </span>
            {data.neighborhood}
          </p>
          <p>
            <span className="font-semibold">Section: </span>
            {data.section}
          </p>
          <p>
            <span className="font-semibold">Appraiser: </span>
            {data.appraiser}
          </p>
        </div>
      )}
    </div>
  );
};

export default ParcelCard;
