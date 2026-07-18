import { SUBMISSION_ENDPOINT } from '../config';
import type { Profile } from './profile';

export type ApplyResult = { ok: boolean; message: string };

function dataUrlToBlob(dataUrl: string): Blob {
  const [header, base64] = dataUrl.split(',');
  const mimeMatch = header.match(/data:(.*);base64/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
  const binary = atob(base64);
  const array = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) array[i] = binary.charCodeAt(i);
  return new Blob([array], { type: mime });
}

// Candidatura em um toque: usa os dados já salvos no Perfil da pessoa, sem pedir para
// preencher o formulário de novo a cada vaga.
export async function applyToCasting(castingId: string, profile: Profile): Promise<ApplyResult> {
  try {
    const form = new FormData();
    form.append('castingId', castingId);
    form.append('nome', profile.nome);
    form.append('idade', profile.idade);
    form.append('telefone', profile.telefone);
    form.append('email', profile.email);
    form.append('cidade', profile.cidade);
    form.append('instagram', profile.instagram);
    form.append('sobre', profile.sobre);
    form.append('portfolioLinks', profile.portfolioLinks.join('\n'));
    form.append('enviadoEm', new Date().toISOString());
    if (profile.fotoDataUrl) {
      form.append('foto', dataUrlToBlob(profile.fotoDataUrl), profile.fotoNome || 'foto.jpg');
    }

    if (SUBMISSION_ENDPOINT.includes('SEU-APPS-SCRIPT-URL')) {
      // Endpoint ainda não configurado: avisa em vez de fingir sucesso.
      // Veja README.md, seção "Conectar as inscrições ao Google Drive/Sheets".
      console.warn('SUBMISSION_ENDPOINT não configurado. Candidatura não foi enviada de fato.');
      return {
        ok: false,
        message:
          'O app ainda não está conectado a um servidor para receber candidaturas. Configure o SUBMISSION_ENDPOINT (veja README.md).'
      };
    }

    const res = await fetch(SUBMISSION_ENDPOINT, { method: 'POST', body: form });

    if (!res.ok) {
      return { ok: false, message: 'Não foi possível enviar sua candidatura agora. Tente novamente em instantes.' };
    }

    return { ok: true, message: 'Candidatura enviada com os dados do seu perfil! Vamos analisar e entrar em contato.' };
  } catch (err) {
    return { ok: false, message: 'Falha de conexão ao enviar a candidatura. Verifique sua internet e tente de novo.' };
  }
}
