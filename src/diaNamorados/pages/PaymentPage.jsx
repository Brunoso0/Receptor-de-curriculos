import React from 'react';
import { CreditCard, QrCode, ShieldCheck, Info, ChevronLeft } from 'lucide-react';
import '../styles/payment.css';

export default function PaymentPage({
  paymentMethod,
  setPaymentMethod,
  cardName,
  setCardName,
  cardNumber,
  setCardNumber,
  cardExpiry,
  setCardExpiry,
  cardCvv,
  setCardCvv,
  selectedTable,
  selectedFloor,
  turno,
  extraWine,
  extraWater,
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

  const handleFinalize = () => {
    if (paymentMethod === 'card') {
      if (!cardName || !cardNumber || !cardExpiry || !cardCvv) {
        alert('Por favor, preencha todos os campos do cartão de crédito para prosseguir.');
        return;
      }
    }
    // Proceed to Step 6: Confirmation
    setStep(6);
  };

  // Turno text helper
  const getTurnoTime = () => {
    if (turno === 'primeiro') return '12 de Junho, 19:00';
    if (turno === 'segundo') return '12 de Junho, 21:30';
    return '12 de Junho, 20:00';
  };

  // Floor text helper
  const getFloorName = () => {
    if (selectedFloor === 'terreo') return 'Térreo';
    if (selectedFloor === 'primeiro') return 'Mezanino';
    return 'Salão Principal';
  };

  // Table label helper
  const getTableLabel = () => {
    if (selectedTable) {
      const typeLabel = selectedTable.type === 'window' ? 'Vista Janela' : 'Salão';
      return `Mesa ${selectedTable.id} • ${typeLabel}`;
    }
    return 'Mesa 14 • Vista Janela';
  };

  return (
    <>
      {/* Title */}
      <h1 className="reserva-title">Quase lá para sua noite inesquecível</h1>
      <p className="reserva-subtitle" style={{ marginBottom: '40px' }}>
        Selecione o método de pagamento e revise os detalhes para finalizar sua reserva especial.
      </p>

      {/* Grid Layout */}
      <div className="payment-layout-grid">
        
        {/* Left Column (Payment Form) */}
        <section className="payment-left-col">
          
          {/* Card 1: Método de Pagamento */}
          <div className="casal-card">
            <h2 className="casal-card-title">
              <CreditCard size={20} />
              Método de Pagamento
            </h2>

            {/* Selector Buttons */}
            <div className="payment-methods-grid">
              <div 
                className={`payment-method-btn ${paymentMethod === 'card' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('card')}
              >
                <CreditCard size={18} />
                <span>Cartão de Crédito</span>
              </div>

              <div 
                className={`payment-method-btn ${paymentMethod === 'pix' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('pix')}
              >
                <QrCode size={18} />
                <span>PIX</span>
              </div>
            </div>

            {/* Conditionally Render payment forms */}
            {paymentMethod === 'card' ? (
              <div className="card-fields-wrapper">
                {/* Nome no Cartão */}
                <div className="casal-field">
                  <label className="casal-field-label">Nome no Cartão</label>
                  <input
                    type="text"
                    className="casal-input"
                    placeholder="Como impresso no cartão"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                  />
                </div>

                {/* Número do Cartão */}
                <div className="casal-field" style={{ marginTop: '20px' }}>
                  <label className="casal-field-label">Número do Cartão</label>
                  <div className="input-card-number-wrapper">
                    <input
                      type="text"
                      className="casal-input"
                      placeholder="0000 0000 0000 0000"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                    />
                    <div className="card-brands-icons">
                      <div className="card-brand-box">Visa</div>
                      <div className="card-brand-box">MC</div>
                    </div>
                  </div>
                </div>

                {/* Expiry and CVV */}
                <div className="card-expiry-cvv-grid">
                  <div className="casal-field">
                    <label className="casal-field-label">Validade</label>
                    <input
                      type="text"
                      className="casal-input"
                      placeholder="MM/AA"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                    />
                  </div>

                  <div className="casal-field">
                    <label className="casal-field-label">CVV</label>
                    <input
                      type="text"
                      className="casal-input"
                      placeholder="123"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="pix-instructions-container">
                <span className="upload-desc">Escaneie o código QR abaixo para realizar o pagamento instantâneo.</span>
                <div className="pix-qrcode-placeholder">
                  <img 
                    className="pix-qrcode-img" 
                    src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=JrCoffeeValentinePixPaymentKey" 
                    alt="Pix QR Code" 
                  />
                </div>
                <button 
                  className="pix-copy-paste-btn"
                  onClick={() => {
                    navigator.clipboard.writeText('00020101021226830014br.gov.bcb.pix2561pix.jrcoffee.com.br/valentin-reserva-key');
                    alert('Código PIX Copia e Cola copiado com sucesso!');
                  }}
                >
                  Copiar Código PIX Copia e Cola
                </button>
              </div>
            )}
          </div>

          {/* Card 2: Security Information Box */}
          <div className="security-alert-box">
            <ShieldCheck size={26} className="security-alert-icon" />
            <div className="security-alert-content">
              <h3 className="security-alert-title">Pagamento 100% Seguro</h3>
              <p className="security-alert-text">
                Seus dados financeiros são processados de forma criptografada. JrCoffee preza pela sua privacidade e segurança em cada detalhe.
              </p>
            </div>
          </div>

        </section>

        {/* Right Column (Ticket Summary) */}
        <section className="payment-right-col">
          
          <div className="ticket-card">
            {/* Header with image & overlay */}
            <div 
              className="ticket-header-image"
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=400')` }}
            >
              <h2 className="ticket-header-title">{getTableLabel()}</h2>
            </div>

            {/* Details body */}
            <div className="ticket-body">
              {/* Floor and shift info */}
              <div className="ticket-info-grid">
                <div>
                  <span className="ticket-info-label">Andar</span>
                  <span className="ticket-info-val">{getFloorName()}</span>
                </div>
                <div>
                  <span className="ticket-info-label">Horário</span>
                  <span className="ticket-info-val">{getTurnoTime()}</span>
                </div>
              </div>

              <hr className="ticket-divider" />

              {/* Course Items List */}
              <div className="ticket-items-list">
                <div className="ticket-item-row">
                  <span className="ticket-item-name">2x Menu Degustação 'Ametista'</span>
                  <span className="ticket-item-price">R$ {BASE_PRICE.toFixed(2).replace('.', ',')}</span>
                </div>

                {extraWine && (
                  <div className="ticket-item-row">
                    <span className="ticket-item-name">1x Vinho Tinto Reserva Especial</span>
                    <span className="ticket-item-price">R$ {WINE_PRICE.toFixed(2).replace('.', ',')}</span>
                  </div>
                )}

                {extraWater && (
                  <div className="ticket-item-row">
                    <span className="ticket-item-name">1x Água San Pellegrino (750ml)</span>
                    <span className="ticket-item-price">R$ {WATER_PRICE.toFixed(2).replace('.', ',')}</span>
                  </div>
                )}
              </div>

              <hr className="ticket-divider-dashed" />

              {/* Total Price */}
              <div className="ticket-total-row">
                <span className="ticket-total-label">Total do Investimento</span>
                <span className="ticket-total-price">R$ {calculateTotal().toFixed(2).replace('.', ',')}</span>
              </div>
              <p className="ticket-tax-note">
                * Taxa de serviço (10%) será inclusa ao final da experiência.
              </p>

              {/* Checkout Button */}
              <button 
                className="finalize-booking-btn"
                onClick={handleFinalize}
              >
                Finalizar Reserva
              </button>

              <p className="ticket-terms-note">
                Ao clicar em Finalizar, você concorda com nossos <a href="/terms" onClick={(e) => e.preventDefault()}>Termos de Cancelamento</a>.
              </p>
            </div>
          </div>

        </section>

      </div>

      {/* Shared Bottom Actions Bar */}
      <div className="status-bar-container">
        <div className="status-bar-content" style={{ justifyContent: 'flex-start' }}>
          <a 
            className="voltar-link"
            onClick={(e) => { e.preventDefault(); setStep(4); }}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '700', color: '#8c7f76', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.5px' }}
          >
            <ChevronLeft size={16} />
            Voltar para Escolha do Menu
          </a>
        </div>
      </div>
    </>
  );
}
