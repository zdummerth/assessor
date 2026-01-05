# SQL Schema UI Generator - Files Overview

This directory contains a complete UI generation system for creating Next.js CRUD interfaces from PostgreSQL schemas.

## 📁 Files

### Main Generator

- **`generate-ui-from-schema.js`** - Main script that parses SQL schemas and generates complete UI

### Documentation

- **`QUICKSTART.md`** - Quick start guide with common use cases
- **`README-generate-ui.md`** - Comprehensive documentation
- **`example-usage.sh`** - Shell script with usage examples

### Testing

- **`test-generator.js`** - Test script that creates a sample schema and validates the generator

## 🎯 Purpose

Automatically generate production-ready UI components for database tables, including:

- Next.js App Router pages
- TypeScript interfaces
- CRUD operations
- Data tables with filters
- Detail pages
- API routes
- Loading states

## 🚀 Quick Start

```bash
# Preview generation
node scripts/generate-ui-from-schema.js database/schemas/devnet-schema.sql --dry-run

# Generate for all tables
node scripts/generate-ui-from-schema.js database/schemas/devnet-schema.sql

# Test with sample data
node scripts/test-generator.js --generate
```

## 📖 Full Documentation

See [QUICKSTART.md](./QUICKSTART.md) for a quick guide or [README-generate-ui.md](./README-generate-ui.md) for complete documentation.

## 🔧 Key Features

- ✅ **Idempotent** - Safe to run multiple times
- ✅ **Type-safe** - Generates TypeScript interfaces from schema
- ✅ **Customizable** - Templates can be modified
- ✅ **Fast** - Generates complete UI in seconds
- ✅ **Standards-based** - Follows Next.js and React best practices
- ✅ **Production-ready** - Includes error handling, loading states, validation

## 🎨 Tech Stack

Generated code uses:

- Next.js 14+ (App Router)
- TypeScript
- shadcn/ui components
- Tailwind CSS
- Supabase
- React Server Components

## 📊 What Gets Generated

For a table named `employees`, generates:

```
app/employees/
├── page.tsx          # List view
├── loading.tsx       # Loading state
├── types.ts          # TypeScript types
├── actions.ts        # CRUD operations
├── [id]/
│   └── page.tsx      # Detail view
└── api/
    └── route.ts      # API endpoint

components/employees/
├── table.tsx         # Data table
├── filters.tsx       # Filter dialog
├── create-form.tsx   # Create form
└── index.ts          # Exports
```

## 💡 Common Commands

```bash
# Generate specific tables only
node scripts/generate-ui-from-schema.js schema.sql --tables=users,posts

# Force overwrite existing files
node scripts/generate-ui-from-schema.js schema.sql --force

# Skip certain components
node scripts/generate-ui-from-schema.js schema.sql --skip=api,details

# Dry run (preview only)
node scripts/generate-ui-from-schema.js schema.sql --dry-run
```

## 🔄 Workflow

1. **Design your schema** - Create SQL schema with tables, types, functions
2. **Run generator** - Generate UI scaffolding
3. **Customize** - Add business logic, styling, validation
4. **Test** - Verify CRUD operations work
5. **Deploy** - Ship to production

## 🛠️ Customization

All generated files are starting points. Common customizations:

- Add validation logic in `actions.ts`
- Customize table columns in `table.tsx`
- Add advanced filters in `filters.tsx`
- Include related data in API routes
- Add authorization checks
- Customize styling

## 📝 Notes

- The generator is **idempotent** - existing files are skipped unless `--force` is used
- Generated code follows the patterns from `app/devnet-reviews/` implementation
- Uses database functions for complex queries when available
- Automatically detects ENUMs, foreign keys, and JSONB fields
- Supports pagination, filtering, and sorting out of the box

## 🧪 Testing

Run the test generator to validate everything works:

```bash
node scripts/test-generator.js
```

This creates a sample schema and generates a working UI that you can view at `/test-users`.

## 🤝 Contributing

To modify the generator:

1. Edit `generate-ui-from-schema.js`
2. Update template methods in the `TemplateGenerator` class
3. Test with `test-generator.js`
4. Update documentation

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
