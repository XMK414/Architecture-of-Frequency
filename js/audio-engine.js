/* -------------------------------------------------------------------------- */
/* FREQ/ARCH Synthesis Engine                                                 */
/*                                                                            */
/* A generative EDM engine built on the Web Audio API. Every kick, wobble,    */
/* reese, hat, and pad is synthesized from oscillators and filtered noise in  */
/* real time — no audio files, no streams. Each "track" is an original 64-bar */
/* composition (intro → build → drop → break → drop → outro) defined by a     */
/* pattern config, scheduled with the standard look-ahead clock pattern.      */
/* -------------------------------------------------------------------------- */

const AudioEngine = (() => {
    'use strict';

    /* ------------------------------ Track data ---------------------------- */
    // Pattern arrays are 16 steps (one bar of 16th notes); values are
    // velocities (0 = rest). Bass/lead notes are semitone offsets from root.
    // n = null in lead patterns means rest.

    const TRACKS = [
        {
            id: 'mycelium',
            title: 'Mycelium Transmission',
            genre: 'Organic Bass · 96 BPM',
            inspiredBy: 'CloZee / Duke Mushroom',
            bpm: 96, bars: 64, root: 38, swing: 0.06,
            bassType: 'sub', leadType: 'handpan', snareType: 'snare',
            kit: { pitch: 120, floor: 44, decay: 0.5 },
            pat: {
                kick:  [1,0,0,0, 0,0,0,0.5, 0,0,0,0, 0,0,0,0],
                snare: [0,0,0,0, 0,0,0,0, 0.7,0,0,0, 0,0,0,0],
                hat:   [0,0,0.2,0, 0,0,0.25,0, 0,0,0.2,0, 0,0,0.3,0],
                ohat:  [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0.25,0],
                shak:  [0.2,0.1,0.16,0.1, 0.22,0.1,0.16,0.1, 0.2,0.1,0.16,0.1, 0.22,0.1,0.18,0.12],
                bass: [
                    [{s:0,n:0,len:6},{s:10,n:5,len:4}],
                    [{s:0,n:0,len:6},{s:10,n:3,len:4}]
                ],
                lead: [
                    [0,null,null,7, null,10,null,null, 12,null,null,7, null,5,null,null],
                    [15,null,null,12, null,10,null,7, null,null,5,null, 3,null,null,null]
                ],
                chords: [[0,3,7,12],[-2,5,10,14]]
            }
        },
        {
            id: 'wobble',
            title: 'Wobble Protocol 140',
            genre: 'Old-School Dubstep · 140 BPM',
            inspiredBy: 'Rusko / Tape B / Distinct Motive',
            bpm: 140, bars: 64, root: 28, swing: 0,
            bassType: 'wobble', leadType: 'pluck', snareType: 'snare',
            kit: { pitch: 150, floor: 42, decay: 0.45 },
            pat: {
                kick:  [1,0,0,0, 0,0,0,0, 0,0,0,0.7, 0,0,0,0],
                snare: [0,0,0,0, 0,0,0,0, 0.9,0,0,0, 0,0,0,0],
                hat:   [0.35,0,0.5,0, 0.35,0,0.5,0, 0.35,0,0.5,0, 0.35,0,0.55,0.3],
                ohat:  [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0.4,0],
                bass: [
                    [{s:0,n:0,len:6,r:4.7},{s:6,n:0,len:2,r:9.3},{s:8,n:0,len:5,r:3.5},{s:13,n:3,len:3,r:7}],
                    [{s:0,n:0,len:4,r:2.3},{s:4,n:-2,len:4,r:4.7},{s:8,n:3,len:4,r:9.3},{s:12,n:5,len:2,r:4.7},{s:14,n:3,len:2,r:14}]
                ],
                lead: [
                    [12,null,null,10, null,7,null,null, 5,null,7,null, 3,null,null,null],
                    [12,null,null,10, null,7,null,null, 15,null,12,null, 10,null,7,null]
                ],
                chords: [[0,3,7,12],[-2,2,7,10]]
            }
        },
        {
            id: 'amen',
            title: 'Amen Circuit',
            genre: 'Jungle / DnB · 174 BPM',
            inspiredBy: 'Roni Size / Chase & Status / En:vy',
            bpm: 174, bars: 64, root: 29, swing: 0,
            bassType: 'reese', leadType: 'pluck', snareType: 'snare',
            kit: { pitch: 160, floor: 48, decay: 0.3 },
            pat: {
                kick:  [1,0,0,0, 0,0,0,0, 0,0,0.9,0, 0,0,0,0],
                snare: [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
                ghost: [0,0,0,0, 0,0,0,0.35, 0,0.3,0,0, 0,0,0,0.35],
                hat:   [0.4,0.15,0.3,0.15, 0.4,0.15,0.3,0.15, 0.4,0.15,0.3,0.15, 0.4,0.15,0.35,0.2],
                ohat:  [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
                bass: [
                    [{s:0,n:0,len:10},{s:10,n:0,len:6}],
                    [{s:0,n:5,len:8},{s:8,n:3,len:8}]
                ],
                lead: [
                    [0,null,3,null, 5,null,7,null, 10,null,7,null, 5,null,3,null],
                    [12,null,10,null, 7,null,5,null, 3,null,5,null, 7,null,10,null]
                ],
                chords: [[0,3,7,10],[-2,3,5,10]]
            }
        },
        {
            id: 'rustbelt',
            title: 'Rust Belt Ritual',
            genre: 'Industrial Techno · 132 BPM',
            inspiredBy: 'Adam X / Orphx / Frankie Bones',
            bpm: 132, bars: 64, root: 33, swing: 0,
            bassType: 'sub', leadType: 'acid', snareType: 'clap',
            kit: { pitch: 130, floor: 38, decay: 0.5 },
            pat: {
                kick:  [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
                snare: [0,0,0,0, 0.8,0,0,0, 0,0,0,0, 0.8,0,0,0],
                hat:   [0.18,0.1,0.28,0.1, 0.18,0.1,0.28,0.1, 0.18,0.1,0.28,0.1, 0.18,0.1,0.28,0.12],
                ohat:  [0,0,0.5,0, 0,0,0.5,0, 0,0,0.5,0, 0,0,0.5,0],
                bass: [
                    [{s:2,n:0,len:2},{s:6,n:0,len:2},{s:10,n:0,len:2},{s:14,n:0,len:2}],
                    [{s:2,n:0,len:2},{s:6,n:0,len:2},{s:10,n:-2,len:2},{s:14,n:0,len:2}]
                ],
                lead: [
                    [0,null,12,null, null,7,null,null, 3,null,null,12, null,7,null,3],
                    [0,null,12,null, null,10,null,null, 3,null,null,15, null,7,null,0]
                ],
                chords: [[0,7,12]]
            }
        },
        {
            id: 'warehouse',
            title: 'Warehouse Jack',
            genre: 'Chicago House · 124 BPM',
            inspiredBy: 'DJ Jes One / Gettoblaster / DJ Dan',
            bpm: 124, bars: 64, root: 31, swing: 0.13,
            bassType: 'stab', leadType: 'stab', snareType: 'clap',
            kit: { pitch: 135, floor: 45, decay: 0.35 },
            pat: {
                kick:  [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
                snare: [0,0,0,0, 0.85,0,0,0, 0,0,0,0, 0.85,0,0,0],
                hat:   [0.12,0.08,0.15,0.08, 0.12,0.08,0.15,0.08, 0.12,0.08,0.15,0.08, 0.12,0.08,0.15,0.08],
                ohat:  [0,0,0.6,0, 0,0,0.6,0, 0,0,0.6,0, 0,0,0.6,0],
                bass: [
                    [{s:3,n:0,len:1},{s:7,n:0,len:1},{s:11,n:5,len:1},{s:14,n:7,len:2}],
                    [{s:3,n:0,len:1},{s:7,n:3,len:1},{s:11,n:5,len:1},{s:14,n:10,len:2}]
                ],
                lead: [
                    [null,null,12,null, null,null,null,10, null,null,7,null, null,null,null,null],
                    [null,null,15,null, null,null,null,12, null,null,10,null, null,null,7,null]
                ],
                chords: [[0,3,7,10],[5,8,12,15]]
            }
        },
        {
            id: 'orlando',
            title: 'Orlando Voltage',
            genre: 'Florida Breaks · 130 BPM',
            inspiredBy: 'DJ Icey / Baby Anne',
            bpm: 130, bars: 64, root: 33, swing: 0.07,
            bassType: 'stab', leadType: 'pluck', snareType: 'snare',
            kit: { pitch: 145, floor: 46, decay: 0.35 },
            pat: {
                kick:  [1,0,0,0, 0,0,0.8,0, 0,0,0.9,0, 0,0,0,0],
                snare: [0,0,0,0, 0.9,0,0,0, 0,0,0,0, 0.9,0,0,0],
                ghost: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0.3],
                hat:   [0.3,0.12,0.22,0.12, 0.3,0.12,0.22,0.12, 0.3,0.12,0.22,0.12, 0.3,0.12,0.25,0.15],
                ohat:  [0,0,0.4,0, 0,0,0.4,0, 0,0,0.4,0, 0,0,0.4,0],
                bass: [
                    [{s:0,n:0,len:2},{s:6,n:0,len:1},{s:8,n:7,len:2},{s:13,n:5,len:2}],
                    [{s:0,n:0,len:2},{s:6,n:3,len:1},{s:8,n:5,len:2},{s:13,n:10,len:2}]
                ],
                lead: [
                    [12,null,10,null, null,7,null,5, null,null,7,null, 10,null,12,null],
                    [15,null,12,null, null,10,null,7, null,null,10,null, 12,null,15,null]
                ],
                chords: [[0,3,7],[-4,0,5]]
            }
        },
        {
            id: 'garage',
            title: '2-Step Cathedral',
            genre: 'UK Garage · 132 BPM',
            inspiredBy: 'the pirate-radio lineage of DnB & house',
            bpm: 132, bars: 64, root: 33, swing: 0.16,
            bassType: 'stab', leadType: 'stab', snareType: 'clap',
            kit: { pitch: 140, floor: 46, decay: 0.32 },
            pat: {
                kick:  [1,0,0,0, 0,0,0,0, 0,0,1,0, 0,0,0,0],
                snare: [0,0,0,0, 0.9,0,0,0, 0,0,0,0, 0.9,0,0,0.4],
                hat:   [0.2,0.1,0.35,0.15, 0.2,0.1,0.35,0.15, 0.2,0.1,0.35,0.15, 0.2,0.1,0.4,0.2],
                ohat:  [0,0,0,0, 0,0,0.5,0, 0,0,0,0, 0,0,0.5,0],
                shak:  [0.12,0.14,0.1,0.16, 0.12,0.14,0.1,0.16, 0.12,0.14,0.1,0.16, 0.12,0.14,0.12,0.18],
                bass: [
                    [{s:0,n:0,len:2},{s:5,n:0,len:1},{s:8,n:5,len:2},{s:11,n:3,len:1},{s:14,n:7,len:2}],
                    [{s:0,n:-2,len:2},{s:5,n:-2,len:1},{s:8,n:3,len:2},{s:11,n:5,len:1},{s:14,n:10,len:2}]
                ],
                lead: [
                    [null,null,12,null, 15,null,null,12, null,10,null,null, 7,null,null,null],
                    [null,null,17,null, 15,null,null,12, null,10,null,7, null,null,10,null]
                ],
                chords: [[0,3,7,10],[-2,2,5,10],[-4,0,3,8],[-2,2,5,10]]
            }
        },
        {
            id: 'trance',
            title: 'Aurora Ascension',
            genre: 'Uplifting Trance · 138 BPM',
            inspiredBy: 'the melodic-festival main stage',
            bpm: 138, bars: 64, root: 33, swing: 0,
            bassType: 'sub', leadType: 'supersaw', snareType: 'clap',
            kit: { pitch: 145, floor: 44, decay: 0.4 },
            pat: {
                kick:  [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
                snare: [0,0,0,0, 0.7,0,0,0, 0,0,0,0, 0.7,0,0,0],
                hat:   [0,0,0.5,0, 0,0,0.5,0, 0,0,0.5,0, 0,0,0.5,0.3],
                ohat:  [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0.4,0],
                bass: [
                    [{s:2,n:0,len:1},{s:4,n:0,len:1},{s:6,n:0,len:1},{s:8,n:0,len:1},{s:10,n:0,len:1},{s:12,n:0,len:1},{s:14,n:0,len:1}],
                    [{s:2,n:-4,len:1},{s:4,n:-4,len:1},{s:6,n:-4,len:1},{s:8,n:-4,len:1},{s:10,n:-4,len:1},{s:12,n:-4,len:1},{s:14,n:-4,len:1}]
                ],
                lead: [
                    [0,null,null,null, 7,null,3,null, null,null,10,null, 7,null,null,null],
                    [12,null,null,10, null,7,null,null, 3,null,null,7, null,10,null,12]
                ],
                chords: [[0,3,7,12],[-4,3,8,12],[-2,5,10,14],[-4,0,7,12]]
            }
        },
        {
            id: 'triphop',
            title: 'Dust & Vinyl',
            genre: 'Trip-Hop / Downtempo · 88 BPM',
            inspiredBy: 'Duke Mushroom / the Warriors era',
            bpm: 88, bars: 64, root: 31, swing: 0.12,
            bassType: 'sub', leadType: 'handpan', snareType: 'snare',
            kit: { pitch: 110, floor: 40, decay: 0.55 },
            pat: {
                kick:  [1,0,0,0, 0,0,0,0, 0,0,1,0, 0,0,0,0],
                snare: [0,0,0,0, 0,0,0,0, 0.75,0,0,0, 0,0,0,0],
                hat:   [0.25,0,0.18,0.22, 0.25,0,0.18,0.22, 0.25,0,0.18,0.22, 0.25,0,0.2,0.24],
                ohat:  [0,0,0,0, 0,0,0.3,0, 0,0,0,0, 0,0,0.3,0],
                shak:  [0.1,0.08,0.12,0.08, 0.1,0.08,0.12,0.08, 0.1,0.08,0.12,0.08, 0.1,0.08,0.12,0.1],
                bass: [
                    [{s:0,n:0,len:6},{s:8,n:3,len:3},{s:11,n:-2,len:5}],
                    [{s:0,n:-4,len:6},{s:8,n:0,len:3},{s:11,n:3,len:5}]
                ],
                lead: [
                    [12,null,null,null, null,null,15,null, null,10,null,null, 7,null,null,null],
                    [null,null,10,null, 12,null,null,null, 15,null,null,10, null,null,7,null]
                ],
                chords: [[0,3,7,10],[-4,0,3,7]]
            }
        }
    ];

    /* ------------------------------ Engine state --------------------------- */

    const LOOKAHEAD_MS = 25;      // scheduler poll interval
    const SCHEDULE_AHEAD = 0.12;  // seconds of audio scheduled in advance

    let ctx = null;
    let master, compressor, analyser;
    let delayIn, delayNode, reverbIn;
    let noiseBuf = null;
    let spectrum = null;
    let waveform = null;

    let trackIndex = 0;
    let playing = false;
    let step = 0;
    let nextNoteTime = 0;
    let timer = null;
    let volume = 0.85;
    let muted = false;

    const handlers = { track: [], state: [] };
    function on(evt, cb) { if (handlers[evt]) handlers[evt].push(cb); }
    function emit(evt, data) { (handlers[evt] || []).forEach(cb => { try { cb(data); } catch (e) { /* keep engine alive */ } }); }

    const midiToFreq = m => 440 * Math.pow(2, (m - 69) / 12);
    const stepsPerBeatSec = tr => 60 / tr.bpm / 4; // duration of one 16th note
    const totalSteps = tr => tr.bars * 16;

    /* ------------------------------ Graph setup ---------------------------- */

    function init() {
        if (ctx) return;
        const AC = window.AudioContext || window.webkitAudioContext;
        ctx = new AC();

        master = ctx.createGain();
        master.gain.value = muted ? 0 : volume;

        compressor = ctx.createDynamicsCompressor();
        compressor.threshold.value = -18;
        compressor.knee.value = 20;
        compressor.ratio.value = 5;
        compressor.attack.value = 0.004;
        compressor.release.value = 0.18;

        analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.78;
        spectrum = new Uint8Array(analyser.frequencyBinCount);
        waveform = new Uint8Array(analyser.fftSize);

        master.connect(compressor);
        compressor.connect(analyser);
        analyser.connect(ctx.destination);

        // Tempo-synced feedback delay send (dotted eighth)
        delayIn = ctx.createGain();
        delayIn.gain.value = 0.3;
        delayNode = ctx.createDelay(2.0);
        const fb = ctx.createGain();
        fb.gain.value = 0.32;
        const dampen = ctx.createBiquadFilter();
        dampen.type = 'lowpass';
        dampen.frequency.value = 2400;
        delayIn.connect(delayNode);
        delayNode.connect(dampen);
        dampen.connect(fb);
        fb.connect(delayNode);
        dampen.connect(master);

        // Reverb send (synthesized impulse — decaying stereo noise)
        reverbIn = ctx.createGain();
        reverbIn.gain.value = 0.55;
        const convolver = ctx.createConvolver();
        convolver.buffer = makeImpulse(2.4, 2.6);
        reverbIn.connect(convolver);
        convolver.connect(master);

        // Shared white-noise buffer for all percussion
        noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
        const d = noiseBuf.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;

        syncDelayToTempo();
    }

    function makeImpulse(seconds, decay) {
        const rate = ctx.sampleRate;
        const len = Math.floor(rate * seconds);
        const buf = ctx.createBuffer(2, len, rate);
        for (let ch = 0; ch < 2; ch++) {
            const data = buf.getChannelData(ch);
            for (let i = 0; i < len; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
            }
        }
        return buf;
    }

    function syncDelayToTempo() {
        if (!ctx) return;
        const tr = TRACKS[trackIndex];
        delayNode.delayTime.value = stepsPerBeatSec(tr) * 6; // dotted eighth
    }

    function noiseSrc() {
        const src = ctx.createBufferSource();
        src.buffer = noiseBuf;
        src.loop = true;
        return src;
    }

    /* ------------------------------ Instruments ---------------------------- */

    function kick(t, vel, kit) {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.frequency.setValueAtTime(kit.pitch, t);
        osc.frequency.exponentialRampToValueAtTime(kit.floor, t + 0.09);
        g.gain.setValueAtTime(0.95 * vel, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + kit.decay);
        osc.connect(g); g.connect(master);
        osc.start(t); osc.stop(t + kit.decay + 0.05);
        // transient click
        const n = noiseSrc();
        const hp = ctx.createBiquadFilter();
        hp.type = 'highpass'; hp.frequency.value = 1000;
        const ng = ctx.createGain();
        ng.gain.setValueAtTime(0.22 * vel, t);
        ng.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
        n.connect(hp); hp.connect(ng); ng.connect(master);
        n.start(t); n.stop(t + 0.05);
    }

    function snare(t, vel) {
        const n = noiseSrc();
        const bp = ctx.createBiquadFilter();
        bp.type = 'bandpass'; bp.frequency.value = 1800; bp.Q.value = 0.9;
        const ng = ctx.createGain();
        ng.gain.setValueAtTime(0.5 * vel, t);
        ng.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
        n.connect(bp); bp.connect(ng); ng.connect(master);
        ng.connect(reverbIn);
        n.start(t); n.stop(t + 0.2);
        // tonal body
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(196, t);
        osc.frequency.exponentialRampToValueAtTime(140, t + 0.06);
        const og = ctx.createGain();
        og.gain.setValueAtTime(0.28 * vel, t);
        og.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
        osc.connect(og); og.connect(master);
        osc.start(t); osc.stop(t + 0.12);
    }

    function clap(t, vel) {
        [0, 0.012, 0.026].forEach((off, i) => {
            const n = noiseSrc();
            const bp = ctx.createBiquadFilter();
            bp.type = 'bandpass'; bp.frequency.value = 1150; bp.Q.value = 1.6;
            const g = ctx.createGain();
            const amp = (i === 2 ? 0.42 : 0.2) * vel;
            g.gain.setValueAtTime(amp, t + off);
            g.gain.exponentialRampToValueAtTime(0.001, t + off + (i === 2 ? 0.16 : 0.03));
            n.connect(bp); bp.connect(g); g.connect(master);
            g.connect(reverbIn);
            n.start(t + off); n.stop(t + off + 0.2);
        });
    }

    function hat(t, vel, open) {
        const n = noiseSrc();
        const hp = ctx.createBiquadFilter();
        hp.type = 'highpass';
        hp.frequency.value = 7200 + Math.random() * 800;
        const g = ctx.createGain();
        const dec = open ? 0.28 : 0.045;
        g.gain.setValueAtTime(0.32 * vel, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + dec);
        n.connect(hp); hp.connect(g); g.connect(master);
        n.start(t); n.stop(t + dec + 0.02);
    }

    function shaker(t, vel) {
        const n = noiseSrc();
        const hp = ctx.createBiquadFilter();
        hp.type = 'highpass'; hp.frequency.value = 4800;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.001, t);
        g.gain.linearRampToValueAtTime(0.2 * vel, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
        n.connect(hp); hp.connect(g); g.connect(master);
        n.start(t); n.stop(t + 0.12);
    }

    /* Bass voices — each includes a pure-sine sub layer for weight. */

    function subLayer(t, f, dur, vel) {
        const osc = ctx.createOscillator();
        osc.frequency.value = f;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.001, t);
        g.gain.linearRampToValueAtTime(0.5 * vel, t + 0.015);
        g.gain.setValueAtTime(0.5 * vel, t + Math.max(0.02, dur - 0.05));
        g.gain.linearRampToValueAtTime(0.001, t + dur);
        osc.connect(g); g.connect(master);
        osc.start(t); osc.stop(t + dur + 0.05);
    }

    function bassWobble(t, f, dur, vel, rate) {
        subLayer(t, f, dur, vel);
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.value = f * 2;
        const osc2 = ctx.createOscillator();
        osc2.type = 'square';
        osc2.frequency.value = f;
        const lp = ctx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.value = 180;
        lp.Q.value = 6;
        const lfo = ctx.createOscillator();
        lfo.frequency.value = rate || 4.7;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 850;
        lfo.connect(lfoGain); lfoGain.connect(lp.frequency);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.001, t);
        g.gain.linearRampToValueAtTime(0.4 * vel, t + 0.01);
        g.gain.setValueAtTime(0.4 * vel, t + Math.max(0.02, dur - 0.04));
        g.gain.linearRampToValueAtTime(0.001, t + dur);
        osc.connect(lp); osc2.connect(lp); lp.connect(g); g.connect(master);
        osc.start(t); osc2.start(t); lfo.start(t);
        osc.stop(t + dur + 0.05); osc2.stop(t + dur + 0.05); lfo.stop(t + dur + 0.05);
    }

    function bassReese(t, f, dur, vel) {
        subLayer(t, f, dur, vel * 0.9);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.001, t);
        g.gain.linearRampToValueAtTime(0.28 * vel, t + 0.02);
        g.gain.setValueAtTime(0.28 * vel, t + Math.max(0.02, dur - 0.06));
        g.gain.linearRampToValueAtTime(0.001, t + dur);
        const lp = ctx.createBiquadFilter();
        lp.type = 'lowpass'; lp.frequency.value = 620; lp.Q.value = 2;
        [-14, 14].forEach(cents => {
            const osc = ctx.createOscillator();
            osc.type = 'sawtooth';
            osc.frequency.value = f * 2;
            osc.detune.value = cents;
            osc.connect(lp);
            osc.start(t); osc.stop(t + dur + 0.05);
        });
        lp.connect(g); g.connect(master);
    }

    function bassSub(t, f, dur, vel) {
        subLayer(t, f, dur, vel * 1.15);
        // gentle top harmonic so it reads on small speakers
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.value = f * 2;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.001, t);
        g.gain.linearRampToValueAtTime(0.12 * vel, t + 0.015);
        g.gain.exponentialRampToValueAtTime(0.001, t + dur);
        osc.connect(g); g.connect(master);
        osc.start(t); osc.stop(t + dur + 0.05);
    }

    function bassStab(t, f, dur, vel) {
        subLayer(t, f, Math.min(dur, 0.22), vel);
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.value = f * 2;
        const lp = ctx.createBiquadFilter();
        lp.type = 'lowpass'; lp.Q.value = 4;
        lp.frequency.setValueAtTime(1500, t);
        lp.frequency.exponentialRampToValueAtTime(220, t + 0.16);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.4 * vel, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + Math.min(dur, 0.25));
        osc.connect(lp); lp.connect(g); g.connect(master);
        osc.start(t); osc.stop(t + 0.3);
    }

    /* Lead voices */

    function leadPluck(t, f, vel) {
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.001, t);
        g.gain.linearRampToValueAtTime(0.2 * vel, t + 0.005);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
        const lp = ctx.createBiquadFilter();
        lp.type = 'lowpass'; lp.frequency.value = 2300;
        [['triangle', 0], ['sawtooth', 8]].forEach(([type, cents]) => {
            const osc = ctx.createOscillator();
            osc.type = type;
            osc.frequency.value = f;
            osc.detune.value = cents;
            osc.connect(lp);
            osc.start(t); osc.stop(t + 0.35);
        });
        lp.connect(g); g.connect(master); g.connect(delayIn);
    }

    function leadHandpan(t, f, vel) {
        const out = ctx.createGain();
        out.gain.value = 1;
        [[1, 0.28], [2.01, 0.12], [2.99, 0.06]].forEach(([mult, amp]) => {
            const osc = ctx.createOscillator();
            osc.frequency.value = f * mult;
            const g = ctx.createGain();
            g.gain.setValueAtTime(0.001, t);
            g.gain.linearRampToValueAtTime(amp * vel, t + 0.004);
            g.gain.exponentialRampToValueAtTime(0.001, t + 1.15);
            osc.connect(g); g.connect(out);
            osc.start(t); osc.stop(t + 1.3);
        });
        out.connect(master); out.connect(reverbIn); out.connect(delayIn);
    }

    function leadAcid(t, f, vel) {
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.value = f / 2;
        const lp = ctx.createBiquadFilter();
        lp.type = 'lowpass'; lp.Q.value = 11;
        lp.frequency.setValueAtTime(200, t);
        lp.frequency.exponentialRampToValueAtTime(Math.min(f * 5, 2800), t + 0.04);
        lp.frequency.exponentialRampToValueAtTime(220, t + 0.16);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.24 * vel, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.17);
        osc.connect(lp); lp.connect(g); g.connect(master); g.connect(delayIn);
        osc.start(t); osc.stop(t + 0.22);
    }

    function leadStab(t, f, vel) {
        // organ-ish house stab: note + fifth + octave
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.001, t);
        g.gain.linearRampToValueAtTime(0.13 * vel, t + 0.006);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
        const lp = ctx.createBiquadFilter();
        lp.type = 'lowpass'; lp.frequency.value = 2600;
        [1, 1.5, 2].forEach(mult => {
            const osc = ctx.createOscillator();
            osc.type = 'sawtooth';
            osc.frequency.value = f * mult;
            osc.connect(lp);
            osc.start(t); osc.stop(t + 0.25);
        });
        lp.connect(g); g.connect(master); g.connect(delayIn);
    }

    function padChord(t, freqs, dur) {
        const g = ctx.createGain();
        const atk = Math.min(1.2, dur * 0.3);
        g.gain.setValueAtTime(0.001, t);
        g.gain.linearRampToValueAtTime(0.085, t + atk);
        g.gain.setValueAtTime(0.085, t + dur - 0.8);
        g.gain.linearRampToValueAtTime(0.001, t + dur);
        const lp = ctx.createBiquadFilter();
        lp.type = 'lowpass'; lp.frequency.value = 950;
        freqs.forEach(f => {
            [-8, 8].forEach(cents => {
                const osc = ctx.createOscillator();
                osc.type = 'sawtooth';
                osc.frequency.value = f;
                osc.detune.value = cents;
                osc.connect(lp);
                osc.start(t); osc.stop(t + dur + 0.1);
            });
        });
        lp.connect(g);
        g.connect(reverbIn);
        const dry = ctx.createGain();
        dry.gain.value = 0.5;
        g.connect(dry); dry.connect(master);
    }

    function leadSupersaw(t, f, vel) {
        // Seven detuned saws → classic trance/uplifting lead
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.001, t);
        g.gain.linearRampToValueAtTime(0.16 * vel, t + 0.02);
        g.gain.setValueAtTime(0.16 * vel, t + 0.28);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
        const lp = ctx.createBiquadFilter();
        lp.type = 'lowpass'; lp.Q.value = 1;
        lp.frequency.setValueAtTime(1200, t);
        lp.frequency.exponentialRampToValueAtTime(4200, t + 0.1);
        lp.frequency.exponentialRampToValueAtTime(1600, t + 0.45);
        [-24, -16, -7, 0, 7, 16, 24].forEach(cents => {
            const osc = ctx.createOscillator();
            osc.type = 'sawtooth';
            osc.frequency.value = f;
            osc.detune.value = cents;
            osc.connect(lp);
            osc.start(t); osc.stop(t + 0.55);
        });
        lp.connect(g); g.connect(master); g.connect(reverbIn); g.connect(delayIn);
    }

    const LEAD_FNS = { pluck: leadPluck, handpan: leadHandpan, acid: leadAcid, stab: leadStab, supersaw: leadSupersaw };
    const BASS_FNS = { wobble: bassWobble, reese: bassReese, sub: bassSub, stab: bassStab };

    /* ------------------------------ Arrangement ---------------------------- */
    // 64-bar arc: intro → build → drop A → break → drop B → outro

    function sectionAt(bar) {
        // Open with an immediate full groove so playback is unmistakably
        // audible from the very first bar; bring in dynamics afterward.
        if (bar < 16)  return { kick: 1, snare: 1, hat: 1, bass: 1, lead: bar >= 4, pad: 1, fill: bar === 15 };
        if (bar < 24)  return { kick: 0, snare: 0, hat: 1, bass: 0, lead: 1, pad: 1, fill: bar === 23 }; // breakdown
        if (bar < 28)  return { kick: 1, snare: 0, hat: 1, bass: 1, lead: 1, pad: 1, fill: bar === 27 }; // build
        if (bar < 48)  return { kick: 1, snare: 1, hat: 1, bass: 1, lead: 1, pad: 0, fill: bar === 47 }; // main drop
        if (bar < 56)  return { kick: 1, snare: 1, hat: 1, bass: 1, lead: (bar % 8) >= 4, pad: 1, fill: bar === 55 };
        return { kick: 1, snare: 1, hat: 1, bass: 1, lead: 1, pad: 1, fill: false }; // full outro
    }

    /* ------------------------------ Scheduler ------------------------------ */

    function scheduleStep(stepIdx, when) {
        const tr = TRACKS[trackIndex];
        const P = tr.pat;
        const spb = stepsPerBeatSec(tr);
        const bar = Math.floor(stepIdx / 16);
        const s = stepIdx % 16;
        let t = when;
        if (tr.swing && s % 2 === 1) t += spb * tr.swing;

        const sec = sectionAt(bar);
        const hitSnare = tr.snareType === 'clap' ? clap : snare;

        // Fill: snare roll ramping into the next section
        if (sec.fill && s >= 8) {
            hitSnare(t, 0.25 + 0.6 * (s - 8) / 7);
        }

        if (sec.kick && P.kick[s]) kick(t, P.kick[s], tr.kit);
        if (sec.snare && P.snare[s]) hitSnare(t, P.snare[s]);
        if (sec.snare && P.ghost && P.ghost[s]) snare(t, P.ghost[s] * 0.6);
        if (sec.hat && P.hat[s]) hat(t, P.hat[s], false);
        if (sec.hat && P.ohat && P.ohat[s]) hat(t, P.ohat[s], true);
        if (sec.hat && P.shak && P.shak[s]) shaker(t, P.shak[s]);

        if (sec.bass) {
            const events = P.bass[bar % P.bass.length];
            for (const ev of events) {
                if (ev.s === s) {
                    const f = midiToFreq(tr.root + (ev.n || 0));
                    const dur = Math.max(ev.len * spb * 0.95, 0.1);
                    BASS_FNS[tr.bassType](t, f, dur, 0.9, ev.r);
                }
            }
        }

        if (sec.lead) {
            const pat = P.lead[bar % P.lead.length];
            const v = pat[s];
            if (v !== null && v !== undefined) {
                LEAD_FNS[tr.leadType](t, midiToFreq(tr.root + 24 + v), 0.85);
            }
        }

        if (sec.pad && s === 0 && bar % 2 === 0 && P.chords && P.chords.length) {
            const chord = P.chords[Math.floor(bar / 2) % P.chords.length];
            padChord(t, chord.map(o => midiToFreq(tr.root + 24 + o)), spb * 32);
        }
    }

    function scheduler() {
        const tr = TRACKS[trackIndex];
        const spb = stepsPerBeatSec(tr);
        while (nextNoteTime < ctx.currentTime + SCHEDULE_AHEAD) {
            if (step >= totalSteps(tr)) {
                next(); // auto-advance; next() resets timing
                return;
            }
            scheduleStep(step, nextNoteTime);
            nextNoteTime += spb;
            step++;
        }
    }

    /* ------------------------------ Transport ------------------------------ */

    async function play() {
        init();
        // Browsers start the AudioContext suspended until a user gesture.
        // play() is always called from a click/tap, so resume here; await it
        // so the first notes aren't scheduled into a stopped clock.
        if (ctx.state === 'suspended') {
            try { await ctx.resume(); } catch (e) { /* will retry on next gesture */ }
        }
        if (playing) return;
        playing = true;
        nextNoteTime = ctx.currentTime + 0.06;
        timer = setInterval(scheduler, LOOKAHEAD_MS);
        emit('state', true);
    }

    // Fallback unlock: resume the context on any user gesture, in case a
    // browser blocked the initial resume.
    function unlock() {
        if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {});
    }

    function pause() {
        if (!playing) return;
        playing = false;
        clearInterval(timer);
        timer = null;
        emit('state', false);
    }

    function toggle() { playing ? pause() : play(); }

    function setTrack(i) {
        trackIndex = ((i % TRACKS.length) + TRACKS.length) % TRACKS.length;
        step = 0;
        if (ctx) {
            syncDelayToTempo();
            if (playing) nextNoteTime = ctx.currentTime + 0.1;
        }
        emit('track', trackIndex);
    }

    function next() { setTrack(trackIndex + 1); }
    function prev() { setTrack(trackIndex - 1); }

    function seek(fraction) {
        const tr = TRACKS[trackIndex];
        step = Math.max(0, Math.min(totalSteps(tr) - 1, Math.floor(fraction * totalSteps(tr))));
        if (ctx && playing) nextNoteTime = ctx.currentTime + 0.06;
    }

    function setVolume(v) {
        volume = Math.max(0, Math.min(1, v));
        muted = false;
        if (master) master.gain.setTargetAtTime(volume, ctx.currentTime, 0.02);
    }

    function toggleMute() {
        muted = !muted;
        if (master) master.gain.setTargetAtTime(muted ? 0 : volume, ctx.currentTime, 0.02);
        return muted;
    }

    /* ------------------------------ Introspection -------------------------- */

    function getPosition() {
        const tr = TRACKS[trackIndex];
        const spb = stepsPerBeatSec(tr);
        return {
            seconds: step * spb,
            duration: totalSteps(tr) * spb
        };
    }

    function getSpectrum() {
        if (!analyser) return null;
        analyser.getByteFrequencyData(spectrum);
        return spectrum;
    }

    // Time-domain samples (centered on 128). Used to confirm real waveform
    // output — the RMS deviation from 128 is non-zero only when audio plays.
    function getWaveform() {
        if (!analyser) return null;
        analyser.getByteTimeDomainData(waveform);
        return waveform;
    }

    return {
        TRACKS,
        on,
        play, pause, toggle, next, prev, setTrack, seek,
        setVolume, toggleMute, unlock,
        getPosition, getSpectrum, getWaveform,
        isPlaying: () => playing,
        getVolume: () => volume,
        isMuted: () => muted,
        currentIndex: () => trackIndex
    };
})();
