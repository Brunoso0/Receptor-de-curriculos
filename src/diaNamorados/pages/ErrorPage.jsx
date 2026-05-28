import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertOctagon, HelpCircle, MessageSquare, ChevronLeft, Calendar, Users, Utensils, Info } from 'lucide-react';
import * as api from '../services/eventoApi';
import '../styles/confirmacao.css';

export default function ErrorPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [reserva, setReserva] = useState(null);
  const [mpParams, setMpParams] = useState({});
  const query = new URLSearchParams(location.search);

  useEffect(() => {
    const params = {};
    for (const [k, v] of query.entries()) params[k] = v;
    setMpParams(params);

    const lastReserva = localStorage.getItem('last_reserva_id');
    if (lastReserva) {
      api.getReserva(lastReserva)
        .then((data) => {
          setReserva(data.reserva || data);
          setLoading(false);
        })
        .catch((err) => {
          console.warn('Não foi possível obter reserva pelo id local:', err);
          setLoading(false);
        });
    } else {
      setTimeout(() => setLoading(false), 400);
    }
  }, [location.search]);

  const handleRetry = () => {
    try {
      const saved = localStorage.getItem('reserva_state_v1');
      if (saved) {
        const obj = JSON.parse(saved);
        // Reset to Step 4 (Menu selection) so they can review and try to pay again without getting locked in a loop
        obj.step = 4;
        localStorage.setItem('reserva_state_v1', JSON.stringify(obj));
      }
    } catch (e) {
      console.warn('Erro ao atualizar estado local para tentar novamente:', e);
    }
    navigate('/reserva');
  };

  const getFormattedDateTime = () => {
    if (!reserva) return '12 de Junho';
    const turno = reserva.horario_slot || reserva.turno;
    if (turno === 'primeiro' || turno === 'slot_19_00') return '12 de Junho, 19:00 — 20:30';
    if (turno === 'slot_21_00') return '12 de Junho, 21:00 — 22:30';
    if (turno === 'segundo' || turno === 'slot_21_30') return '12 de Junho, 21:30 — 00:00';
    return '12 de Junho';
  };

  const getFormattedTable = () => {
    if (reserva && reserva.mesa) {
      const capacidade = reserva.mesa.capacidade_maxima || reserva.mesa.capacidade || 2;
      const typeLabel = capacidade > 2 ? 'Mesa Grupo' : 'Mesa Casal';
      const floorLabel = reserva.mesa.andar === 0 ? 'Térreo' : 'Mezanino';
      return `Mesa ${reserva.mesa.numero_mesa || reserva.mesa.id} - ${typeLabel} (${floorLabel})`;
    }
    return "Mesa Selecionada";
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'Manrope, sans-serif',
        color: '#4A0E17'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2>Processando informações do pagamento...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="reserva-page">
      <header className="reserva-header">
        <a href="/" className="logo-text" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
          JrCoffee
        </a>
      </header>

      <main style={{ flex: 1, paddingBottom: 60 }}>
        {/* Error Badge */}
        <div className="confirm-success-badge" style={{ backgroundColor: '#A13D2D', boxShadow: '0 4px 12px rgba(161, 61, 45, 0.2)' }}>
          <AlertOctagon size={28} />
        </div>

        {/* Main Headers */}
        <h1 className="confirm-main-title" style={{ color: '#A13D2D' }}>Ocorreu um problema com seu pagamento</h1>
        <p className="confirm-main-subtitle">
          Não conseguimos confirmar o pagamento da sua reserva no momento. Fique tranquilo, nenhum valor foi cobrado e sua mesa temporária foi liberada para que você possa tentar novamente.
        </p>

        {/* Main Grid Layout */}
        <div className="confirm-layout-grid">
          
          {/* Left Column (Actions and Details) */}
          <section className="confirm-left-col">
            <div className="voucher-ticket-card" style={{ borderTopColor: '#A13D2D' }}>
              <span className="voucher-small-tag" style={{ color: '#A13D2D' }}>Status do Pagamento</span>
              <h2 className="voucher-title" style={{ color: '#A13D2D', marginBottom: 12 }}>Não Aprovado</h2>
              
              <p style={{ fontSize: '0.9rem', color: '#7c726c', marginBottom: 28, lineHeight: 1.5 }}>
                O pagamento foi recusado pelo Mercado Pago. Isso pode ocorrer por limite insuficiente, dados incorretos ou bloqueio preventivo do banco.
              </p>

              {/* Action buttons */}
              <div className="voucher-actions-row" style={{ gridTemplateColumns: '1fr', maxWidth: 260 }}>
                <button 
                  className="voucher-btn-primary"
                  onClick={handleRetry}
                  style={{ backgroundColor: '#A13D2D' }}
                >
                  <span>Tentar Novamente</span>
                </button>

                <button 
                  className="voucher-btn-secondary"
                  onClick={() => navigate('/reserva')}
                  style={{ marginTop: 8 }}
                >
                  <ChevronLeft size={15} />
                  <span>Alterar Reserva</span>
                </button>
              </div>

              {/* Tear line to make it look like a ticket */}
              <div className="voucher-tear-line">
                <div style={{ width: 10, height: 10 }} />
              </div>
            </div>
          </section>

          {/* Right Column (Ticket Summary) */}
          <section className="confirm-right-col">
            <div className="details-ticket-card">
              <h2 className="details-ticket-title">Resumo da Tentativa</h2>
              
              <div className="details-ticket-rows">
                {/* Row 1: Date & Time */}
                <div className="details-ticket-row">
                  <Calendar size={18} className="details-row-icon" />
                  <div className="details-row-content">
                    <span className="details-row-label">Data e Horário</span>
                    <span className="details-row-val">{getFormattedDateTime()}</span>
                  </div>
                </div>

                {/* Row 2: Table */}
                <div className="details-ticket-row">
                  <Users size={18} className="details-row-icon" />
                  <div className="details-row-content">
                    <span className="details-row-label">Mesa Selecionada</span>
                    <span className="details-row-val">{getFormattedTable()}</span>
                  </div>
                </div>

                {/* Row 3: Experience */}
                <div className="details-ticket-row">
                  <Utensils size={18} className="details-row-icon" />
                  <div className="details-row-content">
                    <span className="details-row-label">Experiência Selecionada</span>
                    <span className="details-row-val">Menu Degustação 'Amour' (Dia dos Namorados)</span>
                  </div>
                </div>
              </div>

              {/* Help box */}
              <div className="details-note-box" style={{ marginTop: 24 }}>
                <span className="details-note-label" style={{ color: '#A13D2D' }}>
                  <Info size={15} />
                  Dica de Teste
                </span>
                <p className="details-note-text">
                  Se você estiver em um ambiente de teste, lembre-se de usar os cartões de teste recomendados pelo Mercado Pago e preencher o nome do titular como <strong>APRO</strong> e um CPF válido para que a transação seja aprovada com sucesso.
                </p>
              </div>
            </div>
          </section>

        </div>

        {/* FAQ & Support Links */}
        <div className="support-footer-container">
          <p className="support-footer-title">Precisa de ajuda para concluir seu pagamento?</p>
          <div className="support-footer-links">
            <a 
              href="/concierge" 
              className="support-footer-link"
              onClick={(e) => { e.preventDefault(); alert('Redirecionando para o Concierge JrCoffee...'); }}
            >
              <MessageSquare size={16} />
              <span>Falar com Concierge no WhatsApp</span>
            </a>
          </div>
        </div>
      </main>

      <footer className="reserva-footer">
        <h2 className="reserva-footer-logo">JrCoffee</h2>
        <p className="reserva-copyright">© 2026 JrCoffee</p>
      </footer>
    </div>
  );
}
