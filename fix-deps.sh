#!/bin/bash
# Script para reparar as dependências do projeto SEA FISIO
# Execute este script no Terminal do macOS (não pelo VS Code)

echo "🔧 Reparando dependências do SEA FISIO..."
echo ""

cd "$(dirname "$0")"

echo "1. Removendo node_modules corrompido..."
rm -rf node_modules
rm -f package-lock.json

echo "2. Limpando cache do npm..."
npm cache clean --force

echo "3. Instalando dependências..."
npm install

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Dependências instaladas com sucesso!"
  echo ""
  echo "4. Iniciando servidor de desenvolvimento..."
  npm run dev
else
  echo ""
  echo "❌ Erro na instalação. Tente:"
  echo "   sudo chown -R \$(whoami) ."
  echo "   npm install"
fi
