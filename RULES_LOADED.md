# Rules Loaded for Jam Page Refactoring

**Task:** Refactor Jam page with skill-adaptive UX - conditional rendering based on skill level (beginner/intermediate/expert), remove duplicate SkillLevelSelector, consolidate Jam + Compose pages, mobile-first responsive design

**Category:** component_ui
**Technologies:** React, TailwindCSS, responsive design, conditional rendering, Zustand state

---

## RULE 1: Component Architecture (`components.md`)

### Function Keyword & Structure

```tsx
'use client'

// Module-level pure utilities
function filterBlogs(blogs: BlogPost[], query: string) {
  return blogs.filter(b => b.title.includes(query))
}

export function BlogPage() {
  const {data} = useBlogPosts()  // 1. Hooks
  const filtered = filterBlogs(data, query)  // 2. Computed
  const onDelete = useCallback(async (id) => await deleteBlog(id), [])  // 3. Handlers
  return <div>{renderContent()}</div>  // 4. JSX
  function renderContent() { return <div>{filtered.map(renderPost)}</div> }  // 5. Helpers
}
```

**Exports**: `export function FeaturePage()` | `export async function ServerComponent()`

❌ `const Component = () => {}`

### Icons

```tsx
import {Icon, Icons} from '@/app/components/icons';
<Icon name={Icons.Home} />

import {Plus} from 'lucide-react';
<Button><Plus className="size-4" />Create</Button>
```

**Button icon spacing**: Never add manual margins (`mr-*`, `ml-*`) to icons inside buttons. The Button component provides automatic `gap-2` spacing.

❌ `<Button><Icon className="mr-2 size-4" />Text</Button>`
✅ `<Button><Icon className="size-4" />Text</Button>`

### State Management

- **Local**: `useState`
- **Forms**: React Hook Form
- **Specific Page**: React Context
- **Global UI**: Zustand (`app/stores/`)
- **Server**: TanStack Query via feature hooks
- **Session**: `useSession`

### Performance

```tsx
// Memo
export const List = memo(function List({items}: Props) {
  return <div>{items.map(renderItem)}</div>
})

// Lazy
const Modal = lazy(() => import('./Modal').then(m => ({default: m.Modal})));
<Suspense fallback={<Spinner />}><Modal /></Suspense>

// Memoize values/callbacks
const filtered = useMemo(() => items.filter(i => i.published), [items])
const onClick = useCallback(() => save(), [save])
```

### Styling

```tsx
import {cn} from '@/app/utils/cn';
<div className={cn('rounded-lg p-4', isError && 'bg-destructive', className)} />
```

❌ `className={\`...\`}`

### Feature Integration

```tsx
import {useCompanies, useCreateCompany} from '@/app/features/companies/hooks'

const {data: companies} = useCompanies()
const createCompany = useCreateCompany()
```

❌ Direct TanStack or API calls

### Testing

```tsx
<Button data-testid="create-button">Create</Button>
<div data-testid="blog-list">{posts.map(renderPost)}</div>
```

### Anti-Patterns

❌ Arrow: `const C = () => {}`
❌ Alt UI: `@mui`, Chakra
❌ Inline styles/CSS modules
❌ Direct: `useQuery`, `fetch`
❌ Template: `className={\`\`}`
❌ Suffix: `*Client.tsx`

✅ Function, feature hooks, Radix, cn

---

## RULE 2: Styling Standards (`styling.md`)

### Design System

- `app/components/ui/**` defines shared building blocks with Radix + Tailwind 4 + CVA
- `lib/cn.ts` exports `cn`, required for composing class names

```tsx
import {Button} from '@/app/components/ui/button';

<Button variant="secondary" size="sm">Save</Button>
```

### Styling Approach

- Tailwind CSS 4 via `@import "tailwindcss"` in `app/globals.css`
- `cn` combines classes safely (clsx + tailwind-merge)
- `class-variance-authority` for variant matrices
- Attribute-driven selectors (`data-slot`, `data-state`, `aria-invalid`)

✅ Use `cn` for conditional styles:

```tsx
<div className={cn('flex flex-col gap-4', className)}>{children}</div>
```

❌ Avoid template string branching

```tsx
<div className={`rounded-lg ${isUser ? 'bg-primary' : 'bg-muted'}`}>{body}</div>
```

### Layout Conventions

- `app/layout.tsx` wraps authenticated routes with `SidebarProvider`, `SidebarInset`, `AppShellHeader`
- `AppShellLayout` for granular composition: header slot, navigation widths, optional aside
- Page-level components adopt Tailwind `container` + explicit width caps (`max-w-6xl`, `max-w-7xl`)
- Balanced gaps (`gap-6`) and consistent padding (`p-4`, `p-6`)

```tsx
<div className="container max-w-7xl mx-auto grid gap-6 p-6"><ThreadList/></div>
```

### Responsiveness

Leans on Tailwind breakpoints (`md:grid-cols-3`, `max-sm:hidden`) combined with component-defined selectors (`group-data-[collapsible=icon]`, `@md/field-group`)

### Button Variants

**Primary (filled)** — Reserve for actions that commit state changes: mutations, server actions, form submissions

**Secondary (bordered, default)** — Navigation, filtering, UI controls, exploratory actions

**Destructive** — Deletion, removal, irreversible operations

**Ghost/Link** — Low-emphasis actions like "Cancel"

**Anti-pattern:** Never override variants with inline `className` color utilities.

### Tokens & Variables

- `app/globals.css` defines OKLCH design tokens
- `@theme inline` maps custom properties onto Tailwind token names
- Dark mode via `@custom-variant dark`

### Rules

1. Pull UI atoms from `app/components/ui/**`; extend via `className`, `cva` variants
2. Wrap all conditional class logic in `cn(...)`
3. Use semantic utility tokens (`bg-card`, `text-muted-foreground`, `text-destructive`)
4. Add design tokens only inside `app/globals.css`
5. Compose authenticated pages within established shell
6. Structure page bodies with `container` width caps, consistent padding/gaps
7. Build forms with shared helpers (`Form`, `Field`, `InputGroup`)
8. Do not add `.module.css` or inline style hacks

---

## RULE 3: Code Standards (`code-standards.md`)

### Core Principles

- **Self-documenting code**: Explicit names, focused functions
- **Do One Thing**: Single responsibility
- **DRY**: Eliminate repetition via abstraction
- **Type safety**: Always find correct types
- **Fail fast**: Validate early, throw clear errors
- **Async loading**: Must always have delightful UX

### Function Standards

**Naming:**
```ts
function validateBlogPost(post: BlogPost): ValidationResult {}
function createSubscription(companyId: string, planId: string): Subscription {}
function calculateUsageRemaining(usage: number, limit: number): number {}
```

**Single Responsibility:**
```ts
async function handleUserSignup(email: string, password: string): Promise<User> {
  const user = await createUser(email, password)
  await postSignupActions(user)
  return user
}

async function postSignupActions(user: User): Promise<void> {
  await Promise.all([
    sendWelcomeEmail(user),
    createDefaultCompany(user),
    trackSignupEvent(user),
  ])
}
```

**Early Returns:**
```ts
function isEligibleForTrial(user: User, company: Company): boolean {
  if (!user.email) return false
  if (company.subscription.isEligible) return true
  return true
}
```

### Prohibited Patterns

- ❌ TODO/FIXME in committed code
- ❌ `console.log()` — only use error-tracker and logger
- ❌ Magic numbers/strings — always use constants

### Error Handling

Service layer functions MUST use `withServiceErrorHandling`:

```ts
import {withServiceErrorHandling} from '@/app/utils/service-error-handler'

export async function createBlogPost(input: CreatePostInput): Promise<BlogPost> {
  return withServiceErrorHandling(
    async () => {
      const repository = repositoryFactory.getBlogPostRepository()
      return repository.create(input)
    },
    {
      service: 'blog-posts',
      companyId: input.companyId,
    }
  )
}
```

### Comments

✅ Explain WHY for complex logic only

```ts
// Use exponential backoff to avoid overwhelming API during rate limit recovery
await retry(operation, {
  maxAttempts: 5,
  backoff: (attempt) => Math.pow(2, attempt) * 1000,
})
```

When to comment:
- Complex business logic
- Non-obvious constraints
- Temporary workarounds
- Performance trade-offs

### File Naming

```
Components: PascalCase
UserSettings.tsx
ProfilePage.tsx

Utilities: kebab-case (never in @/lib, always in @/app/utils)
date-formatter.ts

Hooks: camelCase starting with 'use'
useBlogPosts.ts

Types: kebab-case with .types.ts
billing.types.ts
```

---

## IMPLEMENTATION GUIDANCE FOR JAM PAGE REFACTORING

**Key Patterns to Apply:**

1. **Skill-Adaptive Rendering**: Use Zustand store to manage skill level state, conditional rendering with `cn()` for styling variants
2. **Remove Duplication**: Consolidate SkillLevelSelector into single store consumer, eliminate page separation
3. **Mobile-First Responsive**: Leverage Tailwind breakpoints (`max-sm:`, `md:`, `lg:`) and responsive variants
4. **Component Structure**: Follow function keyword pattern with hooks → computed → handlers → JSX → helpers
5. **Styling**: Use semantic tokens, `cn()` for conditionals, avoid template strings and inline styles
6. **State**: Zustand for global UI state (skill level), Context for page-specific state if needed
7. **Performance**: Memoize expensive filters/computations, lazy-load skill-specific sections
8. **Testing**: Add `data-testid` attributes for skill level indicators

---

**Generated:** 2025-12-13
**Rules Source:** jamium/rules/ directory (components.md, styling.md, code-standards.md)
