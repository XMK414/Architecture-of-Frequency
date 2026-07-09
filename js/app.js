/* -------------------------------------------------------------------------- */
/* FREQ/ARCH — App: rendering + UI wiring                                     */
/* -------------------------------------------------------------------------- */

(() => {
    'use strict';

    /* ------------------------------ Utilities ------------------------------ */

    const $ = id => document.getElementById(id);

    function esc(str) {
        const div = document.createElement('div');
        div.textContent = String(str ?? '');
        return div.innerHTML;
    }

    function timeAgo(ts) {
        const s = Math.floor((Date.now() - ts) / 1000);
        if (s < 60) return 'just now';
        const m = Math.floor(s / 60);
        if (m < 60) return `${m}m ago`;
        const h = Math.floor(m / 60);
        if (h < 24) return `${h}h ago`;
        const d = Math.floor(h / 24);
        if (d < 30) return `${d}d ago`;
        return new Date(ts).toLocaleDateString();
    }

    function formatTime(seconds) {
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    }

    const VOTES_KEY = 'freqarch_votes_v1';
    function loadVotes() {
        try { return JSON.parse(localStorage.getItem(VOTES_KEY)) || []; } catch (e) { return []; }
    }
    function saveVotes(v) {
        try { localStorage.setItem(VOTES_KEY, JSON.stringify(v)); } catch (e) { /* ignore */ }
    }

    function modeBadge(el) {
        if (!el) return;
        if (Store.isCloud()) {
            el.innerHTML = '<i class="fa-solid fa-globe mr-1"></i> Shared · live';
            el.className = 'ml-3 text-[10px] font-mono uppercase tracking-widest text-neon-green border border-neon-green/30 bg-neon-green/10 px-3 py-1 rounded-full';
        } else {
            el.innerHTML = '<i class="fa-solid fa-hard-drive mr-1"></i> Saved in your browser';
            el.className = 'ml-3 text-[10px] font-mono uppercase tracking-widest text-gray-500 border border-white/10 px-3 py-1 rounded-full';
        }
    }

    /* --------------------------- Article sections -------------------------- */

    function renderRabbitHole() {
        const container = $('rabbit-hole-grid');
        rabbitHoleData.forEach(item => {
            const card = document.createElement('div');
            card.className = "glass-panel p-5 rounded-lg border-l-4 border-neon-cyan flex flex-col sm:flex-row gap-4 items-start sm:items-center hover:bg-white/5 transition-all";
            card.innerHTML = `
                <div class="flex-shrink-0 w-16 h-16 bg-black/50 rounded-full flex items-center justify-center border border-white/10 relative overflow-hidden">
                    <i class="fa-solid fa-compact-disc text-2xl text-neon-purple animate-[spin_10s_linear_infinite]"></i>
                </div>
                <div>
                    <h4 class="text-xl font-bold text-white m-0">
                        ${esc(item.successor)}
                        <span class="text-xs font-normal text-gray-500 ml-2 border border-gray-600 px-2 py-1 rounded-full">FF: ${esc(item.pioneer)}</span>
                    </h4>
                    <p class="text-sm text-gray-400 mt-2 mb-0 leading-relaxed">${esc(item.desc)}</p>
                </div>
            `;
            container.appendChild(card);
        });
    }

    function renderAnalytics() {
        const tbody = $('analytics-tbody');
        analyticsData.forEach(row => {
            const tr = document.createElement('tr');
            tr.className = "hover:bg-white/5 transition-colors";
            tr.innerHTML = `
                <th scope="row" class="px-6 py-4 font-bold text-white whitespace-nowrap">${esc(row.artist)}</th>
                <td class="px-6 py-4 text-neon-cyan">${esc(row.subgenre)}</td>
                <td class="px-6 py-4 text-gray-300">${esc(row.pop)}</td>
                <td class="px-6 py-4 text-gray-400 text-xs">${esc(row.diff)}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    /* ------------------------------ Blog ----------------------------------- */

    function renderBlog() {
        const grid = $('blog-grid');
        blogPosts.forEach(post => {
            const card = document.createElement('article');
            card.className = "blog-card glass-panel rounded-xl overflow-hidden hover:border-neon-cyan/40 transition-colors";
            const dateStr = new Date(post.date + 'T12:00:00').toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
            card.innerHTML = `
                <button class="blog-header w-full text-left p-6 flex items-start justify-between gap-4 cursor-pointer group" aria-expanded="false">
                    <div>
                        <div class="flex flex-wrap gap-2 mb-3">
                            ${post.tags.map(t => `<span class="text-[10px] uppercase tracking-widest text-neon-cyan bg-neon-cyan/10 border border-neon-cyan/20 px-2 py-0.5 rounded-full">${esc(t)}</span>`).join('')}
                        </div>
                        <h3 class="text-xl md:text-2xl font-display font-bold text-white m-0 group-hover:text-neon-cyan transition-colors">${esc(post.title)}</h3>
                        <p class="text-xs text-gray-500 font-mono mt-2 mb-3">${esc(dateStr)} · ${esc(post.author)} · ${esc(post.readTime)} read</p>
                        <p class="text-sm text-gray-400 m-0 leading-relaxed">${esc(post.excerpt)}</p>
                    </div>
                    <i class="fa-solid fa-chevron-down blog-toggle-icon text-gray-500 mt-2 flex-shrink-0"></i>
                </button>
                <div class="blog-body px-6 pb-6">
                    <div class="border-t border-white/10 pt-5 prose prose-invert prose-sm max-w-none prose-p:text-gray-300 prose-strong:text-white prose-em:text-neon-cyan">
                        ${post.body}
                    </div>
                </div>
            `;
            card.querySelector('.blog-header').addEventListener('click', () => {
                const isOpen = card.classList.toggle('open');
                card.querySelector('.blog-header').setAttribute('aria-expanded', isOpen);
            });
            grid.appendChild(card);
        });
    }

    /* --------------------------- Living Archive ---------------------------- */

    const TAB_CONFIG = {
        moments: {
            formTitle: 'Log a Defining Moment',
            f1: 'Moment Title *', f1ph: 'e.g. The Belleville Three invent techno',
            f2: 'Year', f2ph: 'e.g. 1985',
            text: 'Why It Mattered *', textph: 'Tell the story...',
            icon: 'fa-clock-rotate-left', chipColor: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10'
        },
        artists: {
            formTitle: 'Nominate an Artist for the Spotlight',
            f1: 'Artist Name *', f1ph: 'e.g. Djrum',
            f2: 'Genre', f2ph: 'e.g. Halftime DnB',
            text: 'Why They Deserve the Light *', textph: 'Make the case...',
            icon: 'fa-star', chipColor: 'text-neon-purple border-neon-purple/30 bg-neon-purple/10'
        },
        tracks: {
            formTitle: 'Submit a Track That Must Be Heard',
            f1: 'Track Title *', f1ph: 'e.g. Brown Paper Bag',
            f2: 'Artist', f2ph: 'e.g. Roni Size',
            text: 'Why It Needs to Be Played *', textph: 'What makes it essential...',
            icon: 'fa-record-vinyl', chipColor: 'text-neon-cyan border-neon-cyan/30 bg-neon-cyan/10'
        }
    };

    let archiveCache = { moments: [], artists: [], tracks: [] };
    let votedIds = loadVotes();
    let activeTab = 'moments';

    async function refreshArchive(flashId) {
        archiveCache = await Store.getArchive();
        renderArchive(flashId);
    }

    function renderArchive(flashId) {
        const list = $('archive-list');
        list.innerHTML = '';
        const cfg = TAB_CONFIG[activeTab];
        const items = [...(archiveCache[activeTab] || [])].sort((a, b) => (b.votes - a.votes) || (b.ts - a.ts));

        if (!items.length) {
            list.innerHTML = `<p class="text-gray-500 text-sm font-mono text-center py-8">// no entries yet — be the first to commit to the archive</p>`;
            return;
        }

        items.forEach(item => {
            const voted = votedIds.includes(item.id);
            const div = document.createElement('div');
            div.className = "glass-panel p-5 rounded-lg flex gap-4 items-start" + (item.id === flashId ? ' archive-flash' : '');
            div.innerHTML = `
                <button class="vote-btn ${voted ? 'voted' : ''} flex-shrink-0 flex flex-col items-center justify-center w-14 h-14 rounded-lg border border-white/10 bg-black/30 text-gray-400" data-id="${esc(item.id)}" ${voted ? 'disabled' : ''} aria-label="Upvote">
                    <i class="fa-solid fa-chevron-up text-xs"></i>
                    <span class="font-display font-bold text-sm">${item.votes}</span>
                </button>
                <div class="min-w-0">
                    <div class="flex flex-wrap items-center gap-2 mb-1">
                        <h4 class="text-white font-bold m-0 text-base">
                            ${activeTab === 'tracks' && item.f2 ? `${esc(item.f2)} — ${esc(item.f1)}` : esc(item.f1)}
                        </h4>
                        ${item.f2 && activeTab !== 'tracks' ? `<span class="text-[10px] uppercase tracking-widest border px-2 py-0.5 rounded-full ${cfg.chipColor}">${esc(item.f2)}</span>` : ''}
                    </div>
                    <p class="text-sm text-gray-300 m-0 leading-relaxed">${esc(item.text)}</p>
                    <p class="text-[11px] text-gray-500 font-mono mt-2 mb-0">
                        <i class="fa-solid ${cfg.icon} mr-1"></i>${esc(item.handle || 'Anonymous Raver')} · ${timeAgo(item.ts)}
                    </p>
                </div>
            `;
            list.appendChild(div);
        });

        list.querySelectorAll('.vote-btn:not(.voted)').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.dataset.id;
                if (votedIds.includes(id)) return;
                // Optimistic UI
                const item = archiveCache[activeTab].find(x => x.id === id);
                if (item) item.votes++;
                votedIds.push(id);
                saveVotes(votedIds);
                renderArchive();
                await Store.voteArchive(activeTab, id);
                refreshArchive();
            });
        });
    }

    function switchTab(tab) {
        activeTab = tab;
        document.querySelectorAll('.archive-tab').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });
        const cfg = TAB_CONFIG[tab];
        $('archive-form-title').textContent = cfg.formTitle;
        $('archive-f1-label').textContent = cfg.f1;
        $('archive-f1').placeholder = cfg.f1ph;
        $('archive-f2-label').textContent = cfg.f2;
        $('archive-f2').placeholder = cfg.f2ph;
        $('archive-text-label').textContent = cfg.text;
        $('archive-text').placeholder = cfg.textph;
        renderArchive();
    }

    async function initArchive() {
        document.querySelectorAll('.archive-tab').forEach(btn => {
            btn.addEventListener('click', () => switchTab(btn.dataset.tab));
        });

        $('archive-form').addEventListener('submit', async e => {
            e.preventDefault();
            const f1 = $('archive-f1').value.trim();
            const f2 = $('archive-f2').value.trim();
            const text = $('archive-text').value.trim();
            const handle = $('archive-handle').value.trim() || 'Anonymous Raver';
            if (!f1 || !text) return;

            const submitBtn = $('archive-form').querySelector('button[type=submit]');
            submitBtn.disabled = true;
            const id = await Store.addArchiveItem(activeTab, { f1, f2, text, handle });
            votedIds.push(id); // your own submission carries your vote
            saveVotes(votedIds);
            $('archive-form').reset();
            submitBtn.disabled = false;
            await refreshArchive(id);
        });

        switchTab('moments');
        modeBadge($('archive-mode'));
        await refreshArchive();
    }

    /* ------------------------------ Comments -------------------------------- */

    let comments = [];

    function renderComments() {
        const list = $('comments-list');
        list.innerHTML = '';
        $('comment-count').textContent = `${comments.length} transmission${comments.length === 1 ? '' : 's'}`;

        [...comments].sort((a, b) => b.ts - a.ts).forEach(comment => {
            const div = document.createElement('div');
            div.className = "glass-panel p-5 rounded-lg border-l border-white/10 relative overflow-hidden group";
            div.innerHTML = `
                <div class="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-neon-cyan to-neon-purple opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded bg-dark border border-white/20 flex items-center justify-center text-neon-cyan font-display font-bold text-sm">
                            ${esc(comment.name.charAt(0).toUpperCase())}
                        </div>
                        <div>
                            <h5 class="text-white font-bold text-sm m-0">${esc(comment.name)}</h5>
                            ${comment.genre ? `<span class="text-[10px] text-neon-magenta uppercase tracking-wider">${esc(comment.genre)}</span>` : ''}
                        </div>
                    </div>
                    <span class="text-xs text-gray-500 font-mono">${timeAgo(comment.ts)}</span>
                </div>
                <p class="text-sm text-gray-300 m-0">${esc(comment.text)}</p>
            `;
            list.appendChild(div);
        });
    }

    async function initComments() {
        $('comment-form').addEventListener('submit', async e => {
            e.preventDefault();
            const name = $('c-name').value.trim();
            const genre = $('c-genre').value.trim();
            const text = $('c-text').value.trim();
            if (!name || !text) return;

            const submitBtn = $('comment-form').querySelector('button[type=submit]');
            submitBtn.disabled = true;
            await Store.addComment({ name, genre, text });
            $('comment-form').reset();
            submitBtn.disabled = false;
            comments = await Store.getComments();
            renderComments();
        });

        modeBadge($('comments-mode'));
        comments = await Store.getComments();
        renderComments();
    }

    /* ------------------------------ Player UI ------------------------------- */

    function initPlayerUI() {
        const playIcon = $('play-icon');
        const playlistMenu = $('playlist-menu');
        const playlistList = $('playlist-list');
        const badge = $('engine-badge');

        function loadTrackUI(index) {
            const track = AudioEngine.TRACKS[index];
            $('track-title').textContent = track.title;
            $('track-genre').textContent = `${track.genre} · after ${track.inspiredBy}`;
            const pos = AudioEngine.getPosition();
            $('time-total').textContent = formatTime(pos.duration);
            highlightPlaylistItem(index);
        }

        function highlightPlaylistItem(index) {
            playlistList.querySelectorAll('li').forEach((item, i) => {
                const active = i === index;
                item.classList.toggle('text-neon-cyan', active);
                item.classList.toggle('bg-white/10', active);
                item.classList.toggle('text-gray-400', !active);
                const eq = item.querySelector('.eq');
                if (eq) eq.style.display = (active && AudioEngine.isPlaying()) ? 'inline-flex' : 'none';
            });
        }

        AudioEngine.TRACKS.forEach((track, index) => {
            const li = document.createElement('li');
            li.className = "px-3 py-2 rounded cursor-pointer hover:bg-white/5 transition-colors text-gray-400 flex items-center justify-between gap-2";
            li.innerHTML = `
                <div class="min-w-0">
                    <span class="font-bold block truncate">${esc(track.title)}</span>
                    <span class="text-[10px] font-mono text-gray-500 block truncate">${esc(track.genre)} · after ${esc(track.inspiredBy)}</span>
                </div>
                <span class="eq flex-shrink-0" style="display:none"><span></span><span></span><span></span></span>
            `;
            li.addEventListener('click', () => {
                AudioEngine.setTrack(index);
                if (!AudioEngine.isPlaying()) AudioEngine.play();
            });
            playlistList.appendChild(li);
        });

        AudioEngine.on('track', loadTrackUI);
        AudioEngine.on('state', isPlaying => {
            playIcon.classList.toggle('fa-play', !isPlaying);
            playIcon.classList.toggle('fa-pause', isPlaying);
            playIcon.classList.toggle('ml-1', !isPlaying);
            badge.textContent = isPlaying ? 'SYNTH: LIVE' : 'SYNTH: IDLE';
            badge.classList.toggle('text-neon-green', isPlaying);
            badge.classList.toggle('border-neon-green/40', isPlaying);
            badge.classList.toggle('text-gray-500', !isPlaying);
            highlightPlaylistItem(AudioEngine.currentIndex());
        });

        $('btn-play').addEventListener('click', () => AudioEngine.toggle());
        $('btn-prev').addEventListener('click', () => AudioEngine.prev());
        $('btn-next').addEventListener('click', () => AudioEngine.next());
        const heroBtn = $('hero-play-btn');
        if (heroBtn) heroBtn.addEventListener('click', () => {
            AudioEngine.play();
            heroBtn.innerHTML = '<i class="fa-solid fa-wave-square mr-2"></i> Engine Running';
        });

        $('btn-playlist').addEventListener('click', e => {
            e.stopPropagation();
            playlistMenu.classList.toggle('hidden');
        });
        document.addEventListener('click', e => {
            if (!playlistMenu.classList.contains('hidden') && !playlistMenu.contains(e.target)) {
                playlistMenu.classList.add('hidden');
            }
        });

        $('progress-container').addEventListener('click', e => {
            const rect = e.currentTarget.getBoundingClientRect();
            AudioEngine.seek((e.clientX - rect.left) / rect.width);
        });

        const volContainer = $('volume-container');
        const volBar = $('volume-bar');
        const volIcon = $('vol-icon');

        function setVolFromEvent(e) {
            const rect = volContainer.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const v = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
            AudioEngine.setVolume(v);
            volBar.style.width = `${v * 100}%`;
            volBar.style.opacity = 1;
            updateVolIcon(v, false);
        }

        function updateVolIcon(v, isMuted) {
            volIcon.className = 'fa-solid text-sm ' + (
                isMuted || v === 0 ? 'fa-volume-xmark' : v < 0.5 ? 'fa-volume-low' : 'fa-volume-high'
            );
        }

        let dragging = false;
        volContainer.addEventListener('pointerdown', e => { dragging = true; setVolFromEvent(e); });
        document.addEventListener('pointermove', e => { if (dragging) setVolFromEvent(e); });
        document.addEventListener('pointerup', () => { dragging = false; });

        $('btn-mute').addEventListener('click', () => {
            const muted = AudioEngine.toggleMute();
            updateVolIcon(AudioEngine.getVolume(), muted);
            volBar.style.opacity = muted ? 0.3 : 1;
        });

        const miniBars = Array.from($('mini-viz').children);
        const bands = [[1, 4], [5, 12], [13, 28], [29, 52], [53, 90]];

        function tick() {
            const pos = AudioEngine.getPosition();
            $('progress-bar').style.width = `${Math.min(100, (pos.seconds / pos.duration) * 100)}%`;
            $('time-current').textContent = formatTime(Math.min(pos.seconds, pos.duration));
            $('time-total').textContent = formatTime(pos.duration);

            const spectrum = AudioEngine.isPlaying() ? AudioEngine.getSpectrum() : null;
            miniBars.forEach((bar, i) => {
                if (spectrum) {
                    const [lo, hi] = bands[i];
                    let sum = 0;
                    for (let b = lo; b <= hi; b++) sum += spectrum[b];
                    const avg = sum / (hi - lo + 1) / 255;
                    bar.style.height = `${Math.max(8, avg * 100)}%`;
                } else {
                    bar.style.height = '10%';
                }
            });

            requestAnimationFrame(tick);
        }

        loadTrackUI(0);
        tick();
    }

    /* ------------------------------ Chrome ---------------------------------- */

    function setupScrollEffects() {
        const navbar = $('navbar');
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('bg-[#13131f]/90', window.scrollY > 50);
            navbar.classList.toggle('shadow-lg', window.scrollY > 50);
        });
    }

    function setupMobileMenu() {
        const btn = $('mobile-menu-btn');
        const menu = $('mobile-menu');
        btn.addEventListener('click', () => menu.classList.toggle('hidden'));
        menu.querySelectorAll('.mobile-link').forEach(a => {
            a.addEventListener('click', () => menu.classList.add('hidden'));
        });
    }

    /* ------------------------------ Boot ------------------------------------ */

    document.addEventListener('DOMContentLoaded', () => {
        try { initThreeJS(); } catch (e) { console.warn('3D background unavailable:', e); }
        renderRabbitHole();
        renderAnalytics();
        renderBlog();
        initPlayerUI();
        setupScrollEffects();
        setupMobileMenu();
        // Async, backend-aware sections (cloud or local)
        initArchive().catch(e => console.warn('archive init failed', e));
        initComments().catch(e => console.warn('comments init failed', e));
    });
})();
