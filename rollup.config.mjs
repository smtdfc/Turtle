
import terser from '@rollup/plugin-terser';
export default  {
  input:"./src/turtle.js" ,
  output: [
    {
      file: './dist/turtle.min.cjs',
      format: 'cjs'
    },
    {
      file: './dist/turtle.min.js',
      format: 'iife'
    },
        {
          file: './dist/turtle.min.mjs',
          format: 'esm'
        },
  ],
  plugins:[terser()]
};