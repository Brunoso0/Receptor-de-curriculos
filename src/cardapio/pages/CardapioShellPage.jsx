import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CardapioProductsShowcasePage from "./CardapioProductsShowcasePage";
import CardapioProductGrid from "../components/CardapioProductGrid";
import CardapioSidebar from "../components/CardapioSidebar";
import cardapioApi, { CARDAPIO_API_ROOT_URL } from "../services/cardapioApi";
import {
  addCardapioCartItem,
  clearCardapioCart,
  getCardapioCartItems,
  removeCardapioCartItem,
  updateCardapioCartItemQuantity,
} from "../services/cart";
import { clearCardapioSession, getCardapioSession } from "../services/session";
import "../styles/CardapioShell.css";

function resolveCategoryId(product) {
  return product?.categoria_id ?? product?.categoriaId ?? product?.grupo?.id ?? product?.grupoId ?? null;
}

function resolveAssetUrl(assetPath) {
  if (!assetPath) {
    return null;
  }

  if (String(assetPath).startsWith("http")) {
    return assetPath;
  }

  return `${CARDAPIO_API_ROOT_URL}${String(assetPath).startsWith("/") ? "" : "/"}${assetPath}`;
}

function resolveProductImage(product) {
  return resolveAssetUrl(
    product?.image_path ||
      product?.imagem ||
      product?.image ||
      product?.capa_imagem ||
      product?.capaImagem ||
      null
  );
}

function resolveGroupVerticalImage(group) {
  return resolveAssetUrl(
    group?.imagemVertical ||
      group?.imagem_vertical ||
      group?.imageVertical ||
      group?.image_vertical ||
      group?.verticalImage ||
      group?.capaVertical ||
      group?.capa_vertical ||
      group?.coverVertical ||
      group?.cover_vertical ||
      null
  );
}

function resolveGroupHorizontalImage(group) {
  return resolveAssetUrl(
    group?.imagemHorizontal ||
      group?.imagem_horizontal ||
      group?.imageHorizontal ||
      group?.image_horizontal ||
      group?.horizontalImage ||
      group?.capaHorizontal ||
      group?.capa_horizontal ||
      group?.coverHorizontal ||
      group?.cover_horizontal ||
      null
  );
}

function resolveProductVideo(product) {
  return resolveAssetUrl(
    product?.video_url ||
      product?.videoUrl ||
      product?.video_path ||
      product?.videoPath ||
      product?.destaque_video_url ||
      product?.destaqueVideoUrl ||
      null
  );
}

function resolveGroupCoverStyle(imageUrl) {
  if (!imageUrl) {
    return undefined;
  }

  const sanitizedImageUrl = String(imageUrl).replace(/"/g, '\\"');
  return {
    "--cardapio-group-cover-image": `url("${sanitizedImageUrl}")`,
  };
}

function resolveProductTimestamp(product) {
  const value =
    product?.criadoEm ||
    product?.createdAt ||
    product?.created_at ||
    product?.dataCriacao ||
    product?.atualizadoEm ||
    product?.updatedAt ||
    0;

  const parsedDate = new Date(value).getTime();
  return Number.isNaN(parsedDate) ? 0 : parsedDate;
}

function formatCreatedAt(product) {
  const timestamp = resolveProductTimestamp(product);

  if (!timestamp) {
    return "Data indisponível";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(timestamp);
}

function CardapioShellPage({ variant }) {
  const { groupId: routeGroupId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState("novidades");
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(() => {
    if (typeof window === "undefined") {
      return true;
    }

    return window.innerWidth > 1080;
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartItems, setCartItems] = useState(() => getCardapioCartItems());
  const [isCartOpen, setIsCartOpen] = useState(false);
  const session = variant === "admin" ? getCardapioSession() : null;
  const isProductsRoute = variant !== "admin" && location.pathname === "/menu/produtos";

  useEffect(() => {
    if (variant === "admin") {
      return;
    }

    if (routeGroupId && routeGroupId !== "all" && routeGroupId !== "novidades") {
      setSelectedGroupId(routeGroupId);
      return;
    }

    if (location.pathname === "/menu/produtos") {
      setSelectedGroupId("products");
      return;
    }

    if (location.pathname === "/menu") {
      if (selectedGroupId === "products") {
        setSelectedGroupId("novidades");
        return;
      }

      if (selectedGroupId !== "all" && selectedGroupId !== "novidades") {
        setSelectedGroupId("all");
      }
    }
  }, [location.pathname, routeGroupId, selectedGroupId, variant]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    function syncCartFromStorage() {
      setCartItems(getCardapioCartItems());
    }

    window.addEventListener("storage", syncCartFromStorage);
    return () => window.removeEventListener("storage", syncCartFromStorage);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadCardapio() {
      setIsLoading(true);
      setError("");

      try {
        const [groupsResponse, productsResponse] = await Promise.all([
          cardapioApi.get("/categorias"),
          cardapioApi.get("/produtos"),
        ]);

        if (!isMounted) {
          return;
        }

        const loadedProducts = Array.isArray(productsResponse.data) ? productsResponse.data : [];
        const loadedGroups = Array.isArray(groupsResponse.data)
          ? groupsResponse.data.map((group) => ({
              ...group,
              count: loadedProducts.filter(
                (product) => String(resolveCategoryId(product)) === String(group.id)
              ).length,
            }))
          : [];

        setProducts(loadedProducts);
        setGroups(loadedGroups);
        setSelectedGroupId((currentValue) => {
          if (currentValue === "all" || currentValue === "novidades") {
            return currentValue;
          }

          const hasSelectedGroup = loadedGroups.some((group) => String(group.id) === String(currentValue));
          return hasSelectedGroup ? currentValue : "novidades";
        });
      } catch (requestError) {
        if (isMounted) {
          setError(requestError?.response?.data?.message || "Nao foi possivel carregar grupos e produtos.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadCardapio();

    return () => {
      isMounted = false;
    };
  }, []);

  const effectiveSelectedGroupId =
    variant !== "admin" && routeGroupId && routeGroupId !== "all" && routeGroupId !== "novidades"
      ? routeGroupId
      : selectedGroupId;

  const selectedGroup = useMemo(
    () => groups.find((group) => String(group.id) === String(effectiveSelectedGroupId)) || null,
    [effectiveSelectedGroupId, groups]
  );

  const sortedProductsByCreated = useMemo(() => {
    return [...products].sort((leftProduct, rightProduct) => {
      const leftDate = resolveProductTimestamp(leftProduct);
      const rightDate = resolveProductTimestamp(rightProduct);

      if (leftDate !== rightDate) {
        return rightDate - leftDate;
      }

      return Number(rightProduct?.id || 0) - Number(leftProduct?.id || 0);
    });
  }, [products]);

  const recentProducts = useMemo(() => sortedProductsByCreated.slice(0, 6), [sortedProductsByCreated]);

  const novidadesVideo = useMemo(() => {
    if (!sortedProductsByCreated.length) {
      return null;
    }

    const productWithVideo = sortedProductsByCreated.find((product) => resolveProductVideo(product));
    const referenceProduct = productWithVideo || sortedProductsByCreated[0];

    if (!referenceProduct) {
      return null;
    }

    return {
      src: resolveProductVideo(referenceProduct),
      poster: resolveProductImage(referenceProduct),
      title: referenceProduct?.nome || "Novidade na casa",
    };
  }, [sortedProductsByCreated]);

  const allGroupsSlides = useMemo(() => {
    if (!groups.length) {
      return [];
    }

    const chunks = [];

    for (let index = 0; index < groups.length; index += 3) {
      chunks.push(groups.slice(index, index + 3));
    }

    return chunks;
  }, [groups]);

  const filteredProducts = useMemo(() => {
    if (effectiveSelectedGroupId === "novidades") {
      return sortedProductsByCreated;
    }

    if (effectiveSelectedGroupId === "all") {
      return products;
    }

    return products.filter(
      (product) => String(resolveCategoryId(product)) === String(effectiveSelectedGroupId)
    );
  }, [effectiveSelectedGroupId, products, sortedProductsByCreated]);

  const shouldRenderNovidadesExperience = variant !== "admin" && selectedGroupId === "novidades";
  const shouldRenderGroupsExperience = variant !== "admin" && selectedGroupId === "all";
  const shouldRenderProductsExperience = isProductsRoute;
  const shouldRenderGroupProductsExperience =
    variant !== "admin" && !!routeGroupId && routeGroupId !== "all" && routeGroupId !== "novidades";
  const shouldUseFullBleed = shouldRenderProductsExperience || shouldRenderGroupProductsExperience;
  const sidebarSelectedItemId = shouldRenderProductsExperience ? "products" : effectiveSelectedGroupId;
  const groupRouteOriginPath = location.state?.fromPath;
  const groupRouteOriginSelection = location.state?.fromSelection;
  const cartCount = useMemo(
    () => cartItems.reduce((total, item) => total + Number(item.quantity || 0), 0),
    [cartItems]
  );

  function handleAddToCart(product) {
    const nextItems = addCardapioCartItem(product, 1);
    setCartItems(nextItems);
    setIsCartOpen(true);
  }

  function handleCartQuantityChange(productId, quantity) {
    setCartItems(updateCardapioCartItemQuantity(productId, quantity));
  }

  function handleRemoveCartItem(productId) {
    setCartItems(removeCardapioCartItem(productId));
  }

  function handleClearCart() {
    setCartItems(clearCardapioCart());
  }

  function handleSelectGroup(groupId) {
    if (variant === "admin") {
      setSelectedGroupId(groupId);
      return;
    }

    if (groupId === "products") {
      setSelectedGroupId("products");
      navigate("/menu/produtos");
      return;
    }

    if (groupId === "all" || groupId === "novidades") {
      setSelectedGroupId(groupId);
      navigate("/menu");
      return;
    }

    setSelectedGroupId(groupId);
    navigate(`/menu/grupo/${groupId}`, {
      state: {
        fromPath: location.pathname,
        fromSelection: selectedGroupId,
      },
    });
  }

  function handleGroupProductsBack() {
    if (groupRouteOriginPath === "/menu/produtos") {
      setSelectedGroupId("products");
      navigate("/menu/produtos");
      return;
    }

    if (groupRouteOriginPath === "/menu" && (groupRouteOriginSelection === "all" || groupRouteOriginSelection === "novidades")) {
      setSelectedGroupId(groupRouteOriginSelection);
      navigate("/menu");
      return;
    }

    setSelectedGroupId("all");
    navigate("/menu");
  }

  function renderGroupHighlight(group, image, orientationClassName) {
    if (!group) {
      return null;
    }

    const className = `cardapio-group-highlight ${orientationClassName}${image ? " has-cover-image" : ""}`;

    return (
      <button
        type="button"
        className={className}
        style={resolveGroupCoverStyle(image)}
        onClick={() => handleSelectGroup(group.id)}
        title={group.nome}
      >
        {image ? (
          <img src={image} alt={group.nome} />
        ) : (
          <div className="cardapio-group-highlight-placeholder">JR</div>
        )}
        <div className="cardapio-group-highlight-shade" />
      </button>
    );
  }

  function handleLogout() {
    clearCardapioSession();
    navigate("/menu/login", { replace: true });
  }

  return (
    <section className="cardapio-admin-layout">
      <CardapioSidebar
        groups={groups}
        onLogout={handleLogout}
        onSelectGroup={handleSelectGroup}
        selectedGroupId={sidebarSelectedItemId}
        session={session}
        variant={variant}
        isExpanded={isSidebarExpanded}
        onToggleExpand={() => setIsSidebarExpanded((currentValue) => !currentValue)}
      />

      <div className={`cardapio-admin-main ${isSidebarExpanded ? "expanded" : "collapsed"}`}>
        <div
          className={`cardapio-admin-center${shouldUseFullBleed ? " cardapio-admin-center-full" : ""}`}
        >
          <div
            className={`cardapio-shell-content${shouldUseFullBleed ? " cardapio-shell-content-full" : ""}`}
          >

            {variant === "admin" ? (
              <div className="cardapio-admin-hint">
                <strong>Proxima etapa:</strong>
                <span>
                  aqui entram os controles de cadastro, ordenacao e publicacao, sem mudar a base da renderizacao.
                </span>
              </div>
            ) : null}

            {isLoading ? <div className="cardapio-loading-state">Carregando cardapio...</div> : null}
            {!isLoading && error ? (
              <div className="cardapio-empty-state">
                <h3>Falha ao carregar</h3>
                <p>{error}</p>
              </div>
            ) : null}
            {!isLoading && !error ? (
              shouldRenderProductsExperience ? (
                <CardapioProductsShowcasePage
                  mode="products"
                  groups={groups}
                  products={sortedProductsByCreated}
                  cartCount={cartCount}
                  cartItems={cartItems}
                  isCartOpen={isCartOpen}
                  onOpenCart={() => setIsCartOpen(true)}
                  onCloseCart={() => setIsCartOpen(false)}
                  onAddToCart={handleAddToCart}
                  onUpdateCartQuantity={handleCartQuantityChange}
                  onRemoveCartItem={handleRemoveCartItem}
                  onClearCart={handleClearCart}
                  onSelectGroup={handleSelectGroup}
                />
              ) : shouldRenderGroupProductsExperience ? (
                <CardapioProductsShowcasePage
                  mode="group"
                  isEmbedded
                  group={selectedGroup}
                  products={filteredProducts}
                  cartCount={cartCount}
                  cartItems={cartItems}
                  isCartOpen={isCartOpen}
                  onOpenCart={() => setIsCartOpen(true)}
                  onCloseCart={() => setIsCartOpen(false)}
                  onAddToCart={handleAddToCart}
                  onUpdateCartQuantity={handleCartQuantityChange}
                  onRemoveCartItem={handleRemoveCartItem}
                  onClearCart={handleClearCart}
                  onBack={handleGroupProductsBack}
                />
              ) : shouldRenderNovidadesExperience ? (
                <section className="cardapio-novidades-view">
                  <article className="cardapio-novidades-hero">
                    <div className="cardapio-novidades-hero-media">
                      {novidadesVideo?.src ? (
                        <video
                          className="cardapio-novidades-video"
                          src={novidadesVideo.src}
                          poster={novidadesVideo.poster || undefined}
                          muted
                          loop
                          autoPlay
                          playsInline
                          preload="metadata"
                        />
                      ) : (
                        <div
                          className="cardapio-novidades-hero-fallback"
                          style={
                            novidadesVideo?.poster
                              ? { backgroundImage: `url(${novidadesVideo.poster})` }
                              : undefined
                          }
                        />
                      )}

                      <div className="cardapio-novidades-hero-shade" />

                      <div className="cardapio-novidades-feature-card">
                        <strong>NOVIDADE</strong>
                        <h3>NA CASA</h3>
                        <p>Uma experiência criada para marcar o momento.</p>
                      </div>

                      <div className="cardapio-novidades-play-badge" aria-hidden="true">
                        <span>▶</span>
                      </div>
                    </div>
                  </article>

                  <header className="cardapio-novidades-list-header">
                    <div>
                      <h3>Adicionados recentemente</h3>
                      <p>Veja nossos ultimos lançamentos.</p>
                    </div>
                  </header>

                  {recentProducts.length ? (
                    <div className="cardapio-novidades-grid">
                      {recentProducts.map((product) => {
                        const productImage = resolveProductImage(product);

                        return (
                          <article key={product.id} className="cardapio-novidades-card">
                            <div className="cardapio-novidades-card-media">
                              {productImage ? (
                                <img src={productImage} alt={product.nome} />
                              ) : (
                                <div className="cardapio-novidades-card-placeholder">JR</div>
                              )}
                            </div>

                            <div className="cardapio-novidades-card-body">
                              <strong>{product.nome}</strong>
                              <small>Criado em {formatCreatedAt(product)}</small>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="cardapio-empty-state">
                      <h3>Nenhuma novidade disponível</h3>
                      <p>Assim que novos itens forem cadastrados, eles aparecerão aqui.</p>
                    </div>
                  )}
                </section>
              ) : shouldRenderGroupsExperience ? (
                <section className="cardapio-groups-showcase">
                  {allGroupsSlides.length ? (
                    <div className="cardapio-groups-showcase-track" role="region" aria-label="Carrossel de grupos">
                      {allGroupsSlides.map((groupsSlide, slideIndex) => {
                        const [verticalGroup, horizontalTopGroup, horizontalBottomGroup] = groupsSlide;
                        const verticalImage =
                          resolveGroupVerticalImage(verticalGroup) || resolveGroupHorizontalImage(verticalGroup);
                        const topImage =
                          resolveGroupHorizontalImage(horizontalTopGroup) ||
                          resolveGroupVerticalImage(horizontalTopGroup);
                        const bottomImage =
                          resolveGroupHorizontalImage(horizontalBottomGroup) ||
                          resolveGroupVerticalImage(horizontalBottomGroup);

                        return (
                          <article
                            key={`group-slide-${slideIndex}`}
                            className="cardapio-groups-showcase-slide"
                          >
                            {renderGroupHighlight(verticalGroup, verticalImage, "cardapio-group-highlight-vertical")}
                            {renderGroupHighlight(horizontalTopGroup, topImage, "cardapio-group-highlight-horizontal")}
                            {renderGroupHighlight(horizontalBottomGroup, bottomImage, "cardapio-group-highlight-horizontal")}
                          </article>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="cardapio-empty-state">
                      <h3>Nenhum grupo disponível</h3>
                      <p>Assim que os grupos forem cadastrados, eles serão exibidos aqui.</p>
                    </div>
                  )}
                </section>
              ) : (
                <CardapioProductGrid
                  products={filteredProducts}
                  selectedGroupName={selectedGroup?.nome}
                  variant={variant}
                />
              )
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CardapioShellPage;