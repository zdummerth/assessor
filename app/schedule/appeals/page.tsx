import { createClient } from "@/utils/supabase/server";
import ScheduledAppeals from "./scheduled-appeals";
import UnscheduledAppeals from "./unscheduled-appeals";

export default async function AppealsPage() {
  const supabase = await createClient();

  //@ts-ignore
  const { data, error } = await supabase.from("sched_appeals").select(`
      id,
      appeal_number,
      appellant_name,
      sched_scheduled_hearings (
        hearing_slot_id,
        sched_hearing_slots (
          slot_time,
          duration_minutes
        )
      )
    `);

  if (error) {
    return (
      <div className="w-full flex flex-col items-center justify-center mt-16">
        <p className="text-center">Error fetching appeals</p>
        <p>{error.message}</p>
      </div>
    );
  }

  const scheduled = data.filter(
    (appeal: any) =>
      appeal.sched_scheduled_hearings?.sched_hearing_slots?.slot_time
  );
  const unscheduled = data.filter(
    (appeal: any) =>
      !appeal.sched_scheduled_hearings?.sched_hearing_slots?.slot_time
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-6">Appeals</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UnscheduledAppeals data={unscheduled} />
        {/* @ts-ignore */}
        <ScheduledAppeals data={scheduled} />
      </div>
    </div>
  );
}
