import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ConfirmacaoPage from './ConfirmacaoPage';
import * as api from '../services/eventoApi';

export default function SuccessPage() {
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

    const paymentId = query.get('payment_id');
    const externalReference = query.get('external_reference');
    const collectionStatus = query.get('collection_status');

    if (collectionStatus === 'approved' && paymentId && externalReference) {
      // 1. Silently sync payment
      api.syncPagamento(paymentId, externalReference)
        .then((data) => {
          if (data.sucesso && data.reserva) {
            setReserva(data.reserva);
          } else {
            // Fallback load
            const lastReserva = localStorage.getItem('last_reserva_id');
            if (lastReserva) {
              return api.getReserva(lastReserva).then((res) => {
                setReserva(res.reserva || res);
              });
            }
          }
        })
        .then(() => {
          // 2. Clear booking from localStorage
          localStorage.removeItem('reserva_state_v1');
          localStorage.removeItem('last_reserva_id');
          setLoading(false);
        })
        .catch((err) => {
          console.warn('Erro ao sincronizar pagamento:', err);
          // Fallback load
          const lastReserva = localStorage.getItem('last_reserva_id');
          if (lastReserva) {
            api.getReserva(lastReserva)
              .then((data) => {
                setReserva(data.reserva || data);
                setLoading(false);
              })
              .catch(() => setLoading(false));
          } else {
            setLoading(false);
          }
        });
    } else {
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
        // no local reserva id, try to redirect to main reserva page after short timeout
        setTimeout(() => setLoading(false), 400);
      }
    }
  }, [location.search]);

  if (loading) return <div style={{ padding: 40 }}>Carregando confirmação...</div>;

  // If reservation data available, render ConfirmacaoPage passing bookingResult
  if (reserva) {
    return (
      <ConfirmacaoPage
        bookingResult={reserva}
        selectedTable={reserva.mesa || reserva.mesa_id}
        selectedFloor={reserva.andar || reserva.selectedFloor}
        turno={reserva.turno || reserva.horario_slot}
      />
    );
  }

  // Fallback generic confirmation using MP params
  return (
    <div style={{ padding: 28 }}>
      <h1>Pagamento recebido</h1>
      <p>Obrigado! O Mercado Pago retornou os seguintes parâmetros:</p>
      <pre style={{ whiteSpace: 'pre-wrap', background: '#f7f7f7', padding: 12 }}>{JSON.stringify(mpParams, null, 2)}</pre>
      <p>
        Se você não foi redirecionado automaticamente para sua reserva, volte para a página de reservas.
      </p>
      <button onClick={() => navigate('/reserva')}>Voltar às Reservas</button>
    </div>
  );
}
