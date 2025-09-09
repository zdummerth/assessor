import Image from "next/image";
import stlSeal from "@/public/stl-city-seal.png";
import FormattedDate from "@/components/ui/formatted-date";

interface NoticeHeaderProps {
  mayorName?: string;
  assessorName?: string;
  assessorTitle?: string;
  cityTitle?: string;
  officeTitle?: string;
  cityHallAddress1?: string;
  cityHallAddress2?: string;
  paddingTop?: string;
  mailingName?: string;
  mailingAddress1?: string;
  mailingAddress2?: string;
  mailingCity?: string;
  mailingState?: string;
  mailingZip?: string;
  date?: string;
}

export default function NoticeHeader({
  mayorName = "Cara Spencer",
  assessorName = "Shawn T. Ordway",
  assessorTitle = "Assessor",
  cityTitle = "City Of St. Louis",
  officeTitle = "Office Of The Assessor",
  cityHallAddress1 = "114 - 120 City Hall",
  cityHallAddress2 = "St. Louis, MO 63103",

  mailingName = "",
  mailingAddress1 = "",
  mailingAddress2 = "",
  mailingCity = "",
  mailingState = "",
  mailingZip = "",
  date,
  paddingTop = "pt-3",
}: NoticeHeaderProps) {
  return (
    <>
      <div
        className={`flex flex-col items-center justify-center ${paddingTop}`}
      >
        <Image src={stlSeal} alt="St. Louis City Seal" width={80} height={80} />
      </div>

      <div className="grid grid-cols-3 mt-2 text-sm">
        <div className="text-center justify-self-start">
          <p className="font-bold">{mayorName}</p>
          <p>Mayor</p>
        </div>
        <div className="font-bold text-center justify-self-center">
          <p>{cityTitle}</p>
          <p>{officeTitle}</p>
        </div>
        <div className="text-center justify-self-end">
          <p className="font-bold">{assessorName}</p>
          <p>{assessorTitle}</p>
        </div>
      </div>

      <div className="text-center text-sm">
        <p>{cityHallAddress1}</p>
        <p>{cityHallAddress2}</p>
      </div>

      {/* Mailing name, address, and date */}
      <div className="flex justify-between mt-6 mb-20 text-sm/4">
        <div className="relative left-6">
          {mailingName && <p>{mailingName}</p>}
          {mailingAddress1 && <p>{mailingAddress1}</p>}
          {mailingAddress2 && <p>{mailingAddress2}</p>}
          {(mailingCity || mailingState || mailingZip) && (
            <p>
              {mailingCity}, {mailingState} {mailingZip}
            </p>
          )}
        </div>
        {date && <FormattedDate date={date} className="text-sm" />}
      </div>
    </>
  );
}
