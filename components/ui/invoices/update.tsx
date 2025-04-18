"use client";
import { useActionState, useState } from "react";
import { update, updateLineItem } from "@/app/invoices/actions";
import { Tables } from "@/database-types";

const initalState = {
  error: null,
  success: false,
  message: "",
};

const Update = ({ item }: { item: Tables<"invoices"> }) => {
  const [state, action, pending] = useActionState(update, initalState);
  const [formState, setFormState] = useState({
    customer_name: item.customer_name || "",
  });

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
      {/* <div className="h-6">
        {state.error && <p className="text-red-500 text-sm">{state.message}</p>}
      </div> */}
    </form>
  );
};

export const UpdateLineItem = (props: {
  id: string;
  item: Tables<"invoice_line_item">;
}) => {
  const [state, action, pending] = useActionState(updateLineItem, initalState);
  const [formState, setFormState] = useState({
    description: props.item.description || "",
    qty: props.item.qty || "0",
    unit: props.item.unit || "",
    amount: props.item.amount || "0.00",
  });

  const edited =
    props.item.description !== formState.description ||
    props.item.qty !== formState.qty ||
    props.item.unit !== formState.unit ||
    props.item.amount !== formState.amount;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "qty" || e.target.name === "amount") {
      //return early if value is not a number
      console.log(e.target.value);
      if (isNaN(Number(e.target.value))) return;
    }
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <form action={action} className="w-full flex items-end gap-2">
      <input type="hidden" name="id" value={props.id} />
      <input type="hidden" name="line_item_id" value={props.item.id} />
      <div className="flex-1">
        <label
          className="text-sm font-semibold mb-1 block"
          htmlFor="description"
        >
          Description
        </label>
        <input
          type="text"
          name="description"
          value={formState.description}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
      </div>
      <div>
        <label className="text-sm font-semibold mb-1 block" htmlFor="qty">
          Qty
        </label>
        <input
          type="text"
          name="qty"
          value={formState.qty}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
      </div>
      <div>
        <label className="text-sm font-semibold mb-1 block" htmlFor="unit">
          Unit
        </label>
        <input
          type="text"
          name="unit"
          value={formState.unit}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
      </div>
      <div>
        <label className="text-sm font-semibold mb-1 block" htmlFor="amount">
          Amount
        </label>
        <input
          type="text"
          name="amount"
          value={formState.amount}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
      </div>
      <button
        disabled={pending || !edited}
        type="submit"
        className="bg-green-400 w-24 py-2 rounded disabled:opacity-25"
      >
        {pending ? <span className="">Loading...</span> : <>Save</>}
      </button>
    </form>
  );
};

export default Update;
