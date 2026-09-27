# TASK: Redesign Existing Glasses E-commerce Website — HEAVN-Inspired Premium Product Experience

You are working inside an EXISTING glasses/sunglasses e-commerce website.

IMPORTANT:
- Do NOT rebuild the project from scratch.
- Do NOT replace the existing architecture.
- Do NOT remove existing business logic.
- Do NOT break existing authentication, cart, checkout, products, database, APIs, admin functionality, or responsive behavior.
- Preserve the existing Next.js + TypeScript + MySQL architecture and all currently working functionality.
- Your task is primarily a FRONTEND DESIGN / UX / INTERACTION transformation.
- Inspect the existing codebase before making changes.
- Reuse existing components, product data, APIs, image assets, and design tokens wherever possible.
- Modify the current website rather than creating a separate demo website.

REFERENCE WEBSITE:
https://heavn-one.webflow.io/

Use the HEAVN One website as a DESIGN REFERENCE for:
- visual storytelling
- cinematic product presentation
- typography scale
- whitespace
- scroll experience
- section transitions
- product-focused layouts
- sticky elements
- image transitions
- parallax
- progressive storytelling
- premium/minimal aesthetic
- CTA placement
- feature presentation
- specification presentation
- conversion sections

Do NOT copy HEAVN's branding, text, logo, product identity, exact artwork, or proprietary assets.

The final website must clearly belong to the GLASSES brand.

==================================================
1. CORE DESIGN DIRECTION
==================================================

Transform the current glasses website from a conventional e-commerce layout into a:

PREMIUM + MINIMAL + CINEMATIC + EDITORIAL + PRODUCT-FIRST

experience.

Think:

Apple product page
+
high-end eyewear campaign
+
HEAVN-style scrolling storytelling
+
modern fashion editorial
+
premium e-commerce.

The website should feel expensive, sophisticated, modern and intentional.

Avoid:
- generic e-commerce grids everywhere
- excessive cards
- excessive borders
- excessive gradients
- unnecessary shadows
- cramped layouts
- tiny typography
- too many colors
- excessive buttons
- template-like sections

Use:
- large typography
- dramatic whitespace
- high-quality product photography
- large product renders
- asymmetric compositions
- full-screen sections
- smooth transitions
- subtle motion
- editorial layouts
- strong visual hierarchy
- restrained color palette
- premium micro-interactions

==================================================
2. FIRST: AUDIT THE EXISTING WEBSITE
==================================================

Before modifying anything:

Inspect:

- app structure
- routes
- homepage
- product listing
- product detail page
- navbar
- footer
- cart
- checkout
- authentication
- API calls
- database-dependent components
- existing image handling
- existing responsive breakpoints
- existing animation libraries
- existing CSS/Tailwind configuration
- existing reusable components

Identify:

1. Which components can be reused.
2. Which components should be visually redesigned.
3. Which components should remain functionally unchanged.
4. Which animations can be implemented with existing dependencies.
5. Whether GSAP, Framer Motion, Lenis, or another animation library already exists.

DO NOT introduce a new dependency if the existing stack can achieve the effect cleanly.

If an animation library is already installed, prefer using it consistently.

==================================================
3. DESIGN SYSTEM
==================================================

Create or refine a unified design system.

COLOR:

Use a sophisticated neutral palette.

Primary:
- white
- near-black
- charcoal
- soft gray

Optional brand accent:
- use the existing glasses brand color if one already exists.

Do not introduce many colors.

Typography:

Use a premium modern sans-serif.

Typography hierarchy should be dramatic.

Example:

Hero heading:
VERY LARGE
8vw–12vw depending on viewport

Section heading:
4vw–7vw

Product title:
3vw–5vw

Body:
16px–20px

Small metadata:
11px–14px

Use generous line-height and letter spacing.

The typography should feel editorial rather than like a normal online store.

==================================================
4. NAVIGATION
==================================================

Redesign the navbar to feel extremely minimal.

Desktop:

Left:
Brand logo

Center or right:
- New
- Men
- Women
- Sunglasses
- Optical
- Collections

Right:
- Search
- Account
- Cart

Avoid a bulky navbar.

Initial state:
Transparent / overlay on hero when appropriate.

As the user scrolls:
transition into a subtle solid or blurred background.

Navbar animation:
- smooth background transition
- subtle opacity change
- slight height reduction
- no aggressive animation

Mobile:
Use a clean hamburger menu with a premium full-screen/large-panel navigation.

==================================================
5. HERO SECTION
==================================================

The homepage hero should become the strongest visual section.

Do NOT create a normal:

"Welcome to our glasses store"

hero.

Instead create a cinematic product introduction.

Example conceptual structure:

[small eyebrow]

SEE THE DIFFERENCE

[VERY LARGE HEADLINE]

Frames
Designed
For You.

[short supporting sentence]

[SHOP COLLECTION]

Then:

Large glasses product image/render.

The glasses should dominate the screen.

Possible layout:

Full viewport:
100vh–120vh

Background:
clean white / black / brand environment.

Product:
centered or slightly offset.

Use subtle product animation.

When scrolling:

- typography moves subtly
- glasses move / scale
- image transitions
- background changes
- next section reveals itself

The hero should feel like a product launch rather than a category page.

==================================================
6. HERO PRODUCT ANIMATION
==================================================

Create a premium entrance animation.

Initial:

Glasses are barely visible / positioned slightly off-screen.

As page loads:

1. background appears
2. typography fades/slides in
3. glasses slowly reveal
4. product reaches final position
5. CTA appears

Keep the animation elegant.

Avoid:
- bouncing
- spinning excessively
- flashy effects
- random particle effects

Preferred:

opacity
transform
scale
translate
clip-path
mask reveal
blur-to-sharp

Use GPU-friendly CSS transforms.

==================================================
7. SCROLL STORYTELLING
==================================================

This is one of the MOST IMPORTANT changes.

The website should not feel like a collection of independent sections.

It should feel like ONE continuous story.

Use:

- sticky sections
- scroll progress
- image transitions
- text transitions
- horizontal movement
- subtle parallax
- scale animations
- pinning
- overlapping sections
- progressive reveals

The user should feel that the glasses are being explored while scrolling.

Think:

SCROLL → DISCOVER → UNDERSTAND → DESIRE → SHOP

rather than:

HERO → GRID → GRID → GRID → FOOTER

==================================================
8. "THE GLASSES" PRODUCT STORY
==================================================

Create a dedicated storytelling section.

Example:

THE FRAME

Then show a huge close-up of the glasses.

Break the product into visual characteristics:

01 — Frame
02 — Lens
03 — Materials
04 — Comfort
05 — Details

Each feature should be revealed through scrolling.

Example:

Large product image on one side.

Text on the other:

01

PRECISION FRAME

Every curve is designed to balance
comfort, structure and character.

Then scrolling changes the product/image position.

Do not make every feature a conventional card.

==================================================
9. PRODUCT DETAIL VISUALIZATION
==================================================

Make product photography much larger.

Instead of:

[small image]
[product title]
[price]

Use:

FULL-WIDTH PRODUCT IMAGE

then:

PRODUCT NAME
short statement
price
color
CTA

Allow the product to visually dominate the screen.

For product detail pages, create:

- large gallery
- full-screen product image
- zoom
- alternate angles
- close-up details
- frame texture
- hinge details
- lens details

The product image should be the visual hero.

==================================================
10. PRODUCT COLLECTION SECTION
==================================================

Do not display the collection only as a standard 4-column grid.

Create editorial collection presentation.

Possible:

COLLECTION 01
EVERYDAY

Large image.

Then:

COLLECTION 02
STATEMENT

Large image.

Then:

COLLECTION 03
CLASSIC

Large image.

Products can still be purchasable.

Use a mixture of:

- large feature products
- horizontal product rows
- asymmetric grids
- editorial product cards

Maintain e-commerce usability.

==================================================
11. PRODUCT CARDS
==================================================

Redesign product cards.

Product card should feel minimal.

Avoid heavy borders.

Show:

Product image
Product name
Short descriptor
Price
Available colors

Hover:

- image changes to alternate product angle
- subtle image zoom
- product name moves slightly
- quick-add appears
- small arrow appears

Example:

[IMAGE]

FRAME 01
Optical / Black
$129

→ VIEW FRAME

Use smooth 200–400ms transitions.

==================================================
12. FULL-SCREEN PRODUCT MOMENTS
==================================================

Introduce several large cinematic sections.

Example:

A huge pair of glasses centered on a dark background.

Small text:

BUILT FOR
EVERY ANGLE.

Then another section:

LIGHT.
FORM.
IDENTITY.

Then a different product angle.

These sections should give the website an advertising-campaign feel.

==================================================
13. DARK / LIGHT TRANSITIONS
==================================================

Use background transitions strategically.

Example:

White:

LIGHTNESS
CLARITY
PRECISION

Then transition into:

Black:

DEPTH
CONTRAST
CHARACTER

Then back to:

White:

EVERYDAY
COMFORT
STYLE

The transitions should happen naturally while scrolling.

Use:

background-color interpolation
text-color interpolation
image transitions

Avoid sudden flashing changes.

==================================================
14. INTERACTIVE FRAME EXPLORATION
==================================================

If product assets allow it, implement an interactive frame exploration.

For example:

User scrolls.

The glasses slowly rotate through several angles.

OR:

Different sections reveal:

front
side
45°
close-up
worn-on-face

If multiple images exist, use them.

If only one image exists, do NOT fabricate complex 3D behavior.

Instead use:

scale
pan
crop
zoom
parallax

to create movement.

==================================================
15. "FIND YOUR FRAME" EXPERIENCE
==================================================

Create a visually strong product discovery section.

Possible heading:

FIND YOUR FRAME.

Then allow users to explore:

Face shape
Style
Color
Purpose
Gender/category
Frame type

Do not make this look like a generic form.

Use large visual choices.

Example:

WHAT DEFINES YOU?

[ MINIMAL ]
[ CLASSIC ]
[ BOLD ]
[ MODERN ]

Then dynamically show appropriate products.

Keep all existing product/filter functionality intact.

==================================================
16. STORY-DRIVEN BENEFITS
==================================================

Instead of showing benefits as normal cards:

"Comfort"
"UV Protection"
"Premium Material"

turn them into large editorial moments.

Example:

LIGHTWEIGHT
WITHOUT
FEELING FRAGILE.

Large typography.

Then product close-up.

Next:

MADE FOR
LONG DAYS.

Then another product visual.

This should communicate product value emotionally while remaining factually accurate.

IMPORTANT:
Only use claims that are actually supported by the existing product data/business information.

Never invent technical specifications.

==================================================
17. SOCIAL PROOF
==================================================

Create a premium testimonial section.

Instead of multiple tiny review cards:

Use:

"THE FRAME
I FORGET
I'M WEARING."

Customer name

★★★★★

Then product/customer image if available.

Use 2–4 testimonials with smooth transitions.

Keep actual review text unchanged unless you are only changing visual presentation.

==================================================
18. BRAND STORY
==================================================

Create a brand storytelling section.

Example:

WHY WE
MAKE GLASSES.

Large typography.

Then:

short story about the brand.

Use large photography.

Potential layout:

Image occupies 60–70% viewport.

Text occupies remaining area.

Do not make this look like an About Us corporate page.

It should feel like a fashion brand.

==================================================
19. FINAL CTA
==================================================

The final CTA should be visually powerful.

Example:

FIND
YOUR
FRAME.

[SHOP ALL GLASSES]

Use a huge product image behind/next to the typography.

The CTA should be impossible to miss without looking like an aggressive advertisement.

==================================================
20. FOOTER
==================================================

Create a minimal premium footer.

Include:

Brand logo

Shop
- New Arrivals
- Eyeglasses
- Sunglasses
- Collections

Help
- Contact
- Shipping
- Returns
- FAQ

Company
- About
- Our Story

Social links

Newsletter

Copyright

Keep spacing generous.

==================================================
21. MICRO-INTERACTIONS
==================================================

Add subtle interactions throughout.

Buttons:

Default:
text + arrow

Hover:
arrow moves slightly right
background/text transitions

Images:

hover:
very subtle scale 1.02–1.05

Links:

underline/reveal animation

Cards:

slight image movement

Navbar:

smooth state change

Cart:

subtle confirmation animation

Do NOT over-animate.

Premium design depends on restraint.

==================================================
22. SCROLL ANIMATION PRINCIPLES
==================================================

Use animation intentionally.

Animation categories:

ON LOAD:
- fade
- slide
- reveal

ON SCROLL:
- parallax
- scale
- opacity
- position
- clip-path
- horizontal movement

ON HOVER:
- scale
- translate
- color
- image transition

Use easing curves that feel premium.

Avoid linear robotic motion wherever possible.

Animation should never interfere with usability.

==================================================
23. PERFORMANCE
==================================================

This is an e-commerce website.

Do NOT sacrifice performance for animation.

Requirements:

- use Next.js Image
- responsive image sizes
- WebP/AVIF where appropriate
- lazy load below-the-fold images
- preload only critical hero assets
- avoid huge JavaScript bundles
- avoid unnecessary re-renders
- use transform/opacity for animations
- avoid layout thrashing
- respect prefers-reduced-motion
- keep mobile performance strong

Animations should be progressively enhanced.

If a device is low-powered:

reduce animation complexity.

==================================================
24. MOBILE EXPERIENCE
==================================================

DO NOT simply shrink the desktop design.

Create a dedicated mobile composition.

Hero:
large but optimized product image.

Typography:
responsive using clamp().

Sections:
stack naturally.

Horizontal scroll:
only when it improves UX.

Avoid:
- tiny text
- oversized elements that cause horizontal overflow
- complicated scroll-jacking
- heavy animations

Mobile must feel intentionally designed.

Test at:

320px
375px
390px
430px
768px
1024px
1280px
1440px
1920px

==================================================
25. ACCESSIBILITY
==================================================

Maintain:

- semantic HTML
- keyboard navigation
- visible focus states
- proper button labels
- alt text
- color contrast
- reduced-motion support
- accessible mobile menu
- accessible cart interactions

Animations must not prevent users from navigating the site.

==================================================
26. E-COMMERCE FUNCTIONALITY MUST REMAIN INTACT
==================================================

DO NOT break:

- product search
- filters
- product variants
- product detail
- add to cart
- cart quantity
- checkout
- authentication
- wishlist if present
- inventory
- pricing
- discounts
- API calls
- database interactions
- order processing
- admin functionality

The redesign is visual/UX focused.

==================================================
27. IMPORTANT: DO NOT INVENT PRODUCT DATA
==================================================

Use the existing database/product information.

Never invent:

- materials
- UV protection
- lens specifications
- dimensions
- guarantees
- certifications
- manufacturing claims
- medical claims
- sustainability claims

If the existing website already contains those facts, present them beautifully.

==================================================
28. IMPLEMENTATION STRATEGY
==================================================

Work incrementally.

PHASE 1:
Audit current codebase.

PHASE 2:
Create/refine design tokens.

PHASE 3:
Redesign navbar.

PHASE 4:
Redesign homepage hero.

PHASE 5:
Implement scroll storytelling.

PHASE 6:
Redesign product presentation.

PHASE 7:
Redesign collection/product grid.

PHASE 8:
Redesign product detail page.

PHASE 9:
Add testimonials/brand story.

PHASE 10:
Redesign final CTA/footer.

PHASE 11:
Mobile optimization.

PHASE 12:
Performance optimization.

PHASE 13:
Accessibility testing.

PHASE 14:
Final visual QA.

After each phase, ensure the application still builds and existing functionality works.

==================================================
29. COMPONENT ARCHITECTURE
==================================================

Create reusable components where appropriate.

Potential components:

PremiumNavbar
HeroProductReveal
ScrollStory
ProductShowcase
ProductFeature
ProductCollection
EditorialProductCard
ProductGallery
FrameExplorer
BrandStory
TestimonialStory
FinalCTA
PremiumFooter

Do not create unnecessary components.

Follow the existing project's component architecture and naming conventions where possible.

==================================================
30. AVOID THIS
==================================================

Do NOT:

- clone the HEAVN website
- copy HEAVN text
- copy HEAVN branding
- copy their logo
- copy proprietary images
- copy exact product presentation
- rebuild the entire project
- remove existing functionality
- add unnecessary dependencies
- create excessive animations
- use scroll hijacking that makes normal scrolling uncomfortable
- make every section full-screen
- turn the website into a portfolio instead of an e-commerce store
- sacrifice SEO
- sacrifice performance
- sacrifice mobile usability

The goal is:

HEAVN-INSPIRED INTERACTION + PREMIUM EYEWEAR BRAND + REAL E-COMMERCE

==================================================
31. SEO
==================================================

Maintain or improve:

- title metadata
- description metadata
- Open Graph
- structured product data
- canonical URLs
- semantic headings
- image alt text
- crawlable product content

Do not hide important product information exclusively inside animations.

==================================================
32. VISUAL QUALITY BAR
==================================================

The final result should NOT look like:

"an e-commerce template with animations."

It should look like:

"a premium eyewear brand website that happens to have e-commerce functionality."

Every section should have a reason to exist.

Every animation should support the product story.

Every image should have visual impact.

Every CTA should have clear purpose.

Whitespace should be intentional.

Typography should create hierarchy.

Product photography should be the hero.

==================================================
33. FINAL ACCEPTANCE CRITERIA
==================================================

Before declaring the work complete, verify:

[ ] Existing application still runs.
[ ] Production build succeeds.
[ ] Existing APIs still work.
[ ] Database functionality is untouched.
[ ] Cart works.
[ ] Checkout works.
[ ] Product pages work.
[ ] Search works.
[ ] Filters work.
[ ] Authentication works.
[ ] No console errors.
[ ] No hydration errors.
[ ] No horizontal overflow.
[ ] Mobile layout works.
[ ] Tablet layout works.
[ ] Desktop layout works.
[ ] Hero animation works.
[ ] Scroll storytelling works.
[ ] Product images load efficiently.
[ ] Reduced-motion mode works.
[ ] Navigation remains accessible.
[ ] SEO is preserved.
[ ] Lighthouse performance has not been unnecessarily degraded.

Most importantly:

The redesigned website must communicate:

PREMIUM
MINIMAL
MODERN
CINEMATIC
EDITORIAL
PRODUCT-FIRST
HIGH-END EYEWEAR

while remaining a fully functional e-commerce website.

FINAL INSTRUCTION:

First inspect the existing project and understand its architecture.

Then implement the redesign incrementally.

Do not ask me to rebuild the project manually.

Do not create a separate prototype.

Modify the existing website directly.

When finished, provide a concise summary of:
1. What was changed
2. Which existing components were reused
3. Which new components were created
4. Animation/interaction system used
5. Performance considerations
6. Any remaining limitations or assets needed