"use client";
import { useActionState, useState, useEffect } from "react";
import { update } from "@/app/lists/actions";
import { useToast } from "@/components/ui/toast-context";
import { Tables } from "@/database-types";

const initalState = {
  error: "",
  success: "",
};

const Update = ({ item }: { item: Tables<"invoices"> }) => {
  const [state, action, pending] = useActionState(update, initalState);
  const [formState, setFormState] = useState({
    customer_name: item.customer_name || "",
  });
  const { showToast } = useToast();

  useEffect(() => {
    if (state.error) {
      showToast({
        message: state.error,
        type: "error",
        timeOpen: 10000,
      });
    }
    if (state.success) {
      showToast({
        message: state.success,
        type: "success",
        timeOpen: 2000,
      });
    }
  }, [state, showToast]);

  const edited = item.customer_name !== formState.customer_name;
  return (
    <form action={action} className="w-full flex gap-2 items-end">
      <input type="hidden" name="id" value={item.id} />
      <div className="flex-1">
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
          className="border p-2 rounded w-full"
        />
      </div>
      <button
        disabled={pending || !edited}
        type="submit"
        className="bg-green-400 w-48 py-2 rounded disabled:opacity-25"
      >
        {pending ? <span className="">Loading...</span> : <>Save</>}
      </button>
    </form>
  );
};

export default Update;
