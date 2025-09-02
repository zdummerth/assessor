"use client";
import { deleteFileAction } from "@/app/actions";
import { useActionState, useEffect } from "react";
import { useToast } from "@/context/ToastContext";
const initalState = {
  error: "",
  success: "",
};

const DeleteFile = ({ bucket, path }: { bucket: string; path: string }) => {
  const [state, action, pending] = useActionState(
    deleteFileAction,
    initalState
  );
  const { toast } = useToast();

  useEffect(() => {
    if (state.error) {
      toast({ description: state.error, variant: "error", duration: 10000 });
    }
    if (state.success) {
      toast({ description: state.success, variant: "success", duration: 5000 });
    }
  }, [state, toast]);

  return (
    <form action={action}>
      <div className="flex justify-end space-x-2">
        <div>
          <input type="hidden" name="bucket" value={bucket} />
          <input type="hidden" name="path" value={path} />
          <button
            type="submit"
            className="bg-red-500 text-white w-48 py-2 rounded"
            disabled={pending}
          >
            {pending ? "Deleting..." : "Delete File"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default DeleteFile;
