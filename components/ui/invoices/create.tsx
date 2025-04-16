"use client";
import { create } from "@/app/invoices/actions";
import { useFormStatus } from "react-dom";

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="bg-green-500 text-white w-48 py-2 rounded"
      disabled={pending}
    >
      {pending ? "Creating..." : "Create Invoice"}
    </button>
  );
};

const CreateInvoice = () => {
  return (
    <form action={create}>
      <div className="flex justify-end space-x-2">
        <SubmitButton />
      </div>
    </form>
  );
};

export default CreateInvoice;
