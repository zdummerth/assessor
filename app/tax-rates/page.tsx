import TaxRatesServer from "./server";
import { Suspense } from "react";

export default async function Page() {
  return (
    <div className="w-full p-4 mb-10 max-w-7xl mx-auto">
      <Suspense fallback={<div>Loading...</div>}>
        <TaxRatesServer />
      </Suspense>
    </div>
  );
}
