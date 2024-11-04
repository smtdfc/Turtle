import terser from '@rollup/plugin-terser';

export default [
  {
    input: "./src/production.js",
    output: [
      {
        file: './dist/bundles/production.turtle.cjs',
        format: 'cjs',
        sourcemap: true
        },
      {
        file: './dist/bundles/production.turtle.min.js',
        format: 'umd',
        name: "Turtle",
        sourcemap: true
        },
      {
        file: './dist/bundles/production.turtle.min.mjs',
        format: 'esm',
        sourcemap: true
        },
      ],
    plugins: [terser()]
  },
  {
    input: "./src/development.js",
    output: [
      {
        file: './dist/bundles/development.turtle.min.cjs',
        format: 'cjs',
        sourcemap: true
        },
      {
        file: './dist/bundles/development.turtle.min.js',
        format: 'umd',
        name: "Turtle",
        sourcemap: true
        },
      {
        file: './dist/bundles/development.turtle.min.mjs',
        format: 'esm',
        sourcemap: true
        },
      ],
    plugins: [terser()]
    },
  {
    input: "./src/development.js",
    output: [
      {
        file: './dist/bundles/development.turtle.cjs',
        format: 'cjs',
        sourcemap: true
        },
      {
        file: './dist/bundles/development.turtle.js',
        format: 'umd',
        name: "Turtle",
        sourcemap: true
        },
      {
        file: './dist/bundles/development.turtle.mjs',
        format: 'esm',
        sourcemap: true
        },
      ],
    plugins: []
  }
];