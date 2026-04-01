# Seqular Song Composer — Agent Skill

An [Agent Skill](https://agentskills.io) that teaches LLMs how to compose complete songs for the [Seqular](https://seqular.app) web-based music sequencer.

Give this skill to any LLM and ask it to write a song. It will produce a valid `.seqular.json` file you can import directly into Seqular.

## What it does

The skill guides an LLM through the full songwriting process:

1. **Structure** — arrange sections (intro, verse, chorus, bridge, solo, outro)
2. **Harmony** — write chord progressions using 168 supported chord types
3. **Instrumentation** — pick voices (piano, guitar, synth, bass, drums…) and rhythmic styles per section
4. **Melody** — optionally add note tracks for solos, riffs, hooks, or custom melodies on a piano-roll grid
5. **Lyrics** — add lyrics per section
6. **Mixing** — set volume, reverb, delay, and effects per instrument

The output is a ready-to-import JSON file.

## Contents

```
seqular-song-composer/
├── SKILL.md                        # Main skill — composition instructions
├── README.md                       # This file
├── references/
│   ├── FORMAT.md                   # Complete .seqular.json format specification
│   ├── CHORDS.md                   # All 168 valid chord names + genre progressions
│   └── INSTRUMENTS.md              # All voices, styles, and genre presets
├── assets/
│   └── velvet-horizons.seqular.json  # Full example song with a Rhodes solo note track
└── scripts/
    └── validate.js                 # CLI validator for generated files
```

## Usage

### With an LLM

Provide `SKILL.md` (and optionally the reference files) as context, then prompt:

> Write a jazz ballad in Dm at 72 bpm with piano, bass, and brushed drums.
> Include a Rhodes solo over the bridge. Output a .seqular.json file.

The LLM will produce a complete JSON file following the Seqular format.

### Validate the output

```bash
node seqular-song-composer/scripts/validate.js my-song.seqular.json
```

```
✓ Valid Seqular project (7 sections, 1 note tracks)
```

### Import into Seqular

Open [seqular.app](https://seqular.app), tap **Import**, and select the `.seqular.json` file.

## Learn more

- [Agent Skills specification](https://agentskills.io/specification)
- [Seqular app](https://seqular.app)

