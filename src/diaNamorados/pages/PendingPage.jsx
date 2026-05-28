import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Clock, HelpCircle, MessageSquare, RefreshCw, Calendar, Users, Utensils, Info } from 'lucide-react';
import * as api from '../services/eventoApi';
import '../styles/confirmacao.css';

export default function PendingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [reserva, setReserva] = useState(null);
  const [mpParams, setMpParams] = useState({});
  const [statusMessage, setStatusMessage] = useState('');
  const query = new URLSearchParams(location.search);

  const fetchReservaDetails = (reservaId, showFeedback = false) => {
    if (showFeedback) setChecking(true);
    
    api.getReserva(reservaId)
      .then((data) => {
        const resData = data.reserva || data;
        setReserva(resData);
        setLoading(false);
        setChecking(false);

        if (resData.status_pagamento === 'pago') {
          // If payment was approved in the meantime, redirect to success screen!
          navigate(`/namorados/sucesso${location.search}`);
        } else if (showFeedback) {
          setStatusMessage('O pagamento ainda está sendo processado. Por favor, aguarde mais alguns instantes.');
          setTimeout(() => setStatusMessage(''), 5000);
        }
      })
      .catch((err) => {
        console.warn('Não foi possível obter reserva pelo id local:', err);
        setLoading(false);
        setChecking(false);
      });
  };

  useEffect(() => {
    const params = {};
    for (const [k, v] of query.entries()) params[k] = v;
    setMpParams(params);

    const lastReserva = localStorage.getItem('last_reserva_id');
    if (lastReserva) {
      fetchReservaDetails(lastReserva);
    } else {
      setTimeout(() => setLoading(false), 400);
    }
  }, [location.search]);

  const handleCheckStatus = () => {
    const lastReserva = localStorage.getItem('last_reserva_id');
    if (lastReserva) {
      fetchReservaDetails(lastReserva, true);
    } else {
      alert('Não localizamos nenhuma reserva pendente localmente neste navegador.');
    }
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
        {/* Pending Badge */}
        <div className="confirm-success-badge" style={{ backgroundColor: '#a37c42', boxShadow: '0 4px 12px rgba(163, 124, 66, 0.2)' }}>
          <Clock size={28} />
        </div>

        {/* Main Headers */}
        <h1 className="confirm-main-title" style={{ color: '#a37c42' }}>Pagamento em processamento</h1>
        <p className="confirm-main-subtitle">
          O Mercado Pago está analisando a transação. Assim que a aprovação for recebida pelo nosso sistema, sua mesa será confirmada e você receberá seu voucher digital.
        </p>

        {/* Main Grid Layout */}
        <div className="confirm-layout-grid">
          
          {/* Left Column (Actions and Details) */}
          <section className="confirm-left-col">
            <div className="voucher-ticket-card" style={{ borderTopColor: '#a37c42' }}>
              <span className="voucher-small-tag" style={{ color: '#a37c42' }}>Status do Pagamento</span>
              <h2 className="voucher-title" style={{ color: '#a37c42', marginBottom: 12 }}>Aguardando Aprovação</h2>
              
              <p style={{ fontSize: '0.9rem', color: '#7c726c', marginBottom: 28, lineHeight: 1.5 }}>
                A maioria das transações do Mercado Pago é processada em instantes, mas alguns cartões ou pagamentos via boleto/Pix podem levar alguns minutos para serem validados.
              </p>

              {/* Action buttons */}
              <div className="voucher-actions-row" style={{ gridTemplateColumns: '1fr', maxWidth: 260 }}>
                <button 
                  className="voucher-btn-primary"
                  onClick={handleCheckStatus}
                  disabled={checking}
                  style={{ backgroundColor: '#a37c42', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                >
                  <RefreshCw size={16} className={checking ? 'spin-animation' : ''} style={{ animation: checking ? 'spin 1s linear infinite' : 'none' }} />
                  <span>{checking ? 'Verificando...' : 'Verificar Pagamento'}</span>
                </button>

                <button 
                  className="voucher-btn-secondary"
                  onClick={() => navigate('/')}
                  style={{ marginTop: 8 }}
                >
                  <span>Ir para o Início</span>
                </button>
              </div>

              {statusMessage && (
                <div style={{ marginTop: 16, fontSize: '0.85rem', color: '#a37c42', fontWeight: 600 }}>
                  {statusMessage}
                </div>
              )}

              {/* Tear line to make it look like a ticket */}
              <div className="voucher-tear-line">
                <div style={{ width: 10, height: 10 }} />
              </div>
            </div>
          </section>

          {/* Right Column (Ticket Summary) */}
          <section className="confirm-right-col">
            <div className="details-ticket-card">
              <h2 className="details-ticket-title">Resumo da Reserva</h2>
              
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
                    <span className="details-row-label">Mesa Pré-selecionada</span>
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
                <span className="details-note-label" style={{ color: '#a37c42' }}>
                  <Info size={15} />
                  Reserva Garantida Temporariamente
                </span>
                <p className="details-note-text">
                  Para sua comodidade, sua mesa selecionada ficará reservada temporariamente por 30 minutos até o processamento completo do pagamento. Não se preocupe em refazer a reserva.
                </p>
              </div>
            </div>
          </section>

        </div>

        {/* FAQ & Support Links */}
        <div className="support-footer-container">
          <p className="support-footer-title">Caso precise de suporte imediato:</p>
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

      {/* Inline styles for spinner animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spin-animation {
          animation: spin 1.2s linear infinite;
        }
      `}</style>
    </div>
  );
}
