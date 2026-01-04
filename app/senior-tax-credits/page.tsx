import Image from "next/image";
import stlSeal from "@/public/stl-city-seal.png";
import { createClient } from "@/lib/supabase/server";
import PrintButton from "@/components/ui/print-button";

import type { JSX } from "react";

const Template = ({
  name,
  address,
  propertyAddress,
  parcel,
}: {
  name: string;
  address: JSX.Element;
  propertyAddress: string;
  parcel: string;
}) => {
  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="w-[7.5in] h-[10in] bg-white flex flex-col">
      <div className="flex flex-col items-center justify-center">
        <Image src={stlSeal} alt="St. Louis City Seal" width={75} height={75} />
      </div>
      <div className="grid grid-cols-3 mt-2 text-sm">
        <div className="text-center justify-self-start">
          <p className="font-bold">Cara Spencer</p>
          <p>Mayor Elect</p>
        </div>
        <div className="font-bold text-center justify-self-center">
          <p>City Of St. Louis</p>
          <p>Office Of The Assessor</p>
        </div>
        <div className="text-center justify-self-end">
          <p className="font-bold">Shawn T. Ordway</p>
          <p>Interim Assessor</p>
        </div>
      </div>
      <div className="text-center text-sm my-2">
        <p>114 - 120 City Hall</p>
        <p>St. Louis, MO 63103</p>
      </div>
      <div className="flex justify-between">
        <div>
          <p>{name}</p>
          {address}
        </div>
        <p>{currentDate}</p>
      </div>
      <div className="mt-8 flex justify-between">
        <div>
          <p className="text-left">Parcel Number</p>
          <p className="">{parcel}</p>
        </div>
        <div>
          <p className="text-right">Property Address</p>
          <p className="">{propertyAddress}</p>
        </div>
      </div>
      <div className="mt-8">
        <p className="mt-4">
          This is to certify that the above property has been{" "}
          <span className="font-bold">Approved</span> for the Senior Property
          Tax Credit for the year 2025.
        </p>
        <p className="mt-4">
          The Senior Property Tax Freeze applies only the City of St. Louis
          taxes. The tax freeze does not apply to the other tax districts like
          Public Schools, Public Library, Museum and Zoo District, etc.
        </p>
        <p className="mt-4">
          For anyone who resides in a multi-unit property, the credit will only
          apply to the unit in which you reside; it will not apply to the entire
          structure.
        </p>
        <p className="mt-4">
          Please keep this letter for your records.{" "}
          <span className="font-bold">
            You will need to reapply for the Senior Property Tax Freeze
            annually.
          </span>
        </p>
        <p className="mt-4">
          If you have any questions, please contact the Office of the Assessor
          at assessor-office@stlouis-mo.gov or (314) 622-4185.
        </p>
      </div>
      <div className="mt-8">
        <p>Shawn T. Ordway</p>
        <p>Interim Assessor</p>
        <p>City of St. Louis, Office of the Assessor</p>
      </div>
      <div className="mt-auto text-xs">
        <p>
          You can see parcel information online at
          https://www.stlouis-mo.gov/data/address-search/
        </p>
      </div>
    </div>
  );
};

export default async function SeniorTaxCreditApprovalLetterPage() {
  const ITEMS_PER_PAGE = 5;
  const supabase = await createClient();

  const {
    data,
    count: remainingCount,
    error,
  } = await supabase
    .from("senior_tax_credits")
    .select(
      "*, parcel_reviews_2025(owner_name, owner_address2, owner_city, owner_state, owner_zip, site_street_number, prefix_directional, site_street_name, site_zip_code)",
      {
        count: "exact",
        head: false,
      }
    )
    .limit(ITEMS_PER_PAGE);

  const { count, error: count_error } = await supabase
    .from("senior_tax_credits")
    .select("*", {
      count: "exact",
      head: true,
    })
    .not("approval_letter_printed_timestamp", "is", null);

  if (error && !data) {
    console.error(error);
    return (
      <div className="w-full flex flex-col items-center justify-center mt-16">
        <p className="text-center">Error fetching appraisers</p>
        <p>{error.message}</p>
      </div>
    );
  }

  console.log("count", count);

  return (
    <div>
      <div className="print:hidden ">
        <h2 className="text-center text-xl my-4">
          Senior Tax Credit Approval Letters
        </h2>
        <p>Approval Letters Printed: {count}</p>
        <p>Approval Letters Remaining: {remainingCount}</p>
        <PrintButton className="text-white bg-blue-500 p-2 rounded-md m-4 flex items-center justify-center" />
      </div>
      {data.map((item: any) => {
        const displayAddress = `${item.parcel_reviews_2025.site_street_number} ${item.parcel_reviews_2025.prefix_directional || ""} ${item.parcel_reviews_2025.site_street_name} ${item.parcel_reviews_2025.site_zip_code || ""}`;
        return (
          <div key={item.parcel_number} className="flex flex-col items-center">
            <Template
              name={item.parcel_reviews_2025.owner_name}
              address={
                <div>
                  <div>{item.parcel_reviews_2025.owner_address2}</div>
                  <div>
                    {`${item.parcel_reviews_2025.owner_city} ${item.parcel_reviews_2025.owner_state} ${item.parcel_reviews_2025.owner_zip}`}
                  </div>
                </div>
              }
              propertyAddress={displayAddress}
              parcel={item.parcel_number}
            />
          </div>
        );
      })}
    </div>
  );
}
