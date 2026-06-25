# UI Context

## Theme

Dark + light mode via `.dark` class. Tokens defined as CSS custom properties in `globals.css` using shadcn/ui's neutral palette.

## Colors

Defined in `globals.css` via `:root` (light) and `.dark` blocks using oklch values from shadcn/ui base-nova neutral palette.

Key tokens:
| Role          | CSS Variable     | Light (oklch)           | Dark (oklch)            |
| ------------- | ---------------- | ----------------------- | ----------------------- |
| Background    | `--background`   | `1 0 0` (white)         | `0.145 0 0` (near-black)|
| Foreground    | `--foreground`   | `0.145 0 0`             | `0.985 0 0`             |
| Card          | `--card`         | `1 0 0`                 | `0.205 0 0`             |
| Primary       | `--primary`      | `0.205 0 0`             | `0.922 0 0`             |
| Border        | `--border`       | `0.922 0 0`             | `1 0 0 / 10%`           |
| Destructive   | `--destructive`  | `0.577 0.245 27.325`    | `0.704 0.191 22.216`    |
| Radius        | `--radius`       | `0.625rem`              | `0.625rem`              |

## Typography

| Role      | Font              | Variable          |
| --------- | ----------------- | ----------------- |
| UI text   | Geist Sans        | `--font-sans`     |
| Code/mono | Geist Mono        | `--font-mono`     |

Geist fonts loaded via `next/font/google` in root layout.

## Component Library

shadcn/ui (base-nova style) on top of Tailwind v4. Components live in `components/ui/`. Use `npx shadcn@latest add <name>` to add new components rather than writing from scratch.

## Icons

Lucide React. Stroke-based icons only. Configured as default icon library in `components.json`.
