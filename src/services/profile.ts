import { Preferences } from '@capacitor/preferences';

export type Profile = {
  nome: string;
  idade: string;
  telefone: string;
  email: string;
  cidade: string;
  instagram: string;
  sobre: string;
  fotoDataUrl: string;
  fotoNome: string;
  portfolioLinks: string[]; // ex: Instagram, reels, YouTube, behance, site próprio
};

export const emptyProfile: Profile = {
  nome: '',
  idade: '',
  telefone: '',
  email: '',
  cidade: '',
  instagram: '',
  sobre: '',
  fotoDataUrl: '',
  fotoNome: '',
  portfolioLinks: []
};

const KEY = 'lyoys_perfil';

// Perfil fica salvo só no aparelho da pessoa (via Capacitor Preferences no app nativo,
// localStorage no navegador). Não é enviado a lugar nenhum até que ela toque em
// "Candidatar-se" numa vaga.
export async function loadProfile(): Promise<Profile | null> {
  const { value } = await Preferences.get({ key: KEY });
  if (!value) return null;
  try {
    // merge com emptyProfile para não quebrar perfis salvos antes de campos novos existirem
    return { ...emptyProfile, ...(JSON.parse(value) as Partial<Profile>) };
  } catch {
    return null;
  }
}

export async function saveProfile(profile: Profile): Promise<void> {
  await Preferences.set({ key: KEY, value: JSON.stringify(profile) });
}

export function isProfileComplete(profile: Profile | null): profile is Profile {
  if (!profile) return false;
  return Boolean(
    profile.nome && profile.idade && profile.telefone && profile.email && profile.cidade && profile.fotoDataUrl
  );
}
