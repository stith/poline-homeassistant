import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';

export default {
  input: 'src/poline-card.ts',
  output: {
    file: 'dist/poline-card.js',
    format: 'es',
    sourcemap: true,
  },
  plugins: [
    resolve({
      browser: true,
    }),
    commonjs(),
    json(),
    typescript({
      tsconfig: './tsconfig.json',
    }),
    terser({
      format: {
        comments: false,
      },
    }),
  ],
};
