"use client";
import { togglePaid } from "@/app/invoices/actions";
import { useFormState, useFormStatus } from "react-dom";

const Button = ({ paid }: { paid: boolean }) => {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="bg-green-500 text-white w-48 py-2 rounded"
      disabled={pending}
    >
      {pending ? (
        <span className="text-gray-500">Loading...</span>
      ) : (
        <span className="text-gray-500">
          {paid ? "Mark as Unpaid" : "Mark as Paid"}
        </span>
      )}
    </button>
  );
};

const TogglePaid = ({ id, paid }: { id: string; paid: boolean }) => {
  //@ts-ignore
  const [state, action] = useFormState(togglePaid, false);
  console.log("state", state);
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="paid" value={paid ? "true" : "false"} />
      <Button paid={paid} />
      <div className="h-6">
        {state.error && (
          <p className="text-red-500 text-sm">{state.error.message}</p>
        )}
      </div>
    </form>
  );
};

export default TogglePaid;
