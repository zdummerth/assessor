import RealEstateComparison from "@/components/ui/year-comparisons";
import Image from "next/image";
import profilePic from "@/public/stl-city-seal.png";

export default async function Page({
  params,
}: {
  params?: {
    id: string;
  };
}) {
  const id = params?.id;

  return (
    <div className="w-full text-center flex flex-col items-center">
      <div className="flex justify-between w-full items-center mb-8">
        <div className="text-left">
          <h1 className="text-3xl font-semibold mb-6">City of St. Louis</h1>
          <h2 className="text-3xl font-semibold">Ward {id}</h2>
        </div>
        <div className="w-[100px] text-sm">
          <Image
            src={profilePic}
            alt="Picture of the author"
            // width={500} automatically provided
            // height={500} automatically provided
            // blurDataURL="data:..." automatically provided
            // placeholder="blur" // Optional blur-up while loading
          />
        </div>
      </div>
      <RealEstateComparison />
    </div>
  );
}
