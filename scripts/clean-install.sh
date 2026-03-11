#!/bin/bash

# Remover cache Next.js
rm -rf .next
rm -rf .turbo
rm -rf node_modules/.cache

# Reinstalar dependências a partir do lockfile do npm
npm ci

echo "✅ Cache limpo e dependências reinstaladas"
