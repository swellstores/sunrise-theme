import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/js/main.js',
  output: [
    {
      file: 'theme/assets/bundle.js',
      format: 'esm',
      sourcemap: false,
    },
  ],
  plugins: [resolve(), commonjs(), terser()],
};
