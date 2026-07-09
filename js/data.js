/* -------------------------------------------------------------------------- */
/* FREQ/ARCH — Content Data                                                   */
/* -------------------------------------------------------------------------- */

const rabbitHoleData = [
    { pioneer: "Tape B", successor: "Phrva", desc: "Deep dubstep producer creating bouncy, imposing beats with meticulous sub-bass engineering. Known for viral remixes utilizing 'flutter bass' built from white noise and analog filters." },
    { pioneer: "CloZee", successor: "Chmura", desc: "Denver-based producer blending natural field recordings, rudimental percussion, and melancholic melodies. Heavily incorporates handpan into electronic tracks." },
    { pioneer: "The Glitch Mob", successor: "Spoonbill", desc: "Australian industrial designer turned electronic producer. Uses heavily edited live instrumental recordings to create deeply textured, idiosyncratic glitch-hop." },
    { pioneer: "Rusko", successor: "Distinct Motive", desc: "Fiercely dedicated to the original, deep 140 BPM UK dubstep sound. Transitions seamlessly between early 2000s Skream tracks and modern unreleased dubplates." },
    { pioneer: "DJ Jes One", successor: "Gettoblaster", desc: "Duo heavily influenced by Chicago and Detroit pushing raw, jacking house. Captures the gritty, unpolished magic of 1990s warehouse house music." },
    { pioneer: "Chase And Status", successor: "En:vy", desc: "Austrian-born minimal DnB producer with a background in pro ice hockey. Drums possess a frantic, eye-opening energy that commands the dancefloor." },
    { pioneer: "Adam X", successor: "Orphx", desc: "Canadian duo merging noisy sample collages with rhythmic industrial techno. A masterclass in tension, using distorted, mechanical soundscapes." }
];

const analyticsData = [
    { artist: "Chase & Status", subgenre: "Drum & Bass", pop: "Elite (5M+)", diff: "Stadium-level DnB crossovers" },
    { artist: "Tape B", subgenre: "Old School Dubstep", pop: "High (1M+)", diff: "90s/00s Rap acapella integration" },
    { artist: "Frankie Bones", subgenre: "Brooklyn Techno", pop: "Low / Cult", diff: "Creator of PLUR ethos" },
    { artist: "Duke Mushroom", subgenre: "Electronic Folk", pop: "Niche / Inactive", diff: "Percussionist turned folk-electronic" },
    { artist: "Phrva", subgenre: "Deep Dubstep", pop: "Growing (100K+)", diff: "Flutter bass sound design" }
];

/* -------------------------------------------------------------------------- */
/* Blog: Transmissions                                                        */
/* -------------------------------------------------------------------------- */

const blogPosts = [
    {
        id: "amen-break",
        title: "The Amen Break: Six Seconds That Built an Empire",
        date: "2026-06-28",
        author: "FREQ/ARCH Editorial",
        tags: ["Jungle", "DnB", "Sampling", "History"],
        readTime: "6 min",
        excerpt: "In 1969, a Washington D.C. funk band called The Winstons cut a B-side named \"Amen, Brother.\" Buried in its final stretch was a four-bar drum solo by Gregory \"G.C.\" Coleman — roughly six seconds of audio that would go on to underpin entire genres.",
        body: `
            <p>In 1969, a Washington D.C. funk and soul band called <strong>The Winstons</strong> released "Color Him Father," which won a Grammy. Almost nobody remembers the A-side. The B-side, <em>"Amen, Brother,"</em> contained a four-bar drum break performed by <strong>Gregory "G.C." Coleman</strong> — roughly six seconds of syncopated, crackling drums that would become the most sampled recording in music history.</p>
            <p>When early samplers like the Akai S-series arrived in the late 80s, producers began chopping the break apart. It surfaced first in hip-hop — Salt-N-Pepa's "I Desire," N.W.A's "Straight Outta Compton" — but its true mutation happened across the Atlantic. UK hardcore producers pitched it up, sliced it into individual hits, and re-sequenced it into frantic, rolling patterns. From that single break, <strong>jungle</strong> was born. Drum &amp; bass followed. Breakcore weaponized it further. Even mainstream pop and television idents borrowed its DNA.</p>
            <p>The tragedy is well documented: neither Coleman nor bandleader <strong>Richard Spencer</strong> ever received royalties for the tens of thousands of tracks built on their six seconds. Coleman died in 2006. In 2015, a crowdfunding campaign organized by UK DJs raised over £24,000 for Spencer — a small, late act of restitution from a culture that owes the break everything.</p>
            <p>Listen to any DnB set today — including the Amen-inspired session in this site's own synthesis engine — and you are hearing the ghost of G.C. Coleman's right hand.</p>
        `
    },
    {
        id: "plur-origins",
        title: "PLUR: The Four Letters That Codified a Culture",
        date: "2026-06-14",
        author: "FREQ/ARCH Editorial",
        tags: ["Rave Culture", "Frankie Bones", "Brooklyn", "History"],
        readTime: "5 min",
        excerpt: "Peace, Love, Unity, Respect. Before it was a hashtag or a kandi bracelet trade, it was a Brooklyn DJ's demand for order at an illegal warehouse party.",
        body: `
            <p>By the early 1990s, <strong>Frankie Bones</strong> had already exported American rave culture in the opposite direction of everyone else. After playing massive UK warehouse parties in 1989, he brought the blueprint home to Brooklyn and launched the <strong>Storm Rave</strong> series — illegal, industrial, and legendary parties that gave first breaks to a generation of American DJs.</p>
            <p>As the story goes, during a Storm Rave around 1993 a fight broke out near the stage. Bones grabbed the microphone and issued an ultimatum that has been paraphrased ever since: if the crowd didn't start showing some <em>peace, love, and unity</em>, he'd end the party. The phrase stuck, "respect" completed the acronym, and <strong>PLUR</strong> became the ethical constitution of global rave culture.</p>
            <p>What's remarkable is how durable those four letters proved. They survived the scene's criminalization in the 90s, the superclub era, the 2010s EDM industrial complex, and every cycle of the culture eating itself. The kandi handshake — peace, love, unity, respect, traded bead by bead — remains one of the few rituals that connects a Brooklyn warehouse in 1992 to a festival mainstage today.</p>
            <p>Bones himself remains a working DJ and a fierce advocate for the scene's underground roots — proof that the culture's founding documents were written not in boardrooms, but on concrete floors in outer-borough darkness.</p>
        `
    },
    {
        id: "even-furthur-96",
        title: "Even Furthur '96: The Night Daft Punk Played a Wisconsin Farm",
        date: "2026-05-30",
        author: "FREQ/ARCH Editorial",
        tags: ["Daft Punk", "Midwest", "Drop Bass Network", "History"],
        readTime: "7 min",
        excerpt: "Before Homework, before the pyramid, before the robots — two young Frenchmen played their first American show in the rural Wisconsin mud, booked by the Drop Bass Network for a crowd of Midwest ravers.",
        body: `
            <p>In the spring of 1996, <strong>Daft Punk</strong> were not yet robots. They were two young producers from Paris with a handful of singles on Soma Records and an album — <em>Homework</em> — still months from release. Their first-ever live performance in the United States did not happen in New York or Los Angeles. It happened at <strong>Even Furthur</strong>, a multi-day campout rave in rural Wisconsin thrown by <strong>Kurt Eckes</strong> and the <strong>Drop Bass Network</strong>.</p>
            <p>The conditions were biblical: relentless rain, ankle-deep mud, generators, and a crowd of Midwest ravers who had driven hours into the countryside on faith. Attendees describe Thomas Bangalter and Guy-Manuel de Homem-Christo hauling their own gear through the muck and delivering a raw, hardware-driven live set — "Da Funk" pounded out to a field of kids who mostly had no idea they were watching history.</p>
            <p>The booking has since become one of the most celebrated "before they were famous" moments in dance music. Within a year, <em>Homework</em> made Daft Punk global stars; within a decade, their pyramid show at Coachella 2006 rewired what electronic live performance could be. But the origin point on American soil remains a muddy farm in Wisconsin, a testament to the Midwest rave underground's outsized role in dance music history.</p>
            <p>The Drop Bass Network's fearless curation — techno, acid, hardcore, and unknown European acts hauled into the woods of the upper Midwest — built a scene that never asked permission from the coasts. Even Furthur itself was revived in the 2010s, and its legend has only grown. Kudos, eternally, to Kurt and the crew.</p>
        `
    },
    {
        id: "midwest-arteries",
        title: "From Warehouse to Waveform: The Venues That Kept the Midwest Alive",
        date: "2026-05-12",
        author: "FREQ/ARCH Editorial",
        tags: ["Milwaukee", "Chicago", "Venues", "House"],
        readTime: "5 min",
        excerpt: "Coastal narratives dominate dance music journalism, but the arteries of American rave culture run through Chicago warehouses, Milwaukee theatres, and Wisconsin farmland.",
        body: `
            <p>Every scene needs rooms. Chicago had the <strong>Warehouse</strong> — the club whose name, shortened by record store clerks labeling the music Frankie Knuckles played there, gave us the word <em>house</em>. It had the <strong>Music Box</strong>, where Ron Hardy pushed tape edits into delirium. And by the 90s it had <strong>Dance Mania</strong>, the label that stripped house down to its rawest, fastest, filthiest form: ghetto house.</p>
            <p>Ninety minutes north, Milwaukee built its own arteries. <strong>The Rave / Eagles Club</strong> — a cavernous, allegedly haunted 1927 ballroom complex — became the region's alternative megachurch, hosting everything from hardcore punk to headline DnB. The <strong>Miramar Theatre</strong>, a converted 1913 movie house on the east side, evolved into the intimate room where the region's bass music community actually lives: local openers, touring underground headliners, and all-ages kids discovering 140 BPM for the first time.</p>
            <p>Connect the dots — Chicago's warehouses, Milwaukee's theatres, Drop Bass Network's farmland raves, Rockford's record stores — and you get a self-sustaining regional circulatory system that never needed coastal validation. The artists surfaced in this site's analysis (Gettoblaster, Uriah G, Derek Fer Real, Mario Massa) are simply the current blood cells moving through fifty-year-old veins.</p>
            <p>Support your local venue. The next Daft Punk booking is already on some regional promoter's whiteboard, and it will not be announced on a mainstage LED wall.</p>
        `
    },
    {
        id: "tb303-acid",
        title: "The 303 That Failed Its Way Into History",
        date: "2026-04-26",
        author: "FREQ/ARCH Editorial",
        tags: ["Acid House", "Roland", "Gear", "History"],
        readTime: "6 min",
        excerpt: "Roland built the TB-303 to be a bass guitar for lonely guitarists. It was a commercial flop, discontinued in two years — and then Chicago kids found it in pawn shops and accidentally invented acid house.",
        body: `
            <p>In 1981, Roland released the <strong>TB-303 Bass Line</strong>: a small silver box meant to replace a bass player for practicing guitarists. It was hard to program, its "bass" sounded nothing like a real bass, and musicians hated it. Roland discontinued it in 1984 after selling only around 10,000 units. By every metric that mattered to its makers, the 303 was a failure.</p>
            <p>Then it landed in Chicago pawn shops for cheap. Around 1985–87, producers — most famously <strong>DJ Pierre</strong> and <strong>Phuture</strong> on the track <em>"Acid Tracks"</em> — began twisting the 303's resonance and cutoff knobs while a pattern looped, discovering a squelching, liquid, mutating tone the machine was never designed to make. That sound became a genre: <strong>acid house</strong>. The resonant filter sweep is now one of the most recognizable gestures in all of electronic music.</p>
            <p>The 303's rehabilitation is the perfect parable for this entire culture: value isn't defined by the manufacturer, the label, or the charts — it's defined by the people on the floor who hear something the designers never intended and refuse to let it go. The same silver box that Roland couldn't give away now sells for thousands, and every software studio ships an emulation of it.</p>
            <p>The "Rust Belt Ritual" session in this site's engine runs an acid-style resonant filter sweep on its lead line — a small nod to the failed machine that would not die. Twist an imaginary knob while it plays.</p>
        `
    },
    {
        id: "detroit-belleville",
        title: "The Belleville Three: Techno as Science Fiction",
        date: "2026-04-08",
        author: "FREQ/ARCH Editorial",
        tags: ["Detroit", "Techno", "History", "Futurism"],
        readTime: "6 min",
        excerpt: "Three friends from a Detroit suburb, raised on Kraftwerk, Parliament, and a radio DJ called The Electrifying Mojo, imagined a machine-made music for a post-industrial future — and named it techno.",
        body: `
            <p>Techno did not begin in a warehouse or a club. It began among three friends at <strong>Belleville High School</strong>, a mostly white suburb outside Detroit, in the late 1970s and early 80s. <strong>Juan Atkins</strong>, <strong>Derrick May</strong>, and <strong>Kevin Saunderson</strong> — the <strong>Belleville Three</strong> — bonded over an unlikely record collection: Kraftwerk's clinical electronics, Parliament-Funkadelic's cosmic funk, Italian disco, and the genre-shredding late-night broadcasts of Detroit radio legend <strong>The Electrifying Mojo</strong>.</p>
            <p>Living in the shadow of a collapsing auto industry, they imagined a music made <em>by</em> machines <em>about</em> a machine future — Atkins famously described early tracks as sounding like "George Clinton and Kraftwerk stuck in an elevator." Under names like Cybotron, Model 500, Rhythim Is Rhythim, and Inner City, they built cold, funky, forward-tilting records that a British compilation in 1988 would package under a single word borrowed from Atkins: <strong>techno</strong>.</p>
            <p>The irony is durable: techno was born in Black America but found its first mass audience in Europe, where Detroit producers were treated as visionary artists years before their home country noticed. That transatlantic feedback loop — Detroit → Berlin → the world → back to Detroit — still defines the genre's geography today.</p>
            <p>Every four-on-the-floor kick in this site's "Rust Belt Ritual" and "Warehouse Jack" sessions traces a direct line back to three teenagers in Belleville deciding the future should have a soundtrack.</p>
        `
    }
];

/* -------------------------------------------------------------------------- */
/* Seed data: comments + community archive                                    */
/* -------------------------------------------------------------------------- */

const seedComments = [
    { id: "seed-c1", name: "NeonRaider", genre: "Industrial Techno", text: "Orphx blew my mind at Forms of Hands. This list is incredibly accurate.", ts: Date.now() - 1000 * 60 * 60 * 2 },
    { id: "seed-c2", name: "Sub_Freq", genre: "140 Dubstep", text: "Distinct Motive keeping the true sound system culture alive. Big ups for the feature.", ts: Date.now() - 1000 * 60 * 60 * 5 },
    { id: "seed-c3", name: "MidwestMainframe", genre: "Acid Techno", text: "Finally somebody giving Drop Bass Network their flowers. The Even Furthur story needs to be taught in schools.", ts: Date.now() - 1000 * 60 * 60 * 26 }
];

const seedArchive = {
    moments: [
        { id: "seed-m1", f1: "Daft Punk's US debut at Even Furthur", f2: "1996", text: "Two unknown French producers play their first American show in the Wisconsin mud, booked by the Drop Bass Network. The rest is history.", handle: "FREQ/ARCH", votes: 21, ts: Date.now() - 1000 * 60 * 60 * 24 * 6 },
        { id: "seed-m2", f1: "Frankie Knuckles takes residency at the Warehouse", f2: "1977", text: "The Chicago club whose dancefloor — and whose shortened name on record-store labels — gives 'house music' its name.", handle: "WaxArchivist", votes: 17, ts: Date.now() - 1000 * 60 * 60 * 24 * 5 },
        { id: "seed-m3", f1: "The Belleville Three invent techno", f2: "1985", text: "Juan Atkins, Derrick May, and Kevin Saunderson fuse funk with futurism in the Detroit suburbs and accidentally design the next 40 years of music.", handle: "313Forever", votes: 15, ts: Date.now() - 1000 * 60 * 60 * 24 * 4 },
        { id: "seed-m4", f1: "Skrillex sweeps the Grammys — brostep goes overground", f2: "2012", text: "Love it or hate it, three Grammys for 'Scary Monsters and Nice Sprites' dragged American dubstep out of the forums and onto every mainstage on Earth.", handle: "WobbleScholar", votes: 9, ts: Date.now() - 1000 * 60 * 60 * 24 * 3 }
    ],
    artists: [
        { id: "seed-a1", f1: "Djrum", f2: "DnB / Techno / Modern Classical", text: "A turntablist and trained pianist collapsing jungle, techno, and film-score emotion into single tracks. Criminally under-booked in the States.", handle: "FREQ/ARCH", votes: 12, ts: Date.now() - 1000 * 60 * 60 * 24 * 6 },
        { id: "seed-a2", f1: "Hamdi", f2: "New-School 140", text: "Leading the UK's new 140 wave — proof that dubstep's second golden age is happening right now if you know where to look.", handle: "Sub_Freq", votes: 10, ts: Date.now() - 1000 * 60 * 60 * 24 * 4 },
        { id: "seed-a3", f1: "DJ Heather", f2: "Chicago House", text: "Three decades deep in Chicago house and still out-mixing everyone on the bill. A living institution who deserves headline slots, not history lessons.", handle: "WaxArchivist", votes: 8, ts: Date.now() - 1000 * 60 * 60 * 24 * 2 }
    ],
    tracks: [
        { id: "seed-t1", f1: "Brown Paper Bag", f2: "Roni Size / Reprazent", text: "The live-bass DnB odyssey that won the 1997 Mercury Prize over Radiohead. Still sounds like the future.", handle: "FREQ/ARCH", votes: 14, ts: Date.now() - 1000 * 60 * 60 * 24 * 6 },
        { id: "seed-t2", f1: "Cockney Thug", f2: "Rusko", text: "The moment UK dubstep grew fangs. You can trace half of American bass music to this one drop.", handle: "WobbleScholar", votes: 11, ts: Date.now() - 1000 * 60 * 60 * 24 * 5 },
        { id: "seed-t3", f1: "Call It Techno", f2: "Frankie Bones", text: "Brooklyn's rave manifesto on wax, from the man who gave us PLUR.", handle: "NeonRaider", votes: 7, ts: Date.now() - 1000 * 60 * 60 * 24 * 3 }
    ]
};
