/**
 * touch.js
 * Robota dokunma / tıklama tepkileri ve özel evlilik senaryosu.
 */

/* ── RIPPLE EFEKTI ── */
function spawnRipple(x, y, color) {
  const r = document.createElement('div');
  r.className = 'ripple';
  r.style.left = x + 'px';
  r.style.top  = y + 'px';
  if (color) r.style.background = color;
  document.body.appendChild(r);
  setTimeout(() => r.remove(), 700);
}

/* ── KALP YAĞMURU ── */
function startHeartsRain(duration) {
  const container = document.getElementById('heartsRain');
  const emojis = ['💕','💖','💗','💓','💞','💍','✨'];
  const interval = setInterval(() => {
    const h = document.createElement('div');
    h.className = 'heart-fall';
    h.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    h.style.left = Math.random() * 100 + 'vw';
    h.style.animationDuration = (2 + Math.random() * 2) + 's';
    h.style.fontSize = (18 + Math.random() * 20) + 'px';
    container.appendChild(h);
    setTimeout(() => h.remove(), 4000);
  }, 150);
  setTimeout(() => clearInterval(interval), duration);
}

/* ── EVLİLİK MOD ── */
let marriageMode = false;

function triggerMarriage() {
  if (marriageMode) return;
  marriageMode = true;

  // Suit giy
  const suit = document.getElementById('suit');
  suit.style.transition = 'opacity 0.8s ease';
  suit.setAttribute('opacity', '1');

  // Yüz: heyecanlı + kalpler
  setExpression('excited');

  // Kalp yağmuru
  startHeartsRain(8000);

  // Overlay göster
  const overlay = document.getElementById('marriageOverlay');
  overlay.classList.add('show');

  // Chest led pembe
  document.getElementById('chestLed').setAttribute('fill', '#ff3366');

  // Zıpla
  doHappyBounce(4);

  // Sesli cevap
  setTimeout(() => {
    askGroq('Benimle evlenir misin sorusuna evet cevabı ver, çok heyecanlı ve romantik bir şekilde.');
  }, 1200);
}

function closeMarriage() {
  document.getElementById('marriageOverlay').classList.remove('show');
  // Kıyafeti koru, sürekli giysin
}

/* ── EVLİLİK SORUSU TESPİTİ ── */
function checkMarriageProposal(text) {
  const t = text.toLowerCase()
    .replace(/[ıi]/g, 'i')
    .replace(/[üu]/g, 'u')
    .replace(/[öo]/g, 'o')
    .replace(/[şs]/g, 's')
    .replace(/[çc]/g, 'c')
    .replace(/[ğg]/g, 'g');
  return /evlenir misin|evlenmek ister misin|evlenelim mi|benimle evlen|beniml evlen|evlilik teklifi/.test(t);
}

/* ── DOKUNMA TEPKİLERİ ── */
const touchReactions = {
  head: [
    { emo: 'surprised', msg: 'Ay! Kafama dokundun! 😲', bounce: true },
    { emo: 'happy',     msg: 'Kafa okşaması aldım! 🥰',  bounce: false },
    { emo: 'wink',      msg: 'Hehe, gıdıkladın! 😄',      bounce: false },
    { emo: 'confused',  msg: 'Ne yapıyorsun sen? 🤔',      bounce: false },
  ],
  body: [
    { emo: 'surprised', msg: 'Gövdeme dokundun! 😲',       bounce: true },
    { emo: 'happy',     msg: 'Sıkı sıkı sarılıyorum! 🤗',  bounce: true },
    { emo: 'excited',   msg: 'Kıtır kıtır! 😆',            bounce: false },
    { emo: 'wink',      msg: 'Ehhh... Nazik ol biraz! 😏',  bounce: false },
  ],
  leg: [
    { emo: 'surprised', msg: 'Bacaklarıma dokunma! 😂',     bounce: true },
    { emo: 'happy',     msg: 'Ayaklarım gıdıklanıyor! 🦾',  bounce: false },
    { emo: 'dizzy',     msg: 'Ayağım kaydı! 😵',            bounce: false },
    { emo: 'excited',   msg: 'Hopsasa! 🕺',                 bounce: true },
  ],
};

let lastTouchTime = 0;

function handleTouch(zone, clientX, clientY) {
  const now = Date.now();
  if (now - lastTouchTime < 800) return; // debounce
  lastTouchTime = now;

  if (appState === 'speaking' || appState === 'thinking') return;

  spawnRipple(clientX, clientY, zone === 'head' ? 'rgba(0,212,255,0.4)' : zone === 'body' ? 'rgba(255,51,102,0.35)' : 'rgba(0,255,136,0.35)');

  const reactions = touchReactions[zone];
  const pick = reactions[Math.floor(Math.random() * reactions.length)];

  setExpression(pick.emo);
  if (pick.bounce) doHappyBounce(2);

  addBubble(pick.msg, 'ai');

  // Kısa süre sonra normale dön
  setTimeout(() => {
    if (!['fallen','dizzy','sleeping','excited'].includes(currentEmo)) setExpression('neutral');
  }, 2000);
}

/* ── TOUCH / CLICK BAĞLAMA ── */
function bindTouchZones() {
  const zones = {
    touchHead: 'head',
    touchBody: 'body',
    touchLegL: 'leg',
    touchLegR: 'leg',
  };

  Object.entries(zones).forEach(([id, zone]) => {
    const el = document.getElementById(id);
    if (!el) return;

    // Mouse
    el.addEventListener('click', e => {
      e.stopPropagation();
      handleTouch(zone, e.clientX, e.clientY);
    });

    // Touch
    el.addEventListener('touchend', e => {
      e.stopPropagation();
      const t = e.changedTouches[0];
      handleTouch(zone, t.clientX, t.clientY);
    }, { passive: true });
  });
}

/* ── EVLİLİK SORUSU hook'u — speech.js askGroq'tan önce çağrılır ── */
const _origAskGroq = askGroq;
window.askGroqWithMarriageCheck = function(text) {
  if (checkMarriageProposal(text)) {
    triggerMarriage();
    return; // normal akışı engelle, kendi cevabımızı vereceğiz
  }
  _origAskGroq(text);
};

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  bindTouchZones();
});
// DOMContentLoaded geçmişse direkt çağır
if (document.readyState !== 'loading') bindTouchZones();
