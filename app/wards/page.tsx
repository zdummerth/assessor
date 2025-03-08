import RealEstateComparison from "@/components/ui/year-comparisons";
import Image from "next/image";
import profilePic from "@/public/stl-city-seal.png";

import wardGroupsData from "@/public/data/by_ward_groups.json";
import WardDataTable, {
  WardGroupData,
} from "@/components/ui/year-comparisons-copy";

const WardsList: React.FC = () => {
  // Extract unique ward numbers from the imported data
  const uniqueWards = Array.from(
    new Set((wardGroupsData as WardGroupData[]).map((item) => item.ward))
  ).sort((a, b) => a - b);

  return (
    <div className="container mx-auto p-4">
      {uniqueWards.map((ward, index) => {
        // Filter the data for this ward only
        const wardData = (wardGroupsData as WardGroupData[]).filter(
          (item) => item.ward === ward
        );
        return (
          <div
            key={ward}
            className={`mb-8 ${index == uniqueWards.length - 1 ? "" : " break-after-page"}`}
          >
            <Image
              src={profilePic}
              alt="St. Louis City Seal"
              width={100}
              height={100}
            />
            <h1 className="text-3xl font-bold my-4 text-center">Ward {ward}</h1>
            <WardDataTable ward={ward} data={wardData} />
          </div>
        );
      })}
    </div>
  );
};

export default WardsList;
