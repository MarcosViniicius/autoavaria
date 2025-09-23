# 🚀 Analisador de Avarias - Interface Web

Uma aplicação web moderna e intuitiva para análise automatizada de imagens de produtos usando IA (Google Gemini), com interface Flask responsiva e funcional.

## 📋 Funcionalidades

### 🎯 Principais Recursos

- **Dashboard Interativo**: Visão geral completa do sistema com estatísticas em tempo real
- **Upload Inteligente**: Interface drag-and-drop para envio de imagens e arquivos de texto
- **Processamento em Background**: Análise não-bloqueante com monitoramento de progresso
- **Relatórios Detalhados**: Visualização e exportação de resultados em Excel
- **Configurações Avançadas**: Gerenciamento de dados e configurações do sistema

### 🔧 Tecnologias Utilizadas

- **Backend**: Python 3.x + Flask
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **UI Framework**: Bootstrap 5 + Bootstrap Icons
- **IA**: Google Gemini 2.0 Flash
- **Dados**: Pandas + OpenPyXL
- **Processamento**: PIL (Pillow)

## 🚀 Instalação e Configuração

### 1. Pré-requisitos

- Python 3.8 ou superior
- Chave da API Google Gemini
- Git (opcional)

### 2. Instalação das Dependências

```bash
# Instalar dependências
pip install -r requirements.txt
```

### 3. Configuração da API

Edite o arquivo `extrair-dados.py` e substitua a chave da API:

```python
# Linha 31
GEMINI_API_KEY = "SUA_CHAVE_API_AQUI"
```

### 4. Executar a Aplicação

```bash
# Iniciar o servidor Flask
python app.py
```

A aplicação estará disponível em: **http://localhost:5000**

## 📁 Estrutura do Projeto

```
auto-avaria/
├── app.py                     # Aplicação Flask principal
├── extrair-dados.py          # Script de análise original
├── requirements.txt          # Dependências Python
├── README.md                # Documentação
├── templates/               # Templates HTML
│   ├── base.html           # Template base
│   ├── index.html          # Dashboard
│   ├── upload.html         # Página de upload
│   ├── relatorio.html      # Visualização de relatórios
│   └── configuracoes.html  # Configurações
├── static/                 # Arquivos estáticos
│   ├── css/
│   │   └── style.css      # Estilos personalizados
│   └── js/
│       └── main.js        # JavaScript principal
├── imagens_para_analisar/ # Pasta de entrada
└── resultados/           # Relatórios e logs
    ├── log_mestre.txt
    ├── log_consumo_tokens.txt
    └── Relatorio_Mestre_Produtos.xlsx
```

## 🎮 Como Usar

### 1. Dashboard (Página Inicial)

- Visualize estatísticas em tempo real
- Monitore o progresso do processamento
- Acesse ações rápidas
- Veja resultados recentes

### 2. Upload de Arquivos

- **Drag & Drop**: Arraste arquivos diretamente para a zona de upload
- **Seleção Manual**: Clique em "Selecionar Arquivos"
- **Formatos Suportados**: JPG, PNG, TXT
- **Tamanho Máximo**: 50MB por arquivo

### 3. Processamento

- Clique em "Iniciar Processamento" no dashboard
- Acompanhe o progresso em tempo real
- Receba notificações de conclusão
- Acesse relatórios automaticamente

### 4. Visualização de Relatórios

- **Filtros e Busca**: Encontre dados específicos
- **Ordenação**: Clique nos cabeçalhos das colunas
- **Exportação**: Download em CSV ou Excel
- **Visualização de Imagens**: Clique em "Ver" para abrir imagens

### 5. Configurações

- **Gerenciar Dados**: Limpar logs, relatórios ou imagens
- **Estatísticas**: Monitorar uso do sistema
- **Informações**: Detalhes técnicos e configurações

## 🔄 Fluxo de Trabalho

1. **Preparação**: Organize suas imagens e arquivo TXT de mensagens
2. **Upload**: Envie os arquivos através da interface web
3. **Processamento**: Inicie a análise automática com IA
4. **Resultados**: Visualize e exporte os relatórios gerados
5. **Gestão**: Use as configurações para manter o sistema organizado

## 📊 Tipos de Análise

### Avarias

- Produtos danificados ou perdidos
- Extração de peso e detalhes do produto
- Baseado em contexto de mensagens e imagens

### Uso Interno

- Produtos consumidos pela equipe/loja
- Extração de marca e código de barras
- Classificação automática baseada em contexto

### Tratamento de Erros

- Arquivos não processáveis
- Falhas de IA ou conectividade
- Log detalhado para debugging

## ⚙️ Configurações Avançadas

### Parâmetros do Sistema (extrair-dados.py)

```python
TAMANHO_LOTE = 10          # Imagens por lote
MAX_WORKERS = 4            # Threads simultâneas
MAX_RETRIES = 3            # Tentativas de retry
RETRY_DELAY_SECONDS = 5    # Delay entre tentativas
DEBUG_MODE = False         # Modo debug
```

### Configurações do Flask (app.py)

```python
MAX_CONTENT_LENGTH = 50 * 1024 * 1024  # 50MB max upload
SECRET_KEY = 'sua_chave_secreta'        # Chave de sessão
DEBUG = True                            # Modo desenvolvimento
```

## 🔒 Segurança

- **API Keys**: Mantenha as chaves em variáveis de ambiente
- **Uploads**: Validação de tipos de arquivo e tamanho
- **Sessions**: Configuração segura de sessões Flask
- **CSRF**: Proteção contra ataques CSRF (implementar em produção)

## 🐛 Solução de Problemas

### Problemas Comuns

**Erro de Import**

```bash
# Verificar se todas as dependências estão instaladas
pip install -r requirements.txt --upgrade
```

**Erro de API**

```python
# Verificar chave da API no extrair-dados.py
GEMINI_API_KEY = "sua_chave_válida_aqui"
```

**Problemas de Upload**

- Verificar tamanho dos arquivos (máx 50MB)
- Confirmar formato (JPG, PNG, TXT apenas)
- Verificar permissões da pasta

**Erro de Processamento**

- Verificar logs em `resultados/log_mestre.txt`
- Confirmar conectividade com internet
- Verificar quota da API Gemini

## 📝 Logs e Monitoramento

### Arquivos de Log

- `log_mestre.txt`: Arquivos processados
- `log_consumo_tokens.txt`: Consumo da API
- Console do Flask: Erros em tempo real

### Monitoramento

- Dashboard com estatísticas atualizadas
- Progresso em tempo real durante processamento
- Alertas visuais para erros e sucessos

## 🎨 Personalização

### Estilos CSS

Edite `static/css/style.css` para personalizar:

- Cores e temas
- Animações
- Layout responsivo
- Componentes visuais

### JavaScript

Modifique `static/js/main.js` para:

- Funcionalidades extras
- Integrações personalizadas
- Melhorias de UX
- Validações customizadas

## 📱 Responsividade

A interface é totalmente responsiva e funciona em:

- **Desktop**: Experiência completa
- **Tablet**: Layout adaptado
- **Mobile**: Interface otimizada para toque

## 🔄 Atualizações

Para atualizar o sistema:

1. Faça backup dos dados importantes
2. Atualize o código
3. Instale novas dependências se necessário
4. Reinicie a aplicação

## 📞 Suporte

Para problemas ou dúvidas:

1. Verifique os logs do sistema
2. Consulte a documentação
3. Verifique configurações da API
4. Teste com dados de exemplo

## 📄 Licença

Este projeto é de uso interno. Mantenha as chaves de API seguras e não exponha credenciais em repositórios públicos.

---

🚀 **Desenvolvido com Python, Flask e ❤️**
