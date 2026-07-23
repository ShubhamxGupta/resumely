# Design System & UI/UX Specification — Resumely

## 1. Design System Tokens

### 1.1 Color Tokens

Resumely uses a curated HSL color system designed for high contrast and readability across dark and light themes.

```css
:root {
  /* Primary Brand Palette */
  --brand-50: #eef2ff;
  --brand-100: #e0e7ff;
  --brand-500: #6366f1; /* Primary Accent */
  --brand-600: #4f46e5; /* Primary Hover */
  --brand-700: #4338ca;

  /* Semantic Status Colors */
  --color-success: #10b981; /* High ATS Score / Matched Skill */
  --color-warning: #f59e0b; /* Medium ATS Score / Partial Match */
  --color-danger: #ef4444; /* Low ATS Score / Missing Critical Skill */
  --color-info: #3b82f6;

  /* Dark Mode Surfaces */
  --surface-base: #0f172a; /* Slate 900 */
  --surface-card: #1e293b; /* Slate 800 */
  --surface-border: #334155; /* Slate 700 */
  --surface-overlay: rgba(30, 41, 59, 0.7);

  /* Typography Colors */
  --text-primary: #f8fafc; /* Slate 50 */
  --text-secondary: #94a3b8; /* Slate 400 */
  --text-muted: #64748b; /* Slate 500 */
}
```

### 1.2 Spacing & Grid System

- **Base Grid**: 8px baseline grid (`8px`, `16px`, `24px`, `32px`, `48px`, `64px`).
- **Container Max Width**: `1200px` for main content area.
- **Card Padding**: `24px` (`1.5rem`) on desktop; `16px` (`1rem`) on mobile.

---

## 2. Typography & Hierarchy

| Element                 | Font Family    | Weight          | Size (Desktop)    | Size (Mobile)      | Line Height |
| :---------------------- | :------------- | :-------------- | :---------------- | :----------------- | :---------- |
| **H1 (Page Title)**     | Inter / Outfit | Bold (700)      | 28px (`1.75rem`)  | 22px (`1.375rem`)  | 1.2         |
| **H2 (Section Header)** | Inter / Outfit | Semi-Bold (600) | 20px (`1.25rem`)  | 18px (`1.125rem`)  | 1.3         |
| **H3 (Card Title)**     | Inter          | Medium (500)    | 16px (`1rem`)     | 15px (`0.9375rem`) | 1.4         |
| **Body (Regular)**      | Inter          | Regular (400)   | 14px (`0.875rem`) | 14px (`0.875rem`)  | 1.5         |
| **Caption / Small**     | Inter          | Regular (400)   | 12px (`0.75rem`)  | 12px (`0.75rem`)   | 1.4         |

---

## 3. UI Component Behaviors & States

### 3.1 Upload Hero Section

- **Default State**: Drag-and-drop box with subtle dashed border (`2px dashed #334155`), upload icon, and text "Drag and drop your resume here (.pdf, .docx, .doc up to 5MB)".
- **Hover State**: Border shifts to primary brand color (`#6366f1`), background illuminates with 5% primary tint.
- **Active / Success State**: Solid success border (`#10b981`), file details card showing filename, file size, and green checkmark badge (`✅`).

### 3.2 Score Gauge & Component Breakdown Cards

- **Overall Score Card**: Large hero card presenting composite score (0–100) with color-coded score circle:
  - **80–100**: Green (`#10b981`) — "Excellent ATS Compatibility"
  - **60–79**: Amber (`#f59e0b`) — "Good Compatibility — Minor Tweaks Recommended"
  - **0–59**: Red (`#ef4444`) — "Poor Compatibility — Major Revisions Required"
- **Component Progress Bars**: Five progress bars showing component scores (Formatting, Keywords, Content, Skill Validation, ATS Compatibility). Smooth CSS transition animation (`transition: width 0.6s ease-out`).

### 3.3 Interactive Action & Download Bar

- Single unified **Export Analysis Report** panel situated at the bottom of the results view:
  - **Primary Action Button**: "📑 Generate PDF Report" (Triggers backend PDF compilation).
  - **Secondary Action Button**: "📄 Download Summary (.txt)" (Instant client-side text download).
  - **Download Trigger**: Once PDF compilation finishes, button transforms to "⬇️ Download PDF Report".

---

## 4. Responsive & Accessibility Guidelines

### 4.1 Accessibility Standards (WCAG 2.1 AA)

- **Contrast Ratio**: Minimum contrast ratio of 4.5:1 for body text against dark surface background.
- **Form Controls**: All inputs have explicit `<label>` tags and ARIA labels.
- **Keyboard Navigation**: Full tab index order across sidebar controls, file upload widgets, and buttons.

### 4.2 Responsive Breakpoints

- **Desktop**: `≥ 1024px` — Two-column layout (Sidebar navigation + Main content dashboard).
- **Tablet**: `768px – 1023px` — Single-column layout; collapsible sidebar drawer.
- **Mobile**: `< 768px` — Full-width single-column layout; metrics stacked vertically.
