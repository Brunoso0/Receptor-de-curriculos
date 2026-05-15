import React, { useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  Beer,
  Cake,
  Camera,
  CheckCircle,
  ChevronRight,
  Coffee,
  Cookie,
  Edit3,
  GlassWater,
  IceCream,
  Layers,
  Package,
  Pause,
  Pizza,
  Play,
  Plus,
  Search,
  Soup,
  Trash2,
  UploadCloud,
  Utensils,
  Wine,
  X,
} from "lucide-react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import { CARDAPIO_API_ROOT_URL } from "../services/cardapioApi";

const FEATURED_GRID_POSITIONS = [1, 2, 3, 4, 5, 6];


function formatPrice(price) {
  const value = Number(price || 0);
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function resolveCategoryId(product) {
  return product?.categoria_id ?? product?.categoriaId ?? product?.grupo?.id ?? product?.grupoId ?? null;
}

function normalizeId(value) {
  return value === null || value === undefined ? null : String(value);
}

function isSameId(leftValue, rightValue) {
  return normalizeId(leftValue) === normalizeId(rightValue);
}

function resolveStatus(product) {
  const status = String(product?.status || "ativo").toLowerCase();
  return status === "inativo" ? "inativo" : "ativo";
}

function resolveFeaturedFlag(product) {
  return Boolean(product?.em_destaque ?? product?.emDestaque ?? false);
}

function resolveFeaturedImagePath(product) {
  return product?.imagem_destaque_url ?? product?.imagemDestaqueUrl ?? "";
}

function resolveFeaturedOrder(product) {
  const value = product?.ordem_destaque ?? product?.ordemDestaque ?? "";
  return value === null || value === undefined ? "" : String(value);
}

function resolveFeaturedOrderNumber(product) {
  const numericValue = Number(product?.ordem_destaque ?? product?.ordemDestaque ?? 0);
  return Number.isInteger(numericValue) ? numericValue : 0;
}

function resolveImage(product) {
  const imagePath = product?.image_path || product?.imagem || product?.image || null;
  if (!imagePath) {
    return null;
  }

  if (String(imagePath).startsWith("http")) {
    return imagePath;
  }

  return `${CARDAPIO_API_ROOT_URL}${String(imagePath).startsWith("/") ? "" : "/"}${imagePath}`;
}

function resolvePreviewImage(imagePath) {
  if (!imagePath) {
    return null;
  }

  if (String(imagePath).startsWith("http")) {
    return imagePath;
  }

  return `${CARDAPIO_API_ROOT_URL}${String(imagePath).startsWith("/") ? "" : "/"}${imagePath}`;
}

function resolveGroupIcon(groupName, index) {
  const normalizedName = String(groupName || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (normalizedName.includes("almoc") || normalizedName.includes("prato")) {
    return Utensils;
  }

  if (normalizedName.includes("cafe") || normalizedName.includes("bebida")) {
    return Coffee;
  }

  if (normalizedName.includes("sobremesa") || normalizedName.includes("doce")) {
    return IceCream;
  }

  return index % 2 === 0 ? Utensils : Coffee;
}

function getGroupIconComponent(group, fallbackIndex) {
  if (group.icon) {
    const iconMap = {
      "Utensils": Utensils,
      "Coffee": Coffee,
      "IceCream": IceCream,
      "Pizza": Pizza,
      "Cake": Cake,
      "Beer": Beer,
      "GlassWater": GlassWater,
      "Soup": Soup,
      "Cookie": Cookie,
      "Wine": Wine,
    };
    return iconMap[group.icon] || resolveGroupIcon(group.nome, fallbackIndex);
  }
  return resolveGroupIcon(group.nome, fallbackIndex);
}

function ProductModal({
  isOpen,
  mode,
  groups,
  formState,
  occupiedFeaturedPositions,
  isSaving,
  onClose,
  onSubmit,
  onChange,
  onImageChange,
  onFeaturedImageChange,
  onSelectFeaturedOrder,
}) {
  const fileInputRef = useRef(null);
  const featuredFileInputRef = useRef(null);

  if (!isOpen) {
    return null;
  }

  const previewImage = formState.imagePreview || resolvePreviewImage(formState.image_path);
  const previewFeaturedImage =
    formState.imageDestaquePreview || resolvePreviewImage(formState.imagem_destaque_url);
  const isActive = formState.status === "ativo";
  const isFeatured = Boolean(formState.em_destaque);
  const selectedFeaturedOrder = Number(formState.ordem_destaque || 0);

  return (
    <div className="cardapio-admin-modal-overlay" onClick={isSaving ? undefined : onClose}>
      <div className="cardapio-admin-modal" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="cardapio-admin-modal-header">
          <div className="cardapio-admin-modal-header-info">
            <div className="cardapio-admin-modal-header-icon">
              <Package size={22} strokeWidth={1.8} />
            </div>
            <div>
              <h2>{mode === "create" ? "Novo Produto" : "Editar Produto"}</h2>
              <p>{mode === "create" ? "Cadastre os detalhes do seu novo item abaixo." : "Atualize as informações do produto."}</p>
            </div>
          </div>
          <button
            type="button"
            className="cardapio-admin-modal-close"
            onClick={onClose}
            disabled={isSaving}
            aria-label="Fechar"
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        <form className="cardapio-admin-modal-body cardapio-admin-modal-form" onSubmit={onSubmit}>
          <div className="cardapio-admin-modal-layout">

            {/* Coluna de imagem */}
            <div className="cardapio-admin-modal-img-col">
              <span className="cardapio-admin-modal-field-label">Imagem do Produto</span>
              <div
                className={`cardapio-admin-modal-upload-zone${previewImage ? " has-image" : ""}`}
                onClick={() => !isSaving && fileInputRef.current?.click()}
              >
                {previewImage ? (
                  <>
                    <img src={previewImage} alt={formState.nome || "Preview"} />
                    <div className="cardapio-admin-modal-upload-overlay">
                      <UploadCloud size={22} strokeWidth={1.8} />
                      <span>Alterar Imagem</span>
                    </div>
                  </>
                ) : (
                  <div className="cardapio-admin-modal-upload-placeholder">
                    <div className="cardapio-admin-modal-upload-icon">
                      <Camera size={32} strokeWidth={1.5} />
                    </div>
                    <p>Clique para selecionar</p>
                    <small>JPG, PNG OU WEBP</small>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={onImageChange}
                />
              </div>
            </div>

            {/* Coluna de campos */}
            <div className="cardapio-admin-modal-fields-col">

              <div className="cardapio-admin-modal-field">
                <label htmlFor="modal-nome" className="cardapio-admin-modal-field-label">Nome do Produto</label>
                <input
                  id="modal-nome"
                  name="nome"
                  value={formState.nome}
                  onChange={onChange}
                  placeholder="Ex: Bolo de Chocolate Artesanal"
                  required
                />
              </div>

              <div className="cardapio-admin-modal-field">
                <label htmlFor="modal-descricao" className="cardapio-admin-modal-field-label">Descrição</label>
                <textarea
                  id="modal-descricao"
                  name="descricao"
                  value={formState.descricao}
                  onChange={onChange}
                  placeholder="Descreva brevemente os ingredientes e diferenciais..."
                  rows={3}
                />
              </div>

              <div className="cardapio-admin-modal-inline">
                <div className="cardapio-admin-modal-field">
                  <label className="cardapio-admin-modal-field-label">Preço de Venda</label>
                  <div className="cardapio-admin-price-field">
                    <span>R$</span>
                    <input
                      name="preco"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formState.preco}
                      onChange={onChange}
                      placeholder="0,00"
                      required
                    />
                  </div>
                </div>

                <div className="cardapio-admin-modal-field">
                  <label htmlFor="modal-grupo" className="cardapio-admin-modal-field-label">Grupo / Categoria</label>
                  <div className="cardapio-admin-select-wrap">
                    <Layers size={17} strokeWidth={1.7} className="cardapio-admin-select-icon" />
                    <select id="modal-grupo" name="categoriaId" value={formState.categoriaId} onChange={onChange} required>
                      {!groups.length ? <option value="">Sem grupos</option> : null}
                      {groups.map((group) => (
                        <option key={group.id} value={group.id}>{group.nome}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="cardapio-admin-modal-field">
                <label className="cardapio-admin-modal-field-label">Status do Produto</label>
                <div className="cardapio-admin-status-toggle">
                  <button
                    type="button"
                    className={`cardapio-admin-status-btn ativo${isActive ? " active" : ""}`}
                    onClick={() => onChange({ target: { name: "status", value: "ativo" } })}
                  >
                    <CheckCircle size={18} strokeWidth={2} />
                    Ativo
                  </button>
                  <button
                    type="button"
                    className={`cardapio-admin-status-btn inativo${!isActive ? " active" : ""}`}
                    onClick={() => onChange({ target: { name: "status", value: "inativo" } })}
                  >
                    <AlertCircle size={18} strokeWidth={2} />
                    Inativo
                  </button>
                </div>
              </div>

              <div className="cardapio-admin-modal-field">
                <label className="cardapio-admin-modal-field-label">Exibir no Destaque do Site</label>
                <div className="cardapio-admin-status-toggle">
                  <button
                    type="button"
                    className={`cardapio-admin-status-btn ativo${isFeatured ? " active" : ""}`}
                    onClick={() => onChange({ target: { name: "em_destaque", value: true } })}
                  >
                    <CheckCircle size={18} strokeWidth={2} />
                    Sim
                  </button>
                  <button
                    type="button"
                    className={`cardapio-admin-status-btn inativo${!isFeatured ? " active" : ""}`}
                    onClick={() => onChange({ target: { name: "em_destaque", value: false } })}
                  >
                    <AlertCircle size={18} strokeWidth={2} />
                    Não
                  </button>
                </div>
              </div>

              {isFeatured ? (
                <>
                  <div className="cardapio-admin-modal-field">
                    <label className="cardapio-admin-modal-field-label">Imagem de Destaque (PNG sem fundo)</label>
                    <div
                      className={`cardapio-admin-featured-upload-zone${previewFeaturedImage ? " has-image" : ""}`}
                      onClick={() => !isSaving && featuredFileInputRef.current?.click()}
                    >
                      {previewFeaturedImage ? (
                        <>
                          <img src={previewFeaturedImage} alt={`${formState.nome || "Produto"} destaque`} />
                          <div className="cardapio-admin-featured-upload-overlay">
                            <UploadCloud size={20} strokeWidth={1.8} />
                            <span>Alterar PNG</span>
                          </div>
                        </>
                      ) : (
                        <div className="cardapio-admin-featured-upload-placeholder">
                          <UploadCloud size={24} strokeWidth={1.8} />
                          <p>Clique para enviar PNG</p>
                        </div>
                      )}
                      <input
                        ref={featuredFileInputRef}
                        type="file"
                        accept="image/png,.png"
                        style={{ display: "none" }}
                        onChange={onFeaturedImageChange}
                      />
                    </div>
                  </div>

                  <div className="cardapio-admin-modal-field">
                    <label className="cardapio-admin-modal-field-label">Posição no Destaque</label>
                    <div className="cardapio-admin-featured-grid">
                      {FEATURED_GRID_POSITIONS.map((position) => {
                        const isOccupied = occupiedFeaturedPositions.has(position);
                        const isSelected = selectedFeaturedOrder === position;
                        const isBlocked = isOccupied && !isSelected;

                        return (
                          <button
                            key={position}
                            type="button"
                            className={`cardapio-admin-featured-slot${isSelected ? " selected" : ""}${
                              isBlocked ? " unavailable" : ""
                            }`}
                            onClick={() => onSelectFeaturedOrder(position)}
                            disabled={isSaving || isBlocked}
                            title={
                              isOccupied
                                ? `Posicao ${position} ocupada`
                                : `Selecionar posicao ${position}`
                            }
                          >
                            {position}
                          </button>
                        );
                      })}
                    </div>
                    <small className="cardapio-admin-featured-grid-note">
                      Grade 3x2: selecione uma posicao livre entre 1 e 6.
                    </small>
                  </div>
                </>
              ) : null}

            </div>
          </div>

          <footer className="cardapio-admin-modal-foot">
            <button type="button" className="ghost" onClick={onClose} disabled={isSaving}>
              Cancelar
            </button>
            <button type="submit" className="primary" disabled={isSaving}>
              {isSaving
                ? "Salvando..."
                : mode === "create"
                  ? "Criar Produto"
                  : "Salvar Alterações"}
            </button>
          </footer>
        </form>

      </div>
    </div>
  );
}

function ProductCard({
  product,
  isBusy,
  onToggleProductStatus,
  onDeleteProduct,
  onEditProduct,
}) {
  const isActive = resolveStatus(product) === "ativo";

  return (
    <article className={`cardapio-admin-v2-product-card ${isActive ? "" : "is-paused"}`}>
      <div className="cardapio-admin-v2-thumb">
        {resolveImage(product) ? (
          <img src={resolveImage(product)} alt={product.nome} />
        ) : (
          <div className="cardapio-admin-v2-fallback">JR</div>
        )}

        <div className="cardapio-admin-v2-thumb-overlay">
          <button
            type="button"
            className="cardapio-admin-v2-edit"
            onClick={() => onEditProduct(product)}
            title="Editar produto"
          >
            <Edit3 size={18} />
          </button>
        </div>

        <div className="cardapio-admin-v2-tools">
          <button
            type="button"
            className="cardapio-admin-v2-tool pause"
            onClick={() => onToggleProductStatus(product)}
            disabled={isBusy}
            title={isActive ? "Pausar produto" : "Ativar produto"}
          >
            {isActive ? <Pause size={13} /> : <Play size={13} />}
          </button>
          <button
            type="button"
            className="cardapio-admin-v2-tool remove"
            onClick={() => {
              if (window.confirm(`Deseja excluir ${product.nome}?`)) {
                onDeleteProduct(product);
              }
            }}
            disabled={isBusy}
            title="Excluir produto"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      <div className="cardapio-admin-v2-card-content">
        <h4>{product.nome}</h4>
        <p>{formatPrice(product.preco)}</p>
      </div>
    </article>
  );
}

function AddProductCard({ groupName, onCreateProduct, disabled }) {
  return (
    <article className="cardapio-admin-v2-add-card">
      <button
        type="button"
        className="cardapio-admin-v2-add-button"
        onClick={onCreateProduct}
        disabled={disabled}
      >
        <span>
          <Plus size={18} />
        </span>
        <small>Novo em {groupName}</small>
      </button>
    </article>
  );
}

function CardapioAdminDashboardPage() {
  const navigate = useNavigate();
  const {
    groups,
    selectedGroupId,
    visibleProducts,
    allProducts,
    searchTerm,
    onSearchTermChange,
    busyProductIds,
    onToggleProductStatus,
    onDeleteProduct,
    onCreateProduct,
    onUpdateProduct,
  } = useOutletContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [editingProductId, setEditingProductId] = useState(null);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [formState, setFormState] = useState({
    nome: "",
    descricao: "",
    preco: "",
    categoriaId: "",
    status: "ativo",
    em_destaque: false,
    imagem_destaque_url: "",
    ordem_destaque: "",
    imageDestaqueFile: null,
    imageDestaquePreview: "",
    image_path: "",
    imageFile: null,
    imagePreview: "",
  });

  const occupiedFeaturedPositions = useMemo(() => {
    const occupiedSlots = new Set();

    allProducts.forEach((product) => {
      if (!resolveFeaturedFlag(product)) {
        return;
      }

      if (modalMode === "edit" && isSameId(product.id, editingProductId)) {
        return;
      }

      const order = resolveFeaturedOrderNumber(product);
      if (order >= 1 && order <= 6) {
        occupiedSlots.add(order);
      }
    });

    return occupiedSlots;
  }, [allProducts, modalMode, editingProductId]);

  const groupsToRender = useMemo(() => {
    if (selectedGroupId === "all") {
      return groups;
    }

    return groups.filter((group) => isSameId(group.id, selectedGroupId));
  }, [groups, selectedGroupId]);

  const productsByGroup = useMemo(() => {
    return groupsToRender.map((group) => ({
      group,
      products: visibleProducts.filter((product) => isSameId(resolveCategoryId(product), group.id)),
      Icon: getGroupIconComponent(group, groupsToRender.indexOf(group)),
    }));
  }, [groupsToRender, visibleProducts]);

  const defaultCategoryId = useMemo(() => {
    if (selectedGroupId !== "all") {
      return selectedGroupId;
    }

    return groups[0]?.id || "";
  }, [groups, selectedGroupId]);

  function openCreateModal(categoryId) {
    setModalMode("create");
    setEditingProductId(null);
    setFormState({
      nome: "",
      descricao: "",
      preco: "",
      categoriaId: String(categoryId || defaultCategoryId || ""),
      status: "ativo",
      em_destaque: false,
      imagem_destaque_url: "",
      ordem_destaque: "",
      imageDestaqueFile: null,
      imageDestaquePreview: "",
      image_path: "",
      imageFile: null,
      imagePreview: "",
    });
    setIsModalOpen(true);
  }

  function openEditModal(product) {
    setModalMode("edit");
    setEditingProductId(product.id);
    setFormState({
      nome: product?.nome || "",
      descricao: product?.descricao || "",
      preco: product?.preco ?? "",
      categoriaId: String(resolveCategoryId(product) || defaultCategoryId || ""),
      status: resolveStatus(product),
      em_destaque: resolveFeaturedFlag(product),
      imagem_destaque_url: resolveFeaturedImagePath(product),
      ordem_destaque: resolveFeaturedOrder(product),
      imageDestaqueFile: null,
      imageDestaquePreview: "",
      image_path: product?.image_path || product?.imagem || product?.image || "",
      imageFile: null,
      imagePreview: "",
    });
    setIsModalOpen(true);
  }

  function closeModal() {
    if (isSavingProduct) {
      return;
    }

    setIsModalOpen(false);
  }

  function handleFormChange(event) {
    const { name, value } = event.target;
    setFormState((currentState) => ({
      ...currentState,
      ...(name === "em_destaque"
        ? {
            em_destaque: value === true || value === "true",
            ...(value === true || value === "true"
              ? null
              : {
                  imagem_destaque_url: "",
                  ordem_destaque: "",
                  imageDestaqueFile: null,
                  imageDestaquePreview: "",
                }),
          }
        : null),
      [name]: value,
    }));
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0] || null;

    if (!file) {
      setFormState((currentState) => ({
        ...currentState,
        imageFile: null,
        imagePreview: "",
      }));
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setFormState((currentState) => ({
        ...currentState,
        imageFile: file,
        imagePreview: typeof reader.result === "string" ? reader.result : "",
      }));
    };

    reader.readAsDataURL(file);
  }

  function handleFeaturedImageChange(event) {
    const file = event.target.files?.[0] || null;

    if (!file) {
      setFormState((currentState) => ({
        ...currentState,
        imageDestaqueFile: null,
        imageDestaquePreview: "",
      }));
      return;
    }

    const isPngByType = file.type === "image/png";
    const isPngByName = /\.png$/i.test(file.name || "");
    const maxFileSize = 5 * 1024 * 1024;

    if (!isPngByType && !isPngByName) {
      window.alert("A imagem de destaque deve ser PNG.");
      event.target.value = "";
      return;
    }

    if (file.size > maxFileSize) {
      window.alert("A imagem de destaque deve ter no maximo 5MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormState((currentState) => ({
        ...currentState,
        imageDestaqueFile: file,
        imageDestaquePreview: typeof reader.result === "string" ? reader.result : "",
      }));
    };

    reader.readAsDataURL(file);
  }

  function handleFeaturedOrderSelect(position) {
    if (position < 1 || position > 6) {
      return;
    }

    if (occupiedFeaturedPositions.has(position)) {
      return;
    }

    setFormState((currentState) => ({
      ...currentState,
      ordem_destaque: String(position),
    }));
  }

  async function handleModalSubmit(event) {
    event.preventDefault();

    if (!formState.categoriaId) {
      window.alert("Selecione um grupo para continuar.");
      return;
    }

    if (formState.em_destaque) {
      const destaquePath = String(formState.imagem_destaque_url || "").trim();
      const destaqueOrder = Number(formState.ordem_destaque);
      const hasUploadedFeaturedFile = Boolean(formState.imageDestaqueFile);

      if (!hasUploadedFeaturedFile && !destaquePath) {
        window.alert("Envie uma imagem PNG para o destaque.");
        return;
      }

      if (hasUploadedFeaturedFile) {
        const file = formState.imageDestaqueFile;
        const isPngByType = file.type === "image/png";
        const isPngByName = /\.png$/i.test(file.name || "");

        if (!isPngByType && !isPngByName) {
          window.alert("A imagem de destaque deve ser um arquivo PNG sem fundo.");
          return;
        }
      } else if (!/\.png($|\?)/i.test(destaquePath)) {
        window.alert("A imagem de destaque deve ser um arquivo PNG sem fundo.");
        return;
      }

      if (!Number.isInteger(destaqueOrder) || destaqueOrder < 1 || destaqueOrder > 6) {
        window.alert("Selecione uma posicao valida no grid (1 a 6).");
        return;
      }

      if (occupiedFeaturedPositions.has(destaqueOrder)) {
        window.alert("Essa posicao de destaque ja esta ocupada por outro item.");
        return;
      }
    }

    setIsSavingProduct(true);

    try {
      const payload = {
        nome: formState.nome,
        descricao: formState.descricao,
        preco: formState.preco,
        categoriaId: formState.categoriaId,
        status: formState.status,
        emDestaque: Boolean(formState.em_destaque),
        ordemDestaque:
          formState.em_destaque && formState.ordem_destaque !== ""
            ? Number(formState.ordem_destaque)
            : null,
        imageDestaqueFile: formState.imageDestaqueFile,
        image_path: formState.image_path,
        imageFile: formState.imageFile,
      };

      const savedSuccessfully =
        modalMode === "create"
          ? await onCreateProduct(payload)
          : await onUpdateProduct(editingProductId, payload);

      if (savedSuccessfully) {
        setIsModalOpen(false);
        toast.success(modalMode === "create" ? "Produto criado com sucesso!" : "Produto atualizado com sucesso!");
      } else {
        toast.error("Erro ao salvar o produto. Tente novamente.");
      }
    } catch (error) {
      toast.error(`Erro: ${error.message || "Não foi possível salvar o produto."}`);
    } finally {
      setIsSavingProduct(false);
    }
  }

  return (
    <>
      <div className="cardapio-admin-v2-home">
        <header className="cardapio-admin-v2-header">
          <div>
            <h1>Painel do Cardápio</h1>
            <p>Organize seu cardápio por categorias.</p>
          </div>

          <div className="cardapio-admin-v2-header-actions">
            <label className="cardapio-admin-v2-search">
              <Search size={18} />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => onSearchTermChange(event.target.value)}
                placeholder="Buscar item..."
              />
            </label>

            <button
              type="button"
              className="cardapio-admin-v2-create"
              onClick={() => openCreateModal(defaultCategoryId)}
              disabled={!groups.length}
            >
              <Plus size={18} />
              Novo Produto
            </button>
          </div>
        </header>

        {productsByGroup.length ? (
          <div className="cardapio-admin-v2-sections">
            {productsByGroup.map(({ group, products, Icon }) => (
              <section key={group.id} className="cardapio-admin-v2-section">
                <header className="cardapio-admin-v2-section-head">
                  <div className="cardapio-admin-v2-group-meta">
                    <div className="cardapio-admin-v2-group-icon">
                      <Icon size={18} />
                    </div>
                    <h3>{group.nome}</h3>
                    <span>{products.length} ITENS</span>
                  </div>

                  <button
                    type="button"
                    className="cardapio-admin-v2-manage"
                    onClick={() => navigate("/menu/admin/grupos")}
                  >
                    Gerenciar Grupo
                    <ChevronRight size={16} />
                  </button>
                </header>

                <div className="cardapio-admin-v2-row">
                  <AddProductCard
                    groupName={group.nome}
                    onCreateProduct={() => openCreateModal(group.id)}
                    disabled={!groups.length}
                  />

                  {products.slice(0, 8).map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isBusy={busyProductIds.includes(product.id)}
                      onToggleProductStatus={onToggleProductStatus}
                      onDeleteProduct={onDeleteProduct}
                      onEditProduct={openEditModal}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="cardapio-empty-state">
            <h3>Nenhum grupo encontrado</h3>
            <p>Cadastre um grupo para começar a organizar os produtos.</p>
          </div>
        )}

        <footer className="cardapio-admin-v2-footer">
          <p>Total: {allProducts.length} itens ativos</p>
          <button type="button" onClick={() => navigate("/menu/admin/horarios")}>Configurar horários</button>
        </footer>
      </div>

      <ProductModal
        isOpen={isModalOpen}
        mode={modalMode}
        groups={groups}
        formState={formState}
        occupiedFeaturedPositions={occupiedFeaturedPositions}
        isSaving={isSavingProduct}
        onClose={closeModal}
        onSubmit={handleModalSubmit}
        onChange={handleFormChange}
        onImageChange={handleImageChange}
        onFeaturedImageChange={handleFeaturedImageChange}
        onSelectFeaturedOrder={handleFeaturedOrderSelect}
      />
    </>
  );
}

export default CardapioAdminDashboardPage;
