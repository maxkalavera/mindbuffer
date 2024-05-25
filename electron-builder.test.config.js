const { readFileSync } = require('node:fs')
const { resolve } = require('node:path')

const pkg = JSON.parse(readFileSync(resolve('./package.json'), { encoding: 'utf8' }));

module.exports = {
  appId: pkg.name,
  productName: pkg.productName,
  asar: false,
  directories: {
    output: "distribution/"
  },
  linux: { target: ['dir'] },
  mac: { target: ['dir'] },
  win: { target: ['dir'] }
};
