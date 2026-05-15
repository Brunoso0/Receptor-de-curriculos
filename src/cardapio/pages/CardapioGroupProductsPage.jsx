import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import cardapioApi, { CARDAPIO_API_ROOT_URL } from "../services/cardapioApi";
import "../styles/CardapioGroupProducts.css";

/* ─── helpers ──────────────────────────────────────────── */

function formatPrice(price) {
  return Number(price || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

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

function resolveCategoryId(product) {
  return (
    product?.categoria_id ??
    product?.categoriaId ??
    product?.grupo?.id ??
    product?.grupoId ??
    null
  );
}

/* ─── ProductCard ───────────────────────────────────────── */

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

/* ─── Page ──────────────────────────────────────────────── */

function CardapioGroupProductsPage({
  groupId: externalGroupId,
  group: externalGroup,
  products: externalProducts,
  isEmbedded = false,
  onBack,
}) {
  const { groupId: routeGroupId } = useParams();
  const navigate = useNavigate();
  const currentGroupId = externalGroupId ?? routeGroupId;
  const hasExternalData = Array.isArray(externalProducts);

  const [group, setGroup] = useState(externalGroup ?? null);
  const [products, setProducts] = useState(externalProducts ?? []);
  const [isLoading, setIsLoading] = useState(!hasExternalData);
  const [error, setError] = useState("");
  const [viewportWidth, setViewportWidth] = useState(1280);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const viewportRef = useRef(null);

  const handleBack = useCallback(() => {
    if (typeof onBack === "function") {
      onBack();
      return;
    }

    navigate(-1);
  }, [navigate, onBack]);

  useEffect(() => {
    if (!hasExternalData) {
      return;
    }

    setGroup(externalGroup ?? null);
    setProducts(externalProducts ?? []);
    setIsLoading(false);
    setError("");
  }, [externalGroup, externalProducts, hasExternalData]);

  /* fetch */
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

  useEffect(() => {
    const stageElement = viewportRef.current;

    function measureStageWidth() {
      const currentWidth = viewportRef.current?.getBoundingClientRect().width;
      setViewportWidth(Math.round(currentWidth || window.innerWidth || 1280));
    }

    measureStageWidth();

    if (stageElement && typeof ResizeObserver !== "undefined") {
      const resizeObserver = new ResizeObserver(() => {
        measureStageWidth();
      });

      resizeObserver.observe(stageElement);
      return () => resizeObserver.disconnect();
    }

    window.addEventListener("resize", measureStageWidth);
    return () => window.removeEventListener("resize", measureStageWidth);
  }, []);

  const gap = useMemo(() => {
    if (viewportWidth <= 640) {
      return 10;
    }

    if (viewportWidth <= 1024) {
      return 12;
    }

    return 16;
  }, [viewportWidth]);

  const cardWidth = useMemo(() => {
    const availableWidth = viewportWidth - gap * 2;

    // Divisor targets N simultaneously visible cards (+ partial hint of the next)
    if (viewportWidth <= 640) {
      return Math.max(120, Math.round(availableWidth / 2.2));
    }

    if (viewportWidth <= 1024) {
      return Math.max(150, Math.round(availableWidth / 4.2));
    }

    return Math.max(180, Math.round(availableWidth / 5.2));
  }, [gap, viewportWidth]);

  const scrollStep = useMemo(() => cardWidth + gap, [cardWidth, gap]);

  const updateScrollState = useCallback(() => {
    const viewportElement = viewportRef.current;

    if (!viewportElement) {
      setCanPrev(false);
      setCanNext(false);
      return;
    }

    const maxScrollLeft = viewportElement.scrollWidth - viewportElement.clientWidth;
    setCanPrev(viewportElement.scrollLeft > 4);
    setCanNext(viewportElement.scrollLeft < maxScrollLeft - 4);
  }, []);

  useEffect(() => {
    updateScrollState();
  }, [products, cardWidth, gap, updateScrollState]);

  const goPrev = useCallback(() => {
    const viewportElement = viewportRef.current;
    if (!viewportElement) {
      return;
    }

    viewportElement.scrollBy({
      left: -(scrollStep * 1.02),
      behavior: "smooth",
    });
  }, [scrollStep]);

  const goNext = useCallback(() => {
    const viewportElement = viewportRef.current;
    if (!viewportElement) {
      return;
    }

    viewportElement.scrollBy({
      left: scrollStep * 1.02,
      behavior: "smooth",
    });
  }, [scrollStep]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "ArrowLeft") {
        goPrev();
      }

      if (e.key === "ArrowRight") {
        goNext();
      }

      if (e.key === "Escape") handleBack();
    }

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [goNext, goPrev, handleBack]);

  const handleWheel = useCallback(
    (event) => {
      const viewportElement = viewportRef.current;
      if (!viewportElement) {
        return;
      }

      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
        return;
      }

      viewportElement.scrollLeft += event.deltaY;
      event.preventDefault();
    },
    []
  );

  /* ─── render ─────────────────────────────────────────── */

  const activeProduct = products[0] || null;
  const groupImage = resolveImage(activeProduct) || (group ? resolveImage(group) : null);
  const rootStyle = {
    "--cgp-card-width": `${cardWidth}px`,
    "--cgp-gap": `${gap}px`,
    ...(groupImage ? { "--cgp-hero-image": `url("${groupImage}")` } : {}),
  };

  return (
    <div className={`cgp-root${isEmbedded ? " cgp-root-embedded" : ""}`} style={rootStyle}>
      <div className="cgp-hero-bg" aria-hidden="true" />

      <main className="cgp-main">
        {isLoading ? (
          <div className="cgp-state">
            <p>Carregando produtos...</p>
          </div>
        ) : error ? (
          <div className="cgp-state">
            <h3>Falha ao carregar</h3>
            <p>{error}</p>
          </div>
        ) : !products.length ? (
          <div className="cgp-state">
            <h3>Nenhum produto encontrado</h3>
            <p>Ainda não existem itens cadastrados neste grupo.</p>
          </div>
        ) : (
          <section className="cgp-carousel-shell" aria-label="Carrossel de produtos">
            <button
              type="button"
              className="cgp-nav-btn cgp-nav-prev"
              onClick={goPrev}
              disabled={!canPrev}
              aria-label="Produto anterior"
            >
              <ChevronLeft size={24} strokeWidth={2.8} />
            </button>

            <div ref={viewportRef} className="cgp-stage" onWheel={handleWheel} onScroll={updateScrollState}>
              <div
                className="cgp-track"
              >
                {products.map((product) => (
                  <article
                    key={product.id}
                    className="cgp-slide"
                  >
                    <ProductCard product={product} />
                  </article>
                ))}
              </div>
              <div className="cgp-stage-right-blur" aria-hidden="true" />
            </div>

            <button
              type="button"
              className="cgp-nav-btn cgp-nav-next"
              onClick={goNext}
              disabled={!canNext}
              aria-label="Próximo produto"
            >
              <ChevronRight size={24} strokeWidth={2.8} />
            </button>
          </section>
        )}
      </main>
    </div>
  );
}

export default CardapioGroupProductsPage;
