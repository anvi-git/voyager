# Backyard Thoughts Figma Rebuild Playbook

## Goal
Rebuild the current website as a clean, scalable Figma design system with reusable components and page templates.

This plan is optimized for long-term maintenance, handoff, and future redesign work.

## Scope From Current Site
Primary templates to rebuild:
- Header + top navigation banner (shared shell)
- Publication home pages (HT, LSS, Space of Sound)
- Blog list page (with sidebar)
- Article page template
- Landing page (profile + social + link blocks)
- Footer

Source pages reviewed:
- index.html
- ht.html
- blog.html
- post_template.html
- landing_page.html
- style.css

## Source-To-Template Matrix
- index.html -> Template/Home Basic shell
- ht.html -> Template/Publication Home (HT variant)
- lss.html -> Template/Publication Home (LSS variant)
- sp.html -> Template/Publication Home (SP variant)
- blog.html -> Template/Blog List
- post_template.html + ht_article.html + lss_article.html + spacesound_article.html -> Template/Article
- landing_page.html -> Template/Landing

## Capture Checklist Before Rebuilding
Take desktop and mobile screenshots for each page before building in Figma:
- HT home
- LSS home
- SP home
- Blog list
- One article page per publication
- Landing page

Capture rules:
- Use one browser and one zoom level for all shots
- Capture full-page and first viewport for each screen
- Save with deterministic names, for example: ht-home-desktop, ht-home-mobile
- Place all screenshots in one Figma QA page for side-by-side matching

## Build Order (Do This In Sequence)
1. Create foundations (tokens + grids + text styles)
2. Build shared components (header, nav tabs, footer, cards)
3. Build page-level templates
4. Add responsive variants
5. QA against live site screenshots

## 1) Foundations In Figma

### 1.1 File Structure
Use one Figma file with these top-level pages:
- 00 Cover
- 01 Foundations
- 02 Components
- 03 Templates
- 04 Screens
- 05 QA

### 1.2 Design Tokens (Styles/Variables)
Create Variables collections:
- Colors
- Spacing
- Radius
- Typography
- Layout

Suggested initial tokens from CSS:
- color.black = #2B2D42
- color.link.hover = #011936
- color.post.bg = #F4FFFD
- color.header.bg = #F4FFFD
- color.body.bg = #FFFFFF
- radius.card = 16
- layout.header.height = 208
- layout.title.side.width = 244

Dark mode collection:
- color.black = #FFFFFF
- color.link.hover = #D1D5DB
- color.post.bg = #000000
- color.header.bg = #000000
- color.body.bg = #000000

### 1.3 Typography System
Your site currently mixes families. Keep this intentional but structured.

Create text styles:
- Display/Site Title
- Display/Publication Title
- Heading/H1
- Heading/H2
- Heading/H3
- Body/Large
- Body/Regular
- Body/Small
- Meta/Date
- Label/Nav

Recommended family mapping from current site:
- Base editorial: Playfair Display
- LSS accent: Podkova
- Space of Sound accent: Souvenir

Use separate semantic styles per use case instead of many one-off font overrides.

### 1.4 Grids And Breakpoints
Create frame presets and layout grids:
- Desktop: 1440 px, 12 columns
- Tablet: 1024 px, 8 columns
- Mobile: 390 px, 4 columns

Spacing scale:
- 4, 8, 12, 16, 24, 32, 48, 64, 96

## 2) Shared Components

### 2.1 Shell Components
Create these first:
- Header/Site Header
- Header/Title Container
- Header/Menu Trigger
- Nav/Banner Tabs
- Footer/Main Footer

Variants for Header/Site Header:
- State: Expanded, Collapsed
- Theme: Light, Dark

### 2.2 Navigation Components
Build tab item component:
- Nav/Tab Item

Variants:
- State: Default, Hover, Active
- Section: HT, LSS, SP, Blog, About

### 2.3 Card Components
Build reusable cards:
- Card/Featured Publication
- Card/Small Publication
- Card/Blog Article
- Card/Sidebar Link Item
- Card/Landing Link Button
- Card/Social Icon Button

Variants:
- With image, Without image
- Theme: Light, Dark
- State: Default, Hover

### 2.4 Content Components
Create typography and media building blocks:
- Content/Article Title
- Content/Article Meta Row
- Content/Paragraph
- Content/Pull Quote
- Content/Image Block
- Content/Caption
- Content/Divider
- Content/Section Rail
- Content/Pagination Controls

## 3) Template Construction

### 3.1 Template/Home Publication
For HT, LSS, and SP use one base template with variants:
- Template/Publication Home

Structure:
- Header
- Publication title image area
- Featured card
- Animated media strip placeholder
- Section rails with pagination controls
- Footer archive area
- Footer

Variants:
- Publication: HT, LSS, SP
- Theme: Light, Dark

### 3.2 Template/Blog List
- Header
- Main content grid
- Left: blog article list cards
- Right: sidebar (read also, links)
- Footer

### 3.3 Template/Article
- Header
- Main article column
- Title, excerpt, date, hero image
- Rich text body
- Optional related links
- Footer

### 3.4 Template/Landing
- Profile block
- Social icon row
- Link button stack
- Two-up playlist row
- Footer

## 4) Auto Layout Rules
Use Auto Layout almost everywhere.

Rules:
- Every card should be an Auto Layout component
- Avoid absolute positioning except special art or background overlays
- Use constraints for header behavior across frame sizes
- Use min/max widths to keep long text stable in cards

Recommended component behavior:
- Text wraps naturally in content column
- Image containers preserve aspect ratio
- Buttons keep fixed height with flexible width

## 5) Naming Convention
Use a strict naming convention to keep the design system navigable.

Examples:
- Header/Site Header
- Nav/Tab Item
- Card/Small Publication
- Template/Blog List
- Screen/HT Desktop

For variants, use properties:
- Theme=Light|Dark
- State=Default|Hover|Active
- Size=Desktop|Tablet|Mobile
- Media=Image|NoImage

## 6) Responsive Strategy
Create component variants and template variants for:
- Desktop
- Tablet
- Mobile

Key responsive changes:
- Header title compacts at smaller widths
- Banner tabs may wrap or reduce type size
- Blog sidebar stacks under main list on mobile
- Landing social row wraps cleanly

## 7) QA Checklist (Important)
In 05 QA page, create side-by-side comparisons:
- Live screenshot on left
- Figma reconstruction on right

Check:
- Typography scale and line-height
- Spacing and rhythm
- Card radius and shadows
- Header height and alignment
- Link and hover state consistency
- Mobile readability

Acceptance target:
- Visual match within approximately 95 percent for structure and spacing
- Intentional improvements documented (not accidental differences)

## 8) Suggested 3-Day Execution Plan
Day 1:
- Foundations and tokens
- Header/nav/footer components
- Card component set

Day 2:
- Publication home template
- Blog and article templates
- Landing template

Day 3:
- Responsive variants
- QA page and visual audit
- Final cleanup and documentation

## 9) Immediate Next Actions
1. Create Figma file and top-level pages exactly as listed
2. Build Foundations first before any screen mockups
3. Build Header and Card components and publish as local library
4. Assemble Desktop templates
5. Create Tablet and Mobile variants
6. Run QA pass against current pages

## 10) Optional Enhancements After Baseline
- Add prototype flows: nav tab clicks, article open, back to section
- Add content placeholders for localization variants (EN/IT)
- Add accessibility annotation layer (contrast, type minimums)
- Create a small handoff page with spacing, tokens, and component usage notes
