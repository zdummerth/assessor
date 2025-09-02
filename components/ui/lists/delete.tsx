"use client";
import { deleteList, deleteListItem } from "@/app/lists/actions";
import { useActionState } from "react";

const DeleteInvoice = () => {
  const [state, action, pending] = useActionState(deleteList, "");
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

export const DeleteListItem = (props: {
  list_id: string;
  year: string;
  parcel: string;
}) => {
  const [state, action, pending] = useActionState(deleteListItem, "");
  return (
    <form action={action}>
      <input type="hidden" name="list_id" value={props.list_id} />
      <input type="hidden" name="year" value={props.year} />
      <input type="hidden" name="parcel_number" value={props.parcel} />
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
