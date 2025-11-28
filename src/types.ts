export interface HomeAssistant {
  callService: (domain: string, service: string, serviceData?: Record<string, unknown>) => Promise<void>;
  states: { [entity_id: string]: HassEntity };
  config: HassConfig;
  language: string;
  themes: unknown;
  user?: unknown;
}

export interface HassEntity {
  entity_id: string;
  state: string;
  last_changed: string;
  last_updated: string;
  attributes: { [key: string]: unknown };
  context: unknown;
}

export interface HassConfig {
  latitude: number;
  longitude: number;
  elevation: number;
  unit_system: {
    length: string;
    mass: string;
    temperature: string;
    volume: string;
  };
  location_name: string;
  time_zone: string;
  components: string[];
  config_dir: string;
  whitelist_external_dirs: string[];
  allowlist_external_dirs: string[];
  version: string;
}

export interface LovelaceCardConfig {
  type: string;
  [key: string]: unknown;
}

export interface LovelaceCard extends HTMLElement {
  hass?: HomeAssistant;
  setConfig(config: LovelaceCardConfig): void;
  getCardSize?(): number;
}
