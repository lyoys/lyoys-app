import { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { loadProfile, saveProfile, emptyProfile, isProfileComplete, Profile } from '../services/profile';
import { applyToCasting } from '../services/submission';
import { useCastingCalls } from '../services/castingSource';
import ApplyButton from '../components/ApplyButton';
import { MAX_PHOTO_MB } from '../config';

export default function Perfil() {
  const [params, setParams] = useSearchParams();
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [loaded, setLoaded] = useState(false);
  const [salvo, setSalvo] = useState(false);
  const [erroArquivo, setErroArquivo] = useState('');
  const [autoStatus, setAutoStatus] = useState<{ ok: boolean; message: string } | null>(null);

  useEffect(() => {
    loadProfile().then((p) => {
      if (p) setProfile(p);
      setLoaded(true);
    });
  }, []);

  // Se a pessoa veio de um botão "Candidatar-se" sem perfil completo, assim que ela
  // salvar aqui e o perfil ficar completo, candidata automaticamente para a vaga de origem.
  useEffect(() => {
    const candidatar = params.get('candidatar');
    if (!loaded || !candidatar || !isProfileComplete(profile)) return;
    applyToCasting(candidatar, profile).then((res) => {
      setAutoStatus(res);
      const next = new URLSearchParams(params);
      next.delete('candidatar');
      setParams(next, { replace: true });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, profile.fotoDataUrl]);

  function handleFoto(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > MAX_PHOTO_MB * 1024 * 1024) {
      setErroArquivo(`A foto deve ter no máximo ${MAX_PHOTO_MB}MB.`);
      return;
    }
    setErroArquivo('');
    const reader = new FileReader();
    reader.onload = () => setProfile((p) => ({ ...p, fotoDataUrl: reader.result as string, fotoNome: f.name }));
    reader.readAsDataURL(f);
  }

  function handlePortfolioLinks(texto: string) {
    setProfile((p) => ({ ...p, portfolioLinks: texto.split('\n') }));
  }

  async function handleSalvar(e: FormEvent) {
    e.preventDefault();
    const perfilLimpo = { ...profile, portfolioLinks: profile.portfolioLinks.map((l) => l.trim()).filter(Boolean) };
    await saveProfile(perfilLimpo);
    setProfile(perfilLimpo);
    setSalvo(true);
    setTimeout(() => setSalvo(false), 2500);
  }

  const { calls } = useCastingCalls();
  const abertas = calls.filter((c) => c.status === 'aberta');
  const completo = isProfileComplete(profile);

  return (
    <div>
      <h1>Meu perfil</h1>
      <p style={{ color: 'var(--text-muted)' }}>
        Preencha seus dados uma vez. Com o perfil completo, você se candidata às vagas próprias
        da Lyoys com um toque, sem preencher formulário de novo.
      </p>

      {autoStatus && <div className={autoStatus.ok ? 'success-box' : 'error-box'}>{autoStatus.message}</div>}
      {salvo && <div className="success-box">Perfil salvo neste dispositivo.</div>}

      <form className="card" onSubmit={handleSalvar}>
        <div className="field">
          <label>Nome completo</label>
          <input value={profile.nome} onChange={(e) => setProfile({ ...profile, nome: e.target.value })} required />
        </div>

        <div className="grid-2">
          <div className="field">
            <label>Idade</label>
            <input
              type="number"
              min={0}
              value={profile.idade}
              onChange={(e) => setProfile({ ...profile, idade: e.target.value })}
              required
            />
          </div>
          <div className="field">
            <label>Cidade</label>
            <input value={profile.cidade} onChange={(e) => setProfile({ ...profile, cidade: e.target.value })} required />
          </div>
        </div>

        <div className="grid-2">
          <div className="field">
            <label>Telefone / WhatsApp</label>
            <input value={profile.telefone} onChange={(e) => setProfile({ ...profile, telefone: e.target.value })} required />
          </div>
          <div className="field">
            <label>E-mail</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="field">
          <label>Instagram (opcional)</label>
          <input
            placeholder="@seuperfil"
            value={profile.instagram}
            onChange={(e) => setProfile({ ...profile, instagram: e.target.value })}
          />
        </div>

        <div className="field">
          <label>Conte um pouco sobre você</label>
          <textarea
            value={profile.sobre}
            onChange={(e) => setProfile({ ...profile, sobre: e.target.value })}
            placeholder="Experiência artística, disponibilidade, o que você busca..."
          />
        </div>

        <div className="field">
          <label>Foto de perfil (obrigatório, até {MAX_PHOTO_MB}MB)</label>
          <input type="file" accept="image/*" onChange={handleFoto} />
          {profile.fotoNome && (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Selecionada: {profile.fotoNome}</span>
          )}
        </div>

        {erroArquivo && <div className="error-box">{erroArquivo}</div>}

        <button type="submit" className="btn">Salvar perfil</button>
      </form>

      <h2>Portfólio</h2>
      <div className="card">
        <div className="field">
          <label>Links (Instagram, reels, YouTube, behance, site próprio...) — um por linha</label>
          <textarea
            value={profile.portfolioLinks.join('\n')}
            onChange={(e) => handlePortfolioLinks(e.target.value)}
            placeholder={'https://instagram.com/seuperfil\nhttps://youtube.com/...'}
          />
        </div>

        <button
          type="button"
          className="btn"
          style={{ marginTop: 12 }}
          onClick={() =>
            saveProfile({ ...profile, portfolioLinks: profile.portfolioLinks.map((l) => l.trim()).filter(Boolean) }).then(() => {
              setSalvo(true);
              setTimeout(() => setSalvo(false), 2500);
            })
          }
        >
          Salvar portfólio
        </button>
      </div>

      <h2>Vagas abertas</h2>
      {!completo && (
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Complete e salve seu perfil acima para poder se candidatar com um toque nas vagas da
          Lyoys.
        </p>
      )}
      {abertas.map((c) => (
        <div className="card" key={c.id}>
          <span className={`badge ${c.origem === 'lyoys' ? 'lyoys' : 'terceiros'}`}>
            {c.origem === 'lyoys' ? 'Projeto Lyoys' : `Divulgação · ${c.parceiro}`}
          </span>
          <p style={{ fontWeight: 500, margin: '8px 0 10px' }}>{c.titulo}</p>
          {c.origem === 'lyoys' ? (
            <ApplyButton castingId={c.id} />
          ) : (
            <Link to={`/casting/${c.id}`} className="btn secondary">Ver mais informações</Link>
          )}
        </div>
      ))}
    </div>
  );
}
