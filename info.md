# Poline Color Picker Card

An interactive color palette generator for Home Assistant based on the Poline library.

## Features

✨ **Beautiful Color Palettes** - Generate harmonious color palettes using polar coordinates
💡 **Smart Light Control** - Apply colors instantly to your lights
🌈 **WLED Support** - Send entire palettes to WLED devices
🎨 **Interactive** - Adjust anchor points and see changes in real-time

## Quick Start

1. Add the card to your dashboard
2. Configure your light entities
3. Click colors to apply them instantly!

## Basic Example

```yaml
type: custom:poline-card
title: Color Picker
entity: light.bedroom_lamp
mode: single
```

For more examples and configuration options, see the [README](https://github.com/yourusername/poline-homeassistant).

## Credits

Based on the amazing [Poline](https://meodai.github.io/poline/) library by [Meo Dai](https://github.com/meodai).
