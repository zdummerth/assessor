// Example API route for ComboboxMultiLookup
// app/api/example-lookup/route.ts

import { NextRequest, NextResponse } from "next/server";

// Example data structure
const mockEmployees = [
  { id: "1", name: "John Smith", role: "appraiser", status: "active" },
  { id: "2", name: "Jane Doe", role: "appraiser", status: "active" },
  { id: "3", name: "Bob Johnson", role: "clerk", status: "active" },
  { id: "4", name: "Alice Williams", role: "admin", status: "active" },
  { id: "5", name: "Charlie Brown", role: "appraiser", status: "inactive" },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const role = searchParams.get("role");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    // Filter based on query params
    let filtered = mockEmployees;

    if (role) {
      filtered = filtered.filter((emp) => emp.role === role);
    }

    if (status) {
      filtered = filtered.filter((emp) => emp.status === status);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter((emp) =>
        emp.name.toLowerCase().includes(searchLower)
      );
    }

    // Transform to ComboOption format
    // The component expects objects with 'value' and 'label' keys by default
    const options = filtered.map((emp) => ({
      value: emp.id,
      label: emp.name,
      // You can include additional data that won't be used by the combobox
      // but might be useful if you access the raw data
      role: emp.role,
      status: emp.status,
    }));

    return NextResponse.json(options);
  } catch (error) {
    console.error("Lookup API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
