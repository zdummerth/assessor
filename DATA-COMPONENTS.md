# Data Fetching Components Pattern

The UI generator now creates three types of data components for each table and function:

## Component Types

### 1. Server Data Component (`data/*-server.tsx`)

Fetches data directly from the database on the server.

**Features:**

- Direct database access via Supabase
- No API route needed
- Filters passed as props
- Ideal for initial page loads and SEO
- Faster for first-time data loading

**Example:**

```tsx
import { DevnetReviewsServer } from "./data/devnet-reviews-server";

export default function Page() {
  return (
    <DevnetReviewsServer
      filters={{
        kind: "sale_review",
        data_status: "collected",
      }}
      limit={25}
      offset={0}
    />
  );
}
```

### 2. Client Data Component (`data/*-client.tsx`)

Fetches data from the API route using the SWR hook.

**Features:**

- Uses SWR for data fetching
- Automatic caching and revalidation
- Real-time updates
- Loading and error states
- Ideal for interactive, dynamic data
- Supports client-side filtering

**Example:**

```tsx
"use client";

import { DevnetReviewsClient } from "./data/devnet-reviews-client";
import { useState } from "react";

export default function Page() {
  const [kind, setKind] = useState("sale_review");

  return <DevnetReviewsClient filters={{ kind }} limit={25} offset={0} />;
}
```

### 3. Presentation Component (`*-presentation.tsx`)

Shared presentation component used by both server and client data components.

**Features:**

- Pure presentation logic
- Handles loading state (for client components)
- Handles error state
- Handles empty state
- Displays data in a table format

**Props:**

```tsx
interface PresentationProps {
  data: Array<T>;
  error?: string;
  isLoading?: boolean;
}
```

## Generated File Structure

```
app/
  devnet-reviews/
    types.ts                           # Type definitions
    actions.ts                         # Server actions (CRUD)
    page.tsx                           # Main page (uses server component)
    loading.tsx                        # Loading state
    filters.tsx                        # Filter component
    api/
      route.ts                         # API route for client fetching
    [id]/
      page.tsx                         # Detail page
    data/
      devnet-reviews-server.tsx        # ✨ Server data component
      devnet-reviews-client.tsx        # ✨ Client data component (SWR)
    devnet-reviews-presentation.tsx    # ✨ Shared presentation
```

## When to Use Each Pattern

### Use Server Component When:

- Initial page load
- Data doesn't change frequently
- SEO is important
- You want the fastest first paint
- Static or semi-static content

### Use Client Component When:

- Interactive filtering/sorting
- Real-time data updates needed
- User can change filters dynamically
- Need automatic refetching
- Building a dashboard or live view

### Mix Both:

You can use server components for the initial load, then switch to client components for updates:

```tsx
import { DevnetReviewsServer } from "./data/devnet-reviews-server";
import { DevnetReviewsClient } from "./data/devnet-reviews-client";

export default function Page({ searchParams }) {
  const useClient = searchParams.interactive === "true";

  if (useClient) {
    return <DevnetReviewsClient filters={{}} />;
  }

  return <DevnetReviewsServer filters={{}} />;
}
```

## Filter Props

Both server and client components accept the same filter interface:

```tsx
interface FiltersProps {
  filters?: {
    // All string/enum columns from the table
    field_name?: string;
    another_field?: string;
  };
  limit?: number; // Default: 25
  offset?: number; // Default: 0
}
```

## SWR Features (Client Component)

The client component uses SWR which provides:

1. **Automatic Revalidation**: Refetches data on focus, reconnect, interval
2. **Caching**: Shared cache across components
3. **Deduplication**: Multiple components requesting same data = one request
4. **Optimistic Updates**: Update UI before server response
5. **Error Retry**: Automatic retry on failure

```tsx
// SWR automatically handles:
const { data, error, isLoading } = useSWR(
  `/api/devnet-reviews?kind=sale_review`,
  fetcher
);
```

## Customizing the Presentation Component

The presentation component can be replaced with your own custom component:

```tsx
// Custom presentation
import { MyCustomTable } from "./my-custom-table";

export function DevnetReviewsClient({ filters, limit, offset }) {
  const { data, error, isLoading } = useSWR(...);

  // Use your own presentation instead
  return (
    <MyCustomTable
      data={data}
      error={error}
      isLoading={isLoading}
    />
  );
}
```

## Functions Returning Tables

The same pattern applies to database functions that return tables:

```
app/
  search-parcels/
    data/
      search-parcels-server.tsx        # Calls RPC directly
      search-parcels-client.tsx        # Calls API that calls RPC
    search-parcels-presentation.tsx    # Displays results
```

**Server Function Component:**

```tsx
const { data, error } = await supabase.rpc("search_parcels", {
  p_query: params?.query,
  p_limit: limit,
});
```

**Client Function Component:**

```tsx
const { data, error, isLoading } = useSWR(
  `/api/search-parcels?query=${params.query}`,
  fetcher
);
```

## Generation

Generate data components with:

```bash
# Generate for specific table
node scripts/generate-ui-from-types.js --tables=devnet_reviews --force

# Generate for all tables
node scripts/generate-ui-from-types.js --force

# Generate for function
node scripts/generate-ui-from-types.js --functions=search_parcels --force

# Dry run to preview
node scripts/generate-ui-from-types.js --tables=devnet_reviews --dry-run
```

## Benefits

1. **Flexible Architecture**: Choose server or client rendering per use case
2. **DRY Principle**: Presentation logic defined once, used twice
3. **Performance**: Server components for speed, client for interactivity
4. **Type Safety**: Full TypeScript support throughout
5. **Consistent Patterns**: Same API for tables and functions
6. **Modern React**: Leverages Server Components and SWR best practices
7. **Easy Testing**: Presentation component can be tested independently

## Example: Dashboard with Mixed Patterns

```tsx
// Dashboard combining both patterns
export default async function DashboardPage() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Static monthly stats - Server Component */}
      <Card>
        <CardHeader>Monthly Stats</CardHeader>
        <DevnetReviewsServer
          filters={{ data_status: "completed" }}
          limit={10}
        />
      </Card>

      {/* Live updates - Client Component */}
      <Card>
        <CardHeader>Live Reviews</CardHeader>
        <DevnetReviewsClientWrapper />
      </Card>
    </div>
  );
}

// Separate client wrapper to avoid marking parent as client
("use client");
function DevnetReviewsClientWrapper() {
  return (
    <DevnetReviewsClient filters={{ data_status: "in_field" }} limit={10} />
  );
}
```

## Notes

- Server components cannot use hooks (useState, useEffect, etc.)
- Client components require `"use client"` directive
- SWR is only used in client components
- Both patterns use the same Supabase backend
- Presentation component handles all three states: loading, error, success
- Filter types are automatically generated from table schema
