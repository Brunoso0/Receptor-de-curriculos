# ✅ Checklist de Testes de Funcionalidades

Este documento reúne os fluxos principais do projeto para validação manual.

---

## 1) Pré-requisitos para teste

- [ ] Aplicação frontend iniciando sem erro (`npm install` + `npm start`)
- [ ] Backend principal disponível para rotas do site principal
- [ ] Backend do cardápio disponível em `REACT_APP_API_BASE_URL_COFFEE`
- [ ] Variáveis de ambiente configuradas no `.env`
- [ ] Toasts/notificações aparecendo normalmente

---

## 2) Rotas principais (sanidade)

- [ ] `/` abre Home sem erro
- [ ] `/products` abre página de produtos/frutos
- [ ] `/about-us` abre página institucional
- [ ] `/contact` abre página de contato
- [ ] `/local` abre página de localização
- [ ] `/login` abre login do site principal
- [ ] `/admin` abre painel admin do site principal
- [ ] `/trabalhe-conosco` abre formulário Trabalhe Conosco
- [ ] `/menu` abre cardápio público
- [ ] `/menu/produtos` abre vitrine de produtos
- [ ] `/menu/grupo/:groupId` abre vitrine por grupo
- [ ] `/menu/login` abre login administrativo do cardápio
- [ ] `/menu/admin` redireciona para login se não autenticado

---

## 3) Home / Site principal

### 3.1 Estrutura visual
- [ ] Header aparece em páginas públicas
- [ ] Footer aparece em páginas públicas
- [ ] Em `/admin`, `/menu/*` e `/trabalhe-conosco`, header/footer do site ficam ocultos

### 3.2 Seções da Home
- [ ] Hero carregando corretamente
- [ ] ProductOffers carregando
- [ ] PromotionalBanner carregando
- [ ] FeedbackSection carregando

### 3.3 Comportamento de scroll
- [ ] Header muda visual após rolagem (>50px)
- [ ] Logo alterna entre versões conforme scroll
- [ ] Sem erros de console ao rolar a página

---

## 4) Trabalhe Conosco (`/trabalhe-conosco`)

### 4.1 Carregamento de vagas
- [ ] Lista de vagas vem da API pública (`/public/vacancies?companyId=3`)
- [ ] Quando não há vagas, mensagem de vazio aparece

### 4.2 Validações de formulário
- [ ] Nome obrigatório
- [ ] Email obrigatório e formato válido
- [ ] Telefone obrigatório com máscara válida
- [ ] Seleção de vaga obrigatória
- [ ] Upload de currículo obrigatório
- [ ] Aceite de privacidade obrigatório

### 4.3 Uploads
- [ ] Currículo aceita PDF
- [ ] Foto aceita imagem e é opcional
- [ ] Arquivos acima de 20MB são bloqueados com mensagem

### 4.4 Envio e feedback
- [ ] Envio válido exibe modal de sucesso
- [ ] Cadastro duplicado (409) exibe modal de duplicidade
- [ ] Falha de rede exibe toast de erro
- [ ] Formulário limpa após sucesso

---

## 5) Login do site principal (`/login`)

### 5.1 Cadastro/login local JR Coffee
- [ ] Alternância entre modo “Entrar” e “Registrar”
- [ ] Registro com dados válidos retorna sucesso
- [ ] Login com dados válidos redireciona para `/admin`
- [ ] Erro de autenticação mostra mensagem e toast

---

## 6) Admin do site principal (`/admin`)

### 6.1 Navegação interna
- [ ] Aba “Cadastro” abre corretamente
- [ ] Aba “Produtos” abre corretamente
- [ ] Aba “Frutos do Goiás” abre corretamente

### 6.2 Cadastro de categoria
- [ ] Criação de categoria com nome válido
- [ ] Mensagem de sucesso após criar categoria
- [ ] Lista de categorias atualiza após criação

### 6.3 Cadastro de produto
- [ ] Criação de produto com categoria selecionada
- [ ] Upload de imagem no produto
- [ ] Mensagem de sucesso após criar produto

### 6.4 Listagens admin
- [ ] Listagem de produtos carrega sem erro
- [ ] Listagem de frutos carrega sem erro

---

## 7) Cardápio público (`/menu`)

### 7.1 Carga inicial
- [ ] Carrega categorias (`GET /categorias`)
- [ ] Carrega produtos (`GET /produtos`)
- [ ] Exibe estado de loading
- [ ] Exibe estado de erro quando API falha

### 7.2 Sidebar do usuário
- [ ] Botão “Novidades” funciona
- [ ] Botão “Grupos” (all) funciona
- [ ] Botão “Produtos” funciona
- [ ] Lista de categorias renderiza todas recebidas da API

### 7.3 Fluxos de visualização
- [ ] Modo novidades mostra hero/vídeo
- [ ] Modo produtos mostra vitrine completa
- [ ] Modo grupo mostra produtos filtrados por grupo

### 7.4 Carrinho
- [ ] Adicionar item ao carrinho
- [ ] Alterar quantidade de item
- [ ] Remover item
- [ ] Limpar carrinho
- [ ] Persistência em storage entre refresh

---

## 8) Login do cardápio (`/menu/login`)

- [ ] Login com credenciais válidas autentica
- [ ] Sessão salva corretamente
- [ ] Usuário admin redireciona para `/menu/admin`
- [ ] Credenciais inválidas exibem erro
- [ ] Botão mostrar/ocultar senha funciona

---

## 9) Cardápio Admin (`/menu/admin`)

### 9.1 Proteção de rota
- [ ] Sem sessão: redireciona para `/menu/login`
- [ ] Com sessão sem role admin: redirecionamento por role
- [ ] Com admin: acesso permitido

### 9.2 Sidebar admin
- [ ] Expandir/recolher sidebar
- [ ] Navegação para Painel
- [ ] Navegação para Grupos
- [ ] Navegação para Horários
- [ ] Botão logout limpa sessão e volta ao login
- [ ] Lista de atalhos/categorias mostra os grupos esperados

### 9.3 Painel de produtos (dashboard)
- [ ] Busca por nome/descrição/grupo
- [ ] Filtro por grupo selecionado
- [ ] Criar produto com dados válidos
- [ ] Editar produto existente
- [ ] Pausar/ativar produto
- [ ] Excluir produto com confirmação
- [ ] Upload/troca de imagem no modal

### 9.4 Gestão de grupos (`/menu/admin/grupos`)
- [ ] Criar grupo com nome e ícone
- [ ] Upload de imagem vertical e horizontal
- [ ] Editar grupo existente
- [ ] Alterar status (ativo/inativo)
- [ ] Excluir grupo com confirmação
- [ ] Tabela mostra contagem de itens por grupo

### 9.5 Horários e empresa (`/menu/admin/horarios`)
- [ ] Carregar dados de empresa (`GET /empresa`)
- [ ] Editar CEP e endereço
- [ ] Ativar/desativar dias da semana
- [ ] Editar horário de abertura/fechamento
- [ ] Editar links/redes sociais
- [ ] Salvar alterações (`PUT /empresa`) com feedback de sucesso/erro

---

## 10) Testes de regressão rápidos (smoke)

- [ ] Não há crash ao alternar entre `/menu`, `/menu/produtos` e `/menu/grupo/:id`
- [ ] Não há crash ao alternar entre abas do `/menu/admin`
- [ ] Não há erros críticos no console do navegador
- [ ] Imagens com fallback exibem placeholder quando indisponíveis
- [ ] Estados vazios exibem mensagens amigáveis

---

## 11) Casos negativos (recomendado)

- [ ] API fora do ar no cardápio (ver estado de erro)
- [ ] Login com senha inválida
- [ ] Criar produto sem campos obrigatórios
- [ ] Criar grupo sem nome
- [ ] Tentar excluir item e cancelar confirmação
- [ ] Upload de arquivo inválido/tamanho excedido

---

## 12) Evidências de teste (para preencher)

- **Data/hora do teste:**
- **Ambiente:** (local/homolog/prod)
- **Commit/branch:**
- **Responsável:**
- **Resumo:** (Aprovado / Aprovado com ressalvas / Reprovado)
- **Bugs encontrados:**
  - ID:
  - Descrição:
  - Passos para reproduzir:
  - Severidade:

---

## 13) Observações

- Se desejar, divida este checklist em execução por sprint/módulo.
- Priorize os blocos 7, 8 e 9 em toda release do cardápio.
