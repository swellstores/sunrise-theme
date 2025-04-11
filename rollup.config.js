import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import terser from '@rollup/plugin-terser';

export default {
  input: [
    "src/js/main.js",
    "src/js/swiper-element-bundle.js",
    "src/js/slideshow-navigation.js",
    "src/js/accordion.js",
  ],
  output: [
    {
      dir: "theme/assets",
      format: "esm",
      sourcemap: false,
    },
  ],
  plugins: [
    resolve(),
    commonjs(),
    terser({
      /* compress: {
        drop_debugger: false, // Preserve debugger statements
      }, */
    }),
  ],
};
