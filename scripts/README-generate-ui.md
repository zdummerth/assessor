# SQL Schema UI Generator

Automatically generates a complete Next.js UI with CRUD operations for tables and execution interfaces for functions in a PostgreSQL schema file.

## Features

- ✅ **Table-based CRUD Operations** - Create, Read, Update, Delete for each table
- ✅ **Function Execution UI** - Parameter forms and result displays for database functions
- ✅ **TypeScript Interfaces** - Auto-generated types from schema
- ✅ **Next.js 14+ App Router** - Modern file-based routing with Server Components
- ✅ **shadcn/ui Components** - Beautiful, accessible UI components
- ✅ **Supabase Integration** - Ready-to-use database queries and RPC calls
- ✅ **Search & Filters** - Dynamic filtering for each table
- ✅ **Details Pages** - Individual record views with [id] routing
- ✅ **Responsive Tables** - Mobile-friendly data tables
- ✅ **Loading States** - Skeleton screens for better UX
- ✅ **Toast Notifications** - Success/error feedback
- ✅ **Idempotent** - Safe to run multiple times

## Usage

### Basic Usage

```bash
# Generate UI for all tables
node scripts/generate-ui-from-schema.js database/schemas/devnet-schema.sql

# Generate UI for a specific function
node scripts/generate-ui-from-schema.js database/schemas/devnet-schema.sql --functions=search_devnet_reviews
```

### Generate for Specific Tables Only

```bash
node scripts/generate-ui-from-schema.js database/schemas/devnet-schema.sql --tables=devnet_employees,devnet_sales
```

### Generate for Specific Functions Only

```bash
node scripts/generate-ui-from-schema.js database/schemas/devnet-schema.sql --functions=search_devnet_reviews,calculate_values
```

### Dry Run (Preview Without Creating Files)

```bash
node scripts/generate-ui-from-schema.js database/schemas/devnet-schema.sql --dry-run
```

### Force Overwrite Existing Files

```bash
node scripts/generate-ui-from-schema.js database/schemas/devnet-schema.sql --force
```

### Skip Specific Components

```bash
node scripts/generate-ui-from-schema.js database/schemas/devnet-schema.sql --skip=api,details
```

### Custom Output Directory

```bash
node scripts/generate-ui-from-schema.js database/schemas/devnet-schema.sql --output-dir=src/app
```

## What Gets Generated

### For Tables (`app/[table-name]/`)

- **`page.tsx`** - Main list view with filters and table
- **`loading.tsx`** - Loading skeleton state
- **`types.ts`** - TypeScript interfaces for the table
- **`actions.ts`** - Server actions for CRUD operations
- **`table.tsx`** - Client-side data table with pagination
- **`filters.tsx`** - Filter dialog with search fields
- **`create-form.tsx`** - Form for creating new records
- **`[id]/page.tsx`** - Individual record details page
- **`api/route.ts`** - GET endpoint for fetching records
- **`index.ts`** - Barrel export for clean imports

### For Functions (`app/[function-name]/`)

- **`page.tsx`** - Main page with parameter form
- **`loading.tsx`** - Loading skeleton state
- **`types.ts`** - TypeScript interfaces for parameters and results
- **`actions.ts`** - Server actions to execute the function
- **`parameters-form.tsx`** - Form to input function parameters
- **`results-table.tsx`** - Table to display function results
- **`api/route.ts`** - POST endpoint for executing the function
- **`index.ts`** - Barrel export for clean imports

## Generated File Structure

```
app/
├── devnet-employees/         # Table UI
│   ├── page.tsx              # Main listing page
│   ├── loading.tsx           # Loading state
│   ├── types.ts              # TypeScript types
│   ├── actions.ts            # Server actions
│   ├── table.tsx             # Data table
│   ├── filters.tsx           # Filter dialog
│   ├── create-form.tsx       # Create form
│   ├── index.ts              # Exports
│   ├── [id]/
│   │   └── page.tsx          # Details page
│   └── api/
│       └── route.ts          # API endpoint
└── search-devnet-reviews/    # Function UI
    ├── page.tsx              # Main page
    ├── loading.tsx           # Loading state
    ├── types.ts              # Parameter/Result types
    ├── actions.ts            # Execute function action
    ├── parameters-form.tsx   # Input form
    ├── results-table.tsx     # Results display
    ├── index.ts              # Exports
    └── api/
        └── route.ts          # API endpoint
```

## Schema Parsing

The generator extracts:

- **Tables** - Including columns, types, constraints
- **Enums** - PostgreSQL enum types → TypeScript unions
- **Functions** - Database functions → TypeScript interfaces
- **Relationships** - Foreign keys for related data

### Supported Column Types

| PostgreSQL Type     | TypeScript Type | UI Component           |
| ------------------- | --------------- | ---------------------- |
| `bigint`, `integer` | `number`        | Number input           |
| `text`, `varchar`   | `string`        | Text input or textarea |
| `boolean`           | `boolean`       | Checkbox               |
| `date`, `timestamp` | `string`        | Datetime input         |
| `jsonb`             | `object`        | JSON viewer/editor     |
| `enum`              | Union type      | Select dropdown        |
| Arrays (`[]`)       | Array type      | Multi-select           |

## Features by Pattern

### Automatic Enum Detection

```sql
CREATE TYPE priority AS ENUM ('low', 'medium', 'high');
```

Generates:

```typescript
export type Priority = "low" | "medium" | "high";
```

### JSONB Field Support

Tables with `data` or `field_data` columns get:

- JSON viewer in details page
- Expandable JSON editor in forms

### Timestamp Tracking

Tables with `created_at`/`updated_at` get:

- Automatic sorting by creation date
- Human-readable date displays
- Audit trail views

### Foreign Key Detection

Columns ending in `_id` are recognized as foreign keys:

- Generates relationship queries
- Creates linked navigation
- Supports cascading deletes

## CLI Options Reference

| Option          | Description                       | Example                    |
| --------------- | --------------------------------- | -------------------------- |
| `--tables=`     | Generate only for specific tables | `--tables=employees,sales` |
| `--force`       | Overwrite existing files          | `--force`                  |
| `--dry-run`     | Preview without creating files    | `--dry-run`                |
| `--skip=`       | Skip component types              | `--skip=api,details`       |
| `--output-dir=` | Custom output directory           | `--output-dir=src/app`     |

### Skip Options

- `page` - Skip main page.tsx
- `loading` - Skip loading.tsx
- `types` - Skip types.ts
- `actions` - Skip actions.ts
- `api` - Skip API routes
- `details` - Skip [id]/page.tsx
- `components` - Skip all component files

## Customization After Generation

The generated files are meant to be starting points. Common customizations:

### Adding Custom Validation

Edit `actions.ts`:

```typescript
export async function createEmployee(formData: FormData) {
  // Add custom validation here
  const email = formData.get("email") as string;
  if (!email.includes("@")) {
    return { error: "Invalid email", success: "" };
  }
  // ... rest of function
}
```

### Custom Table Columns

Edit `components/[table]/table.tsx` to add or remove columns from the display.

### Advanced Filters

Edit `components/[table]/filters.tsx` to add date ranges, multi-select filters, etc.

### Relationship Loading

Edit API route to include related data:

```typescript
const { data } = await supabase
  .from("reviews")
  .select("*, employee:employees(*)") // Join related table
  .range(start, end);
```

## Requirements

- Node.js 18+
- Next.js 14+
- Supabase client configured
- shadcn/ui installed
- Tailwind CSS configured

## Idempotency

The script is safe to run multiple times:

1. **Existing files are skipped** by default (unless `--force` is used)
2. **Directories are created** if they don't exist
3. **No data is deleted** or modified

Use `--force` to regenerate all files (useful after schema changes).

## Troubleshooting

### "Module not found" errors

Install required dependencies:

```bash
npm install @supabase/supabase-js @supabase/ssr
npx shadcn-ui@latest init
npx shadcn-ui@latest add table button card dialog input label skeleton badge
```

### API routes return 500 errors

Check environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Types don't match database

Regenerate types after schema changes:

```bash
node scripts/generate-ui-from-schema.js database/schemas/your-schema.sql --force --skip=components
```

## Examples

### Generate UI for all tables

```bash
node scripts/generate-ui-from-schema.js database/schemas/devnet-schema.sql
```

### Preview what would be generated

```bash
node scripts/generate-ui-from-schema.js database/schemas/devnet-schema.sql --dry-run
```

### Generate only employee management UI

```bash
node scripts/generate-ui-from-schema.js database/schemas/devnet-schema.sql --tables=devnet_employees
```

### Regenerate after schema change

```bash
node scripts/generate-ui-from-schema.js database/schemas/devnet-schema.sql --force
```

### Generate minimal UI (no API routes)

```bash
node scripts/generate-ui-from-schema.js database/schemas/devnet-schema.sql --skip=api,details
```

## Advanced Usage

### Generate for Multiple Schemas

```bash
for schema in database/schemas/*.sql; do
  node scripts/generate-ui-from-schema.js "$schema"
done
```

### Custom Template Modifications

Edit the `TemplateGenerator` class in the script to customize generated code:

- Add custom imports
- Modify component structure
- Change styling patterns
- Add additional validation

## License

MIT
