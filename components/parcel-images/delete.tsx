"use client";
import { deleteParcelImagesAction } from "@/app/actions";
import { useActionState, useEffect } from "react";

const initalState = {
  error: "",
  success: "",
};

const DeleteParcelImage = ({
  bucket,
  path,
}: {
  bucket: string;
  path: string;
}) => {
  const [state, action, pending] = useActionState(
    deleteParcelImagesAction,
    initalState
  );

  return (
    <form action={action}>
      <div className="flex justify-end space-x-2">
        <div>
          <input type="hidden" name="bucket" value={bucket} />
          <input type="hidden" name="paths" value={path} />
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

export default DeleteParcelImage;
