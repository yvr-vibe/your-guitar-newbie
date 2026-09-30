# Fret — guitar progression practice

A static React + TypeScript guitar practice website, built for GitHub Pages.

## Features

- 100 curated exercises: 20 each for pop, rock, blues, jazz, and neo-soul.
- Key transposition, playable guitar diagrams, full or simplified voicings.
- 40–240 BPM, tap tempo, 3/4 or 4/4, editable duration for each chord.
- Web Audio scheduled metronome, eighth-note subdivision, swing, synthesized chord accompaniment, and count-in.
- Filtered random selector with repeat avoidance; adaptation challenges switch at loop boundaries with optional previews and random keys.
- Search by title, chord pattern, song, or artist; favorites and settings saved locally.
- Song and educational references with explicit notes about simplified or related harmony.
- Responsive interface, keyboard playback, shareable progression hash URLs.

## Local development

Requires Node.js 24+ and pnpm 11.19.0 (or Corepack).

```sh
corepack enable
pnpm install
pnpm dev
```

```sh
pnpm test
pnpm build
pnpm preview
```

## Deploy to GitHub Pages

Intended repository: `https://github.com/yvr-vibe/your-guitar-newbie`.

1. Create that repository on GitHub, then push this project to its `main` branch.
2. In **Settings → Pages → Build and deployment**, choose **GitHub Actions** as the source.
3. The included `.github/workflows/deploy.yml` runs the tests, builds the app, and deploys it. Run it manually if the first push happened before Pages was enabled.
4. The expected URL is `https://yvr-vibe.github.io/your-guitar-newbie/`.

The workflow derives the base path from the repository name. For a user-site repository named `yvr-vibe.github.io`, change `BASE_PATH` to `/`. No backend, tokens, or API keys are used by the app. Deployment status must be confirmed in GitHub Actions before treating the URL as live.

## Content conventions

The catalog includes common chord families and intentional practice variations; it is **not a statistically ranked top 20**. `variation` entries visibly label related listening examples instead of claiming the recording uses an exact reharmonization. Song notes explain extracts, alternate durations, and substitutions. References are educational analyses, not licensed song transcriptions, recordings, or lyrics.

Roman numerals use a major-scale reference grid in every key: `i bVI bIII bVII` in A is Am–F–C–G. Lowercase numerals denote minor quality; explicit suffixes preserve extensions. Examples are transposed for practice rather than necessarily displayed in the recording's key.

Sources and editorial limitations are documented in [CONTENT.md](CONTENT.md). The catalog lives in `src/catalog.ts`; audio scheduling in `src/audio.ts`; harmony and guitar shapes in `src/music.ts`.

Fonts load from Google Fonts with local sans-serif fallbacks. All sounds are generated locally after the user starts playback. Background tabs automatically pause practice.
