# SEQULAR JSON Project Format

This document describes the canonical structure of a `.seqular.json` project export.

## Quick rules

- Generate a full `.seqular.json` object, not only the inner `project`
- Use export `version` `"1.1"`
- If there is no recorded audio, set `"tracks": []`
- For new files, use `bars` instead of the legacy `measures` field
- Each section's `chords` rows and `activeSlots` entries must match the section's `bars`
- Slot counts per bar:
  - `4/4` → `8`
  - `3/4` → `6`
  - `6/8` → `6`
  - `2/4` → `4`

## Top-level export wrapper

```json
{
  "version": "1.1",
  "exportedAt": "2026-03-29T12:00:00.000Z",
  "project": { },
  "tracks": []
}
```

## Top-level fields

| Field | Required | Type | Notes |
|---|---|---|---|
| `version` | yes | string | Use `"1.1"` for current exports |
| `exportedAt` | yes | string | ISO 8601 timestamp |
| `project` | yes | object | Main song/project data |
| `tracks` | yes | array | Recorded audio tracks; can be empty |

## `project` object

```json
{
  "id": "song_id",
  "name": "My Song",
  "bpm": 120,
  "transpose": 0,
  "timeSignature": [4, 4],
  "sections": [],
  "noteTracks": [],
  "visualization": { "showChords": true, "showInstruments": true },
  "mixerSettings": { },
  "createdAt": "2026-03-29T12:00:00.000Z",
  "updatedAt": "2026-03-29T12:00:00.000Z"
}
```

### `project` fields

- `id`: string
- `name`: string
- `bpm`: number, usually a whole number like `70`, `98`, `120`
- `transpose`: integer semitone offset, often between `-12` and `12`
- `timeSignature`: `[numerator, denominator]`, usually `[4, 4]`
- `sections`: ordered array of section objects
- `noteTracks`: optional array of manual MIDI-like note tracks
- `visualization`: optional object with booleans `showChords` and `showInstruments`
- `mixerSettings`: optional object with keys `drums`, `keys`, `guitar`, `bass`, `vocals`, `additionalTracks`
- `createdAt` / `updatedAt`: ISO timestamps

## `section` object

```json
{
  "id": "section_verse_1",
  "type": "verse",
  "bars": 4,
  "timeSignature": "4/4",
  "chords": [
    ["C", "C", "C", "C", "Am", "Am", "Am", "Am"],
    ["F", "F", "F", "F", "G", "G", "G", "G"],
    ["C", "C", "C", "C", "Am", "Am", "Am", "Am"],
    ["F", "F", "F", "F", "G", "G", "G", "G"]
  ],
  "activeSlots": [8, 8, 8, 8],
  "voices": { "drums": "acoustic", "keys": "piano", "guitar": "none", "bass": "synth" },
  "styles": { "drums": "rock", "keys": "sustain", "guitar": "sustain", "bass": "sustain" },
  "lyrics": "",
  "order": 0
}
```

### Valid section types

`intro`, `verse`, `prechorus`, `chorus`, `bridge`, `solo`, `outro`

### Valid section voices

- `drums`: `none`, `acoustic`, `electronic`, `percussion`
- `keys`: `none`, `piano`, `synth`, `rhodes`, `wurlitzer`, `organ`, `harmonium`
- `guitar`: `none`, `acoustic`, `electric`
- `bass`: `none`, `electric`, `synth`, `fingered`, `picked`

### Valid section styles

- `drums`: `rock`, `pop`, `disco`, `funk`, `jazz`, `latin`, `reggae`, `shuffle`, `ballad`, `waltz`
- `keys`: `sustain`, `full`, `half`, `quarter`, `eighth`
- `guitar`: `sustain`, `simple`, `folk`, `funky`, `ballad`, `reggae`, `shuffle`, `downstrokes`, `arpeggio`, `full`, `half`, `quarter`, `eighth`
- `bass`: typically `sustain`, `full`, `half`, `quarter`, `eighth`

### Section timing rules

- `chords` is a 2D array indexed as `[bar][slot]`
- New projects should fill every slot explicitly
- Use these slot counts per bar:

| Time signature | Slots per bar |
|---|---:|
| `4/4` | 8 |
| `3/4` | 6 |
| `6/8` | 6 |
| `2/4` | 4 |

- `activeSlots` must have one number per bar
- Each `activeSlots` value must be between `1` and the slot count for that time signature

## `noteTracks` objects

Manual note tracks live inside `project.noteTracks`.
They are the way to add custom melodies, solos, riffs, hooks, or any personalized musical
part on top of the section accompaniment. While sections define the chords, rhythm, and
backing instruments, note tracks let you place individual notes on a piano-roll grid
using any of the available instruments. Each note track plays in sync with the project
timeline during playback and export.

Use cases include:
- A piano melody over a verse progression
- A guitar solo over a bridge or solo section
- A custom bass line replacing or complementing the section bass voice
- A drum fill or percussive pattern layered on top of the section drums
- A synth hook that ties the chorus together

```json
{
  "id": "nt_1",
  "name": "HOOK",
  "category": "keys",
  "voice": "piano",
  "muted": false,
  "notes": [
    { "midi": 72, "startSlot": 0, "durationSlots": 4 }
  ]
}
```

### Valid note-track instrument combinations

- `keys:piano`
- `keys:synth`
- `keys:rhodes`
- `keys:wurlitzer`
- `keys:organ`
- `keys:harmonium`
- `guitar:acoustic`
- `guitar:electric`
- `bass:electric`
- `bass:synth`
- `bass:fingered`
- `bass:picked`
- `drums:acoustic`
- `drums:electronic`
- `drums:percussion`

### Note-track rules

- `midi`: MIDI note number
- `startSlot`: zero-based slot index across the whole project timeline
- `durationSlots`: integer `>= 1`
- Drum note tracks are treated as one-slot hits during playback

## `tracks` objects

Recorded audio tracks live in the top-level `tracks` array.
These are voice or microphone recordings captured in the Recorder tab and played back
in sync with the project. They allow adding vocals, spoken word, beatboxing, or any
live performance on top of the section arrangement and note tracks.

```json
{
  "name": "Lead Vox",
  "startPosition": 0.25,
  "muted": false,
  "mimeType": "audio/webm",
  "audioBase64": "...",
  "bpm": 120
}
```

### Recorded-track rules

- `startPosition`: normalized project position from `0` to `1`
- `audioBase64`: base64-encoded audio blob
- `bpm`: optional but supported on export/import
- If you are generating a song with no recorded audio, use `"tracks": []`

## Minimal valid song template

```json
{
  "version": "1.1",
  "exportedAt": "2026-03-29T12:00:00.000Z",
  "project": {
    "id": "demo_song",
    "name": "Demo Song",
    "bpm": 120,
    "transpose": 0,
    "timeSignature": [4, 4],
    "sections": [],
    "noteTracks": [],
    "visualization": { "showChords": true, "showInstruments": true },
    "mixerSettings": {},
    "createdAt": "2026-03-29T12:00:00.000Z",
    "updatedAt": "2026-03-29T12:00:00.000Z"
  },
  "tracks": []
}
```

## Best references

- Architecture and authoring guide: [ARCHITECTURE.md](./ARCHITECTURE.md)
- Working examples: [examples/](./examples/)