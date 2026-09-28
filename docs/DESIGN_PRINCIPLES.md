# Vision Eye Care — Frontend Design Principles

Use this file together with `BUILD_GUIDE.md` and `DEVELOPMENT_PHASES.md`.

These principles are mandatory for every customer-facing and admin interface.

## 1. Conversion First
- Clear primary CTA on every important page.
- Minimize unnecessary clicks.
- Prioritize: Discover → Evaluate → Cart → Checkout → Purchase.
- Do not add visual elements that distract from purchasing.

## 2. Product-First Design
Product cards and product pages must clearly show:
- High-quality image
- Product name
- Price and discount
- Rating
- Stock status
- Important specifications
- Add to Cart
- Buy Now
- Wishlist

Use consistent product image ratios.

## 3. Visual Hierarchy
Every page must clearly communicate:
1. What is this?
2. What is important?
3. What should the user do next?

Use typography, size, spacing, contrast, positioning, and whitespace.

## 4. Vision Eye Care Brand System

```text
Black        #050505
Dark Black   #0B0B0B
Neon Yellow  #DFFF00
White        #FFFFFF
Light Gray   #F4F4F4
Dark Gray    #171717
Muted Gray   #A1A1A1
```

Rules:
- Black/dark colors are the foundation.
- Neon yellow is the main accent.
- Use neon yellow mainly for actions, highlights, active states, badges, and important accents.
- Do not make the whole interface neon yellow.
- Maintain strong contrast.
- Do not introduce random colors.

## 5. Consistency
Keep consistent:
- Buttons
- Cards
- Inputs
- Typography
- Icons
- Borders
- Radius
- Shadows
- Spacing
- Navigation
- Notifications
- Tables
- Modals

Build reusable components instead of styling every page independently.

## 6. Simplicity
Prefer:
- Clean layouts
- Short content
- Clear sections
- Progressive disclosure
- Useful filters
- Simple navigation
- Minimal visual noise

Avoid unnecessary cards, badges, animations, and information.

## 7. Information Architecture
Users should always understand:
- Where they are
- Where they can go
- What they can do next

Use logical categories, breadcrumbs, and clear navigation.

## 8. Search & Product Discovery
Provide:
- Search
- Search suggestions where useful
- Category filters
- Price filters
- Product attribute filters
- Sorting
- Pagination
- Related products
- Recommendations where appropriate

Filters must be easy to clear.

## 9. Mobile-First
Test at:

```text
360px
390px
768px
1024px
1280px
1440px+
```

Ensure:
- Large touch targets
- Easy navigation
- Responsive product grids
- Mobile filters
- Easy cart access
- Easy checkout
- No horizontal overflow

Do not simply shrink the desktop layout.

## 10. Performance
Prioritize:
- Optimized images
- Lazy loading
- Efficient API calls
- Pagination
- Code splitting where useful
- Lightweight components
- Minimal unnecessary animations

Performance is part of the design.

## 11. UI States
Every important component should consider:

```text
Default
Hover
Active
Focus
Loading
Disabled
Success
Error
Empty
```

Never leave users with blank or broken-looking screens.

## 12. User Feedback
Every important action must provide feedback.

Examples:
- Add to cart → confirmation
- Wishlist → visual state change
- Form submit → success/error
- Delete → confirmation
- Save → success notification
- API loading → loading state

## 13. Checkout UX
Preferred flow:

```text
Cart → Shipping → Payment → Review → Place Order
```

Rules:
- Minimize unnecessary fields.
- Clearly show subtotal, shipping, discount, and total.
- Make the final CTA obvious.
- Avoid unnecessary distractions.

## 14. Trust
Use appropriate placement of:
- Reviews
- Ratings
- Delivery information
- Return information
- Payment information
- Stock information
- Contact/support information

Never use fake reviews, ratings, or misleading claims.

## 15. Accessibility
Use:
- Semantic HTML
- Proper labels
- Keyboard navigation
- Visible focus states
- Alt text
- Sufficient contrast
- Accessible buttons/forms

Do not rely only on color to communicate information.

## 16. Responsive Design System
Create reusable tokens for:
- Colors
- Typography
- Spacing
- Border radius
- Shadows
- Breakpoints
- Buttons
- Inputs
- Cards

Do not invent new styling for every page.

## 17. Animation
Use subtle animations only when they improve usability.

Good:
- Button hover
- Card hover
- Image transitions
- Modal transitions
- Cart feedback

Avoid:
- Excessive effects
- Long animations
- Distracting motion
- Animations that delay interaction

## 18. Admin Design
The admin panel should be professional and productive.

Prioritize:
- Clear sidebar
- Strong information hierarchy
- Search
- Filters
- Tables
- Pagination
- Forms
- Status badges
- Confirmation dialogs
- Useful dashboard statistics

## 19. Avoid Generic Ecommerce Design
Vision Eye Care should have a recognizable identity through:
- Black foundation
- Neon-yellow accents
- Premium eyewear photography
- Strong typography
- Consistent spacing
- Clean product presentation
- Distinctive CTA styling

## 20. Component Reusability
Create reusable components such as:

```text
Navbar
Footer
ProductCard
ProductGrid
ProductFilters
SearchBar
Button
Input
Modal
Toast
Pagination
RatingStars
ProductGallery
CartItem
OrderSummary
Skeleton
EmptyState
```

Do not duplicate repeated UI code.

## 21. No Broken or Fake UI
Do not leave:
- Dead buttons
- Fake links
- Placeholder functionality
- Static ecommerce actions
- Broken navigation
- Unconnected forms
- Fake statistics

If a UI element exists, it should work.

## 22. Final Design Check

### Visual
- [ ] Consistent black/neon-yellow branding
- [ ] Strong hierarchy
- [ ] Good spacing
- [ ] Consistent typography
- [ ] Consistent components
- [ ] Product-focused layout

### UX
- [ ] Clear navigation
- [ ] Clear CTAs
- [ ] Easy product discovery
- [ ] Simple checkout
- [ ] Useful feedback
- [ ] Loading/error/empty states

### Responsive
- [ ] Mobile
- [ ] Tablet
- [ ] Desktop
- [ ] No horizontal overflow

### Accessibility
- [ ] Keyboard usable
- [ ] Labels present
- [ ] Focus states
- [ ] Alt text
- [ ] Good contrast

### Performance
- [ ] Optimized images
- [ ] Efficient API usage
- [ ] No unnecessary animations
- [ ] No obvious performance problems

# Agent Rule

For every phase in `DEVELOPMENT_PHASES.md`:

1. Follow `BUILD_GUIDE.md`.
2. Apply every relevant principle in this file.
3. Inspect existing components before creating duplicates.
4. Keep the Vision Eye Care design system consistent.
5. Do not sacrifice usability for visual effects.
6. Test responsive behavior.
7. Fix visual and UX issues before moving to the next phase.

**The final result must feel like a professional, premium ecommerce product—not a basic template or collection of separate pages.**
