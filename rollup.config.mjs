import terser from '@rollup/plugin-terser';

export default [
  {
    input: "./src/production.js",
    output: [
      {
        file: './dist/production.turtle.cjs',
        format: 'cjs',
        sourcemap: true
        },
      {
        file: './dist/production.turtle.min.js',
        format: 'umd',
        name: "Turtle",
        sourcemap: true
        },
      {
        file: './dist/production.turtle.min.mjs',
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
        file: './dist/development.turtle.min.cjs',
        format: 'cjs',
        sourcemap: true
        },
      {
        file: './dist/development.turtle.min.js',
        format: 'umd',
        name: "Turtle",
        sourcemap: true
        },
      {
        file: './dist/development.turtle.min.mjs',
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
        file: './dist/development.turtle.cjs',
        format: 'cjs',
        sourcemap: true
        },
      {
        file: './dist/development.turtle.js',
        format: 'umd',
        name: "Turtle",
        sourcemap: true
        },
      {
        file: './dist/development.turtle.mjs',
        format: 'esm',
        sourcemap: true
        },
      ],
    plugins: []
  }
];