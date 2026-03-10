#!/bin/bash

# Remover cache Next.js
rm -rf .next
rm -rf .turbo
rm -rf node_modules/.cache

# Reinstalar dependências
pnpm install

echo "✅ Cache limpo e dependências reinstaladas"
