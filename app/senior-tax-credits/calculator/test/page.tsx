"use client";
import React, { useMemo, useState } from "react";

type District = "City" | "Non-City";

type TaxRate = {
  subdistrict: string;
  district: District;
  year: number;
  rate: number;
};

// Flattened rates by year
const taxRates: TaxRate[] = [
  // --- City (2024)
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

// util
const uniq = <T,>(arr: T[]) => Array.from(new Set(arr));
const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

// Your original formula (assumes appraised value input)
const taxFromAppraised = (appraised: number, rate: number) =>
  parseFloat(((appraised / 100) * 0.19 * rate).toFixed(2));

export default function TaxFreezeCalculator() {
  // Choose two years to compare
  const availableYears = useMemo(
    () => uniq(taxRates.map((r) => r.year)).sort(),
    []
  );
  const [baseYear, setBaseYear] = useState<number>(2024);
  const [compareYear, setCompareYear] = useState<number>(2025);

  // Appraised values for each selected year
  const [baseValue, setBaseValue] = useState<number>(50000);
  const [compareValue, setCompareValue] = useState<number>(55000);

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

  // Sums for totals
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

  // Totals (and freeze logic: City is frozen to min(base-year city tax, compare-year city tax))
  const cityTaxBase = taxFromAppraised(baseValue, cityRateSumBase);
  const cityTaxCompareActual = taxFromAppraised(
    compareValue,
    cityRateSumCompare
  );
  const cityTaxCompareWithFreeze = Math.min(cityTaxBase, cityTaxCompareActual);

  const nonCityTaxBase = taxFromAppraised(baseValue, nonCityRateSumBase);
  const nonCityTaxCompare = taxFromAppraised(
    compareValue,
    nonCityRateSumCompare
  );

  const totalBase = cityTaxBase + nonCityTaxBase;
  const totalCompareActual = cityTaxCompareActual + nonCityTaxCompare;
  const totalCompareWithFreeze = cityTaxCompareWithFreeze + nonCityTaxCompare;

  const creditAmount = totalCompareActual - totalCompareWithFreeze;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow rounded-lg space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">
        Senior Property Tax Freeze Calculator
      </h1>

      <div className="bg-blue-50 p-4 rounded border text-sm text-gray-700">
        <p>
          <strong>How the freeze works:</strong> If you're a qualifying senior,
          the <strong>City portion</strong> of your property tax is frozen at
          the amount you paid in your eligibility base year. Change the two
          years below to compare and see how the freeze affects totals.
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

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <div className="bg-gray-50 p-4 rounded border">
          <h2 className="text-lg font-semibold mb-2 text-gray-800">
            {baseYear} Taxes (Base)
          </h2>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>
              <strong>City Tax:</strong> ${cityTaxBase.toLocaleString()}
            </li>
            <li>
              <strong>Non-City Tax:</strong> ${nonCityTaxBase.toLocaleString()}
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
          <ul className="text-sm text-gray-700 space-y-1">
            <li>
              <strong>City Tax (Frozen):</strong> $
              {cityTaxCompareWithFreeze.toLocaleString()}
            </li>
            <li>
              <strong>Non-City Tax:</strong> $
              {nonCityTaxCompare.toLocaleString()}
            </li>
            <li className="font-semibold text-red-600">
              <strong>Total (Without Freeze):</strong> $
              {totalCompareActual.toLocaleString()}
            </li>
            <li className="font-semibold">
              <strong>Total (With Freeze):</strong> $
              {totalCompareWithFreeze.toLocaleString()}
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
                const taxCompareWithFreeze =
                  district === "City"
                    ? Math.min(taxBase, taxCompareActual)
                    : taxCompareActual;

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
                  {totalCompareActual.toLocaleString(undefined, {
                    style: "currency",
                    currency: "USD",
                  })}
                </td>
                <td className="px-3 py-2 border text-right">
                  {totalCompareWithFreeze.toLocaleString(undefined, {
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
