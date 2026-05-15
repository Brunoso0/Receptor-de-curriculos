import React from "react";
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

function CardapioProductGrid({ products, variant, selectedGroupName }) {
  if (!products.length) {
    return (
      <div className="cardapio-empty-state">
        <h3>Nenhum produto encontrado</h3>
        <p>
          {selectedGroupName
            ? `Ainda nao existem itens cadastrados em ${selectedGroupName}.`
            : "Nao ha produtos disponiveis no momento."}
        </p>
      </div>
    );
  }

  return (
    <div className="cardapio-products-grid">
      {products.map((product) => (
        <article key={product.id} className="cardapio-product-card">
          <div className="cardapio-product-media">
            {resolveImage(product) ? (
              <img src={resolveImage(product)} alt={product.nome} />
            ) : (
              <div className="cardapio-product-placeholder">JR</div>
            )}
            <span className="cardapio-product-badge">
              {variant === "admin" ? "Publicado" : "Disponivel"}
            </span>
          </div>

          <div className="cardapio-product-content">
            <div className="cardapio-product-heading">
              <h3>{product.nome}</h3>
              <strong>{formatPrice(product.preco)}</strong>
            </div>
            <p>{product.descricao || "Sem descricao cadastrada."}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

export default CardapioProductGrid;