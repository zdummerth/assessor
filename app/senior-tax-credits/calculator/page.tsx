"use client";
import React, { useState } from "react";

type TaxRate = {
  subdistrict: string;
  district: "City" | "Non-City";
  rate2024: number;
  rate2025: number;
};

// Tax rates from CSV + 3% estimated increase for 2025
const taxRates: TaxRate[] = [
  {
    subdistrict: "County Purposes – General Revenue",
    district: "City",
    rate2024: 0.3477,
    rate2025: 0.3365,
  },
  {
    subdistrict: "Municipal Purposes General Revenue 1",
    district: "City",
    rate2024: 0.1593,
    rate2025: 0.1546,
  },
  {
    subdistrict: "Municipal Purposes General Revenue 2",
    district: "City",
    rate2024: 0.8347,
    rate2025: 0.8078,
  },
  {
    subdistrict: "Public Health Purposes",
    district: "City",
    rate2024: 0.02,
    rate2025: 0.0194,
  },
  {
    subdistrict: "Hospital Purposes",
    district: "City",
    rate2024: 0.0995,
    rate2025: 0.0963,
  },
  {
    subdistrict: "Recreation Purposes",
    district: "City",
    rate2024: 0.02,
    rate2025: 0.0194,
  },
  {
    subdistrict: "Interest in Public Debt",
    district: "City",
    rate2024: 0.1851,
    rate2025: 0.1108,
  },
  {
    subdistrict: "Children’s Services Fund",
    district: "Non-City",
    rate2024: 0.2443,
    rate2025: 0.2371,
  },
  {
    subdistrict: "Community Mental Health Fund",
    district: "Non-City",
    rate2024: 0.0895,
    rate2025: 0.0869,
  },
  {
    subdistrict: "Junior College",
    district: "Non-City",
    rate2024: 0.2628,
    rate2025: 0.2364,
  },
  {
    subdistrict: "Library",
    district: "Non-City",
    rate2024: 0.5582,
    rate2025: 0.5418,
  },
  {
    subdistrict: "Sewer General Revenue",
    district: "Non-City",
    rate2024: 0.0162,
    rate2025: 0.0145,
  },
  {
    subdistrict: "Sewer General Stormwater",
    district: "Non-City",
    rate2024: 0.0835,
    rate2025: 0.0745,
  },
  {
    subdistrict: "Art Museum",
    district: "Non-City",
    rate2024: 0.0671,
    rate2025: 0.06,
  },
  {
    subdistrict: "Botanical Garden",
    district: "Non-City",
    rate2024: 0.0335,
    rate2025: 0.03,
  },
  {
    subdistrict: "History Museum",
    district: "Non-City",
    rate2024: 0.0335,
    rate2025: 0.03,
  },
  {
    subdistrict: "Museum of Science and Natural History",
    district: "Non-City",
    rate2024: 0.0335,
    rate2025: 0.03,
  },
  {
    subdistrict: "Zoo",
    district: "Non-City",
    rate2024: 0.0671,
    rate2025: 0.06,
  },
  {
    subdistrict: "Public School General Fund",
    district: "Non-City",
    rate2024: 4.375,
    rate2025: 4.2873,
  },
  {
    subdistrict: "Public School Debt Service",
    district: "Non-City",
    rate2024: 0.6211,
    rate2025: 0.6211,
  },
  {
    subdistrict: "Senior Services Fund",
    district: "Non-City",
    rate2024: 0.05,
    rate2025: 0.0485,
  },
  {
    subdistrict: "Developmental Disabilities Fund",
    district: "Non-City",
    rate2024: 0.1392,
    rate2025: 0.1342,
  },
  {
    subdistrict: "Blind Pension Fund",
    district: "Non-City",
    rate2024: 0.03,
    rate2025: 0.03,
  },
];

export default function TaxFreezeCalculator() {
  const [value2024, setValue2024] = useState(50000);
  const [value2025, setValue2025] = useState(55000);

  const cityRates = taxRates.filter((r) => r.district === "City");
  const nonCityRates = taxRates.filter((r) => r.district === "Non-City");

  const sum = (rates: number[]) => rates.reduce((a, b) => a + b, 0);
  const tax = (assessed: number, rate: number) =>
    parseFloat(((assessed / 100) * 0.19 * rate).toFixed(2));

  const cityRateSum2024 = sum(cityRates.map((r) => r.rate2024));
  const cityRateSum2025 = sum(cityRates.map((r) => r.rate2025));
  const nonCityRateSum2024 = sum(nonCityRates.map((r) => r.rate2024));
  const nonCityRateSum2025 = sum(nonCityRates.map((r) => r.rate2025));

  const cityTax2024 = tax(value2024, cityRateSum2024);
  const cityTax2025WithFreeze = cityTax2024;
  const cityTax2025 = tax(value2025, cityRateSum2025);
  const cityTax2025Actual = Math.min(cityTax2025, cityTax2025WithFreeze);
  const nonCityTax2025 = tax(value2025, nonCityRateSum2025);

  const totalTax2024 = cityTax2024 + tax(value2024, nonCityRateSum2024);
  const totalTax2025WithFreeze = cityTax2025WithFreeze + nonCityTax2025;
  const totalTax2025Actual = cityTax2025Actual + nonCityTax2025;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow rounded-lg space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">
        Senior Property Tax Freeze Calculator
      </h1>

      <div className="bg-blue-50 p-4 rounded border text-sm text-gray-700">
        <p>
          <strong>How the freeze works:</strong> If you're a qualifying senior,
          the <strong>City portion</strong> of your property tax is frozen at
          the amount you paid in your first year of eligibility. Even if your
          property's value or City tax rates increase, your City tax will not.
          However, rates from schools and other taxing districts (
          <strong>Non-City</strong>) may still increase.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="text-gray-700">
          Appraised Value (2024)
          <input
            type="number"
            value={value2024}
            onChange={(e) => setValue2024(Number(e.target.value))}
            className="block w-full mt-1 border px-3 py-2 rounded"
          />
        </label>
        <label className="text-gray-700">
          Appraised Value (2025)
          <input
            type="number"
            value={value2025}
            onChange={(e) => setValue2025(Number(e.target.value))}
            className="block w-full mt-1 border px-3 py-2 rounded"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <div className="bg-gray-50 p-4 rounded border">
          <h2 className="text-lg font-semibold mb-2 text-gray-800">
            2024 Taxes
          </h2>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>
              <strong>City Tax:</strong> ${cityTax2024.toFixed(2)}
            </li>
            <li>
              <strong>Non-City Tax:</strong> $
              {tax(value2024, nonCityRateSum2025).toFixed(2)}
            </li>
            <li className="font-semibold mt-1">
              <strong>Total:</strong> ${totalTax2024.toFixed(2)}
            </li>
          </ul>
        </div>

        <div className="bg-gray-50 p-4 rounded border">
          <h2 className="text-lg font-semibold mb-2 text-gray-800">
            2025 Taxes
          </h2>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>
              <strong>City Tax (Frozen):</strong> $
              {cityTax2025WithFreeze.toFixed(2)}
            </li>
            <li>
              <strong>Non-City Tax:</strong> ${nonCityTax2025.toFixed(2)}
            </li>
            <li className="font-semibold">
              <strong>Total (With Freeze):</strong> $
              {totalTax2025WithFreeze.toFixed(2)}
            </li>
            <li className="font-semibold text-red-600">
              <strong>Total (Without Freeze):</strong> $
              {totalTax2025Actual.toFixed(2)}
            </li>
            <li className="font-semibold text-green-600">
              <strong>Credit Amount:</strong> $
              {(totalTax2025Actual - totalTax2025WithFreeze).toFixed(2)}
            </li>
          </ul>
        </div>
      </div>

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
                <th className="px-3 py-2 border text-right">Rate 2024</th>
                <th className="px-3 py-2 border text-right">
                  Rate 2025 (Estimated)
                </th>
                <th className="px-3 py-2 border text-right">2024 Tax</th>
                <th className="px-3 py-2 border text-right">
                  2025 Tax
                  <br />
                  With Freeze
                </th>
                <th className="px-3 py-2 border text-right">
                  2025 Tax
                  <br />
                  Without Freeze
                </th>
              </tr>
            </thead>
            <tbody>
              {taxRates.map((r, idx) => {
                const tax2024 = tax(value2024, r.rate2024);
                const tax2025WithFreeze =
                  r.district === "City" ? tax2024 : tax(value2025, r.rate2025);
                const tax2025Actual = tax(value2025, r.rate2025);

                return (
                  <tr
                    key={idx}
                    className={r.district === "City" ? "bg-blue-50" : ""}
                  >
                    <td className="border px-3 py-1">{r.subdistrict}</td>
                    <td className="border px-3 py-1">{r.district}</td>
                    <td className="border px-3 py-1 text-right">
                      {r.rate2024.toFixed(4)}
                    </td>
                    <td className="border px-3 py-1 text-right">
                      {r.rate2025.toFixed(4)}
                    </td>
                    <td className="border px-3 py-1 text-right">
                      ${tax2024.toFixed(2)}
                    </td>
                    <td className="border px-3 py-1 text-right">
                      ${tax2025WithFreeze.toFixed(2)}
                    </td>
                    <td className="border px-3 py-1 text-right">
                      ${tax2025Actual.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
              <tr className="font-semibold bg-gray-100">
                <td colSpan={2} className="px-3 py-2 border text-right">
                  Totals
                </td>
                <td className="px-3 py-2 border text-right">
                  {(cityRateSum2024 + nonCityRateSum2024).toFixed(4)}
                </td>
                <td className="px-3 py-2 border text-right">
                  {(cityRateSum2025 + nonCityRateSum2025).toFixed(4)}
                </td>
                <td className="px-3 py-2 border text-right">
                  ${totalTax2024.toFixed(2)}
                </td>
                <td className="px-3 py-2 border text-right">
                  ${totalTax2025WithFreeze.toFixed(2)}
                </td>
                <td className="px-3 py-2 border text-right">
                  ${totalTax2025Actual.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
