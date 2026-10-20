# Fret — guitar progression practice

A static React + TypeScript guitar practice website, built for GitHub Pages.

## Features

- 100 curated exercises: 20 each for pop, rock, blues, jazz, and neo-soul.
- Key transposition, playable guitar diagrams, Basic, Triad, or Shell voicings shared by diagrams and accompaniment.
- 40–240 BPM, tap tempo, 3/4 or 4/4, shared chord-duration controls and a chord-relative beat counter.
- Web Audio scheduled metronome, selectable beat emphasis (including 2 & 4 backbeat and backbeat-only), eighth-note subdivision, swing, synthesized chord accompaniment, and count-in. Blues defaults to 2 & 4 emphasis through the genre-default setting.
- Filtered random selector with repeat avoidance; adaptation challenges switch at loop boundaries with a one-bar preview and optional random keys.
- Genre tabs plus cross-genre Favorites, ordered Beginner → Intermediate → Advanced; favorites and settings saved locally.
- Compact distinct-chord previews with full practice sequences shown in grids of up to four cards per row.
- Source and song-reference metadata retained in the catalog for editorial review.
- Collapsible Related theory notes for every progression, with arrangement-specific card labels, explanations of the Variation label, and a saved Theory labels toggle.
- Responsive interface, keyboard playback, shareable progression hash URLs.

## Local development

Requires Node.js 24+ and pnpm 11.19.0 (or Corepack).

```sh
corepack enable
pnpm install
pnpm dev
```

```sh
pnpm format:check
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

The catalog includes common chord families and intentional practice variations; it is **not a statistically ranked top 20**. `variation` entries are labeled as practice variations. Library previews and player headings list each distinct chord once; the player cards and audio preserve the full catalog sequence, including repeated bars. Song-reference metadata remains in the catalog. Song notes explain extracts, alternate durations, and substitutions. References are educational analyses, not licensed song transcriptions, recordings, or lyrics.

Roman numerals use a major-scale reference grid in every key: `i bVI bIII bVII` in A is Am–F–C–G. Lowercase numerals denote minor quality; explicit suffixes preserve extensions. Examples are transposed for practice rather than necessarily displayed in the recording's key.

Sources and editorial limitations are documented in [CONTENT.md](CONTENT.md). Source responsibilities:

- `src/App.tsx`: practice state, playback coordination, and player display.
- `src/components/`: library, player options, practice controls, fretboard, help dialog, and the shared Toggle.
- `src/settings.ts`: saved settings and validation.
- `src/practice.ts`: compact chord previews, beat counting, and difficulty ordering.
- `src/theory.ts`: original explanations, explicit card annotations, glossary definitions, and reading links.
- `src/catalog.ts`: original progression forms and editorial metadata.
- `src/audio.ts` and `src/metronome.ts`: audio scheduling and meter-aware click patterns.
- `src/music.ts` and `src/compactVoicing.ts`: harmony, basic shapes, and compact triad/shell shapes.
- `src/styles.css`: shared design tokens, component styles, then responsive rules. Switch dimensions and option typography are defined once.

Run `pnpm format` to format the source and tests. Before publishing, run formatting checks, tests, and the production build. Keep updates local until the user explicitly requests a GitHub push.

Fonts load from Google Fonts with local sans-serif fallbacks. All sounds are generated locally after the user starts playback. Background tabs automatically pause practice.

Triad mode uses three distinct chord tones on the top three strings. Shell mode keeps a bass root with the third and seventh (or sixth); plain triads remain triads. Suspended and power chords retain their basic shapes with a Basic caption. The Chord diagrams settings explain omissions and fallback behavior. Chord symbols always retain the full harmony. Legacy simplified-mode preferences migrate to Triad.

Shell mode has a saved Include extensions toggle (off by default). When enabled, the diagram and accompaniment keep the root, third, and seventh while adding the highest named extension: 9th, 11th, 13th, or altered 9th. Lower extensions and fifths may be omitted. Shapes stay within a four-fret window; if none is available, the compact shell remains and its accessible description explains the omission. Card captions remain Shell.
