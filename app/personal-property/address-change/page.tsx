// app/account-update-form/page.tsx
import Image from "next/image";

type FieldProps = {
  label: string;
  className?: string;
  lineHeight?: number; // height in pixels for the line area
};

function Field({ label, className = "", lineHeight = 36 }: FieldProps) {
  return (
    <div className={className}>
      <div
        className="border-b-[1px] border-black"
        style={{ height: `${lineHeight}px` }}
      />
      <div className="mt-1 text-xs tracking-wide text-gray-700">{label}</div>
    </div>
  );
}

export default function AccountUpdateFormPage() {
  return (
    <main className="min-h-screen bg-gray-100 print:bg-white">
      <div className="mx-auto my-8 max-w-[8.5in] bg-white p-8 shadow print:m-0 print:w-[8.5in] print:max-w-none print:py-6 print:px-12 print:shadow-none">
        {/* Header / Logo */}
        <div className="mb-4 flex items-center justify-center">
          <Image
            src="/stl-city-seal.png" // place your logo file in /public
            alt="Organization Logo"
            width={75}
            height={75}
            priority
          />
        </div>

        {/* Title */}
        <h1 className="mb-4 text-center text-xl font-semibold tracking-wide">
          Personal Property Account Information Update Form
        </h1>

        {/* Top fields */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-5">
            <Field label="Account Number" />
            <Field label="Phone Number" />
          </div>
          <div className="grid grid-cols-2 gap-5">
            <Field label="Previous Name" />
            <Field label="Updated Name" />
          </div>
        </div>

        {/* Current Address */}
        <section className="mt-6">
          <div className="grid grid-cols-1 gap-5">
            <Field label="Previous City Address" />
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <Field label="City" />
              <Field label="State" />
              <Field label="Zip Code" />
            </div>
          </div>
        </section>

        {/* Updated Address */}
        <section className="mt-6">
          <div className="grid grid-cols-1 gap-5">
            <Field label="Updated Address" />
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <Field label="City" />
              <Field label="State" />
              <Field label="Zip Code" />
            </div>
          </div>
        </section>

        {/* Effective Date */}
        <section className="mt-6">
          <Field label="Effective Date of Relocation" />
        </section>

        {/* Signature Block */}
        <section className="mt-8">
          <div className="grid grid-cols-2 gap-6">
            <Field label="Signature" />
            <Field label="Date" />
          </div>
        </section>

        {/* Footer Note (optional; remove if not needed) */}
        <p className="mt-8 text-center text-[11px] text-gray-600 print:text-black">
          This form can be faxed to the Personal Property Department at
          314-622-4695, emailed to assessor-personalproperty@stlouis-mo.gov, or
          mailed to the Office of the Assessor, 1200 Market St, Room 115, St.
          Louis, MO 63103.
        </p>
      </div>
    </main>
  );
}
