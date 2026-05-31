/**
 * flower.js
 * "Çiçek ver / çiçek al" komutu:
 * 1. EMO elinde çiçek tutar
 * 2. "Çiçeği kabul ediyor musun?" sorusu çıkar
 * 3. Evet/Hayır butonları
 * 4. Evet → çiçekler uçuşur, EMO mutlu
 * 5. Hayır → EMO üzülür
 */

let flowerModeActive = false;

/* ── KOMUT TESPİT ── */
function checkFlowerCommand(text) {
  const t = text.toLowerCase()
    .replace(/[ı]/g,'i').replace(/[ü]/g,'u')
    .replace(/[ö]/g,'o').replace(/[ş]/g,'s')
    .replace(/[ç]/g,'c').replace(/[ğ]/g,'g');
  return /cicek ver|cicek al|bana cicek|cicek getir|cicek yok mu|cicek ister misin|sana cicek|cicek aldim|gul ver|gul al|buket/.test(t);
}

/* ── ÇİÇEK YAĞMURU ── */
function startFlowerRain(duration) {
  const container = document.createElement('div');
  container.id = 'flowerRainContainer';
  container.style.cssText = 'position:fixed;inset:0;pointer-events:none;overflow:hidden;z-index:800;';
  document.body.appendChild(container);

  const flowers = ['🌸','🌺','🌹','🌼','🌻','💐','🌷','🏵️','✿','❀'];
  const interval = setInterval(() => {
    const f = document.createElement('div');
    f.style.cssText = `
      position:absolute;
      font-size:${20 + Math.random()*24}px;
      left:${Math.random()*100}vw;
      top:-50px;
      animation:flowerFall ${1.5+Math.random()*2}s ${Math.random()*0.5}s ease-in forwards;
      pointer-events:none;
      transform:rotate(${Math.random()*360}deg);
    `;
    f.textContent = flowers[Math.floor(Math.random()*flowers.length)];
    container.appendChild(f);
    setTimeout(() => f.remove(), 4000);
  }, 120);

  setTimeout(() => {
    clearInterval(interval);
    setTimeout(() => container.remove(), 4000);
  }, duration);
}

/* ── KABUL OVERLAY ── */
function showFlowerOffer(bouquet) {
  const overlay = document.createElement('div');
  overlay.id = 'flowerOverlay';
  overlay.style.cssText = `
    position:fixed;inset:0;
    background:rgba(0,0,0,0.75);
    display:flex;flex-direction:column;
    align-items:center;justify-content:center;
    gap:16px;z-index:900;
    animation:fadeInOverlay 0.4s ease;
  `;

  overlay.innerHTML = `
    <div style="font-size:5rem;animation:floatBouquet 2s ease-in-out infinite;">${bouquet}</div>
    <div style="
      font-family:'Orbitron',monospace;
      font-size:1rem;color:#f472b6;
      text-align:center;max-width:280px;line-height:1.7;
      text-shadow:0 0 20px rgba(244,114,182,0.6);
    ">Sana bir buket çiçek getirdim! 💕<br>Çiçeği kabul ediyor musun?</div>
    <div style="display:flex;gap:16px;margin-top:8px;">
      <button id="flowerYes" style="
        padding:12px 32px;border-radius:24px;
        border:1.5px solid #f472b6;
        background:rgba(244,114,182,0.15);
        color:#f472b6;font-family:'Orbitron',monospace;
        font-size:13px;cursor:pointer;letter-spacing:1px;
        transition:all 0.2s;
      ">EVET 💖</button>
      <button id="flowerNo" style="
        padding:12px 32px;border-radius:24px;
        border:1.5px solid #5a6080;
        background:rgba(90,96,128,0.15);
        color:#5a6080;font-family:'Orbitron',monospace;
        font-size:13px;cursor:pointer;letter-spacing:1px;
        transition:all 0.2s;
      ">HAYIR 💔</button>
    </div>
  `;

  document.body.appendChild(overlay);

  document.getElementById('flowerYes').addEventListener('click', () => {
    overlay.remove();
    onFlowerAccepted();
  });
  document.getElementById('flowerNo').addEventListener('click', () => {
    overlay.remove();
    onFlowerRejected();
  });
}

/* ── KABUL ── */
async function onFlowerAccepted() {
  setExpression('excited');
  doHappyBounce(4);
  startFlowerRain(6000);

  const msg = 'Yaaay! Kabul ettin! Kalbim çiçeklerle doldu! 🌸💕';
  addBubble(msg, 'ai');
  if (typeof speak === 'function') speak(msg, 'excited');

  // Çiçeği bırak (kolu indir)
  const armR = document.getElementById('armR');
  if (armR) {
    armR.style.transition = 'transform 0.5s ease';
    armR.style.transform = '';
  }
  removeFlowerInHand();

  await delay2(3000);
  setExpression('happy');
  await delay2(2000);
  setExpression('neutral');
  finishFlower();
}

/* ── RED ── */
async function onFlowerRejected() {
  setExpression('sad');
  setHeadTilt(8);

  const msg = 'Oh... Tamam, anlıyorum. Çiçeği ben saklayayım o zaman... 🥀';
  addBubble(msg, 'ai');
  if (typeof speak === 'function') speak(msg, 'sad');

  removeFlowerInHand();
  const armR = document.getElementById('armR');
  if (armR) armR.style.transform = '';

  await delay2(3000);
  setExpression('neutral');
  setHeadTilt(0);
  finishFlower();
}

/* ── ELDEKİ ÇİÇEK ── */
function showFlowerInHand(bouquet) {
  const svgNS = 'http://www.w3.org/2000/svg';
  const emoSvg = document.getElementById('emoRoot');

  const flEl = document.createElementNS(svgNS, 'text');
  flEl.id = 'flowerInHand';
  flEl.setAttribute('x', '210');
  flEl.setAttribute('y', '175');
  flEl.setAttribute('font-size', '28');
  flEl.setAttribute('text-anchor', 'middle');
  flEl.setAttribute('opacity', '0');
  flEl.textContent = bouquet;
  flEl.style.transition = 'opacity 0.4s';
  emoSvg.appendChild(flEl);

  setTimeout(() => flEl.setAttribute('opacity','1'), 50);
}

function removeFlowerInHand() {
  const f = document.getElementById('flowerInHand');
  if (f) {
    f.style.transition = 'opacity 0.4s';
    f.setAttribute('opacity','0');
    setTimeout(() => f.remove(), 500);
  }
}

/* ── ANA SENARYO ── */
async function runFlowerSequence() {
  if (flowerModeActive) return;
  flowerModeActive = true;

  const bouquets = ['💐','🌹','🌸','🌺','🌷'];
  const bouquet  = bouquets[Math.floor(Math.random()*bouquets.length)];

  // Kolu uzat — çiçeği tut
  const armR = document.getElementById('armR');
  if (armR) {
    armR.style.transition = 'transform 0.5s cubic-bezier(.34,1.56,.64,1)';
    armR.style.transform  = 'rotate(-80deg) translateY(-10px)';
  }

  setExpression('excited');
  showFlowerInHand(bouquet);

  addBubble('Dur dur dur, sana bir sürprizim var! ✨', 'ai');
  if (typeof speak === 'function') speak('Dur dur dur, sana bir sürprizim var!', 'excited');
  await delay2(2000);

  // Teklif overlay'i göster
  showFlowerOffer(bouquet);
}

function finishFlower() {
  if (typeof isProcessing !== 'undefined') isProcessing = false;
  if (typeof setState === 'function') setState('idle');
  flowerModeActive = false;
}

function delay2(ms) { return new Promise(r => setTimeout(r, ms)); }

/* ── STİL ── */
const flowerStyle = document.createElement('style');
flowerStyle.textContent = `
  @keyframes flowerFall {
    0%   { transform:translateY(0) rotate(0deg) scale(1); opacity:1; }
    80%  { opacity:1; }
    100% { transform:translateY(105vh) rotate(${Math.random()>0.5?'':'-'}720deg) scale(0.5); opacity:0; }
  }
  @keyframes floatBouquet {
    0%,100% { transform:translateY(0) rotate(-5deg); }
    50%     { transform:translateY(-12px) rotate(5deg); }
  }
  @keyframes fadeInOverlay {
    from { opacity:0; } to { opacity:1; }
  }
  #flowerYes:hover { background:rgba(244,114,182,0.3) !important; transform:scale(1.05); }
  #flowerNo:hover  { background:rgba(90,96,128,0.3)  !important; transform:scale(1.05); }
`;
document.head.appendChild(flowerStyle);

/* ── HOOK ── */
const _prevSoldierCheck = window.askGroqWithMarriageCheck;
window.askGroqWithMarriageCheck = function(text) {
  if (checkFlowerCommand(text)) {
    runFlowerSequence();
    return;
  }
  if (_prevSoldierCheck) _prevSoldierCheck(text);
  else askGroq(text);
};
