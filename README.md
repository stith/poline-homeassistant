# Poline Color Picker for Home Assistant

Generate beautiful color palettes for your smart lights using [Poline](https://meodai.github.io/poline/). Drag colors around an interactive wheel, save your favorite palettes, and apply them to any RGB light or WLED device. Begrudgingly vibe coded with [Claude](http://claude.ai). 

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![HACS](https://img.shields.io/badge/HACS-compatible-green.svg)

## What This Does

- Drag anchor points on a color wheel to create harmonious palettes
- Click any generated color to apply it to your lights instantly
- Save palettes and reload them later
- Send entire palettes to WLED devices
- Configure position functions for different color distributions

## Installation

### HACS (Recommended)

1. Open HACS → Frontend
2. Click the menu (⋮) → Custom repositories
3. Add `https://github.com/stith/poline-homeassistant` and select "Lovelace" category
4. Find "Poline Color Picker Card" and click Download
5. Restart Home Assistant

### Manual Installation

1. Download `poline-card.js` from the [latest release](https://github.com/stith/poline-homeassistant/releases)
2. Copy to `config/www/poline-card.js`
3. Add to Lovelace resources:

```yaml
resources:
  - url: /local/poline-card.js
    type: module
```

4. Restart Home Assistant

## Setup

### Required: Create Storage Helpers

The card needs two `input_text` helpers to save state and palettes. Add these to your `configuration.yaml`:

```yaml
input_text:
  poline_card_state:
    name: Poline Card State
    max: 255
  poline_saved_palettes:
    name: Poline Saved Palettes
    max: 255
```

Restart Home Assistant after adding these.

### Add the Card

**Using the Visual Editor (Easiest):**
1. Edit your dashboard
2. Add Card → Search for "Poline"
3. Fill in the configuration form:
   - Add your light entities
   - Add WLED entities (optional)
   - Select the storage helpers you created
   - Configure palette size and number of points

**Using YAML:**
```yaml
type: custom:poline-card
title: Color Picker
entities:
  - light.bedroom
storage_state_entity: input_text.poline_card_state
storage_palettes_entity: input_text.poline_saved_palettes
palette_size: 16
num_points: 4
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `type` | string | **Required** | Must be `custom:poline-card` |
| `title` | string | `Poline Color Picker` | Card title |
| `entities` | list | `[]` | Light entities to control |
| `wled_entities` | list | `[]` | WLED devices for palette upload |
| `num_points` | number | `4` | Colors between anchor points |
| `palette_size` | number | `16` | Number of colors in WLED palette |
| `position_function_x` | string | `sinusoidalPosition` | Hue distribution curve |
| `position_function_y` | string | `quadraticPosition` | Lightness distribution curve |
| `position_function_z` | string | `linearPosition` | Saturation distribution curve |
| `closed_loop` | boolean | `false` | Connect last color to first |
| `invert_lightness` | boolean | `false` | Invert lightness values |
| `storage_state_entity` | string | _none_ | input_text for card state |
| `storage_palettes_entity` | string | _none_ | input_text for saved palettes |

### Position Functions

These control how colors are distributed between anchor points:
- `linearPosition` - Straight interpolation
- `exponentialPosition` - Exponential curve
- `quadraticPosition` - Quadratic curve  
- `cubicPosition` - Cubic curve
- `quarticPosition` - Quartic curve
- `sinusoidalPosition` - Sinusoidal wave
- `asinusoidalPosition` - Inverse sine
- `arcPosition` - Arc curve
- `smoothStepPosition` - Smooth step function

## How to Use

1. **Drag anchor points** around the color wheel to adjust colors
2. **Click on the wheel** to add new anchor points  
3. **Click a color swatch** to apply that color to your lights
4. **Click "Apply"** to send colors to all configured lights
5. **Save palettes** by entering a name and clicking Save
6. **Load saved palettes** by clicking on them in the dialog

### WLED Mode

When you have WLED entities configured:
1. Adjust your palette colors on the wheel
2. Click "Upload to WLED" 
3. The entire palette uploads to your WLED device
4. WLED automatically reboots to load the new palette

## Examples

### Simple Setup
```yaml
type: custom:poline-card
entities:
  - light.bedroom
storage_state_entity: input_text.poline_card_state
storage_palettes_entity: input_text.poline_saved_palettes
```

### WLED Strip
```yaml
type: custom:poline-card
title: LED Strip
wled_entities:
  - light.wled_strip
palette_size: 16
num_points: 5
storage_state_entity: input_text.poline_card_state
storage_palettes_entity: input_text.poline_saved_palettes
```

### Custom Functions
```yaml
type: custom:poline-card
entities:
  - light.living_room
position_function_x: arcPosition
position_function_y: sinusoidalPosition
position_function_z: linearPosition
closed_loop: true
invert_lightness: false
storage_state_entity: input_text.poline_card_state
storage_palettes_entity: input_text.poline_saved_palettes
```

## Development

### Setup

```bash
# Install dependencies
npm install

# Build
npm run build

# Watch mode (auto-rebuild on changes)
npm run watch
```

Output is in `dist/poline-card.js`.

### Local Testing

1. Build the card: `npm run build`
2. Copy to Home Assistant: `cp dist/poline-card.js /path/to/ha/config/www/`
3. Add as resource (Settings → Dashboards → Resources):
   - URL: `/local/poline-card.js`
   - Type: JavaScript Module
4. Hard refresh browser (Ctrl+Shift+R)
5. Add card to dashboard

### Troubleshooting

**Card doesn't appear:**
- Check browser console (F12) for errors
- Verify resource is loaded in Settings → Dashboards → Resources
- Clear cache and hard refresh (Ctrl+Shift+R)

**Colors not applying:**
- Verify entity IDs are correct
- Check lights support RGB/color mode
- View Home Assistant logs for errors

**Build errors:**
```bash
rm -rf node_modules dist
npm install
npm run build
```

## Credits

- **Poline** by [Meo Dai](https://github.com/meodai) - [poline on GitHub](https://github.com/meodai/poline)
- Inspired by Anatoly Zenkov's color palette ideas

## License

MIT License - see [LICENSE](LICENSE)
