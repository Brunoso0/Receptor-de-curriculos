# 📘 Documentação de Endpoints - JR Coffee Backend

## 🌐 Base URL

```
http://localhost:5001/api
```

**Nota:** Todas as rotas têm prefixo `/api/` - por exemplo: `http://localhost:5001/api/auth/login`

**Arquivos enviados:**
- Imagens de produtos salvas em `uploads/produtos` ficam acessíveis por `http://localhost:5001/uploads/produtos/<arquivo>`
- Imagens de categorias (vertical e horizontal) salvas em `uploads/categorias` ficam acessíveis por `http://localhost:5001/uploads/categorias/<arquivo>`

---

## 🔐 Autenticação

### Login (RH + JR Coffee)

Autentica o usuário no banco de RH e sincroniza dados localmente no JR Coffee.

**Endpoint:** `POST /api/auth/login` ou `POST /api/login`

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Body:**
```json
{
  "email": "usuario@example.com",
  "senha": "senha123"
}
```

**Respostas:**

✅ **200 - Sucesso**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "email": "usuario@example.com",
    "id": 1,
    "localId": 42,
    "nome": "João Silva",
    "tipo": "admin"
  }
}
```

❌ **400 - Campos obrigatórios faltando**
```json
{
  "error": "Campos email e senha sao obrigatorios."
}
```

❌ **401 - Credenciais inválidas**
```json
{
  "error": "Credenciais invalidas no RH."
}
```

❌ **503 - RH indisponível**
```json
{
  "error": "Banco RH indisponivel no momento."
}
```

**Exemplo em JavaScript:**
```javascript
const response = await fetch('http://localhost:5001/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'usuario@example.com',
    senha: 'senha123'
  })
});

const data = await response.json();
if (response.ok) {
  localStorage.setItem('token', data.token);
  console.log('Login bem-sucedido:', data.user);
} else {
  console.error('Erro no login:', data.error);
}
```

---

## 🍰 Produtos

### Listar Produtos (Público - com Filtro de Disponibilidade)

Lista todos os produtos que estão disponíveis conforme horários/datas de produção.

**Endpoint:** `GET /api/produtos`

**Respostas:**

✅ **200 - Lista de produtos**
```json
[
  {
    "id": 1,
    "nome": "Bolo de Chocolate",
    "descricao": "Delicioso bolo de chocolate caseiro",
    "preco": 35.50,
    "imagem": "uploads/produtos/bolo-chocolate.jpg",
    "video": null,
    "imagem3d": null,
    "status": "ativo",
    "grupo": {
      "id": 1,
      "nome": "Bolos",
      "descricao": "Todos os bolos disponíveis",
      "status": "ativo"
    },
    "horariosProducao": {
      "seg": ["10:00", "18:00"],
      "ter": ["10:00", "18:00"]
    },
    "desativarAposHorario": false,
    "dataDisponivel": "2026-03-10",
    "criadoEm": "2026-01-15T10:30:00Z",
    "atualizadoEm": "2026-03-01T14:20:00Z"
  }
]
```

**Exemplo em JavaScript:**
```javascript
const produtos = await fetch('http://localhost:5001/produtos')
  .then(r => r.json());

console.log('Produtos disponíveis:', produtos);
```

---

### Buscar Produto por ID

**Endpoint:** `GET /api/produtos/:id`

**Parâmetros:**
- `id` (número) - ID do produto

**Exemplo:** `GET /api/produtos/1`

**Respostas:**

✅ **200 - Produto encontrado**
```json
{
  "id": 1,
  "nome": "Bolo de Chocolate",
  "descricao": "Delicioso bolo de chocolate caseiro",
  "preco": 35.50,
  "imagem": "uploads/produtos/bolo-chocolate.jpg",
  "video": null,
  "imagem3d": null,
  "status": "ativo",
  "grupo": {
    "id": 1,
    "nome": "Bolos",
    "descricao": "Todos os bolos disponíveis",
    "status": "ativo"
  },
  "horariosProducao": null,
  "desativarAposHorario": false,
  "dataDisponivel": null,
  "criadoEm": "2026-01-15T10:30:00Z",
  "atualizadoEm": "2026-03-01T14:20:00Z"
}
```

❌ **404 - Produto não encontrado**
```json
{
  "error": "Produto nao encontrado."
}
```

**Exemplo em JavaScript:**
```javascript
const produto = await fetch('http://localhost:5001/api/produtos/1')
  .then(r => {
    if (!r.ok) throw new Error('Produto não encontrado');
    return r.json();
  });

console.log('Detalhes do produto:', produto);
```

---

### Criar Produto (Admin)

**Endpoint:** `POST /api/produtos`

**Formatos aceitos:**

- `multipart/form-data` para enviar arquivo real no campo `imagem`
- `application/json` se voce quiser informar manualmente um caminho ja existente em `imagem`

**Exemplo com upload de arquivo (`multipart/form-data`):**

- `imagem`: arquivo da imagem
- `categoriaId`: `1`
- `nome`: `Sonho de Chocolate`
- `descricao`: `Sonho recheado com chocolate derretido`
- `preco`: `12.50`
- `status`: `ativo`
- `horariosProducao`: JSON em texto
- `desativarAposHorario`: `true`
- `dataDisponivel`: `2026-03-10`
- `nomeUsuario`: `Admin User`
- `usuarioRhId`: `1`

**Exemplo com JSON:**
```json
{
  "categoriaId": 1,
  "nome": "Sonho de Chocolate",
  "descricao": "Sonho recheado com chocolate derretido",
  "preco": 12.50,
  "imagem": "uploads/produtos/sonho.jpg",
  "video": null,
  "imagem3d": null,
  "status": "ativo",
  "horariosProducao": {
    "seg": ["14:00", "18:00"],
    "ter": ["14:00", "18:00"],
    "qua": ["14:00", "18:00"],
    "qui": ["14:00", "18:00"],
    "sex": ["14:00", "18:00"],
    "sab": ["14:00", "20:00"]
  },
  "desativarAposHorario": true,
  "dataDisponivel": "2026-03-10",
  "nomeUsuario": "Admin User",
  "usuarioRhId": 1
}
```

**Respostas:**

✅ **201 - Produto criado**
```json
{
  "id": 5,
  "nome": "Sonho de Chocolate",
  "descricao": "Sonho recheado com chocolate derretido",
  "preco": 12.50,
  "status": "ativo",
  "grupoId": 1,
  "criadoEm": "2026-03-10T16:00:00Z",
  "atualizadoEm": "2026-03-10T16:00:00Z"
}
```

❌ **400 - Erro de validação**
```json
{
  "error": "Categoria nao existe."
}
```

**Exemplo em JavaScript:**
```javascript
const formData = new FormData();
formData.append('imagem', arquivoInput.files[0]);
formData.append('categoriaId', '1');
formData.append('nome', 'Novo Produto');
formData.append('preco', '25.00');
formData.append('status', 'ativo');
formData.append('nomeUsuario', 'Admin');
formData.append('usuarioRhId', '1');

const novoProduto = await fetch('http://localhost:5001/api/produtos', {
  method: 'POST',
  body: formData
});

const produto = await novoProduto.json();
console.log('Produto criado:', produto);
```

---

### Atualizar Produto (Admin)

**Endpoint:** `PUT /api/produtos/:id`

**Parâmetros:**
- `id` (número) - ID do produto

**Formatos aceitos:**

- `multipart/form-data` para trocar a imagem enviando um novo arquivo no campo `imagem`
- `application/json` para atualizar apenas campos textuais

**Body:** (todos os campos são opcionais)
```json
{
  "nome": "Novo Nome",
  "descricao": "Nova descrição",
  "preco": 45.00,
  "status": "inativo",
  "nomeUsuario": "Admin User",
  "usuarioRhId": 1
}
```

**Respostas:**

✅ **200 - Produto atualizado**
```json
{
  "id": 1,
  "nome": "Novo Nome",
  "descricao": "Nova descrição",
  "preco": 45.00,
  "status": "inativo",
  "atualizadoEm": "2026-03-10T16:30:00Z"
}
```

❌ **404 - Produto não encontrado**
```json
{
  "error": "Produto nao encontrado."
}
```

---

### Deletar Produto (Admin)

**Endpoint:** `DELETE /api/produtos/:id`

**Parâmetros:**
- `id` (número) - ID do produto

**Respostas:**

✅ **204 - Produto deletado com sucesso** (sem corpo)

❌ **404 - Produto não encontrado**
```json
{
  "error": "Produto nao encontrado."
}
```

**Exemplo em JavaScript:**
```javascript
const response = await fetch('http://localhost:5001/produtos/1', {
  method: 'DELETE'
});

if (response.ok) {
  console.log('Produto deletado com sucesso');
} else {
  console.error('Erro ao deletar produto');
}
```

---

### Listar Todos os Produtos (Admin)

Retorna todos os produtos sem filtro de disponibilidade/horários.

**Endpoint:** `GET /api/admin/produtos`

**Respostas:**

✅ **200 - Lista completa de produtos**
```json
[
  {
    "id": 1,
    "nome": "Bolo de Chocolate",
    "status": "ativo",
    "preco": 35.50
  },
  {
    "id": 2,
    "nome": "Panetone",
    "status": "inativo",
    "preco": 50.00
  }
]
```

---

## 📂 Categorias / Grupos

### Listar Categorias (Público)

**Endpoint:** `GET /api/categorias` ou `GET /api/grupos`

**Respostas:**

✅ **200 - Lista de categorias**
```json
[
  {
    "id": 1,
    "nome": "Bolos",
    "descricao": "Todos os bolos disponíveis",
    "status": "ativo",
    "icon": "Cake",
    "imagemVertical": "uploads/categorias/bolos-vertical-1234567890-random.jpg",
    "imagemHorizontal": "uploads/categorias/bolos-horizontal-1234567890-random.jpg",
    "totalProdutos": 5,
    "criadoEm": "2026-01-01T10:00:00Z",
    "atualizadoEm": "2026-02-15T14:30:00Z"
  },
  {
    "id": 2,
    "nome": "Sonhos",
    "descricao": "Sonhos doces recheados",
    "status": "ativo",
    "icon": "Star",
    "imagemVertical": "uploads/categorias/sonhos-vertical-1234567890-random.jpg",
    "imagemHorizontal": "uploads/categorias/sonhos-horizontal-1234567890-random.jpg",
    "totalProdutos": 3,
    "criadoEm": "2026-01-02T10:00:00Z",
    "atualizadoEm": "2026-02-15T14:30:00Z"
  }
]
```

**Exemplo em JavaScript:**
```javascript
const categorias = await fetch('http://localhost:5001/api/categorias')
  .then(r => r.json());

console.log('Categorias disponíveis:', categorias);
```

---

### Buscar Categoria por ID

**Endpoint:** `GET /api/categorias/:id` ou `GET /api/grupos/:id`

**Exemplo:** `GET /api/categorias/1`

**Respostas:**

✅ **200 - Categoria encontrada**
```json
{
  "id": 1,
  "nome": "Bolos",
  "descricao": "Todos os bolos disponíveis",
  "status": "ativo",
  "icon": "Cake",
  "imagemVertical": "uploads/categorias/bolos-vertical-1234567890-random.jpg",
  "imagemHorizontal": "uploads/categorias/bolos-horizontal-1234567890-random.jpg",
  "totalProdutos": 5,
  "criadoEm": "2026-01-01T10:00:00Z",
  "atualizadoEm": "2026-02-15T14:30:00Z"
}
```

---

### Criar Categoria (Admin)

**Endpoint:** `POST /api/categorias` ou `POST /api/grupos`

**Formatos aceitos:**

- `multipart/form-data` para enviar arquivos de imagens nos campos `imagem_vertical` e `imagem_horizontal`
- `application/json` se você quiser informar manualmente caminhos já existentes

**Exemplo com upload de arquivos (`multipart/form-data`):**

- `imagem_vertical`: arquivo da imagem (opcional)
- `imagem_horizontal`: arquivo da imagem (opcional)
- `nome`: `Doces Especiais`
- `descricao`: `Doces da casa exclusivos`
- `status`: `ativo`
- `icon`: `Cookie` (opcional — nome do ícone Lucide React)
- `nomeUsuario`: `Admin User`
- `usuarioRhId`: `1`

**Exemplo com JSON:**
```json
{
  "nome": "Doces Especiais",
  "descricao": "Doces da casa exclusivos",
  "status": "ativo",
  "icon": "Cookie",
  "nomeUsuario": "Admin User",
  "usuarioRhId": 1
}
```

**Respostas:**

✅ **201 - Categoria criada**
```json
{
  "id": 10,
  "nome": "Doces Especiais",
  "descricao": "Doces da casa exclusivos",
  "status": "ativo",
  "icon": "Cookie",
  "imagemVertical": "uploads/categorias/doces-especiais-1234567890-randomsuffix.jpg",
  "imagemHorizontal": "uploads/categorias/doces-especiais-1234567890-randomsuffix.jpg",
  "criadoEm": "2026-03-10T16:00:00Z",
  "atualizadoEm": "2026-03-10T16:00:00Z"
}
```

**Exemplo em JavaScript:**
```javascript
const formData = new FormData();
formData.append('imagem_vertical', verticaImageFile);
formData.append('imagem_horizontal', horizontalImageFile);
formData.append('nome', 'Doces Especiais');
formData.append('descricao', 'Doces da casa exclusivos');
formData.append('status', 'ativo');
formData.append('nomeUsuario', 'Admin');
formData.append('usuarioRhId', '1');

const novaCategoria = await fetch('http://localhost:5001/api/categorias', {
  method: 'POST',
  body: formData
});

const categoria = await novaCategoria.json();
console.log('Categoria criada:', categoria);
```

---

### Atualizar Categoria (Admin)

**Endpoint:** `PUT /api/categorias/:id` ou `PUT /api/grupos/:id`

**Formatos aceitos:**

- `multipart/form-data` para trocar uma ou ambas as imagens enviando novos arquivos nos campos `imagem_vertical` e/ou `imagem_horizontal`
- `application/json` para atualizar apenas campos textuais

**Body:** (todos os campos são opcionais)
```json
{
  "nome": "Novo Nome",
  "descricao": "Nova descrição",
  "status": "inativo",
  "icon": "Star",
  "nomeUsuario": "Admin User",
  "usuarioRhId": 1
}
```

---

### Deletar Categoria (Admin)

**Endpoint:** `DELETE /api/categorias/:id` ou `DELETE /api/grupos/:id`

**Respostas:**

✅ **204 - Categoria deletada com sucesso**

❌ **400 - Categoria possui produtos**
```json
{
  "error": "Categoria nao pode ser deletada. Existem produtos vinculados."
}
```

---

## 🏢 Empresa

### Obter Configurações da Empresa

Retorna dados da empresa: endereço, horários de funcionamento, redes sociais.

**Endpoint:** `GET /api/empresa`

**Respostas:**

✅ **200 - Configurações da empresa**
```json
{
  "id": 1,
  "nome": "JR Coffee",
  "redesSociais": {
    "instagram": "https://instagram.com/jrcoffee",
    "facebook": "https://facebook.com/jrcoffee",
    "whatsapp": "https://wa.me/558599999999"
  },
  "endereco": {
    "id": 1,
    "cep": "75535-000",
    "logradouro": "Avenida Brasil",
    "numero": "1000",
    "complemento": "Loja 01",
    "bairro": "Centro",
    "cidade": "Goianésia",
    "estado": "GO",
    "referencia": "Perto da praça",
    "latitude": -15.3200,
    "longitude": -49.2500,
    "criadoEm": "2026-01-01T10:00:00Z",
    "atualizadoEm": "2026-02-15T14:30:00Z"
  },
  "horarios": {
    "id": 1,
    "timezone": "America/Bahia",
    "horarios": {
      "seg": {
        "aberto": true,
        "abertura": "10:00",
        "fechamento": "18:00"
      },
      "ter": {
        "aberto": true,
        "abertura": "10:00",
        "fechamento": "18:00"
      },
      "qua": {
        "aberto": true,
        "abertura": "10:00",
        "fechamento": "18:00"
      },
      "qui": {
        "aberto": true,
        "abertura": "10:00",
        "fechamento": "18:00"
      },
      "sex": {
        "aberto": true,
        "abertura": "10:00",
        "fechamento": "20:00"
      },
      "sab": {
        "aberto": true,
        "abertura": "10:00",
        "fechamento": "20:00"
      },
      "dom": {
        "aberto": false
      }
    },
    "feriados": {
      "carnaval": "2026-02-24",
      "pascoa": "2026-04-05"
    },
    "criadoEm": "2026-01-01T10:00:00Z",
    "atualizadoEm": "2026-02-15T14:30:00Z"
  },
  "criadoEm": "2026-01-01T10:00:00Z",
  "atualizadoEm": "2026-02-15T14:30:00Z"
}
```

**Exemplo em JavaScript:**
```javascript
const empresa = await fetch('http://localhost:5001/api/empresa')
  .then(r => r.json());

console.log('Nome da empresa:', empresa.nome);
console.log('Instagram:', empresa.redesSociais.instagram);
console.log('Horário de hoje:', empresa.horarios.horarios);
```

---

### Atualizar Configurações da Empresa (Admin)

**Endpoint:** `PUT /api/empresa`

**Body:** (todos os campos são opcionais)
```json
{
  "nome": "JR Coffee Casa",
  "redesSociais": {
    "instagram": "https://instagram.com/jrcoffeecasa",
    "facebook": null,
    "whatsapp": "https://wa.me/55859988887777"
  },
  "endereco": {
    "cep": "75535-000",
    "logradouro": "Avenida Principal",
    "numero": "500",
    "complemento": "Loja 02",
    "bairro": "Centro",
    "cidade": "Goianésia",
    "estado": "GO",
    "referencia": "Próximo ao mercado",
    "latitude": -15.3205,
    "longitude": -49.2505
  },
  "horarios": {
    "timezone": "America/Bahia",
    "horarios": {
      "seg": { "aberto": true, "abertura": "09:00", "fechamento": "19:00" },
      "ter": { "aberto": true, "abertura": "09:00", "fechamento": "19:00" },
      "qua": { "aberto": true, "abertura": "09:00", "fechamento": "19:00" },
      "qui": { "aberto": true, "abertura": "09:00", "fechamento": "19:00" },
      "sex": { "aberto": true, "abertura": "09:00", "fechamento": "21:00" },
      "sab": { "aberto": true, "abertura": "10:00", "fechamento": "20:00" },
      "dom": { "aberto": false }
    },
    "feriados": {
      "carnaval": "2026-02-24",
      "pascoa": "2026-04-05",
      "corpusChristi": "2026-05-14"
    }
  },
  "nomeUsuario": "Admin User",
  "usuarioRhId": 1
}
```

**Respostas:**

✅ **200 - Empresa atualizada**
```json
{
  "id": 1,
  "nome": "JR Coffee Casa",
  "redesSociais": {
    "instagram": "https://instagram.com/jrcoffeecasa",
    "facebook": null,
    "whatsapp": "https://wa.me/55859988887777"
  },
  "atualizadoEm": "2026-03-10T16:30:00Z"
}
```

**Exemplo em JavaScript:**
```javascript
const atualizado = await fetch('http://localhost:5001/api/empresa', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    redesSociais: {
      instagram: 'https://instagram.com/jrcoffee_nova'
    },
    nomeUsuario: 'Admin',
    usuarioRhId: 1
  })
});

const resultado = await atualizado.json();
console.log('Empresa atualizada:', resultado);
```

---

## 📋 Resumo de Status HTTP

| Status | Significado | Exemplo de Uso |
|--------|-------------|----------------|
| **200** | OK | GET, PUT com sucesso |
| **201** | Criado | POST com sucesso |
| **204** | Sem Conteúdo | DELETE com sucesso |
| **400** | Erro de Validação | Dados inválidos ou faltando |
| **401** | Não Autorizado | Credenciais inválidas |
| **404** | Não Encontrado | Recurso não existe |
| **500** | Erro do Servidor | Erro interno (verificar console) |
| **503** | Serviço Indisponível | Banco de dados fora do ar |

---

## 🔑 Tratamento de Token JWT

Após fazer login, o token deve ser armazenado e enviado em requisições protegidas (futuro - ainda a ser implementado).

**Armazenar Token:**
```javascript
const response = await fetch('http://localhost:5001/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, senha })
});

const { token } = await response.json();
localStorage.setItem('jrcoffee_token', token);
sessionStorage.setItem('jrcoffee_user', JSON.stringify(user));
```

**Usar Token em Requisições:**
```javascript
const token = localStorage.getItem('jrcoffee_token');

const response = await fetch('http://localhost:5001/api/admin/produtos', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
});
```

---

## 💡 Dicas e Boas Práticas

1. **Sempre valide dados no frontend** antes de enviar ao backend
2. **Armazene o token** em localStorage ou sessionStorage após login
3. **Trate erros adequadamente** e mostre mensagens claras ao usuário
4. **Use try/catch** para operações assíncronas
5. **Verifique o status da resposta** antes de processar dados
6. **Não exponha dados sensíveis** no localStorage (considere usar httpOnly cookies)

---

## 📧 Suporta

Para dúvidas ou relatório de bugs, contate o time de desenvolvimento.

**Última atualização:** 10 de março de 2026
