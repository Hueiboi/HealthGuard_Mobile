# Design System – Vitalis Clinical Mobile App

## Mission
Create implementation-ready, token-driven UI guidance for HealthGuard that is optimized for consistency, accessibility, and high-performance delivery across the health management mobile ecosystem.

## Brand Identity
- **Product Name:** HealthGuard
- **Industry:** Healthcare / AI Diagnosis
- **Core Value:** Clean, Trustworthy, Modern, and Professional.
- **Target Audience:** Patients, Healthcare Providers, and Authenticated Users.

## Style Foundations (Tokens)
Design tokens are the visual atoms of our design system. Use these tokens instead of hardcoded values.

### Color Palette
| Token | Hex Value | Description |
| :--- | :--- | :--- |
| `color.brand.primary` | `#004AAD` | Core blue used for CTAs (Start Diagnosis, Login) |
| `color.brand.secondary` | `#00C2FF` | Accent blue for icons and secondary highlights |
| `color.surface.base` | `#FFFFFF` | Main background color (Light Mode) |
| `color.surface.muted` | `#F2F3F2` | Subtle gray for card backgrounds and input fields |
| `color.text.primary` | `#181725` | Deep navy/black for headings and main text |
| `color.text.secondary` | `#7C7C7C` | Medium gray for subtitles and captions |
| `color.status.success` | `#53B175` | Green for "Completed" or "Healthy" indicators |
| `color.status.error` | `#F24E1E` | Red for alerts or abnormal health metrics |

### Typography (Scale: Inter)
- **Base Font:** `Inter, sans-serif`
- **Scale:**
  - `font.size.h1`: `26px` (Semibold) - Welcome/Heading
  - `font.size.h2`: `20px` (Semibold) - Section titles
  - `font.size.body`: `16px` (Regular) - Standard content
  - `font.size.caption`: `13px` (Regular) - Small details/Unit labels

### Spacing & Radius
- **Spacing Scale:** `4px` (Base unit) -> `space.1=4px`, `space.2=8px`, `space.3=12px`, `space.4=16px`, `space.5=24px`
- **Radius:**
  - `radius.sm`: `8px` (Small buttons/inputs)
  - `radius.md`: `18px` (Standard Cards - Health Status, Article cards)
  - `radius.full`: `999px` (Circle buttons, Profile avatars)

---

## Component Guidance

### 1. Primary Button (Actionable)
- **Anatomy:** `background: color.brand.primary`, `text: color.surface.base`, `radius: radius.md`.
- **States:**
  - `Default`: High contrast, solid fill.
  - `Pressed`: 10% dark overlay.
  - `Disabled`: Opacity 50%, no interaction.
  - `Loading`: Replace text with `ActivityIndicator`.

### 2. Information Cards (Health Metrics)
- **Anatomy:** `background: color.surface.base`, `border: 1px solid color.surface.muted`, `shadow: shadow.subtle`.
- **Content:** Must include an icon (left/top), a label, and a primary value (e.g., 72 bpm).

### 3. Inputs (Phone/OTP)
- **Anatomy:** `border-bottom: 1px solid color.surface.muted`, `font: font.size.body`.
- **Focus State:** `border-bottom: 2px solid color.brand.primary`.

---

## Accessibility (WCAG 2.2 AA)
- **Contrast:** Ensure text color vs background meets at least 4.5:1 ratio.
- **Touch Target:** All interactive elements must have a minimum touch area of `44x44dp`.
- **Legibility:** Never use `font.size` smaller than `12px` for critical health information.

## Rules: Do
- Use **Semantic Tokens** (e.g., `color.brand.primary`) in code, not raw hex.
- Maintain consistent spacing using the `4px` multiplier.
- Provide clear visual feedback for every user interaction (tap/press).

## Rules: Don't
- Do not introduce new colors without updating the palette.
- Do not use hard edges (radius=0) for modern mobile components.
- Do not overcrowd the "Diagnosis" screen with non-essential text.
