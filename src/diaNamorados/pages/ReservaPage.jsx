import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ReservaPage() {
  const navigate = useNavigate();

  return (
    <div className="namorados-page">
      <h1>Reserva - Em Breve</h1>
      <p>O fluxo de reserva será implementado nas próximas etapas.</p>
      <button onClick={() => navigate('/')}>Voltar para o Início</button>
    </div>
  );
}
  