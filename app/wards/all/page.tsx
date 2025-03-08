import RealEstateComparison from "@/components/ui/year-comparisons-all-wards";
import Image from "next/image";
import profilePic from "@/public/stl-city-seal.png";

// import wardGroupsData from "@/public/data/by_ward_groups.json";
// import WardDataTable, {
//   WardGroupData,
// } from "@/components/ui/year-comparisons-copy";

const WardsList: React.FC = () => {
  // Extract unique ward numbers from the imported data
  // const uniqueWards = Array.from(
  //   new Set((wardGroupsData as WardGroupData[]).map((item) => item.ward))
  // ).sort((a, b) => a - b);

  return (
    <div className="text-sm text-center">
      <div className="break-after-page"></div>
      <RealEstateComparison />
    </div>
  );
};

export default WardsList;
