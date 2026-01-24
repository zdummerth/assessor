import { getDeedAbstracts } from "../actions";
import { PrintableAbstracts } from "./printable-abstracts";

export default async function PrintAbstractsPage() {
  const { data, totalCount, error } = await getDeedAbstracts({
    limit: 200,
    page: 1,
  });
  if (error || totalCount === 0) {
    return <p className="p-4">No abstracts available for printing.</p>;
  }

  return <PrintableAbstracts deedAbstracts={data} />;
}
