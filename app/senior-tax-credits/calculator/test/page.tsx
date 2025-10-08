"use client";
import React, { useMemo, useState } from "react";

type District = "City" | "Non-City";

type TaxRate = {
  subdistrict: string;
  district: District;
  year: number;
  rate: number;
};

const taxRates: TaxRate[] = [
  // --- City (2023)
  {
    subdistrict: "County Purposes – General Revenue",
    district: "City",
    year: 2023,
    rate: 0.3395,
  },
  {
    subdistrict: "Municipal Purposes General Revenue 1",
    district: "City",
    year: 2023,
    rate: 0.1558,
  },
  {
    subdistrict: "Municipal Purposes General Revenue 2",
    district: "City",
    year: 2023,
    rate: 0.8149,
  },
  {
    subdistrict: "Public Health Purposes",
    district: "City",
    year: 2023,
    rate: 0.0196,
  },
  {
    subdistrict: "Hospital Purposes",
    district: "City",
    year: 2023,
    rate: 0.0971,
  },
  {
    subdistrict: "Recreation Purposes",
    district: "City",
    year: 2023,
    rate: 0.0196,
  },

  // --- Non-City (2023)
  {
    subdistrict: "Interest in Public Debt",
    district: "Non-City",
    year: 2023,
    rate: 0.1554,
  },
  {
    subdistrict: "Children’s Services Fund",
    district: "Non-City",
    year: 2023,
    rate: 0.2407,
  },
  {
    subdistrict: "Community Mental Health Fund",
    district: "Non-City",
    year: 2023,
    rate: 0.0875,
  },
  {
    subdistrict: "Junior College",
    district: "Non-City",
    year: 2023,
    rate: 0.2619,
  },
  { subdistrict: "Library", district: "Non-City", year: 2023, rate: 0.5459 },
  {
    subdistrict: "Sewer General Revenue",
    district: "Non-City",
    year: 2023,
    rate: 0.0162,
  },
  {
    subdistrict: "Sewer General Stormwater",
    district: "Non-City",
    year: 2023,
    rate: 0.0835,
  },
  { subdistrict: "Art Museum", district: "Non-City", year: 2023, rate: 0.0666 },
  {
    subdistrict: "Botanical Garden",
    district: "Non-City",
    year: 2023,
    rate: 0.0336,
  },
  {
    subdistrict: "History Museum",
    district: "Non-City",
    year: 2023,
    rate: 0.0336,
  },
  {
    subdistrict: "Museum of Science and Natural History",
    district: "Non-City",
    year: 2023,
    rate: 0.0336,
  },
  { subdistrict: "Zoo", district: "Non-City", year: 2023, rate: 0.0666 },
  {
    subdistrict: "Public School General Fund",
    district: "Non-City",
    year: 2023,
    rate: 4.0506,
  },
  {
    subdistrict: "Public School Debt Service",
    district: "Non-City",
    year: 2023,
    rate: 0.6211,
  },
  {
    subdistrict: "Senior Services Fund",
    district: "Non-City",
    year: 2023,
    rate: 0.049,
  },
  {
    subdistrict: "Sheltered Workshop Fund",
    district: "Non-City",
    year: 2023,
    rate: 0.137,
  },
  {
    subdistrict: "Blind Pension Fund",
    district: "Non-City",
    year: 2023,
    rate: 0.03,
  },

  // --- City (2024)
  {
    subdistrict: "County Purposes – General Revenue",
    district: "City",
    year: 2024,
    rate: 0.3477,
  },
  {
    subdistrict: "Municipal Purposes General Revenue 1",
    district: "City",
    year: 2024,
    rate: 0.1593,
  },
  {
    subdistrict: "Municipal Purposes General Revenue 2",
    district: "City",
    year: 2024,
    rate: 0.8347,
  },
  {
    subdistrict: "Public Health Purposes",
    district: "City",
    year: 2024,
    rate: 0.02,
  },
  {
    subdistrict: "Hospital Purposes",
    district: "City",
    year: 2024,
    rate: 0.0995,
  },
  {
    subdistrict: "Recreation Purposes",
    district: "City",
    year: 2024,
    rate: 0.02,
  },

  // --- Non-City (2024)
  {
    subdistrict: "Interest in Public Debt",
    district: "Non-City",
    year: 2024,
    rate: 0.1851,
  },
  {
    subdistrict: "Children’s Services Fund",
    district: "Non-City",
    year: 2024,
    rate: 0.2443,
  },
  {
    subdistrict: "Community Mental Health Fund",
    district: "Non-City",
    year: 2024,
    rate: 0.0895,
  },
  {
    subdistrict: "Junior College",
    district: "Non-City",
    year: 2024,
    rate: 0.2628,
  },
  { subdistrict: "Library", district: "Non-City", year: 2024, rate: 0.5582 },
  {
    subdistrict: "Sewer General Revenue",
    district: "Non-City",
    year: 2024,
    rate: 0.0162,
  },
  {
    subdistrict: "Sewer General Stormwater",
    district: "Non-City",
    year: 2024,
    rate: 0.0835,
  },
  { subdistrict: "Art Museum", district: "Non-City", year: 2024, rate: 0.0671 },
  {
    subdistrict: "Botanical Garden",
    district: "Non-City",
    year: 2024,
    rate: 0.0335,
  },
  {
    subdistrict: "History Museum",
    district: "Non-City",
    year: 2024,
    rate: 0.0335,
  },
  {
    subdistrict: "Museum of Science and Natural History",
    district: "Non-City",
    year: 2024,
    rate: 0.0335,
  },
  { subdistrict: "Zoo", district: "Non-City", year: 2024, rate: 0.0671 },
  {
    subdistrict: "Public School General Fund",
    district: "Non-City",
    year: 2024,
    rate: 4.375,
  },
  {
    subdistrict: "Public School Debt Service",
    district: "Non-City",
    year: 2024,
    rate: 0.6211,
  },
  {
    subdistrict: "Senior Services Fund",
    district: "Non-City",
    year: 2024,
    rate: 0.05,
  },
  {
    subdistrict: "Developmental Disabilities Fund",
    district: "Non-City",
    year: 2024,
    rate: 0.1392,
  },
  {
    subdistrict: "Blind Pension Fund",
    district: "Non-City",
    year: 2024,
    rate: 0.03,
  },

  // --- City (2025)
  {
    subdistrict: "County Purposes – General Revenue",
    district: "City",
    year: 2025,
    rate: 0.3409,
  },
  {
    subdistrict: "Municipal Purposes General Revenue 1",
    district: "City",
    year: 2025,
    rate: 0.1562,
  },
  {
    subdistrict: "Municipal Purposes General Revenue 2",
    district: "City",
    year: 2025,
    rate: 0.8183,
  },
  {
    subdistrict: "Public Health Purposes",
    district: "City",
    year: 2025,
    rate: 0.0196,
  },
  {
    subdistrict: "Hospital Purposes",
    district: "City",
    year: 2025,
    rate: 0.0976,
  },
  {
    subdistrict: "Recreation Purposes",
    district: "City",
    year: 2025,
    rate: 0.0196,
  },

  // --- Non-City (2025)
  {
    subdistrict: "Interest in Public Debt",
    district: "Non-City",
    year: 2025,
    rate: 0.1061,
  },
  {
    subdistrict: "Children’s Services Fund",
    district: "Non-City",
    year: 2025,
    rate: 0.2396,
  },
  {
    subdistrict: "Community Mental Health Fund",
    district: "Non-City",
    year: 2025,
    rate: 0.0878,
  },
  {
    subdistrict: "Junior College",
    district: "Non-City",
    year: 2025,
    rate: 0.2442,
  },
  { subdistrict: "Library", district: "Non-City", year: 2025, rate: 0.5474 },
  {
    subdistrict: "Sewer General Revenue",
    district: "Non-City",
    year: 2025,
    rate: 0.0151,
  },
  {
    subdistrict: "Sewer General Stormwater",
    district: "Non-City",
    year: 2025,
    rate: 0.078,
  },
  {
    subdistrict: "MSD General Revenue-Storm Capital",
    district: "Non-City",
    year: 2025,
    rate: 0.0745,
  },
  { subdistrict: "Art Museum", district: "Non-City", year: 2025, rate: 0.0627 },
  {
    subdistrict: "Botanical Garden",
    district: "Non-City",
    year: 2025,
    rate: 0.0314,
  },
  {
    subdistrict: "History Museum",
    district: "Non-City",
    year: 2025,
    rate: 0.0314,
  },
  {
    subdistrict: "Museum of Science and Natural History",
    district: "Non-City",
    year: 2025,
    rate: 0.0314,
  },
  { subdistrict: "Zoo", district: "Non-City", year: 2025, rate: 0.0627 },
  {
    subdistrict: "Public School General Fund",
    district: "Non-City",
    year: 2025,
    rate: 4.2874,
  },
  {
    subdistrict: "Public School Debt Service",
    district: "Non-City",
    year: 2025,
    rate: 0.6211,
  },
  {
    subdistrict: "Senior Services Fund",
    district: "Non-City",
    year: 2025,
    rate: 0.049,
  },
  {
    subdistrict: "Developmental Disabilities Fund",
    district: "Non-City",
    year: 2025,
    rate: 0.1347,
  },
  {
    subdistrict: "Blind Pension Fund",
    district: "Non-City",
    year: 2025,
    rate: 0.03,
  },
];

// utils
const uniq = <T,>(arr: T[]) => Array.from(new Set(arr));
const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
const taxFromAppraised = (appraised: number, rate: number) =>
  parseFloat(((appraised / 100) * 0.19 * rate).toFixed(2));
const yearsBetween = (start: number, end: number) =>
  start < end
    ? Array.from({ length: end - start }, (_, i) => start + i + 1)
    : [];

export default function TaxFreezeCalculator() {
  // available years from data
  const availableYears = useMemo(
    () => uniq(taxRates.map((r) => r.year)).sort(),
    []
  );

  const [baseYear, setBaseYear] = useState<number>(2024);
  const [compareYear, setCompareYear] = useState<number>(2025);

  // Values
  const [baseValue, setBaseValue] = useState<number>(50000);
  const [compareValue, setCompareValue] = useState<number>(55000);

  // New construction by year: { [year]: amount }
  const [ncByYear, setNcByYear] = useState<Record<number, number>>({});

  // Lookups
  const rateFor = (year: number, subdistrict: string, district: District) =>
    taxRates.find(
      (r) =>
        r.year === year &&
        r.subdistrict === subdistrict &&
        r.district === district
    )?.rate ?? 0;

  const ratesByYearDistrict = (year: number, district: District) =>
    taxRates.filter((r) => r.year === year && r.district === district);

  const subdistrictKeys = useMemo(
    () => uniq(taxRates.map((r) => `${r.district}__${r.subdistrict}`)).sort(),
    []
  );

  // Rate sums
  const cityRateSumBase = sum(
    ratesByYearDistrict(baseYear, "City").map((r) => r.rate)
  );
  const cityRateSumCompare = sum(
    ratesByYearDistrict(compareYear, "City").map((r) => r.rate)
  );
  const nonCityRateSumBase = sum(
    ratesByYearDistrict(baseYear, "Non-City").map((r) => r.rate)
  );
  const nonCityRateSumCompare = sum(
    ratesByYearDistrict(compareYear, "Non-City").map((r) => r.rate)
  );

  // --- New construction handling ---
  const interYears = yearsBetween(baseYear, compareYear); // e.g., base+1, ..., compare
  const priorYears = interYears.filter((y) => y < compareYear);
  const ncPriorTotal = sum(priorYears.map((y) => ncByYear[y] ?? 0));
  const ncCompare = ncByYear[compareYear] ?? 0;

  // "Frozen base" for the compare year = base value + prior-year new construction
  const frozenBaseForCompare = baseValue + ncPriorTotal;

  // Base year taxes (no NC by definition)
  const cityTaxBase = taxFromAppraised(baseValue, cityRateSumBase);
  const nonCityTaxBase = taxFromAppraised(baseValue, nonCityRateSumBase);
  const totalBase = cityTaxBase + nonCityTaxBase;

  // Compare year (actual)
  const cityTaxCompareActual = taxFromAppraised(
    compareValue,
    cityRateSumCompare
  );
  const nonCityTaxCompare = taxFromAppraised(
    compareValue,
    nonCityRateSumCompare
  );
  const totalCompareActual = cityTaxCompareActual + nonCityTaxCompare;

  // Compare year (with freeze logic & NC rules)
  // 1) Frozen part: min( base-year ceiling on frozen base, current-year tax on frozen base )
  const cityFrozenCeiling = taxFromAppraised(
    frozenBaseForCompare,
    cityRateSumBase
  );
  const cityFrozenActualOnFrozenBase = taxFromAppraised(
    frozenBaseForCompare,
    cityRateSumCompare
  );
  const cityFrozenPart = Math.min(
    cityFrozenCeiling,
    cityFrozenActualOnFrozenBase
  );

  // 2) New construction in compare year is NOT frozen
  const cityUnfrozenNCInCompare = taxFromAppraised(
    ncCompare,
    cityRateSumCompare
  );

  const cityTaxCompareWithFreeze = cityFrozenPart + cityUnfrozenNCInCompare;
  const totalCompareWithFreeze = cityTaxCompareWithFreeze + nonCityTaxCompare;

  const creditAmount = totalCompareActual - totalCompareWithFreeze;

  const assessedBase = baseValue * 0.19;
  const assessedCompare = compareValue * 0.19;

  // If you’re on the new-construction version from earlier, these exist:
  const assessedFrozenBaseForCompare = frozenBaseForCompare * 0.19;
  const assessedNcCompare = (ncCompare ?? 0) * 0.19;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow rounded-lg space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">
        Senior Property Tax Freeze Calculator
      </h1>

      <div className="bg-blue-50 p-4 rounded border text-sm text-gray-700">
        <p>
          <strong>How the freeze works:</strong> City tax is frozen at the base
          year amount. <strong>New construction</strong> is <em>not</em> frozen
          in the year it’s built, and it’s{" "}
          <strong>added to the frozen base the following year</strong>.
        </p>
      </div>

      {/* Year + Value selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-gray-700 font-medium">
            Base Year (Frozen)
          </label>
          <select
            value={baseYear}
            onChange={(e) => setBaseYear(Number(e.target.value))}
            className="block w-full border rounded px-3 py-2"
          >
            {availableYears.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          <label className="text-gray-700">Appraised Value ({baseYear})</label>
          <input
            type="number"
            value={baseValue}
            onChange={(e) => setBaseValue(Number(e.target.value))}
            className="block w-full border rounded px-3 py-2"
          />
        </div>

        <div className="space-y-2">
          <label className="text-gray-700 font-medium">Compare Year</label>
          <select
            value={compareYear}
            onChange={(e) => setCompareYear(Number(e.target.value))}
            className="block w-full border rounded px-3 py-2"
          >
            {availableYears.map((y) => (
              <option key={y} value={y} disabled={y === baseYear}>
                {y}
              </option>
            ))}
          </select>

          <label className="text-gray-700">
            Appraised Value ({compareYear})
          </label>
          <input
            type="number"
            value={compareValue}
            onChange={(e) => setCompareValue(Number(e.target.value))}
            className="block w-full border rounded px-3 py-2"
          />
        </div>
      </div>

      {/* New construction inputs */}
      {interYears.length > 0 && (
        <div className="bg-gray-50 p-4 rounded border">
          <h2 className="text-lg font-semibold mb-2 text-gray-800">
            New Construction
          </h2>
          <p className="text-sm text-gray-600 mb-3">
            Enter the appraised value of new construction for each year. It’s
            not frozen in the construction year; it’s added to the frozen base
            the year after.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {interYears.map((y) => (
              <label key={y} className="text-gray-700">
                New Construction ({y})
                <input
                  type="number"
                  value={ncByYear[y] ?? 0}
                  onChange={(e) =>
                    setNcByYear((prev) => ({
                      ...prev,
                      [y]: Number(e.target.value),
                    }))
                  }
                  className="block w-full mt-1 border rounded px-3 py-2"
                />
              </label>
            ))}
          </div>

          <div className="mt-3 text-sm text-gray-700">
            <div>
              Frozen base for {compareYear}:{" "}
              <strong>{frozenBaseForCompare.toLocaleString()}</strong>
            </div>
            <div>
              New construction in {compareYear} (unfrozen):{" "}
              <strong>{(ncCompare || 0).toLocaleString()}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded border">
          <h2 className="text-lg font-semibold mb-2 text-gray-800">
            {baseYear} Taxes (Base)
          </h2>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>
              <strong>City Tax:</strong> ${cityTaxBase.toLocaleString()}
              <div className="text-xs text-gray-500">
                = (({assessedBase.toLocaleString()} ÷ 100) ×{" "}
                {cityRateSumBase.toFixed(4)})
              </div>
              <div className="text-[11px] text-gray-400">
                where assessed {baseYear} = {baseValue.toLocaleString()} × 0.19
                = {assessedBase.toLocaleString()}
              </div>
            </li>
            <li>
              <strong>Non-City Tax:</strong> ${nonCityTaxBase.toLocaleString()}
              <div className="text-xs text-gray-500">
                = (({assessedBase.toLocaleString()} ÷ 100) ×{" "}
                {nonCityRateSumBase.toFixed(4)})
              </div>
            </li>
            <li className="font-semibold mt-1">
              <strong>Total:</strong> ${totalBase.toLocaleString()}
            </li>
          </ul>
        </div>

        <div className="bg-gray-50 p-4 rounded border">
          <h2 className="text-lg font-semibold mb-2 text-gray-800">
            {compareYear} Taxes (Compare)
          </h2>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>
              <strong>City Tax (Frozen logic):</strong> $
              {cityTaxCompareWithFreeze.toLocaleString()}
              <div className="text-xs text-gray-500 leading-5">
                = min(
                <br />
                &nbsp;&nbsp;({assessedFrozenBaseForCompare.toLocaleString()} ÷
                100) × {cityRateSumBase.toFixed(4)}
                {" = "}${cityFrozenCeiling.toLocaleString()}
                ,
                <br />
                &nbsp;&nbsp;({assessedFrozenBaseForCompare.toLocaleString()} ÷
                100) × {cityRateSumCompare.toFixed(4)}
                {" = "}${cityFrozenActualOnFrozenBase.toLocaleString()}
                )
                <br />+ ({assessedNcCompare.toLocaleString()} ÷ 100) ×{" "}
                {cityRateSumCompare.toFixed(4)}
                {" = "}${cityUnfrozenNCInCompare.toLocaleString()}
              </div>
              <div className="text-[11px] text-gray-400">
                frozen base {compareYear} = {baseValue.toLocaleString()} +
                prior-year new construction ={" "}
                {frozenBaseForCompare.toLocaleString()}; new construction in{" "}
                {compareYear}: {(ncCompare ?? 0).toLocaleString()}
              </div>
            </li>

            <li>
              <strong>Non-City Tax:</strong> $
              {nonCityTaxCompare.toLocaleString()}
              <div className="text-xs text-gray-500">
                = (({assessedCompare.toLocaleString()} ÷ 100) ×{" "}
                {nonCityRateSumCompare.toFixed(4)})
              </div>
              <div className="text-[11px] text-gray-400">
                assessed {compareYear} = {compareValue.toLocaleString()} × 0.19
                = {assessedCompare.toLocaleString()}
              </div>
            </li>

            <li className="font-semibold text-red-600">
              <strong>Total (Without Freeze):</strong> $
              {totalCompareActual.toLocaleString()}
              <div className="text-xs text-gray-500">
                = City actual (({assessedCompare.toLocaleString()} ÷ 100) ×{" "}
                {cityRateSumCompare.toFixed(4)}) + Non-City ((
                {assessedCompare.toLocaleString()} ÷ 100) ×{" "}
                {nonCityRateSumCompare.toFixed(4)})
              </div>
            </li>

            <li className="font-semibold">
              <strong>Total (With Freeze):</strong> $
              {totalCompareWithFreeze.toLocaleString()}
              <div className="text-xs text-gray-500">
                = City (frozen logic above) + Non-City ((
                {assessedCompare.toLocaleString()} ÷ 100) ×{" "}
                {nonCityRateSumCompare.toFixed(4)})
              </div>
            </li>

            <li className="font-semibold text-green-600">
              <strong>Credit Amount:</strong> ${creditAmount.toLocaleString()}
            </li>
          </ul>
        </div>
      </div>

      {/* Itemized table */}
      <div>
        <h2 className="text-lg font-semibold mb-3 text-gray-800">
          Itemized Tax Rates & Tax Amounts
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 border text-left">Subdistrict</th>
                <th className="px-3 py-2 border text-left">District</th>
                <th className="px-3 py-2 border text-right">Rate {baseYear}</th>
                <th className="px-3 py-2 border text-right">
                  Rate {compareYear}
                </th>
                <th className="px-3 py-2 border text-right">{baseYear} Tax</th>
                <th className="px-3 py-2 border text-right">
                  {compareYear} Tax
                  <br /> Without Freeze
                </th>
                <th className="px-3 py-2 border text-right">
                  {compareYear} Tax
                  <br /> With Freeze
                </th>
              </tr>
            </thead>
            <tbody>
              {subdistrictKeys.map((key) => {
                const [district, subdistrict] = key.split("__") as [
                  District,
                  string,
                ];

                const rateBase = rateFor(baseYear, subdistrict, district);
                const rateCompare = rateFor(compareYear, subdistrict, district);

                const taxBase = taxFromAppraised(baseValue, rateBase);
                const taxCompareActual = taxFromAppraised(
                  compareValue,
                  rateCompare
                );

                let taxCompareWithFreeze = taxCompareActual;
                if (district === "City") {
                  const frozenBaseRow = frozenBaseForCompare;
                  const ceilingRow = taxFromAppraised(frozenBaseRow, rateBase);
                  const actualOnFrozenRow = taxFromAppraised(
                    frozenBaseRow,
                    rateCompare
                  );
                  const ncRow = taxFromAppraised(ncCompare, rateCompare); // unfrozen in construction year
                  taxCompareWithFreeze =
                    Math.min(ceilingRow, actualOnFrozenRow) + ncRow;
                }

                return (
                  <tr
                    key={key}
                    className={district === "City" ? "bg-blue-50" : ""}
                  >
                    <td className="border px-3 py-1">{subdistrict}</td>
                    <td className="border px-3 py-1">{district}</td>
                    <td className="border px-3 py-1 text-right">
                      {rateBase.toFixed(4)}
                    </td>
                    <td className="border px-3 py-1 text-right">
                      {rateCompare.toFixed(4)}
                    </td>
                    <td className="border px-3 py-1 text-right">
                      ${taxBase.toFixed(2)}
                    </td>
                    <td className="border px-3 py-1 text-right">
                      ${taxCompareActual.toFixed(2)}
                    </td>
                    <td className="border px-3 py-1 text-right">
                      ${taxCompareWithFreeze.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
              <tr className="font-semibold bg-gray-100">
                <td colSpan={2} className="px-3 py-2 border text-right">
                  Totals
                </td>
                <td className="px-3 py-2 border text-right">
                  {(cityRateSumBase + nonCityRateSumBase).toFixed(4)}
                </td>
                <td className="px-3 py-2 border text-right">
                  {(cityRateSumCompare + nonCityRateSumCompare).toFixed(4)}
                </td>
                <td className="px-3 py-2 border text-right">
                  ${(cityTaxBase + nonCityTaxBase).toLocaleString()}
                </td>
                <td className="px-3 py-2 border text-right">
                  {(cityTaxCompareActual + nonCityTaxCompare).toLocaleString(
                    undefined,
                    { style: "currency", currency: "USD" }
                  )}
                </td>
                <td className="px-3 py-2 border text-right">
                  {(
                    cityTaxCompareWithFreeze + nonCityTaxCompare
                  ).toLocaleString(undefined, {
                    style: "currency",
                    currency: "USD",
                  })}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
