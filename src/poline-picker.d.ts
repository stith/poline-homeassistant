// Type declarations for poline picker module
declare module 'poline/dist/picker.mjs' {
  export * from 'poline';
  
  export class PolinePicker extends HTMLElement {
    setPoline(poline: any): void;
    setAllowAddPoints(allow: boolean): void;
    addPointAtPosition(x: number, y: number): any;
  }
}
