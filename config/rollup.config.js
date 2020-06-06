import nodeResolve from '@rollup/plugin-node-resolve';
import packageJson from '../package.json';

const external = ['react', 'tslib'];
const libDir = './lib';

function outputFile(format) {
  return `./lib/index.${format}.js`;
}

function prepareESM() {
  return {
    input: packageJson.module,
    external,
    output: {
      file: outputFile('esm'),
      format: 'esm',
      sourcemap: true,
    },
    plugins: [nodeResolve()],
  };
}

function prepareCJS() {
  return {
    input: packageJson.module,
    external,
    output: {
      file: outputFile('cjs'),
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    plugins: [nodeResolve()],
  };
}

function rollup() {
  return [prepareESM(), prepareCJS()];
}

export default rollup();
