import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sofa, Layers, Camera, Utensils, CheckCircle2, Info } from 'lucide-react';
import '../styles/home.css';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleReservation = () => {
    navigate('/reserva');
  };

  return (
    <div className="namorados-page">
      <section className="hero-section">
        <div className="hero-content">
          {/* <button className="primary-button" onClick={handleReservation}>
            Reservar Minha Experiência
          </button> */}
        </div>
      </section>

      <section className="namorados-section">
        <div className="section-header">
          <h2 className="section-title">Sua Jornada JrCoffee</h2>
        </div>

        <div className="journey-grid">
          <div className="journey-card">
            <div className="card-icon-box">
              <span>01</span>
              <Sofa size={40} strokeWidth={1} />
            </div>
            <h3 className="card-title">Configuração</h3>
            <p className="card-text">Escolha entre uma mesa para casal ou grupo. Selecione seu turno: 18:30-21:30 ou 21:30-00:00.</p>
          </div>

          <div className="journey-card">
            <div className="card-icon-box">
              <span>02</span>
              <Layers size={40} strokeWidth={1} />
            </div>
            <h3 className="card-title">Seleção de Mesa</h3>
            <p className="card-text">Explore nosso mapa interativo em dois andares e reserve o local perfeito para sua intimidade.</p>
          </div>

          <div className="journey-card">
            <div className="card-icon-box">
              <span>03</span>
              <Camera size={40} strokeWidth={1} />
            </div>
            <h3 className="card-title">Personalização</h3>
            <p className="card-text">Envie uma foto especial e pedidos de surpresa. Cuidaremos para que cada detalhe surpreenda.</p>
          </div>

          <div className="journey-card">
            <div className="card-icon-box">
              <span>04</span>
              <Utensils size={40} strokeWidth={1} />
            </div>
            <h3 className="card-title">Menu Curado</h3>
            <p className="card-text">Escolha suas entradas, pratos principais e sobremesas antecipadamente para uma noite fluida.</p>
          </div>
        </div>

        <div className="section-header">
            <button className="primary-button button-header" onClick={handleReservation}>
            Reservar Minha Experiência
          </button>
        </div>

        

        <div className="atmosphere-section">
          <div className="image-grid">
            <img className="tall image-grid-namorados-1" src="/img/henrique.jpeg" alt="Saxofonista" />
            <img className="image-grid-namorados-2" src="/img/maosdadas.jpeg" alt="mãos dadas" />
            <img className="image-grid-namorados-3" src="/img/casal-reserva.jpeg" alt="casal" />
            <img className="image-grid-namorados-4" src="/img/taça.jpeg" alt="taças" />
          </div>

          <div className="atmosphere-content">
            <p className="gold-overline">TEMA VELVET & GOLD</p>
            <h2 className="atmosphere-title">Uma Atmosfera de Intimidade Pura</h2>
            <p className="atmosphere-text">
              No JrCoffee, acreditamos que o amor deve ser celebrado com a mesma dedicação que aplicamos ao nosso café premiado. Para esta noite especial, transformamos nosso espaço em um santuário de elegância sutil.
            </p>
            
            <ul className="checklist">
              <li className="checklist-item">
                <CheckCircle2 size={20} />
                Música ambiente suave e curada
              </li>
              <li className="checklist-item">
                <CheckCircle2 size={20} />
                Iluminação de velas
              </li>
              <li className="checklist-item">
                <CheckCircle2 size={20} />
                Serviço de mesa atento e discreto
              </li>
            </ul>
          </div>
        </div>

        <div className="policy-box">
          <div className="policy-icon">
            <Info size={32} />
          </div>
          <h3 className="policy-title">Política de Turnover</h3>
          <p className="policy-text">
            Para garantir que todos os casais desfrutem da mesma qualidade de experiência, operamos com turnos fixos. Pedimos gentilmente que a mesa seja liberada ao final de seu horário selecionado para que nossa equipe realize a higienização e preparação completa para os próximos convidados.
          </p>
          <p className="shifts-text">TURNO 1: 19:00 - 21:00 | TURNO 2: 21:30 - 23:30</p>
        </div>
      </section>

      <section className="cta-section">
        <h2 className="cta-title">Pronto para viver esta experiência?</h2>
        <p className="cta-subtitle">
          As vagas são limitadas e a exclusividade é o nosso compromisso.<br/>
          Reserve agora o seu lugar na JrCoffee.
        </p>
        <button className="primary-button" onClick={handleReservation}>
          Iniciar Reserva Agora
        </button>
      </section>

      <footer className="namorados-footer">
        <h2 className="footer-logo">JrCoffee</h2>
        <div className="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact Us</a>
          <a href="#">Accessibility</a>
        </div>
        <p className="copyright">© 2026 JrCoffee</p>
      </footer>
    </div>
  );
}