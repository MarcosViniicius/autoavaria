# Analisador de Avarias - Deploy na Vercel

Este projeto foi adaptado para funcionar na Vercel como uma aplicação serverless.

## ⚠️ Limitações no Ambiente Vercel

1. **Processamento de IA**: O processamento completo com Google Gemini funciona apenas em ambiente local devido às limitações de tempo de execução da Vercel (10s para Hobby, 60s para Pro).

2. **Armazenamento**: A Vercel usa filesystem temporário (`/tmp`), então arquivos carregados são perdidos entre deployments.

3. **Configurações**: Use variáveis de ambiente no painel da Vercel ao invés do arquivo `config.json`.

## 🚀 Deploy na Vercel

### Pré-requisitos
- Conta no [Vercel](https://vercel.com)
- Repositório no GitHub

### Passos para Deploy

1. **Faça push do código para GitHub**:
```bash
git add .
git commit -m "Preparado para deploy na Vercel"
git push origin main
```

2. **Conecte no Vercel**:
   - Acesse [vercel.com](https://vercel.com) e faça login
   - Clique em "New Project"
   - Importe seu repositório GitHub
   - A Vercel detectará automaticamente que é uma aplicação Python Flask

3. **Configure variáveis de ambiente**:
   No painel da Vercel, vá em Settings > Environment Variables e adicione:
   ```
   GEMINI_API_KEY=sua_chave_da_api_gemini_aqui
   SECRET_KEY=uma_chave_secreta_super_segura
   FLASK_ENV=production
   ```

4. **Deploy**:
   - Clique em "Deploy"
   - Aguarde a build terminar
   - Sua aplicação estará disponível em uma URL da Vercel

### Estrutura Adaptada para Vercel

```
auto-avaria/
├── api/
│   └── index.py          # Função serverless principal
├── static/               # Arquivos CSS/JS (servidos pela Vercel)
├── templates/            # Templates HTML do Flask
├── vercel.json          # Configuração da Vercel
├── requirements.txt     # Dependências Python
└── README.md           # Este arquivo
```

## 🔧 Configurações

### Variáveis de Ambiente Necessárias

| Variável | Descrição | Obrigatória |
|----------|-----------|-------------|
| `GEMINI_API_KEY` | Chave da API do Google Gemini | Sim |
| `SECRET_KEY` | Chave secreta do Flask | Sim |
| `FLASK_ENV` | Ambiente Flask (production) | Não |

### Funcionalidades Disponíveis na Vercel

✅ **Funcionam normalmente**:
- Interface web completa
- Upload de arquivos (temporário)
- Visualização de logs
- Configurações (usando variáveis de ambiente)
- Download de relatórios existentes

❌ **Limitadas na Vercel**:
- Processamento completo de imagens com IA (use ambiente local)
- Armazenamento persistente de arquivos
- Tarefas de longa duração

## 🏠 Desenvolvimento Local

Para usar todas as funcionalidades, execute localmente:

```bash
# Instalar dependências
pip install -r requirements.txt

# Executar aplicação
python app.py
```

Acesse: http://localhost:5000

## 📁 Estrutura de Arquivos

- **`api/index.py`**: Versão serverless adaptada para Vercel
- **`app.py`**: Versão original para uso local
- **`vercel.json`**: Configuração de deploy da Vercel
- **`requirements.txt`**: Dependências Python otimizadas

## 🔄 Workflow Recomendado

1. **Desenvolvimento e testes**: Use ambiente local (`python app.py`)
2. **Processamento de imagens**: Execute localmente para usar IA
3. **Demonstrações/acesso remoto**: Use a versão na Vercel
4. **Deploy**: Faça push para GitHub, deploy automático na Vercel

## 🆘 Solução de Problemas

### Build falha na Vercel
- Verifique se `requirements.txt` tem as versões corretas
- Confirme se `api/index.py` está presente
- Veja logs de build no painel da Vercel

### Timeout na Vercel
- O processamento de IA é limitado por tempo na Vercel
- Use ambiente local para processamento pesado

### Arquivos não persistem
- Vercel usa filesystem temporário
- Implemente storage externo (S3, etc.) se necessário

## 📞 Suporte

Este projeto foi adaptado automaticamente para Vercel. Para funcionalidades completas, use o ambiente local original.