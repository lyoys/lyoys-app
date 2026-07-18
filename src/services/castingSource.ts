import { useEffect, useState } from 'react';
import { Preferences } from '@capacitor/preferences';
import { CASTING_DATA_URL } from '../config';
import { CastingCall, defaultCastingCalls } from '../data/castingCalls';

const CACHE_KEY = 'lyoys_casting_cache';

// Parser simples de CSV com suporte a campos entre aspas (permite vírgulas dentro do
// texto, que é como o Google Sheets exporta quando "Publicar na web > CSV" é usado).
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && next === '\n') i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((cell) => cell.trim() !== ''));
}

// Colunas esperadas na planilha (a ordem não importa, os nomes do cabeçalho sim):
// id, titulo, categoria, descricao, requisitos, local, dataLimite, status, origem, parceiro
// requisitos: separados por ponto e vírgula (;)
function csvToCastingCalls(text: string): CastingCall[] {
  const rows = parseCsv(text);
  if (rows.length < 2) return [];

  const header = rows[0].map((h) => h.trim().toLowerCase());
  const idx = (name: string) => header.indexOf(name);

  return rows
    .slice(1)
    .map((cols): CastingCall | null => {
      const get = (name: string) => (idx(name) >= 0 ? (cols[idx(name)] ?? '').trim() : '');
      const id = get('id');
      const titulo = get('titulo');
      if (!id || !titulo) return null;

      const statusRaw = get('status').toLowerCase();
      const origemRaw = get('origem').toLowerCase();
      const parceiro = get('parceiro');

      return {
        id,
        titulo,
        categoria: get('categoria'),
        descricao: get('descricao'),
        requisitos: get('requisitos').split(';').map((r) => r.trim()).filter(Boolean),
        local: get('local'),
        dataLimite: get('datalimite'),
        status: statusRaw === 'encerrada' ? 'encerrada' : 'aberta',
        origem: origemRaw === 'terceiros' ? 'terceiros' : 'lyoys',
        parceiro: parceiro || undefined
      };
    })
    .filter((c): c is CastingCall => c !== null);
}

async function loadCachedOrDefault(): Promise<CastingCall[]> {
  const { value } = await Preferences.get({ key: CACHE_KEY });
  if (value) {
    try {
      const parsed = JSON.parse(value) as CastingCall[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {
      // cache corrompido, ignora e cai no fallback
    }
  }
  return defaultCastingCalls;
}

// Busca as chamadas de casting na planilha publicada. Se a URL ainda não foi
// configurada, se a rede falhar ou a planilha estiver vazia/mal formatada, usa a última
// cópia salva no aparelho (cache) e, na ausência dela, os dados padrão embutidos no app.
export async function fetchCastingCalls(): Promise<CastingCall[]> {
  if (CASTING_DATA_URL.includes('SUA-PLANILHA-PUBLICADA')) {
    return loadCachedOrDefault();
  }

  try {
    const res = await fetch(CASTING_DATA_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    const calls = csvToCastingCalls(text);
    if (calls.length === 0) throw new Error('Planilha vazia ou em formato inesperado');
    await Preferences.set({ key: CACHE_KEY, value: JSON.stringify(calls) });
    return calls;
  } catch (err) {
    console.warn('Não foi possível buscar vagas remotas, usando cache/local:', err);
    return loadCachedOrDefault();
  }
}

// Hook usado pelas telas: já entrega os dados padrão imediatamente (tela nunca fica em
// branco) e troca pelos dados remotos/cache assim que a busca terminar.
export function useCastingCalls() {
  const [calls, setCalls] = useState<CastingCall[]>(defaultCastingCalls);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ativo = true;
    fetchCastingCalls()
      .then((data) => {
        if (ativo) setCalls(data);
      })
      .finally(() => {
        if (ativo) setLoading(false);
      });
    return () => {
      ativo = false;
    };
  }, []);

  return { calls, loading };
}
