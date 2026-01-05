# Function UI Generation

The SQL Schema UI Generator now supports generating UIs for database functions in addition to tables!

## Overview

When you have database functions (stored procedures) in your PostgreSQL schema, the generator can now create a complete UI for executing those functions with parameter input forms and result displays.

**Key Features:**

- **Query vs Mutation Detection**: Automatically detects if a function returns a TABLE (query) or performs an operation (mutation)
- **Automatic Pagination**: Query functions that return tables get full pagination support
- **Smart UI Generation**: Queries show "Search" buttons and paginated results; mutations show "Execute" buttons with success/error messages

## Usage

```bash
# Generate UI for a specific function
node scripts/generate-ui-from-schema.js database/schemas/devnet-schema.sql --functions=search_devnet_reviews

# Generate multiple functions
node scripts/generate-ui-from-schema.js database/schemas/devnet-schema.sql --functions=search_reviews,calculate_values

# Generate all tables and specific functions
node scripts/generate-ui-from-schema.js database/schemas/devnet-schema.sql --functions=search_devnet_reviews
```

## Function Classification

The generator automatically classifies functions as either **queries** or **mutations**:

### Query Functions (Get Paginated UI)

- Functions that return `TABLE` or `SETOF`
- Functions starting with `search_`, `get_`, `list_`
- Display: Parameter form + paginated results table

### Mutation Functions (Get Action UI)

- Functions returning `void`, `boolean`, `bigint`, etc.
- Functions starting with `create_`, `update_`, `delete_`, `mass_`, `set_`, `mark_`, `assign_`, `transition_`
- Display: Parameter form + execute button + success/error message

## What Gets Generated for Functions

For each function, the generator creates a folder at `app/[function-name]/` with:

### Core Files

- **`page.tsx`** - Main page with the function execution interface
- **`loading.tsx`** - Loading skeleton
- **`types.ts`** - TypeScript interfaces for parameters and results
- **`actions.ts`** - Server actions to execute the function via `supabase.rpc()` with pagination support
- **`index.ts`** - Barrel exports

### Components

- **`parameters-form.tsx`** - Form to input function parameters

  - Automatically generates appropriate input fields based on parameter types
  - Handles JSONB parameters with textarea
  - Boolean parameters get checkboxes
  - Number parameters get number inputs
  - **Query functions**: Includes pagination controls (Previous/Next, page indicators)
  - **Mutation functions**: Shows success/error message after execution
  - Displays results in the same component

- **`results-table.tsx`** - Table component to display function results
  - Dynamically renders columns based on result structure
  - Handles nested JSON objects
  - Responsive table layout

### API Route- **`api/route.ts`** - POST endpoint to execute the function

- Accepts JSON parameters
- Calls `supabase.rpc()` with the function name
- Returns results or error messages

## Example: search_devnet_reviews

The `search_devnet_reviews` function accepts a JSONB `p_filters` parameter and returns a table of review records.

### Generated Files

```
app/search-devnet-reviews/
├── page.tsx                # Main page
├── loading.tsx             # Loading state
├── types.ts                # SearchDevnetReviewsParams & SearchDevnetReviewsResult
├── actions.ts              # executeSearchDevnetReviews()
├── parameters-form.tsx     # JSONB textarea for filters
├── results-table.tsx       # Dynamic table for results
├── index.ts                # Exports
└── api/
    └── route.ts            # POST endpoint
```

### Usage in UI

1. Navigate to `/search-devnet-reviews`
2. Enter JSONB filters in the textarea (e.g., `{"status": "pending"}`)
3. Click "Search" (not "Execute" since it's a query function)
4. Results appear in a paginated table below the form
5. Use Previous/Next buttons to navigate through pages of results

### Pagination Support

Since `search_devnet_reviews` returns a TABLE, the generator automatically adds:

- **Page state management**: Tracks current page and page size (default 25)
- **Pagination parameters**: Automatically added to the `p_filters` JSONB as `page` and `page_size`
- **Navigation controls**: Previous/Next buttons with disabled states
- **Result counter**: "Showing X to Y of Z results"
- **Form state persistence**: Remembers filter values when changing pages

### Code Example

The generated action:

```typescript
export async function executeSearchDevnetReviews(
  prevState: { error: string; success: string },
  formData: FormData
): Promise<{
  error: string;
  success: string;
  data?: SearchDevnetReviewsResult[];
}> {
  const supabase = await createClient();

  const params: SearchDevnetReviewsParams = {
    p_filters: formData.get("p_filters")
      ? JSON.parse(formData.get("p_filters")!.toString())
      : {},
  };

  const { data, error } = await supabase.rpc("search_devnet_reviews", params);

  if (error) {
    return { error: error.message, success: "" };
  }

  return { error: "", success: "Function executed successfully", data };
}
```

## Parameter Type Handling

The generator automatically creates appropriate form inputs based on parameter types:

| Parameter Type                 | Input Type   | Handling            |
| ------------------------------ | ------------ | ------------------- |
| `text`, `varchar`              | Text input   | Direct string value |
| `integer`, `bigint`, `numeric` | Number input | Parsed to number    |
| `boolean`                      | Checkbox     | Checked = true      |
| `jsonb`, `json`                | Textarea     | JSON.parse()        |
| `date`, `timestamp`            | Date input   | ISO string          |
| Arrays (`text[]`)              | Text input   | Split by comma      |

## Limitations & Customization

### Current Limitations

1. **Generic Result Type**: The generated `Result` interface uses `[key: string]: any` because function return types vary. You may want to create a more specific interface based on your function's actual return type.

2. **JSONB Parameters**: Functions that accept JSONB require users to enter valid JSON. Consider adding validation or a JSON editor component.

3. **Complex Parameters**: Functions with many parameters will generate long forms. Consider grouping related parameters.

### Customization Tips

1. **Update Result Types**: Edit `types.ts` to replace the generic result interface with your specific return type:

   ```typescript
   export interface SearchDevnetReviewsResult {
     id: number;
     title: string;
     status: string;
     // ... other fields
   }
   ```

2. **Enhanced JSONB Input**: Replace the textarea with a JSON editor component for better UX.

3. **Add Validation**: Add client-side or server-side validation for parameters.

4. **Custom Results Display**: Modify `results-table.tsx` to format specific columns (dates, currency, etc.).

## CLI Options

- `--functions=func1,func2` - Generate UI for specific functions only
- `--force` - Overwrite existing files
- `--dry-run` - Preview without creating files
- `--skip=components,api` - Skip specific file types

## Notes

- Functions are detected by parsing `CREATE OR REPLACE FUNCTION` statements in the schema
- The generator extracts parameter names, types, and nullability
- Server actions use `supabase.rpc()` to call the function
- Results are displayed dynamically based on the actual return data structure
