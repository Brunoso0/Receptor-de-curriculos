import React, { useRef, useState, useEffect } from 'react';
import { Check, Download, Send, Calendar, Users, Utensils, Info, Scissors, HelpCircle, MessageSquare } from 'lucide-react';
import html2canvas from 'html2canvas';
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

  // 1. Cria a referência para capturar a div do voucher
  const voucherRef = useRef(null);

  // Dynamic booking id
  const bookingId = bookingResult?.token_voucher || "VAL-2024-8842";
  const qrCodeSrc = bookingResult?.qr_code || `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=JrCoffee-${bookingId}`;

  // Inline the external QR image as a data URL so html2canvas can render it
  const [qrDataUrl, setQrDataUrl] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const src = qrCodeSrc;
    // If already a data URL, use it directly
    if (!src) return;
    if (src.startsWith('data:')) {
      setQrDataUrl(src);
      return;
    }

    // Try to fetch the image as a blob and convert to data URL.
    // This avoids cross-origin image tainting when html2canvas renders the DOM.
    fetch(src)
      .then((res) => res.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (!cancelled) setQrDataUrl(reader.result);
        };
        reader.readAsDataURL(blob);
      })
      .catch((err) => {
        console.warn('Não foi possível inline o QR code:', err);
        // fallback: leave qrDataUrl null so original src is used
      });

    return () => { cancelled = true; };
  }, [qrCodeSrc]);

  // Formatted date and time based on selected shift.
  // Accept several possible `turno` formats (slot keys, labels or raw times)
  const getFormattedDateTime = () => {
    // 1. Tenta pegar da prop, se não tiver, busca direto dos dados da reserva do banco
    const turnoAtivo = turno || bookingResult?.mesa?.horario_slot;

    // 2. Se ainda assim não existir, retorna o padrão
    if (!turnoAtivo) return '12 de Junho';
    
    const t = String(turnoAtivo);

    // Common slot keys or labels containing 19
    if (t === 'primeiro' || t === 'slot_19_00' || /19/.test(t)) {
      return '12 de Junho, 19:00 — 21:00';
    }

    // Prefer the later slot for any 21/21:30 references
    if (t === 'segundo' || t === 'slot_21_30' || t === 'slot_21_00' || /21/.test(t)) {
      return '12 de Junho, 21:00 — 23:00'; // Ajustei para 21:00 de acordo com seu banco
    }

    // Fallback: show the raw turno value after the date
    return `12 de Junho, ${t}`;
  };

  // Formatted table location
  const getFormattedTable = () => {
    if (selectedTable) {
      const capacidade = selectedTable.capacidade_maxima || selectedTable.capacity || selectedTable.capacidade || 2;
      const typeLabel = capacidade > 2 ? 'Mesa Grupo' : 'Mesa Casal';
      const floorLabel = (selectedFloor === 'terreo' || selectedFloor === 0) ? '' : '';
      return `Mesa ${selectedTable.numero_mesa || selectedTable.id}`;
    }
    return "Mesa Selecionada";
  };

  // 2. Função que gera a imagem a partir do HTML e força o download
  const handleDownloadImage = async () => {
    if (!voucherRef.current) return;
    
    try {
      const canvas = await html2canvas(voucherRef.current, { 
        scale: 2, 
        useCORS: true // Permite carregar imagens externas (como o QR Code)
      });
      
      const dataUrl = canvas.toDataURL('image/png');
      
      const link = document.createElement('a');
      link.download = `Voucher-JrCoffee-${bookingId}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Erro ao gerar imagem do voucher:', error);
      alert('Não foi possível gerar o voucher no momento.');
    }
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
          {/* 3. Atrela o ref à div principal do voucher */}
          <div className="voucher-ticket-card" ref={voucherRef}>
            
            {/* Header info */}
            <span className="voucher-small-tag">Voucher Digital</span>
            <h2 className="voucher-title">Experience Pass</h2>

            {/* QR Code display */}
            <div className="voucher-qrcode-box">
              <div className="voucher-qrcode-shadow">
                <img
                  className="voucher-qrcode-img"
                  src={qrDataUrl || qrCodeSrc}
                  alt="Voucher QR Code"
                  crossOrigin="anonymous"
                />
              </div>
              <span className="voucher-id-label">Reserva ID</span>
              <p className="voucher-id-val">{bookingId}</p>
            </div>

            {/* Print/Download and WhatsApp actions */}
            <div className="voucher-actions-row">
              {/* 4. Aciona a função no clique do botão */}
              <button 
                className="voucher-btn-primary"
                onClick={handleDownloadImage}
              >
                <Download size={15} />
                <span>Baixar Voucher</span>
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
                  <span className="details-row-val">Dia dos Namorados JrCoffee</span>
                </div>
              </div>

              <div className="details-ticket-row">
                <Info size={18} className="details-row-icon" />
                <div className="details-row-content">
                  <span className="details-row-label">Observações</span>
                  <span className="details-row-val">{bookingResult?.obs || bookingResult?.observacoes || 'Nenhuma'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Map (Google Maps iframe) */}
          <div className="confirm-map-card">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d419.2322093399306!2d-40.187350105101785!3d-10.463007217146345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x76d5933555939b3%3A0xf73285125c3edafc!2sJr%20Coffee!5e1!3m2!1spt-BR!2sbr!4v1780086448615!5m2!1spt-BR!2sbr"
              width="100%"
              height="100%"
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
      {/* <div className="support-footer-container">
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
      </div> */}
    </>
  );
}