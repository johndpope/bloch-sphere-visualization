const commonjs = require('rollup-plugin-commonjs')
const resolve = require('rollup-plugin-node-resolve')
const cleanup = require('rollup-plugin-cleanup')
const babel = require('rollup-plugin-babel')

export default {
  input: 'src/index.js',
  output: {
    file: './build/BlochSphere.js',
    format: 'umd',
    name: 'BlochSphere'
  },
  watch: {
    include: 'src/**'
  },
  plugins: [
    resolve(),
    commonjs(),
    babel({
      exclude: 'node_modules/**'
    }),
    cleanup()
  ]
}
