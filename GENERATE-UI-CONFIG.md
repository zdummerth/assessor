# UI Generator Configuration

## Overview

The `generate-ui-config.json` file allows you to customize how the UI generator creates forms and components for your database tables.

## Configuration Structure

```json
{
  "global": {
    "useInsertUpdateTypes": true,
    "autoDetectEnums": true,
    "skipGeneratedFields": true
  },
  "tables": {
    "table_name": {
      "displayName": "Human Readable Name",
      "forms": {
        "create": {
          "fields": [...]
        },
        "update": {
          "inheritFrom": "create"
        }
      }
    }
  }
}
```

## Field Types

### Input Field

```json
{
  "name": "title",
  "type": "input",
  "label": "Title",
  "placeholder": "Enter title",
  "required": false
}
```

### Select with Enum

```json
{
  "name": "status",
  "type": "select",
  "label": "Status",
  "required": true,
  "enumType": "review_status"
}
```

### Select with Static Options

```json
{
  "name": "entity_type",
  "type": "select",
  "label": "Entity Type",
  "options": [
    { "value": "parcel", "label": "Parcel" },
    { "value": "building", "label": "Building" }
  ]
}
```

### Lookup from Another Table

```json
{
  "name": "assigned_to_id",
  "type": "lookup",
  "label": "Assigned To",
  "required": false,
  "lookup": {
    "table": "employees",
    "valueField": "id",
    "labelField": "full_name",
    "orderBy": "full_name"
  }
}
```

### Textarea

```json
{
  "name": "description",
  "type": "textarea",
  "label": "Description",
  "rows": 4,
  "placeholder": "Enter description"
}
```

### Number Input

```json
{
  "name": "entity_id",
  "type": "number",
  "label": "Entity ID",
  "min": 1
}
```

### Date Input

```json
{
  "name": "due_date",
  "type": "date",
  "label": "Due Date"
}
```

### Checkbox

```json
{
  "name": "requires_field_review",
  "type": "checkbox",
  "label": "Requires Field Review"
}
```

## Features

### 1. Enum Auto-Detection

When `autoDetectEnums: true`, the generator automatically:

- Detects enum fields in your database types
- Imports the enum types
- Casts form values to the correct enum type

Example:

```typescript
// Generated code
type DevnetReviewKind = Database["public"]["Enums"]["devnet_review_kind"];

// In form data extraction
kind: (formData.get("kind") as DevnetReviewKind) || undefined,
```

### 2. Insert/Update Types

When `useInsertUpdateTypes: true`, uses proper Supabase Insert/Update types:

```typescript
// Instead of: Partial<TableRow>
const data: TableInsert = { ... };  // For creates
const data: TableUpdate = { ... };  // For updates
```

### 3. Field Exclusion

Exclude fields from forms:

```json
{
  "forms": {
    "create": {
      "excludeFields": ["id", "created_at", "updated_at", "internal_data"]
    }
  }
}
```

### 4. Lookup Fields

Foreign key fields can use lookups to show dropdown lists:

```json
{
  "name": "current_status_id",
  "type": "lookup",
  "label": "Status",
  "required": true,
  "lookup": {
    "table": "review_statuses",
    "valueField": "id",
    "labelField": "name",
    "orderBy": "sort_order",
    "where": { "active": true }
  }
}
```

The generator will create:

1. A server action to fetch lookup options
2. A dropdown component populated with those options
3. Proper type-safe value handling

## Example: Complete Table Config

```json
{
  "tables": {
    "projects": {
      "displayName": "Projects",
      "forms": {
        "create": {
          "fields": [
            {
              "name": "name",
              "type": "input",
              "label": "Project Name",
              "required": true,
              "placeholder": "Enter project name"
            },
            {
              "name": "description",
              "type": "textarea",
              "label": "Description",
              "rows": 4
            },
            {
              "name": "status",
              "type": "select",
              "label": "Status",
              "required": true,
              "enumType": "project_status"
            },
            {
              "name": "owner_id",
              "type": "lookup",
              "label": "Project Owner",
              "required": true,
              "lookup": {
                "table": "users",
                "valueField": "id",
                "labelField": "full_name",
                "orderBy": "last_name"
              }
            },
            {
              "name": "budget",
              "type": "number",
              "label": "Budget",
              "min": 0,
              "step": 0.01
            },
            {
              "name": "start_date",
              "type": "date",
              "label": "Start Date",
              "required": true
            },
            {
              "name": "is_active",
              "type": "checkbox",
              "label": "Active Project"
            }
          ],
          "excludeFields": ["id", "created_at", "updated_at"]
        },
        "update": {
          "inheritFrom": "create"
        }
      }
    }
  }
}
```

## Usage

1. **Create or update** `generate-ui-config.json` in your project root
2. **Run the generator**:
   ```bash
   node scripts/generate-ui-from-types.js --tables=your_table --force
   ```
3. **The generator will**:
   - Read your config
   - Auto-detect enums
   - Use Insert/Update types
   - Generate forms with proper field types
   - Create lookup actions for foreign keys

## Benefits

✅ **Type-safe** - Enum types are imported and used correctly  
✅ **Customizable** - Control which fields appear in forms  
✅ **DRY** - Define once, generate everywhere  
✅ **Lookups** - Automatic dropdown population from related tables  
✅ **Validation** - Required fields, min/max values, etc.  
✅ **User-friendly** - Custom labels and placeholders
