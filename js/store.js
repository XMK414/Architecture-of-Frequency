/* -------------------------------------------------------------------------- */
/* FREQ/ARCH — Data Store                                                     */
/*                                                                            */
/* A persistence abstraction with two interchangeable backends:              */
/*                                                                            */
/*   • CLOUD  — Supabase (shared across all visitors) when js/config.js has   */
/*              a supabaseUrl + supabaseAnonKey.                              */
/*   • LOCAL  — browser localStorage (per-visitor) otherwise, or as an        */
/*              automatic fallback if the Supabase client fails to load.      */
/*                                                                            */
/* Every method returns a Promise and yields normalized objects, so the UI    */
/* in app.js is identical regardless of backend. Timestamps are always        */
/* returned as `ts` in epoch-milliseconds.                                    */
/* -------------------------------------------------------------------------- */

const Store = (() => {
    'use strict';

    const cfg = window.FREQARCH_CONFIG || {};
    const wantCloud = !!(cfg.supabaseUrl && cfg.supabaseAnonKey);

    let sb = null;
    let mode = 'local';           // resolved after init()
    let initPromise = null;

    const COMMENTS_KEY = 'freqarch_comments_v1';
    const ARCHIVE_KEY = 'freqarch_archive_v1';

    const uid = () => (crypto.randomUUID ? crypto.randomUUID() : Date.now() + '-' + Math.random().toString(36).slice(2));

    /* ------------------------------ localStorage --------------------------- */

    function lsLoad(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch (e) { return fallback; }
    }
    function lsSave(key, value) {
        try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* private mode */ }
    }

    function localComments() {
        let c = lsLoad(COMMENTS_KEY, null);
        if (!c) { c = [...seedComments]; lsSave(COMMENTS_KEY, c); }
        return c;
    }
    function localArchive() {
        let a = lsLoad(ARCHIVE_KEY, null);
        if (!a) { a = JSON.parse(JSON.stringify(seedArchive)); lsSave(ARCHIVE_KEY, a); }
        // Guard against older shapes missing a tab
        return { moments: a.moments || [], artists: a.artists || [], tracks: a.tracks || [] };
    }

    /* ------------------------------ Initialization ------------------------- */

    async function init() {
        if (initPromise) return initPromise;
        initPromise = (async () => {
            if (!wantCloud) { mode = 'local'; return; }
            try {
                const mod = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
                sb = mod.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);
                // Probe connectivity so we can fall back cleanly on error
                const { error } = await sb.from('comments').select('id').limit(1);
                if (error) throw error;
                mode = 'cloud';
            } catch (e) {
                console.warn('[FREQ/ARCH] Supabase unavailable — using localStorage. Reason:', e.message || e);
                sb = null;
                mode = 'local';
            }
        })();
        return initPromise;
    }

    /* ------------------------------ Comments ------------------------------- */

    async function getComments() {
        await init();
        if (mode === 'cloud') {
            const { data, error } = await sb.from('comments')
                .select('*').order('created_at', { ascending: false }).limit(500);
            if (error) { console.warn('getComments cloud error', error); return []; }
            return data.map(r => ({
                id: r.id, name: r.name, genre: r.genre, text: r.message,
                ts: new Date(r.created_at).getTime()
            }));
        }
        return localComments();
    }

    async function addComment({ name, genre, text }) {
        await init();
        if (mode === 'cloud') {
            const { error } = await sb.from('comments').insert({ name, genre, message: text });
            if (error) console.warn('addComment cloud error', error);
            return;
        }
        const list = localComments();
        list.push({ id: uid(), name, genre, text, ts: Date.now() });
        lsSave(COMMENTS_KEY, list);
    }

    /* ------------------------------ Archive -------------------------------- */

    async function getArchive() {
        await init();
        if (mode === 'cloud') {
            const { data, error } = await sb.from('archive')
                .select('*').order('votes', { ascending: false }).limit(1000);
            if (error) { console.warn('getArchive cloud error', error); return { moments: [], artists: [], tracks: [] }; }
            const out = { moments: [], artists: [], tracks: [] };
            for (const r of data) {
                (out[r.kind] || (out[r.kind] = [])).push({
                    id: r.id, f1: r.f1, f2: r.f2, text: r.message,
                    handle: r.handle, votes: r.votes, ts: new Date(r.created_at).getTime()
                });
            }
            return out;
        }
        return localArchive();
    }

    async function addArchiveItem(kind, { f1, f2, text, handle }) {
        await init();
        const id = uid();
        if (mode === 'cloud') {
            const { data, error } = await sb.from('archive')
                .insert({ kind, f1, f2, message: text, handle, votes: 1 })
                .select('id').single();
            if (error) { console.warn('addArchiveItem cloud error', error); return id; }
            return data.id;
        }
        const a = localArchive();
        a[kind].unshift({ id, f1, f2, text, handle, votes: 1, ts: Date.now() });
        lsSave(ARCHIVE_KEY, a);
        return id;
    }

    async function voteArchive(kind, id) {
        await init();
        if (mode === 'cloud') {
            // Prefer an atomic RPC; fall back to read-modify-write if absent.
            const { error } = await sb.rpc('increment_archive_vote', { row_id: id });
            if (error) {
                const { data } = await sb.from('archive').select('votes').eq('id', id).single();
                if (data) await sb.from('archive').update({ votes: data.votes + 1 }).eq('id', id);
            }
            return;
        }
        const a = localArchive();
        const item = (a[kind] || []).find(x => x.id === id);
        if (item) { item.votes++; lsSave(ARCHIVE_KEY, a); }
    }

    return {
        init,
        getComments, addComment,
        getArchive, addArchiveItem, voteArchive,
        mode: () => mode,
        isCloud: () => mode === 'cloud'
    };
})();
