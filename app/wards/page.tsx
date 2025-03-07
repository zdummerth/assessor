import RealEstateComparison from "@/components/ui/year-comparisons";
import Image from "next/image";
import profilePic from "@/public/stl-city-seal.png";

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    year?: string;
  };
}) {
  const year = searchParams?.year || new Date().getFullYear().toString();

  return (
    <div className="w-full">
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
      <RealEstateComparison />
    </div>
  );
}
