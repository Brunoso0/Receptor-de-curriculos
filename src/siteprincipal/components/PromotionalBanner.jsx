// components/PromotionalBanner.js
import React, { useState, useEffect } from 'react';
import '../styles/PromotionalBanner.css';
import api from '../services/api.js';

function buildImageUrl(imagemDestaqueUrl) {
  if (!imagemDestaqueUrl) return '/img/nda.png';
  
  const normalizedPath = String(imagemDestaqueUrl)
    .trim()
    .replace(/\\/g, '/');
  
  if (normalizedPath.startsWith('http://') || normalizedPath.startsWith('https://')) {
    return normalizedPath;
  }
  
  const apiBase = String(api?.defaults?.baseURL || '').replace(/\/+$/, '');
  const pathWithSlash = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;
  
  return `${apiBase}${pathWithSlash}`;
}

function PromotionalBanner() {
  const [mainItem, setMainItem] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/produtos/destaque')
      .then((res) => {
        const destaques = Array.isArray(res.data) ? res.data : [];
        
        if (destaques.length > 0) {
          const produtos = destaques.map(prod => ({
            id: prod.id,
            image: buildImageUrl(prod.imagemDestaque),
            name: prod.nome,
            description: prod.descricao || 'Produto em destaque'
          }));
          
          setItems(produtos);
          setMainItem(produtos[0]);
        }
      })
      .catch((err) => {
        console.error('Erro ao buscar produtos em destaque:', err);
        // Fallback para dados vazios em caso de erro
        setItems([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleThumbnailClick = (item) => {
    setMainItem(item); // Atualiza o item principal
  };

  return (
    <section className="promotional-banner">
      <div className="promo-content">
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <p>Carregando destaques...</p>
          </div>
        ) : !mainItem ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <p>Nenhum produto em destaque disponível.</p>
          </div>
        ) : (
          <>
            <div className="promo-image">
              <img src={mainItem.image} alt={mainItem.name} />
              <div className="promo-text">
                <h1>{mainItem.name}</h1>
                <h4>|Descrição</h4>
                <p className="promo-description">{mainItem.description}</p>
                <button className="promo-button">Experimentar</button>
              </div>
            </div>
            <div className="promo-thumbnails">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`promo-thumbnail-item ${mainItem.id === item.id ? 'selected' : ''}`}
                  onClick={() => handleThumbnailClick(item)}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="promo-thumbnail-image"
                  />
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default PromotionalBanner;