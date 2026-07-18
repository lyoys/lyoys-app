import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadProfile, isProfileComplete } from '../services/profile';
import { applyToCasting } from '../services/submission';

export default function ApplyButton({ castingId }: { castingId: string }) {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleClick() {
    const profile = await loadProfile();
    if (!isProfileComplete(profile)) {
      navigate(`/perfil?candidatar=${castingId}`);
      return;
    }
    setStatus('sending');
    const res = await applyToCasting(castingId, profile);
    setStatus(res.ok ? 'ok' : 'error');
    setMessage(res.message);
  }

  if (status === 'ok') {
    return <p style={{ fontSize: '0.8rem', color: 'var(--success)', margin: 0 }}>{message}</p>;
  }

  return (
    <div>
      <button className="btn" onClick={handleClick} disabled={status === 'sending'}>
        {status === 'sending' ? 'Enviando...' : 'Candidatar-se com meu perfil'}
      </button>
      {status === 'error' && (
        <p style={{ fontSize: '0.8rem', color: 'var(--danger)', marginTop: 6 }}>{message}</p>
      )}
    </div>
  );
}
