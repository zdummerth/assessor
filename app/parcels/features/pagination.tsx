// components/parcel-features/PaginationToolbar.tsx
"use client";

export default function PaginationToolbar(props: {
  page: number;
  setPage: (n: number) => void;
  pageSize: number;
  setPageSize: (n: number) => void;
  total?: number;
  hasMore?: boolean;
  isLoading?: boolean;
  dataLen: number;
}) {
  const totalPages =
    props.total && props.pageSize
      ? Math.max(1, Math.ceil(props.total / props.pageSize))
      : undefined;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-white px-3 py-2">
      <div className="flex items-center gap-2">
        <button
          onClick={() => props.setPage(Math.max(1, props.page - 1))}
          disabled={props.page <= 1 || props.isLoading}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-sm">
          Page{" "}
          <input
            type="number"
            min={1}
            value={props.page}
            onChange={(e) =>
              props.setPage(Math.max(1, Number(e.target.value) || 1))
            }
            className="w-16 border rounded px-2 py-1 text-sm"
            disabled={props.isLoading}
          />{" "}
          {totalPages != null ? <span>of {totalPages}</span> : null}
        </span>
        <button
          onClick={() => props.setPage(props.page + 1)}
          disabled={
            props.isLoading ||
            props.hasMore === false ||
            props.dataLen < props.pageSize
          }
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm">Rows per page</label>
        <select
          value={props.pageSize}
          onChange={(e) => props.setPageSize(Number(e.target.value))}
          className="border rounded px-2 py-1 text-sm"
          disabled={props.isLoading}
        >
          {[10, 25, 50, 100, 250].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        {props.total != null && (
          <span className="text-sm text-gray-600">
            Total: {props.total.toLocaleString()}
          </span>
        )}
      </div>
    </div>
  );
}
