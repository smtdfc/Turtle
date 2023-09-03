import path from "path"
import terser from '@rollup/plugin-terser';
export default  {
  input: path.join(__dirname,"../src/turtle.js"),
  output: [
    {
      file: '../dist/turtle.cjs.js',
      format: 'cjs'
    },
    {
      file: '../dist/turtle.min.js',
      format: 'iife'

    }
  ],
  plugins:[terser()]
};