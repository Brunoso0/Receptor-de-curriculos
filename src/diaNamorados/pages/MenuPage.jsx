import React from 'react';
import { Utensils, Award, Dessert, GlassWater, Info, ChevronLeft } from 'lucide-react';
import '../styles/menu.css';

const getImageForName = (name) => {
  const n = name.toLowerCase();
  if (n.includes('frios')) return 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=600';
  if (n.includes('bruschetta')) return 'https://images.unsplash.com/photo-1572656631137-7935297eff55?auto=format&fit=crop&q=80&w=600';
  if (n.includes('risoto')) return 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&q=80&w=600';
  if (n.includes('wellington')) return 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600';
  if (n.includes('salmão') || n.includes('salmao')) return 'https://images.unsplash.com/photo-1485962398705-ef6a13c41e8f?auto=format&fit=crop&q=80&w=600';
  return 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=600';
};

const getTagForName = (name) => {
  const n = name.toLowerCase();
  if (n.includes('risoto')) return 'Vegetariano';
  if (n.includes('wellington')) return 'Signature';
  if (n.includes('salmão') || n.includes('salmao')) return 'Leve';
  return '';
};

export default function MenuPage({
  dbMenu,
  selectedEntradaId,
  setSelectedEntradaId,
  selectedPrincipal1Id,
  setSelectedPrincipal1Id,
  selectedPrincipal2Id,
  setSelectedPrincipal2Id,
  selectedSobremesa1Id,
  setSelectedSobremesa1Id,
  selectedSobremesa2Id,
  setSelectedSobremesa2Id,
  extraWine,
  setExtraWine,
  extraWater,
  setExtraWater,
  localInterest,
  setLocalInterest,
  setStep
}) {

  const handleNextStep = () => {
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
            {dbMenu.entradas && dbMenu.entradas.map(item => (
              <div 
                key={item.id}
                className={`menu-card ${selectedEntradaId === item.id ? 'selected' : ''}`}
                onClick={() => setSelectedEntradaId(item.id)}
              >
                <img 
                  className="menu-card-image"
                  src={getImageForName(item.nome)} 
                  alt={item.nome} 
                />
                <div className="menu-card-body">
                  <h3 className="menu-card-title">{item.nome}</h3>
                  <p className="menu-card-desc">{item.descricao}</p>
                </div>
              </div>
            ))}
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
            {dbMenu.principais && dbMenu.principais.map(item => (
              <div key={item.id} className="menu-card">
                <img 
                  className="menu-card-image"
                  src={getImageForName(item.nome)} 
                  alt={item.nome} 
                />
                <div className="menu-card-body">
                  <h3 className="menu-card-title">{item.nome}</h3>
                  <p className="menu-card-desc">{item.descricao}</p>
                  <div className="menu-card-footer">
                    <span className="menu-item-tag">{getTagForName(item.nome)}</span>
                    <div className="menu-selectors-wrapper">
                      <button 
                        className={`menu-selector-circle ${selectedPrincipal1Id === item.id ? 'selected' : ''}`}
                        onClick={() => setSelectedPrincipal1Id(item.id)}
                        title="Escolher para a Pessoa 1"
                      >
                        P1
                      </button>
                      <button 
                        className={`menu-selector-circle ${selectedPrincipal2Id === item.id ? 'selected' : ''}`}
                        onClick={() => setSelectedPrincipal2Id(item.id)}
                        title="Escolher para a Pessoa 2"
                      >
                        P2
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
            {dbMenu.sobremesas && dbMenu.sobremesas.map(item => (
              <div key={item.id} className="sobremesa-row">
                <div className="sobremesa-info">
                  <span className="sobremesa-name">{item.nome}</span>
                  <span className="sobremesa-desc">{item.descricao}</span>
                </div>
                <div className="qty-control-wrapper">
                  <div className="menu-selectors-wrapper">
                    <button 
                      className={`menu-selector-circle ${selectedSobremesa1Id === item.id ? 'selected' : ''}`}
                      onClick={() => setSelectedSobremesa1Id(item.id)}
                      title="Escolher para a Pessoa 1"
                    >
                      P1
                    </button>
                    <button 
                      className={`menu-selector-circle ${selectedSobremesa2Id === item.id ? 'selected' : ''}`}
                      onClick={() => setSelectedSobremesa2Id(item.id)}
                      title="Escolher para a Pessoa 2"
                    >
                      P2
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
            <span className="menu-total-label">Total Reserva</span>
            <span className="menu-total-val">R$ 480,00</span>
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
