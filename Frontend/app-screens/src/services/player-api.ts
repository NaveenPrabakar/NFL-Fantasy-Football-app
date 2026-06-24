import { SPRING_API_BASE_URL } from '@/services/api-config';

const API_BASE_URL = SPRING_API_BASE_URL;

export type PlayerRecord = {
  player_id: string;
  season: number;
  player: {
    name: string;
    display_name: string;
    position: string;
    position_group: string;
    headshot_url?: string;
  };
  passing?: { yards: number; tds: number; completions: number; attempts: number; interceptions: number };
  rushing?: { yards: number; tds: number; carries: number };
  receiving?: { yards: number; tds: number; receptions: number; targets: number };
  defense?: { solo_tackles: number; assist_tackles: number; interceptions: number };
  kicking?: {
    fg?: {
      made?: number;
      attempts?: number;
      missed?: number;
      blocked?: number;
      long?: number;
      pct?: number;
    };
    pat?: {
      made?: number;
      attempts?: number;
      pct?: number;
    };
  };
  fantasy?: { standard: number; ppr: number };
  [key: string]: any;
};

export async function searchPlayers(query: string, page = 1, pageSize = 20): Promise<{ items: PlayerRecord[]; page: number; totalPages: number }> {
  if (!query || query.trim().length === 0) return { items: [], page: 1, totalPages: 1 };
  console.log('[player-api] searchPlayers START', { query, page, pageSize });

  const url = `${API_BASE_URL}/player/search?name=${encodeURIComponent(query)}&page=${page}&pageSize=${pageSize}`;
  console.log('[player-api] searchPlayers fetch URL', url);
  const res = await fetch(url);
  console.log('[player-api] searchPlayers response status', res.status, res.statusText);
  if (!res.ok) {
    console.error('[player-api] searchPlayers failed response', await res.text());
    throw new Error('Player search API request failed');
  }

  const raw = await res.json();
  console.log('[player-api] searchPlayers raw', raw && (Array.isArray(raw) ? `array(${raw.length})` : Object.keys(raw || {}).slice(0,5)));

  if (Array.isArray(raw)) {
    const items = raw.map((s: string) => JSON.parse(s)) as PlayerRecord[];
    return { items, page, totalPages: 1 };
  }

  if (raw && raw.items) {
    const items = Array.isArray(raw.items) && typeof raw.items[0] === 'string'
      ? raw.items.map((s: string) => JSON.parse(s))
      : raw.items;
    return { items: items as PlayerRecord[], page: raw.page ?? page, totalPages: raw.totalPages ?? 1 };
  }

  return { items: [], page, totalPages: 1 };
}

export async function getPlayerById(id: string | number): Promise<PlayerRecord[]> {
  console.log('[player-api] getPlayerById START', { id });
  const url = `${API_BASE_URL}/player/selected?id=${encodeURIComponent(String(id))}`;
  console.log('[player-api] getPlayerById fetch URL', url);
  const res = await fetch(url);
  console.log('[player-api] getPlayerById status', res.status, res.statusText);
  if (!res.ok) {
    const body = await res.text();
    console.error('[player-api] getPlayerById failed body', body);
    throw new Error('Player lookup API request failed');
  }

  const raw = await res.json();
  console.log('[player-api] getPlayerById raw', raw && (Array.isArray(raw) ? `array(${raw.length})` : raw));
  if (Array.isArray(raw)) {
    const parsed = raw.map((s: string) => JSON.parse(s)) as PlayerRecord[];
    console.log('[player-api] getPlayerById parsed length', parsed.length);
    return parsed;
  }
  return [];
}
