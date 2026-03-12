#!/bin/bash
# Script para reparar as dependências do projeto SEA FISIO
# Execute este script no Terminal do macOS (não pelo VS Code)

echo "🔧 Reparando dependências do SEA FISIO..."
echo ""

cd "$(dirname "$0")"

echo "1. Removendo node_modules corrompido..."
rm -rf node_modules

echo "2. Validando cache do npm..."
if ! npm cache verify >/dev/null 2>&1; then
  npm cache clean --force
fi

echo "3. Instalando dependências..."
if [ -f package-lock.json ]; then
  npm ci
else
  npm install
fi

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Dependências instaladas com sucesso!"
  echo ""
  echo "4. Iniciando servidor de desenvolvimento..."
  PORT="${PORT:-3000}" npm run dev
else
  echo ""
  echo "❌ Erro na instalação. Tente:"
  echo "   sudo chown -R \$(whoami) ."
  echo "   npm install"
fi
