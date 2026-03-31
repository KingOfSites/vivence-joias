const path = require('path')
const { spawnSync } = require('child_process')

const args = ['build']

if (process.platform === 'win32' && process.arch === 'x64') {
  try {
    const wasmPkg = require.resolve('@next/swc-wasm-nodejs/package.json')
    process.env.NEXT_TEST_WASM = process.env.NEXT_TEST_WASM || '1'
    process.env.NEXT_TEST_WASM_DIR =
      process.env.NEXT_TEST_WASM_DIR || path.dirname(wasmPkg)
    args.push('--webpack')
  } catch {
    // Fall back to the default build if the WASM package is unavailable.
  }
}

const result = spawnSync(process.execPath, [require.resolve('next/dist/bin/next'), ...args], {
  stdio: 'inherit',
  env: process.env,
})

if (result.error) {
  throw result.error
}

process.exit(result.status ?? 1)
