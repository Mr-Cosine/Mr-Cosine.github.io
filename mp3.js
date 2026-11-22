// All songs needed to be loaded
const SONGS = ["Passion", "Trance"]
const MUSIC_DIR = 'asset/musics/charts/';

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

/* ============================
   Visualizer: owns the bar elements, their colours, the transition time
   and the animation loop. It only draws; the player decides which values to show.
   ============================ */
class Visualizer {
    constructor(doc, {
        barCount        = 16,
        minScale        = 0.04,       // smallest bar height (fraction of full)
        transitionRatio = 0.8,        // bar transition = this share of one chart frame
        colorVars       = ['--violet-deep', '--violet', '--magenta', '--amber'],
    } = {}) {
        this.doc             = doc;
        this.barCount        = barCount;
        this.minScale        = minScale;
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
        this.container = container;
        container.style.setProperty('--bar-transition', this.transitionMs + 'ms');

        const css   = getComputedStyle(this.doc.documentElement);
        const stops = this.colorVars.map(v => css.getPropertyValue(v).trim());

        this.bars = [];
        for (let i = 0; i < this.barCount; i++) {
            const b = this.doc.createElement('div');
            b.className = 'bar';
            b.style.background = Visualizer.colorAt(stops, i / (this.barCount - 1));
            container.appendChild(b);
            this.bars.push(b);
        }
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
            const v = Math.min(1, Math.max(this.minScale, values[i] ?? 0));
            this.bars[i].style.transform = `scaleY(${v})`;
        }
    }

    // Run the animation loop: every screen frame, nextFrame() returns the values to draw.
    start(nextFrame) {
        cancelAnimationFrame(this.barUpdater);        // never run two loops at once
        const step = () => {
            this.set(nextFrame());
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

    static hexToRgb(h) {
        if (h.startsWith('#')) {
            const n = parseInt(h.slice(1), 16);
            return [n >> 16, (n >> 8) & 255, n & 255];
        }
        return h.match(/\d+(\.\d+)?/g).slice(0, 3).map(Number);
    }

    static colorAt(stops, t) {
        const seg = t * (stops.length - 1);
        const i = Math.min(Math.floor(seg), stops.length - 2);
        const f = seg - i;
        const a = Visualizer.hexToRgb(stops[i]), b = Visualizer.hexToRgb(stops[i + 1]);
        return `rgb(${a.map((c, k) => Math.round(c + (b[k] - c) * f)).join(',')})`;
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
                    background: var(--surface);
                    box-shadow: var(--shadow-lg);
                    background: rgb(var(--white-rgb) / 0.7);
                    backdrop-filter: blur(8px);
                    -webkit-backdrop-filter: blur(8px);
                }

                .title  { font-size: 20px; font-weight: 600; }
                .artist { font-size: 12px; color: var(--muted); margin-top: 3px; }
                .notice { font-size: 12px; color: var(--muted); margin-top: 12px; font-style: italic;}

                /* ---------- Visualizer ---------- */
                .viz {
                    height: 110px;
                    margin: 26px 0 22px;
                    display: flex;
                    align-items: center;        /* bars centered on the midline */
                    gap: 5px;
                }

                .bar {
                    flex: 1;
                    height: 100%;
                    border-radius: 99px;
                    transform: scaleY(0.04);
                    transform-origin: center;   /* grows up AND down symmetrically */
                    transition: transform var(--bar-transition) linear;
                    will-change: transform;
                }

                /* ---------- Progress ---------- */
                .progress {
                    height: 3px;
                    border-radius: 2px;
                    background: var(--line);
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
                    color: var(--muted);
                    margin-top: 6px;
                    font-variant-numeric: tabular-nums;
                }

                /* ---------- Controls ---------- */
                .controls {
                    margin-top: 18px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 28px;
                }
                .btn {
                    border: none;
                    background: none;
                    color: var(--ink);
                    cursor: pointer;
                    display: grid;
                    place-items: center;
                }
                .btn svg { fill: currentColor; }
                .btn.play {
                    width: 52px; height: 52px;
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
                <div class="title"></div>
                <div class="artist"></div>

                <div class="viz" id="viz"></div>

                <div class="progress"><span id="progressFill"></span></div>
                <div class="times"><span>1:24</span><span>3:42</span></div>

                <div class="controls">
                    <button id="prev", class="btn" aria-label="Previous">
                        <svg width="18" height="18" viewBox="0 0 24 24"><path d="M6 5h2v14H6zM20 5v14L9 12z"/></svg>
                    </button>

                    <button id="play" class="btn play no-playing" aria-label="Play / Pause">
                        <svg class="icon-play"  width="20" height="20" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        <svg class="icon-pause" width="20" height="20" viewBox="0 0 24 24"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>
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
                    width: var(--h);                                /* half circle + rect */
                    height: var(--h);
                    padding: var(--pad);
                    border: none;
                    border-radius: calc(var(--h) / 2) 0 0 calc(var(--h) / 2);
                    background: rgb(var(--white-rgb) / 0.7);        /* slightly opaque    */
                    backdrop-filter: blur(8px);
                    -webkit-backdrop-filter: blur(8px);
                    box-shadow: var(--shadow-md);
                    cursor: pointer;
                }
                .dock .icon {
                    width: var(--icon);
                    height: var(--icon);
                    border-radius: 50%;
                    background: var(--violet);
                    box-shadow: var(--shadow-brand);
                    display: grid;
                    place-items: center;
                    transition: background .3s var(--ease),
                                transform .3s var(--ease);
                }
                .dock:hover .icon { 
                    background: var(--violet-deep);
                    transform: scale(1.05);
                }
                .dock svg { 
                    fill: var(--on-dark); 
                    transition: rotate 0.3s linear,
                                scale 0.3s var(--ease);
                }
                @keyframes spin {
                    0% { rotate: 0deg; }
                    50% { rotate: 180deg; }
                    100% { rotate: 360deg; }
                }
                .dock:hover svg { 
                    scale: 1.05;
                    animation: spin 6s linear infinite;
                }
            </style>

            <button class="dock" aria-label="Show player">
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

        this.visualizer = new Visualizer(doc, { barCount: 16, minScale: 0.04 });

        this.activator = this.activator.bind(this);
        this.deactivator = this.deactivator.bind(this);
        this.collapse();
    }

    activator() { this.expand(); }
    deactivator(eventData) { 
        if (eventData.composedPath().includes(this.host) 
            && !eventData.composedPath().includes(this.root.getElementById('play'))
            && !eventData.composedPath().includes(this.root.getElementById('prev'))
            && !eventData.composedPath().includes(this.root.getElementById('next'))
            ) this.collapse(); 
    }

    collapse() {
        this.pause();
        this.root.innerHTML = this.html.collapsed;
        this.visualizer.detach();                     // its bars were just removed
        cancelDraggable(this.host);
        this.host.style.top = "50%";
        this.host.style.transform = "translateY(-50%)";
        this.host.style.left = "";
        this.host.style.right = 0;

        this.root.removeEventListener("dblclick", this.deactivator);
        this.root.addEventListener("click", this.activator);
    }

    expand() {
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
        prevBtn.addEventListener('click', (e)=>{this.changeTrack(-1); e.stopPropagation();});
        playBtn.addEventListener('click', (e)=>{this.togglePlay(); e.stopPropagation();});
        nextBtn.addEventListener('click', (e)=>{this.changeTrack(+1); e.stopPropagation();});

        this.renderTrackInfo(true);
        this.renderPlayBtn();
        this.visualizer.build(this.root.getElementById('viz'));
    }

    async loadSongs() {
        const songsLoaded = await Promise.all(SONGS.map(name => loadTrack(name)));

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

    renderTrackInfo(fresh) {
        const [cur, total] = this.root.querySelectorAll('.times span');
        if (!cur) return;                             // collapsed: no labels to update
        cur.textContent = formatTime(this.audio.currentTime);
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

    renderPlayBtn() {
        const playBtn = this.root.getElementById('play');
        if (!playBtn) if (!playBtn) return;
        playBtn.classList.toggle('is-playing', this.playStat.playing);
        playBtn.classList.toggle('no-playing', !this.playStat.playing);
    }

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
            const { frames } = this.playStat.json;
            const i = Math.floor(this.audio.currentTime * this.playConfig.FPS);
            this.playStat.time = Math.min(Math.max(i, 0), frames.length - 1);
            this.renderTrackInfo(false);
            return frames[this.playStat.time];
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

    changeTrack(deviation) {
        const wasPlaying = this.playStat.playing;
        this.pause()
        this.selectTrack(this.playStat.index+deviation);
        if (wasPlaying) setTimeout(() => {this.resume()}, 300);
    }

    appendToDoc() { this.doc.body.appendChild(this.host); }
};

let mp3 = new MP3(document);
mp3.appendToDoc();
mp3.loadSongs().catch(console.warn);