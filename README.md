# Fantasy NASCAR MVP (Engine-first)

This is a **TypeScript engine** for a Fantasy NASCAR app (Cup/Xfinity/Truck) modeled after your custom rulebook.

## Features
- Roster format: 3 Cup, 3 Xfinity, 2 Truck, 1 Cup Team
- Scoring weighted by series (Cup > Xfinity > Truck), **no multipliers**
- Cup Team scoring by average finish + team bonuses
- Playoff Points (PP) system: accumulate during weeks 1–26; reset rounds with Base 1000 + PP; cut rounds; final head-to-head
- Snake draft helper
- Example script to score a week and print breakdown

## Getting Started
1. Ensure Node 18+ is installed.
2. `npm i` (dev deps only)
3. `npm run build`
4. `npm run example`

## Next Steps
- Add a database (e.g., Postgres + Prisma) or SQLite
- Build REST/GraphQL API
- Add a web/mobile UI (Next.js/React Native)
