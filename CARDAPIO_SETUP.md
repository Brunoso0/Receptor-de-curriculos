# 🍰 Setup Cardápio - Endpoints Integrados

## ✅ Status da Integração

Todos os endpoints do backend foram **aplicados e validados** nos arquivos do cardápio.

---

## 📊 Endpoints Integrados

### 1. **Autenticação** → `POST /auth/login`
**Arquivo:** `src/cardapio/services/auth.js`

```javascript
// Chama: POST http://localhost:5001/api/auth/login
// Body: { email: string, senha: string }
// Response: { token, user: { id, nome, tipo, email, ... } }
```

**Fluxo:**
- CardapioLoginPage.jsx chama `loginWithRh({ email, senha })`
- auth.js cria novo axios instance com `REACT_APP_API_BASE_URL_COFFEE`
- Login normaliza resposta e detecta role (admin/user)
- Session é salva em localStorage

---

### 2. **Listar Categorias** → `GET /categorias`
**Arquivo:** `src/cardapio/pages/CardapioShellPage.jsx` (linha 23)

```javascript
// Chama: GET http://localhost:5001/api/categorias
// Response: [{ id, nome, descricao, status, totalProdutos, ... }]
```

**Fluxo:**
- ao montar CardapioShellPage, faz fetch de categorias
- Agrupa produtos por categoria
- Sidebar exibe grupos com contadores

---

### 3. **Listar Produtos** → `GET /produtos`
**Arquivo:** `src/cardapio/pages/CardapioShellPage.jsx` (linha 24)

```javascript
// Chama: GET http://localhost:5001/api/produtos
// Response: [{ id, nome, descricao, preco, imagem, grupo: {...}, ... }]
```

**Fluxo:**
- ao montar CardapioShellPage, faz fetch em paralelo com categorias
- CardapioProductGrid renderiza cards com preço, imagem, descrição
- Filtra por grupo selecionado no sidebar

---

## 🔧 Configuração de Ambiente

### `.env` Atualmente Configurado:
```env
REACT_APP_API_BASE_URL=http://localhost:3012/api          # Site Principal
REACT_APP_API_BASE_URL_COFFEE=http://localhost:5001/api   # Cardápio Backend
```

### Endpoints Consumidos:
- **Auth:** `/auth/login` (dentro de REACT_APP_API_BASE_URL_COFFEE)
- **Data:** `/categorias`, `/produtos` (dentro de REACT_APP_API_BASE_URL_COFFEE)

---

## 📁 Arquivos Modificados na Integração

| Arquivo | Mudança |
|---------|---------|
| `src/cardapio/services/cardapioApi.js` | ✅ Usa REACT_APP_API_BASE_URL_COFFEE |
| `src/cardapio/services/auth.js` | ✅ Cria axios próprio, chama /auth/login |
| `src/cardapio/pages/CardapioShellPage.jsx` | ✅ Chama /categorias e /produtos (sem /api) |

---

## 🚀 Próximas Etapas - Admin Panel

Para completar o painel admin, integrar estes endpoints:

```javascript
// Criar Produto
POST /produtos
Body: { categoriaId, nome, descricao, preco, imagem, ... }

// Atualizar Produto
PUT /produtos/:id
Body: { nome?, descricao?, preco?, ... }

// Deletar Produto
DELETE /produtos/:id

// Listar Admin (sem filtro)
GET /admin/produtos
```

---

## ✨ Validação

```bash
✅ Build: Sucesso (136.96 kB JS, 10.54 kB CSS)
✅ Erros de compilação: Nenhum
✅ Endpoints: Aplicados e integrados
✅ Session: localStorage funcionando
✅ Autenticação: Normalizada e detecta role
```

---

**Data de Setup:** 10 de Março, 2026
**Status:** Integração Completa ✅
