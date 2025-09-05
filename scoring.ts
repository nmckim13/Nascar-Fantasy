import { DriverResult, WeekInputs, WeekScore, ScoreBreakdownItem, Series, CupOrgResult } from './domain.js';

function finishPoints(series: Series, finish: number): number {
  if (finish <= 0) return 0;
  if (series === 'CUP')    return Math.max(0, 41 - finish); // 1st=40 .. 40th=1(0 if >40)
  if (series === 'XFINITY')return Math.max(0, 31 - finish); // 1st=30 .. 38th=0
  return Math.max(0, 21 - finish);                          // TRUCK: 1st=20 .. 32nd=0
}

function winBonus(series: Series): number {
  if (series === 'CUP') return 10;
  if (series === 'XFINITY') return 6;
  return 4; // TRUCK
}

function top5Bonus(series: Series): number {
  if (series === 'CUP') return 5;
  if (series === 'XFINITY') return 3;
  return 2; // TRUCK
}

function top10Bonus(series: Series): number {
  if (series === 'CUP') return 2;
  return 1; // XFINITY/TRUCK
}

function poleBonus(series: Series): number {
  if (series === 'CUP') return 2;
  return 1;
}

function dnfPenalty(series: Series): number {
  if (series === 'CUP') return -10;
  if (series === 'XFINITY') return -6;
  return -4;
}

function isTopN(finish: number, n: number) { return finish > 0 && finish <= n; }

function driverName(id: string): string {
  // In a real app, look up from DB. For example script, show ID.
  return id;
}

function scoreDriver(dr: DriverResult): number {
  let pts = 0;
  pts += finishPoints(dr.series, dr.finish);
  pts += dr.stagePoints || 0;
  if (isTopN(dr.finish, 1)) pts += winBonus(dr.series);
  if (isTopN(dr.finish, 5)) pts += top5Bonus(dr.series);
  if (isTopN(dr.finish, 10)) pts += top10Bonus(dr.series);
  if (dr.pole) pts += poleBonus(dr.series);
  if (dr.dnf) pts += dnfPenalty(dr.series);
  return pts;
}

export function scoreWeek(inputs: WeekInputs): WeekScore {
  const { lineup, driverResults, cupOrgResult } = inputs;
  const items: ScoreBreakdownItem[] = [];

  const byId = new Map(driverResults.map(r => [r.driverId, r]));

  function addDriverSlot(slot: string, driverId: string) {
    const r = byId.get(driverId);
    if (!r) { items.push({ slot, name: driverId, points: 0, detail: 'No result' }); return; }
    const pts = scoreDriver(r);
    items.push({ slot, name: driverName(driverId), points: pts, detail: `${r.series} finish ${r.finish}, stage ${r.stagePoints ?? 0}${r.pole? ', pole':''}${r.dnf? ', DNF':''}` });
  }

  lineup.cup.forEach((id, idx) => addDriverSlot(`CUP ${idx+1}`, id));
  lineup.xfinity.forEach((id, idx) => addDriverSlot(`XFINITY ${idx+1}`, id));
  lineup.truck.forEach((id, idx) => addDriverSlot(`TRUCK ${idx+1}`, id));

  // Cup Org scoring:
  const orgPts = scoreCupOrg(cupOrgResult);
  items.push({ slot: 'CUP TEAM', points: orgPts, detail: describeCupOrg(cupOrgResult) });

  const total = items.reduce((s, it) => s + it.points, 0);
  return { total, items };
}

export function scoreCupOrg(res: CupOrgResult): number {
  if (!res.carFinishes.length) return 0;
  const avg = res.carFinishes.reduce((a,b)=>a+b,0) / res.carFinishes.length;
  // Team points: roughly ~ (40 - avg) floor 0
  let pts = Math.max(0, 40 - avg);
  // Bonuses
  if (res.anyWin) pts += 5;
  const top10s = res.carFinishes.filter(f => f>0 && f<=10).length;
  if (top10s >= 2) pts += 3;
  const allTop15 = res.carFinishes.every(f => f>0 && f<=15);
  if (allTop15) pts += 5;
  return Math.round(pts * 100) / 100; // keep decimals for avg-based base
}

function describeCupOrg(res: CupOrgResult): string {
  const avg = res.carFinishes.reduce((a,b)=>a+b,0) / res.carFinishes.length;
  const top10s = res.carFinishes.filter(f => f>0 && f<=10).length;
  const extras = [
    `avg ${avg.toFixed(2)}`,
    res.anyWin ? 'win +5' : '',
    top10s >= 2 ? '≥2 top10 +3' : '',
    res.carFinishes.every(f => f>0 && f<=15) ? 'all top15 +5' : ''
  ].filter(Boolean).join(', ');
  return `cars ${JSON.stringify(res.carFinishes)} (${extras})`;
}
