# SQL Schema UI Generator - Quick Start Guide

## 🚀 Quick Start

```bash
# 1. Preview what will be generated
node scripts/generate-ui-from-schema.js database/schemas/devnet-schema.sql --dry-run

# 2. Generate UI for all tables
node scripts/generate-ui-from-schema.js database/schemas/devnet-schema.sql

# 3. Generate UI for a specific function
node scripts/generate-ui-from-schema.js database/schemas/devnet-schema.sql --functions=search_devnet_reviews

# 4. Test with a simple example
node scripts/test-generator.js --generate
```

## 📋 What You Get

### For **Tables** (`app/[table-name]/`)

- ✅ Main listing page with search & filters
- ✅ Detail page for individual records
- ✅ TypeScript interfaces matching your schema
- ✅ Server actions for CRUD operations
- ✅ API route for data fetching
- ✅ Data table with pagination
- ✅ Filter dialog
- ✅ Create form
- ✅ Loading states with skeleton screens

### For **Functions** (`app/[function-name]/`)

- ✅ Parameter input form based on function signature
- ✅ Execute action that calls supabase.rpc()
- ✅ Results table displaying function output
- ✅ TypeScript interfaces for parameters and results
- ✅ API route for POST requests
- ✅ Loading states with skeleton screens

## 🎯 Common Use Cases

### Generate for Specific Tables

```bash
# Only generate employees and sales management
node scripts/generate-ui-from-schema.js database/schemas/devnet-schema.sql \
  --tables=devnet_employees,devnet_sales
```

### Generate for Specific Functions

```bash
# Generate UI for search and calculation functions
node scripts/generate-ui-from-schema.js database/schemas/devnet-schema.sql \
  --functions=search_devnet_reviews,calculate_property_values
```

### Regenerate After Schema Changes

```bash
# Overwrite existing files with updated schema
node scripts/generate-ui-from-schema.js database/schemas/devnet-schema.sql --force
```

### Generate Without API Routes

```bash
# Skip API routes if using different data fetching
node scripts/generate-ui-from-schema.js database/schemas/devnet-schema.sql --skip=api
```

### Preview Before Generating

```bash
# See what would be created without actually creating files
node scripts/generate-ui-from-schema.js database/schemas/devnet-schema.sql --dry-run
```

## 🔧 Customization

All generated files are **starting points**. Common customizations:

### 1. Add Custom Validation

Edit `app/[table]/actions.ts`:

```typescript
export async function createEmployee(formData: FormData) {
  // Add validation
  const email = formData.get("email") as string;
  if (!isValidEmail(email)) {
    return { error: "Invalid email", success: "" };
  }

  // ... rest of generated code
}
```

### 2. Customize Table Columns

Edit `components/[table]/table.tsx` to show/hide columns.

### 3. Add Advanced Filters

Edit `components/[table]/filters.tsx`:

```typescript
// Add date range filter
<div>
  <Label>Date Range</Label>
  <DateRangePicker name="date_range" />
</div>
```

### 4. Include Related Data

Edit `app/[table]/api/route.ts`:

```typescript
const { data } = await supabase
  .from("reviews")
  .select(
    `
    *,
    employee:employees(*),
    status:review_statuses(*)
  `
  )
  .range(start, end);
```

## 📊 Generated Code Example

For a table like this:

```sql
CREATE TABLE employees (
    id bigint PRIMARY KEY,
    email text NOT NULL,
    first_name text NOT NULL,
    status text DEFAULT 'active',
    created_at timestamptz DEFAULT now()
);
```

You get:

### TypeScript Types

```typescript
export interface Employees {
  id: number;
  email: string;
  first_name: string;
  status?: string;
  created_at?: string;
}
```

### CRUD Actions

```typescript
export async function createEmployees(formData: FormData);
export async function updateEmployees(id: number, formData: FormData);
export async function deleteEmployees(id: number);
export async function getEmployeesById(id: number);
```

### Data Table Component

- Pagination
- Search
- Delete confirmation
- Link to details

### Filter Dialog

- Text search for string fields
- Clear filters button
- Active filter count badge

## 🏗️ File Structure

```
app/
└── devnet-employees/
    ├── page.tsx              # List view with table & filters
    ├── loading.tsx           # Skeleton loading state
    ├── types.ts              # TypeScript interfaces
    ├── actions.ts            # Server actions (create, update, delete)
    ├── [id]/
    │   └── page.tsx          # Detail view for single record
    └── api/
        └── route.ts          # GET endpoint with filtering

components/
└── devnet-employees/
    ├── table.tsx             # Client table with state management
    ├── filters.tsx           # Filter dialog component
    ├── create-form.tsx       # Create form with validation
    └── index.ts              # Barrel exports
```

## 🎨 UI Features

All components use:

- **shadcn/ui** - Accessible, customizable components
- **Tailwind CSS** - Utility-first styling
- **Lucide Icons** - Beautiful icon set
- **Sonner** - Toast notifications

## ⚙️ Options Reference

| Flag            | Description                   | Example                |
| --------------- | ----------------------------- | ---------------------- |
| `--tables=`     | Generate only specific tables | `--tables=users,posts` |
| `--force`       | Overwrite existing files      | `--force`              |
| `--dry-run`     | Preview without creating      | `--dry-run`            |
| `--skip=`       | Skip components               | `--skip=api,details`   |
| `--output-dir=` | Custom output directory       | `--output-dir=src/app` |

### Skip Options

- `page` - Skip main listing page
- `loading` - Skip loading states
- `types` - Skip TypeScript interfaces
- `actions` - Skip server actions
- `api` - Skip API routes
- `details` - Skip detail pages
- `components` - Skip all component files

## 🧪 Testing

### Test with Sample Schema

```bash
# Run test generator (dry run)
node scripts/test-generator.js

# Actually generate test files
node scripts/test-generator.js --generate

# Visit http://localhost:3000/test-users
```

### Validate Generated Code

```bash
# Type check
npx tsc --noEmit

# Build test
npm run build
```

## 📝 Best Practices

1. **Run dry-run first** - Always preview before generating
2. **Use version control** - Commit before regenerating
3. **Customize after generation** - Generated code is a starting point
4. **Update schema carefully** - Use `--force` to regenerate after schema changes
5. **Test incrementally** - Generate one table at a time initially

## 🔍 Troubleshooting

### "Cannot find module" errors

```bash
# Install dependencies
npm install @supabase/supabase-js @supabase/ssr
npx shadcn-ui@latest add table button card dialog input label
```

### Generated files have TypeScript errors

```bash
# Regenerate types only
node scripts/generate-ui-from-schema.js schema.sql \
  --skip=components,api,details --force
```

### API returns 500 errors

Check `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
```

## 🚦 Next Steps

After generating:

1. **Review generated files** - Check types and structure
2. **Customize as needed** - Add business logic, validation
3. **Add to navigation** - Link from your main menu
4. **Test CRUD operations** - Create, read, update, delete
5. **Add authorization** - Implement Row Level Security (RLS)

## 💡 Advanced Usage

### Generate for Multiple Schemas

```bash
# Generate UI for all schemas in directory
for schema in database/schemas/*.sql; do
  echo "Generating for $schema"
  node scripts/generate-ui-from-schema.js "$schema"
done
```

### Batch Regeneration

```bash
# Regenerate only types and actions after schema change
node scripts/generate-ui-from-schema.js schema.sql \
  --force \
  --skip=components,api,details,loading
```

### Custom Templates

Edit the `TemplateGenerator` class in the script to:

- Add custom imports
- Modify component structure
- Change styling patterns
- Add validation libraries

## 📚 Related Documentation

- [README-generate-ui.md](./README-generate-ui.md) - Full documentation
- [example-usage.sh](./example-usage.sh) - Usage examples
- [test-generator.js](./test-generator.js) - Test script

## 🤝 Contributing

To improve the generator:

1. Edit `scripts/generate-ui-from-schema.js`
2. Update templates in `TemplateGenerator` class
3. Test with `scripts/test-generator.js`
4. Submit improvements

## 📄 License

MIT
