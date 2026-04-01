---
name: "Seqular Song Composer"
description: "Compose complete songs as Seqular project files (.seqular.json). Produces valid JSON with sections, chord progressions, instrument voicings, styles, optional note tracks (melodies/solos), and lyrics - ready to import into the Seqular web-based music sequencer."
version: "1.0.0"
author: "seqular"
tags:
  - music
  - composition
  - sequencer
  - songwriting
  - midi
  - json
---

# Seqular Song Composer

You compose songs for the Seqular music sequencer by generating `.seqular.json` files.
Seqular is a web-based DAW that plays back songs using built-in synthesized instruments.

## What you produce

A complete JSON file that Seqular can import. It contains:
- **Sections** (intro, verse, chorus, bridge, solo, outro) with chord progressions, instrument voicings, and rhythmic styles
- **Note tracks** (optional) for custom melodies, solos, riffs, or hooks placed on a piano-roll grid
- **Lyrics** per section (optional)
- **Mixer settings** (optional) for volume, reverb, delay, and effects per instrument

## Step-by-step composition process

### 1. Decide the song structure

Choose an arrangement of sections. Typical examples:
- Pop: intro → verse → chorus → verse → chorus → bridge → chorus → outro
- Rock: intro → verse → verse → chorus → solo → chorus → outro
- Jazz: intro → verse → verse → bridge → verse → outro
- Ballad: intro → verse → chorus → verse → chorus → outro

### 2. Set the global parameters

- **bpm**: tempo (30–300). Pop: 100–130, Rock: 110–150, Ballad: 60–80, Jazz: 80–160
- **transpose**: semitone shift (usually 0)
- **timeSignature**: usually `[4, 4]`. Use `[3, 4]` for waltzes, `[6, 8]` for compound time.

### 3. Write chord progressions for each section

Each section has a 2D `chords` array: `[bar][slot]`. In 4/4 time, each bar has 8 slots (8th-note resolution). Fill every slot with a valid chord name.

Common patterns:
- **Same chord all bar**: `["Am", "Am", "Am", "Am", "Am", "Am", "Am", "Am"]`
- **Two chords per bar**: `["C", "C", "C", "C", "G", "G", "G", "G"]`
- **Four chords per bar**: `["C", "C", "Am", "Am", "F", "F", "G", "G"]`

See `references/CHORDS.md` for the full list of valid chord names.

### 4. Choose instruments and styles for each section

Each section has `voices` (which instrument) and `styles` (how it plays).
Set any voice to `"none"` to disable that instrument in the section.

Build the arrangement by varying voices/styles across sections:
- Intro: sparse (keys only, or drums + keys)
- Verse: add bass, keep it moderate
- Chorus: full band, energetic styles
- Bridge: strip back, change voicing
- Solo: spotlight one instrument

See `references/INSTRUMENTS.md` for all valid voices and styles.

### 5. Add note tracks for melodies or solos (optional)

Note tracks let you place individual MIDI notes on a timeline grid.
Each note has `midi` (note number), `startSlot` (position), and `durationSlots` (length).

Slots are numbered sequentially across the whole project. Each slot = one 8th note.
A section with 4 bars in 4/4 uses 32 slots. The next section starts at slot 32.

To calculate a note's startSlot:
1. Sum slots of all preceding sections: bars × slotsPerBar
2. Add the slot offset within the current section

See `references/FORMAT.md` for note track rules and instrument combos.

### 6. Add lyrics (optional)

Each section has a `lyrics` string. Use `\n` for line breaks.

### 7. Assemble the final JSON

Use the wrapper format with `version`, `exportedAt`, `project`, and `tracks`.
If no recorded audio, set `"tracks": []`.

See `references/FORMAT.md` for the complete field reference and a minimal template.

## Musical guidelines

- **Key consistency**: keep chords within the same key across sections. Use the circle of fifths for modulations.
- **Contrast**: vary energy between sections (sparse verse → full chorus).
- **Bass matters**: a good bass voice adds depth. Use `"fingered"` for funk, `"synth"` for electronic, `"electric"` for rock.
- **Drum styles set the genre**: `"rock"` for straight beats, `"funk"` for syncopation, `"jazz"` for swing, `"disco"` for four-on-the-floor.
- **Keys styles control rhythm**: `"sustain"` for pads, `"eighth"` for driving rhythm, `"quarter"` for steady chords.
- **Guitar styles add character**: `"arpeggio"` for picking patterns, `"funky"` for muted strums, `"folk"` for acoustic fingerstyle.

## References

- `references/FORMAT.md` — Complete project format specification
- `references/CHORDS.md` — All valid chord names
- `references/INSTRUMENTS.md` — All voices and styles per instrument category
- `assets/velvet-horizons.seqular.json` — Complete example song (includes a Rhodes solo note track)

## Validation

After generating a song, verify:
1. Every chord name exists in the valid chords list
2. Every voice/style value is valid for its category
3. `chords` row count matches `bars` for each section
4. `activeSlots` length matches `bars` for each section
5. Slot count per bar matches the time signature (4/4 → 8, 3/4 → 6, 6/8 → 6, 2/4 → 4)
6. Note track `startSlot` values don't exceed the total project slot count
7. The JSON is valid and parseable

