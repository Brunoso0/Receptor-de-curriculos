import React, { useEffect, useMemo, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CardapioSidebar from "../components/CardapioSidebar";
import cardapioApi from "../services/cardapioApi";
import { clearCardapioSession, getCardapioSession } from "../services/session";
import "../styles/CardapioShell.css";

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

function toNullableNumber(value) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : null;
}

function toBoolean(value) {
  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }

  return Boolean(value);
}

function isFileUpload(value) {
  return typeof File !== "undefined" && value instanceof File;
}

function getRequestErrorMessage(error, fallbackMessage) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallbackMessage
  );
}

function matchesSearch(product, searchTerm) {
  if (!searchTerm.trim()) {
    return true;
  }

  const haystack = [product?.nome, product?.descricao, product?.grupo?.nome]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(searchTerm.trim().toLowerCase());
}

function CardapioAdminLayoutPage() {
  const navigate = useNavigate();
  const session = getCardapioSession();
  const authHeaders = useMemo(
    () => (session?.token ? { Authorization: `Bearer ${session.token}` } : {}),
    [session?.token]
  );

  const [groups, setGroups] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(() => {
    if (typeof window === "undefined") {
      return true;
    }

    return window.innerWidth > 1080;
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyProductIds, setBusyProductIds] = useState([]);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setIsLoading(true);
      setError("");

      try {
        const groupsPromise = cardapioApi.get("/categorias");
        const productsPromise = cardapioApi
          .get("/admin/produtos", { headers: authHeaders })
          .catch(() => cardapioApi.get("/produtos"));

        const [groupsResponse, productsResponse] = await Promise.all([groupsPromise, productsPromise]);

        if (!isMounted) {
          return;
        }

        const loadedGroups = Array.isArray(groupsResponse.data) ? groupsResponse.data : [];
        const loadedProducts = Array.isArray(productsResponse.data) ? productsResponse.data : [];

        setGroups(loadedGroups);
        setProducts(loadedProducts);
        setSelectedGroupId((currentValue) => {
          if (currentValue === "all") {
            return "all";
          }

          const hasSelectedGroup = loadedGroups.some((group) => isSameId(group.id, currentValue));
          return hasSelectedGroup ? currentValue : "all";
        });
      } catch (requestError) {
        if (isMounted) {
          setError(requestError?.response?.data?.message || "Nao foi possivel carregar os dados do cardapio.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [authHeaders]);

  const groupsWithCount = useMemo(
    () =>
      groups.map((group) => ({
        ...group,
        count: products.filter((product) => isSameId(resolveCategoryId(product), group.id)).length,
      })),
    [groups, products]
  );

  const visibleProducts = useMemo(() => {
    return products.filter((product) => {
      const categoryId = resolveCategoryId(product);
      const respectsGroup = selectedGroupId === "all" ? true : isSameId(categoryId, selectedGroupId);
      const respectsSearch = matchesSearch(product, searchTerm);
      return respectsGroup && respectsSearch;
    });
  }, [products, searchTerm, selectedGroupId]);

  const selectedGroup = useMemo(
    () => groupsWithCount.find((group) => isSameId(group.id, selectedGroupId)) || null,
    [groupsWithCount, selectedGroupId]
  );

  function toggleBusy(productId, isBusy) {
    setBusyProductIds((currentBusyIds) => {
      if (isBusy) {
        if (currentBusyIds.includes(productId)) {
          return currentBusyIds;
        }

        return [...currentBusyIds, productId];
      }

      return currentBusyIds.filter((id) => id !== productId);
    });
  }

  async function handleToggleProductStatus(product) {
    const nextStatus = resolveStatus(product) === "ativo" ? "inativo" : "ativo";

    try {
      toggleBusy(product.id, true);

      await cardapioApi.put(
        `/produtos/${product.id}`,
        {
          status: nextStatus,
          nomeUsuario: session?.nome,
          usuarioRhId: session?.id,
        },
        { headers: authHeaders }
      );

      setProducts((currentProducts) =>
        currentProducts.map((currentProduct) =>
          currentProduct.id === product.id ? { ...currentProduct, status: nextStatus } : currentProduct
        )
      );
      toast.success(`Produto ${nextStatus === "ativo" ? "ativado" : "pausado"} com sucesso!`);
    } catch (requestError) {
      const errorMsg = getRequestErrorMessage(requestError, "Não foi possível atualizar o status do produto.");
      toast.error(errorMsg);
    } finally {
      toggleBusy(product.id, false);
    }
  }

  async function handleDeleteProduct(product) {
    try {
      toggleBusy(product.id, true);
      await cardapioApi.delete(`/produtos/${product.id}`, { headers: authHeaders });
      setProducts((currentProducts) =>
        currentProducts.filter((currentProduct) => currentProduct.id !== product.id)
      );
      toast.success("Produto excluído com sucesso!");
    } catch (requestError) {
      const errorMsg = getRequestErrorMessage(requestError, "Não foi possível excluir o produto.");
      toast.error(errorMsg);
    } finally {
      toggleBusy(product.id, false);
    }
  }

  async function handleCreateProduct(payload) {
    const categoryId = toNullableNumber(payload?.categoriaId);
    const ordemDestaque = toNullableNumber(payload?.ordemDestaque ?? payload?.ordem_destaque);
    const emDestaque = toBoolean(payload?.emDestaque ?? payload?.em_destaque);

    if (!categoryId) {
      window.alert("Selecione um grupo valido para o novo produto.");
      return false;
    }

    const hasMainImageUpload = isFileUpload(payload?.imageFile);
    const hasFeaturedImageUpload = isFileUpload(payload?.imageDestaqueFile);
    const hasImageUpload = hasMainImageUpload || hasFeaturedImageUpload;
    let requestPayload;
    let fallbackImagePath = null;

    if (hasImageUpload) {
      const formData = new FormData();
      formData.append("categoriaId", String(categoryId));
      formData.append("nome", payload?.nome || "");
      formData.append("descricao", payload?.descricao || "");
      formData.append("preco", String(Number(payload?.preco || 0)));
      formData.append("status", resolveStatus({ status: payload?.status }));
      formData.append("emDestaque", String(emDestaque));

      if (ordemDestaque !== null) {
        formData.append("ordemDestaque", String(ordemDestaque));
      }

      if (session?.nome) {
        formData.append("nomeUsuario", session.nome);
      }

      if (session?.id !== undefined && session?.id !== null) {
        formData.append("usuarioRhId", String(session.id));
      }

      if (payload?.image_path) {
        formData.append("image_path", payload.image_path);
      }

      if (hasMainImageUpload) {
        formData.append("imagem", payload.imageFile);
      }

      if (hasFeaturedImageUpload) {
        formData.append("imagemDestaque", payload.imageDestaqueFile);
      }

      requestPayload = formData;
    } else {
      fallbackImagePath = payload?.image_path || null;
      requestPayload = {
        categoriaId: categoryId,
        nome: payload?.nome,
        descricao: payload?.descricao,
        preco: Number(payload?.preco || 0),
        status: resolveStatus({ status: payload?.status }),
        emDestaque: emDestaque,
        ordemDestaque: ordemDestaque,
        image_path: fallbackImagePath,
        nomeUsuario: session?.nome,
        usuarioRhId: session?.id,
      };
    }

    try {
      const response = await cardapioApi.post("/produtos", requestPayload, { headers: authHeaders });
      const createdProduct = response?.data || {};

      const normalizedCreatedProduct = {
        ...createdProduct,
        id: createdProduct?.id || Date.now(),
        nome: createdProduct?.nome || requestPayload.nome,
        descricao: createdProduct?.descricao || requestPayload.descricao,
        preco: createdProduct?.preco ?? requestPayload.preco,
        status: createdProduct?.status || requestPayload.status,
        categoria_id:
          createdProduct?.categoria_id ?? createdProduct?.categoriaId ?? requestPayload.categoriaId,
        em_destaque:
          createdProduct?.em_destaque ?? createdProduct?.emDestaque ?? requestPayload.emDestaque ?? false,
        imagem_destaque_url:
          createdProduct?.imagem_destaque_url ??
          createdProduct?.imagemDestaqueUrl ??
          null,
        ordem_destaque:
          createdProduct?.ordem_destaque ??
          createdProduct?.ordemDestaque ??
          requestPayload.ordemDestaque ??
          null,
        image_path:
          createdProduct?.image_path ??
          createdProduct?.imagem ??
          createdProduct?.image ??
          fallbackImagePath,
      };

      setProducts((currentProducts) => [normalizedCreatedProduct, ...currentProducts]);
      toast.success("Produto criado com sucesso!");
      return true;
    } catch (requestError) {
      const errorMsg = getRequestErrorMessage(requestError, "Não foi possível criar o produto.");
      toast.error(errorMsg);
      return false;
    }
  }

  async function handleUpdateProduct(productId, payload) {
    const hasMainImageUpload = isFileUpload(payload?.imageFile);
    const hasFeaturedImageUpload = isFileUpload(payload?.imageDestaqueFile);
    const hasImageUpload = hasMainImageUpload || hasFeaturedImageUpload;
    const categoryId = toNullableNumber(payload?.categoriaId);
    const ordemDestaque = toNullableNumber(payload?.ordemDestaque ?? payload?.ordem_destaque);
    const emDestaque = toBoolean(payload?.emDestaque ?? payload?.em_destaque);
    const jsonPayload = {
      nome: payload?.nome,
      descricao: payload?.descricao,
      preco: Number(payload?.preco || 0),
      status: resolveStatus({ status: payload?.status }),
      emDestaque: emDestaque,
      ordemDestaque: emDestaque ? ordemDestaque : null,
      nomeUsuario: session?.nome,
      usuarioRhId: session?.id,
    };

    if (categoryId) {
      jsonPayload.categoriaId = categoryId;
    }

    if (payload?.image_path !== undefined) {
      jsonPayload.image_path = payload.image_path || null;
      jsonPayload.imagem = payload.image_path || null;
    }

    let requestPayload;

    if (hasImageUpload) {
      const formData = new FormData();
      formData.append("nome", jsonPayload.nome || "");
      formData.append("descricao", jsonPayload.descricao || "");
      formData.append("preco", String(jsonPayload.preco));
      formData.append("status", jsonPayload.status || "ativo");
      formData.append("emDestaque", String(jsonPayload.emDestaque));

      if (jsonPayload.ordemDestaque !== null && jsonPayload.ordemDestaque !== undefined) {
        formData.append("ordemDestaque", String(jsonPayload.ordemDestaque));
      }

      if (jsonPayload.nomeUsuario) {
        formData.append("nomeUsuario", jsonPayload.nomeUsuario);
      }

      if (jsonPayload.usuarioRhId !== undefined && jsonPayload.usuarioRhId !== null) {
        formData.append("usuarioRhId", String(jsonPayload.usuarioRhId));
      }

      if (jsonPayload.categoriaId) {
        formData.append("categoriaId", String(jsonPayload.categoriaId));
      }

      if (jsonPayload.image_path) {
        formData.append("image_path", jsonPayload.image_path);
        formData.append("imagem", jsonPayload.image_path);
      }

      if (hasMainImageUpload) {
        formData.append("imagem", payload.imageFile);
      }

      if (hasFeaturedImageUpload) {
        formData.append("imagemDestaque", payload.imageDestaqueFile);
      }

      requestPayload = formData;
    } else {
      requestPayload = jsonPayload;
    }

    try {
      let response;

      try {
        response = await cardapioApi.put(`/produtos/${productId}`, requestPayload, {
          headers: authHeaders,
        });
      } catch (requestError) {
        const errorMessage = getRequestErrorMessage(requestError, "").toLowerCase();
        const shouldRetryWithJson =
          hasImageUpload &&
          (requestError?.response?.status === 400 || errorMessage.includes("nenhum campo valido"));

        if (!shouldRetryWithJson) {
          throw requestError;
        }

        response = await cardapioApi.put(`/produtos/${productId}`, jsonPayload, {
          headers: authHeaders,
        });
      }

      const updatedProduct = response?.data || {};

      setProducts((currentProducts) =>
        currentProducts.map((currentProduct) => {
          if (currentProduct.id !== productId) {
            return currentProduct;
          }

          return {
            ...currentProduct,
            ...updatedProduct,
            nome: updatedProduct?.nome ?? requestPayload.nome,
            descricao: updatedProduct?.descricao ?? requestPayload.descricao,
            preco: updatedProduct?.preco ?? requestPayload.preco,
            status: updatedProduct?.status ?? requestPayload.status,
            categoria_id:
              updatedProduct?.categoria_id ??
              updatedProduct?.categoriaId ??
              jsonPayload?.categoriaId ??
              currentProduct?.categoria_id,
            em_destaque:
              updatedProduct?.em_destaque ??
              updatedProduct?.emDestaque ??
              jsonPayload?.emDestaque ??
              currentProduct?.em_destaque ??
              false,
            imagem_destaque_url:
              updatedProduct?.imagem_destaque_url ??
              updatedProduct?.imagemDestaqueUrl ??
              currentProduct?.imagem_destaque_url ??
              null,
            ordem_destaque:
              updatedProduct?.ordem_destaque ??
              updatedProduct?.ordemDestaque ??
              jsonPayload?.ordemDestaque ??
              currentProduct?.ordem_destaque ??
              null,
            image_path:
              updatedProduct?.image_path ??
              updatedProduct?.imagem ??
              updatedProduct?.image ??
              jsonPayload?.image_path ??
              currentProduct?.image_path ??
              null,
          };
        })
      );

      toast.success("Produto atualizado com sucesso!");
      return true;
    } catch (requestError) {
      const errorMsg = getRequestErrorMessage(requestError, "Não foi possível atualizar o produto.");
      toast.error(errorMsg);
      return false;
    }
  }

  async function handleCreateGroup(payload) {
    try {
      const formData = new FormData();
      formData.append("nome", payload.nome);
      formData.append("descricao", payload.descricao || "");
      formData.append("status", payload.status || "ativo");
      formData.append("icon", payload.icon || "Utensils");
      formData.append("nomeUsuario", session?.nome);
      formData.append("usuarioRhId", session?.id);

      if (payload.imagemVertical) {
        formData.append("imagem_vertical", payload.imagemVertical);
      }
      if (payload.imagemHorizontal) {
        formData.append("imagem_horizontal", payload.imagemHorizontal);
      }

      const response = await cardapioApi.post(
        "/categorias",
        formData,
        { headers: { ...authHeaders, "Content-Type": "multipart/form-data" } }
      );
      const created = response?.data || {};
      setGroups((current) => [
        ...current,
        {
          id: created.id || Date.now(),
          nome: created.nome || payload.nome,
          descricao: created.descricao || payload.descricao || "",
          status: created.status || payload.status || "ativo",
          icon: created.icon || payload.icon || "Utensils",
          imagemVertical: created.imagemVertical || null,
          imagemHorizontal: created.imagemHorizontal || null,
        },
      ]);
      toast.success("Grupo criado com sucesso!");
      return true;
    } catch (requestError) {
      const errorMsg = getRequestErrorMessage(requestError, "Não foi possível criar o grupo.");
      toast.error(errorMsg);
      return false;
    }
  }

  async function handleUpdateGroup(groupId, payload) {
    try {
      const formData = new FormData();
      formData.append("nome", payload.nome);
      formData.append("descricao", payload.descricao || "");
      formData.append("status", payload.status || "ativo");
      formData.append("icon", payload.icon || "Utensils");
      formData.append("nomeUsuario", session?.nome);
      formData.append("usuarioRhId", session?.id);

      if (payload.imagemVertical) {
        formData.append("imagem_vertical", payload.imagemVertical);
      }
      if (payload.imagemHorizontal) {
        formData.append("imagem_horizontal", payload.imagemHorizontal);
      }

      const response = await cardapioApi.put(
        `/categorias/${groupId}`,
        formData,
        { headers: { ...authHeaders, "Content-Type": "multipart/form-data" } }
      );
      const updated = response?.data || {};
      setGroups((current) =>
        current.map((group) =>
          String(group.id) === String(groupId)
            ? {
                ...group,
                ...updated,
                nome: updated.nome || payload.nome,
                descricao: updated.descricao ?? payload.descricao ?? group.descricao,
                status: updated.status || payload.status || group.status,
                icon: updated.icon ?? payload.icon ?? group.icon ?? "Utensils",
                imagemVertical: updated.imagemVertical ?? group.imagemVertical,
                imagemHorizontal: updated.imagemHorizontal ?? group.imagemHorizontal,
              }
            : group
        )
      );
      toast.success("Grupo atualizado com sucesso!");
      return true;
    } catch (requestError) {
      const errorMsg = getRequestErrorMessage(requestError, "Não foi possível atualizar o grupo.");
      toast.error(errorMsg);
      return false;
    }
  }

  async function handleDeleteGroup(groupId) {
    try {
      await cardapioApi.delete(`/categorias/${groupId}`, { headers: authHeaders });
      setGroups((current) => current.filter((group) => String(group.id) !== String(groupId)));
      toast.success("Grupo excluído com sucesso!");
      return true;
    } catch (requestError) {
      const errorMsg = getRequestErrorMessage(requestError, "Não foi possível excluir o grupo.");
      toast.error(errorMsg);
      return false;
    }
  }

  function handleLogout() {
    clearCardapioSession();
    navigate("/menu/login", { replace: true });
  }

  return (
    <section className="cardapio-admin-layout">
      <CardapioSidebar
        groups={groupsWithCount}
        selectedGroupId={selectedGroupId}
        onSelectGroup={setSelectedGroupId}
        session={session}
        variant="admin"
        isExpanded={isSidebarExpanded}
        onToggleExpand={() => setIsSidebarExpanded((currentValue) => !currentValue)}
        onLogout={handleLogout}
      />

      <div className={`cardapio-admin-main ${isSidebarExpanded ? "expanded" : "collapsed"}`}>
        <div className="cardapio-admin-center">
          {isLoading ? <div className="cardapio-loading-state">Carregando cardapio...</div> : null}
          {!isLoading && error ? (
            <div className="cardapio-empty-state">
              <h3>Falha ao carregar</h3>
              <p>{error}</p>
            </div>
          ) : null}
          {!isLoading && !error ? (
            <Outlet
              context={{
                groups: groupsWithCount,
                selectedGroup,
                selectedGroupId,
                visibleProducts,
                allProducts: products,
                searchTerm,
                onSearchTermChange: setSearchTerm,
                busyProductIds,
                onToggleProductStatus: handleToggleProductStatus,
                onDeleteProduct: handleDeleteProduct,
                onCreateProduct: handleCreateProduct,
                onUpdateProduct: handleUpdateProduct,
                onCreateGroup: handleCreateGroup,
                onUpdateGroup: handleUpdateGroup,
                onDeleteGroup: handleDeleteGroup,
              }}
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default CardapioAdminLayoutPage;