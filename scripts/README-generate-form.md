# Form Generator

Generate complete CRUD form components from database function types with server actions and toast notifications.

## Usage

```bash
npm run gen:form -- --function <function_name> [--path <relative_path>]
# or
npm run gen:form -- -f <function_name> [-p <relative_path>]
```

## Arguments

- `--function` / `-f`: Name of the database function (required)
- `--path` / `-p`: Custom path relative to `app/` directory (optional, defaults to function name with dashes)

## Examples

```bash
# Generate form for approve_value_calculation_v2
npm run gen:form -- -f approve_value_calculation_v2

# Generate form with custom path
npm run gen:form -- -f create_building_v2 -p buildings/create

# Generate update form
npm run gen:form -- -f update_parcel_v2 -p parcels/edit
```

## Generated Files

### 1. `page.tsx` (Server Component)

- Wrapper page component
- Container layout
- Max-width constraint for form

### 2. `form.tsx` (Client Component)

- Form with `useActionState` hook
- Type-safe form fields based on function arguments
- Toast notifications for success/error
- Loading states
- Reset functionality
- Accessibility attributes

### 3. `actions.ts` (Server Actions)

- Type-safe server action
- FormData to params conversion
- Required field validation
- Supabase RPC call
- Path revalidation
- Comprehensive error handling

## Features

✅ **Type-safe** - All types from database-types.ts  
✅ **Server Actions** - `useActionState` architecture  
✅ **Toast Notifications** - Success/error feedback via Sonner  
✅ **Form Validation** - Required field checking  
✅ **Loading States** - Submit button with spinner  
✅ **Automatic Conversion** - FormData → typed params  
✅ **Path Revalidation** - Auto-refresh after mutations  
✅ **Accessibility** - ARIA attributes and labels  
✅ **shadcn/ui Components** - Consistent design

## Form Field Types

The generator automatically creates appropriate form fields:

| Database Type | Field Type                   | Conversion                                |
| ------------- | ---------------------------- | ----------------------------------------- |
| `string`      | `<Input type="text">`        | Direct string                             |
| `number`      | `<Input type="number">`      | `Number(value)`                           |
| `boolean`     | `<Checkbox>`                 | `value === "on"`                          |
| `string[]`    | `<Input type="text">` + hint | `value.split(',').map(trim)`              |
| `number[]`    | `<Input type="text">` + hint | `value.split(',').map(Number)`            |
| `boolean[]`   | `<Input type="text">` + hint | `value.split(',').map(v => v === 'true')` |

## Required vs Optional

- **Required fields** marked with `*` asterisk
- **Required validation** in server action
- **Optional fields** can be left empty
- **Checkboxes** for boolean values

## Toast Notifications

Uses [Sonner](https://sonner.emilkowal.ski/) for elegant toast notifications:

```tsx
// Success
toast.success("Operation completed successfully");

// Error
toast.error("Entity Type is required");
```

Install Sonner:

```bash
npm install sonner
```

Add Toaster to root layout:

```tsx
import { Toaster } from "sonner";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
```

## Server Action Flow

```
┌──────────────┐
│ User submits │
│     form     │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│  useActionState  │
│  calls action    │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Server Action    │
│ 1. Extract data  │
│ 2. Validate      │
│ 3. RPC call      │
│ 4. Revalidate    │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Return state     │
│ {success/error}  │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ useEffect shows  │
│ toast notification│
└──────────────────┘
```

## Example: Generated Form

For `approve_value_calculation_v2` with args:

- `p_activate?: boolean`
- `p_approval_notes?: string`
- `p_approve?: boolean`
- `p_entity_type: string` (required)
- `p_value_ids: number[]` (required)

Generates:

**form.tsx:**

```tsx
<form action={formAction}>
  <Checkbox name="p_activate" />
  <Input name="p_approval_notes" type="text" />
  <Checkbox name="p_approve" />
  <Input name="p_entity_type" type="text" required />
  <Input
    name="p_value_ids"
    type="text"
    required
    placeholder="Comma-separated values"
  />
  <Button type="submit">Submit</Button>
</form>
```

**actions.ts:**

```tsx
const params = {};
if (formData.get("p_activate"))
  params.p_activate = formData.get("p_activate") === "on";
params.p_entity_type = formData.get("p_entity_type");
params.p_value_ids = formData.get("p_value_ids").split(",").map(Number);

// Validation
if (!params.p_entity_type) return { error: "Entity Type is required" };
if (!params.p_value_ids) return { error: "Value Ids is required" };

// Execute
const { data, error } = await supabase.rpc(
  "approve_value_calculation_v2",
  params
);
```

## Customization

After generation, customize:

- **Field layouts** - Change grid columns, spacing
- **Input types** - Use select, textarea, date pickers
- **Validation** - Add custom validation logic
- **Success actions** - Redirect, refresh, show modal
- **Form appearance** - Adjust card styling, colors
- **Field hints** - Add help text, examples

## Integration with Generated Components

Combine with `gen:component` for full CRUD:

```bash
# List view
npm run gen:component -- -f search_buildings_v2 -p buildings

# Create form
npm run gen:form -- -f create_building_v2 -p buildings/create

# Edit form
npm run gen:form -- -f update_building_v2 -p buildings/edit
```

Then link them:

```tsx
// In buildings/page.tsx
<Link href="/buildings/create">
  <Button>Create New</Button>
</Link>
```

## Best Practices

1. **Use descriptive paths** - `/buildings/create` instead of `/create-building`
2. **Add success redirects** - Navigate after successful submit
3. **Customize validation** - Add business logic validation
4. **Handle relationships** - Use select dropdowns for foreign keys
5. **Test error states** - Ensure proper error messages
6. **Add loading states** - Disable form during submission

## Requirements

- Next.js 14+ with App Router
- Supabase client configured
- shadcn/ui components installed
- Sonner for toast notifications
- database-types.ts generated from Supabase

## Notes

- Forms use progressive enhancement (work without JS)
- Server actions provide security by default
- TypeScript ensures type safety end-to-end
- Path revalidation keeps UI in sync
- Toast notifications provide clear feedback
