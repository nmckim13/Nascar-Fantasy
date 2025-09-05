export interface DraftPick {
  overall: number;
  teamId: string;
  round: number;
  slot: number;
  selection: string; // driverId/orgId
}

export function snakeOrder(teamIds: string[], rounds: number): DraftPick[] {
  const picks: DraftPick[] = [];
  const n = teamIds.length;
  let overall = 1;
  for (let r=1; r<=rounds; r++) {
    const order = r % 2 === 1 ? teamIds : [...teamIds].reverse();
    order.forEach((teamId, idx) => {
      picks.push({ overall, teamId, round: r, slot: idx+1, selection: '' });
      overall++;
    });
  }
  return picks;
}
