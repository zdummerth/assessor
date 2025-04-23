"use client";
import { create, createListItem } from "@/app/lists/actions";
import { useActionState, useEffect } from "react";
import { useToast } from "@/components/ui/toast-context";

const initalState = {
  error: "",
  success: "",
};

const CreateList = () => {
  const [state, action, pending] = useActionState(create, initalState);
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
  return (
    <form action={action}>
      <div className="flex justify-end space-x-2">
        <div>
          <button
            type="submit"
            className="bg-green-500 text-white w-48 py-2 rounded"
            disabled={pending}
          >
            {pending ? "Creating..." : "Create List"}
          </button>
        </div>
      </div>
    </form>
  );
};

export const CreateListItem = (props: {
  parcel_number: string;
  year: number;
  listId: number;
}) => {
  const [state, action, pending] = useActionState(createListItem, initalState);
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
  return (
    <form action={action}>
      <input type="hidden" name="parcel_number" value={props.parcel_number} />
      <input type="hidden" name="year" value={props.year} />
      <input type="hidden" name="list_id" value={props.listId} />
      <div className="flex justify-end space-x-2">
        <div>
          <button
            type="submit"
            className="bg-green-500 text-white w-24 py-2 rounded"
            disabled={pending}
          >
            {pending ? "Adding..." : "Add to list"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CreateList;
