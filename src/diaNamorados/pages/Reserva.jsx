import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Users, Info, Utensils, ArrowRight } from 'lucide-react';
import MesasPage from './MesasPage';
import CasalPage from './CasalPage';
import MenuPage from './MenuPage';
import PaymentPage from './PaymentPage';
import ConfirmacaoPage from './ConfirmacaoPage';
import '../styles/reserva.css';
import '../styles/mesas.css';
import '../styles/casal.css';
import '../styles/menu.css';
import '../styles/payment.css';
import '../styles/confirmacao.css';

export default function ReservaPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  
  // Helper to generate UUID for session locking
  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  // Centralized Booking State
  const [experience, setExperience] = useState('casal'); // 'casal' or 'grupo'
  const [turno, setTurno] = useState(null); // 'primeiro' or 'segundo'
  const [selectedFloor, setSelectedFloor] = useState('terreo');
  const [selectedTable, setSelectedTable] = useState(null);

  // Step 3 (Personalization) Form State
  const [person1Name, setPerson1Name] = useState('');
  const [person2Name, setPerson2Name] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactWhatsapp, setContactWhatsapp] = useState('');
  const [contactInstagram, setContactInstagram] = useState('');
  const [uploadedPhoto, setUploadedPhoto] = useState(null);
  const [specialNotes, setSpecialNotes] = useState('');

  // Database Menu & Dynamic Selection State
  const [dbMenu, setDbMenu] = useState({ entradas: [], principais: [], sobremesas: [], bebidas: [] });
  const [selectedEntradaId, setSelectedEntradaId] = useState(null);
  const [selectedPrincipal1Id, setSelectedPrincipal1Id] = useState(null);
  const [selectedPrincipal2Id, setSelectedPrincipal2Id] = useState(null);
  const [selectedSobremesa1Id, setSelectedSobremesa1Id] = useState(null);
  const [selectedSobremesa2Id, setSelectedSobremesa2Id] = useState(null);
  const [extraWine, setExtraWine] = useState(false);
  const [extraWater, setExtraWater] = useState(false);
  const [localInterest, setLocalInterest] = useState(false);

  // Step 5 (Payment Selection) State & Final Response
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' or 'pix'
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [bookingResult, setBookingResult] = useState(null);

  // Load Menu and initialize locks session on mount
  useEffect(() => {
    if (!sessionStorage.getItem('sessao_bloqueio')) {
      sessionStorage.setItem('sessao_bloqueio', generateUUID());
    }
    const loadMenu = async () => {
      try {
        const mod = await import('../services/eventoApi');
        const data = await mod.getCardapio();
        setDbMenu(data);
        // Set initial defaults from first available options
        if (data.entradas?.length > 0) setSelectedEntradaId(data.entradas[0].id);
        if (data.principais?.length > 0) {
          setSelectedPrincipal1Id(data.principais[0].id);
          setSelectedPrincipal2Id(data.principais[0].id);
        }
        if (data.sobremesas?.length > 0) {
          setSelectedSobremesa1Id(data.sobremesas[0].id);
          setSelectedSobremesa2Id(data.sobremesas[0].id);
        }
      } catch (err) {
        console.error('Erro ao carregar cardapio do servidor:', err);
      }
    };
    loadMenu();
  }, []);

  const handleSelectExperience = (type) => {
    setExperience(type);
  };

  const handleSelectTurno = (turnoId) => {
    setTurno(turnoId);
  };

  const handleContinueToStep2 = () => {
    if (experience && turno) {
      setStep(2);
    } else if (!turno) {
      alert('Por favor, selecione um horário para sua reserva antes de continuar.');
    }
  };

  // Submission Handler
  const handleCreateReservation = async () => {
    // Front-end validations
    if (!person1Name || person1Name.trim().length < 3) {
      alert('Por favor, informe o nome completo da primeira pessoa.');
      return;
    }
    if (!person2Name || person2Name.trim().length < 3) {
      alert('Por favor, informe o nome completo da segunda pessoa.');
      return;
    }
    if (!contactName || contactName.trim().length < 3) {
      alert('Por favor, informe o nome do contato.');
      return;
    }
    if (!contactEmail || !contactEmail.includes('@')) {
      alert('Por favor, informe um e-mail de contato válido.');
      return;
    }
    const cleanWhatsapp = contactWhatsapp.replace(/\D/g, '');
    if (!cleanWhatsapp || cleanWhatsapp.length < 10) {
      alert('Por favor, informe um WhatsApp de contato válido com DDD.');
      return;
    }
    if (!selectedTable) {
      alert('Nenhuma mesa selecionada. Por favor, volte e selecione uma mesa.');
      return;
    }

    try {
      // Ensure menu has required categories
      if (!dbMenu.principais || dbMenu.principais.length === 0) {
        alert('Ainda não temos os pratos principais cadastrados. Por favor, tente novamente mais tarde.');
        return;
      }
      if (!dbMenu.sobremesas || dbMenu.sobremesas.length === 0) {
        alert('Ainda não temos sobremesas cadastradas. Por favor, tente novamente mais tarde.');
        return;
      }
      const base = (process.env.REACT_APP_URL_NAMORADOS || '').trim().replace(/\/+$/, '') || 'http://localhost:3003/api';
      const sessao_bloqueio = sessionStorage.getItem('sessao_bloqueio') || '';

      const integrantesRaw = [
        {
          nome_integrante: person1Name,
          principal_cardapio_id: selectedPrincipal1Id,
          sobremesa_cardapio_id: selectedSobremesa1Id
        },
        {
          nome_integrante: person2Name,
          principal_cardapio_id: selectedPrincipal2Id,
          sobremesa_cardapio_id: selectedSobremesa2Id
        }
      ];

      // Remove null/undefined fields to satisfy backend validation
      const integrantes = integrantesRaw.map(i => {
        const fallbackPrincipal = selectedEntradaId || (dbMenu.principais && dbMenu.principais.length > 0 ? dbMenu.principais[0].id : null);
        const fallbackSobremesa = (dbMenu.sobremesas && dbMenu.sobremesas.length > 0) ? dbMenu.sobremesas[0].id : (selectedEntradaId || null);
        return {
          nome_integrante: i.nome_integrante,
          principal_cardapio_id: typeof i.principal_cardapio_id === 'number' ? i.principal_cardapio_id : fallbackPrincipal,
          sobremesa_cardapio_id: typeof i.sobremesa_cardapio_id === 'number' ? i.sobremesa_cardapio_id : fallbackSobremesa
        };
      });

      const bebidas_intencao = [];
      if (extraWine) {
        const wineItem = dbMenu.bebidas.find(b => b.nome.toLowerCase().includes('vinho'));
        if (wineItem) {
          bebidas_intencao.push({
            bebida_cardapio_id: wineItem.id,
            tipo_consumo: 'garrafa',
            quantidade: 1
          });
        }
      }
      if (extraWater) {
        const waterItem = dbMenu.bebidas.find(b => b.nome.toLowerCase().includes('água') || b.nome.toLowerCase().includes('agua'));
        if (waterItem) {
          bebidas_intencao.push({
            bebida_cardapio_id: waterItem.id,
            tipo_consumo: 'garrafa',
            quantidade: 1
          });
        }
      }

      // Filter out any bebida entries without a valid cardapio id
      const bebidas_intencao_sanitized = bebidas_intencao.filter(b => b.bebida_cardapio_id);

      const payload = {
        cliente: {
          nome_completo: contactName || person1Name,
          email: contactEmail,
          whatsapp: contactWhatsapp
        },
        mesa_id: Number(selectedTable.dbId || selectedTable.id),
        sessao_bloqueio,
        entrada_cardapio_id: selectedEntradaId,
        observacoes: specialNotes,
        foto_url: uploadedPhoto ? uploadedPhoto.preview : null,
        integrantes,
        bebidas_intencao: bebidas_intencao_sanitized
      };

      try {
        const mod = await import('../services/eventoApi');
        const data = await mod.criarReserva(payload);
        if (data?.sucesso) {
          setBookingResult(data);
          setStep(6);
        } else {
          alert(data.erro || 'Erro ao realizar a reserva. Verifique se a mesa ainda está disponível.');
        }
      } catch (err) {
        console.error('Erro na criação da reserva:', err);
        alert('Erro ao realizar a reserva.');
      }
    } catch (err) {
      console.error(err);
      alert('Erro de conexão ao realizar a reserva.');
    }
  };

  return (
    <div className="reserva-page">
      {/* Shared Header */}
      <header className="reserva-header">
        <a href="/" className="logo-text" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
          JrCoffee
        </a>
      </header>

      {/* Main Content Container */}
      <main style={{ flex: 1 }}>
        {/* Dynamic Stepper */}
        {step < 6 && (
          <div className="reserva-stepper-container">
            <div className="reserva-stepper">
              {[1, 2, 3, 4, 5, 6].map((num) => {
                let dotClass = "stepper-dot";
                if (num < step) {
                  dotClass += " completed";
                } else if (num === step) {
                  dotClass += " active";
                }
                return (
                  <div key={num} className={dotClass}>
                    {num}
                  </div>
                );
              })}
            </div>
            <span className="stepper-step-label">Passo {step} de 6</span>
          </div>
        )}

        {/* Step 1: Configuration */}
        {step === 1 && (
          <>
            <h1 className="reserva-title">Configuração da sua Noite</h1>
            <p className="reserva-subtitle">
              Inicie sua jornada gastronômica selecionando o formato da sua experiência e o horário de sua preferência.
            </p>

            <div className="reserva-main-grid">
              
              {/* Left Column: Experience Format */}
              <section className="reserva-left-col">
                <h2 className="reserva-section-title">Formato da Experiência</h2>
                <div className="experience-cards-wrapper">
                  
                  {/* Casal Card */}
                  <div 
                    className={`experience-card ${experience === 'casal' ? 'selected' : ''}`}
                    onClick={() => handleSelectExperience('casal')}
                  >
                    <div className="experience-icon-circle">
                      <Heart size={20} />
                    </div>
                    <div className="experience-info">
                      <span className="experience-info-title">Casal</span>
                      <span className="experience-info-desc">Mesa íntima com iluminação à luz de velas.</span>
                    </div>
                  </div>

                  {/* Grupo Personalizado Card */}
                  <div 
                    className={`experience-card ${experience === 'grupo' ? 'selected' : ''}`}
                    onClick={() => handleSelectExperience('grupo')}
                  >
                    <div className="experience-icon-circle">
                      <Users size={20} />
                    </div>
                    <div className="experience-info">
                      <span className="experience-info-title">Grupo Personalizado</span>
                      <span className="experience-info-desc">Configuração flexível para amigos e celebrações.</span>
                    </div>
                  </div>

                </div>
              </section>

              {/* Right Column: Time/Shift Selector */}
              <section className="reserva-right-col">
                <h2 className="reserva-section-title">Horário da Reserva</h2>
                
                <div className="turnos-grid">
                  {/* First Shift */}
                  <div className={`turno-card ${turno === 'primeiro' ? 'selected' : ''}`}>
                    <span className="turno-label">Primeiro Turno</span>
                    <span className="turno-time">18:30 — 21:00</span>
                    <p className="turno-desc">Ideal para o pôr do sol e coquetéis iniciais.</p>
                    <button 
                      className="turno-button"
                      onClick={() => handleSelectTurno('primeiro')}
                    >
                      {turno === 'primeiro' ? 'Selecionado' : 'Selecionar'}
                    </button>
                  </div>

                  {/* Second Shift */}
                  <div className={`turno-card ${turno === 'segundo' ? 'selected' : ''}`}>
                    <span className="turno-label">Segundo Turno</span>
                    <span className="turno-time">21:30 — 00:00</span>
                    <p className="turno-desc">O ápice do requinte sob as estrelas da noite.</p>
                    <button 
                      className="turno-button"
                      onClick={() => handleSelectTurno('segundo')}
                    >
                      {turno === 'segundo' ? 'Selecionado' : 'Selecionar'}
                    </button>
                  </div>
                </div>

                {/* Courtesy Alert Info */}
                <div className="cortesia-alert-box">
                  <div className="cortesia-icon-wrapper">
                    <Info size={20} />
                  </div>
                  <div className="cortesia-content">
                    <span className="cortesia-title">Nota de Cortesia & Rotatividade</span>
                    <p className="cortesia-text">
                      Para garantir a experiência impecável de todos os nossos convidados, o salão opera em turnos fixos. Pedimos gentilmente a liberação da mesa ao fim do período selecionado para os procedimentos de higienização e preparação do próximo ciclo.
                    </p>
                  </div>
                </div>

              </section>
            </div>

            {/* Status Bar */}
            <div className="status-bar-container">
              <div className="status-bar-content">
                <div className="location-status">
                  <div className="location-icon-circle">
                    <Utensils size={18} />
                  </div>
                  <div className="location-details">
                    <span className="location-label">Localização selecionada</span>
                    <span className="location-name">JrCoffee</span>
                  </div>
                </div>

                <button 
                  className="continue-button"
                  onClick={handleContinueToStep2}
                  style={{ opacity: turno ? 1 : 0.7, cursor: turno ? 'pointer' : 'not-allowed' }}
                >
                  Continuar para Mapa de Mesas
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>

            {/* Accent Banner */}
            <div className="decor-banner-container">
              <img 
                className="decor-banner-image" 
                src="/img/interior.jpg" 
                alt="Ambiente JrCoffee decorado" 
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80';
                }}
              />
            </div>
          </>
        )}

        {/* Step 2: Table Selection */}
        {step === 2 && (
          <MesasPage 
            setStep={setStep}
            turno={turno}
            selectedFloor={selectedFloor}
            setSelectedFloor={setSelectedFloor}
            selectedTable={selectedTable}
            setSelectedTable={setSelectedTable}
          />
        )}

        {/* Step 3: Personalization */}
        {step === 3 && (
          <CasalPage
            person1Name={person1Name}
            setPerson1Name={setPerson1Name}
            person2Name={person2Name}
            setPerson2Name={setPerson2Name}
            contactName={contactName}
            setContactName={setContactName}
            contactEmail={contactEmail}
            setContactEmail={setContactEmail}
            contactWhatsapp={contactWhatsapp}
            setContactWhatsapp={setContactWhatsapp}
            contactInstagram={contactInstagram}
            setContactInstagram={setContactInstagram}
            uploadedPhoto={uploadedPhoto}
            setUploadedPhoto={setUploadedPhoto}
            specialNotes={specialNotes}
            setSpecialNotes={setSpecialNotes}
            setStep={setStep}
          />
        )}

        {/* Step 4: Menu Selection */}
        {step === 4 && (
          <MenuPage
            dbMenu={dbMenu}
            selectedEntradaId={selectedEntradaId}
            setSelectedEntradaId={setSelectedEntradaId}
            selectedPrincipal1Id={selectedPrincipal1Id}
            setSelectedPrincipal1Id={setSelectedPrincipal1Id}
            selectedPrincipal2Id={selectedPrincipal2Id}
            setSelectedPrincipal2Id={setSelectedPrincipal2Id}
            selectedSobremesa1Id={selectedSobremesa1Id}
            setSelectedSobremesa1Id={setSelectedSobremesa1Id}
            selectedSobremesa2Id={selectedSobremesa2Id}
            setSelectedSobremesa2Id={setSelectedSobremesa2Id}
            extraWine={extraWine}
            setExtraWine={setExtraWine}
            extraWater={extraWater}
            setExtraWater={setExtraWater}
            localInterest={localInterest}
            setLocalInterest={setLocalInterest}
            setStep={setStep}
          />
        )}

        {/* Step 5: Payment Selection */}
        {step === 5 && (
          <PaymentPage
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            cardName={cardName}
            setCardName={setCardName}
            cardNumber={cardNumber}
            setCardNumber={setCardNumber}
            cardExpiry={cardExpiry}
            setCardExpiry={setCardExpiry}
            cardCvv={cardCvv}
            setCardCvv={setCardCvv}
            selectedTable={selectedTable}
            selectedFloor={selectedFloor}
            turno={turno}
            extraWine={extraWine}
            extraWater={extraWater}
            onFinalize={handleCreateReservation}
            setStep={setStep}
          />
        )}

        {/* Step 6: Confirmation Screen */}
        {step === 6 && (
          <ConfirmacaoPage
            selectedTable={selectedTable}
            selectedFloor={selectedFloor}
            turno={turno}
            person1Name={person1Name}
            person2Name={person2Name}
            bookingResult={bookingResult}
            setStep={setStep}
          />
        )}
      </main>

      {/* Shared Footer */}
      <footer className="reserva-footer">
        <h2 className="reserva-footer-logo">JrCoffee</h2>
        <div className="reserva-footer-links">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
          <a href="/contact">Contact Us</a>
          <a href="/accessibility">Accessibility</a>
        </div>
        <p className="reserva-copyright">© 2026 JrCoffee</p>
      </footer>
    </div>
  );
}