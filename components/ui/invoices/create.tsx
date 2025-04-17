"use client";
import { create } from "@/app/invoices/actions";
import { useActionState } from "react";

const CreateInvoice = () => {
  const [state, action, pending] = useActionState(create, "");
  return (
    <form action={action}>
      <div className="flex justify-end space-x-2">
        <div>
          <button
            type="submit"
            className="bg-green-500 text-white w-48 py-2 rounded"
            disabled={pending}
          >
            {pending ? "Creating..." : "Create Invoice"}
          </button>
          <div className="h-8">
            {state && <p className="text-red-500 text-sm">{state}</p>}
          </div>
        </div>
      </div>
    </form>
  );
};

export default CreateInvoice;
