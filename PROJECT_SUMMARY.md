# Poline HomeAssistant - Project Summary

## Overview
Home Assistant custom card that integrates the Poline color picker library. Generate harmonious color palettes and apply them to smart lights and WLED devices.

## Tech Stack
- TypeScript 5.3.3 (strict mode)
- Lit 3.1.2 (web components)
- Poline 0.11.0 (color generation)
- Rollup (bundler)

## Structure

```
src/
├── poline-card.ts         # Main card element
├── poline-card-editor.ts  # Visual config editor
└── types.ts               # TypeScript types
dist/
└── poline-card.js         # Bundled output
```

## Features

- Interactive color wheel with draggable anchor points
- Click to add anchor points
- Save/load palettes (stored in input_text entities)
- Apply colors to multiple light entities
- Upload palettes to WLED devices
- Visual configuration editor
- 9 position functions for color distribution
- Closed loop and inverted lightness options

## Configuration

Requires two `input_text` helpers for persistence:
- State storage (max 255 chars)
- Saved palettes storage (max 255 chars)

Card config via visual editor or YAML:
- Light entities
- WLED entities
- Palette size (2-256 for WLED)
- Number of points (colors between anchors)
- Position functions (X/Y/Z)
- Closed loop / invert lightness toggles

## How It Works

1. Poline generates colors in HSL polar coordinates
2. Colors converted to RGB (0-255)
3. Applied to lights via `light.turn_on` service
4. For WLED: RGB → Hex string → uploaded to device
5. State saved to input_text entities (JSON, rounded to 2 decimals)

## Build

```bash
npm install
npm run build    # Output: dist/poline-card.js
npm run watch    # Development mode
```

## HACS Compatible

- `hacs.json` manifest
- Release workflow
- Proper file structure
