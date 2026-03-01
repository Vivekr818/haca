# Color Palette Quick Reference

## Fintech Theme Colors

### Visual Reference

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  #0F172A  fintech-dark       ████████  Main Background     │
│  #1E293B  fintech-card       ████████  Card Background     │
│  #2563EB  fintech-primary    ████████  Primary Button      │
│  #1D4ED8  fintech-primary-hover ████  Button Hover         │
│  #10B981  fintech-accent     ████████  Accent/Success      │
│  #E2E8F0  fintech-text       ████████  Main Text           │
│  #94A3B8  fintech-muted      ████████  Secondary Text      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Quick Usage Guide

### Backgrounds
```tsx
bg-fintech-dark        // Main page background
bg-fintech-card        // Cards, forms, containers
```

### Text
```tsx
text-fintech-text      // Headings, primary text
text-fintech-muted     // Labels, descriptions
text-fintech-accent    // Success, highlights
```

### Buttons
```tsx
bg-fintech-primary hover:bg-fintech-primary-hover
```

### Borders
```tsx
border-fintech-muted/20    // Subtle borders
border-fintech-accent/30   // Accent borders
```

## Color Combinations

### High Contrast (Best for Readability)
- `text-fintech-text` on `bg-fintech-dark` (12:1)
- `text-fintech-text` on `bg-fintech-card` (10:1)
- `text-white` on `bg-fintech-primary` (8:1)

### Medium Contrast (Good for Secondary Content)
- `text-fintech-muted` on `bg-fintech-dark` (7:1)
- `text-fintech-muted` on `bg-fintech-card` (6:1)

### Accent Combinations
- `text-fintech-accent` on `bg-fintech-dark` (8:1)
- `bg-fintech-accent/10` with `text-fintech-accent` (badges)

## Common Patterns

### Card Component
```tsx
<div className="glass-card">
  <h3 className="text-fintech-text">Title</h3>
  <p className="text-fintech-muted">Description</p>
</div>
```

### Primary Button
```tsx
<button className="bg-fintech-primary hover:bg-fintech-primary-hover text-white px-6 py-3 rounded-lg btn-glow">
  Click Me
</button>
```

### Form Input
```tsx
<input
  className="bg-fintech-card border border-fintech-muted/20 text-fintech-text placeholder-fintech-muted/50 focus:ring-2 focus:ring-fintech-primary"
  placeholder="Enter text"
/>
```

### Badge/Tag
```tsx
<span className="bg-fintech-accent/20 text-fintech-accent border border-fintech-accent/30 px-3 py-1 rounded-full">
  Tag
</span>
```

## Semantic Colors

### Success/Positive
- Use `fintech-accent` (#10B981)
- Example: Success messages, positive indicators

### Warning/Caution
- Use `yellow-500` or `amber-500`
- Example: Warning messages, medium risk

### Error/Danger
- Use `red-500` or `red-400`
- Example: Error messages, high risk, validation errors

### Info/Neutral
- Use `fintech-primary` (#2563EB)
- Example: Info messages, links, primary actions

## Opacity Modifiers

Tailwind opacity modifiers work with all colors:

```tsx
bg-fintech-card/50      // 50% opacity
text-fintech-muted/70   // 70% opacity
border-fintech-accent/30 // 30% opacity
```

## CSS Variables

For custom CSS, use these variables:

```css
var(--background)              /* #0F172A */
var(--card-background)         /* #1E293B */
var(--primary-button)          /* #2563EB */
var(--primary-button-hover)    /* #1D4ED8 */
var(--accent-text)             /* #10B981 */
var(--main-text)               /* #E2E8F0 */
var(--muted-text)              /* #94A3B8 */
```

## Accessibility Checklist

✅ All text meets WCAG AA contrast (4.5:1 minimum)
✅ Focus indicators are visible
✅ Color is not the only indicator of state
✅ Semantic colors maintain meaning
✅ Reduced motion preferences respected

## Tips

1. **Consistency**: Always use fintech tokens, not arbitrary colors
2. **Contrast**: Test combinations with DevTools
3. **Opacity**: Use `/` modifier for transparency
4. **Hover States**: Always provide visual feedback
5. **Dark Theme**: All colors are optimized for dark backgrounds

## Need Help?

- See full documentation: `THEME_DOCUMENTATION.md`
- Check Tailwind docs: https://tailwindcss.com/docs
- Test contrast: https://webaim.org/resources/contrastchecker/

---

**Quick Tip**: Use `glass-card` class for instant themed card styling!
