import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import '../styles/ProductOffers.css';
import api from '../services/api.js';

function buildImageCandidates(product) {
  const rawPath = String(
    product?.imagem_destaque_url ||
      product?.imagemDestaqueUrl ||
      product?.imagem_path ||
      product?.image_path ||
      product?.imagem ||
      product?.image ||
      product?.capa_imagem ||
      product?.capaImagem ||
      ''
  ).trim().replace(/\\/g, '/');

  const normalizedPath = rawPath.startsWith('/') ? rawPath : `/${rawPath}`;
  const apiBase = String(api?.defaults?.baseURL || '').replace(/\/+$/, '');

  if (!rawPath) {
    return ['/img/nda.png'];
  }

  if (rawPath.startsWith('http://') || rawPath.startsWith('https://')) {
    return [rawPath, '/img/nda.png'];
  }

  return [
    `${apiBase}${normalizedPath}`,
    `${apiBase}/api${normalizedPath}`,
    `${window.location.origin}${normalizedPath}`,
    '/img/nda.png',
  ];
}

function formatPrice(price) {
  return Number(price || 0).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatRating(rating) {
  return Number(rating || 0).toLocaleString('pt-BR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

function ProductOffers() {
  const [offers, setOffers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/produtos')
      .then((res) => {
        const source = Array.isArray(res.data) ? res.data : [];

        // Mostra os 6 últimos produtos postados (ordenação já vem do backend)
        setOffers(source.slice(0, 6));
      })
      .catch((err) => console.error('Erro ao buscar ofertas:', err));
  }, []);

  return (
    <section 
      className="product-offers product-offers-home"
      
    >
      {/* Cabeçalho */}
      <div className="header-content" style={{ textAlign: 'center', paddingTop: '0px', paddingBottom:'40px', backgroundColor: '#FFF' }}>
        <h2>Nossas Delícias</h2>
        <h4>Sinta o melhor</h4>
      </div>

      {/* Faixa Colorida (Usando a lógica do seu CSS/HTML que você gostou) */}
      <div className="colored-line" >
        <div className="flex" style={{ display: 'flex', height: '20px', width: '100%' }}>
          <div style={{ backgroundColor: '#004a33', flex: 1 }}></div>
          <div style={{ backgroundColor: '#cd3e4c', flex: 1 }}></div>
          <div style={{ backgroundColor: '#f9be3e', flex: 1 }}></div>
          <div style={{ backgroundColor: '#4d2f23', flex: 1 }}></div>
        </div>
      </div>

      <div className="container"
          style={{ 
            backgroundColor: '#f1e6d3', 
            backgroundImage: 'url("https://www.transparenttextures.com/patterns/p6-for-air.png")' 
          }}
      >
        <div className="grid offers-grid-home">
          {offers.map((offer) => {
            const ratingValue = Number(offer.media_avaliacoes || 0);
            const roundedRating = Math.max(0, Math.min(5, Math.round(ratingValue)));
            const imageCandidates = buildImageCandidates(offer);

            return (
              <article key={offer.id} className="offer-item-home">
                {/* Lado Esquerdo: Conteúdo */}
                <div className="offer-item-home-content">
                  <div>
                    <h3>{offer.nome}</h3>
                    
                    {/* Estrelas dinâmicas */}
                    <div className="offer-item-home-stars">
                      {[1, 2, 3, 4, 5].map((starIndex) => (
                        <Star
                          key={`${offer.id}-star-${starIndex}`}
                          size={12}
                          className={`offer-item-home-star ${starIndex <= roundedRating ? 'is-filled' : 'is-empty'}`}
                        />
                      ))}
                    </div>

                    <p>{offer.descricao || 'Produto selecionado entre os mais bem avaliados.'}</p>
                  </div>

                  <div className="offer-item-home-bottom">
                    <strong className="offer-item-home-price">R$ {formatPrice(offer.preco)}</strong>
                    <button
                      type="button"
                      className="offer-item-home-add-btn"
                      onClick={() => navigate('/menu')}
                    >
                      Adicionar na Sacola
                    </button>
                  </div>
                </div>

                {/* Lado Direito: Imagem */}
                <div className="offer-item-home-image-wrap">
                  <img
                    className="offer-item-home-image"
                    src={imageCandidates[0]}
                    data-fallback-index="0"
                    alt={offer.nome}
                    onError={(event) => {
                      const img = event.currentTarget;
                      const currentIndex = Number(img.dataset.fallbackIndex || '0');
                      const nextIndex = currentIndex + 1;
                      const nextCandidate = imageCandidates[nextIndex];

                      if (nextCandidate) {
                        img.dataset.fallbackIndex = String(nextIndex);
                        img.src = nextCandidate;
                        return;
                      }

                      img.src = '/img/nda.png';
                    }}
                  />

                  {/* Badge de Nota sobre a imagem */}
                  <div className="offer-item-home-rating-chip">
                    <Star size={10} className="offer-item-home-rating-star" />
                    <span>{formatRating(ratingValue)}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Botão Ver Mais */}
        <div className="seeMore" style={{ display: 'flex', justifyContent: 'center', paddingBottom: '60px' }}>
          <button className="seeMore-button" onClick={() => navigate('/menu')}>
            Ver Mais
          </button>
        </div>
      </div>
    </section>
  );
}

export default ProductOffers;