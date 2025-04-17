"use client";
import { useActionState, useState } from "react";
import { togglePaid, testAction } from "@/app/invoices/actions";

const initalState = {
  error: null,
  success: false,
  message: "",
};

const TogglePaid = ({ id, paid }: { id: string; paid: boolean }) => {
  const [state, action, pending] = useActionState(togglePaid, initalState);
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="paid" value={paid ? "true" : "false"} />
      <button
        disabled={pending}
        type="submit"
        className="bg-green-200 w-48 py-2 rounded"
      >
        {pending ? (
          <span className="">Loading...</span>
        ) : (
          <>{paid ? <span></span> : "Mark as Paid"}</>
        )}
      </button>
      <div className="h-6">
        {state.error && <p className="text-red-500 text-sm">{state.message}</p>}
      </div>
    </form>
  );
};

export const TestPaid = () => {
  const [state, action, pending] = useActionState(testAction, initalState);
  const [name, setName] = useState("");

  return (
    <form action={action}>
      <input
        type="text"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 rounded mb-2 w-full"
      />
      <button
        disabled={pending}
        type="submit"
        className="bg-green-200 w-48 py-2 rounded"
      >
        {pending ? <span className="">Loading...</span> : <span>save</span>}
      </button>
      <div className="h-6">
        <p className="text-red-500 text-sm">{state.message}</p>
      </div>
    </form>
  );
};

export default TogglePaid;
