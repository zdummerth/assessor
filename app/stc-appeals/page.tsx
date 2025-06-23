export default function StipProcessPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">
        Appeal Stipulation & Dismissal Process
      </h1>

      <section>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          General Notes
        </h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>
            Zach maintains a shared Google Sheet for tracking appeals received
            from the STC.
          </li>
          <li>
            There is a separate sheet for each appeal year. Contact Zach if you
            don’t have access.
          </li>
          <li>
            You may also view appeals directly on the STC website for
            verification.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          Stipulation Process
        </h2>
        <p className="text-gray-700 mb-4">
          Managers are responsible for tracking appeals in their sections. When
          a stipulation is reached:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>
            The Appraiser, Supervisor, or Manager provides Zach with the correct
            stipulation figures.
          </li>
          <li>Zach prepares the stip and sends it back for review.</li>
          <li>
            Once confirmed accurate, the Manager forwards it to the City
            Counselor and copies{" "}
            <code className="bg-gray-100 px-1 rounded">
              slcasr-lgl@stlouis-mo.gov
            </code>
            .
          </li>
          <li>Residential & Personal Property: Nicholas Morrow</li>
          <li>Commercial: Nancy Walsh</li>
          <li>
            The City Counselor sends the stip to the taxpayer/attorney for
            signature.
          </li>
          <li>They then submit the signed stip to the STC.</li>
          <li>
            The STC issues Orders (approx. every two weeks) confirming completed
            stipulations.
          </li>
          <li>
            Orders go to{" "}
            <code className="bg-gray-100 px-1 rounded">
              slcasr-lgl@stlouis-mo.gov
            </code>
            , and Zach updates the Google Sheet.
          </li>
          <li>If in doubt, check with Zach or the STC directly.</li>
        </ol>
        <p className="text-sm text-gray-500 mt-2">
          Note: The STC usually meets twice per month to approve stipulations
          and dismissals.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          Dismissal Process
        </h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>
            Taxpayers must submit a dismissal form if they wish to withdraw
            their appeal.
          </li>
          <li>Zach can prepare these dismissal forms upon request.</li>
          <li>
            Dismissals are approved by the STC in the same way as stipulations
            and are included in the biweekly Orders.
          </li>
        </ul>
      </section>
    </div>
  );
}
