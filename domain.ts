export type Series = 'CUP' | 'XFINITY' | 'TRUCK';

export interface Driver {
  id: string;
  name: string;
  series: Series;
}

export interface CupOrg {
  id: string;
  name: string;
  carNumbers: number[]; // cars fielded in Cup
}

export interface DriverResult {
  driverId: string;
  series: Series;
  finish: number;          // 1 = winner
  stagePoints: number;     // total stage points across stages
  pole?: boolean;
  dnf?: boolean;
}

export interface CupOrgResult {
  orgId: string;
  carFinishes: number[];   // e.g., [2, 5, 10, 20]
  anyWin: boolean;
}

export interface Lineup {
  cup: string[];       // 3 driver IDs
  xfinity: string[];   // 3 driver IDs
  truck: string[];     // 2 driver IDs
  cupOrgId: string;    // e.g., 'HMS'
}

export interface WeekInputs {
  lineup: Lineup;
  driverResults: DriverResult[];
  cupOrgResult: CupOrgResult;
}

export interface ScoreBreakdownItem {
  slot: string;
  name?: string;
  points: number;
  detail: string;
}

export interface WeekScore {
  total: number;
  items: ScoreBreakdownItem[];
}
