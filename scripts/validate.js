#!/usr/bin/env node
/**
 * Seqular Project Validator
 * Usage: node validate.js <file.seqular.json>
 *
 * Validates a .seqular.json file against the Seqular project format.
 * Returns exit code 0 if valid, 1 if errors found.
 */

import { readFileSync } from 'fs';

const SECTION_TYPES = ['intro', 'verse', 'prechorus', 'chorus', 'bridge', 'solo', 'outro'];

const VOICES = {
    drums: ['none', 'acoustic', 'electronic', 'percussion'],
    keys: ['none', 'piano', 'synth', 'rhodes', 'wurlitzer', 'organ', 'harmonium'],
    guitar: ['none', 'acoustic', 'electric'],
    bass: ['none', 'electric', 'synth', 'fingered', 'picked']
};

const STYLES = {
    drums: ['rock', 'pop', 'disco', 'funk', 'jazz', 'latin', 'reggae', 'shuffle', 'ballad', 'waltz'],
    keys: ['sustain', 'full', 'half', 'quarter', 'eighth'],
    guitar: ['sustain', 'simple', 'folk', 'funky', 'ballad', 'reggae', 'shuffle', 'downstrokes', 'arpeggio', 'full', 'half', 'quarter', 'eighth'],
    bass: ['sustain', 'full', 'half', 'quarter', 'eighth']
};

const VALID_CHORDS = [
    'C','C#','D','D#','E','F','F#','G','G#','A','A#','B',
    'Cm','C#m','Dm','D#m','Em','Fm','F#m','Gm','G#m','Am','A#m','Bm',
    'C7','C#7','D7','D#7','E7','F7','F#7','G7','G#7','A7','A#7','B7',
    'Cm7','C#m7','Dm7','D#m7','Em7','Fm7','F#m7','Gm7','G#m7','Am7','A#m7','Bm7',
    'Cmaj7','C#maj7','Dmaj7','D#maj7','Emaj7','Fmaj7','F#maj7','Gmaj7','G#maj7','Amaj7','A#maj7','Bmaj7',
    'Cdim','C#dim','Ddim','D#dim','Edim','Fdim','F#dim','Gdim','G#dim','Adim','A#dim','Bdim',
    'Cdim7','C#dim7','Ddim7','D#dim7','Edim7','Fdim7','F#dim7','Gdim7','G#dim7','Adim7','A#dim7','Bdim7',
    'Caug','C#aug','Daug','D#aug','Eaug','Faug','F#aug','Gaug','G#aug','Aaug','A#aug','Baug',
    'Csus4','C#sus4','Dsus4','D#sus4','Esus4','Fsus4','F#sus4','Gsus4','G#sus4','Asus4','A#sus4','Bsus4',
    'Csus2','C#sus2','Dsus2','D#sus2','Esus2','Fsus2','F#sus2','Gsus2','G#sus2','Asus2','A#sus2','Bsus2',
    'Cadd9','C#add9','Dadd9','D#add9','Eadd9','Fadd9','F#add9','Gadd9','G#add9','Aadd9','A#add9','Badd9',
    'C9','C#9','D9','D#9','E9','F9','F#9','G9','G#9','A9','A#9','B9',
    'C6','C#6','D6','D#6','E6','F6','F#6','G6','G#6','A6','A#6','B6',
    'Cm6','C#m6','Dm6','D#m6','Em6','Fm6','F#m6','Gm6','G#m6','Am6','A#m6','Bm6'
];
const CHORD_SET = new Set(VALID_CHORDS);

function getSlotsPerBar(timeSig) {
    if (timeSig === '6/8') return 6;
    if (timeSig === '3/4') return 6;
    if (timeSig === '2/4') return 4;
    return 8; // 4/4 default
}

function validate(data) {
    const errors = [];
    const warnings = [];
    const e = (msg) => errors.push(msg);
    const w = (msg) => warnings.push(msg);

    // Top-level wrapper
    if (typeof data !== 'object' || data === null) { e('Root must be an object'); return { valid: false, errors, warnings }; }
    if (typeof data.version !== 'string') e('Missing or invalid "version" (expected string)');
    if (!data.project || typeof data.project !== 'object') { e('Missing "project" object'); return { valid: false, errors, warnings }; }
    if (!Array.isArray(data.tracks)) w('Missing "tracks" array (should be [] if no recordings)');

    const p = data.project;
    if (typeof p.name !== 'string' || !p.name.trim()) e('project.name must be a non-empty string');
    if (typeof p.bpm !== 'number') e('project.bpm must be a number');
    else if (p.bpm < 30 || p.bpm > 300) w(`project.bpm=${p.bpm} is outside typical range (30–300)`);
    if (p.transpose !== undefined && !Number.isInteger(p.transpose)) w('project.transpose should be an integer');
    if (!Array.isArray(p.sections)) { e('project.sections must be an array'); return { valid: false, errors, warnings }; }

    // Sections
    p.sections.forEach((s, si) => {
        const prefix = `sections[${si}]`;
        if (!SECTION_TYPES.includes(s.type)) e(`${prefix}.type "${s.type}" is invalid`);
        const bars = s.bars ?? s.measures; // support legacy "measures" field
        if (!Number.isInteger(bars) || bars < 1) e(`${prefix}.bars must be a positive integer`);
        s = { ...s, bars };
        const slotsPerBar = getSlotsPerBar(s.timeSignature || '4/4');

        // Chords
        if (!Array.isArray(s.chords)) { e(`${prefix}.chords must be a 2D array`); }
        else {
            if (s.chords.length !== s.bars) e(`${prefix}.chords has ${s.chords.length} rows but bars=${s.bars}`);
            s.chords.forEach((row, ri) => {
                if (!Array.isArray(row)) { e(`${prefix}.chords[${ri}] must be an array`); return; }
                if (row.length !== slotsPerBar) w(`${prefix}.chords[${ri}] has ${row.length} slots, expected ${slotsPerBar}`);
                row.forEach((ch, ci) => {
                    if (!CHORD_SET.has(ch)) e(`${prefix}.chords[${ri}][${ci}] invalid chord "${ch}"`);
                });
            });
        }

        // ActiveSlots
        if (Array.isArray(s.activeSlots)) {
            if (s.activeSlots.length !== s.bars) e(`${prefix}.activeSlots length ${s.activeSlots.length} != bars ${s.bars}`);
        }

        // Voices
        if (s.voices && typeof s.voices === 'object') {
            for (const [cat, voice] of Object.entries(s.voices)) {
                if (VOICES[cat] && !VOICES[cat].includes(voice)) e(`${prefix}.voices.${cat} "${voice}" is invalid`);
            }
        }

        // Styles
        if (s.styles && typeof s.styles === 'object') {
            for (const [cat, style] of Object.entries(s.styles)) {
                if (STYLES[cat] && !STYLES[cat].includes(style)) e(`${prefix}.styles.${cat} "${style}" is invalid`);
            }
        }
    });

    // Note tracks
    if (Array.isArray(p.noteTracks)) {
        p.noteTracks.forEach((nt, ni) => {
            const prefix = `noteTracks[${ni}]`;
            const cat = nt.category;
            const voice = nt.voice;
            if (!VOICES[cat]) e(`${prefix}.category "${cat}" is invalid`);
            else if (voice !== 'none' && !VOICES[cat].includes(voice)) e(`${prefix}.voice "${voice}" is invalid for ${cat}`);
            if (Array.isArray(nt.notes)) {
                nt.notes.forEach((n, i) => {
                    if (!Number.isFinite(n.midi) || n.midi < 0 || n.midi > 127) e(`${prefix}.notes[${i}].midi=${n.midi} out of range`);
                    if (!Number.isFinite(n.startSlot) || n.startSlot < 0) e(`${prefix}.notes[${i}].startSlot invalid`);
                    if (!Number.isFinite(n.durationSlots) || n.durationSlots < 1) e(`${prefix}.notes[${i}].durationSlots invalid`);
                });
            }
        });
    }

    return { valid: errors.length === 0, errors, warnings };
}

// CLI entry point
const file = process.argv[2];
if (!file) { console.error('Usage: node validate.js <file.seqular.json>'); process.exit(1); }

try {
    const data = JSON.parse(readFileSync(file, 'utf-8'));
    const result = validate(data);
    if (result.warnings.length) {
        console.log(`⚠ ${result.warnings.length} warning(s):`);
        result.warnings.forEach(w => console.log(`  - ${w}`));
    }
    if (result.valid) {
        console.log(`✓ Valid Seqular project (${data.project.sections?.length || 0} sections, ${data.project.noteTracks?.length || 0} note tracks)`);
        process.exit(0);
    } else {
        console.log(`✗ ${result.errors.length} error(s):`);
        result.errors.forEach(e => console.log(`  - ${e}`));
        process.exit(1);
    }
} catch (err) {
    console.error(`Failed to parse ${file}: ${err.message}`);
    process.exit(1);
}

