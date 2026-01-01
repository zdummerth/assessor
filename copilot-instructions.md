# Copilot Instructions: Tax Assessment Database UI

## Overview

Build a comprehensive tax assessment system UI using the simplified schema-v2-simple.sql database structure. This system tracks parcels, structures, sales, permits, appeals, and values with a robust review and approval workflow.

## Tech Stack

- **Frontend**: Next.js 14+ with App Router
- **Styling**: TailwindCSS + shadcn/ui components
- **Database**: PostgreSQL with Supabase
- **Authentication**: Supabase Auth
- **State Management**: React hooks, Server Components where possible
- **Forms**: React Hook Form with Zod validation

## Database Schema Overview

### Core Entities

- **employees**: Staff with permission flags (can_approve_reviews, can_bypass_approval, is_supervisor)
- **reviews**: Central workflow entity with unified status system and JSONB data storage
- **review_statuses**: Unified status system for all review types with approval workflow states
- **parcels**: Property records with direct current_review_id reference
- **structures**: Building data with JSONB current_details storage
- **lands**: Land records with JSONB land_details storage
- **sales**: Sales data with JSONB sale_details storage
- **permits**: Permit data with JSONB permit_details storage
- **appeals**: Appeal records with JSONB appeal_details storage
- **parcel_values**: Assessment values with JSONB value_details storage

### Key Design Patterns

1. **Unified Status System**: Single review_statuses table handles all review types
2. **Direct References**: Entities reference current_review_id directly (no junction tables)
3. **JSONB Storage**: Flexible data in JSONB fields with quick-access columns for performance
4. **Soft Deletes**: Use deleted_at timestamps instead of hard deletes
5. **Permission-Based Workflows**: Boolean flags on employees for approval permissions

## UI Component Guidelines

### 1. Review Management Components

#### Review Status Badge

```tsx
// Use review_statuses.is_approval_related for styling approval states
<Badge variant={isApprovalRelated ? "warning" : "default"}>{statusName}</Badge>
```

#### Review Actions

```tsx
// Check user permissions for approval actions
const { can_approve, can_bypass } = useEmployeePermissions();

// Show appropriate action buttons based on current status and permissions
{
  status.slug === "submitted-for-approval" && can_approve && (
    <Button onClick={approveReview}>Approve</Button>
  );
}
{
  can_bypass && (
    <Button variant="secondary" onClick={bypassApproval}>
      Bypass
    </Button>
  );
}
```

### 2. Data Table Components

#### Unified Status Display

```tsx
// Use the unified status system across all entity types
const StatusCell = ({ review_kind, current_status_id }) => {
  const status = useReviewStatus(current_status_id);
  return (
    <div className="flex items-center gap-2">
      <Badge variant={status.is_approval_related ? "warning" : "default"}>
        {status.name}
      </Badge>
      {status.is_terminal && <CheckCircle className="h-4 w-4 text-green-500" />}
    </div>
  );
};
```

### 3. Form Components

#### JSONB Data Handling

```tsx
// Store complex form data in JSONB fields
const StructureForm = () => {
  const { register, setValue, watch } = useForm({
    defaultValues: {
      total_area_sqft: 0,
      current_details: {
        bedrooms: 0,
        bathrooms: 0,
        basement_area: 0,
        garage_area: 0,
        // ... other detailed fields
      },
    },
  });

  // Quick access fields for performance, detailed data in JSONB
};
```

### 4. Permission-Based UI

#### Role-Based Component Rendering

```tsx
const useEmployeePermissions = () => {
  const { data: employee } = useQuery({
    queryKey: ["employee", user?.id],
    queryFn: () =>
      supabase.rpc("get_employee_by_user_id", { p_user_id: user.id }),
  });

  return {
    can_approve: employee?.can_approve || false,
    can_bypass: employee?.can_bypass || false,
    is_supervisor: employee?.is_supervisor || false,
  };
};
```

## API Patterns

### 1. Database Function Usage

```typescript
// Use database functions for complex operations
const approveReview = async (reviewId: number, note?: string) => {
  const { data, error } = await supabase.rpc("approve_review", {
    p_review_id: reviewId,
    p_approver_user_id: user.id,
    p_note: note,
  });
};

// Use transition functions for status changes
const transitionStatus = async (
  reviewId: number,
  newStatus: string,
  note?: string
) => {
  await supabase.rpc("transition_review_status", {
    p_review_id: reviewId,
    p_new_status_slug: newStatus,
    p_note: note,
  });
};
```

### 2. View Usage

```typescript
// Use predefined views for common queries
const { data: activeReviews } = useQuery({
  queryKey: ["active-reviews"],
  queryFn: () =>
    supabase
      .from("active_reviews")
      .select("*")
      .order("created_at", { ascending: false }),
});

const { data: parcelSummary } = useQuery({
  queryKey: ["parcel-summary", parcelId],
  queryFn: () =>
    supabase.from("parcel_summary").select("*").eq("id", parcelId).single(),
});
```

### 3. JSONB Querying

```typescript
// Query JSONB fields efficiently
const searchStructures = async (criteria: any) => {
  return supabase
    .from("structures")
    .select("*, parcels(block, lot, ext)")
    .contains("current_details", criteria)
    .is("deleted_at", null);
};
```

## Component Structure

### 1. Page Layout

```
app/
├── (dashboard)/
│   ├── reviews/
│   │   ├── page.tsx                 // All reviews dashboard
│   │   ├── [id]/page.tsx           // Individual review detail
│   │   └── components/
│   │       ├── review-table.tsx    // Unified review table
│   │       ├── review-actions.tsx  // Approval/status actions
│   │       └── status-badge.tsx    // Status display component
│   ├── parcels/
│   │   ├── page.tsx                // Parcel search/list
│   │   ├── [id]/page.tsx          // Parcel detail
│   │   └── components/
│   │       ├── parcel-summary.tsx  // Basic parcel info
│   │       ├── review-panel.tsx    // Current review status
│   │       └── history-tab.tsx     // Review history
│   ├── employees/
│   │   ├── page.tsx                // Employee management
│   │   └── components/
│   │       ├── permissions-form.tsx // Permission management
│   │       └── supervisor-assign.tsx // Supervisor assignment
```

### 2. Reusable Components

```
components/
├── ui/                              // shadcn/ui components
├── forms/
│   ├── review-form.tsx             // Generic review creation
│   ├── approval-form.tsx           // Approval action form
│   └── status-transition.tsx       // Status change form
├── tables/
│   ├── unified-review-table.tsx    // Reviews across all types
│   ├── parcel-table.tsx           // Parcel listing
│   └── employee-table.tsx         // Employee management
└── workflow/
    ├── approval-workflow.tsx       // Approval process UI
    ├── status-timeline.tsx         // Review history timeline
    └── assignment-panel.tsx        // Employee assignment
```

## Workflow Implementation

### 1. Review Creation

```tsx
const createReview = async (data: ReviewFormData) => {
  // Use helper function to create review with default status
  const { data: reviewId } = await supabase.rpc(
    "create_review_with_default_status",
    {
      p_kind: data.kind,
      p_title: data.title,
      p_requires_approval: data.requires_approval,
      p_assigned_to_id: data.assigned_to_id,
      p_review_data: data.details,
    }
  );

  return reviewId;
};
```

### 2. Approval Workflow

```tsx
const ApprovalPanel = ({ review }) => {
  const { can_approve, can_bypass } = useEmployeePermissions();
  const isAwaitingApproval = review.status_slug === "submitted-for-approval";

  return (
    <div className="space-y-4">
      {isAwaitingApproval && can_approve && (
        <div className="flex gap-2">
          <Button onClick={() => handleApprove(review.id)}>Approve</Button>
          <Button variant="destructive" onClick={() => handleReject(review.id)}>
            Reject
          </Button>
        </div>
      )}
      {can_bypass && (
        <Button variant="secondary" onClick={() => handleBypass(review.id)}>
          Bypass Approval
        </Button>
      )}
    </div>
  );
};
```

### 3. Status Timeline

```tsx
const ReviewTimeline = ({ reviewId }) => {
  const { data: history } = useQuery({
    queryKey: ["review-history", reviewId],
    queryFn: () =>
      supabase
        .from("review_status_history")
        .select("*, review_statuses(name, is_approval_related)")
        .eq("review_id", reviewId)
        .order("created_at", { ascending: false }),
  });

  return (
    <div className="space-y-2">
      {history?.map((entry) => (
        <div key={entry.id} className="flex items-center gap-3 p-2 border-l-2">
          <Badge
            variant={
              entry.review_statuses.is_approval_related ? "warning" : "default"
            }
          >
            {entry.review_statuses.name}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {formatDate(entry.created_at)}
          </span>
        </div>
      ))}
    </div>
  );
};
```

## Authentication Integration

### User Context

```tsx
const useCurrentEmployee = () => {
  const { user } = useSupabaseAuth();

  return useQuery({
    queryKey: ["current-employee", user?.id],
    queryFn: () =>
      supabase.rpc("get_employee_by_user_id", { p_user_id: user.id }),
    enabled: !!user,
  });
};
```

### Permission Guards

```tsx
const RequirePermission = ({
  permission,
  children,
  fallback = <div>Insufficient permissions</div>,
}) => {
  const permissions = useEmployeePermissions();

  if (!permissions[permission]) {
    return fallback;
  }

  return children;
};

// Usage
<RequirePermission permission="can_approve">
  <ApprovalButtons />
</RequirePermission>;
```

## Key Implementation Notes

1. **Always use soft deletes** - Check `deleted_at IS NULL` in queries
2. **Leverage JSONB flexibility** - Store complex form data in JSONB fields with GIN indexes
3. **Use database functions** - Complex workflow operations should use the provided SQL functions
4. **Unified status system** - All review types share the same status workflow
5. **Permission-based UI** - Hide/show components based on employee permissions
6. **Audit trail** - Status changes are automatically logged via triggers
7. **Direct references** - Use `current_review_id` fields instead of junction tables

## Performance Considerations

- Use the provided views (`active_reviews`, `parcel_summary`) for common queries
- Index JSONB fields with GIN indexes for fast searching
- Use Server Components for data fetching where possible
- Implement proper pagination for large datasets
- Cache employee permissions in client state

## Error Handling

- Database functions throw meaningful error messages for permission violations
- Use Supabase RLS policies for additional security layer
- Implement proper loading states for async operations
- Show user-friendly error messages for workflow violations
