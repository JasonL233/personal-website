This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## About page activity cards

`src/data/activityProfiles.js` contains the public account identities. The About
page displays LeetCode progress, an interactive Sketchfab Duo model and streak, and
League of Legends Solo/Duo rank. Cards stack on mobile. Each provider loads
independently through `/api/activity/{leetcode|duolingo|league}`; validated results
are cached for 15 minutes. Failed requests show an unavailable state with retry,
and an absent Duolingo username shows “Streak coming soon.” No demo statistics are
used as live data.

- **LeetCode:** calls LeetCode's undocumented GraphQL endpoint directly, using
  `allQuestionsCount`, `submitStatsGlobal.acSubmissionNum`, and
  `userProfileUserQuestionProgressV2.numFailedQuestions`.
- **Duolingo:** set `DUOLINGO_USERNAME` in `.env.local` (and your deployment's
  environment), or fill its username in `activityProfiles.js`. Calls the unofficial
  public `https://www.duolingo.com/2017-06-30/users?username=...` endpoint. Public
  access can change or be blocked; the card fails gracefully. No login password or
  session cookie is required/stored. The configured profile is `MAPLE206115`.
  Reference: [DuoDash](https://github.com/Eyozy/duodash).
- **League:** works without a key using [OP.GG's own public MCP
  service](https://github.com/opgginc/opgg-mcp), selecting `SOLORANKED` only. Its
  compact response is parsed strictly as data, without `eval`. The card identifies
  the provider and shows OP.GG's profile update date; OP.GG data can lag actual play.
  Optionally set `RIOT_API_KEY` server-side for direct [Riot
  API](https://developer.riotgames.com/apis) requests through ACCOUNT-V1 and
  LEAGUE-V4 by PUUID. An unavailable/expired Riot key falls back to OP.GG. Never
  prefix the key with `NEXT_PUBLIC_`. Win rate is wins / (wins + losses); missing
  rank or zero games displays a dash. Official rank artwork is served locally.

The Duo viewer embeds the [Duolingo model by Cëre Productions](https://sketchfab.com/3d-models/duolingo-5a2773c4b7ef45a68b5c924ff42a2e12),
with creator attribution. It loads lazily, disables Sketchfab analytics using
`dnt=1`, and requires a click to start when reduced motion is enabled. The viewer
is hosted by Sketchfab and needs a network connection. League emblems zoom by 6%
on hover or keyboard focus, with no sound. Zoom transitions respect reduced motion.
The wins/losses and win rate share one centered line and text size.

Run provider regression checks with `node --test scripts/activity-stats.test.mjs`.
Run `npm run build` to verify the production bundle.

## Day and night appearance

The navigation has a night switch and an Auto button. Auto is the default and
uses the visitor's local browser time: night from 19:00 until 07:00, day otherwise.
The clock is checked each minute and after a tab wakes or regains focus. Manual
day/night choices persist in local storage across visits and synchronize between
tabs; Auto resumes the local schedule. No location permission or API is needed.
An inline bootstrap sets the theme before the first paint.

The globe uses a higher-resolution NASA Black Marble 2016 texture, with faint
settlements preserved and city emission held constant across themes. Night mode
darkens the surface and makes city light illuminate the tree from below. Details,
source attribution, and texture rebuild instructions are in
`public/images/earth/README.md`. The source is a historical composite, not live
light-density measurements.

The tree's city-light fill is capped and eases gradually as the sampled region
changes. Small groups of 2–3 meteors sweep diagonally across the full sky from
upper right to lower left every 10 seconds of active viewing. Their staggered,
fading trails sit behind the Earth, tree, and page text. The canvas extends into
the surrounding sky without changing the model's size or position. Meteors pause
offscreen/in background tabs and are disabled when reduced motion is requested.

For a second development server alongside port 3000, use
`NEXT_DEV_DIST_DIR=.next-preview npm run dev -- --port 3001` so the previews do
not overwrite each other's build cache.

Run `node --test scripts/theme-and-city-lights.test.mjs` for schedule boundaries,
prepaint/storage fallback, map alignment, and real city/ocean sampling checks.
