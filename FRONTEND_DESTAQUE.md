# 📤 Guia: Como o Frontend Deve Enviar Produtos em Destaque

## 📌 Resumo Executivo

O backend aceita produtos com um sistema de **destaque** que permite exibir até **6 produtos em destaque** na página inicial. A imagem de destaque deve ser **OBRIGATORIAMENTE PNG** (sem fundo), enquanto a imagem principal pode ser qualquer formato de imagem.

---

## 🎯 Campos de Destaque

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `emDestaque` | Boolean/String | Não | Se `true` ou `'ativo'`, o produto aparece em destaque |
| `imagemDestaque` | File (PNG) | Sim (se em destaque) | Imagem PNG sem fundo (~800x600px recomendado) |
| `ordemDestaque` | Number (1-6) | Sim (se em destaque) | Posição do produto no destaque (1=primeiro, 6=último) |

---

## 🚀 Criar Produto com Destaque

### Endpoint
```
POST /api/produtos
Content-Type: multipart/form-data
```

### JavaScript Básico

```javascript
const criarProduto = async (dados) => {
  const formData = new FormData();

  // ✅ Campos obrigatórios do produto
  formData.append('nome', dados.nome);
  formData.append('descricao', dados.descricao);
  formData.append('preco', dados.preco);
  formData.append('categoriaId', dados.categoriaId);
  formData.append('status', 'ativo');

  // ✅ Imagem principal (obrigatória, qualquer formato)
  formData.append('imagem', dados.imagemPrincipal);

  // ➕ Campos de destaque (opcionais)
  if (dados.emDestaque) {
    formData.append('emDestaque', true);
    formData.append('imagemDestaque', dados.imagemDestaque); // ⚠️ SOMENTE PNG!
    formData.append('ordemDestaque', dados.ordem);
  }

  try {
    const response = await fetch('http://localhost:5001/api/produtos', {
      method: 'POST',
      body: formData
      // NÃO adicione Content-Type: o navegador faz automaticamente
    });

    const resultado = await response.json();

    if (!response.ok) {
      console.error('Erro ao criar produto:', resultado.error);
      return null;
    }

    console.log('Produto criado com sucesso:', resultado);
    return resultado;
  } catch (error) {
    console.error('Erro na requisição:', error);
    return null;
  }
};
```

### Exemplo de Uso

```javascript
await criarProduto({
  nome: 'Bolo de Chocolate Gourmet',
  descricao: 'Delicioso bolo com cobertura premium',
  preco: 45.90,
  categoriaId: 1,
  imagemPrincipal: inputPrincipal.files[0],
  emDestaque: true,
  imagemDestaque: inputDestaque.files[0], // ⚠️ PNG obrigatório
  ordem: 1
});
```

---

## ✏️ Editar/Atualizar Produto

### Endpoint
```
PUT /api/produtos/:id
Content-Type: multipart/form-data
```

### JavaScript

```javascript
const atualizarProduto = async (produtoId, dados) => {
  const formData = new FormData();

  // Apenas os campos que quer atualizar
  if (dados.emDestaque !== undefined) {
    formData.append('emDestaque', dados.emDestaque);
  }

  if (dados.imagemDestaque) {
    formData.append('imagemDestaque', dados.imagemDestaque);
  }

  if (dados.ordem !== undefined) {
    formData.append('ordemDestaque', dados.ordem);
  }

  try {
    const response = await fetch(`http://localhost:5001/api/produtos/${produtoId}`, {
      method: 'PUT',
      body: formData
    });

    const resultado = await response.json();

    if (!response.ok) {
      console.error('Erro ao atualizar:', resultado.error);
      return null;
    }

    return resultado;
  } catch (error) {
    console.error('Erro:', error);
    return null;
  }
};
```

### Exemplo: Remover de Destaque

```javascript
await atualizarProduto(123, {
  emDestaque: false,
  ordem: null
});
```

### Exemplo: Mudar Posição

```javascript
await atualizarProduto(123, {
  ordem: 3 // Muda para 3ª posição
});
```

---

## 🎨 Exemplo Completo com React

```jsx
import { useState } from 'react';

export default function FormProduto() {
  const [formData, setFormData] = useState({
    nome: '',
    preco: '',
    categoriaId: 1,
    descricao: ''
  });

  const [imagemPrincipal, setImagemPrincipal] = useState(null);
  const [imagemDestaque, setImagemDestaque] = useState(null);
  const [emDestaque, setEmDestaque] = useState(false);
  const [ordem, setOrdem] = useState(1);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro('');

    // Validação básica
    if (!imagemPrincipal) {
      setErro('Selecione uma imagem principal');
      setLoading(false);
      return;
    }

    if (emDestaque && !imagemDestaque) {
      setErro('Selecione uma imagem PNG para destaque');
      setLoading(false);
      return;
    }

    if (emDestaque && imagemDestaque.type !== 'image/png') {
      setErro('A imagem de destaque deve ser PNG');
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.append('nome', formData.nome);
    data.append('preco', formData.preco);
    data.append('categoriaId', formData.categoriaId);
    data.append('descricao', formData.descricao);
    data.append('status', 'ativo');
    data.append('imagem', imagemPrincipal);

    if (emDestaque) {
      data.append('emDestaque', true);
      data.append('imagemDestaque', imagemDestaque);
      data.append('ordemDestaque', ordem);
    }

    try {
      const response = await fetch('http://localhost:5001/api/produtos', {
        method: 'POST',
        body: data
      });

      const resultado = await response.json();

      if (!response.ok) {
        setErro(resultado.error || 'Erro ao criar produto');
      } else {
        alert('Produto criado com sucesso!');
        // Limpar formulário
        setFormData({ nome: '', preco: '', categoriaId: 1, descricao: '' });
        setImagemPrincipal(null);
        setImagemDestaque(null);
        setEmDestaque(false);
        setOrdem(1);
      }
    } catch (err) {
      setErro('Erro na requisição: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-produto">
      <h2>Novo Produto</h2>

      {erro && <div className="erro">{erro}</div>}

      <div className="form-group">
        <label>Nome *</label>
        <input
          type="text"
          value={formData.nome}
          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label>Preço *</label>
        <input
          type="number"
          step="0.01"
          value={formData.preco}
          onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label>Descrição</label>
        <textarea
          value={formData.descricao}
          onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label>Imagem Principal *</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImagemPrincipal(e.target.files[0])}
          required
        />
        <small>Aceita: JPG, PNG, WebP, GIF, SVG</small>
      </div>

      <hr />
      <h3>Destaque (Opcional)</h3>

      <div className="form-group checkbox">
        <input
          type="checkbox"
          id="emDestaque"
          checked={emDestaque}
          onChange={(e) => setEmDestaque(e.target.checked)}
        />
        <label htmlFor="emDestaque">Colocar em destaque na página inicial</label>
      </div>

      {emDestaque && (
        <>
          <div className="form-group">
            <label>Imagem de Destaque (PNG) *</label>
            <input
              type="file"
              accept=".png,image/png"
              onChange={(e) => setImagemDestaque(e.target.files[0])}
              required
            />
            <small>⚠️ Somente PNG é aceito. Recomendado: 800x600px, sem fundo</small>
          </div>

          <div className="form-group">
            <label>Posição no Destaque (1-6) *</label>
            <select
              value={ordem}
              onChange={(e) => setOrdem(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <option key={num} value={num}>
                  {num}º lugar
                </option>
              ))}
            </select>
            <small>Máximo de 6 produtos em destaque</small>
          </div>
        </>
      )}

      <button type="submit" disabled={loading}>
        {loading ? 'Enviando...' : 'Criar Produto'}
      </button>
    </form>
  );
}
```

---

## 🎨 Exemplo com Vue 3

```vue
<template>
  <form @submit.prevent="enviarProduto" class="form-produto">
    <h2>Novo Produto</h2>

    <div v-if="erro" class="erro">{{ erro }}</div>

    <div class="form-group">
      <label>Nome *</label>
      <input v-model="form.nome" type="text" required />
    </div>

    <div class="form-group">
      <label>Preço *</label>
      <input v-model.number="form.preco" type="number" step="0.01" required />
    </div>

    <div class="form-group">
      <label>Imagem Principal *</label>
      <input
        type="file"
        accept="image/*"
        @change="(e) => (imagemPrincipal = e.target.files[0])"
        required
      />
    </div>

    <hr />
    <h3>Destaque (Opcional)</h3>

    <div class="form-group checkbox">
      <input
        id="destaque"
        v-model="form.emDestaque"
        type="checkbox"
      />
      <label for="destaque">Colocar em destaque</label>
    </div>

    <div v-if="form.emDestaque" class="destaque-section">
      <div class="form-group">
        <label>Imagem de Destaque (PNG) *</label>
        <input
          type="file"
          accept=".png,image/png"
          @change="(e) => (imagemDestaque = e.target.files[0])"
          required
        />
        <small>⚠️ Somente PNG é aceito</small>
      </div>

      <div class="form-group">
        <label>Posição (1-6) *</label>
        <select v-model.number="form.ordem">
          <option v-for="n in 6" :key="n" :value="n">{{ n }}º lugar</option>
        </select>
      </div>
    </div>

    <button type="submit" :disabled="loading">
      {{ loading ? 'Enviando...' : 'Criar Produto' }}
    </button>
  </form>
</template>

<script setup>
import { ref } from 'vue';

const form = ref({
  nome: '',
  preco: '',
  emDestaque: false,
  ordem: 1
});

const imagemPrincipal = ref(null);
const imagemDestaque = ref(null);
const loading = ref(false);
const erro = ref('');

const enviarProduto = async () => {
  loading.value = true;
  erro.value = '';

  if (!imagemPrincipal.value) {
    erro.value = 'Selecione uma imagem principal';
    loading.value = false;
    return;
  }

  if (form.value.emDestaque && !imagemDestaque.value) {
    erro.value = 'Selecione uma imagem PNG para destaque';
    loading.value = false;
    return;
  }

  const data = new FormData();
  data.append('nome', form.value.nome);
  data.append('preco', form.value.preco);
  data.append('categoriaId', 1);
  data.append('status', 'ativo');
  data.append('imagem', imagemPrincipal.value);

  if (form.value.emDestaque) {
    data.append('emDestaque', true);
    data.append('imagemDestaque', imagemDestaque.value);
    data.append('ordemDestaque', form.value.ordem);
  }

  try {
    const response = await fetch('http://localhost:5001/api/produtos', {
      method: 'POST',
      body: data
    });

    const resultado = await response.json();

    if (!response.ok) {
      erro.value = resultado.error || 'Erro ao criar produto';
    } else {
      alert('Produto criado com sucesso!');
      form.value = { nome: '', preco: '', emDestaque: false, ordem: 1 };
      imagemPrincipal.value = null;
      imagemDestaque.value = null;
    }
  } catch (err) {
    erro.value = 'Erro: ' + err.message;
  } finally {
    loading.value = false;
  }
};
</script>
```

---

## ⚠️ Validações Importantes

### No Frontend (recomendado)

```javascript
// 1. Validar tipo de arquivo PNG
if (imagemDestaque && imagemDestaque.type !== 'image/png') {
  alert('Apenas PNG é aceito para destaque');
  return;
}

// 2. Validar tamanho (máx 5MB)
if (imagemDestaque && imagemDestaque.size > 5 * 1024 * 1024) {
  alert('Arquivo muito grande (máximo 5MB)');
  return;
}

// 3. Validar ordem
if (ordem < 1 || ordem > 6) {
  alert('Ordem deve estar entre 1 e 6');
  return;
}

// 4. Validar que imagem de destaque é obrigatória se em destaque
if (emDestaque && !imagemDestaque) {
  alert('Imagem de destaque é obrigatória quando marcado como destaque');
  return;
}
```

---

## 🔴 Erros Comuns & Soluções

| Erro | Causa | Solução |
|------|-------|---------|
| `Apenas arquivos PNG sao permitidos...` | Enviou JPG/WebP/outro formato | Use **sempre PNG** para `imagemDestaque` |
| `Campo imagemDestaque e obrigatorio...` | Marcou como destaque mas não enviou PNG | Selecione a imagem PNG antes de enviar |
| `Limite maximo de 6 produtos...` | Já existem 6 produtos em destaque | Remova um do destaque primeiro ou mude a ordem |
| `Campo ordemDestaque deve estar entre 1 e 6` | Enviou ordem 0, 7, etc. | Use números de 1 a 6 |
| `Nenhum campo valido informado...` | Não modificou nenhum campo no PUT | Envie pelo menos um campo para atualizar |

---

## 📊 Variantes de Valor Aceitas

```javascript
/* Boolean */
formData.append('emDestaque', true);
formData.append('emDestaque', false);

/* String */
formData.append('emDestaque', 'true');
formData.append('emDestaque', 'false');
formData.append('emDestaque', 'ativo');
formData.append('emDestaque', 'inativo');

/* Ordem como número ou string */
formData.append('ordemDestaque', 1);
formData.append('ordemDestaque', '1');
```

---

## 📈 Fluxo de Destaque Recomendado

1. **Criar Produto Normal** → sem destaque
2. **Depois Editar** → adicionar aos destaques com ordem disponível
3. **Mudar Ordem** → se a ordem já existe, o sistema sugere uma nova automaticamente
4. **Remover de Destaque** → `emDestaque: false` remove da página inicial

---

## 🔗 URLs Base

```
Desenvolvimento: http://localhost:5001/api
Produção: https://api.jrcoffee.com/api (exemplo)
```

---

## 📚 Endpoints Relacionados

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/produtos` | Lista públicos (com filtro de disponibilidade) |
| GET | `/api/produtos/:id` | Detalhe de um produto |
| POST | `/api/produtos` | Criar novo produto |
| PUT | `/api/produtos/:id` | Atualizar produto |
| DELETE | `/api/produtos/:id` | Remover produto |
| GET | `/api/admin/produtos` | Lista todos (admin) |

---

## ✅ Checklist para Frontend

- [ ] Usar `FormData` para multipart uploads
- [ ] Validar que PNG seja usado para `imagemDestaque`
- [ ] Validar ordem está entre 1 e 6
- [ ] Não adicionar `Content-Type` header (navegador faz automaticamente)
- [ ] Tratar erros do backend e mostrar mensagens user-friendly
- [ ] Implementar loading state durante upload
- [ ] Testar com arquivo PNG real sem fundo
- [ ] Validar tamanho de arquivo (reco: <1MB para destaque)

---

**Última atualização:** 07/04/2026
