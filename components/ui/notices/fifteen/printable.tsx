import FormattedDate from "@/components/ui/formatted-date";
import Image from "next/image";
import stlSeal from "@/public/stl-city-seal.png";

export default function Notice({ data }: { data: any }) {
  const owner_name = data.owner_name;

  const address_1 = data.owner_address_1;
  const address_2 = data.owner_address_2;
  const city = data.owner_city;
  const state = data.owner_state;
  const zip = data.owner_zip;

  const site_street_number = data.site_street_number;
  const prefix_directional = data.prefix_directional;
  const site_street_name = data.site_street_name;
  const site_zip_code = data.site_zip_code;

  console.log(data);

  const currentTimestampString = new Date().toLocaleString("en-US", {
    timeZone: "America/Chicago",
  });

  return (
    <div className="w-[90%] mx-auto print:break-after-page border p-8 print:p-0 print:mt-4 print:border-none print:bg-white print:text-black">
      <div className="flex flex-col items-center justify-center">
        <Image src={stlSeal} alt="St. Louis City Seal" width={80} height={80} />
      </div>
      <div className="grid grid-cols-3 mt-2 text-sm">
        <div className="text-center justify-self-start">
          <p className="font-bold">Cara Spencer</p>
          <p>Mayor</p>
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
      <div className="text-center text-sm">
        <p>114 - 120 City Hall</p>
        <p>St. Louis, MO 63103</p>
      </div>
      <div id="detail" className="w-full">
        <div className="flex justify-between mt-7 mb-16 text-sm/4">
          <div className="relative left-12">
            <p>{owner_name}</p>
            {address_1 && <p>{address_1}</p>}
            {address_2 && <p>{address_2}</p>}
            <p>
              {city}, {state} {zip}
            </p>
          </div>
          <FormattedDate date={currentTimestampString} className="text-sm" />
        </div>

        <div className="my-8 flex justify-between">
          <div>
            <p className="text-sm">Parcel Number</p>
            <div>{data.parcel_number}</div>
          </div>
          <div>
            <p className="text-sm">Property Address</p>
            <div>
              {`
                ${site_street_number || ""}
                ${prefix_directional || ""} ${site_street_name || ""} ${site_zip_code || ""}           `}
            </div>
          </div>
        </div>

        <div className="text-sm">
          <p className="text-sm">
            The preliminary analysis by the City of St. Louis Assessor’s office
            indicates the residential value of your property will increase by
            more than 15% for the 2025 reassessment. The preliminary total value
            we have determined for your property for the 2025 reassessment is:
          </p>
          <p className="font-bold text-xl my-4 text-center">
            ${data.appraised_total.toLocaleString()}
          </p>
          <p>
            Missouri law requires Assessors to complete a physical inspection of
            any residential property that increases by more than 15% due to
            reassessment (excluding new construction). Such physical inspection
            includes an on-site personal observation and review of all exterior
            portions of the land and buildings and improvements to which the
            inspector has or may reasonably and lawfully gain external access.
            As part of the physical inspection process, you are hereby notified
            of your right for an interior inspection of your property. An
            interior inspection will only be performed if specifically requested
            by the taxpayer. If you do not want us to enter your property due to
            health or other concerns, you can submit pictures and other
            information about the condition of your home by emailing
            zasr@stlouis-mo.gov.
          </p>
          <p className="mt-4">
            Please make sure you include your parcel number and address in your
            email.
          </p>
          <p className="mt-4">
            <span className="font-bold">
              If you agree with your property's value and do not want an
              interior inspection, then no action is required.
            </span>{" "}
            This will in no way affect your ability to appeal after you receive
            your Change of Assessment notice in May 2025. State law requires the
            Assessor to revalue all real property in the City as of January 1st
            of every odd-numbered year.
          </p>
          <p className="mt-4">
            For questions or to schedule an interior inspection, please call
            314-622-4185 or email us at zasr@stlouis-mo.gov.
          </p>
        </div>
      </div>
    </div>
  );
}
