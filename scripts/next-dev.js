const path = require('path')
const { spawn } = require('child_process')

const args = ['dev']

if (process.platform === 'win32' && process.arch === 'x64') {
  try {
    const wasmPkg = require.resolve('@next/swc-wasm-nodejs/package.json')
    process.env.NEXT_TEST_WASM = process.env.NEXT_TEST_WASM || '1'
    process.env.NEXT_TEST_WASM_DIR =
      process.env.NEXT_TEST_WASM_DIR || path.dirname(wasmPkg)
    args.push('--webpack')
  } catch {
    // Fall back to the default dev server if the WASM package is unavailable.
  }
}

const child = spawn(
  process.execPath,
  [require.resolve('next/dist/bin/next'), ...args],
  {
    stdio: 'inherit',
    env: process.env,
  }
)

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
    return
  }

  process.exit(code ?? 1)
})

child.on('error', (error) => {
  throw error
})
