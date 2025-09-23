#!/bin/bash

# Script para preparar o projeto para deploy na Vercel

echo "🚀 Preparando projeto para deploy na Vercel..."

# Verificar se estamos no diretório correto
if [ ! -f "app.py" ]; then
    echo "❌ Execute este script na raiz do projeto (onde está o app.py)"
    exit 1
fi

# Verificar se o Git está inicializado
if [ ! -d ".git" ]; then
    echo "📁 Inicializando repositório Git..."
    git init
    git branch -M main
fi

# Adicionar todos os arquivos
echo "📦 Adicionando arquivos ao Git..."
git add .

# Fazer commit
echo "💾 Fazendo commit das mudanças..."
git commit -m "Projeto adaptado para Vercel - deploy ready" || echo "⚠️ Nenhuma mudança para commit"

echo ""
echo "✅ Projeto preparado para Vercel!"
echo ""
echo "📋 Próximos passos:"
echo "1. Faça push para GitHub:"
echo "   git remote add origin https://github.com/seu-usuario/seu-repositorio.git"
echo "   git push -u origin main"
echo ""
echo "2. Acesse https://vercel.com e importe seu repositório"
echo ""
echo "3. Configure as variáveis de ambiente na Vercel:"
echo "   GEMINI_API_KEY=sua_chave_api_aqui"
echo "   SECRET_KEY=uma_chave_super_secura"
echo "   FLASK_ENV=production"
echo ""
echo "4. Faça o deploy!"
echo ""
echo "📖 Leia o README_VERCEL.md para mais detalhes"