---
name: MargDrishti AI Professional Style
colors:
  surface: '#0e1416'
  surface-dim: '#0e1416'
  surface-bright: '#343a3c'
  surface-container-lowest: '#090f11'
  surface-container-low: '#171d1e'
  surface-container: '#1b2122'
  surface-container-high: '#252b2d'
  surface-container-highest: '#303638'
  on-surface: '#dee3e6'
  on-surface-variant: '#bcc9cd'
  inverse-surface: '#dee3e6'
  inverse-on-surface: '#2b3133'
  outline: '#869397'
  outline-variant: '#3d494c'
  surface-tint: '#4cd7f6'
  primary: '#4cd7f6'
  on-primary: '#003640'
  primary-container: '#06b6d4'
  on-primary-container: '#00424f'
  inverse-primary: '#00687a'
  secondary: '#4ae176'
  on-secondary: '#003915'
  secondary-container: '#00b954'
  on-secondary-container: '#004119'
  tertiary: '#ffb873'
  on-tertiary: '#4b2800'
  tertiary-container: '#e89337'
  on-tertiary-container: '#5b3200'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#acedff'
  primary-fixed-dim: '#4cd7f6'
  on-primary-fixed: '#001f26'
  on-primary-fixed-variant: '#004e5c'
  secondary-fixed: '#6bff8f'
  secondary-fixed-dim: '#4ae176'
  on-secondary-fixed: '#002109'
  on-secondary-fixed-variant: '#005321'
  tertiary-fixed: '#ffdcbf'
  tertiary-fixed-dim: '#ffb873'
  on-tertiary-fixed: '#2d1600'
  on-tertiary-fixed-variant: '#6a3b00'
  background: '#0e1416'
  on-background: '#dee3e6'
  surface-variant: '#303638'
  bg-deepspace: '#000000'
  bg-midnight: '#0a0f1c'
  bg-sidebar: '#050a14'
  bg-override: '#050816'
  bg-panel: '#0f172a'
  bg-card-glass: rgba(255,255,255,0.05)
  bg-lane: '#111111'
  bg-emergency: rgba(255,0,0,0.15)
  cyan-electric: '#00e5ff'
  green-neon: '#00ff99'
  orange-accent: '#f97316'
  red-signal: '#ff3b3b'
  red-pure: '#ff0000'
  yellow-signal: '#ffff00'
  text-muted: '#9ca3af'
  text-subtle: '#cbd5e1'
  border-glass: rgba(255,255,255,0.05)
typography:
  hero-title:
    fontFamily: Fira Sans
    fontSize: 52px
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: 2px
  override-hero:
    fontFamily: Fira Sans
    fontSize: 38px
    fontWeight: '700'
    lineHeight: '1.2'
  lane-title:
    fontFamily: Fira Sans
    fontSize: 22px
    fontWeight: '700'
    lineHeight: '1.4'
  vehicle-count:
    fontFamily: Fira Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: '1'
  countdown-timer:
    fontFamily: Space Mono
    fontSize: 90px
    fontWeight: '700'
    lineHeight: '1'
  body-ui:
    fontFamily: Fira Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  log-entry:
    fontFamily: Space Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  xs: 8px
  sm: 12px
  md: 15px
  lg: 18px
  xl: 20px
  xxl: 25px
  sidebar-width: 220px
  gutter: 18px
---

---
# ============================================================
# DESIGN.MD — MargDrishti AI: Smart Traffic Command Center
# ============================================================

meta:
  name: MargDrishti AI
  description: >
    A dark-neon smart-city traffic command center dashboard powered by
    YOLOv8 computer vision. Operators monitor live lane feeds, read AI
    decisions, and issue priority overrides — all from a single screen.
  version: "1.0"

# ─────────────────────────────────────────
# COLOR PALETTE
# ─────────────────────────────────────────
colors:

  # Backgrounds
  background-deepspace:
    value: "#000000"
    description: Pure black base (radial gradient end)
  background-midnight:
    value: "#0a0f1c"
    description: Deep navy (radial gradient center — body)
  background-sidebar:
    value: "#050a14"
    description: Near-black sidebar panel
  background-override-page:
    value: "#050816"
    description: Override page full-bleed background
  background-panel:
    value: "#0f172a"
    description: Override panel / logs panel surface
  background-card:
    value: "rgba(255,255,255,0.05)"
    description: Glassmorphism card surface (dashboard)
  background-lane-card:
    value: "#111111"
    description: Solid dark lane camera card
  background-lane-card-override:
    value: "#111827"
    description: Override lane card surface
  background-select:
    value: "#1e293b"
    description: Dropdown / form element fill
  background-emergency:
    value: "rgba(255,0,0,0.15)"
    description: Emergency panel tinted fill

  # Brand / Primary
  cyan-primary:
    value: "#06b6d4"
    description: Primary cyan — sidebar heading, progress ring, scrollbar, chart bar A, gradient start
  cyan-electric:
    value: "#00e5ff"
    description: Brighter electric cyan — override page headings, log entry border-left accent
  cyan-neon:
    value: "#00e5ff"
    description: Alias of electric cyan used for hover/status states

  # Secondary / Success
  green-primary:
    value: "#22c55e"
    description: Primary green — vehicle count text, active green signal light, gradient end on start-button
  green-neon:
    value: "#00ff99"
    description: Neon mint — override AI-mode status, active lane card border, activate button, green signal on override page

  # Warning / Accent
  orange-accent:
    value: "#f97316"
    description: Refresh button gradient start; chart bar C
  red-signal:
    value: "#ff3b3b"
    description: Red traffic signal; disable-override button; override alert border
  red-pure:
    value: "#ff0000"
    description: Active red light glow; emergency box-shadow; digital timer color
  yellow-signal:
    value: "#ffff00"
    description: Yellow traffic signal light (inactive by default)

  # Text
  text-primary:
    value: "#ffffff"
    description: Default body text
  text-muted:
    value: "#9ca3af"
    description: Override page subtitle text
  text-subtle:
    value: "#cbd5e1"
    description: Form labels
  text-log:
    value: "#d1d5db"
    description: Log entry body text
  text-on-green-btn:
    value: "#000000"
    description: Button label on bright green (activate button)

  # Borders / Dividers
  border-glass:
    value: "rgba(255,255,255,0.05)"
    description: Hairline border on glass cards and sidebar
  border-emergency:
    value: "rgba(255,0,0,0.4)"
    description: Emergency panel default border
  border-red-active:
    value: "#ff3b3b"
    description: Emergency panel active / override alert border

# ─────────────────────────────────────────
# GRADIENTS
# ─────────────────────────────────────────
gradients:

  body-background:
    type: radial
    value: "radial-gradient(circle at top, #0a0f1c, #000)"
    description: Full-page deep-space backdrop

  hero-title:
    type: linear
    value: "linear-gradient(90deg, #06b6d4, #22c55e)"
    description: Cyan-to-green gradient clipped to the "MargDrishti AI" h1 text

  start-button:
    type: linear
    value: "linear-gradient(90deg, #06b6d4, #22c55e)"
    description: Same cyan-to-green applied as a filled button background

  refresh-button:
    type: linear
    value: "linear-gradient(90deg, #f97316, #ef4444)"
    description: Orange-to-red gradient for the secondary refresh action

# ─────────────────────────────────────────
# TYPOGRAPHY
# ─────────────────────────────────────────
typography:

  font-family-primary:
    value: "'Segoe UI', sans-serif"
    description: Main UI font — clean, system-native sans-serif

  font-family-override:
    value: "Arial, sans-serif"
    description: Override page uses a slightly wider sans-serif for readability

  font-family-timer:
    value: "'Courier New', monospace"
    description: Digital countdown timer uses a monospace font for a hardware-display feel

  font-size-hero:
    value: "52px"
    description: "MargDrishti AI" hero heading on the dashboard

  font-size-override-hero:
    value: "38px"
    description: Priority Override page section heading

  font-size-lane-title:
    value: "22px"
    description: Lane card headings (Lane A / B / C)

  font-size-vehicle-count:
    value: "26px"
    description: Vehicle count readout inside each lane card

  font-size-timer:
    value: "90px"
    description: Digital countdown timer display

  font-size-system-status:
    value: "18px"
    description: Override page system status banner

  font-size-body:
    value: "16px"
    description: General body / form text

  font-size-log:
    value: "12px"
    description: Dashboard log list items

  font-weight-hero:
    value: "800"
    description: Extra-bold weight for the gradient hero title

  font-weight-bold:
    value: "bold"
    description: Used on lane titles, counts, buttons, timer

  letter-spacing-hero:
    value: "2px"
    description: Wide tracking on the hero title for an authoritative look

# ─────────────────────────────────────────
# SPACING
# ─────────────────────────────────────────
spacing:

  xs:
    value: "8px"
    description: Margin between log list items; sidebar list item top/bottom padding

  sm:
    value: "12px"
    description: Sidebar list item padding; lane info padding

  md:
    value: "15px"
    description: Card margin-top; button gap in start-section

  lg:
    value: "18px"
    description: Card padding; lane info padding; signal gap in horizontal-signal row

  xl:
    value: "20px"
    description: Sidebar padding; main content padding; bottom-grid gap

  xxl:
    value: "25px"
    description: Lane grid gap (22 px rounded), bottom-grid margin-top, override section spacing

  sidebar-width:
    value: "220px"
    description: Fixed sidebar column width in the dashboard grid

# ─────────────────────────────────────────
# BORDER RADIUS
# ─────────────────────────────────────────
radii:

  signal-light:
    value: "50%"
    description: Circular traffic signal lights and override signal orbs

  card:
    value: "18px"
    description: Dashboard glass cards and lane camera cards

  button:
    value: "14px"
    description: Action buttons (Start System, Refresh Scenario)

  sidebar-nav-item:
    value: "8px"
    description: Sidebar navigation list items

  override-panel:
    value: "20px"
    description: Override panel and logs panel outer containers

  log-entry:
    value: "10px"
    description: Individual command log row

  status-banner:
    value: "12px"
    description: System status banner and select dropdowns

# ─────────────────────────────────────────
# SHADOWS & GLOWS
# ─────────────────────────────────────────
shadows:

  glow-cyan-button:
    value: "0 0 20px rgba(6,182,212,0.4)"
    description: Resting glow under the Start System button

  glow-green-button-hover:
    value: "0 0 30px rgba(34,197,94,0.7)"
    description: Intensified green glow on Start button hover

  glow-orange-button:
    value: "0 0 20px rgba(249,115,22,0.4)"
    description: Resting glow under the Refresh button

  glow-red-button-hover:
    value: "0 0 30px rgba(239,68,68,0.7)"
    description: Intensified red glow on Refresh button hover

  glow-active-lane:
    value: "0 0 30px #22c55e"
    description: Green aura on the currently green-signalled lane card

  glow-emergency-lane:
    value: "0 0 35px red"
    description: Harsh red aura on the lane with a detected ambulance

  glow-red-signal:
    value: "0 0 18px red"
    description: Active red traffic light bloom

  glow-green-signal:
    value: "0 0 18px #22c55e"
    description: Active green traffic light bloom

  glow-yellow-signal:
    value: "0 0 18px yellow"
    description: Active yellow traffic light bloom

  glow-override-active-lane:
    value: "0 0 25px rgba(0,255,153,0.5)"
    description: Neon-mint glow on the selected lane card on the override page

  glow-system-status-ok:
    value: "0 0 15px rgba(0,255,153,0.4)"
    description: Soft mint glow behind the AI-active status banner

  glow-timer:
    value: "0 0 15px red, 0 0 30px red, 0 0 50px red"
    description: Layered red bloom on the digital countdown digits

  panel-shadow:
    value: "0 0 25px rgba(0,0,0,0.5)"
    description: Depth shadow beneath override and logs panels

# ─────────────────────────────────────────
# ELEVATION
# ─────────────────────────────────────────
elevation:

  flat:
    value: "none"
    description: Lane camera cards and sidebar sit flush

  raised:
    value: "0 0 25px rgba(0,0,0,0.5)"
    description: Override panels lifted from the background

  glow:
    value: "neon bloom"
    description: >
      Primary elevation metaphor is color-coded glow, not drop shadow.
      Active states elevate elements via box-shadow glow rather than z-index.

# ─────────────────────────────────────────
# MOTION & ANIMATION
# ─────────────────────────────────────────
motion:

  transition-default:
    value: "0.3s"
    description: Standard hover/state transition duration across buttons, sidebar items, lane cards, signal lights

  transition-override-card:
    value: "0.3s ease"
    description: Lane card hover on the override page (translateY + glow)

  animation-siren-flash:
    value: "sirenFlash 0.6s infinite"
    description: >
      Emergency panel background pulses between rgba(255,0,0,0.2) and
      rgba(0,0,255,0.2) — red-blue police-light effect at 0.6 s

  animation-override-pulse:
    value: "pulse 1s infinite"
    description: >
      Override alert banner box-shadow pulses from 0 0 10px to 0 0 25px
      rgba(255,0,0) at 1 s — draws urgent operator attention

  animation-timer-blink:
    value: "blinkTimer 0.7s infinite"
    description: >
      Countdown timer digits flash between opacity 1 → 0.3 → 1 in the
      final 3 seconds before the next AI cycle fires

  hover-scale-button:
    value: "scale(1.05)"
    description: Buttons grow 5 % on hover; triggers simultaneously with glow intensification

  hover-translate-card:
    value: "translateY(-5px)"
    description: Override page lane cards lift 5 px on hover

  hover-scale-lane:
    value: "scale(1.02)"
    description: Dashboard active-lane card scales up 2 % to visually pop

# ─────────────────────────────────────────
# LAYOUT
# ─────────────────────────────────────────
layout:

  app-grid:
    value: "220px 1fr"
    description: Two-column CSS Grid — fixed sidebar + fluid main content

  lane-grid:
    value: "repeat(3, 1fr)"
    description: Three equal-width columns for the lane camera cards

  lane-grid-responsive:
    value: "1fr"
    description: Stacks to single column below 1100 px

  bottom-grid:
    value: "1fr 1fr 2fr"
    description: AI decision panel | timer panel | traffic density chart

  bottom-grid-responsive:
    value: "1fr"
    description: Stacks to single column below 1100 px

  override-lane-grid:
    value: "repeat(auto-fit, minmax(220px, 1fr))"
    description: Fluid auto-fit grid for override lane selector cards

  lane-image-height:
    value: "230px"
    description: Fixed height for live camera feed thumbnails, object-fit cover

  signal-light-size:
    value: "20px"
    description: Diameter of inline traffic-light dots on the dashboard

  override-signal-size:
    value: "70px"
    description: Large signal orbs on the override page for visibility

  timer-height:
    value: "180px"
    description: Container height for the digital countdown display

# ─────────────────────────────────────────
# COMPONENT TOKENS
# ─────────────────────────────────────────
components:

  sidebar:
    background: "#050a14"
    border-right: "1px solid rgba(255,255,255,0.05)"
    heading-color: "#06b6d4"
    nav-item-radius: "8px"
    nav-item-hover-bg: "rgba(6,182,212,0.2)"
    nav-item-active-bg: "rgba(6,182,212,0.35)"
    transition: "0.3s"

  glass-card:
    background: "rgba(255,255,255,0.05)"
    border: "1px solid rgba(255,255,255,0.05)"
    border-radius: "18px"
    padding: "18px"
    backdrop-filter: "blur(10px)"

  lane-card-dashboard:
    background: "#111111"
    border: "1px solid rgba(255,255,255,0.05)"
    border-radius: "18px"
    transition: "0.3s"

  override-panel:
    background: "#0f172a"
    border-radius: "20px"
    padding: "30px"

  system-status-banner:
    background: "#0f172a"
    border: "2px solid #00ff99"
    color: "#00ff99"
    border-radius: "12px"
    glow: "0 0 15px rgba(0,255,153,0.4)"

  override-alert-banner:
    background: "rgba(255,0,0,0.15)"
    border: "2px solid #ff3b3b"
    color: "#ff4d4d"
    border-radius: "15px"
    animation: "pulse 1s infinite"

  log-entry:
    background: "#111827"
    border-left: "4px solid #00e5ff"
    border-radius: "10px"
    padding: "12px"
    color: "#d1d5db"

  scrollbar:
    width: "6px"
    thumb-color: "#06b6d4"
---

# MargDrishti AI — Design Language

## Overview

**MargDrishti AI** ("Road Vision" in Sanskrit) is a real-time smart-city traffic command center. Its visual language is _dark neon_ — a genre of interface design associated with mission-critical control rooms, cyberpunk dashboards, and data-ops tooling. Every design decision serves a single purpose: **operators must read state at a glance, under stress, in any lighting condition.**

---

## Atmosphere & Mood

The application opens onto a deep-space void. The body background is a radial gradient that bleeds from deep navy (`#0a0f1c`) at the viewport center to absolute black at the edges, making the glowing UI elements appear to float in darkness. There are no illustrations, photographs, or decorative chrome — the live YOLO-annotated camera frames and glowing signal lights are the only "imagery."

The visual register is **clinical authority**. Operators are expected to trust what the screen shows them. Excessive decoration would undermine that trust.

---

## Color System

The palette is built around a **cyan-green primary axis** for normal, AI-controlled operation, with **red-orange** reserved exclusively for alerts, emergencies, and overrides.

| Role | Value | Meaning |
|---|---|---|
| Cyan `#06b6d4` | Brand primary | AI operation, progress, scrollbar, sidebar accent |
| Electric cyan `#00e5ff` | Override headings | Administrative interface chrome |
| Neon mint `#00ff99` | Success/AI active | Healthy AI mode, green signal lights (override) |
| Green `#22c55e` | Active / green signal | Vehicle count text, active lane glow, green light |
| Red `#ff3b3b` / `red` | Emergency / stop | Alert banners, override-disable button, red lights |
| Orange `#f97316` | Secondary action | Refresh button, chart bar C |

**Semantic color rule:** Green → safe / AI-controlled. Red → stop / human-override / emergency. Cyan → informational / AI systems nominal. This mapping must be maintained across any future feature additions.

---

## Typography

The UI uses **Segoe UI** for the main dashboard — a humanist sans-serif that is ubiquitous on Windows systems (the primary deployment target) and renders cleanly at small sizes. The override administrative panel uses **Arial** for a slightly wider, more bureaucratic feel that signals a different mode of interaction.

The hero title "MargDrishti AI" renders at 52 px with `font-weight: 800` and `letter-spacing: 2px`. It uses the cyan-to-green gradient clip trick (`-webkit-background-clip: text`) — the only decorative typography in the entire system. All other text is plain white.

The **digital countdown timer** breaks from the sans-serif convention by using **Courier New monospace** at 90 px. The monospace font reinforces the "hardware display" metaphor (like a physical LED panel). The timer digits are rendered in solid red with a three-layered neon bloom (`text-shadow`), creating the illusion of a backlit display.

---

## Layout

The app uses a **two-column CSS Grid** (`220px 1fr`). The sidebar is a fixed-width dark column; the main content area is a fluid scrollable pane. This pattern is shared across all pages via `base.html`.

The dashboard main area arranges content vertically:
1. **Hero topbar** — centered gradient title
2. **Lane grid** — three equal columns with live CCTV-style camera thumbnails
3. **Action buttons** — centered Start + Refresh
4. **Bottom info grid** — AI decision panel | countdown timer | Chart.js density bar chart
5. **Emergency panel** — full-width, with siren-flash animation when active
6. **Log feed** — scrollable list of cycle events

The override page replaces the lane grid with **large clickable lane-selector cards** containing oversized 70 px signal orbs, making the target touch area generous and the state unambiguous.

---

## Elevation & Depth

Traditional drop shadows are minimal. Depth is conveyed through **color-coded neon glows** (`box-shadow` with color and blur radius). The active green lane floats above its siblings via `0 0 30px #22c55e` and a subtle `scale(1.02)`. Emergency lanes scream with `0 0 35px red`. Inactive elements recede into the void with no shadow at all. This system maps directly to traffic signal semantics — glowing = active = important.

Glass-morphism is used sparingly on dashboard info cards: `background: rgba(255,255,255,0.05)` + `backdrop-filter: blur(10px)` + a single-pixel white hairline border. This gives cards a translucent "floating pane" quality without competing with the primary neon accents.

---

## Motion & Animation

Three distinct animation registers exist:

**1. Micro-interactions (0.3 s ease)** — All hover states: button scale, sidebar highlight, lane card lift. Fast enough to feel snappy, slow enough to be noticeable. These communicate interactivity without distraction.

**2. Status pulses (0.6 s – 1 s infinite)** — The emergency siren flash alternates red/blue backgrounds to mimic physical emergency lights. The override alert banner pulses its red glow. Both are infinite-loop keyframe animations that operators cannot miss.

**3. Timer blink (0.7 s infinite, opacity 1 → 0.3)** — Fires only in the final 3 seconds of a traffic cycle. It creates urgency without jarring the interface. The blink is removed immediately once the next cycle loads.

All transitions use the same `0.3s` duration token. No cubic-bezier easing is defined — the simple ease default is appropriate for an operational tool where predictability > expressiveness.

---

## Signal Light System

Traffic signals appear in two distinct forms:

- **Dashboard inline lights**: Small 20 px circles arranged horizontally (red | yellow | green). Active state adds the matching glow color. Inactive lights are `#222` (dark, unlit).
- **Override page orbs**: Large 70 px circles — one per lane — showing binary red/green state. No yellow is used on the override page; the admin always makes a binary commit.

The chart in Chart.js uses the same three-color language: lane A = cyan, lane B = green, lane C = orange, reflecting the brand palette.

---

## Administrative Override Surface

The Priority Override page is deliberately differentiated from the main dashboard:

- Heavier background (`#050816` vs `#0a0f1c`)
- Uses **electric cyan** `#00e5ff` instead of `#06b6d4` for headings
- System status banner is a prominent pill that transitions from **neon mint** (AI normal) to **red** (override active) when an operator takes manual control
- The "ACTIVATE PRIORITY GREEN" button is bright mint-on-black; "DISABLE OVERRIDE" is red-on-white — the color coding makes the action unmistakable
- A pulsing red alert banner (`animation: pulse 1s infinite`) appears when override is active as a persistent reminder visible anywhere on the page

The command log panel uses a left-border accent in electric cyan (`border-left: 4px solid #00e5ff`) on each entry, creating a visual timeline column. The log is prepended (newest first) and scrollable.

---

## Responsive Behavior

Below 1100 px, the lane grid and bottom info grid collapse to single-column stacks. Below 768 px (on the override page), the button group stacks vertically and the override header font shrinks from 38 px to 28 px. The sidebar remains fixed-width at all breakpoints (no hamburger menu is implemented).
