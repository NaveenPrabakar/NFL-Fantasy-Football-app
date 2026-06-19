const API_BASE_URL = 'http://localhost:8080';

export type Player = {
  id?: string | number;
  name: string;
  position?: string;
  team?: string;
  [key: string]: any;
};

export async function searchPlayers(query: string, page = 1, pageSize = 20): Promise<{ items: Player[]; page: number; totalPages: number }> {
  if (!query || query.trim().length === 0) return { items: [], page: 1, totalPages: 1 };

  try {
    const res = await fetch(`${API_BASE_URL}/player/search?name=${encodeURIComponent(query)}&page=${page}&pageSize=${pageSize}`);
    if (!res.ok) throw new Error('Player API request failed');
    const raw = await res.json();
    // backend may return List<String> or an object with items
    if (Array.isArray(raw) && raw.length > 0 && typeof raw[0] === 'string') {
      const items = raw.map((s: string) => JSON.parse(s)) as Player[];
      return { items, page, totalPages: 1 };
    }

    if (raw && raw.items) {
      return { items: raw.items as Player[], page: raw.page ?? page, totalPages: raw.totalPages ?? 1 };
    }

    return { items: (raw as Player[]) ?? [], page, totalPages: 1 };
  } catch (err) {
    // Fallback mock data when backend is unavailable
    const mock: Player[] = [
      { id: 1, name: 'Patrick Mahomes', position: 'QB', team: 'KC' },
      { id: 2, name: 'Josh Allen', position: 'QB', team: 'BUF' },
      { id: 3, name: 'Justin Jefferson', position: 'WR', team: 'MIN' },
    ];

    const filtered = mock.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);
    return { items, page, totalPages: Math.max(1, Math.ceil(filtered.length / pageSize)) };
  }
}

export async function getPlayerById(id: string | number): Promise<Player | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/player/selected?id=${encodeURIComponent(String(id))}`);
    if (!res.ok) throw new Error('Player API request failed');
    const raw = await res.json();
    if (Array.isArray(raw) && raw.length > 0 && typeof raw[0] === 'string') {
      return JSON.parse(raw[0]) as Player;
    }
    return (raw as Player) ?? null;
  } catch (err) {
    const mock: Player[] = [
      { id: 1, name: 'Patrick Mahomes', position: 'QB', team: 'KC', stats: { passingYards: 5200 } },
      { id: 2, name: 'Josh Allen', position: 'QB', team: 'BUF', stats: { passingYards: 4800 } },
      { id: 3, name: 'Justin Jefferson', position: 'WR', team: 'MIN', stats: { receivingYards: 1700 } },
    ];

    const found = mock.find((p) => String(p.id) === String(id) || p.name === id);
    return found ?? null;
  }
}
