"use client";
import { useActionState, useState } from "react";
import { update } from "@/app/invoices/actions";
import { Tables } from "@/database-types";

let invoice: Tables<"invoices">;

const initalState = {
  error: null,
  success: false,
  message: "",
};

const Update = ({ item }: { item: typeof invoice }) => {
  const [state, action, pending] = useActionState(update, initalState);
  const [formState, setFormState] = useState({
    customer_name: item.customer_name || "",
  });

  const edited = item.customer_name !== formState.customer_name;
  return (
    <form action={action}>
      <input type="hidden" name="id" value={item.id} />
      <label
        className="text-sm font-semibold mb-1 block"
        htmlFor="customer_name"
      >
        Customer Name
      </label>
      <input
        type="text"
        name="customer_name"
        value={formState.customer_name}
        onChange={(e) =>
          setFormState({ ...formState, customer_name: e.target.value })
        }
        className="border p-2 rounded mb-2 w-full"
      />
      <button
        disabled={pending || !edited}
        type="submit"
        className="bg-green-400 w-48 py-2 rounded disabled:opacity-25"
      >
        {pending ? <span className="">Loading...</span> : <>Save</>}
      </button>
      <div className="h-6">
        {state.error && <p className="text-red-500 text-sm">{state.message}</p>}
      </div>
    </form>
  );
};

export default Update;
