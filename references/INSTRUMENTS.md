# Instruments: Voices and Styles

## Section voices

Each section has a `voices` object. Set a voice to `"none"` to disable that instrument.

### drums
| Voice | Description |
|---|---|
| `none` | Disabled |
| `acoustic` | Acoustic drum kit |
| `electronic` | Electronic/synth drum kit |
| `percussion` | Percussion (congas, bongos, shakers) |

### keys
| Voice | Description |
|---|---|
| `none` | Disabled |
| `piano` | Acoustic piano |
| `synth` | Synthesizer pad |
| `rhodes` | Fender Rhodes electric piano |
| `wurlitzer` | Wurlitzer electric piano |
| `organ` | Hammond-style organ |
| `harmonium` | Harmonium / reed organ |

### guitar
| Voice | Description |
|---|---|
| `none` | Disabled |
| `acoustic` | Acoustic guitar |
| `electric` | Electric guitar |

### bass
| Voice | Description |
|---|---|
| `none` | Disabled |
| `electric` | Electric bass |
| `synth` | Synth bass |
| `fingered` | Fingered bass (warm, round tone) |
| `picked` | Picked bass (bright, punchy) |

## Section styles

Each section has a `styles` object controlling how each instrument plays rhythmically.

### drums styles
`rock`, `pop`, `disco`, `funk`, `jazz`, `latin`, `reggae`, `shuffle`, `ballad`, `waltz`

### keys styles
`sustain`, `full`, `half`, `quarter`, `eighth`

- `sustain` — held chords (pads)
- `full` — whole note chords
- `half` — half note rhythm
- `quarter` — quarter note rhythm
- `eighth` — eighth note rhythm (driving)

### guitar styles
`sustain`, `simple`, `folk`, `funky`, `ballad`, `reggae`, `shuffle`, `downstrokes`, `arpeggio`, `full`, `half`, `quarter`, `eighth`

### bass styles
`sustain`, `full`, `half`, `quarter`, `eighth`

## Note track instruments

Note tracks use a `category` + `voice` pair. Valid combinations:

| Category | Voice |
|---|---|
| `keys` | `piano`, `synth`, `rhodes`, `wurlitzer`, `organ`, `harmonium` |
| `guitar` | `acoustic`, `electric` |
| `bass` | `electric`, `synth`, `fingered`, `picked` |
| `drums` | `acoustic`, `electronic`, `percussion` |

## Genre presets (suggestions)

### Rock
- drums: `acoustic` / `rock`
- keys: `piano` / `quarter` or `none`
- guitar: `electric` / `downstrokes`
- bass: `picked` / `eighth`

### Pop
- drums: `acoustic` / `pop`
- keys: `piano` / `quarter`
- guitar: `acoustic` / `simple`
- bass: `fingered` / `eighth`

### Jazz
- drums: `acoustic` / `jazz`
- keys: `rhodes` / `sustain`
- guitar: `electric` / `sustain`
- bass: `fingered` / `quarter`

### Disco / Funk
- drums: `electronic` / `funk` or `disco`
- keys: `rhodes` or `synth` / `eighth`
- guitar: `electric` / `funky`
- bass: `synth` / `eighth`

### Ballad
- drums: `acoustic` / `ballad`
- keys: `piano` / `sustain`
- guitar: `acoustic` / `arpeggio`
- bass: `fingered` / `half`

### Electronic
- drums: `electronic` / `pop`
- keys: `synth` / `eighth`
- guitar: `none`
- bass: `synth` / `eighth`

### Reggae
- drums: `acoustic` / `reggae`
- keys: `organ` / `quarter`
- guitar: `electric` / `reggae`
- bass: `electric` / `quarter`

