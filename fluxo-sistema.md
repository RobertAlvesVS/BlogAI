# Fluxo do Sistema - Blog com IA

## 📅 Fluxo de Publicação Automática (8h da manhã)

```
8h da manhã
  ↓
APScheduler acorda o FastAPI
  ↓
FastAPI pega o tema do dia
  ↓
Monta o prompt e manda para o OpenRouter
  ↓
OpenRouter chama o modelo de IA
  ↓
IA devolve o JSON com título, conteúdo, tags
  ↓
FastAPI salva o post no Supabase com status "published"
  ↓
Post já aparece no blog automaticamente
```

---

## 👤 Fluxo de Visualização (Usuário no Site)

```
Pessoa abre o site
  ↓
React chama o Supabase direto
  ↓
Supabase devolve os posts publicados
  ↓
React exibe a lista
  ↓
Pessoa clica num post
  ↓
React busca o conteúdo pelo slug
  ↓
react-markdown renderiza o texto bonito
```

---

## 🔧 Fluxo de Administração

```
Você acessa /admin
  ↓
React checa o token do Supabase
  ↓
Token válido → entra no painel
  ↓
Vê todos os posts
  ↓
Pode editar, deletar ou gerar um post manualmente
  ↓
Geração manual → React chama o FastAPI
  ↓
FastAPI chama a IA → salva no Supabase → aparece no blog
```

---

## 🏗️ Arquitetura Resumida

### Frontend (React)
- Exibe posts do blog
- Painel administrativo
- Autenticação via Supabase
- Renderização com react-markdown

### Backend (FastAPI)
- Agendamento com APScheduler
- Integração com OpenRouter/IA
- Gerenciamento de posts

### Banco de Dados (Supabase)
- Armazenamento de posts
- Autenticação de usuários
- API REST automática

### IA (OpenRouter)
- Geração automática de conteúdo
- Retorna JSON estruturado (título, conteúdo, tags)
