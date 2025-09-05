export type PlayoffRound = 'R10' | 'R8' | 'R6' | 'CHAMP2';

export interface TeamSeed {
  teamId: string;
  playoffPoints: number; // from weeks 1-26 (no cap)
  seed: number;          // 1..10
}

export interface RoundState {
  round: PlayoffRound;
  baseline: number;             // e.g., 1000
  carryPP: boolean;             // PP carry every round
  teams: {
    teamId: string;
    seed: number;
    startPoints: number;        // baseline + PP
    weekly: number[];           // 3 weeks for R10/R8/R6; 1 week for CHAMP2
  }[];
}

export function initRound(round: PlayoffRound, seeds: TeamSeed[], baseline = 1000): RoundState {
  return {
    round,
    baseline,
    carryPP: true,
    teams: seeds.map(s => ({
      teamId: s.teamId,
      seed: s.seed,
      startPoints: baseline + s.playoffPoints,
      weekly: []
    }))
  };
}

export function addWeekScore(state: RoundState, teamId: string, score: number) {
  const t = state.teams.find(t => t.teamId === teamId);
  if (!t) throw new Error('Team not in round');
  t.weekly.push(score);
}

export function standings(state: RoundState) {
  return state.teams.map(t => ({
    teamId: t.teamId,
    seed: t.seed,
    total: t.startPoints + t.weekly.reduce((a,b)=>a+b,0),
    bestWeek: t.weekly.length? Math.max(...t.weekly):0,
    cupWinsInRound: 0 // placeholder for tiebreak calc, integrate later
  })).sort((a,b)=> b.total - a.total || b.bestWeek - a.bestWeek || a.seed - b.seed);
}

export function cutCount(round: PlayoffRound): number {
  if (round === 'R10') return 2;
  if (round === 'R8') return 2;
  if (round === 'R6') return 4;
  return 0; // CHAMP2
}

export function advanceTeams(state: RoundState): string[] {
  const cut = cutCount(state.round);
  const table = standings(state);
  return table.slice(0, table.length - cut).map(r => r.teamId);
}
