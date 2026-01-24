import { getDeedAbstracts } from "../actions";
import { PrintableAbstracts } from "./printable-abstracts";

export default async function PrintAbstractsPage() {
  const deedAbstracts = await getDeedAbstracts({ limit: 200, page: 1 });

  return <PrintableAbstracts deedAbstracts={deedAbstracts} />;
}
