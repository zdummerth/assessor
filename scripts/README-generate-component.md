# Component Generator

Generate complete Next.js server component architecture from database function types.

## Usage

```bash
npm run gen:component -- --function <function_name> [--path <relative_path>]
# or
npm run gen:component -- -f <function_name> [-p <relative_path>]
```

## Arguments

- `--function` / `-f`: Name of the database function (required)
- `--path` / `-p`: Custom path relative to `app/` directory (optional, defaults to function name with dashes)

## Examples

```bash
# Generate components for search_vehicle_values function
npm run gen:component -- -f search_vehicle_values

# Generate components with custom path
npm run gen:component -- -f search_vehicle_values -p vehicle-search

# Generate components for approve_value_calculation_v2
npm run gen:component -- -f approve_value_calculation_v2 -p approvals
```

## Generated Files

The script creates a complete folder structure with:

### 1. `page.tsx` (Server Component)

- Main page component with async searchParams
- Extracts and converts URL parameters
- Wraps table in Suspense boundary
- Passes data to child components

### 2. `{function_name}-search.tsx` (Client Component)

- Filter/search form based on function arguments
- Local state management with URL sync
- "Apply Filters" button with loading state
- Reset button to clear all filters
- Input types based on parameter types:
  - `number` → number input
  - `boolean` → checkbox
  - `string` → text input

### 3. `{function_name}-table.tsx` (Server Component)

- Fetches data using Supabase RPC
- Builds params object from props
- Displays results in shadcn/ui Table
- Dynamic column generation from data
- Error and empty states

### 4. `{function_name}-pagination.tsx` (Client Component)

- Previous/Next buttons
- Current page display
- Preserves other URL parameters
- Disabled state for first page

### 5. `table-skeleton.tsx` (Loading Component)

- Animated loading skeleton
- Used in Suspense fallback

## Features

✅ **Type-safe** - All types from database-types.ts  
✅ **URL-based state** - Filters and pagination in URL  
✅ **Proper React patterns** - Server/Client component separation  
✅ **Suspense boundaries** - Streaming UI with loading states  
✅ **Automatic type conversion** - Handles numbers, booleans, arrays  
✅ **Responsive layout** - Grid-based filter form  
✅ **shadcn/ui components** - Consistent design system

## Type Handling

The generator automatically handles different parameter types:

| Database Type | Input Type                | Conversion                                |
| ------------- | ------------------------- | ----------------------------------------- |
| `number`      | `<input type="number">`   | `Number(value)`                           |
| `number[]`    | `<input type="text">`     | `value.split(',').map(Number)`            |
| `boolean`     | `<input type="checkbox">` | `value === 'true'`                        |
| `boolean[]`   | `<input type="text">`     | `value.split(',').map(v => v === 'true')` |
| `string`      | `<input type="text">`     | `value`                                   |
| `string[]`    | `<input type="text">`     | `value.split(',')`                        |

## File Structure

```
app/
└── {path}/
    ├── page.tsx                          # Main server component page
    ├── {function_name}-search.tsx        # Client component filters
    ├── {function_name}-table.tsx         # Server component data display
    ├── {function_name}-pagination.tsx    # Client component pagination
    └── table-skeleton.tsx                # Loading skeleton
```

## How It Works

1. **Parses database-types.ts** to extract function definitions
2. **Analyzes function arguments** (name, type, optional/required)
3. **Generates TypeScript components** with proper types
4. **Creates folder structure** in `app/` directory
5. **Converts parameter names** from snake_case to camelCase
6. **Handles type conversions** automatically

## Best Practices

- Uses URL search params for state (deep linkable, back/forward compatible)
- Server Components for data fetching (better performance)
- Client Components only for interactivity (filters, pagination)
- Suspense boundaries for progressive loading
- Proper TypeScript types throughout
- Error handling and loading states

## Customization

After generation, you can customize:

- Column rendering in table component
- Filter input layouts and labels
- Pagination logic (items per page, total pages)
- Loading skeleton design
- Error message display
- Add sorting, advanced filters, etc.

## Requirements

- Next.js 14+ with App Router
- Supabase client configured
- shadcn/ui components installed
- database-types.ts generated from Supabase
