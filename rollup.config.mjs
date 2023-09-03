
import terser from '@rollup/plugin-terser';
export default  {
  input:"./src/turtle.js" ,
  output: [
    {
      file: './dist/turtle.cjs.js',
      format: 'cjs'
    },
    {
      file: './dist/turtle.min.js',
      format: 'iife'

    }
  ],
  plugins:[terser()]
};