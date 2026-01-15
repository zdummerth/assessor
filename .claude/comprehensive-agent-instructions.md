# Comprehensive Agent Instructions for Assessor Project

**Version 1.0.0**  
Integrated from copilot-instructions.md, vercel-react-best-practices, and web-design-guidelines  
January 2026

> **IMPORTANT**: These instructions should be referenced on every request to this agent.

---

## Table of Contents

1. [Architecture & Domain Knowledge](#architecture--domain-knowledge)
2. [React & Next.js Performance](#react--nextjs-performance)
3. [UI/UX & Accessibility Guidelines](#uiux--accessibility-guidelines)
4. [Database & Backend Patterns](#database--backend-patterns)
5. [Code Quality Standards](#code-quality-standards)

---

## Architecture & Domain Knowledge

### Property Assessment System Overview

This is a **Next.js 14+ property assessment system** with PostgreSQL backend focused on tracking parcels, valuations, and approval workflows. The system follows a **historical data + snapshots pattern** with comprehensive audit trails.

#### Core Schema Architecture

**Key Design Principle**: All entities reference historical snapshots for point-in-time accuracy. The schema supports multi-method property valuations with component breakdowns and complex approval workflows.

```sql
-- Core pattern: Historical data with snapshots
parcels_v2 → parcel_snapshots_v2 (by date)
buildings_v2 → building_snapshots_v2 + building_values_v2 (multi-method)
lands_v2 → land_snapshots_v2 + land_values_v2 (multi-method)
```

**Central Search Function**: `search_parcels_v2()` - Performance-optimized with early filtering, composite indexes, and JSONB parameter filtering. **Use this for all parcel searches.**

#### Value Management System

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

#### File Structure Reference

- **Database Files**:

  - `schema-v2.sql` — Production schema (use this, not schema.sql)
  - `seed-v3.sql` — Current seed data (optimized, 10K+ records)
  - `example-db-function-calls.sql` — Function usage examples

- **App Structure**:

  ```
  app/
  ├── parcels/           # Main parcel management
  ├── reviews/           # Approval workflow UI
  ├── abatements/        # Tax abatement programs
  ├── employees/         # Staff management
  └── api/               # API routes for complex operations
  ```

- **Components**:
  ```
  components/
  ├── ui/                # shadcn/ui base components
  ├── parcel-*/          # Parcel-specific components
  ├── reviews/           # Review workflow components
  └── value-stats/       # Value analysis components
  ```

### Development Patterns

#### Database Function Usage

**ALWAYS USE DATABASE FUNCTIONS** for complex operations - never replicate business logic in application code.

```typescript
// ✅ Correct: Use database functions
const scheduleValueRecalc = await supabase.rpc(
  "schedule_value_recalculation_v2",
  {
    p_entity_type: "building",
    p_entity_ids: [buildingId],
    p_method_ids: [1, 2], // cost, sales comparison
    p_assessment_cycle_id: currentCycleId,
  }
);

// ✅ Correct: Historical queries
const parcelHistory = await supabase.rpc("get_complete_parcel_as_of_date_v2", {
  p_parcel_id: parcelId,
  p_as_of_date: "2023-01-01",
});
```

#### Performance-Critical Patterns

1. **Use composite indexes** — The schema includes optimized search indexes for common filter combinations
2. **Limit result sets** — `search_parcels_v2` caps at 1000 results maximum
3. **JSONB filtering** — Use database JSONB operators rather than client-side filtering

#### Review & Approval Workflows

Central workflow through `reviews_v2` table with unified status system:

```typescript
// Status transitions use database functions
const approveValue = await supabase.rpc("approve_value_calculation_v2", {
  p_value_ids: [valueId],
  p_employee_id: currentUser.employeeId,
  p_make_active: true,
});
```

---

## React & Next.js Performance

**Reference**: Vercel React Best Practices Guide  
**Scope**: Use these guidelines when writing, reviewing, or refactoring React/Next.js code for optimal performance.

### Category 1: Eliminating Waterfalls — **CRITICAL**

Waterfalls occur when operations must wait sequentially instead of in parallel. Eliminating them is the highest-impact optimization.

#### 1.1 Defer Await Until Needed

Move `await` operations into branches where they're actually used to avoid blocking code paths that don't need them.

```typescript
// ❌ Incorrect: blocks both branches
async function handleRequest(userId: string, skipProcessing: boolean) {
  const userData = await fetchUserData(userId);

  if (skipProcessing) {
    return { skipped: true };
  }

  return processUserData(userData);
}

// ✅ Correct: only blocks when needed
async function handleRequest(userId: string, skipProcessing: boolean) {
  if (skipProcessing) {
    return { skipped: true };
  }

  const userData = await fetchUserData(userId);
  return processUserData(userData);
}
```

#### 1.2 Promise.all() for Independent Operations

When operations are independent, run them in parallel using `Promise.all()`.

```typescript
// ❌ Incorrect: sequential, blocks
const user = await fetchUser(userId);
const settings = await fetchSettings(userId);
const notifications = await fetchNotifications(userId);

// ✅ Correct: parallel execution
const [user, settings, notifications] = await Promise.all([
  fetchUser(userId),
  fetchSettings(userId),
  fetchNotifications(userId),
]);
```

#### 1.3 Prevent Waterfall Chains in API Routes

Start promises early, await late. Initialize all data fetches before awaiting them.

```typescript
// ❌ Incorrect: sequential waiting
export async function GET(req: Request) {
  const userId = await getSessionUserId();
  const user = await fetchUser(userId);
  const permissions = await fetchPermissions(userId);
  const data = await fetchData(permissions);

  return Response.json(data);
}

// ✅ Correct: start early, await late
export async function GET(req: Request) {
  const sessionPromise = getSessionUserId();
  const userPromise = sessionPromise.then((uid) => fetchUser(uid));
  const permPromise = sessionPromise.then((uid) => fetchPermissions(uid));

  const [user, permissions] = await Promise.all([userPromise, permPromise]);

  const data = await fetchData(permissions);
  return Response.json(data);
}
```

#### 1.4 Strategic Suspense Boundaries

Use Suspense to stream content and unblock parallel rendering. Place boundaries strategically to deliver critical content first.

```typescript
// ✅ Suspense streams data as it becomes available
export default async function Page() {
  return (
    <>
      <Header /> {/* renders immediately */}

      <Suspense fallback={<Skeleton />}>
        <CriticalContent /> {/* streams ASAP */}
      </Suspense>

      <Suspense fallback={<Skeleton />}>
        <SecondaryContent /> {/* loads in parallel */}
      </Suspense>
    </>
  )
}
```

### Category 2: Bundle Size Optimization — **CRITICAL**

Bundle size directly impacts cold start performance and Time to Interactive (TTI).

#### 2.1 Avoid Barrel File Imports

Import directly from source files instead of barrel files. Barrel files (index.js that re-export modules) can load thousands of unused modules.

**Impact**: 200-800ms import cost, 15-70% faster dev boot, 28% faster builds.

```typescript
// ❌ Incorrect: loads entire library (~1MB)
import { Check, X, Menu } from "lucide-react";

// ✅ Correct: direct imports only (~2KB)
import Check from "lucide-react/dist/esm/icons/check";
import X from "lucide-react/dist/esm/icons/x";
import Menu from "lucide-react/dist/esm/icons/menu";

// ✅ Alternative: next.config.js optimization (Next.js 13.5+)
// next.config.js
export default {
  experimental: {
    optimizePackageImports: ["lucide-react", "@mui/material"],
  },
};
// Then barrel imports work automatically
```

Common libraries affected: `lucide-react`, `@mui/material`, `@tabler/icons-react`, `react-icons`, `lodash`, `date-fns`, `rxjs`

#### 2.2 Dynamic Imports for Heavy Components

Use `next/dynamic` for components that load conditionally or below the fold.

```typescript
// ❌ Incorrect: loads editor on every page load
import { HeavyEditor } from '@/components/editor'

export function Page() {
  return <HeavyEditor />
}

// ✅ Correct: lazy-load only when opened
const HeavyEditor = dynamic(() => import('@/components/editor'), {
  loading: () => <p>Loading...</p>,
})

export function Page() {
  const [showEditor, setShowEditor] = useState(false)
  return (
    <>
      <button onClick={() => setShowEditor(true)}>Open Editor</button>
      {showEditor && <HeavyEditor />}
    </>
  )
}
```

#### 2.3 Defer Non-Critical Third-Party Libraries

Load analytics, logging, and other non-critical libraries after hydration.

```typescript
// ✅ Load non-critical libs after hydration
useEffect(() => {
  // Dynamically import after page is interactive
  import("analytics-library").then((lib) => {
    lib.initialize();
  });
}, []);
```

#### 2.4 Conditional Module Loading

Load modules only when their feature is activated.

```typescript
// ✅ Feature flag-based loading
if (featureFlags.enableAdvancedAnalytics) {
  const Analytics = await import("./advanced-analytics");
}
```

#### 2.5 Preload Based on User Intent

Preload resources on hover/focus to create perceived speed improvements.

```typescript
// ✅ Preload on hover
<Link
  href="/details"
  onMouseEnter={() => prefetchData('/details')}
>
  View Details
</Link>
```

### Category 3: Server-Side Performance — **HIGH**

#### 3.1 Per-Request Deduplication with React.cache()

Use `React.cache()` to deduplicate identical requests within a single render.

```typescript
// ✅ Automatic deduplication per request
const getCachedUser = React.cache((userId: string) =>
  fetchUser(userId)
)

export async function RenderUserInfo(userId: string) {
  // First call: fetches
  const user1 = await getCachedUser(userId)
  // Second call: returns cached result, no new request
  const user2 = await getCachedUser(userId)

  return <div>{user1.name}</div>
}
```

#### 3.2 Minimize Serialization at RSC Boundaries

Only pass necessary data to client components; keep heavy data server-side.

```typescript
// ❌ Incorrect: passes entire object to client
export async function ServerComponent() {
  const largeData = await fetchLargeDataset()
  return <ClientComponent data={largeData} />
}

// ✅ Correct: process server-side, pass minimal data
export async function ServerComponent() {
  const largeData = await fetchLargeDataset()
  const processed = processData(largeData)
  return <ClientComponent summary={processed.summary} />
}
```

#### 3.3 Parallel Data Fetching with Component Composition

Structure components to enable parallel fetches instead of nested sequential fetches.

```typescript
// ❌ Incorrect: nested sequential fetches
async function ComponentA() {
  const data = await fetchData()
  return <ComponentB data={data} />
}

async function ComponentB({ data }) {
  const moreData = await fetchMoreData(data.id) // blocked by ComponentA
  return <div>{moreData}</div>
}

// ✅ Correct: parallel composition
async function Page() {
  // Both start in parallel
  return (
    <>
      <Suspense fallback={<Skeleton />}>
        <ComponentA />
      </Suspense>
      <Suspense fallback={<Skeleton />}>
        <ComponentB />
      </Suspense>
    </>
  )
}
```

#### 3.4 Cross-Request LRU Caching

Use LRU caching for cross-request data that doesn't change frequently.

```typescript
// ✅ LRU cache for expensive operations
const lruCache = new LRU({ max: 1000 });

export async function getCachedValue(key: string) {
  if (lruCache.has(key)) {
    return lruCache.get(key);
  }

  const value = await expensiveOperation(key);
  lruCache.set(key, value);
  return value;
}
```

#### 3.5 Use after() for Non-Blocking Operations

Use the `after()` API for operations that don't need to complete before responding.

```typescript
// ✅ Non-blocking operations
import { after } from "next/server";

export async function POST(req: Request) {
  const data = await req.json();

  // Save immediately
  const result = await saveData(data);

  // These run after response is sent
  after(() => {
    sendAnalytics(result);
    updateCache(result);
  });

  return Response.json(result);
}
```

### Category 4: Client-Side Data Fetching — **MEDIUM-HIGH**

#### 4.1 Use SWR for Automatic Deduplication

Use SWR library to automatically deduplicate requests and manage cache.

```typescript
// ✅ SWR handles deduplication
import useSWR from 'swr'

export function Component() {
  const { data: user } = useSWR('/api/user', fetcher)
  const { data: settings } = useSWR('/api/user/settings', fetcher)

  // Both requests run in parallel, duplicates deduplicated
  return <div>{user?.name}</div>
}
```

#### 4.2 Deduplicate Global Event Listeners

Avoid multiple event listeners on the same element; consolidate into a single handler.

```typescript
// ❌ Incorrect: multiple listeners
useEffect(() => {
  window.addEventListener("scroll", handleScroll1);
  window.addEventListener("scroll", handleScroll2);
  window.addEventListener("scroll", handleScroll3);
}, []);

// ✅ Correct: single handler
useEffect(() => {
  const handleScroll = () => {
    handleScroll1();
    handleScroll2();
    handleScroll3();
  };
  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);
```

### Category 5: Re-render Optimization — **MEDIUM**

#### 5.1 Defer State Reads to Usage Point

Don't subscribe to state if only used in callbacks; pass to callback instead.

```typescript
// ❌ Incorrect: subscribes to state, causes re-render
const [count, setCount] = useState(0);

useEffect(() => {
  const handler = () => console.log(count);
  window.addEventListener("click", handler);
}, [count]);

// ✅ Correct: defer read to where it's used
const [count, setCount] = useState(0);
const countRef = useRef(count);

useEffect(() => {
  countRef.current = count;
}, [count]);

useEffect(() => {
  const handler = () => console.log(countRef.current);
  window.addEventListener("click", handler);
}, []);
```

#### 5.2 Extract to Memoized Components

Extract expensive computations into memoized sub-components.

```typescript
// ❌ Incorrect: parent re-render triggers expensive child
function Parent() {
  const [count, setCount] = useState(0)

  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>+</button>
      <ExpensiveChild data={data} /> {/* re-renders on parent change */}
    </>
  )
}

// ✅ Correct: memoize expensive component
const ExpensiveChild = React.memo(({ data }) => {
  // expensive computation
  return <div>{data}</div>
})

function Parent() {
  const [count, setCount] = useState(0)

  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>+</button>
      <ExpensiveChild data={data} /> {/* only re-renders if data changes */}
    </>
  )
}
```

#### 5.3 Narrow Effect Dependencies

Use primitive dependencies instead of objects; derived state instead of raw values.

```typescript
// ❌ Incorrect: object dependency causes re-run
useEffect(() => {
  fetch(`/api/user/${user.id}`);
}, [user]); // object reference changes

// ✅ Correct: use primitive dependency
useEffect(() => {
  fetch(`/api/user/${userId}`);
}, [userId]); // stable primitive
```

#### 5.4 Subscribe to Derived State

Subscribe to derived booleans instead of raw computed values.

```typescript
// ❌ Incorrect: subscribes to raw values
const isValid = name && email && phone.length > 10;

useEffect(() => {
  if (isValid) updateUI();
}, [isValid]);

// ✅ Correct: subscribe to meaningful boolean
const hasMinimalInfo = Boolean(name && email);
useEffect(() => {
  if (hasMinimalInfo) updateUI();
}, [hasMinimalInfo]);
```

#### 5.5 Use Functional setState Updates

When new state depends on previous state, use functional form for stable callbacks.

```typescript
// ❌ Incorrect: dependency on state value
const handleIncrement = () => setCount(count + 1);
useEffect(() => {
  document.addEventListener("click", handleIncrement);
}, [count]);

// ✅ Correct: functional update, stable callback
const handleIncrement = useCallback(() => setCount((c) => c + 1), []);
useEffect(() => {
  document.addEventListener("click", handleIncrement);
}, [handleIncrement]);
```

#### 5.6 Use Lazy State Initialization

Pass a function to `useState()` for expensive initial state calculations.

```typescript
// ❌ Incorrect: runs on every render
const [items, setItems] = useState(expensiveCalculation());

// ✅ Correct: runs only on mount
const [items, setItems] = useState(() => expensiveCalculation());
```

### Category 6: Rendering Performance — **MEDIUM**

#### 6.1 Use Ternary for Conditional Rendering

Use ternary operators instead of `&&` to prevent render inconsistencies.

```typescript
// ❌ Incorrect: && can render false
{isLoading && <Spinner />}

// ✅ Correct: explicit ternary
{isLoading ? <Spinner /> : null}
```

#### 6.2 Hoist Static JSX

Extract static JSX outside components to prevent recreation.

```typescript
// ❌ Incorrect: recreated on every render
function Page() {
  const header = <h1>Title</h1>
  return <div>{header}</div>
}

// ✅ Correct: hoisted static JSX
const HEADER = <h1>Title</h1>

function Page() {
  return <div>{HEADER}</div>
}
```

#### 6.3 Content Visibility Optimization

Use `content-visibility` CSS for long lists to skip rendering off-screen items.

```css
/* ✅ Skip rendering for off-screen items */
.list-item {
  content-visibility: auto;
}
```

#### 6.4 Reduce SVG Coordinate Precision

Reduce decimal places in SVG coordinates to reduce file size.

```svg
<!-- ❌ Excessive precision -->
<circle cx="123.456789" cy="456.789012" r="10" />

<!-- ✅ Necessary precision only -->
<circle cx="123.5" cy="456.8" r="10" />
```

#### 6.5 Prevent Hydration Flicker

Use inline script for client-only data to prevent hydration mismatches.

```typescript
// ✅ Set theme before hydration
<script dangerouslySetInnerHTML={{
  __html: `document.documentElement.setAttribute('data-theme', localStorage.getItem('theme') || 'light')`
}} />
```

### Category 7: JavaScript Performance — **LOW-MEDIUM**

#### 7.1 Batch DOM & CSS Changes

Group CSS changes via classes or `cssText` to avoid multiple reflows.

```typescript
// ❌ Incorrect: multiple reflows
element.style.width = "100px";
element.style.height = "100px";
element.style.backgroundColor = "red";

// ✅ Correct: single reflow
element.classList.add("resized", "highlighted");
```

#### 7.2 Use Set/Map for O(1) Lookups

Replace repeated searches with Map for instant lookups.

```typescript
// ❌ Incorrect: O(n) search
const users = [{ id: 1, name: 'Alice' }, ...]
const user = users.find(u => u.id === targetId)

// ✅ Correct: O(1) lookup
const userMap = new Map(users.map(u => [u.id, u]))
const user = userMap.get(targetId)
```

#### 7.3 Cache Object Property Access

Cache frequently accessed properties in loops.

```typescript
// ❌ Incorrect: repeated property lookups
for (let i = 0; i < items.length; i++) {
  process(items[i].value);
}

// ✅ Correct: cache property
for (let i = 0; i < items.length; i++) {
  const value = items[i].value;
  process(value);
}
```

#### 7.4 Combine Iterations

Combine multiple filter/map into single loop when possible.

```typescript
// ❌ Incorrect: multiple iterations
const nums = [1, 2, 3, 4, 5];
const filtered = nums.filter((n) => n > 2);
const doubled = filtered.map((n) => n * 2);

// ✅ Correct: single iteration
const result = [];
for (let n of nums) {
  if (n > 2) result.push(n * 2);
}
```

#### 7.5 Early Exit from Functions

Return early to avoid unnecessary processing.

```typescript
// ❌ Incorrect: processes even when not needed
function validate(user) {
  const hasName = user.name.length > 0;
  const hasEmail = user.email.includes("@");
  const isActive = user.status === "active";

  return hasName && hasEmail && isActive;
}

// ✅ Correct: early exit
function validate(user) {
  if (!user.name.length > 0) return false;
  if (!user.email.includes("@")) return false;
  if (user.status !== "active") return false;

  return true;
}
```

#### 7.6 Hoist RegExp Outside Loops

Create RegExp once, reuse in loops.

```typescript
// ❌ Incorrect: recreates RegExp each iteration
for (let item of items) {
  if (/pattern/.test(item)) process(item);
}

// ✅ Correct: hoist RegExp
const pattern = /pattern/;
for (let item of items) {
  if (pattern.test(item)) process(item);
}
```

### Category 8: Advanced Patterns — **LOW**

#### 8.1 Store Event Handlers in Refs

Use refs to avoid re-creating stable event handler references.

```typescript
// ✅ Stable handler reference
const handlerRef = useRef(null);

useEffect(() => {
  handlerRef.current = () => handleEvent();
}, []);

useEffect(() => {
  const wrapper = () => handlerRef.current?.();
  window.addEventListener("event", wrapper);
  return () => window.removeEventListener("event", wrapper);
}, []);
```

---

## UI/UX & Accessibility Guidelines

**Reference**: Web Interface Guidelines

### Keyboard Navigation

- **MUST**: Full keyboard support per [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/patterns/)
- **MUST**: Visible focus rings (`:focus-visible`; group with `:focus-within`)
- **MUST**: Manage focus (trap, move, return) per APG patterns
- **NEVER**: `outline: none` without visible focus replacement

### Touch Targets & Input

- **MUST**: Hit target ≥24px (mobile ≥44px); if visual <24px, expand hit area
- **MUST**: Mobile `<input>` font-size ≥16px to prevent iOS zoom
- **NEVER**: Disable browser zoom (`user-scalable=no`, `maximum-scale=1`)
- **MUST**: `touch-action: manipulation` to prevent double-tap zoom
- **SHOULD**: Set `-webkit-tap-highlight-color` to match design

### Forms

- **MUST**: Hydration-safe inputs (no lost focus/value)
- **NEVER**: Block paste in `<input>`/`<textarea>`
- **MUST**: Loading buttons show spinner and keep original label
- **MUST**: Enter submits focused input; in `<textarea>`, ⌘/Ctrl+Enter submits
- **MUST**: Keep submit enabled until request starts; then disable with spinner
- **MUST**: Accept free text, validate after—don't block typing
- **MUST**: Allow incomplete form submission to surface validation
- **MUST**: Errors inline next to fields; on submit, focus first error
- **MUST**: `autocomplete` + meaningful `name`; correct `type` and `inputmode`
- **SHOULD**: Disable spellcheck for emails/codes/usernames
- **SHOULD**: Placeholders end with `…` and show example pattern
- **MUST**: Warn on unsaved changes before navigation
- **MUST**: Compatible with password managers & 2FA; allow pasting codes
- **MUST**: Trim values to handle text expansion trailing spaces
- **MUST**: No dead zones on checkboxes/radios; label+control share one hit target

### State & Navigation

- **MUST**: URL reflects state (deep-link filters/tabs/pagination/expanded panels)
- **MUST**: Back/Forward restores scroll position
- **MUST**: Links use `<a>`/`<Link>` for navigation (support Cmd/Ctrl/middle-click)
- **NEVER**: Use `<div onClick>` for navigation

### Feedback & User Experience

- **SHOULD**: Optimistic UI; reconcile on response; on failure rollback or offer Undo
- **MUST**: Confirm destructive actions or provide Undo window
- **MUST**: Use polite `aria-live` for toasts/inline validation
- **SHOULD**: Ellipsis (`…`) for options opening follow-ups ("Rename…") and loading states ("Loading…")

---

## Database & Backend Patterns

### Query Performance

1. **Use composite indexes** — The schema includes optimized search indexes for common filter combinations
2. **Limit result sets** — `search_parcels_v2` caps at 1000 results maximum
3. **JSONB filtering** — Use database JSONB operators rather than client-side filtering
4. **Early filtering** — Filter in CTEs to reduce dataset size before aggregation
5. **Historical accuracy** — Use snapshot patterns instead of complex joins

### Supabase Integration

- Uses `@supabase/ssr` for server-side auth
- Server Components for initial data loading
- Client Components for interactive forms and real-time updates
- Always use `rpc()` for complex operations with database functions

### Historical Data Patterns

```typescript
// Always include temporal context in queries
const parcelAsOfDate = await supabase.rpc("get_complete_parcel_as_of_date_v2", {
  p_parcel_id: parcelId,
  p_as_of_date: "2023-01-01",
});

// Track changes through snapshots, not just current state
const changes = await supabase
  .from("parcel_snapshots_v2")
  .select("*")
  .eq("parcel_id", parcelId)
  .order("snapshot_date", { ascending: false });
```

---

## Code Quality Standards

### General Principles

1. **Implement changes rather than suggesting them** — Use tools to execute modifications
2. **Research thoroughly** — Gather context before making decisions
3. **Maintain consistency** — Follow existing patterns in the codebase
4. **Track progress** — Use todo lists for multi-step work
5. **Optimize for performance** — Consider bundle size, render cycles, and database queries
6. **Test thoroughly** — Use seed data and test realistic scenarios

### TypeScript

- Use strict mode (`strict: true` in tsconfig.json)
- Define explicit types for props, returns, and state
- Avoid `any`; use `unknown` with type guards instead
- Keep type definitions close to usage

### React Components

- Prefer Server Components (RSC) for initial data loading
- Use Client Components (`'use client'`) only when needed for interactivity
- Memoize expensive components with `React.memo()`
- Extract sub-components to avoid unnecessary re-renders
- Use stable dependencies in effects

### File Organization

```
components/
├── ui/                    # Base shadcn/ui components
├── parcel-[feature]/      # Feature-specific components
├── reviews/               # Review workflow components
└── value-stats/           # Analysis & statistics components

app/
├── [feature]/             # Feature routes
├── api/                   # API endpoints
└── (auth-pages)/          # Auth flow pages
```

### Naming Conventions

- **Components**: PascalCase (`UserProfile`, `ParcelSearch`)
- **Hooks**: camelCase starting with `use` (`useParcelData`, `useSortable`)
- **Functions**: camelCase (`fetchParcel`, `formatValue`)
- **Constants**: UPPER_SNAKE_CASE for module-level constants
- **CSS classes**: kebab-case (`form-input`, `parcel-card`)

### Error Handling

- Provide meaningful error messages to users
- Log errors server-side with context
- Use error boundaries for UI errors
- Validate input both client and server-side
- Return consistent error shapes from API routes

### Testing

Use the seed data for testing:

- 10,000+ parcels with realistic data distributions
- Multi-year historical snapshots
- Complex value scenarios with multiple methods
- Realistic approval workflow states

```bash
# Reset database with schema and seed
supabase db reset

# Run development server
npm run dev

# Build for production
npm run build
```

---

## Summary

These instructions integrate:

1. **Domain Knowledge** — Property assessment system architecture, database patterns, and workflows
2. **Performance Optimization** — 40+ rules from React best practices, organized by impact
3. **Accessibility & UX** — Web interface guidelines for keyboard, forms, navigation, and feedback
4. **Code Quality** — TypeScript, component patterns, file organization, and testing standards

**Always reference these instructions when working on the Assessor project.**
