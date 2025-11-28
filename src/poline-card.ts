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
  wled_entity?: string;
  wled_entities?: string[];
  palette_size?: number;
  storage_entity?: string;
}

interface SavedPalette {
  name: string;
  anchorColors: [number, number, number][];
  numPoints: number;
  positionFunctionX?: string;
  positionFunctionY?: string;
  positionFunctionZ?: string;
  closedLoop?: boolean;
  invertedLightness?: boolean;
}

@customElement('poline-card')
export class PolineCard extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: PolineCardConfig;
  @state() private _poline?: Poline;
  @state() private _selectedColorIndex: number = 0;
  @state() private _savedPalettes: SavedPalette[] = [];
  @state() private _showSaveDialog: boolean = false;
  @state() private _showLoadDialog: boolean = false;
  @state() private _paletteName: string = '';
  @query('poline-picker') private _picker?: HTMLElement & { setPoline: (poline: Poline) => void };

  static getStubConfig(): PolineCardConfig {
    return {
      type: 'custom:poline-card',
      title: 'Poline Color Picker',
      num_points: 4,
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

  private _getStorageKey(): string {
    return `poline-card-${this._config?.type || 'default'}`;
  }

  private _saveState(): void {
    if (!this.hass || !this._config) return;

    const state = {
      selectedColorIndex: this._selectedColorIndex,
      invertedLightness: this._poline?.invertedLightness || false,
    };

    // Save to localStorage for cross-device sync via Home Assistant
    try {
      localStorage.setItem(this._getStorageKey(), JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save poline-card state:', e);
    }
  }

  private _loadState(): void {
    try {
      const stored = localStorage.getItem(this._getStorageKey());
      if (stored) {
        const state = JSON.parse(stored);
        
        if (typeof state.selectedColorIndex === 'number') {
          this._selectedColorIndex = state.selectedColorIndex;
        }
        
        if (this._poline && typeof state.invertedLightness === 'boolean') {
          this._poline.invertedLightness = state.invertedLightness;
        }
      }
    } catch (e) {
      console.warn('Failed to load poline-card state:', e);
    }
    
    // Load saved palettes from server
    this._loadSavedPalettes();
  }

  private async _loadSavedPalettes(): Promise<void> {
    if (!this.hass || !this._config?.storage_entity) return;

    try {
      const entity = this.hass.states[this._config.storage_entity];
      if (entity?.attributes?.palettes) {
        const palettesData = entity.attributes.palettes as string;
        this._savedPalettes = JSON.parse(palettesData);
      }
    } catch (e) {
      console.warn('Failed to load saved palettes:', e);
    }
  }

  private async _savePalettesToServer(): Promise<void> {
    if (!this.hass || !this._config?.storage_entity) return;

    try {
      const palettesJson = JSON.stringify(this._savedPalettes);
      
      // Use set_value service for input_text, or attributes for other helpers
      await this.hass.callService('homeassistant', 'update_entity', {
        entity_id: this._config.storage_entity,
        attributes: {
          palettes: palettesJson,
        },
      });
    } catch (e) {
      console.error('Failed to save palettes to server:', e);
    }
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

    // Load persisted state after initialization
    this._loadState();
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
    this._saveState();
  }

  private _applyColorToEntity(colorIndex: number): void {
    if (!this.hass || !this._poline) return;

    const entity = this._config?.entity;
    const entities = this._config?.entities || (entity ? [entity] : []);
    
    if (entities.length === 0) return;

    // If single entity or single color mode, apply the selected color to all
    if (entities.length === 1) {
      const color = this._poline.colors[colorIndex];
      const [h, s, l] = color as [number, number, number];
      const rgb = this._hslToRgb(h, s, l);

      this.hass.callService('light', 'turn_on', {
        entity_id: entities[0],
        rgb_color: rgb,
        brightness: Math.round(l * 255),
      });
    } else {
      // Multiple entities: distribute palette colors across them
      const totalColors = this._poline.colors.length;
      const colorIndices: number[] = [];
      
      // Calculate evenly distributed indices
      for (let i = 0; i < entities.length; i++) {
        const position = i / (entities.length - 1);
        const index = Math.round(position * (totalColors - 1));
        colorIndices.push(index);
      }

      // Apply colors to each entity
      entities.forEach((entityId, i) => {
        const color = this._poline!.colors[colorIndices[i]];
        const [h, s, l] = color as [number, number, number];
        const rgb = this._hslToRgb(h, s, l);

        this.hass!.callService('light', 'turn_on', {
          entity_id: entityId,
          rgb_color: rgb,
          brightness: Math.round(l * 255),
        });
      });
    }
  }

  private _applyPaletteToWled(): void {
    if (!this.hass || !this._poline || !this._config) return;

    const wledEntity = this._config.wled_entity;
    const wledEntities = this._config.wled_entities || (wledEntity ? [wledEntity] : []);
    
    if (wledEntities.length === 0) return;

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

    // Apply to all WLED entities
    wledEntities.forEach((entityId) => {
      this.hass!.callService('wled', 'preset', {
        entity_id: entityId,
        palette: paletteString,
      });
    });
  }

  private _applyColors(): void {
    // Apply to regular light entities
    this._applyColorToEntity(this._selectedColorIndex);
    
    // Apply to WLED entities
    this._applyPaletteToWled();
  }

  private _openSaveDialog(): void {
    this._paletteName = '';
    this._showSaveDialog = true;
  }

  private _closeSaveDialog(): void {
    this._showSaveDialog = false;
    this._paletteName = '';
  }

  private _openLoadDialog(): void {
    this._showLoadDialog = true;
  }

  private _closeLoadDialog(): void {
    this._showLoadDialog = false;
  }

  private async _savePalette(): Promise<void> {
    if (!this._poline || !this._paletteName.trim()) return;

    const palette: SavedPalette = {
      name: this._paletteName.trim(),
      anchorColors: this._poline.anchorPoints.map(p => p.hsl),
      numPoints: this._poline.numPoints,
      positionFunctionX: this._config?.position_function_x,
      positionFunctionY: this._config?.position_function_y,
      positionFunctionZ: this._config?.position_function_z,
      closedLoop: this._poline.closedLoop,
      invertedLightness: this._poline.invertedLightness,
    };

    // Check if palette with same name exists
    const existingIndex = this._savedPalettes.findIndex(p => p.name === palette.name);
    if (existingIndex >= 0) {
      this._savedPalettes[existingIndex] = palette;
    } else {
      this._savedPalettes = [...this._savedPalettes, palette];
    }

    await this._savePalettesToServer();
    this._closeSaveDialog();
  }

  private async _loadPalette(palette: SavedPalette): Promise<void> {
    if (!this._config) return;

    // Update config with palette settings
    this._config.anchor_colors = palette.anchorColors;
    this._config.num_points = palette.numPoints;
    this._config.position_function_x = palette.positionFunctionX;
    this._config.position_function_y = palette.positionFunctionY;
    this._config.position_function_z = palette.positionFunctionZ;
    this._config.closed_loop = palette.closedLoop;
    this._config.invert_lightness = palette.invertedLightness;

    // Reinitialize poline with new settings
    this._initializePoline();

    // Update picker
    if (this._picker && this._poline) {
      this._picker.setPoline(this._poline);
    }

    this._closeLoadDialog();
    this.requestUpdate();
  }

  private async _deletePalette(palette: SavedPalette): Promise<void> {
    this._savedPalettes = this._savedPalettes.filter(p => p.name !== palette.name);
    await this._savePalettesToServer();
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

  private _toggleInvertLightness(): void {
    if (!this._poline) return;
    
    this._poline.invertedLightness = !this._poline.invertedLightness;
    
    // Update the picker
    if (this._picker) {
      this._picker.setPoline(this._poline);
    }
    
    this._saveState();
    this.requestUpdate();
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

    .toggle-group {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 8px;
    }

    .toggle-group label {
      display: flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      font-size: 14px;
    }

    .toggle-group input[type="checkbox"] {
      cursor: pointer;
      width: 18px;
      height: 18px;
    }

    .info-text {
      font-size: 12px;
      color: var(--secondary-text-color);
      margin-top: 8px;
      text-align: center;
    }

    .dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .dialog {
      background: var(--card-background-color);
      border-radius: 8px;
      padding: 20px;
      min-width: 300px;
      max-width: 90%;
      max-height: 80vh;
      overflow-y: auto;
    }

    .dialog-header {
      font-size: 1.1em;
      font-weight: 500;
      margin-bottom: 16px;
    }

    .dialog-content {
      margin-bottom: 16px;
    }

    .dialog-actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    }

    input[type="text"] {
      width: 100%;
      padding: 8px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-size: 14px;
    }

    .palette-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-height: 400px;
      overflow-y: auto;
    }

    .palette-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px;
      background: var(--secondary-background-color);
      border-radius: 4px;
    }

    .palette-item-name {
      flex: 1;
      cursor: pointer;
    }

    .palette-item-actions {
      display: flex;
      gap: 8px;
    }

    button.secondary {
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
    }

    button.danger {
      background: var(--error-color, #f44336);
      color: white;
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
          <poline-picker interactive></poline-picker>
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
          <div class="toggle-group">
            <label>
              <input
                type="checkbox"
                .checked=${this._poline?.invertedLightness || false}
                @change=${this._toggleInvertLightness}
              />
              Invert Lightness
            </label>
          </div>

          <div class="button-group">
            <button @click=${this._applyColors}>Apply</button>
            ${this._config?.storage_entity
              ? html`
                  <button class="secondary" @click=${this._openSaveDialog}>Save Palette</button>
                  <button class="secondary" @click=${this._openLoadDialog}>
                    Load Palette (${this._savedPalettes.length})
                  </button>
                `
              : ''}
          </div>

          <div class="info-text">
            Drag anchor points • Select a color • Click Apply to update lights
          </div>
        </div>

        ${this._showSaveDialog
          ? html`
              <div class="dialog-overlay" @click=${this._closeSaveDialog}>
                <div class="dialog" @click=${(e: Event) => e.stopPropagation()}>
                  <div class="dialog-header">Save Palette</div>
                  <div class="dialog-content">
                    <input
                      type="text"
                      placeholder="Palette name"
                      .value=${this._paletteName}
                      @input=${(e: Event) =>
                        (this._paletteName = (e.target as HTMLInputElement).value)}
                      @keydown=${(e: KeyboardEvent) => {
                        if (e.key === 'Enter') this._savePalette();
                        if (e.key === 'Escape') this._closeSaveDialog();
                      }}
                    />
                  </div>
                  <div class="dialog-actions">
                    <button class="secondary" @click=${this._closeSaveDialog}>Cancel</button>
                    <button @click=${this._savePalette} ?disabled=${!this._paletteName.trim()}>
                      Save
                    </button>
                  </div>
                </div>
              </div>
            `
          : ''}

        ${this._showLoadDialog
          ? html`
              <div class="dialog-overlay" @click=${this._closeLoadDialog}>
                <div class="dialog" @click=${(e: Event) => e.stopPropagation()}>
                  <div class="dialog-header">Load Palette</div>
                  <div class="dialog-content">
                    ${this._savedPalettes.length === 0
                      ? html`<p>No saved palettes</p>`
                      : html`
                          <div class="palette-list">
                            ${this._savedPalettes.map(
                              (palette) => html`
                                <div class="palette-item">
                                  <div
                                    class="palette-item-name"
                                    @click=${() => this._loadPalette(palette)}
                                  >
                                    ${palette.name}
                                  </div>
                                  <div class="palette-item-actions">
                                    <button
                                      class="danger"
                                      @click=${() => this._deletePalette(palette)}
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              `
                            )}
                          </div>
                        `}
                  </div>
                  <div class="dialog-actions">
                    <button class="secondary" @click=${this._closeLoadDialog}>Close</button>
                  </div>
                </div>
              </div>
            `
          : ''}
      </ha-card>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'poline-card': PolineCard;
  }
}
