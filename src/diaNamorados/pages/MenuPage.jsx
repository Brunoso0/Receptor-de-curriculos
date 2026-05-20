import React from 'react';
import { Utensils, Award, Dessert, GlassWater, Info, ChevronLeft } from 'lucide-react';
import '../styles/menu.css';

// Custom plate icon (since Lucide doesn't have a direct plate/cloche in some versions)
const PlateIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

export default function MenuPage({
  selectedEntrada,
  setSelectedEntrada,
  risotoP1,
  setRisotoP1,
  risotoP2,
  setRisotoP2,
  wellingtonP1,
  setWellingtonP1,
  wellingtonP2,
  setWellingtonP2,
  salmonP1,
  setSalmonP1,
  salmonP2,
  setSalmonP2,
  dessert1Qty,
  setDessert1Qty,
  dessert2Qty,
  setDessert2Qty,
  extraWine,
  setExtraWine,
  extraWater,
  setExtraWater,
  localInterest,
  setLocalInterest,
  setStep
}) {

  // Dynamic pricing calculation
  const BASE_PRICE = 480.00;
  const WINE_PRICE = 145.00;
  const WATER_PRICE = 28.00;

  const calculateTotal = () => {
    let total = BASE_PRICE;
    if (extraWine) total += WINE_PRICE;
    if (extraWater) total += WATER_PRICE;
    return total;
  };

  const handleNextStep = () => {
    alert(`Menu selecionado com sucesso!\nValor Total: R$ ${calculateTotal().toFixed(2)}\nRedirecionando para o Pagamento...`);
    setStep(5);
  };

  return (
    <>
      {/* Title & Subtitle */}
      <h1 className="reserva-title">Personalize sua Experiência</h1>
      <p className="reserva-subtitle" style={{ marginBottom: '40px' }}>
        Escolha o menu que acompanhará sua noite. Cada prato foi desenvolvido para despertar sensações únicas.
      </p>

      {/* Main Column Wrapper */}
      <div style={{ maxWidth: '1120px', margin: '0 auto', width: '100%', padding: '0 20px 40px 20px', boxSizing: 'border-box' }}>
        
        {/* Section 1: Entradas */}
        <section className="menu-section">
          <div className="menu-section-header">
            <h2 className="menu-section-title">
              <Utensils size={20} />
              Entradas
            </h2>
            <span className="menu-section-tag">Seleção única para o casal</span>
          </div>

          <div className="entradas-grid">
            {/* Card 1: Tábua de Frios */}
            <div 
              className={`menu-card ${selectedEntrada === 'tabua' ? 'selected' : ''}`}
              onClick={() => setSelectedEntrada('tabua')}
            >
              <img 
                className="menu-card-image"
                src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=600" 
                alt="Tábua de Frios Artesanal" 
              />
              <div className="menu-card-body">
                <h3 className="menu-card-title">Tábua de Frios Artesanal</h3>
                <p className="menu-card-desc">
                  Queijos curados, prosciutto di Parma, frutas da estação e mel silvestre.
                </p>
              </div>
            </div>

            {/* Card 2: Bruschettas */}
            <div 
              className={`menu-card ${selectedEntrada === 'bruschetta' ? 'selected' : ''}`}
              onClick={() => setSelectedEntrada('bruschetta')}
            >
              <img 
                className="menu-card-image"
                src="https://images.unsplash.com/photo-1572656631137-7935297eff55?auto=format&fit=crop&q=80&w=600" 
                alt="Bruschettas do Chef" 
              />
              <div className="menu-card-body">
                <h3 className="menu-card-title">Bruschettas do Chef</h3>
                <p className="menu-card-desc">
                  Pão de fermentação natural tostado, tomates concassé, manjericão e redução de balsâmico.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Pratos Principais */}
        <section className="menu-section">
          <div className="menu-section-header">
            <h2 className="menu-section-title">
              <Award size={20} />
              Pratos Principais
            </h2>
            <span className="menu-section-tag">Um prato por pessoa</span>
          </div>

          <div className="principais-grid">
            {/* Card 1: Risoto */}
            <div className="menu-card">
              <img 
                className="menu-card-image"
                src="https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&q=80&w=600" 
                alt="Risoto de Cogumelos Selvagens" 
              />
              <div className="menu-card-body">
                <h3 className="menu-card-title">Risoto de Cogumelos Selvagens</h3>
                <p className="menu-card-desc">
                  Arroz arbóreo cremoso com cogumelos frescos, trufados e parmesão curado.
                </p>
                <div className="menu-card-footer">
                  <span className="menu-item-tag" style={{ color: '#2E7D32' }}>Vegetariano</span>
                  <div className="menu-selectors-wrapper">
                    <button 
                      className={`menu-selector-circle ${risotoP1 === 1 ? 'selected' : ''}`}
                      onClick={() => setRisotoP1(risotoP1 === 1 ? 0 : 1)}
                    >
                      {risotoP1}
                    </button>
                    <button 
                      className={`menu-selector-circle ${risotoP2 === 1 ? 'selected' : ''}`}
                      onClick={() => setRisotoP2(risotoP2 === 1 ? 0 : 1)}
                    >
                      {risotoP2}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Wellington */}
            <div className="menu-card">
              <img 
                className="menu-card-image"
                src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600" 
                alt="Filé Wellington Clássico" 
              />
              <div className="menu-card-body">
                <h3 className="menu-card-title">Filé Wellington Clássico</h3>
                <p className="menu-card-desc">
                  Filé mignon envolto em cogumelos cogumelos picados e massa folhada dourada ao forno.
                </p>
                <div className="menu-card-footer">
                  <span className="menu-item-tag">Signature</span>
                  <div className="menu-selectors-wrapper">
                    <button 
                      className={`menu-selector-circle ${wellingtonP1 === 1 ? 'selected' : ''}`}
                      onClick={() => setWellingtonP1(wellingtonP1 === 1 ? 0 : 1)}
                    >
                      {wellingtonP1}
                    </button>
                    <button 
                      className={`menu-selector-circle ${wellingtonP2 === 1 ? 'selected' : ''}`}
                      onClick={() => setWellingtonP2(wellingtonP2 === 1 ? 0 : 1)}
                    >
                      {wellingtonP2}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Salmão */}
            <div className="menu-card">
              <img 
                className="menu-card-image"
                src="https://images.unsplash.com/photo-1485962398705-ef6a13c41e8f?auto=format&fit=crop&q=80&w=600" 
                alt="Salmão ao Molho de Citrinos" 
              />
              <div className="menu-card-body">
                <h3 className="menu-card-title">Salmão ao Molho de Citrinos</h3>
                <p className="menu-card-desc">
                  Lombo de salmão grelhado regado a molho de laranja, limão siciliano e especiarias.
                </p>
                <div className="menu-card-footer">
                  <span className="menu-item-tag" style={{ color: '#0288D1' }}>Leve</span>
                  <div className="menu-selectors-wrapper">
                    <button 
                      className={`menu-selector-circle ${salmonP1 === 1 ? 'selected' : ''}`}
                      onClick={() => setSalmonP1(salmonP1 === 1 ? 0 : 1)}
                    >
                      {salmonP1}
                    </button>
                    <button 
                      className={`menu-selector-circle ${salmonP2 === 1 ? 'selected' : ''}`}
                      onClick={() => setSalmonP2(salmonP2 === 1 ? 0 : 1)}
                    >
                      {salmonP2}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Sobremesas */}
        <section className="menu-section">
          <div className="menu-section-header">
            <h2 className="menu-section-title">
              <Dessert size={20} />
              Sobremesas
            </h2>
            <span className="menu-section-tag">Uma por pessoa</span>
          </div>

          <div className="sobremesas-container">
            {/* Row 1: Petit Gateau */}
            <div className="sobremesa-row">
              <div className="sobremesa-info">
                <span className="sobremesa-name">Petit Gateau de Chocolate Belga</span>
                <span className="sobremesa-desc">Com sorvete artesanal de baunilha Bourbon.</span>
              </div>
              <div className="qty-control-wrapper">
                <span className="qty-label">Qtd: {dessert1Qty}</span>
                <div className="qty-selector">
                  <button className="qty-btn" onClick={() => setDessert1Qty(Math.max(0, dessert1Qty - 1))}>-</button>
                  <span className="qty-value">{dessert1Qty}</span>
                  <button className="qty-btn" onClick={() => setDessert1Qty(dessert1Qty + 1)}>+</button>
                </div>
              </div>
            </div>

            {/* Row 2: Cheesecake */}
            <div className="sobremesa-row">
              <div className="sobremesa-info">
                <span className="sobremesa-name">Cheesecake de Frutas Vermelhas</span>
                <span className="sobremesa-desc">Coulis de framboesa e frutas frescas.</span>
              </div>
              <div className="qty-control-wrapper">
                <span className="qty-label">Qtd: {dessert2Qty}</span>
                <div className="qty-selector">
                  <button className="qty-btn" onClick={() => setDessert2Qty(Math.max(0, dessert2Qty - 1))}>-</button>
                  <span className="qty-value">{dessert2Qty}</span>
                  <button className="qty-btn" onClick={() => setDessert2Qty(dessert2Qty + 1)}>+</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Bebidas e Extras */}
        <section className="menu-section">
          <div className="menu-section-header">
            <h2 className="menu-section-title">
              <GlassWater size={20} />
              Bebidas e Extras
            </h2>
          </div>

          <div className="extras-container">
            {/* Extra 1: Vinho Tinto */}
            <div 
              className={`extra-option-row ${extraWine ? 'selected' : ''}`}
              onClick={() => setExtraWine(!extraWine)}
            >
              <div className="extra-checkbox-wrapper">
                <div className={`extra-checkbox ${extraWine ? 'checked' : ''}`}>
                  {extraWine && '✓'}
                </div>
              </div>
              <div className="extra-details">
                <span className="extra-name">Vinho Tinto Reserva Especial</span>
                <span className="extra-desc">Harmonização sugerida para o Filé Wellington.</span>
              </div>
              <span className="extra-price">R$ 145,00</span>
            </div>

            {/* Extra 2: Agua San Pellegrino */}
            <div 
              className={`extra-option-row ${extraWater ? 'selected' : ''}`}
              onClick={() => setExtraWater(!extraWater)}
            >
              <div className="extra-checkbox-wrapper">
                <div className={`extra-checkbox ${extraWater ? 'checked' : ''}`}>
                  {extraWater && '✓'}
                </div>
              </div>
              <div className="extra-details">
                <span className="extra-name">Água Mineral San Pellegrino (750ml)</span>
                <span className="extra-desc">Natural ou Com Gás.</span>
              </div>
              <span className="extra-price">R$ 28,00</span>
            </div>

            {/* Footer Notice */}
            <div className="local-purchase-notice">
              <div className="notice-message-wrapper">
                <Info size={18} className="notice-icon" />
                <span>Bebidas extras serão cobradas no checkout final na unidade.</span>
              </div>

              <button 
                className={`local-interest-btn ${localInterest ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setLocalInterest(!localInterest);
                }}
              >
                Interessa em compra no local
              </button>
            </div>
          </div>
        </section>

      </div>

      {/* Shared Bottom Actions Bar */}
      <div className="status-bar-container">
        <div className="status-bar-content">
          <a 
            className="voltar-link"
            onClick={(e) => { e.preventDefault(); setStep(3); }}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '700', color: '#8c7f76', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.5px' }}
          >
            <ChevronLeft size={16} />
            Voltar para dados do casal
          </a>

          <div className="menu-total-wrapper">
            <span className="menu-total-label">Total Estimado</span>
            <span className="menu-total-val">R$ {calculateTotal().toFixed(2).replace('.', ',')}</span>
          </div>

          <button 
            className="continue-button"
            onClick={handleNextStep}
          >
            Ir para Pagamento
          </button>
        </div>
      </div>
    </>
  );
}
