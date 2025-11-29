import { LitElement, html, css, PropertyValues, svg } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { Poline, positionFunctions } from 'poline';
import type { HomeAssistant, LovelaceCardConfig } from './types';

interface PolineCardConfig extends LovelaceCardConfig {
  type: string;
  title?: string;
  entities?: string[];
  num_points?: number;
  anchor_colors?: [number, number, number][];
  position_function_x?: string;
  position_function_y?: string;
  position_function_z?: string;
  closed_loop?: boolean;
  invert_lightness?: boolean;
  wled_entities?: string[];
  palette_size?: number;
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
  @state() private _savedPalettes: SavedPalette[] = [];
  @state() private _showPalettesDialog: boolean = false;
  @state() private _showSettingsDialog: boolean = false;
  @state() private _paletteName: string = '';
  @query('poline-picker') private _picker?: HTMLElement & {
    setPoline: (poline: Poline) => void;
    setAllowAddPoints: (allow: boolean) => void;
    addPointAtPosition: (x: number, y: number) => void;
  };

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
    if (!this.hass || !this._config || !this._poline) return;

    const state = {
      invertedLightness: this._poline.invertedLightness || false,
      anchorColors: this._poline.anchorPoints.map(p => p.hsl),
      numPoints: this._poline.numPoints,
      closedLoop: this._poline.closedLoop,
      positionFunctionX: this._getCurrentFunctionName('X'),
      positionFunctionY: this._getCurrentFunctionName('Y'),
      positionFunctionZ: this._getCurrentFunctionName('Z'),
    };

    // Save to localStorage for persistence
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
        
        if (this._poline) {
          // Restore inverted lightness
          if (typeof state.invertedLightness === 'boolean') {
            this._poline.invertedLightness = state.invertedLightness;
          }
          
          // Restore closed loop
          if (typeof state.closedLoop === 'boolean') {
            this._poline.closedLoop = state.closedLoop;
          }
          
          // Restore anchor colors and regenerate palette
          if (state.anchorColors && Array.isArray(state.anchorColors)) {
            const positionFunctionX = state.positionFunctionX ? 
              positionFunctions[state.positionFunctionX as keyof typeof positionFunctions] : 
              this._poline.positionFunctionX;
            const positionFunctionY = state.positionFunctionY ? 
              positionFunctions[state.positionFunctionY as keyof typeof positionFunctions] : 
              this._poline.positionFunctionY;
            const positionFunctionZ = state.positionFunctionZ ? 
              positionFunctions[state.positionFunctionZ as keyof typeof positionFunctions] : 
              this._poline.positionFunctionZ;
            
            this._poline = new Poline({
              anchorColors: state.anchorColors,
              numPoints: state.numPoints || this._poline.numPoints,
              positionFunctionX,
              positionFunctionY,
              positionFunctionZ,
            });
            
            // Reapply inverted lightness and closed loop after recreation
            if (typeof state.invertedLightness === 'boolean') {
              this._poline.invertedLightness = state.invertedLightness;
            }
            if (typeof state.closedLoop === 'boolean') {
              this._poline.closedLoop = state.closedLoop;
            }
            
            // Update picker if it's loaded
            if (this._picker && typeof this._picker.setPoline === 'function') {
              this._picker.setPoline(this._poline);
            }
          }
        }
      }
    } catch (e) {
      console.warn('Failed to load poline-card state:', e);
    }
    
    // Load saved palettes from server
    this._loadSavedPalettes();
  }

  private async _loadSavedPalettes(): Promise<void> {
    try {
      const stored = localStorage.getItem('poline-saved-palettes');
      if (stored) {
        this._savedPalettes = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load saved palettes from localStorage:', e);
    }
  }

  private async _savePalettesToLocalStorage(): Promise<void> {
    try {
      const palettesJson = JSON.stringify(this._savedPalettes);
      localStorage.setItem('poline-saved-palettes', palettesJson);
    } catch (e) {
      console.error('Failed to save palettes to localStorage:', e);
      alert('Failed to save palette to localStorage');
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
    // Reload palettes when hass becomes available or changes
    if (changedProps.has('hass') && this.hass) {
      this._loadSavedPalettes();
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
      if (this._picker && this._poline && typeof this._picker.setPoline === 'function') {
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

  private _applyColorToEntity(): void {
    if (!this.hass || !this._poline || !this._config?.entities) return;
    
    const entities = this._config.entities;
    if (entities.length === 0) return;

    // Distribute palette colors across all entities
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

  private async _applyPaletteToWled(): Promise<void> {
    if (!this.hass || !this._poline || !this._config?.wled_entities) return;
    
    const wledEntities = this._config.wled_entities;
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

    // Apply to all WLED entities in parallel
    await Promise.all(
      wledEntities.map(entityId => this._setWledCustomPalette(entityId, colors))
    );
  }

  private async _setWledCustomPalette(entityId: string, colors: number[][]): Promise<void> {
    if (!this.hass) return;

    try {
      // Get the IP from the corresponding sensor entity
      // Convert light.living_room_window -> sensor.living_room_window_ip
      const sensorEntityId = entityId.replace('light.', 'sensor.') + '_ip';
      const sensorEntity = this.hass.states[sensorEntityId];
      
      if (!sensorEntity) {
        console.error(`IP sensor ${sensorEntityId} not found for ${entityId}`);
        // Fallback: just set the first color
        this.hass.callService('light', 'turn_on', {
          entity_id: entityId,
          rgb_color: colors[0],
        });
        return;
      }

      const ip = sensorEntity.state;
      
      if (!ip || ip === 'unknown' || ip === 'unavailable') {
        console.error(`No valid IP address in ${sensorEntityId}: ${ip}`);
        // Fallback: just set the first color
        this.hass.callService('light', 'turn_on', {
          entity_id: entityId,
          rgb_color: colors[0],
        });
        return;
      }

      // Upload custom palette file to WLED
      // WLED expects format: {"palette":[position1, "hexcolor1", position2, "hexcolor2", ...]}
      // Positions are 0-255 representing gradient stops
      const paletteArray: (number | string)[] = [];
      
      colors.forEach((rgb, index) => {
        // Calculate position (0-255) evenly spaced across the palette
        const position = Math.round((index / (colors.length - 1)) * 255);
        const hexColor = rgb.map(c => c.toString(16).padStart(2, '0')).join('');
        
        paletteArray.push(position);
        paletteArray.push(hexColor);
      });
      
      const paletteData = { palette: paletteArray };
      const paletteJson = JSON.stringify(paletteData);
      
      // Create multipart form data
      const formData = new FormData();
      const blob = new Blob([paletteJson], { type: 'application/json' });
      formData.append('data', blob, '/palette0.json');

      // Upload the custom palette using /edit endpoint
      const uploadResponse = await fetch(`http://${ip}/edit`, {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error(`WLED upload error: ${uploadResponse.status}`);
      }

      // Reboot WLED to load the new palette
      const rebootResponse = await fetch(`http://${ip}/win&RB`, {
        method: 'GET',
      });

      if (!rebootResponse.ok) {
        console.warn(`WLED reboot warning: ${rebootResponse.status}`);
      }

      // Poll for WLED to finish restarting
      let wledReady = false;
      const maxAttempts = 30; // 30 seconds max
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        try {
          const pingResponse = await fetch(`http://${ip}/json/state`, {
            method: 'GET',
          });
          if (pingResponse.ok) {
            wledReady = true;
            break;
          }
        } catch {
          // WLED still rebooting, continue polling
        }
      }

      if (!wledReady) {
        throw new Error('WLED did not restart in time');
      }

      console.log(`WLED at ${ip} has restarted`);

      // Set the segment to use custom palette 0 and Aurora effect
      const statePayload = {
        seg: [{
          id: 0,
          pal: 0, // Custom palette 0
          fx: 38, // Aurora effect (effect ID 38)
        }],
        on: true
      };

      const stateResponse = await fetch(`http://${ip}/json/state`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(statePayload),
      });

      if (!stateResponse.ok) {
        throw new Error(`WLED state error: ${stateResponse.status}`);
      }

      console.log(`Successfully applied custom palette to WLED at ${ip}`);
    } catch (error) {
      console.error(`Failed to set WLED palette for ${entityId}:`, error);
      // Fallback: set first color via Home Assistant
      this.hass.callService('light', 'turn_on', {
        entity_id: entityId,
        rgb_color: colors[0],
      });
    }
  }

  private _applyColors(): void {
    // Save current state for persistence
    this._saveState();
    
    // Apply to regular light entities
    this._applyColorToEntity();
    
    // Apply to WLED entities in background (don't await to prevent UI freeze)
    this._applyPaletteToWled().catch(error => {
      console.error('Error applying WLED palette:', error);
    });
  }

  private _openPalettesDialog(): void {
    this._paletteName = '';
    this._showPalettesDialog = true;
  }

  private _closePalettesDialog(): void {
    this._showPalettesDialog = false;
    this._paletteName = '';
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

    await this._savePalettesToLocalStorage();
    this._paletteName = '';
  }

  private async _loadPalette(palette: SavedPalette): Promise<void> {
    if (!this._config) return;

    // Create a new config object with palette settings
    this._config = {
      ...this._config,
      anchor_colors: palette.anchorColors,
      num_points: palette.numPoints,
      position_function_x: palette.positionFunctionX,
      position_function_y: palette.positionFunctionY,
      position_function_z: palette.positionFunctionZ,
      closed_loop: palette.closedLoop,
      invert_lightness: palette.invertedLightness,
    };

    // Reinitialize poline with new settings
    this._initializePoline();

    // Update picker
    if (this._picker && this._poline && typeof this._picker.setPoline === 'function') {
      this._picker.setPoline(this._poline);
    }

    this._closePalettesDialog();
    this.requestUpdate();
  }

  private async _deletePalette(palette: SavedPalette): Promise<void> {
    this._savedPalettes = this._savedPalettes.filter(p => p.name !== palette.name);
    await this._savePalettesToLocalStorage();
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

  private _toggleInvertLightness(): void {
    if (!this._poline) return;
    
    this._poline.invertedLightness = !this._poline.invertedLightness;
    
    // Update the picker
    if (this._picker && typeof this._picker.setPoline === 'function') {
      this._picker.setPoline(this._poline);
    }
    
    this._saveState();
    this.requestUpdate();
  }

  private _openSettingsDialog(): void {
    this._showSettingsDialog = true;
  }

  private _closeSettingsDialog(): void {
    this._showSettingsDialog = false;
  }

  private _updatePositionFunction(axis: 'X' | 'Y' | 'Z', functionName: string): void {
    if (!this._poline) return;

    const positionFunction = positionFunctions[functionName as keyof typeof positionFunctions];
    if (!positionFunction) return;

    // Update the poline instance
    if (axis === 'X') {
      this._poline.positionFunctionX = positionFunction;
    } else if (axis === 'Y') {
      this._poline.positionFunctionY = positionFunction;
    } else if (axis === 'Z') {
      this._poline.positionFunctionZ = positionFunction;
    }

    // Update the picker
    if (this._picker && typeof this._picker.setPoline === 'function') {
      this._picker.setPoline(this._poline);
    }

    this._saveState();
    this.requestUpdate();
  }

  private _getCurrentFunctionName(axis: 'X' | 'Y' | 'Z'): string {
    if (!this._poline) return 'sinusoidalPosition';

    const currentFunction = axis === 'X' 
      ? this._poline.positionFunctionX
      : axis === 'Y'
      ? this._poline.positionFunctionY
      : this._poline.positionFunctionZ;

    // Find the function name by comparing references
    for (const [name, func] of Object.entries(positionFunctions)) {
      if (func === currentFunction) {
        return name;
      }
    }
    return 'sinusoidalPosition';
  }

  private _getPositionFunctionOptions(currentValue: string) {
    const functionNames = [
      'linearPosition',
      'exponentialPosition',
      'quadraticPosition',
      'cubicPosition',
      'quarticPosition',
      'sinusoidalPosition',
      'asinusoidalPosition',
      'arcPosition',
      'smoothStepPosition',
    ];

    return functionNames.map(name => html`
      <option value="${name}" ?selected=${name === currentValue}>
        ${name.replace('Position', '').replace(/([A-Z])/g, ' $1').trim()}
      </option>
    `);
  }

  private _getPalettePreviewColors(palette: SavedPalette): string[] {
    // Create a temporary Poline instance to generate preview colors
    const positionFunctionX =
      positionFunctions[
        palette.positionFunctionX as keyof typeof positionFunctions
      ] || positionFunctions.sinusoidalPosition;
    const positionFunctionY =
      positionFunctions[
        palette.positionFunctionY as keyof typeof positionFunctions
      ] || positionFunctions.quadraticPosition;
    const positionFunctionZ =
      positionFunctions[
        palette.positionFunctionZ as keyof typeof positionFunctions
      ] || positionFunctions.linearPosition;

    const tempPoline = new Poline({
      anchorColors: palette.anchorColors,
      numPoints: palette.numPoints,
      positionFunctionX,
      positionFunctionY,
      positionFunctionZ,
    });

    if (palette.closedLoop !== undefined) {
      tempPoline.closedLoop = palette.closedLoop;
    }

    if (palette.invertedLightness !== undefined) {
      tempPoline.invertedLightness = palette.invertedLightness;
    }

    // Return a subset of colors for preview (up to 8 colors)
    const previewCount = Math.min(8, tempPoline.colors.length);
    const colors: string[] = [];
    for (let i = 0; i < previewCount; i++) {
      const index = Math.floor((i / (previewCount - 1)) * (tempPoline.colors.length - 1));
      colors.push(tempPoline.colorsCSS[index]);
    }
    return colors;
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

    .main-content {
      display: flex;
      justify-content: center;
      margin-bottom: 16px;
      overflow: hidden;
    }

    .picker-container {
      flex-shrink: 0;
      max-width: 100%;
    }

    poline-picker {
      width: 100%;
      max-width: 350px;
      height: 310px;
      --poline-picker-bg-color: var(--card-background-color, #fff);
      --poline-picker-line-color: var(--primary-text-color, #333);
    }

    .palette-icon {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      flex-shrink: 0;
    }

    .controls {
      display: flex;
      justify-content: center;
      margin-top: 8px;
    }

    .button-group {
      display: flex;
      align-items: center;
      gap: 8px;
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

    button.compact {
      padding: 8px 12px;
      font-size: 13px;
      min-width: auto;
    }

    button.active {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }

    button.inactive {
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
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

    .save-section {
      padding-bottom: 16px;
      border-bottom: 1px solid var(--divider-color);
    }

    .settings-section {
      padding: 12px 0;
    }

    .settings-section h4 {
      margin: 0 0 12px 0;
      font-size: 0.95em;
      font-weight: 500;
      color: var(--primary-text-color);
    }

    .settings-section label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      font-size: 14px;
    }

    .settings-section input[type="checkbox"] {
      cursor: pointer;
      width: 18px;
      height: 18px;
    }

    .setting-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }

    .setting-item label {
      font-size: 14px;
      font-weight: 500;
      min-width: 80px;
    }

    .setting-item select {
      flex: 1;
      padding: 6px 8px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-size: 14px;
      cursor: pointer;
    }

    .setting-item select:focus {
      outline: none;
      border-color: var(--primary-color);
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

    .palette-item-content {
      flex: 1;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .palette-item-name {
      font-weight: 500;
    }

    .palette-item-colors {
      display: flex;
      gap: 4px;
    }

    .palette-preview-swatch {
      width: 24px;
      height: 24px;
      border-radius: 4px;
      border: 1px solid var(--divider-color);
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

        <div class="main-content">
          <div class="picker-container">
            <poline-picker interactive></poline-picker>
          </div>
        </div>

        <div class="controls">
          <div class="button-group">
            <svg class="palette-icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              ${svg`
                <circle cx="50" cy="50" r="50" fill="#ffffff" />
                ${colors.map((color: string, index: number) => {
                  const sliceAngle = 360 / colors.length;
                  const startAngle = index * sliceAngle - 90; // Start from top
                  const endAngle = startAngle + sliceAngle;
                  
                  // Convert to radians
                  const startRad = (startAngle * Math.PI) / 180;
                  const endRad = (endAngle * Math.PI) / 180;
                  
                  // Calculate arc points
                  const x1 = 50 + 50 * Math.cos(startRad);
                  const y1 = 50 + 50 * Math.sin(startRad);
                  const x2 = 50 + 50 * Math.cos(endRad);
                  const y2 = 50 + 50 * Math.sin(endRad);
                  
                  const largeArc = sliceAngle > 180 ? 1 : 0;
                  
                  return svg`
                    <path
                      d="M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z"
                      fill="${color}"
                    >
                      <title>Color ${index + 1}</title>
                    </path>
                  `;
                })}
              `}
            </svg>
            <button @click=${this._applyColors}>Apply</button>
            <button class="secondary" @click=${this._openPalettesDialog}>
              Saved Palettes (${this._savedPalettes.length})
            </button>
            <button 
              class="compact secondary"
              @click=${this._openSettingsDialog}
              title="Settings"
            >
              ⚙
            </button>
          </div>
        </div>

        ${this._showPalettesDialog
          ? html`
              <div class="dialog-overlay" @click=${this._closePalettesDialog}>
                <div class="dialog" @click=${(e: Event) => e.stopPropagation()}>
                  <div class="dialog-header">Saved Palettes</div>
                  <div class="dialog-content">
                    <div class="save-section">
                      <input
                        type="text"
                        placeholder="Enter palette name to save current"
                        .value=${this._paletteName}
                        @input=${(e: Event) =>
                          (this._paletteName = (e.target as HTMLInputElement).value)}
                        @keydown=${(e: KeyboardEvent) => {
                          if (e.key === 'Enter' && this._paletteName.trim()) this._savePalette();
                          if (e.key === 'Escape') this._closePalettesDialog();
                        }}
                      />
                      <button 
                        @click=${this._savePalette} 
                        ?disabled=${!this._paletteName.trim()}
                        style="margin-top: 8px;"
                      >
                        Save Current Palette
                      </button>
                    </div>
                    
                    ${this._savedPalettes.length === 0
                      ? html`<p style="margin-top: 16px; color: var(--secondary-text-color);">No saved palettes yet</p>`
                      : html`
                          <div class="palette-list" style="margin-top: 16px;">
                            ${this._savedPalettes.map(
                              (palette) => html`
                                <div class="palette-item">
                                  <div
                                    class="palette-item-content"
                                    @click=${() => this._loadPalette(palette)}
                                  >
                                    <div class="palette-item-name">
                                      ${palette.name}
                                    </div>
                                    <div class="palette-item-colors">
                                      ${this._getPalettePreviewColors(palette).map(
                                        (color) => html`
                                          <div
                                            class="palette-preview-swatch"
                                            style="background-color: ${color}"
                                          ></div>
                                        `
                                      )}
                                    </div>
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
                    <button class="secondary" @click=${this._closePalettesDialog}>Close</button>
                  </div>
                </div>
              </div>
            `
          : ''}

        ${this._showSettingsDialog
          ? html`
              <div class="dialog-overlay" @click=${this._closeSettingsDialog}>
                <div class="dialog" @click=${(e: Event) => e.stopPropagation()}>
                  <div class="dialog-header">Settings</div>
                  <div class="dialog-content">
                    <div class="settings-section">
                      <label>
                        <input
                          type="checkbox"
                          .checked=${this._poline?.invertedLightness || false}
                          @change=${this._toggleInvertLightness}
                        />
                        Invert Lightness
                      </label>
                    </div>

                    <div class="settings-section">
                      <h4>Position Functions</h4>
                      
                      <div class="setting-item">
                        <label>X Axis:</label>
                        <select
                          @change=${(e: Event) =>
                            this._updatePositionFunction('X', (e.target as HTMLSelectElement).value)}
                        >
                          ${this._getPositionFunctionOptions(this._getCurrentFunctionName('X'))}
                        </select>
                      </div>

                      <div class="setting-item">
                        <label>Y Axis:</label>
                        <select
                          @change=${(e: Event) =>
                            this._updatePositionFunction('Y', (e.target as HTMLSelectElement).value)}
                        >
                          ${this._getPositionFunctionOptions(this._getCurrentFunctionName('Y'))}
                        </select>
                      </div>

                      <div class="setting-item">
                        <label>Z Axis:</label>
                        <select
                          @change=${(e: Event) =>
                            this._updatePositionFunction('Z', (e.target as HTMLSelectElement).value)}
                        >
                          ${this._getPositionFunctionOptions(this._getCurrentFunctionName('Z'))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div class="dialog-actions">
                    <button class="secondary" @click=${this._closeSettingsDialog}>Close</button>
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
