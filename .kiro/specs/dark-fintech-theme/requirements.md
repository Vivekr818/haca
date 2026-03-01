# Requirements Document: Dark Fintech Theme

## 1. Tailwind Configuration Requirements

### 1.1 Custom Color Tokens
The system SHALL extend Tailwind configuration with custom fintech color tokens:
- `fintech-dark`: #0F172A (main background)
- `fintech-card`: #1E293B (card/surface background)
- `fintech-primary`: #2563EB (primary button)
- `fintech-primary-hover`: #1D4ED8 (button hover state)
- `fintech-accent`: #10B981 (accent text)
- `fintech-text`: #E2E8F0 (main text)
- `fintech-muted`: #94A3B8 (muted text)

### 1.2 Configuration Preservation
The system SHALL preserve all existing Tailwind configuration settings while adding new color tokens.

## 2. Global Styling Requirements

### 2.1 CSS Variables
The system SHALL define CSS variables in globals.css for all fintech colors:
- `--background`: #0F172A
- `--card-background`: #1E293B
- `--primary-button`: #2563EB
- `--primary-button-hover`: #1D4ED8
- `--accent-text`: #10B981
- `--main-text`: #E2E8F0
- `--muted-text`: #94A3B8

### 2.2 Body Styles
The system SHALL apply fintech-dark background and fintech-text color to the body element.

### 2.3 Existing Utilities Preservation
The system SHALL preserve all existing CSS utilities (glass effects, animations, gradients) while updating color references.

## 3. Landing Page Requirements

### 3.1 Background Colors
The landing page SHALL use fintech-dark (#0F172A) as the main background color.

### 3.2 Card Components
All glass-card components SHALL use fintech-card background with appropriate transparency.

### 3.3 Primary Buttons
Primary action buttons SHALL use fintech-primary (#2563EB) with fintech-primary-hover (#1D4ED8) on hover.

### 3.4 Text Colors
- Headings SHALL use fintech-text (#E2E8F0)
- Body text SHALL use fintech-muted (#94A3B8)
- Accent elements SHALL use fintech-accent (#10B981)

### 3.5 Layout Preservation
The system SHALL maintain all existing layout, spacing, and component positioning.

## 4. Apply Page Requirements

### 4.1 Form Background
The apply page SHALL use fintech-dark background for the main container.

### 4.2 Form Card Styling
The form card SHALL use fintech-card background with glass effects.

### 4.3 Input Fields
Input fields SHALL use:
- Background: fintech-card or darker variant
- Border: slate-700 or fintech-muted with transparency
- Text: fintech-text
- Placeholder: fintech-muted with transparency

### 4.4 Submit Button
The submit button SHALL use fintech-primary with fintech-primary-hover on hover state.

### 4.5 Validation Preservation
The system SHALL maintain all existing form validation logic and error display functionality.

## 5. Results Page Requirements

### 5.1 Page Background
The results page SHALL use fintech-dark as the main background.

### 5.2 Risk Badge Colors
Risk level badges SHALL maintain their semantic colors:
- Low: emerald variants (compatible with fintech-accent)
- Medium: yellow variants
- High: red variants

### 5.3 Loan Cards
Loan cards SHALL use fintech-card background with:
- Title text: fintech-text
- Label text: fintech-muted
- Value text: fintech-accent for rates, fintech-text for amounts

### 5.4 Policy Cards
Policy cards SHALL use fintech-card background with fintech-text for titles and fintech-muted for descriptions.

### 5.5 Explanation Section
The explanation section SHALL use fintech-accent with transparency for background and fintech-text for content.

## 6. Admin Page Requirements

### 6.1 Dashboard Background
The admin dashboard SHALL use fintech-dark as the main background.

### 6.2 Stat Cards
Statistics cards SHALL use fintech-card background with glass effects.

### 6.3 Table Styling
The applications table SHALL use:
- Header background: fintech-card with transparency
- Row hover: white with low transparency
- Text: fintech-text for data, fintech-muted for labels
- Borders: white with transparency

### 6.4 Icon Colors
Stat card icons SHALL maintain their semantic colors (blue, red, emerald) for visual distinction.

## 7. Layout Component Requirements

### 7.1 Root Layout
The root layout component SHALL apply fintech-dark background and fintech-text color to the body element.

### 7.2 Metadata Preservation
The system SHALL preserve all existing metadata and configuration in layout.tsx.

## 8. Accessibility Requirements

### 8.1 Color Contrast
All text-background color combinations SHALL meet WCAG AA contrast ratio requirements (minimum 4.5:1 for normal text).

### 8.2 Focus Indicators
Focus indicators SHALL use fintech-accent or fintech-primary with sufficient contrast.

### 8.3 Semantic Color Preservation
The system SHALL preserve semantic meaning of colors (success, warning, error) while adapting to the fintech palette.

## 9. Functionality Requirements

### 9.1 No Breaking Changes
The system SHALL NOT break any existing functionality including:
- Form submissions
- Navigation
- Data fetching
- Animations
- Interactive elements

### 9.2 Animation Preservation
All existing animations (fade-up, fade-in, scale-in, btn-glow) SHALL continue to work with new colors.

### 9.3 Responsive Behavior
The system SHALL maintain responsive behavior across all breakpoints (mobile, tablet, desktop).

## 10. Performance Requirements

### 10.1 Build Time
The theme implementation SHALL NOT significantly increase build time (< 5% increase acceptable).

### 10.2 Bundle Size
The theme implementation SHALL NOT significantly increase bundle size (< 2KB increase acceptable).

### 10.3 Runtime Performance
Color changes SHALL NOT cause unnecessary re-renders or performance degradation.

## 11. Testing Requirements

### 11.1 Visual Verification
All pages SHALL be visually verified to ensure correct color application.

### 11.2 Functionality Testing
All interactive elements SHALL be tested to ensure functionality is preserved.

### 11.3 Accessibility Testing
Color contrast SHALL be verified using automated tools (e.g., axe, Lighthouse).

### 11.4 Cross-Browser Testing
The theme SHALL be tested on major browsers (Chrome, Firefox, Safari, Edge).

## 12. Documentation Requirements

### 12.1 Color Token Documentation
All custom color tokens SHALL be documented with their hex values and use cases.

### 12.2 Migration Guide
A guide SHALL be provided for future color updates or theme modifications.

## Acceptance Criteria

The dark fintech theme implementation is complete when:

1. All seven custom color tokens are defined in Tailwind config
2. All CSS variables are defined in globals.css
3. Landing page uses fintech color palette consistently
4. Apply page form uses fintech colors for all elements
5. Results page displays with fintech colors and maintains readability
6. Admin dashboard uses fintech colors for all components
7. All pages maintain their original layout and spacing
8. All interactive functionality works without errors
9. Color contrast meets WCAG AA standards
10. No visual regressions are introduced
11. Build completes successfully without errors
12. Application loads and navigates correctly in production mode
