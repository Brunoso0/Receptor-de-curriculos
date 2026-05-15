import React, { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CARDAPIO_API_ROOT_URL } from "../services/cardapioApi";

function formatPrice(price) {
  const numericValue = Number(price || 0);
  return numericValue.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
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

function CarouselCard({ product }) {
  const image = resolveImage(product);
  return (
    <div className="cardapio-carousel-card">
      <div className="cardapio-carousel-card-media">
        {image ? (
          <img src={image} alt={product.nome} />
        ) : (
          <div className="cardapio-carousel-card-placeholder">JR</div>
        )}
      </div>
      <div className="cardapio-carousel-card-info">
        <div className="cardapio-carousel-card-text">
          <h3>{product.nome}</h3>
          <p>{product.descricao || "Sem descricao cadastrada."}</p>
        </div>
        <span className="cardapio-carousel-card-price">{formatPrice(product.preco)}</span>
      </div>
    </div>
  );
}

function CardapioProductCarousel({ products, groupName, onClose }) {
  const viewportRef = useRef(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(products.length > 1);
  const count = products.length;

  const updateScrollState = useCallback(() => {
    const viewportElement = viewportRef.current;

    if (!viewportElement) {
      setCanScrollPrev(false);
      setCanScrollNext(false);
      return;
    }

    const maxScrollLeft = viewportElement.scrollWidth - viewportElement.clientWidth;
    setCanScrollPrev(viewportElement.scrollLeft > 4);
    setCanScrollNext(viewportElement.scrollLeft < maxScrollLeft - 4);
  }, []);

  const scrollByStep = useCallback((direction) => {
    const viewportElement = viewportRef.current;

    if (!viewportElement) {
      return;
    }

    const step = Math.max(viewportElement.clientWidth * 0.7, 240);
    viewportElement.scrollBy({
      left: step * direction,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    const viewportElement = viewportRef.current;
    if (!viewportElement) {
      return undefined;
    }

    viewportElement.scrollLeft = 0;
    updateScrollState();

    function handleResize() {
      updateScrollState();
    }

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [products, updateScrollState]);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      } else if (event.key === "ArrowLeft" && count > 1) {
        scrollByStep(-1);
      } else if (event.key === "ArrowRight" && count > 1) {
        scrollByStep(1);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [count, onClose, scrollByStep]);

  if (!count) {
    return (
      <section className="cardapio-carousel-panel">
        <div className="cardapio-carousel-header">
          <span className="cardapio-carousel-title">{groupName}</span>
          <button type="button" className="cardapio-carousel-close" onClick={onClose}>
            Voltar
          </button>
        </div>
        <div className="cardapio-carousel-empty">
          <h3>Nenhum produto encontrado</h3>
          <p>Ainda não existem itens cadastrados neste grupo.</p>
        </div>
      </section>
    );
  }

  function goPrev() {
    if (count <= 1 || !canScrollPrev) {
      return;
    }

    scrollByStep(-1);
  }

  function goNext() {
    if (count <= 1 || !canScrollNext) {
      return;
    }

    scrollByStep(1);
  }

  function handleWheel(event) {
    const viewportElement = viewportRef.current;

    if (!viewportElement) {
      return;
    }

    if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
      viewportElement.scrollLeft += event.deltaY;
      event.preventDefault();
    }
  }

  return (
    <section className="cardapio-carousel-panel">
      <div className="cardapio-carousel-header">
        <span className="cardapio-carousel-title">{groupName}</span>
        <button type="button" className="cardapio-carousel-close" onClick={onClose}>
          Voltar
        </button>
      </div>

      <div className="cardapio-carousel-body">
        <div
          ref={viewportRef}
          className="cardapio-carousel-viewport"
          onScroll={updateScrollState}
          onWheel={handleWheel}
        >
          {products.map((product) => (
            <article key={product.id} className="cardapio-carousel-slide">
              <CarouselCard product={product} />
            </article>
          ))}
        </div>

        <button
          type="button"
          className="cardapio-carousel-nav-btn cardapio-carousel-nav-prev"
          onClick={goPrev}
          aria-label="Produto anterior"
          disabled={count <= 1 || !canScrollPrev}
        >
          <ChevronLeft size={22} strokeWidth={2.8} aria-hidden="true" />
        </button>

        <button
          type="button"
          className="cardapio-carousel-nav-btn cardapio-carousel-nav-next"
          onClick={goNext}
          aria-label="Próximo produto"
          disabled={count <= 1 || !canScrollNext}
        >
          <ChevronRight size={22} strokeWidth={2.8} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}

export default CardapioProductCarousel;
