import { scoreWeek } from './scoring.js';
import { WeekInputs } from './domain.js';

const sample: WeekInputs = {
  lineup: {
    cup: ['Larson','Hamlin','Logano'],
    xfinity: ['Mayer','Herbst','Custer'],
    truck: ['Majeski','Heim'],
    cupOrgId: 'HMS'
  },
  driverResults: [
    { driverId:'Larson', series:'CUP', finish:2, stagePoints:15, pole:false, dnf:false },
    { driverId:'Hamlin', series:'CUP', finish:10, stagePoints:8, pole:false, dnf:false },
    { driverId:'Logano', series:'CUP', finish:36, stagePoints:0, pole:false, dnf:true },

    { driverId:'Mayer', series:'XFINITY', finish:1, stagePoints:8, pole:false, dnf:false },
    { driverId:'Herbst', series:'XFINITY', finish:12, stagePoints:2, pole:false, dnf:false },
    { driverId:'Custer', series:'XFINITY', finish:8, stagePoints:5, pole:false, dnf:false },

    { driverId:'Majeski', series:'TRUCK', finish:4, stagePoints:6, pole:false, dnf:false },
    { driverId:'Heim', series:'TRUCK', finish:9, stagePoints:3, pole:false, dnf:false },
  ],
  cupOrgResult: {
    orgId:'HMS',
    carFinishes: [2,5,10,20],
    anyWin: true
  }
};

const result = scoreWeek(sample);
console.log('Total:', result.total);
for (const it of result.items) {
  console.log(`${it.slot.padEnd(10)} ${String(it.name ?? '').padEnd(10)} ${it.points.toFixed(2)} — ${it.detail}`);
}
