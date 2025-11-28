# Quick Start Guide

## 1. Installation

### Prerequisites
- Node.js 18+ installed
- Home Assistant instance
- Basic knowledge of YAML configuration

### Setup Steps

```bash
# Already done - dependencies are installed and project is built!
# If you need to rebuild:
npm run build

# For development with auto-rebuild:
npm run watch
```

## 2. Deploy to Home Assistant

### Option A: Manual Installation

1. Copy the compiled file to your Home Assistant:
   ```bash
   cp dist/poline-card.js /path/to/homeassistant/config/www/
   ```

2. Add to your Lovelace resources (via UI or YAML):
   ```yaml
   resources:
     - url: /local/poline-card.js
       type: module
   ```

3. Restart Home Assistant (Configuration → Settings → Restart)

### Option B: HACS Installation (Recommended for users)

1. Push this repository to GitHub
2. In HACS, add as custom repository
3. Install from Frontend tab
4. Refresh browser

## 3. Add Card to Dashboard

### Basic Usage - Single Light

```yaml
type: custom:poline-card
title: Bedroom Colors
entity: light.bedroom_lamp
```

### Advanced - Multiple Lights

```yaml
type: custom:poline-card
title: Living Room Palette
entities:
  - light.living_room_1
  - light.living_room_2
  - light.living_room_3
num_points: 6
anchor_colors:
  - [30, 0.8, 0.6]   # Warm orange
  - [210, 0.7, 0.5]  # Cool blue
```

### WLED Integration

```yaml
type: custom:poline-card
title: LED Strip
wled_entity: light.wled_strip
mode: palette
palette_size: 16
num_points: 5
```

## 4. Using the Card

### Interactive Controls

- **Click a color swatch** → Applies color to your lights instantly
- **Click anchor color picker** → Adjust anchor colors
- **Add Anchor button** → Add new random anchor point
- **Remove Anchor button** → Remove selected anchor (min 2 required)
- **Apply Palette to WLED** → Send entire palette to WLED device

### Tips

1. **Start simple**: Use 2-3 anchors for cohesive palettes
2. **Experiment**: Try different position functions for varied effects
3. **Save configs**: Keep good configurations in your dashboard YAML
4. **Use themes**: Match anchor colors to your HA theme

## 5. Troubleshooting

### Card doesn't appear
- Check browser console for errors (F12)
- Verify resource is loaded in Developer Tools → Info
- Clear browser cache
- Ensure custom card is supported in your HA version

### Colors not applying to lights
- Verify entity IDs are correct
- Check light supports RGB/color
- Look at Home Assistant logs
- Test with Developer Tools → Services

### Build errors
```bash
# Clean rebuild
rm -rf node_modules dist
npm install
npm run build
```

## 6. Development Workflow

### Making Changes

```bash
# 1. Edit source files in src/
nano src/poline-card.ts

# 2. Watch for changes (auto-rebuild)
npm run watch

# 3. Copy to HA and refresh browser
cp dist/poline-card.js /path/to/ha/config/www/
# Then refresh browser (Ctrl+Shift+R)
```

### Code Quality

```bash
# Check linting
npm run lint

# Format code
npm run format
```

## 7. Publishing

### GitHub Release

```bash
# 1. Commit your changes
git add .
git commit -m "Initial release"

# 2. Create tag
git tag v1.0.0

# 3. Push with tags
git push origin main --tags

# GitHub Actions will automatically build and create release
```

### HACS Submission

1. Fork [HACS default repository](https://github.com/hacs/default)
2. Add your repo to `custom_components.json` or `plugins.json`
3. Submit PR with proper formatting
4. Wait for review and approval

## 8. Next Steps

- ⭐ Star the Poline library on GitHub
- 📖 Read full README for all configuration options
- 🎨 Share your favorite palettes with the community
- 🐛 Report issues on GitHub
- 💡 Suggest new features

## Example Configurations

### Sunset Theme
```yaml
type: custom:poline-card
title: Sunset
entity: light.living_room
num_points: 5
anchor_colors:
  - [30, 0.9, 0.6]   # Orange
  - [0, 0.8, 0.5]    # Red
  - [280, 0.6, 0.3]  # Purple
closed_loop: true
```

### Ocean Breeze
```yaml
type: custom:poline-card
title: Ocean
entity: light.bedroom
num_points: 6
anchor_colors:
  - [180, 0.7, 0.6]  # Cyan
  - [220, 0.8, 0.5]  # Blue
position_function_x: arcPosition
```

### Full Rainbow
```yaml
type: custom:poline-card
title: Rainbow
wled_entity: light.led_strip
mode: palette
palette_size: 20
num_points: 8
anchor_colors:
  - [0, 1, 0.5]
  - [120, 1, 0.5]
  - [240, 1, 0.5]
closed_loop: true
```

---

**Need help?** Check the README.md or open an issue on GitHub!
