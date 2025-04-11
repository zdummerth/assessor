import { createClient } from "@/utils/supabase/server";
import { Grid, Card } from "../ui/grid";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface DataItem {
  appeal_appraiser: string | null;
  status: string;
  count: number;
}

export default async function AppealStats({
  searchParams,
}: {
  searchParams?: {
    year?: string;
    sortColumn?: string;
    sortDirection?: string;
  };
}) {
  const year = searchParams?.year || "Any";
  const supabase = await createClient();

  const query = supabase
    .from("parcel_review_appeals")
    .select("appeal_appraiser, status, status.count()");

  if (year !== "Any") {
    query.eq("year", year);
  }

  query.order("appeal_appraiser", { ascending: true });

  const { data, error } = await query;

  if (error) {
    console.error(error);
    return (
      <div className="w-full flex flex-col items-center justify-center mt-16">
        <p className="text-center">Error fetching stats</p>
        <p>Please refresh page</p>
      </div>
    );
  }

  // console.log(data);
  interface GroupedData {
    [appraiser: string]: {
      [status: string]: number;
    };
  }

  //@ts-ignore
  const groupedData: GroupedData = data.reduce(
    //@ts-ignore
    (acc: GroupedData, curr: DataItem) => {
      const appraiser = curr.appeal_appraiser || "Unassigned";
      if (!acc[appraiser]) {
        acc[appraiser] = {};
      }
      if (!acc[appraiser][curr.status]) {
        acc[appraiser][curr.status] = 0;
      }
      acc[appraiser][curr.status] += curr.count;
      return acc;
    },
    {} as GroupedData
  );

  // console.log(groupedData);

  return (
    <div className="container mx-auto p-4">
      <Grid>
        {Object.entries(groupedData).map(([appraiser, statuses]) => (
          <Card key={appraiser}>
            <h2 className="text-xl font-semibold mb-2">{appraiser}</h2>
            <ul>
              {Object.entries(statuses).map(([status, count]) => (
                <Link
                  key={status}
                  href={`/appeals?status=${status}&appraiser=${appraiser}&year=${year}`}
                  className="block hover:bg-gray-200 hover:dark:bg-gray-800 transition-colors"
                >
                  <li className="flex justify-between border-b py-1">
                    <span>{status}</span>
                    <div className="flex gap-2 items-center">
                      <span className="font-bold">{count}</span>
                      <ArrowRight size={14} className="text-gray-400" />
                    </div>
                  </li>
                </Link>
              ))}
            </ul>
          </Card>
        ))}
      </Grid>
    </div>
  );
}
