# PRIX

Global open-call workstation for design, photography, illustration, motion, and creative tech. Client-side only — progress lives in `localStorage`.

## Run

```bash
npm install
npm run dev
```

## Data

Curated calls live in `src/data/competitions.json`. Each season:

1. Update deadlines and fees in that file
2. `npm run validate:data`
3. Optionally `npm run refresh:hints` to fill `nextCycleHint` on closed calls

Custom calls added in the UI stay in the browser and can be exported as JSON for a GitHub issue.
