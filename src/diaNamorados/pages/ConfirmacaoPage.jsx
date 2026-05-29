import React from 'react';
import { Check, Download, Send, Calendar, Users, Utensils, Info, Scissors, HelpCircle, MessageSquare } from 'lucide-react';
import '../styles/confirmacao.css';

export default function ConfirmacaoPage({
  selectedTable,
  selectedFloor,
  turno,
  person1Name,
  person2Name,
  bookingResult,
  setStep
}) {

  // Dynamic booking id
  const bookingId = bookingResult?.token_voucher || "VAL-2024-8842";
  const qrCodeSrc = bookingResult?.qr_code || `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=JrCoffee-${bookingId}`;

  // Formatted date and time based on selected shift
  const getFormattedDateTime = () => {
    if (turno === 'primeiro' || turno === 'slot_19_00') return '12 de Junho, 19:00 — 20:30';
    if (turno === 'slot_21_00') return '12 de Junho, 21:00 — 22:30';
    if (turno === 'segundo' || turno === 'slot_21_30') return '12 de Junho, 21:30 — 00:00';
    return '12 de Junho';
  };

  // Formatted table location
  const getFormattedTable = () => {
    if (selectedTable) {
      const capacidade = selectedTable.capacidade_maxima || selectedTable.capacity || selectedTable.capacidade || 2;
      const typeLabel = capacidade > 2 ? 'Mesa Grupo' : 'Mesa Casal';
      const floorLabel = (selectedFloor === 'terreo' || selectedFloor === 0) ? 'Térreo' : 'Mezanino';
      return `Mesa ${selectedTable.numero_mesa || selectedTable.id} - ${typeLabel} (${floorLabel})`;
    }
    return "Mesa Selecionada";
  };

  return (
    <>
      {/* Icon Checkmark Circle */}
      <div className="confirm-success-badge">
        <Check size={28} />
      </div>

      {/* Main Headers */}
      <h1 className="confirm-main-title">Reserva Confirmada para o Dia dos Namorados!</h1>
      <p className="confirm-main-subtitle">
        Sua experiência romântica na JrCoffee está garantida. Preparamos cada detalhe para tornar sua noite inesquecível.
      </p>

      {/* Two-Column Grid */}
      <div className="confirm-layout-grid">
        
        {/* Left Column (Digital Voucher Ticket) */}
        <section className="confirm-left-col">
          <div className="voucher-ticket-card">
            
            {/* Header info */}
            <span className="voucher-small-tag">Voucher Digital</span>
            <h2 className="voucher-title">Experience Pass</h2>

            {/* QR Code display */}
            <div className="voucher-qrcode-box">
              <div className="voucher-qrcode-shadow">
                <img 
                  className="voucher-qrcode-img" 
                  src={qrCodeSrc} 
                  alt="Voucher QR Code" 
                />
              </div>
              <span className="voucher-id-label">Reserva ID</span>
              <p className="voucher-id-val">{bookingId}</p>
            </div>

            {/* Print/Download and WhatsApp actions */}
            <div className="voucher-actions-row">
              <button 
                className="voucher-btn-primary"
                onClick={() => alert('Fazendo download do PDF da sua reserva...')}
              >
                <Download size={15} />
                <span>Baixar PDF</span>
              </button>

              <button 
                className="voucher-btn-secondary"
                onClick={() => alert('Abrindo WhatsApp para compartilhar...')}
              >
                <Send size={15} style={{ transform: 'rotate(-25deg)' }} />
                <span>Enviar WhatsApp</span>
              </button>
            </div>

            {/* Coupon Tear Dashed Line */}
            <div className="voucher-tear-line">
              <Scissors size={18} className="voucher-tear-icon" />
            </div>

          </div>
        </section>

        {/* Right Column (Details & Map) */}
        <section className="confirm-right-col">
          
          {/* Card 1: Details Ticket */}
          <div className="details-ticket-card">
            <h2 className="details-ticket-title">Detalhes da Reserva</h2>
            
            <div className="details-ticket-rows">
              {/* Row 1: Date & Time */}
              <div className="details-ticket-row">
                <Calendar size={18} className="details-row-icon" />
                <div className="details-row-content">
                  <span className="details-row-label">Data e Horário</span>
                  <span className="details-row-val">{getFormattedDateTime()}</span>
                </div>
              </div>

              {/* Row 2: Table details */}
              <div className="details-ticket-row">
                <Users size={18} className="details-row-icon" />
                <div className="details-row-content">
                  <span className="details-row-label">Mesa</span>
                  <span className="details-row-val">{getFormattedTable()}</span>
                </div>
              </div>

              {/* Row 3: Menu details */}
              <div className="details-ticket-row">
                <Utensils size={18} className="details-row-icon" />
                <div className="details-row-content">
                  <span className="details-row-label">Experiência Selecionada</span>
                  <span className="details-row-val">Menu Degustação 'Amour'</span>
                </div>
              </div>
            </div>

            {/* Observações Importantes Box */}
            <div className="details-note-box">
              <span className="details-note-label">
                <Info size={15} />
                Observações Importantes
              </span>
              <p className="details-note-text">
                O presente exclusivo da JrCoffee será entregue antecipadamente no endereço cadastrado até o dia 12/02. Traje sugerido: Social Elegante.
              </p>
            </div>

          </div>

          {/* Card 2: Map (Google Maps iframe) */}
          <div className="confirm-map-card">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d419.2322093399306!2d-40.187350105101785!3d-10.463007217146345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x76d5933555939b3%3A0xf73285125c3edafc!2sJr%20Coffee!5e1!3m2!1spt-BR!2sbr!4v1780086448615!5m2!1spt-BR!2sbr"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Jr Coffee - Localização"
            />
          </div>

        </section>

      </div>

      {/* FAQ / Concierge support footer links */}
      <div className="support-footer-container">
        <p className="support-footer-title">Restou alguma dúvida sobre sua reserva?</p>
        <div className="support-footer-links">
          <a 
            href="/faq" 
            className="support-footer-link"
            onClick={(e) => { e.preventDefault(); alert('Abrindo F.A.Q. Dia dos Namorados...'); }}
          >
            <HelpCircle size={16} />
            <span>F.A.Q. Dia dos Namorados</span>
          </a>
          <a 
            href="/concierge" 
            className="support-footer-link"
            onClick={(e) => { e.preventDefault(); alert('Redirecionando para o Concierge JrCoffee...'); }}
          >
            <MessageSquare size={16} />
            <span>Falar com Concierge</span>
          </a>
        </div>
      </div>
    </>
  );
}
