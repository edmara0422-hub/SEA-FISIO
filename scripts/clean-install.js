#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧹 Limpando cache...');

// Remover .next
try {
  const nextDir = path.join(process.cwd(), '.next');
  if (fs.existsSync(nextDir)) {
    fs.rmSync(nextDir, { recursive: true, force: true });
    console.log('✅ Removido .next');
  }
} catch (e) {
  console.log('⚠️ Não conseguiu remover .next:', e.message);
}

// Remover .turbo
try {
  const turboDir = path.join(process.cwd(), '.turbo');
  if (fs.existsSync(turboDir)) {
    fs.rmSync(turboDir, { recursive: true, force: true });
    console.log('✅ Removido .turbo');
  }
} catch (e) {
  console.log('⚠️ Não conseguiu remover .turbo:', e.message);
}

// Remover cache do node_modules
try {
  const cacheDir = path.join(process.cwd(), 'node_modules', '.cache');
  if (fs.existsSync(cacheDir)) {
    fs.rmSync(cacheDir, { recursive: true, force: true });
    console.log('✅ Removido node_modules/.cache');
  }
} catch (e) {
  console.log('⚠️ Não conseguiu remover cache:', e.message);
}

console.log('✅ Limpeza concluída!');
