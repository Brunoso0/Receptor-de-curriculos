const getBase = () => {
  const base = (process.env.REACT_APP_URL_NAMORADOS || '').trim().replace(/\/+$/, '');
  return base || 'http://localhost:3003/api';
};

const mapHorarioSlot = (horario) => {
  if (horario === '19:00' || horario === 'primeiro' || horario === 'slot_19_00') return 'slot_19_00';
  return 'slot_21_30';
};

export async function getCardapio() {
  const base = getBase();
  const res = await fetch(`${base}/v1/evento/cardapio`);
  if (!res.ok) throw new Error(`cardapio:${res.status}`);
  return res.json();
}

export async function getMesas(horario) {
  const base = getBase();
  const slot = mapHorarioSlot(horario);
  const res = await fetch(`${base}/v1/evento/mesas?horario_slot=${slot}`);
  if (!res.ok) throw new Error(`mesas:${res.status}`);
  return res.json();
}

export async function bloquearMesa(mesa_id, sessao_bloqueio) {
  const base = getBase();
  const res = await fetch(`${base}/v1/evento/mesas/bloquear`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mesa_id, sessao_bloqueio })
  });
  return res.json();
}

export async function criarReserva(payload) {
  const base = getBase();
  const res = await fetch(`${base}/v1/evento/reservas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const text = await res.text();
  try {
    const json = JSON.parse(text);
    return json;
  } catch (e) {
    return { sucesso: false, erro: 'SERVER_ERROR', detalhes: text, status: res.status };
  }
}

export async function checkinVoucher(token_voucher) {
  const base = getBase();
  const res = await fetch(`${base}/v1/evento/checkin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token_voucher })
  });
  return res.json();
}

export default { getBase, mapHorarioSlot, getCardapio, getMesas, bloquearMesa, criarReserva, checkinVoucher };
