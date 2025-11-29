// Type declarations for poline picker module
declare module 'poline/dist/picker.mjs' {
  import { Poline } from 'poline';
  export * from 'poline';
  
  export class PolinePicker extends HTMLElement {
    setPoline(poline: Poline): void;
    setAllowAddPoints(allow: boolean): void;
    addPointAtPosition(x: number, y: number): void;
  }
}
