# Copilot Instructions: Property Assessment System

## Architecture Overview

This is a **Next.js 14+ property assessment system** with PostgreSQL backend focused on tracking parcels, valuations, and approval workflows. The system follows a **historical data + snapshots pattern** with comprehensive audit trails.

### Core Schema Architecture (`schema-v2.sql`)

**Key Design Principle**: All entities reference historical snapshots for point-in-time accuracy. The schema supports multi-method property valuations with component breakdowns and complex approval workflows.

```sql
-- Core pattern: Historical data with snapshots
parcels_v2 → parcel_snapshots_v2 (by date)
buildings_v2 → building_snapshots_v2 + building_values_v2 (multi-method)
lands_v2 → land_snapshots_v2 + land_values_v2 (multi-method)
```

**Central Search Function**: `search_parcels_v2()` - Performance-optimized with early filtering, composite indexes, and JSONB parameter filtering. Use this for all parcel searches.

### Value Management System

The system supports **multi-method property valuations**:

- Cost approach, sales comparison, income approach, custom approaches
- Component breakdowns (foundation, structure, improvements, etc.)
- Mixed-use property value type allocations
- Assessment cycle scheduling with approval workflows

```sql
-- Example: Get parcel with all values as of specific date
SELECT * FROM search_parcels_v2(
    p_as_of_date := '2024-01-01',
    p_filters := '{"owner_name": "Smith", "min_value": 100000}'::jsonb,
    p_limit := 25
);
```

## Development Patterns

### Database Function Usage

**Always use database functions** for complex operations - never replicate business logic in application code:

```typescript
// Correct: Use database functions
const scheduleValueRecalc = await supabase.rpc(
  "schedule_value_recalculation_v2",
  {
    p_entity_type: "building",
    p_entity_ids: [buildingId],
    p_method_ids: [1, 2], // cost, sales comparison
    p_assessment_cycle_id: currentCycleId,
  }
);

// Correct: Historical queries
const parcelHistory = await supabase.rpc("get_complete_parcel_as_of_date_v2", {
  p_parcel_id: parcelId,
  p_as_of_date: "2023-01-01",
});
```

### Performance-Critical Patterns

1. **Use composite indexes** - The schema includes optimized search indexes for common filter combinations
2. **Limit result sets** - `search_parcels_v2` caps at 1000 results maximum
3. **JSONB filtering** - Use database JSONB operators rather than client-side filtering

### Review & Approval Workflows

Central workflow through `reviews_v2` table with unified status system:

```typescript
// Status transitions use database functions
const approveValue = await supabase.rpc("approve_value_calculation_v2", {
  p_value_ids: [valueId],
  p_employee_id: currentUser.employeeId,
  p_make_active: true,
});
```

## File Structure Conventions

### Database Files

- `schema-v2.sql` - **Production schema** (use this, not schema.sql)
- `seed-v3.sql` - **Current seed data** (optimized, 10K+ records)
- `example-db-function-calls.sql` - Function usage examples

### App Structure

```
app/
├── parcels/           # Main parcel management
├── reviews/           # Approval workflow UI
├── abatements/        # Tax abatement programs
├── employees/         # Staff management
└── api/               # API routes for complex operations
```

### Key Components Directories

```
components/
├── ui/                # shadcn/ui base components
├── parcel-*/          # Parcel-specific components
├── reviews/           # Review workflow components
└── value-stats/       # Value analysis components
```

## Next.js Specific Patterns

### Supabase Integration

- Uses `@supabase/ssr` for server-side auth
- Server Components for initial data loading
- Client Components for interactive forms and real-time updates

### Development Commands

```bash
npm run dev            # Development with Turbopack
npm run build          # Production build

# Database operations (via Supabase CLI)
supabase db reset      # Reset with schema-v2.sql
supabase db seed       # Run seed-v3.sql
```

### Performance Optimizations Applied

- **Composite indexes** on common search patterns
- **Early filtering** in CTEs to reduce dataset size
- **Simplified aggregations** - removed expensive JSONB operations from main search
- **Historical accuracy** via snapshot pattern instead of complex joins

## Critical Integration Points

1. **Value Calculation Engine**: Multi-method system supports cost, sales comparison, income, and custom approaches
2. **Snapshot System**: All changes create historical snapshots for audit trails
3. **Review Workflows**: Unified approval system across all entity types
4. **Search Performance**: Optimized for large datasets with early filtering and composite indexes

## Testing Patterns

Use the seed data for testing:

- 10,000+ parcels with realistic data distributions
- Multi-year historical snapshots
- Complex value scenarios with multiple methods
- Realistic approval workflow states

**Key Insight**: This system prioritizes historical accuracy and audit trails over simple CRUD operations. Always consider temporal data when building features.
