// All songs needed to be loaded
class Album {
    constructor (title, songs) {
        this.title = title;
        this.songs = songs;
    }
}
const work = new Album("Andy's work", ["Winter_warmth", "Bio", "Passion", "Trance"]);
const LIBRARY = [work];
const MUSIC_DIR = 'asset/musics/charts/';   // from the path where this .js file is at

let CURRENT_ALBUM = null;

// Fetch + parse one chart JSON by name.
async function loadTrack(name) {
    const file = name.endsWith('.json') ? name : name + '.json';
    const jsonPath = new URL(MUSIC_DIR + encodeURIComponent(file), location.href);
    const res = await fetch(jsonPath);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText} (${jsonPath})`);
    const json = await res.json();

    const frames = Object.values(json.data).map(f => Object.values(f));

    const { info } = json;
    if (!info.wav_path) throw new Error(`chart "${name}" has no path to sound file`);

    return {
        title:      info.title ?? "unknown Track",
        artist:     info.artist ?? 'Unknown Artist',
        audioPath:   new URL(info.wav_path, jsonPath).href,
        bar_count:  frames[0].length,
        fps:        info.frame_frequency,
        frames:     frames
    };
}

function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
}

const dragHandler = function(e) {
    const host = e.currentTarget;
    var rect = host.getBoundingClientRect();
    var shiftX = e.clientX - rect.left;
    var shiftY = e.clientY - rect.top;
    function move(e) {
        host.style.left = e.clientX - shiftX + 'px';
        host.style.top = e.clientY - shiftY + 'px';
        host.style.right = 'auto';
    }
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', () => 
    document.removeEventListener('mousemove', move), { once: true }
    );
};

function makeDraggable(object) {
    object.style.position = "fixed";
    object.addEventListener('mousedown', dragHandler);
}

function cancelDraggable(object) {
    object.style.position = "fixed";
    object.removeEventListener('mousedown', dragHandler);
}

class Visualizer {
    constructor(doc, {
        barCount        = 16,
        transitionRatio = 0.8,        // bar transition = this share of one chart frame
        colorVars       = ['--violet-deep', '--violet', '--magenta', '--amber'],
    } = {}) {
        this.doc             = doc;
        this.barCount        = barCount;
        this.transitionRatio = transitionRatio;
        this.colorVars       = colorVars;

        this.transitionMs = 0;
        this.container    = null;     // the #viz element while expanded
        this.bars         = [];       // bar elements; empty while collapsed
        this.barVals      = [];       // last values drawn
        this.barUpdater   = null;     // requestAnimationFrame id of the running loop
    }

    // Create the bars inside `container` (the #viz of a freshly expanded player).
    build(container) {
        function hexToRgb(h) {
            if (h.startsWith('#')) {
                const n = parseInt(h.slice(1), 16);
                return [n >> 16, (n >> 8) & 255, n & 255];
            }
            return h.match(/\d+(\.\d+)?/g).slice(0, 3).map(Number);
        }

        function colorAt(stops, t) {
            const seg = t * (stops.length - 1);
            const i = Math.min(Math.floor(seg), stops.length - 2);
            const f = seg - i;
            const a = hexToRgb(stops[i]), b = hexToRgb(stops[i + 1]);
            return `rgb(${a.map((c, k) => Math.round(c + (b[k] - c) * f)).join(',')})`;
        }
        
        this.container = container;
        container.style.setProperty('--bar-transition', this.transitionMs + 'ms');

        const css   = getComputedStyle(this.doc.documentElement);
        const stops = this.colorVars.map(v => css.getPropertyValue(v).trim());

        this.bars = [];
        for (let i = 0; i < this.barCount; i++) {
            const b = this.doc.createElement('div');
            b.className = 'bar';
            b.style.background = colorAt(stops, i / (this.barCount - 1));
            container.appendChild(b);
            this.bars.push(b);
        }

        // Measure once: bar width (decided by flex + gaps) and the full height available.
        this.barW  = this.bars[0].getBoundingClientRect().width;
        this.fullH = container.clientHeight;

        this.set(this.barVals);       // show the current state right away
    }

    // Forget the bars after their HTML is removed (collapse).
    detach() {
        this.bars = [];
        this.container = null;
    }

    // Adapt the bar easing to a chart's frame rate.
    setFrameRate(fps) {
        this.transitionMs = this.transitionRatio * 1000 / fps;
        this.container?.style.setProperty('--bar-transition', this.transitionMs + 'ms');
    }

    // Draw one frame of values (0..1). Missing values draw as the minimum height.
    // Does nothing while there are no bars (collapsed).
    set(values) {
        this.barVals = values;
        if (this.bars.length !== this.barCount) return;
        for (let i = 0; i < this.barCount; i++) {
            const v = Math.min(1, values[i] ?? 0);
            // 0 -> circle (height = width), 1 -> full height
            this.bars[i].style.height = (this.barW + v * (this.fullH - this.barW)) + 'px';
        }
    }

    // Run the animation loop: every screen frame, nextFrame() returns the values to draw.
    start(animationFrame) {
        cancelAnimationFrame(this.barUpdater);        // never run two loops at once
        const step = () => {
            this.set(animationFrame());               // call it: it returns this frame's values
            this.barUpdater = requestAnimationFrame(step);
        };
        this.barUpdater = requestAnimationFrame(step);
    }

    // Stop the loop and flatten the bars.
    stop() {
        cancelAnimationFrame(this.barUpdater);
        this.barUpdater = null;
        this.set([]);
    }
}

class MP3 {
    constructor(doc) {
        this.doc = doc;
        this.html = {
            expanded: `
            <style>
                * { box-sizing: border-box; margin: 0; padding: 0; }
 
                :host {
                    all: initial;
                    display: block;
                    font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
                    color: var(--ink);
                }
 
                .player {
                    width: 280px;
                    padding: 28px 24px 24px;
                    border-radius: 24px;
                    border: 1px solid var(--on-dark-line);      /* keeps the edge visible on dark sections */
                    box-shadow: var(--shadow-dark);
                    background: var(--ink-overlay);             /* dark glass, contrasts with light sections */
                    color: var(--on-dark);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    cursor: move;
                }
 
                /* ---------- Album picker ---------- */
                .album {
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    margin-bottom: 6px;
                    border: none;
                    background: none;
                    font: inherit;
                    font-size: 11px;
                    letter-spacing: .04em;
                    color: var(--on-dark-muted);
                    cursor: pointer;
                    transition: color .15s var(--ease);
                }
                .album:hover, .album.open { color: var(--on-dark); }
                .album svg { fill: currentColor; transition: rotate .2s var(--ease); }
                .album.open svg { rotate: 180deg; }
 
                .stage { position: relative; }              /* title, artist, viz and album list share this spot */
                .stage.picking > :not(.albums) { visibility: hidden; } /* keeps their size, so bar measurements stay valid */
 
                .albums {
                    position: absolute;
                    inset: 0;
                    display: none;
                    flex-direction: column;
                    gap: 2px;
                    overflow-y: auto;
                }
                .stage.picking .albums { display: flex; }
 
                .album-row {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    width: 100%;
                    padding: 7px 10px;
                    border: none;
                    border-radius: var(--radius-sm);
                    background: none;
                    font: inherit;
                    font-size: 13px;
                    color: var(--on-dark-soft);
                    text-align: left;
                    cursor: pointer;
                    transition: background .15s var(--ease);
                }
                .album-row:hover:not(:disabled) { background: var(--on-dark-line); }
                .album-row .dot {
                    width: 6px; height: 6px;
                    border-radius: 50%;
                    flex: none;
                    background: transparent;
                }
                .album-row.current { color: var(--on-dark); }
                .album-row.current .dot { background: var(--violet); box-shadow: 0 0 6px var(--violet-glow); }
                .album-row .count { margin-left: auto; font-size: 11px; color: var(--on-dark-muted); }
                .album-row:disabled { color: var(--on-dark-faint); cursor: default; }
                .album-row:disabled .count { color: var(--on-dark-faint); }
 
                .title  { font-size: 20px; font-weight: 600; }
                .artist { font-size: 12px; margin-top: 3px; }
                .notice { font-size: 12px; color: var(--on-dark-muted); margin-top: 12px; font-style: italic; text-align: right}
 
                /* ---------- Visualizer ---------- */
                .viz {
                    height: 90px;
                    margin: 20px 0 20px;
                    display: flex;
                    align-items: center;        /* bars centered on the midline */
                    gap: 5px;
                }
 
                .bar {
                    flex: 1;                    /* width comes from the gaps */
                    border-radius: 99px;        /* clamps to half the width -> round ends */
                    transition: height var(--bar-transition) linear;
                }
 
                /* ---------- Progress ---------- */
                .progress {
                    height: 3px;
                    border-radius: 2px;
                    background: var(--on-dark-line);            /* empty track */
                }
                .progress span {
                    display: block;
                    width: 0%;
                    height: 100%;
                    border-radius: 2px;
                    background: var(--violet);
                }
                .times {
                    display: flex;
                    justify-content: space-between;
                    font-size: 11px;
                    color: var(--on-dark-muted);
                    margin-top: 6px;
                    font-variant-numeric: tabular-nums;
                }
 
                /* ---------- Controls ---------- */
                .controls {
                    margin-top: 18px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 18px;
                }
                .btn {
                    border: none;
                    background: none;
                    color: var(--on-dark);                      /* prev / next icons */
                    cursor: pointer;
                    display: grid;
                    place-items: center;
                }
                .btn svg { fill: currentColor; }
                .btn.play {
                    width: 52px; height: 52px;
                    min-width: 52px; min-height: 52px;
                    border-radius: 50%;
                    background: var(--violet);
                    color: #fff;
                    transition: background .15s;
                }
                .btn.play:hover { background: var(--violet-deep); }
                .btn.play.no-playing .icon-play  { display: block; }
                .btn.play.no-playing .icon-pause { display: none; }
                .btn.play.is-playing .icon-play  { display: none; }
                .btn.play.is-playing .icon-pause { display: block; }
            </style>
 
            <div class="player">
                <button id="album" class="album" aria-label="Choose album">
                    <span id="albumName"></span>
                    <svg width="16" height="16" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
                </button>
                <div class="stage" id="stage">
                    <div class="title"></div>
                    <div class="artist"></div>
                    <div class="viz" id="viz"></div>
                    <div class="albums" id="albums"></div>
                </div>
 
                <div class="progress"><span id="progressFill"></span></div>
                <div class="times"><span>1:24</span><span>3:42</span></div>
 
                <div class="controls">
                    <button id="prev", class="btn" aria-label="Previous">
                        <svg width="18" height="18" viewBox="0 0 24 24"><path d="M6 5h2v14H6zM20 5v14L9 12z"/></svg>
                    </button>

                    <button id="backward", class="btn", aria-label="Bwd", style="transform: scaleX(-1)">
                            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M2.58 16.93A8.25 8.25 0 1 1 18.59 14.11L16.09 14.11A5.75 5.75 0 1 0 4.93 16.08zM12.84 14.11L17.34 20.11L21.84 14.11z"/></svg>
                    </button>
 
                    <button id="play" class="btn play no-playing" aria-label="Play / Pause">
                        <svg class="icon-play"  width="20" height="20" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        <svg class="icon-pause" width="20" height="20" viewBox="0 0 24 24"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>
                    </button>

                
                    <button id="forward", class="btn", aria-label="Fwd">
                        <svg width="18" height="18" viewBox="0 0 24 24"><path d="M2.58 16.93A8.25 8.25 0 1 1 18.59 14.11L16.09 14.11A5.75 5.75 0 1 0 4.93 16.08zM12.84 14.11L17.34 20.11L21.84 14.11z"/></svg>
                    </button>
 
                    <button id="next", class="btn" aria-label="Next">
                        <svg width="18" height="18" viewBox="0 0 24 24"><path d="M16 5h2v14h-2zM4 5v14l11-7z"/></svg>
                    </button>
                </div>
                <div class="notice">double click to close</div>
            </div>
            `, 
            collapsed: `
            <style>
                * { box-sizing: border-box; margin: 0; padding: 0; }

                body {
                    min-height: 100vh;
                    background: var(--surface-alt);
                }

                .dock {
                    --icon: 44px;                                   /* violet circle size */
                    --pad: 10px;                                    /* gap around circle  */
                    --h: calc(var(--icon) + 2 * var(--pad));        /* tab height         */

                    display:block;
                    width: var(--h);  
                    height: var(--h);
                    /* 1px less padding where the border is, so the 44px circle still fits exactly */
                    padding: calc(var(--pad) - 1px) var(--pad) calc(var(--pad) - 1px) calc(var(--pad) - 1px);
                    border: 1px solid var(--on-dark-line);
                    border-right: none;                             /* flush with the screen edge */
                    border-radius: calc(var(--h) / 2) 0 0 calc(var(--h) / 2);
                    background: var(--ink-overlay);                 /* dark glass, matches the player */
                    backdrop-filter: blur(4px);
                    -webkit-backdrop-filter: blur(12px);
                    box-shadow: var(--shadow-dark);
                    cursor: pointer;
                    transition: translate 0.3s var(--ease);
                }
                .dock.tucked       { translate: 40% 0; } 
                .dock.tucked:hover { translate: 0 0; }
                .dock .icon {
                    width: var(--icon);
                    height: var(--icon);
                    border-radius: 50%;
                    background: var(--violet);
                    box-shadow: var(--shadow-brand);
                    display: grid;
                    place-items: center;
                    transition: background .3s var(--ease);
                }
                @keyframes spin { to { rotate: 360deg; } }
                .dock svg {
                    fill: var(--on-dark);
                    transition: scale 0.3s var(--ease);
                }
                .dock:hover .icon,
                .dock.spinning .icon { background: var(--violet-deep); }
                .dock:hover svg,
                .dock.spinning svg {
                    animation: spin 6s linear infinite;
                    scale: 1.05;
                }
            </style>

            <button title="Wanna have some music?" class="dock" aria-label="Show player">
                <div class="icon">
                    <svg width="22" height="22" viewBox="0 0 24 24"><path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z"/></svg>
                </div>
            </button>
            `
        }
        
        this.playConfig = {
            FPS: 0,
            FRAME_MS: 0,
        }

        this.tracks = [];
        this.audio = new Audio();
        this.audio.preload = 'metadata';    // don't download the whole song until play
        this.audio.addEventListener('ended', () => this.pause());   // track finished: reset play state, stop bars

        this.albumListOpen = false;         // album list showing instead of the bars
        this.albumIndex = 0;                // position in LIBRARY

        this.playStat = {
            index: 0,                       // position in this.tracks
            json: null,                     // the json file
            time: 0,                        // # of sample point
            duration: 0,                    // total length in seconds (set by selectTrack)
            playing: false,

            reset(new_index, tracks) { 
                this.index = new_index;
                this.json = tracks[new_index];
                this.time = 0; 
                this.playing = false; 
            }
        }

        this.host = doc.createElement('div');
        this.root = this.host.attachShadow({ mode: 'open' });    
        this.host.style.padding = 0;
        this.host.style.background = "none";
        this.host.style.border = "none";
        this.host.style.zIndex = "9999";

        this.visualizer = new Visualizer(doc, {barCount: 16});

        this.activator = this.activator.bind(this);
        this.deactivator = this.deactivator.bind(this);

        this.selectTrack(this.playStat.index); 
        this.collapse();
    }

    // Open & close logic
    activator() { this.expand(); }
    deactivator(eventData) { 
        if (eventData.composedPath().includes(this.host) 
            && !eventData.composedPath().includes(this.root.getElementById('play'))
            && !eventData.composedPath().includes(this.root.getElementById('prev'))
            && !eventData.composedPath().includes(this.root.getElementById('next'))
            ) this.collapse(); 
    }

    collapse() {
        this.visualizer.stop();
        this.root.innerHTML = this.html.collapsed;
        this.visualizer.detach();
        cancelDraggable(this.host);
        this.host.style.top = "50%";
        this.host.style.transform = "translateY(-50%)";
        this.host.style.left = "";
        this.host.style.right = 0;

        this.renderPlayBtn();                         // dock spins if music is still playing

        clearTimeout(this.tuckTimer);
        this.tuckTimer = setTimeout(() => {
            this.root.querySelector('.dock')?.classList.add('tucked');
        }, 500);

        this.root.removeEventListener("dblclick", this.deactivator);
        this.root.addEventListener("click", this.activator);
    }

    expand() {
        // Reopened while music plays: keep the bars moving (paused or not loaded = nothing to animate)
        if (this.playStat.playing) {
            this.visualizer.start(() => {
                this.renderTrackInfo(false);
                return this.currentAnimationFrame();
            });
        }

        clearTimeout(this.tuckTimer);
        this.root.innerHTML = this.html.expanded;
        makeDraggable(this.host);
        this.host.style.top = "50%";
        this.host.style.transform = "";
        this.host.style.left = "";
        this.host.style.right = "20%";

        this.root.removeEventListener("click", this.activator)
        this.root.addEventListener("dblclick", this.deactivator);

        const prevBtn = this.root.getElementById('prev');
        const playBtn = this.root.getElementById('play');
        const nextBtn = this.root.getElementById('next');
        const fwdBtn = this.root.getElementById('forward');
        const bwdBtn = this.root.getElementById('backward');
        prevBtn.addEventListener('click', (e)=>{this.changeTrack(-1); e.stopPropagation();});
        bwdBtn.addEventListener('click', (e)=>{this.jump(-10); e.stopPropagation();});
        playBtn.addEventListener('click', (e)=>{this.togglePlay(); e.stopPropagation();});
        fwdBtn.addEventListener('click', (e)=>{this.jump(10); e.stopPropagation();});
        nextBtn.addEventListener('click', (e)=>{this.changeTrack(+1); e.stopPropagation();});

        this.renderAlbum();
        const albumBtn = this.root.getElementById('album');
        albumBtn.addEventListener('click', (e)=>{this.toggleAlbums(); e.stopPropagation();});

        this.renderTrackInfo(true);
        this.renderPlayBtn();
        this.visualizer.build(this.root.getElementById('viz'));
    }

    // Album picking
    toggleAlbums(given_state = null) {
        this.albumListOpen = given_state || !this.albumListOpen;
        this.root.getElementById('stage')?.classList.toggle('picking', this.albumListOpen);
        this.root.getElementById('album')?.classList.toggle('open', this.albumListOpen);
        if (this.albumListOpen) this.renderAlbumList();
    }
 
    async chooseAlbum(i) {
        if (i === this.albumIndex) { this.toggleAlbums(false); return; }
        let prev = this.albumIndex;
        this.albumIndex = i;
        this.pause();
        try {
            await this.loadSongs();
        } catch (err) {
            this.albumIndex = prev;
            console.warn('[mp3] could not load album:', err);
            return;
        }
        this.toggleAlbums(false);
    }

    // Songs
    async loadSongs() {
        const songs = LIBRARY[this.albumIndex].songs;
        const songsLoaded = await Promise.all(songs.map(name => loadTrack(name)));

        for (let song of songsLoaded) {
            if (song.bar_count != this.visualizer.barCount)
                throw new Error(`${song.title} contains ${song.bar_count} channels, expected: ${this.visualizer.barCount}`);
        }

        if (!songsLoaded.length || !songsLoaded.length > 0) 
            throw new Error("failed to load songs: no songs registered or json format incorrect.");
        
        this.tracks = songsLoaded;
        this.selectTrack(0);
    }

    selectTrack(i) {
        const n = this.tracks.length;
        if (!n) return;
        i = ((i % n) + n) % n;      // -1 → n-1,  n → 0
        this.playStat.reset(i, this.tracks);

        const track = this.playStat.json;
        this.audio.src = track.audioPath;

        this.playConfig.FPS           = track.fps;
        this.playConfig.FRAME_MS      = 1000 / track.fps;
        this.visualizer.setFrameRate(track.fps);

        this.playStat.duration = track.frames.length / track.fps;

        this.renderTrackInfo(true);
    }

    // Page renderer
    currentAnimationFrame() {                
        const { frames } = this.playStat.json;
        const i = Math.floor(this.audio.currentTime * this.playConfig.FPS);
        this.playStat.time = Math.min(Math.max(i, 0), frames.length - 1);
        return frames[this.playStat.time];
    }

    renderAlbum() {
        const name = this.root.getElementById('albumName');
        if (name) name.textContent = LIBRARY[this.albumIndex]?.title ?? '';
        if (this.albumListOpen) this.renderAlbumList();
    }
 
    renderAlbumList() {
        const list = this.root.getElementById('albums');
        if (!list) return;
        list.replaceChildren();
        LIBRARY.forEach((album, i) => {
            const n = album.songs.length;
            const row = this.doc.createElement('button');
            row.className = 'album-row' + (i === this.albumIndex ? ' current' : '');
            row.disabled = n === 0;
 
            const dot = this.doc.createElement('span');
            dot.className = 'dot';
            const title = this.doc.createElement('span');
            title.textContent = album.title;
            const count = this.doc.createElement('span');
            count.className = 'count';
            count.textContent = n === 0 ? 'empty' : `${n} track${n > 1 ? 's' : ''}`;
 
            row.append(dot, title, count);
            row.addEventListener('click', (e) => { this.chooseAlbum(i); e.stopPropagation(); });
            list.appendChild(row);
        });
    }

    renderTrackInfo(fresh) {
        const [cur, total] = this.root.querySelectorAll('.times span');
        if (!cur) return;                             // collapsed: no labels to update
        cur.textContent = formatTime(Math.min(this.audio.currentTime, this.playStat.duration));
        const progressFill = this.root.getElementById('progressFill');
        progressFill.style.width = (this.audio.currentTime / this.playStat.duration * 100) + '%';

        if (fresh) {
            const track = this.playStat.json;
            const title = this.root.querySelector('.title');
            if (!track || !title) return;

            title.textContent = `Track #${this.playStat.index + 1}: ${track.title}`;
            this.root.querySelector('.artist').textContent = track.artist;

            total.textContent = formatTime(this.playStat.duration);
            progressFill.style.width = '0%';
        }
    }

    // Show the play state: play/pause icon when expanded, spinning dock icon when collapsed.
    renderPlayBtn() {
        const playing = this.playStat.playing;

        const playBtn = this.root.getElementById('play');
        if (playBtn) {
            playBtn.classList.toggle('is-playing', playing);
            playBtn.classList.toggle('no-playing', !playing);
        }

        this.root.querySelector('.dock')?.classList.toggle('spinning', playing);
    }

    // Play logic
    resume() {
        // check if file is ready.
        if (!this.playStat.json) { this.playStat.playing = false; this.renderPlayBtn(); return; }

        this.playStat.playing = true;
        this.renderPlayBtn();

        this.audio.play().catch(err => {
            if (err.name === 'AbortError') return;
            console.warn('[mp3] playback failed:', err);
            this.pause();
        });

        // Each screen frame: pick the chart frame for the audio's current time.
        this.visualizer.start(() => {
            this.renderTrackInfo(false);
            return this.currentAnimationFrame();
        });
    }

    pause() {
        this.playStat.playing = false;
        this.renderPlayBtn();

        this.audio.pause();

        this.visualizer.stop();                       // stop the loop, flatten bars
    }

    async togglePlay() {
        if (!this.playStat.playing) this.resume();
        else this.pause();
    }

    jump(seconds = 10) {
        if (!this.playStat.json) return;              // nothing loaded yet
        const end = Number.isFinite(this.audio.duration) ? this.audio.duration : this.playStat.duration;
        this.audio.currentTime = Math.min(Math.max(this.audio.currentTime + seconds, 0), end);
        this.renderTrackInfo(false);                  // update time + progress now (also while paused)
    }

    changeTrack(deviation) {
        const wasPlaying = this.playStat.playing;
        this.pause()
        this.selectTrack(this.playStat.index+deviation);
        if (wasPlaying) setTimeout(() => {this.resume()}, 300);
    }

    // Add to document
    appendToDoc() { this.doc.body.appendChild(this.host); }
};

let mp3 = new MP3(document);
mp3.appendToDoc();
mp3.loadSongs().catch(console.warn);