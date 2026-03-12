import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'

const root = process.cwd()
const files = [
  'icu-cardiovascular.js',
  'icu-functional.js',
  'icu-infections-sepsis.js',
  'icu-neurological.js',
  'icu-perioperative.js',
  'icu-populations.js',
  'icu-respiratory.js',
  'icu-trauma.js',
  'icu.js',
]

const noop = () => {}
const fakeNode = () => ({
  style: {},
  appendChild: noop,
  remove: noop,
  setAttribute: noop,
  querySelector: () => null,
  querySelectorAll: () => [],
  addEventListener: noop,
  removeEventListener: noop,
  innerHTML: '',
  textContent: '',
})

const sandbox = {
  console,
  setTimeout,
  clearTimeout,
  setInterval,
  clearInterval,
  localStorage: { getItem: () => null, setItem: noop, removeItem: noop },
  navigator: { onLine: true },
  document: {
    body: { appendChild: noop },
    getElementById: () => null,
    createElement: fakeNode,
    querySelector: () => null,
    querySelectorAll: () => [],
  },
}

sandbox.window = sandbox
vm.createContext(sandbox)

for (const file of files) {
  const source = fs.readFileSync(path.join(root, file), 'utf8')
  vm.runInContext(source, sandbox, { filename: file })
}

const systems = Array.isArray(sandbox.clinicalSystems) ? sandbox.clinicalSystems : []
const output = `export const ICU_REFERENCE_SYSTEMS = ${JSON.stringify(systems, null, 2)} as const\n`

fs.mkdirSync(path.join(root, 'lib/generated'), { recursive: true })
fs.writeFileSync(path.join(root, 'lib/generated/icu-reference-data.ts'), output)

console.log(`Generated ${systems.length} ICU systems`)
