"use client";
import { deleteInvoice, deleteLineItem } from "@/app/invoices/actions";
import { useActionState } from "react";

const DeleteInvoice = () => {
  const [state, action, pending] = useActionState(deleteInvoice, "");
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

export const DeleteLineItem = (props: { id: string }) => {
  const [state, action, pending] = useActionState(deleteLineItem, "");
  return (
    <form action={action}>
      <input type="hidden" name="id" value={props.id} />
      <button
        type="submit"
        className="bg-red-500 text-white w-24 py-2 rounded"
        disabled={pending}
      >
        {pending ? "Deleting..." : "Delete"}
      </button>
    </form>
  );
};

export default DeleteInvoice;
