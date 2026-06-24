import type { PlayerRecord } from '@/services/player-api';
import { SPRING_API_BASE_URL } from '@/services/api-config';

export type GraphMetricConfig = {
  metric: string;
  label: string;
  description: string;
};

type GraphPositionConfig = {
  positionKey: string;
  title: string;
  metrics: GraphMetricConfig[];
};

const GRAPH_POSITION_CONFIGS: Record<string, GraphPositionConfig> = {
  qb: {
    positionKey: 'qb',
    title: 'Quarterback Analysis',
    metrics: [
      { metric: 'fantasy-points', label: 'Fantasy Points', description: 'Fantasy output by season.' },
      { metric: 'career-passing-yards', label: 'Career Passing Yards', description: 'Career passing yards across seasons.' },
    ],
  },
  rb: {
    positionKey: 'rb',
    title: 'Running Back Analysis',
    metrics: [
      { metric: 'fantasy-points', label: 'Fantasy Points', description: 'Fantasy output by season.' },
      { metric: 'career-rushing-yards', label: 'Career Rushing Yards', description: 'Career rushing yards across seasons.' },
    ],
  },
  'wr-te': {
    positionKey: 'wr-te',
    title: 'Pass Catcher Analysis',
    metrics: [
      { metric: 'fantasy-points', label: 'Fantasy Points', description: 'Fantasy output by season.' },
      { metric: 'career-receiving-yards', label: 'Career Receiving Yards', description: 'Career receiving yards across seasons.' },
    ],
  },
  kicker: {
    positionKey: 'kicker',
    title: 'Kicker Analysis',
    metrics: [
      { metric: 'field-goal-percentage', label: 'Field Goal %', description: 'Field goal accuracy by season.' },
      { metric: 'career-fg-attempts', label: 'Career FG Attempts', description: 'Career field goal attempts across seasons.' },
    ],
  },
};

function normalizePosition(value?: string | null) {
  return value?.trim().toUpperCase() ?? '';
}

export function getGraphPositionKey(player: PlayerRecord['player']) {
  const position = normalizePosition(player.position);
  const group = normalizePosition(player.position_group);

  if (position === 'QB' || group === 'QB') return 'qb';
  if (position === 'RB' || group === 'RB') return 'rb';
  if (position === 'WR' || position === 'TE' || group === 'WR' || group === 'TE') return 'wr-te';
  if (position === 'K' || group === 'K' || group === 'SPEC') return 'kicker';
  return null;
}

export function getGraphConfigForPlayer(player: PlayerRecord['player']) {
  const positionKey = getGraphPositionKey(player);
  if (!positionKey) return null;
  return GRAPH_POSITION_CONFIGS[positionKey] ?? null;
}

export function getGraphImageUrl(player: PlayerRecord['player'], metric: string) {
  const positionKey = getGraphPositionKey(player);
  if (!positionKey) return null;

  const playerName = player.display_name || player.name;
  return `${SPRING_API_BASE_URL}/graph/${positionKey}/${metric}/image?player=${encodeURIComponent(playerName)}`;
}
