import { createClient } from "@/utils/supabase/server";
import AppealCard from "./appeal";

export default async function ParcelAppeals({
  parcel_number,
}: {
  parcel_number: string;
}) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("appeals")
      .select()
      .eq("parcel_number", parcel_number);
    // .order("date_of_s", { ascending: false });

    if (error) {
      throw new Error("Failed to fetch data");
    }

    // console.log({ data, error });

    if (Array.isArray(data) && data.length === 0) {
      return <div>No Appeals Found</div>;
    }

    return (
      <div>
        <div className="flex flex-col space-y-4">
          {data.map((appeal: any) => (
            <AppealCard key={appeal.id} appeal={appeal} />
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error(error);
    return <div>Failed to fetch sale</div>;
  }
}
