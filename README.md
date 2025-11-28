# Poline Color Picker for Home Assistant

A beautiful and interactive color picker for Home Assistant based on the [Poline](https://meodai.github.io/poline/) color palette generator. This custom card generates stunning color palettes using polar coordinates and allows you to apply them to your smart lights and WLED devices.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![HACS](https://img.shields.io/badge/HACS-compatible-green.svg)

## Features

- 🎨 **Beautiful Color Palettes**: Generate harmonious color palettes using Poline's polar coordinate algorithm
- 💡 **Smart Light Control**: Apply colors to any Home Assistant light entity (Philips Hue, LIFX, etc.)
- 🌈 **WLED Integration**: Send entire color palettes to WLED devices
- ⚡ **Interactive UI**: Click colors to apply instantly, adjust anchor points on the fly
- 🔧 **Highly Customizable**: Configure anchor colors, position functions, number of points, and more
- 📱 **Responsive Design**: Works great on mobile and desktop

## Installation

### HACS (Recommended)

1. Open HACS in your Home Assistant instance
2. Click on "Frontend"
3. Click the three dots menu in the top right
4. Select "Custom repositories"
5. Add this repository URL: `https://github.com/yourusername/poline-homeassistant`
6. Select category "Lovelace"
7. Click "Add"
8. Find "Poline Color Picker Card" in the list and click "Download"
9. Restart Home Assistant

### Manual Installation

1. Download the `poline-card.js` file from the [latest release](https://github.com/yourusername/poline-homeassistant/releases)
2. Copy it to your `config/www` folder
3. Add the following to your Lovelace resources:

```yaml
resources:
  - url: /local/poline-card.js
    type: module
```

4. Restart Home Assistant

## Usage

### Basic Configuration

Add the card to your Lovelace dashboard:

```yaml
type: custom:poline-card
title: Color Picker
entity: light.bedroom_lamp
mode: single
```

### Advanced Configuration

```yaml
type: custom:poline-card
title: My Color Palette
entities:
  - light.living_room
  - light.bedroom
  - light.kitchen
num_points: 6
anchor_colors:
  - [30, 0.8, 0.6]   # Orange-ish [Hue, Saturation, Lightness]
  - [210, 0.7, 0.5]  # Blue-ish
  - [330, 0.6, 0.5]  # Pink-ish
position_function_x: sinusoidalPosition
position_function_y: quadraticPosition
position_function_z: linearPosition
closed_loop: false
invert_lightness: false
mode: single
```

### WLED Configuration

To use with WLED devices:

```yaml
type: custom:poline-card
title: WLED Palette
wled_entity: light.wled_strip
mode: palette
palette_size: 16
num_points: 4
anchor_colors:
  - [0, 0.9, 0.5]    # Red
  - [240, 0.9, 0.5]  # Blue
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `type` | string | **Required** | Must be `custom:poline-card` |
| `title` | string | _none_ | Card title |
| `entity` | string | _none_ | Single light entity to control |
| `entities` | list | _none_ | Multiple light entities to control |
| `mode` | string | `single` | `single` for individual colors, `palette` for WLED |
| `num_points` | number | `4` | Number of color points between each anchor pair |
| `anchor_colors` | list | _auto_ | List of anchor colors in HSL format `[hue, saturation, lightness]` |
| `position_function_x` | string | `sinusoidalPosition` | Position function for X axis (hue/lightness) |
| `position_function_y` | string | `quadraticPosition` | Position function for Y axis (hue/lightness) |
| `position_function_z` | string | `linearPosition` | Position function for Z axis (saturation) |
| `closed_loop` | boolean | `false` | Whether the palette forms a closed loop |
| `invert_lightness` | boolean | `false` | Invert the lightness distribution |
| `wled_entity` | string | _none_ | WLED entity for palette mode |
| `palette_size` | number | `16` | Number of colors in WLED palette |

### Position Functions

Available position functions (from Poline):
- `linearPosition` - Linear interpolation
- `exponentialPosition` - Exponential curve
- `quadraticPosition` - Quadratic curve
- `cubicPosition` - Cubic curve
- `quarticPosition` - Quartic curve
- `sinusoidalPosition` - Sinusoidal curve (default)
- `asinusoidalPosition` - Inverse sinusoidal
- `arcPosition` - Arc curve

### Anchor Colors

Anchor colors are specified in HSL format:
- **Hue**: 0-360 (degrees on the color wheel)
- **Saturation**: 0-1 (0 = grayscale, 1 = full color)
- **Lightness**: 0-1 (0 = black, 0.5 = normal, 1 = white)

Example anchor colors:
```yaml
anchor_colors:
  - [0, 0.9, 0.5]      # Bright red
  - [120, 0.9, 0.5]    # Bright green
  - [240, 0.9, 0.5]    # Bright blue
```

## Interactive Controls

- **Click a color swatch**: Apply that color to configured light entities
- **Click an anchor color picker**: Change an anchor color
- **Add Anchor button**: Add a new random anchor point
- **Remove Anchor button**: Remove the last selected anchor (minimum 2 required)
- **Apply Palette to WLED**: Send the entire palette to a WLED device

## Examples

### Warm Sunset Palette

```yaml
type: custom:poline-card
title: Sunset Colors
entities:
  - light.living_room
num_points: 5
anchor_colors:
  - [30, 0.9, 0.6]   # Orange
  - [0, 0.8, 0.5]    # Red
  - [280, 0.6, 0.3]  # Purple
closed_loop: true
```

### Cool Ocean Palette

```yaml
type: custom:poline-card
title: Ocean Breeze
entity: light.bedroom
num_points: 6
anchor_colors:
  - [180, 0.7, 0.6]  # Cyan
  - [220, 0.8, 0.5]  # Blue
  - [260, 0.6, 0.4]  # Deep blue
position_function_x: arcPosition
position_function_y: sinusoidalPosition
```

### WLED RGB Spectrum

```yaml
type: custom:poline-card
title: Rainbow Palette
wled_entity: light.led_strip
mode: palette
palette_size: 20
num_points: 8
anchor_colors:
  - [0, 1, 0.5]      # Red
  - [120, 1, 0.5]    # Green
  - [240, 1, 0.5]    # Blue
closed_loop: true
```

## Development

### Prerequisites

- Node.js 18+ and npm
- Home Assistant instance for testing

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/poline-homeassistant.git
cd poline-homeassistant

# Install dependencies
npm install

# Build the project
npm run build

# Watch for changes (development)
npm run watch
```

### Project Structure

```
poline-homeassistant/
├── src/
│   ├── poline-card.ts      # Main custom element
│   └── types.ts            # TypeScript type definitions
├── dist/
│   └── poline-card.js      # Compiled output
├── package.json
├── tsconfig.json
├── rollup.config.mjs
├── hacs.json
└── README.md
```

### Building

The project uses Rollup to bundle TypeScript into a single JavaScript file:

```bash
npm run build
```

The output will be in `dist/poline-card.js`.

### Testing

1. Copy `dist/poline-card.js` to your Home Assistant `config/www` folder
2. Add the resource to your Lovelace configuration
3. Add the card to a dashboard
4. Test with your light entities

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Credits

- **Poline Library**: Created by [Meo Dai](https://github.com/meodai) - [Poline on GitHub](https://github.com/meodai/poline)
- Inspired by [Anatoly Zenkov's](https://anatolyzenkov.com/) color palette ideas

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you find this card useful, consider:
- ⭐ Starring the repository
- 🐛 Reporting issues
- 💡 Suggesting new features
- ☕ [Buying the Poline creator a coffee](https://ko-fi.com/colorparrot)

## Changelog

### Version 1.0.0
- Initial release
- Basic color palette generation
- Support for Home Assistant light entities
- WLED palette integration
- Interactive anchor point editing
- Configurable position functions
