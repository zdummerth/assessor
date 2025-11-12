// app/property-tax-calculation/page.tsx
import type { LucideIcon } from "lucide-react";
import { Home, Building2, Car, Sprout } from "lucide-react";

export default function PropertyTaxCalculationPage() {
  const ICONS: Record<string, LucideIcon> = {
    "Personal Property": Car,
    "Residential Real Property": Home,
    "Commercial Real Property": Building2,
    "Agricultural Real Property": Sprout,
  };

  const examples = [
    {
      title: "Personal Property",
      examples: [
        {
          assessmentRate: 0.3333,
          marketValue: 25000,
          taxRate: 0.081122,
        },
      ],
    },
    {
      title: "Residential Real Property",
      examples: [
        {
          assessmentRate: 0.19,
          marketValue: 200000,
          taxRate: 0.081867,
        },
      ],
    },
    {
      title: "Commercial Real Property",
      examples: [
        {
          assessmentRate: 0.32,
          marketValue: 500000,
          taxRate: 0.097522,
        },
      ],
    },
    {
      title: "Agricultural Real Property",
      examples: [
        {
          assessmentRate: 0.12,
          marketValue: 100000,
          taxRate: 0.081122,
        },
      ],
    },
  ];

  const currencyFmt = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const currencyRound = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const roundAssessedByGroup = (groupTitle: string, assessed: number) => {
    const isCommercial = groupTitle === "Commercial Real Property";
    const factor = isCommercial ? 100 : 10;
    return Math.round(assessed / factor) * factor;
  };

  return (
    <main className="min-h-screen bg-gray-50 print:bg-white">
      <div className="mx-auto max-w-[8.5in] bg-white p-6 shadow print:p-4 print:shadow-none">
        <h1 className="mb-4 text-center text-xl font-semibold text-gray-800">
          How to Calculate 2025 Property Taxes
        </h1>

        <div className="mb-4 rounded bg-blue-50 p-2 text-center text-sm font-medium text-gray-800">
          <div>
            <span className="font-semibold">Assessed Value =</span> Market Value
            × Assessment Rate
          </div>
          <span className="font-semibold">Tax =</span> (Assessed Value ÷ 100) ×
          Tax Rate
        </div>

        <p className="mb-6 text-xs text-gray-700">
          <strong>Market Value</strong> is the appraised value of the property.
          <br />
          <strong>Assessment Rate</strong> depends on property type.
          <br />
          <strong>Tax Rate</strong> is determined by local taxing authorities.
        </p>

        <section className="space-y-4">
          {examples.map((group) =>
            group.examples.map((ex, idx) => {
              const Icon = ICONS[group.title] ?? Car;

              const roundedMarketValue = Math.round(ex.marketValue);
              const assessedRaw = roundedMarketValue * ex.assessmentRate;
              const assessedRounded = roundAssessedByGroup(
                group.title,
                assessedRaw
              );
              const taxRatePer100 = ex.taxRate * 100;
              const tax =
                Math.round((assessedRounded / 100) * taxRatePer100 * 100) / 100;

              const roundedToNearest =
                group.title === "Commercial Real Property" ? 100 : 10;

              return (
                <div
                  key={group.title + idx}
                  className="rounded border border-gray-200 bg-gray-50 p-3 text-xs leading-relaxed"
                >
                  {/* Header line with icon */}
                  <div className="mb-4 border-b-2 pb-4 flex flex-wrap items-center justify-between text-sm font-semibold text-gray-800">
                    <span className="flex items-center gap-2">
                      <Icon className="h-8 w-8" aria-hidden />
                      {group.title}
                    </span>
                    <span>
                      Assessment Rate: {ex.assessmentRate * 100}% | Tax Rate:{" "}
                      {taxRatePer100}
                    </span>
                  </div>

                  {/* Values */}
                  <p>Example:</p>
                  <div className="flex justify-between">
                    <div>
                      <strong>Market Value:</strong>{" "}
                      {currencyRound.format(roundedMarketValue)}
                    </div>

                    <div className="flex flex-col items-center">
                      <div>
                        <strong>Assessed Value:</strong>{" "}
                        {currencyRound.format(assessedRounded)}
                      </div>
                      <div className="text-[10px] text-gray-600">
                        {currencyRound.format(roundedMarketValue)} ×{" "}
                        {ex.assessmentRate} ={" "}
                        {currencyRound.format(assessedRaw)} → rounded to nearest
                        ${roundedToNearest}
                      </div>
                    </div>

                    <div className="flex flex-col items-center">
                      <div>
                        <strong className="text-blue-700">
                          Estimated Tax:
                        </strong>{" "}
                        {currencyFmt.format(tax)}
                      </div>
                      <div className="text-[10px] text-gray-600">
                        ({currencyRound.format(assessedRounded)} ÷ 100) ×{" "}
                        {taxRatePer100}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </section>

        {/* Expanded disclaimer */}
        <p className="mt-6 text-[10px] text-gray-600 text-center italic">
          These calculations are estimates. Actual tax bills may include
          additional charges such as sewer lateral fees, special business
          district assessments, community improvement district charges, or PACE
          program charges, and may be lower due to senior tax credits,
          abatements, or exemptions.
        </p>

        <footer className="mt-4 text-center text-[10px] text-gray-500 print:text-black">
          {new Date().getFullYear()} Property Tax Guide
        </footer>
      </div>
    </main>
  );
}
