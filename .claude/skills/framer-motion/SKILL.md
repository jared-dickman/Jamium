---
name: framer-motion
description: Auto-invoked when adding animations or motion effects. Ensures buttery-smooth 60fps animations using Motion (Framer Motion) patterns.
auto_trigger: true
keywords: [animation, motion, framer, animate, transition, gesture, drag, layout, variants]
---

# Framer Motion Expert

**Mode**: Animation Architect - Creates performant, buttery-smooth animations following Motion best practices

## Core Principles

**Performance first** - Animations run outside React render cycle
**useMotionValue for real-time** - Direct updates bypass React reconciliation
**Layout prop sparingly** - Disable during drag/real-time interactions
**Variants for orchestration** - Named states over inline objects
**Exit animations require AnimatePresence** - Direct child constraint

## Quick Reference

### Import

```typescript
// Client components
import { motion, useMotionValue, AnimatePresence } from 'motion/react'

// React Server Components (Next.js)
import * as motion from 'motion/react-client'
```

### Performance Patterns

**Real-time tracking (drag, scroll, cursor):**

```typescript
// Motion values bypass React - instant updates
const x = useMotionValue(0)
const y = useMotionValue(0)

const handlePointerMove = (e: PointerEvent) => {
  x.set(e.clientX)  // No re-render!
  y.set(e.clientY)
}

<motion.div style={{ x, y }} />
```

**Derived values:**

```typescript
const x = useMotionValue(0)
const opacity = useTransform(x, [0, 100], [0, 1])
const scale = useTransform(x, [0, 100], [1, 1.5])

<motion.div style={{ x, opacity, scale }} />
```

### Animation Patterns

**Enter/exit:**

```typescript
<AnimatePresence>
  {isVisible && (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    />
  )}
</AnimatePresence>
```

**Variants for state machines:**

```typescript
const variants = {
  idle: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
}

<motion.button
  variants={variants}
  initial="idle"
  whileHover="hover"
  whileTap="tap"
/>
```

**Layout animations:**

```typescript
// Animates size/position changes automatically
<motion.div layout>
  {items.map(item => (
    <motion.div key={item.id} layout />
  ))}
</motion.div>
```

### Gestures

**Drag:**

```typescript
<motion.div
  drag
  dragConstraints={{ left: 0, right: 300, top: 0, bottom: 300 }}
  dragElastic={0.1}
  whileDrag={{ scale: 1.1 }}
/>
```

**Scroll-triggered:**

```typescript
<motion.div
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true, margin: "-100px" }}
/>
```

## Anti-Patterns

❌ **React state for real-time updates:**

```typescript
// BAD: Causes re-renders every frame
const [x, setX] = useState(0)
onPointerMove={(e) => setX(e.clientX)}
```

✅ **useMotionValue for real-time:**

```typescript
const x = useMotionValue(0)
onPointerMove={(e) => x.set(e.clientX)}
```

---

❌ **Layout during drag:**

```typescript
// BAD: Layout animations fight with drag
<motion.div layout drag />
```

✅ **Disable layout while dragging:**

```typescript
const [isDragging, setIsDragging] = useState(false)
<motion.div layout={!isDragging} drag />
```

---

❌ **RAF batching for drag:**

```typescript
// BAD: Adds frame delay
requestAnimationFrame(() => setPosition(pos))
```

✅ **Direct motion value updates:**

```typescript
// GOOD: Instant, no delay
motionX.set(e.clientX)
```

---

❌ **Exit without AnimatePresence:**

```typescript
// BAD: Exit won't animate
{isVisible && <motion.div exit={{ opacity: 0 }} />}
```

✅ **Wrap with AnimatePresence:**

```typescript
<AnimatePresence>
  {isVisible && <motion.div exit={{ opacity: 0 }} />}
</AnimatePresence>
```

## Validation

```bash
# Check for common anti-patterns
grep -r "useState.*position\|useState.*x\|useState.*y" frontend/components --include="*.tsx" | grep -v "// ok"

# Find motion components without proper imports
grep -r "motion\." frontend/components --include="*.tsx" -l | xargs grep -L "from 'motion/react"
```

## Project Patterns

**Buddy panel drag** - Uses useMotionValue for x/y, syncs to state on drop only
**Loader animations** - Variants for state transitions
**Page transitions** - AnimatePresence with exit animations

## References

- [Motion docs](https://motion.dev/docs/react) - Official documentation
- [motion values](https://motion.dev/docs/react-motion-value) - Real-time updates
- [layout animations](https://motion.dev/docs/react-layout-animations) - Auto-animate layout
- `frontend/components/agent/CoreAgentBuddy.tsx` - Drag implementation example
