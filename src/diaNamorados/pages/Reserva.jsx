import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Users, Info, Utensils, ArrowRight, Check } from 'lucide-react';
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
  const [uploadedPhoto, setUploadedPhoto] = useState({
    name: 'foto_casal_2024.jpg',
    size: '2.4 MB',
    preview: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=150'
  });
  const [specialNotes, setSpecialNotes] = useState('');

  // Step 4 (Menu Selection) State
  const [selectedEntrada, setSelectedEntrada] = useState('tabua'); // 'tabua' or 'bruschetta'
  const [risotoP1, setRisotoP1] = useState(1);
  const [risotoP2, setRisotoP2] = useState(0);
  const [wellingtonP1, setWellingtonP1] = useState(1);
  const [wellingtonP2, setWellingtonP2] = useState(1);
  const [salmonP1, setSalmonP1] = useState(0);
  const [salmonP2, setSalmonP2] = useState(0);
  const [dessert1Qty, setDessert1Qty] = useState(1);
  const [dessert2Qty, setDessert2Qty] = useState(1);
  const [extraWine, setExtraWine] = useState(false);
  const [extraWater, setExtraWater] = useState(false);
  const [localInterest, setLocalInterest] = useState(false);

  // Step 5 (Payment Selection) State
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' or 'pix'
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

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
            selectedEntrada={selectedEntrada}
            setSelectedEntrada={setSelectedEntrada}
            risotoP1={risotoP1}
            setRisotoP1={setRisotoP1}
            risotoP2={risotoP2}
            setRisotoP2={setRisotoP2}
            wellingtonP1={wellingtonP1}
            setWellingtonP1={setWellingtonP1}
            wellingtonP2={wellingtonP2}
            setWellingtonP2={setWellingtonP2}
            salmonP1={salmonP1}
            setSalmonP1={setSalmonP1}
            salmonP2={salmonP2}
            setSalmonP2={setSalmonP2}
            dessert1Qty={dessert1Qty}
            setDessert1Qty={setDessert1Qty}
            dessert2Qty={dessert2Qty}
            setDessert2Qty={setDessert2Qty}
            extraWine={extraWine}
            setExtraWine={setExtraWine}
            extraWater={extraWater}
            setExtraWater={setExtraWater}
            localInterest={localInterest}
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