# Abstracts Module Organization

## New Structure

The abstracts functionality has been reorganized to separate concerns:

### Components Directory (`components/abstracts/`)

**Data Layer:**

- `actions.ts` - All server actions (data fetching + mutations)
- `types.ts` - TypeScript type definitions

**UI Components (`ui/` subdirectory):**

- `deed-abstract-dialog.tsx` - Modal for creating/editing deed abstracts
- `deed-abstract-form.tsx` - Form component for deed abstract fields
- `deed-abstracts-table.tsx` - Table display for deed abstracts list
- `delete-deed-abstract-button.tsx` - Confirmation dialog for deletion
- `publish-toggle-button.tsx` - Toggle publish/unpublish status
- `abstract-batch-selector.tsx` - Multi-select component for batch operations
- `book-config-form.tsx` - Form for book configuration
- `book-edit-form.tsx` - Dialog form for editing book details
- `book-print-wizard.tsx` - Multi-step wizard for creating print books

**Print Components (`print/` subdirectory):**

- `printable-abstracts.tsx` - Print-formatted view of abstracts

### App Directory (`app/real-estate-records/abstracts/`)

**Route Pages Only:**

- `page.tsx` - Main abstracts list page
- `loading.tsx` - Loading UI
- `books/` - Book management routes
  - `page.tsx` - Books list
  - `loading.tsx` - Loading UI
  - `new/page.tsx` - Create new book wizard
  - `[id]/page.tsx` - Book details
  - `[id]/print/page.tsx` - Print view for specific book
- `print/` - Print routes
  - `page.tsx` - Print preview for abstracts
  - `print.css` - Print-specific styles

## Import Pattern

All pages import from the organized component structure:

```typescript
// Data actions
import { getDeedAbstracts, getBooks, ... } from "@/components/abstracts/actions";

// Type definitions
import type { DeedAbstract, BookFormData, ... } from "@/components/abstracts/types";

// UI components
import { DeedAbstractsTable } from "@/components/abstracts/ui/deed-abstracts-table";
import BookPrintWizard from "@/components/abstracts/ui/book-print-wizard";

// Print components
import { PrintableAbstracts } from "@/components/abstracts/print/printable-abstracts";
```

## Benefits

1. **Clear Separation of Concerns**: Pages only handle routing and rendering, business logic in actions
2. **Better Organization**: UI components grouped together, easy to find and maintain
3. **Consistent Imports**: All imports use absolute paths from `@/components/abstracts`
4. **Reusability**: Components can be easily imported across different pages
5. **Scalability**: Easy to add new components or actions to their respective locations

## Server Actions Organization

The `actions.ts` file contains:

- **Read Operations**: `getDeedAbstracts`, `getDeedAbstractsCount`, `getDeedAbstract`, `getBooks`, `getBook`, `getBookAbstracts`, `getPrintableAbstracts`, `getNextBookNumber`
- **Create Operations**: `createDeedAbstract`, `createBook`
- **Update Operations**: `updateDeedAbstract`, `updateBook`, `publishDeedAbstract`, `unpublishDeedAbstract`
- **Delete Operations**: `deleteDeedAbstract`, `deleteBook`
- **Batch Operations**: `assignAbstractsToBook`, `removeAbstractsFromBook`

All server actions follow the pattern of using Supabase client, proper error handling, and cache revalidation.
