# Como o Cardápio Busca e Exibe os Produtos

Este arquivo explica, de forma direta, como a tela `CardapioGroupProductsPage.jsx` usa a API para buscar os dados do produto e mostrar tudo na interface.

## Visão geral

A página faz basicamente quatro coisas:

1. Descobre qual grupo de produtos deve ser exibido.
2. Busca os dados na API.
3. Resolve a URL da imagem do produto.
4. Renderiza o card com imagem, nome, descrição e preço.

Os dois endpoints usados no fluxo principal são:

- `/categorias`
- `/produtos`

## 1. A base da API

A URL base da API vem do arquivo de serviço `cardapioApi.js`.

```jsx
const CARDAPIO_API_BASE_URL = (
  process.env.REACT_APP_API_BASE_URL_COFFEE ||
  process.env.REACT_APP_API_BASE_URL ||
  "http://localhost:5001/api"
).replace(/\/$/, "");

const CARDAPIO_API_ROOT_URL = CARDAPIO_API_BASE_URL.replace(/\/api\/?$/, "");
```

O que isso faz:

- tenta usar uma variável de ambiente primeiro;
- se não existir, cai no `localhost`;
- remove a barra final para evitar URL duplicada;
- cria também a versão da raiz do servidor, sem `/api`.

Essa raiz é importante porque muitas vezes a API devolve só o caminho relativo da imagem, como `/uploads/produto.jpg`.

## 2. A busca dos dados

Na tela `CardapioGroupProductsPage.jsx`, a busca acontece dentro de um `useEffect`.

```jsx
useEffect(() => {
  if (hasExternalData) {
    return undefined;
  }

  let mounted = true;
  setIsLoading(true);
  setError("");

  Promise.all([cardapioApi.get("/categorias"), cardapioApi.get("/produtos")])
    .then(([groupsRes, productsRes]) => {
      if (!mounted) return;
      const allGroups = Array.isArray(groupsRes.data) ? groupsRes.data : [];
      const allProducts = Array.isArray(productsRes.data) ? productsRes.data : [];
      const foundGroup = allGroups.find((g) => String(g.id) === String(currentGroupId)) || null;
      const filtered = allProducts.filter(
        (p) => String(resolveCategoryId(p)) === String(currentGroupId)
      );

      setGroup(foundGroup);
      setProducts(filtered);
    })
    .catch((err) => {
      if (mounted)
        setError(err?.response?.data?.message || "Não foi possível carregar os produtos.");
    })
    .finally(() => {
      if (mounted) setIsLoading(false);
    });

  return () => {
    mounted = false;
  };
}, [currentGroupId, hasExternalData]);
```

### O que acontece aqui

- Se os dados vierem por props (`hasExternalData`), a tela não faz fetch.
- Se não vierem, ela chama a API.
- Usa `Promise.all` para buscar categorias e produtos ao mesmo tempo.
- Depois filtra só os produtos do grupo atual.
- Salva o grupo e os produtos no estado React.

## 3. Como o grupo certo é encontrado

A função abaixo tenta descobrir a qual grupo o produto pertence.

```jsx
function resolveCategoryId(product) {
  return (
    product?.categoria_id ??
    product?.categoriaId ??
    product?.grupo?.id ??
    product?.grupoId ??
    null
  );
}
```

Ela existe porque a API pode devolver o id do grupo com nomes diferentes.

Exemplo:

- `categoria_id`
- `categoriaId`
- `grupo.id`
- `grupoId`

Isso deixa a tela mais tolerante a formatos diferentes de resposta.

## 4. Como a imagem do produto é encontrada

Essa é a parte central da exibição visual.

```jsx
function resolveImage(item) {
  const path =
    item?.image_path ||
    item?.imagem ||
    item?.image ||
    item?.capa_imagem ||
    item?.capaImagem ||
    item?.imagemVertical ||
    item?.imagem_vertical ||
    item?.imagemHorizontal ||
    item?.imagem_horizontal ||
    null;
  if (!path) return null;
  if (String(path).startsWith("http")) return path;
  return `${CARDAPIO_API_ROOT_URL}${String(path).startsWith("/") ? "" : "/"}${path}`;
}
```

### O que essa função faz

- procura a imagem em vários nomes de campo possíveis;
- se encontrar uma URL completa, usa direto;
- se encontrar um caminho relativo, junta com `CARDAPIO_API_ROOT_URL`;
- se não encontrar nada, devolve `null`.

### Exemplo prático

Se a API devolver:

```jsx
{
  nome: "Coxinha",
  image_path: "/uploads/coxinha.jpg"
}
```

A função monta algo como:

```jsx
http://localhost:5001/uploads/coxinha.jpg
```

ou a URL real do servidor, dependendo do ambiente.

## 5. Como a imagem vira um `<img>` na tela

O componente do card usa a função acima e decide o que renderizar.

```jsx
function ProductCard({ product }) {
  const image = resolveImage(product);
  return (
    <div className="cgp-card">
      <div className="cgp-card-media">
        {image ? (
          <img src={image} alt={product.nome} draggable={false} />
        ) : (
          <div className="cgp-card-placeholder">JR</div>
        )}
      </div>
      <div className="cgp-card-info">
        <div className="cgp-card-text">
          <h3>{product.nome}</h3>
          <p>{product.descricao || ""}</p>
        </div>
        <span className="cgp-card-price">{formatPrice(product.preco)}</span>
      </div>
    </div>
  );
}
```

### Lógica do JSX

- chama `resolveImage(product)`;
- se existir imagem, mostra `<img>`;
- se não existir, mostra o placeholder `JR`;
- ao lado da imagem, renderiza nome, descrição e preço.

## 6. Como a página monta o card principal

Mais abaixo, a página pega o primeiro produto da lista e usa a imagem dele como imagem de destaque.

```jsx
const activeProduct = products[0] || null;
const groupImage = resolveImage(activeProduct) || (group ? resolveImage(group) : null);
const rootStyle = {
  "--cgp-card-width": `${cardWidth}px`,
  "--cgp-gap": `${gap}px`,
  ...(groupImage ? { "--cgp-hero-image": `url("${groupImage}")` } : {}),
};
```

### O que isso significa

- `products[0]` é usado como referência visual;
- se ele não tiver imagem, tenta usar a imagem do grupo;
- se existir imagem, ela vira uma variável CSS `--cgp-hero-image`;
- isso permite criar um fundo visual atrás do carrossel.

## 7. Como os cards são renderizados no carrossel

Depois do fetch, a lista `products` é percorrida com `map`.

```jsx
<div ref={viewportRef} className="cgp-stage" onWheel={handleWheel} onScroll={updateScrollState}>
  <div className="cgp-track">
    {products.map((product) => (
      <article key={product.id} className="cgp-slide">
        <ProductCard product={product} />
      </article>
    ))}
  </div>
  <div className="cgp-stage-right-blur" aria-hidden="true" />
</div>
```

### Aqui acontece

- cada produto vira um `ProductCard`;
- o carrossel recebe rolagem horizontal;
- a tela controla o botão anterior/próximo com `canPrev` e `canNext`.

## 8. Resumo do fluxo de imagem

O fluxo visual da imagem é este:

1. a API devolve os produtos;
2. a função `resolveImage` lê o campo da imagem;
3. a função monta a URL completa, se necessário;
4. o JSX renderiza `<img src={image} />`;
5. se não houver imagem, aparece o placeholder.

## 9. Exemplo resumido

Se a API devolver este produto:

```jsx
{
  id: 1,
  nome: "Pastel",
  descricao: "Pastel crocante",
  preco: 12.5,
  image_path: "/uploads/pastel.jpg"
}
```

A tela faz isso:

```jsx
const image = resolveImage(product);
```

E depois mostra:

```jsx
<img src={image} alt={product.nome} />
```

## 10. Conclusão

A tela do cardápio não busca a imagem diretamente no HTML. Ela recebe os produtos da API, escolhe o campo certo da imagem com `resolveImage`, transforma o caminho em URL válida e então renderiza a imagem dentro do card.

Se você quiser, o próximo passo pode ser eu fazer o mesmo tipo de `.md` para a vitrine principal do cardápio, usando `CardapioProductsShowcasePage.jsx`.
