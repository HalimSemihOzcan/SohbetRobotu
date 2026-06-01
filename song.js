/**
 * song.js
 * "Şarkı söyle" veya "yıldızların altında" komutu:
 * 1. Sahne kıyafeti giyer
 * 2. Mikrofon çıkar
 * 3. Etrafında dans eden mini EMO robotlar belirir
 * 4. Şarkıyı satır satır söyler
 * 5. Sahne kapanır, normale döner
 */

let songModeActive = false;

const SONG_LYRICS = [
  "Benim gönlüm sarhoştur... Yıldızların altında...",
  "Sevişmek, ah, ne hoştur... Yıldızların altında...",
  "Benim gönlüm sarhoştur... Yıldızların altında...",
  "Sevişmek, ah, ne hoştur... Yıldızların altında...",
  "Mavi nurdan bir ırmak... Gölgede bir salıncak...",
  "Bir de ikimiz kalsak... Yıldızların altında...",
  "Yanmam gönlüm yansa da... Ecel beni alsa da...",
  "Gözlerim kapansa da... Yıldızların altında...",
  "Gözlerim kapansa da... Yıldızların altında...",
  "Benim gönlüm sarhoştur... Yıldızların altında...",
  "Sevişmek, ah, ne hoştur... Yıldızların altında...",
  "Gözlerim kapansa da... Yıldızların altında...",
];

/* ── KOMUT TESPİT ── */
function checkSongCommand(text) {
  const t = text.toLowerCase()
    .replace(/[ı]/g,'i').replace(/[ü]/g,'u')
    .replace(/[ö]/g,'o').replace(/[ş]/g,'s')
    .replace(/[ç]/g,'c').replace(/[ğ]/g,'g');
  return /sarki soylesene|sarki soyle|yildizlarin altinda|sarkiya basla|bir sarki soyler misin|sarki istiyorum/.test(t);
}

/* ── SAHNE STİL ── */
const songStyle = document.createElement('style');
songStyle.textContent = `
  @keyframes stageLight {
    0%,100% { opacity:.7; transform:scaleY(1) rotate(-2deg); }
    50%     { opacity:1;  transform:scaleY(1.08) rotate(2deg); }
  }
  @keyframes miniDance {
    0%   { transform:translateY(0) rotate(-8deg) scale(1); }
    25%  { transform:translateY(-14px) rotate(0deg) scale(1.1); }
    50%  { transform:translateY(0) rotate(8deg) scale(1); }
    75%  { transform:translateY(-8px) rotate(0deg) scale(1.05); }
    100% { transform:translateY(0) rotate(-8deg) scale(1); }
  }
  @keyframes miniDance2 {
    0%   { transform:translateY(-6px) rotate(6deg) scale(1.05); }
    50%  { transform:translateY(6px) rotate(-6deg) scale(.95); }
    100% { transform:translateY(-6px) rotate(6deg) scale(1.05); }
  }
  @keyframes lyricFade {
    0%   { opacity:0; transform:translateY(10px) scale(.95); }
    15%  { opacity:1; transform:translateY(0) scale(1); }
    80%  { opacity:1; }
    100% { opacity:0; }
  }
  @keyframes micBob {
    0%,100% { transform:translateY(0) rotate(-3deg); }
    50%     { transform:translateY(-6px) rotate(3deg); }
  }
  @keyframes spotlightPulse {
    0%,100% { opacity:.18; }
    50%     { opacity:.32; }
  }
  @keyframes starTwinkle {
    0%,100% { opacity:.4; transform:scale(.8); }
    50%     { opacity:1; transform:scale(1.2); }
  }
  @keyframes curtainLeft {
    from { transform:translateX(0); }
    to   { transform:translateX(-100%); }
  }
  @keyframes curtainRight {
    from { transform:translateX(0); }
    to   { transform:translateX(100%); }
  }
  @keyframes curtainClose {
    from { transform:translateX(-100%); }
    to   { transform:translateX(0); }
  }
  @keyframes curtainCloseR {
    from { transform:translateX(100%); }
    to   { transform:translateX(0); }
  }
`;
document.head.appendChild(songStyle);

/* ── SAHNE OLUŞTUR ── */
function buildStage() {
  const stage = document.createElement('div');
  stage.id = 'songStage';
  stage.style.cssText = `
    position:fixed; inset:0; z-index:800;
    background:#04040a;
    display:flex; flex-direction:column;
    align-items:center; justify-content:flex-start;
    overflow:hidden;
  `;

  // Yıldız arka plan
  let stars = '';
  for (let i = 0; i < 60; i++) {
    const x = Math.random()*100, y = Math.random()*60;
    const s = .4 + Math.random()*.8;
    const d = .5 + Math.random()*2;
    stars += `<div style="position:absolute;left:${x}%;top:${y}%;
      width:${s*4}px;height:${s*4}px;border-radius:50%;
      background:#fff;animation:starTwinkle ${d}s ${Math.random()*2}s infinite;"></div>`;
  }

  // Spot ışıkları
  const spots = `
    <div style="position:absolute;top:-60px;left:25%;width:160px;height:420px;
      background:linear-gradient(180deg,rgba(255,220,100,.22) 0%,transparent 100%);
      transform:rotate(-12deg);transform-origin:top center;
      animation:stageLight 2s ease-in-out infinite;border-radius:0 0 80px 80px;"></div>
    <div style="position:absolute;top:-60px;left:45%;width:180px;height:460px;
      background:linear-gradient(180deg,rgba(180,140,255,.28) 0%,transparent 100%);
      transform:rotate(0deg);transform-origin:top center;
      animation:stageLight 2.5s .4s ease-in-out infinite;border-radius:0 0 90px 90px;"></div>
    <div style="position:absolute;top:-60px;right:22%;width:160px;height:420px;
      background:linear-gradient(180deg,rgba(100,200,255,.22) 0%,transparent 100%);
      transform:rotate(12deg);transform-origin:top center;
      animation:stageLight 1.8s .8s ease-in-out infinite;border-radius:0 0 80px 80px;"></div>
  `;

  // Perde (açılır)
  const curtains = `
    <div id="curtainL" style="position:absolute;inset:0;right:50%;
      background:linear-gradient(90deg,#1a0a2e,#2d1054);z-index:10;
      animation:curtainLeft .8s .2s cubic-bezier(.77,0,.18,1) forwards;"></div>
    <div id="curtainR" style="position:absolute;inset:0;left:50%;
      background:linear-gradient(270deg,#1a0a2e,#2d1054);z-index:10;
      animation:curtainRight .8s .2s cubic-bezier(.77,0,.18,1) forwards;"></div>
  `;

  // Sahne zemini
  const floor = `<div style="position:absolute;bottom:0;left:0;right:0;height:120px;
    background:linear-gradient(0deg,#0a0520 0%,transparent 100%);"></div>`;

  // Sözler kutusu
  const lyricsBox = `<div id="lyricsBox" style="
    position:absolute; bottom:90px; left:50%; transform:translateX(-50%);
    width:90%; max-width:380px; text-align:center;
    font-family:'Nunito',sans-serif; font-size:1.1rem; font-weight:700;
    color:#fff; text-shadow:0 0 20px rgba(180,140,255,.9), 0 0 40px rgba(180,140,255,.4);
    line-height:1.6; min-height:60px;
    background:rgba(0,0,0,.3); border-radius:16px; padding:12px 20px;
    border:1px solid rgba(180,140,255,.2);
  "></div>`;

  // Kapatma butonu
  const closeBtn = `<button id="songCloseBtn" style="
    position:absolute;top:16px;right:16px;
    background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.2);
    color:#fff;border-radius:50%;width:36px;height:36px;
    font-size:16px;cursor:pointer;z-index:20;
  ">✕</button>`;

  stage.innerHTML = stars + spots + curtains + floor + lyricsBox + closeBtn;
  document.body.appendChild(stage);

  document.getElementById('songCloseBtn').addEventListener('click', endSong);
  return stage;
}

/* ── SAHNE KIYAFETİ (SVG içine) ── */
function wearStageOutfit() {
  const old = document.getElementById('stageOutfit');
  if (old) old.remove();
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.getElementById('emoRoot');
  const g = document.createElementNS(svgNS, 'g');
  g.id = 'stageOutfit';
  g.setAttribute('opacity','0');
  g.innerHTML = `
    <!-- Parlak sahne ceketi -->
    <rect x="54" y="172" width="132" height="72" rx="18" fill="#1a0a3e" opacity=".97"/>
    <!-- Pullu efekt -->
    <rect x="54" y="172" width="132" height="72" rx="18" fill="url(#sequinPattern)" opacity=".6"/>
    <defs>
      <pattern id="sequinPattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
        <circle cx="5" cy="5" r="3" fill="none" stroke="#b48cff" stroke-width=".5" opacity=".7"/>
        <circle cx="5" cy="5" r="1.5" fill="#b48cff" opacity=".4"/>
      </pattern>
    </defs>
    <!-- Yaka -->
    <path d="M100 172 L84 194 L100 210 Z" fill="#2d1054"/>
    <path d="M140 172 L156 194 L140 210 Z" fill="#2d1054"/>
    <!-- Gömlek -->
    <rect x="108" y="172" width="24" height="44" fill="#fff" opacity=".9"/>
    <!-- Papyon -->
    <polygon points="112,182 120,190 112,198" fill="#ff3366"/>
    <polygon points="128,182 120,190 128,198" fill="#ff3366"/>
    <circle cx="120" cy="190" r="4" fill="#cc1144"/>
    <!-- Omuz altın şerit -->
    <rect x="54" y="172" width="30" height="6" rx="3" fill="#ffd60a" opacity=".8"/>
    <rect x="156" y="172" width="30" height="6" rx="3" fill="#ffd60a" opacity=".8"/>
    <!-- Yıldız rozet -->
    <text x="80" y="210" font-size="14" fill="#ffd60a" text-anchor="middle" opacity=".9">★</text>
    <text x="160" y="210" font-size="14" fill="#ffd60a" text-anchor="middle" opacity=".9">★</text>
    <!-- Kemer -->
    <rect x="54" y="228" width="132" height="7" rx="3" fill="#ffd60a" opacity=".6"/>
  `;
  const neck = document.getElementById('headGroup');
  svg.insertBefore(g, neck);
  setTimeout(() => { g.style.transition='opacity .6s'; g.setAttribute('opacity','1'); }, 50);
}

/* ── MİKROFON ── */
function showMicrophoneOnStage() {
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.getElementById('emoRoot');
  const mic = document.createElementNS(svgNS, 'g');
  mic.id = 'stageMic';
  mic.setAttribute('opacity','0');
  mic.style.cssText = 'animation:micBob 1s ease-in-out infinite;transform-origin:200px 180px;';
  mic.innerHTML = `
    <!-- Sap -->
    <rect x="195" y="200" width="6" height="30" rx="3" fill="#888"/>
    <!-- Kafa -->
    <ellipse cx="198" cy="193" rx="10" ry="13" fill="#333"/>
    <ellipse cx="198" cy="193" rx="7" ry="10" fill="#555"/>
    <!-- Izgara -->
    <line x1="192" y1="188" x2="204" y2="188" stroke="#222" stroke-width="1"/>
    <line x1="191" y1="192" x2="205" y2="192" stroke="#222" stroke-width="1"/>
    <line x1="192" y1="196" x2="204" y2="196" stroke="#222" stroke-width="1"/>
    <!-- Kırmızı ışık -->
    <circle cx="198" cy="230" r="3" fill="#ff3366" opacity=".9"/>
  `;
  svg.appendChild(mic);
  setTimeout(() => { mic.style.transition='opacity .4s'; mic.setAttribute('opacity','1'); }, 100);

  // Sağ kolu mikrofona uzat
  const armR = document.getElementById('armR');
  if (armR) {
    armR.style.transition = 'transform .5s cubic-bezier(.34,1.56,.64,1)';
    armR.style.transform = 'rotate(-50deg)';
  }
}

/* ── MİNİ ROBOTLAR ── */
function spawnDancingRobots(stageEl) {
  const robots = [
    { x:'8%',  delay:'0s',   anim:'miniDance',  color:'#00d4ff', size:'52px' },
    { x:'82%', delay:'.3s',  anim:'miniDance2', color:'#ff3366', size:'48px' },
    { x:'3%',  delay:'.6s',  anim:'miniDance2', color:'#00ff88', size:'40px' },
    { x:'88%', delay:'.9s',  anim:'miniDance',  color:'#ffd60a', size:'44px' },
    { x:'14%', delay:'1.2s', anim:'miniDance',  color:'#b48cff', size:'36px' },
    { x:'76%', delay:'1.5s', anim:'miniDance2', color:'#ff8c00', size:'38px' },
  ];

  robots.forEach(r => {
    const bot = document.createElement('div');
    bot.className = 'danceBot';
    bot.style.cssText = `
      position:absolute; bottom:110px; left:${r.x};
      font-size:${r.size};
      animation:${r.anim} .8s ${r.delay} ease-in-out infinite;
      filter:drop-shadow(0 0 8px ${r.color});
      opacity:0; transition:opacity .6s ${r.delay};
    `;
    bot.innerHTML = '🤖';
    stageEl.appendChild(bot);
    setTimeout(() => { bot.style.opacity = '1'; }, 100);
  });
}

/* ── SÖZLER GÖSTER ── */
function showLyric(text) {
  const box = document.getElementById('lyricsBox');
  if (!box) return;
  box.style.animation = 'none';
  box.offsetHeight; // reflow
  box.textContent = text;
  box.style.animation = 'lyricFade 4s ease forwards';
}

/* ── ŞARKI SÖYLEMEYİ BİTİR ── */
async function endSong() {
  // Perdeleri kapat
  const stage = document.getElementById('songStage');
  if (stage) {
    const cL = document.createElement('div');
    cL.style.cssText = `position:absolute;top:0;left:0;bottom:0;right:50%;
      background:linear-gradient(90deg,#1a0a2e,#2d1054);z-index:15;
      animation:curtainClose .6s cubic-bezier(.77,0,.18,1) forwards;`;
    const cR = document.createElement('div');
    cR.style.cssText = `position:absolute;top:0;right:0;bottom:0;left:50%;
      background:linear-gradient(270deg,#1a0a2e,#2d1054);z-index:15;
      animation:curtainCloseR .6s cubic-bezier(.77,0,.18,1) forwards;`;
    stage.appendChild(cL);
    stage.appendChild(cR);
    await delay3(700);
    stage.remove();
  }

  // Kıyafet ve mikrofon kaldır
  const outfit = document.getElementById('stageOutfit');
  if (outfit) outfit.remove();
  const mic = document.getElementById('stageMic');
  if (mic) mic.remove();

  // Kolu sıfırla
  const armR = document.getElementById('armR');
  if (armR) { armR.style.transform = ''; }

  // Damatlık varsa geri giy
  const suit = document.getElementById('suit');
  if (suit && suit.getAttribute('data-worn') === '1') {
    suit.setAttribute('opacity','1');
  }

  setExpression('happy');
  setHeadTilt(0);
  addBubble('Teşekkürler! 🌟 Alkış bekliyorum! 👏', 'ai');
  if (typeof speak === 'function') speak('Teşekkürler! Alkış bekliyorum!', 'happy');

  if (typeof isProcessing !== 'undefined') isProcessing = false;
  if (typeof setState === 'function') setState('idle');
  songModeActive = false;
}

function delay3(ms) { return new Promise(r => setTimeout(r, ms)); }

/* ── ANA SENARYO ── */
async function runSongSequence() {
  if (songModeActive) return;
  songModeActive = true;

  // Sahneyi kur
  const stageEl = buildStage();
  wearStageOutfit();

  // EMO'yu sahneye taşı (SVG'yi stage içine değil, üstüne float)
  const emoRoot = document.getElementById('emoRoot');
  const origStyle = emoRoot.getAttribute('style') || '';
  emoRoot.style.zIndex = '810';
  emoRoot.style.position = 'fixed';
  const sceneRect = document.querySelector('.robot-scene').getBoundingClientRect();
  emoRoot.style.bottom = '140px';
  emoRoot.style.left   = (window.innerWidth/2 - 120) + 'px';

  await delay3(1000);
  showMicrophoneOnStage();
  await delay3(600);
  spawnDancingRobots(stageEl);

  setExpression('excited');
  doHappyBounce(2);
  addBubble('🎤 Yıldızların Altında — EMO seslendiriyor!', 'ai');
  await delay3(1200);

  // Şarkıyı satır satır söyle
  for (let i = 0; i < SONG_LYRICS.length; i++) {
    if (!songModeActive) break;
    const line = SONG_LYRICS[i];
    showLyric(line);
    setExpression(i % 3 === 0 ? 'excited' : i % 3 === 1 ? 'happy' : 'wink');

    await new Promise(resolve => {
      const safeT = setTimeout(resolve, 7000);
      try {
        speakWithGroqTTS(line).then(url => {
          const audio = new Audio(url);
          audio.playbackRate = 0.88; // biraz yavaş — şarkı ritmi
          audio.onended = () => { URL.revokeObjectURL(url); clearTimeout(safeT); resolve(); };
          audio.onerror = () => { clearTimeout(safeT); resolve(); };
          audio.play().catch(() => { clearTimeout(safeT); resolve(); });
        }).catch(() => { clearTimeout(safeT); resolve(); });
      } catch(e) { clearTimeout(safeT); resolve(); }
    });

    await delay3(300);
  }

  // EMO'yu orijinal yerine geri al
  emoRoot.setAttribute('style', origStyle);

  await delay3(500);
  await endSong();
}

/* ── HOOK ── */
const _prevFlowerCheck = window.askGroqWithMarriageCheck;
window.askGroqWithMarriageCheck = function(text) {
  if (checkSongCommand(text)) {
    runSongSequence();
    return;
  }
  if (_prevFlowerCheck) _prevFlowerCheck(text);
  else askGroq(text);
};
