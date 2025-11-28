import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { Poline, positionFunctions } from 'poline';
import type { HomeAssistant, LovelaceCardConfig } from './types';

interface PolineCardConfig extends LovelaceCardConfig {
  type: string;
  title?: string;
  entity?: string;
  entities?: string[];
  num_points?: number;
  anchor_colors?: [number, number, number][];
  position_function_x?: string;
  position_function_y?: string;
  position_function_z?: string;
  closed_loop?: boolean;
  invert_lightness?: boolean;
  mode?: 'single' | 'palette';
  wled_entity?: string;
  palette_size?: number;
}

@customElement('poline-card')
export class PolineCard extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: PolineCardConfig;
  @state() private _poline?: Poline;
  @state() private _selectedColorIndex: number = 0;
  @query('poline-picker') private _picker?: HTMLElement & { setPoline: (poline: Poline) => void };

  static getStubConfig(): PolineCardConfig {
    return {
      type: 'custom:poline-card',
      title: 'Poline Color Picker',
      num_points: 4,
      mode: 'single',
      palette_size: 16,
    };
  }

  public setConfig(config: PolineCardConfig): void {
    if (!config) {
      throw new Error('Invalid configuration');
    }
    this._config = config;
    this._initializePoline();
  }

  public getCardSize(): number {
    return 5;
  }

  private _initializePoline(): void {
    if (!this._config) return;

    const anchorColors = this._config.anchor_colors || [
      [30, 0.8, 0.6],
      [210, 0.7, 0.5],
    ];

    const numPoints = this._config.num_points || 4;

    const positionFunctionX =
      positionFunctions[
        this._config.position_function_x as keyof typeof positionFunctions
      ] || positionFunctions.sinusoidalPosition;
    const positionFunctionY =
      positionFunctions[
        this._config.position_function_y as keyof typeof positionFunctions
      ] || positionFunctions.quadraticPosition;
    const positionFunctionZ =
      positionFunctions[
        this._config.position_function_z as keyof typeof positionFunctions
      ] || positionFunctions.linearPosition;

    this._poline = new Poline({
      anchorColors,
      numPoints,
      positionFunctionX,
      positionFunctionY,
      positionFunctionZ,
    });

    if (this._config.closed_loop !== undefined) {
      this._poline.closedLoop = this._config.closed_loop;
    }

    if (this._config.invert_lightness !== undefined) {
      this._poline.invertedLightness = this._config.invert_lightness;
    }
  }

  protected updated(changedProps: PropertyValues): void {
    super.updated(changedProps);
    if (changedProps.has('_config') && this._config) {
      this._initializePoline();
    }
  }

  protected firstUpdated(): void {
    // Load the poline-picker web component
    this._loadPickerComponent();
  }

  private async _loadPickerComponent(): Promise<void> {
    try {
      // Dynamically import the picker module
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await import('https://unpkg.com/poline/dist/picker.mjs' as any);
      
      // Set up the picker after it's been rendered
      if (this._picker && this._poline) {
        this._picker.setPoline(this._poline);
      }

      // Listen for changes from the picker
      this._picker?.addEventListener('poline-change', ((event: CustomEvent) => {
        if (event.detail?.poline) {
          this._poline = event.detail.poline;
          this.requestUpdate();
        }
      }) as EventListener);
    } catch (error) {
      console.error('Failed to load poline-picker component:', error);
    }
  }

  private _handleColorClick(index: number): void {
    this._selectedColorIndex = index;
    if (this._config?.mode === 'single') {
      this._applyColorToEntity(index);
    }
  }

  private _applyColorToEntity(colorIndex: number): void {
    if (!this.hass || !this._poline) return;

    const color = this._poline.colors[colorIndex];
    const [h, s, l] = color as [number, number, number];

    // Convert HSL to RGB for Home Assistant
    const rgb = this._hslToRgb(h, s, l);

    const entity = this._config?.entity;
    const entities = this._config?.entities || (entity ? [entity] : []);

    entities.forEach((entityId) => {
      this.hass!.callService('light', 'turn_on', {
        entity_id: entityId,
        rgb_color: rgb,
        brightness: Math.round(l * 255),
      });
    });
  }

  private _applyPaletteToWled(): void {
    if (!this.hass || !this._poline || !this._config?.wled_entity) return;

    const paletteSize = this._config.palette_size || 16;
    const colors: number[][] = [];

    // Generate evenly spaced colors from the palette
    for (let i = 0; i < paletteSize; i++) {
      const position = i / (paletteSize - 1);
      const color = this._poline.getColorAt(position);
      const [h, s, l] = color.hsl;
      const rgb = this._hslToRgb(h, s, l);
      colors.push(rgb);
    }

    // Format for WLED: convert to hex string
    const paletteString = colors.map((rgb) => this._rgbToHex(rgb)).join(',');

    // Call WLED service to set custom palette
    this.hass.callService('wled', 'preset', {
      entity_id: this._config.wled_entity,
      palette: paletteString,
    });
  }

  private _hslToRgb(h: number, s: number, l: number): [number, number, number] {
    h = h / 360;

    let r: number, g: number, b: number;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number): number => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

  private _rgbToHex(rgb: number[]): string {
    return rgb.map((c) => c.toString(16).padStart(2, '0')).join('');
  }



  static styles = css`
    :host {
      display: block;
    }

    ha-card {
      padding: 16px;
    }

    .card-header {
      font-size: 1.2em;
      font-weight: 500;
      margin-bottom: 16px;
    }

    .picker-container {
      display: flex;
      justify-content: center;
      margin-bottom: 16px;
    }

    poline-picker {
      width: 100%;
      max-width: 400px;
      height: 400px;
      --poline-picker-bg-color: var(--card-background-color, #fff);
      --poline-picker-line-color: var(--primary-text-color, #333);
    }

    .palette-container {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 16px;
      justify-content: center;
    }

    .color-swatch {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      cursor: pointer;
      border: 2px solid transparent;
      transition: all 0.2s;
    }

    .color-swatch:hover {
      transform: scale(1.1);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    .color-swatch.selected {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 2px var(--card-background-color);
    }

    .controls {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 16px;
    }

    .button-group {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      justify-content: center;
    }

    button {
      padding: 8px 16px;
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.2s;
    }

    button:hover {
      opacity: 0.9;
    }

    .info-text {
      font-size: 12px;
      color: var(--secondary-text-color);
      margin-top: 8px;
      text-align: center;
    }
  `;

  protected render() {
    if (!this._config || !this._poline) {
      return html``;
    }

    const colors = this._poline.colorsCSS;

    return html`
      <ha-card>
        ${this._config.title ? html`<div class="card-header">${this._config.title}</div>` : ''}

        <div class="picker-container">
          <poline-picker interactive allow-add-points></poline-picker>
        </div>

        <div class="palette-container">
          ${colors.map(
            (color: string, index: number) => html`
              <div
                class="color-swatch ${index === this._selectedColorIndex ? 'selected' : ''}"
                style="background-color: ${color}"
                @click=${() => this._handleColorClick(index)}
                title="Color ${index + 1}"
              ></div>
            `
          )}
        </div>

        <div class="controls">
          ${this._config.wled_entity
            ? html`
                <div class="button-group">
                  <button @click=${this._applyPaletteToWled}>Apply Palette to WLED</button>
                </div>
              `
            : ''}

          <div class="info-text">
            ${this._config.mode === 'single'
              ? 'Drag anchor points on the wheel • Click colors to apply to lights'
              : 'Drag anchor points on the wheel • Click "Apply Palette" to send to WLED'}
          </div>
        </div>
      </ha-card>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'poline-card': PolineCard;
  }
}
