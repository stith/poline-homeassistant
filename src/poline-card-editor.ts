import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant } from './types';
import type { LovelaceCardConfig } from './types';

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
  storage_state_entity?: string;
  storage_palettes_entity?: string;
}

@customElement('poline-card-editor')
export class PolineCardEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: PolineCardConfig;

  public setConfig(config: PolineCardConfig): void {
    this._config = config;
  }

  private _getLightEntities(): string[] {
    if (!this.hass) {
      return [];
    }
    return Object.keys(this.hass.states)
      .filter(entityId => entityId.startsWith('light.'))
      .sort();
  }

  private _valueChanged(ev: CustomEvent): void {
    if (!this._config || !this.hass) {
      return;
    }
    const target = ev.target as HTMLInputElement | HTMLSelectElement;
    const value = target.value;
    const configValue = (target as HTMLElement & { configValue?: string }).configValue;
    
    if (!configValue || this._config[configValue as keyof PolineCardConfig] === value) {
      return;
    }

    const newConfig = {
      ...this._config,
      [configValue]: value === '' ? undefined : value,
    };

    const event = new CustomEvent('config-changed', {
      detail: { config: newConfig },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  private _toggleChanged(ev: CustomEvent): void {
    if (!this._config || !this.hass) {
      return;
    }
    const target = ev.target as HTMLInputElement;
    const value = target.checked;
    const configValue = (target as HTMLElement & { configValue?: string }).configValue;

    if (!configValue) {
      return;
    }

    const newConfig = {
      ...this._config,
      [configValue]: value,
    };

    const event = new CustomEvent('config-changed', {
      detail: { config: newConfig },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  private _numberChanged(ev: CustomEvent): void {
    if (!this._config || !this.hass) {
      return;
    }
    const target = ev.target as HTMLInputElement;
    const value = parseInt(target.value);
    const configValue = (target as HTMLElement & { configValue?: string }).configValue;

    if (isNaN(value) || !configValue) {
      return;
    }

    const newConfig = {
      ...this._config,
      [configValue]: value,
    };

    const event = new CustomEvent('config-changed', {
      detail: { config: newConfig },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  private _addEntity(listName: 'entities' | 'wled_entities'): void {
    if (!this._config || !this.hass) {
      return;
    }

    const currentList = this._config[listName] || [];
    const newConfig = {
      ...this._config,
      [listName]: [...currentList, ''],
    };

    const event = new CustomEvent('config-changed', {
      detail: { config: newConfig },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  private _removeEntity(listName: 'entities' | 'wled_entities', index: number): void {
    if (!this._config || !this.hass) {
      return;
    }

    const currentList = this._config[listName] || [];
    const newList = currentList.filter((_, i) => i !== index);
    const newConfig = {
      ...this._config,
      [listName]: newList.length > 0 ? newList : undefined,
    };

    const event = new CustomEvent('config-changed', {
      detail: { config: newConfig },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  private _entityChanged(ev: CustomEvent, listName: 'entities' | 'wled_entities', index: number): void {
    if (!this._config || !this.hass) {
      return;
    }

    const value = ev.detail?.value ?? (ev.target as HTMLInputElement)?.value ?? '';

    const currentList = this._config[listName] || [];
    const newList = [...currentList];
    newList[index] = value;

    const newConfig = {
      ...this._config,
      [listName]: newList,
    };

    const event = new CustomEvent('config-changed', {
      detail: { config: newConfig },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  static styles = css`
    .card-config {
      padding: 16px;
    }

    .option {
      margin-bottom: 16px;
    }

    .option label {
      display: block;
      margin-bottom: 4px;
      font-weight: 500;
      font-size: 14px;
    }

    .option input[type="text"],
    .option input[type="number"],
    .option textarea,
    .option select {
      width: 100%;
      padding: 8px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-size: 14px;
      box-sizing: border-box;
    }

    .option input[type="checkbox"] {
      margin-right: 8px;
    }

    .option .checkbox-label {
      display: flex;
      align-items: center;
      cursor: pointer;
    }

    .option textarea {
      min-height: 60px;
      resize: vertical;
    }

    .hint {
      font-size: 12px;
      color: var(--secondary-text-color);
      margin-top: 4px;
    }

    .section-header {
      font-size: 16px;
      font-weight: 600;
      margin: 24px 0 12px 0;
      color: var(--primary-text-color);
    }

    .section-header:first-child {
      margin-top: 0;
    }

    .entity-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .entity-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .entity-row ha-entity-picker {
      flex: 1;
      min-width: 0;
    }

    .entity-row input {
      flex: 1;
      min-width: 0;
      padding: 8px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-size: 14px;
    }

    ha-entity-picker {
      display: block;
      width: 100%;
    }

    .entity-row mwc-button {
      --mdc-theme-primary: var(--error-color);
    }

    .add-entity-button {
      margin-top: 8px;
      background: var(--primary-color);
      color: var(--text-primary-color);
      border: none;
      border-radius: 4px;
      padding: 10px 16px;
      cursor: pointer;
      font-weight: 500;
      transition: background 0.2s;
      display: inline-block;
      width: auto;
    }

    .add-entity-button:hover {
      background: var(--primary-color);
      opacity: 0.9;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .add-entity-button:active {
      transform: translateY(1px);
    }
  `;

  protected render() {
    if (!this._config || !this.hass) {
      return html``;
    }

    return html`
      <div class="card-config">
        <div class="section-header">Basic Settings</div>

        <div class="option">
          <label for="title">Title (optional)</label>
          <input
            id="title"
            type="text"
            .value=${this._config.title || ''}
            .configValue=${'title'}
            @change=${this._valueChanged}
            placeholder="Poline Color Picker"
          />
        </div>

        <div class="option">
          <label for="num_points">Number of Points</label>
          <input
            id="num_points"
            type="number"
            min="2"
            max="20"
            .value=${this._config.num_points || 4}
            .configValue=${'num_points'}
            @change=${this._numberChanged}
          />
          <div class="hint">Number of color points between anchors (2-20). For the most predictable results, set this to equal the number of regular lights, or to a multiple. For example, if you have 4 lights, choose 4, 8, 12, etc.</div>
        </div>

        <div class="section-header">Light Entities</div>

        <div class="option">
          <label>Regular Light Entities</label>
          <div class="entity-list">
            ${(this._config.entities || []).map(
              (entity, index) => html`
                <div class="entity-row">
                  <input
                    type="text"
                    .value=${entity || ''}
                    @input=${(ev: InputEvent) => {
                      const target = ev.target as HTMLInputElement;
                      this._entityChanged(
                        new CustomEvent('value-changed', { detail: { value: target.value } }), 
                        'entities', 
                        index
                      );
                    }}
                    list="light-entities-list"
                    placeholder="light.example"
                  />
                  <mwc-button
                    @click=${() => this._removeEntity('entities', index)}
                  >
                    Delete
                  </mwc-button>
                </div>
              `
            )}
          </div>
          <datalist id="light-entities-list">
            ${this._getLightEntities().map(entityId => html`<option value=${entityId}></option>`)}
          </datalist>
          <mwc-button
            class="add-entity-button"
            @click=${() => this._addEntity('entities')}
          >
            Add Entity
          </mwc-button>
          <div class="hint">Light entities to control with generated colors. Each light will be assigned one color from the palette.</div>
        </div>

        <div class="option">
          <label>WLED Light Entities</label>
          <div class="entity-list">
            ${(this._config.wled_entities || []).map(
              (entity, index) => html`
                <div class="entity-row">
                  <input
                    type="text"
                    .value=${entity || ''}
                    @input=${(ev: InputEvent) => {
                      const target = ev.target as HTMLInputElement;
                      this._entityChanged(
                        new CustomEvent('value-changed', { detail: { value: target.value } }), 
                        'wled_entities', 
                        index
                      );
                    }}
                    list="light-entities-list"
                    placeholder="light.wled_example"
                  />
                  <mwc-button
                    @click=${() => this._removeEntity('wled_entities', index)}
                  >
                    Delete
                  </mwc-button>
                </div>
              `
            )}
          </div>
          <mwc-button
            class="add-entity-button"
            @click=${() => this._addEntity('wled_entities')}
          >
            Add WLED Entity
          </mwc-button>
          <div class="hint">WLED lights to upload palette to. Each WLED instance will recieve the full color palette.</div>
        </div>

        <div class="option">
          <label for="palette_size">WLED Palette Size</label>
          <input
            id="palette_size"
            type="number"
            min="2"
            max="256"
            .value=${this._config.palette_size || 16}
            .configValue=${'palette_size'}
            @change=${this._numberChanged}
          />
          <div class="hint">Number of colors in WLED palette (2-256)</div>
        </div>

        <div class="section-header">Storage Settings</div>

        <div class="option">
          <label for="storage_state_entity">State Storage Entity</label>
          <input
            id="storage_state_entity"
            type="text"
            .value=${this._config.storage_state_entity || ''}
            .configValue=${'storage_state_entity'}
            @change=${this._valueChanged}
            placeholder="input_text.poline_card_state"
          />
          <div class="hint">
            input_text entity to store card state (create with max: 255)
          </div>
        </div>

        <div class="option">
          <label for="storage_palettes_entity">Palettes Storage Entity</label>
          <input
            id="storage_palettes_entity"
            type="text"
            .value=${this._config.storage_palettes_entity || ''}
            .configValue=${'storage_palettes_entity'}
            @change=${this._valueChanged}
            placeholder="input_text.poline_saved_palettes"
          />
          <div class="hint">
            input_text entity to store saved palettes (create with max: 255)
          </div>
        </div>

        <div class="section-header">Advanced Settings</div>

        <div class="option">
          <label class="checkbox-label">
            <input
              type="checkbox"
              .checked=${this._config.closed_loop || false}
              .configValue=${'closed_loop'}
              @change=${this._toggleChanged}
            />
            Closed Loop Palette
          </label>
          <div class="hint">Last color connects back to first color</div>
        </div>

        <div class="option">
          <label class="checkbox-label">
            <input
              type="checkbox"
              .checked=${this._config.invert_lightness || false}
              .configValue=${'invert_lightness'}
              @change=${this._toggleChanged}
            />
            Invert Lightness
          </label>
          <div class="hint">Invert the lightness calculation</div>
        </div>

        <div class="option">
          <label for="position_function_x">Position Function X</label>
          <select
            id="position_function_x"
            .value=${this._config.position_function_x || 'sinusoidalPosition'}
            .configValue=${'position_function_x'}
            @change=${this._valueChanged}
          >
            <option value="linearPosition">Linear</option>
            <option value="exponentialPosition">Exponential</option>
            <option value="quadraticPosition">Quadratic</option>
            <option value="cubicPosition">Cubic</option>
            <option value="quarticPosition">Quartic</option>
            <option value="sinusoidalPosition">Sinusoidal</option>
            <option value="asinusoidalPosition">Asinusoidal</option>
            <option value="arcPosition">Arc</option>
            <option value="smoothStepPosition">Smooth Step</option>
          </select>
        </div>

        <div class="option">
          <label for="position_function_y">Position Function Y</label>
          <select
            id="position_function_y"
            .value=${this._config.position_function_y || 'quadraticPosition'}
            .configValue=${'position_function_y'}
            @change=${this._valueChanged}
          >
            <option value="linearPosition">Linear</option>
            <option value="exponentialPosition">Exponential</option>
            <option value="quadraticPosition">Quadratic</option>
            <option value="cubicPosition">Cubic</option>
            <option value="quarticPosition">Quartic</option>
            <option value="sinusoidalPosition">Sinusoidal</option>
            <option value="asinusoidalPosition">Asinusoidal</option>
            <option value="arcPosition">Arc</option>
            <option value="smoothStepPosition">Smooth Step</option>
          </select>
        </div>

        <div class="option">
          <label for="position_function_z">Position Function Z</label>
          <select
            id="position_function_z"
            .value=${this._config.position_function_z || 'linearPosition'}
            .configValue=${'position_function_z'}
            @change=${this._valueChanged}
          >
            <option value="linearPosition">Linear</option>
            <option value="exponentialPosition">Exponential</option>
            <option value="quadraticPosition">Quadratic</option>
            <option value="cubicPosition">Cubic</option>
            <option value="quarticPosition">Quartic</option>
            <option value="sinusoidalPosition">Sinusoidal</option>
            <option value="asinusoidalPosition">Asinusoidal</option>
            <option value="arcPosition">Arc</option>
            <option value="smoothStepPosition">Smooth Step</option>
          </select>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'poline-card-editor': PolineCardEditor;
  }
}
