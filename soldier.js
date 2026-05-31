/**
 * soldier.js
 * "Asker ol" komutu:
 * 1. Asker üniforması giyer
 * 2. Silahla gökyüzüne ateş eder
 * 3. Yıldız düşer
 * 4. Yıldızı eline alır
 * 5. Çam ağacına asar
 * 6. Selam verir, normale döner
 */

let soldierModeActive = false;

/* ── KOMUT TESPİT ── */
function checkSoldierCommand(text) {
  const t = text.toLowerCase()
    .replace(/[ı]/g,'i').replace(/[ü]/g,'u')
    .replace(/[ö]/g,'o').replace(/[ş]/g,'s')
    .replace(/[ç]/g,'c').replace(/[ğ]/g,'g');
  return /asker ol|askere gec|asker giyin|askeri mod|komutan ol|general ol/.test(t);
}

/* ── SVG ELEMANLARI ── */
function getSuitEl() { return document.getElementById('suit'); }

/* ── ASKERİ ÜNİFORMA — body üstüne overlay ── */
function wearUniform() {
  // Varsa eski üniformayı kaldır
  const old = document.getElementById('soldierUniform');
  if (old) old.remove();

  const svgNS = 'http://www.w3.org/2000/svg';
  const emoSvg = document.getElementById('emoRoot');

  // Asker kıyafeti grubu — SVG içine ekle
  const g = document.createElementNS(svgNS, 'g');
  g.id = 'soldierUniform';
  g.setAttribute('opacity', '0');

  g.innerHTML = `
    <!-- Kamuflaj ceket -->
    <rect x="54" y="172" width="132" height="72" rx="18" fill="#4a5e3a" opacity="0.95"/>
    <!-- Kamuflaj lekeler -->
    <ellipse cx="80" cy="190" rx="12" ry="8" fill="#2d3a1e" opacity="0.7"/>
    <ellipse cx="110" cy="205" rx="10" ry="7" fill="#2d3a1e" opacity="0.7"/>
    <ellipse cx="150" cy="188" rx="14" ry="6" fill="#2d3a1e" opacity="0.7"/>
    <ellipse cx="165" cy="210" rx="8" ry="10" fill="#2d3a1e" opacity="0.7"/>
    <ellipse cx="90" cy="220" rx="11" ry="6" fill="#3a4a28" opacity="0.6"/>
    <ellipse cx="135" cy="218" rx="9" ry="7" fill="#3a4a28" opacity="0.6"/>
    <!-- Cep sol -->
    <rect x="68" y="186" width="22" height="18" rx="3" fill="#3a4a28" stroke="#2d3a1e" stroke-width="1"/>
    <line x1="79" y1="186" x2="79" y2="204" stroke="#2d3a1e" stroke-width="1"/>
    <!-- Cep sağ -->
    <rect x="150" y="186" width="22" height="18" rx="3" fill="#3a4a28" stroke="#2d3a1e" stroke-width="1"/>
    <line x1="161" y1="186" x2="161" y2="204" stroke="#2d3a1e" stroke-width="1"/>
    <!-- Omuz apolet sol -->
    <rect x="54" y="172" width="28" height="10" rx="4" fill="#5a7a40" stroke="#2d3a1e" stroke-width="1"/>
    <line x1="62" y1="175" x2="62" y2="182" stroke="#ffd60a" stroke-width="1.5"/>
    <line x1="68" y1="175" x2="68" y2="182" stroke="#ffd60a" stroke-width="1.5"/>
    <!-- Omuz apolet sağ -->
    <rect x="158" y="172" width="28" height="10" rx="4" fill="#5a7a40" stroke="#2d3a1e" stroke-width="1"/>
    <line x1="166" y1="175" x2="166" y2="182" stroke="#ffd60a" stroke-width="1.5"/>
    <line x1="172" y1="175" x2="172" y2="182" stroke="#ffd60a" stroke-width="1.5"/>
    <!-- Rozet -->
    <circle cx="120" cy="195" r="7" fill="#8b6914" stroke="#ffd60a" stroke-width="1.5"/>
    <text x="120" y="199" font-size="8" fill="#ffd60a" text-anchor="middle">★</text>
    <!-- Kemer -->
    <rect x="54" y="228" width="132" height="8" rx="3" fill="#2d1a0a"/>
    <rect x="114" y="226" width="12" height="12" rx="2" fill="#8b6914" stroke="#ffd60a" stroke-width="1"/>

    <!-- Baret (kafa üstü) -->
    <ellipse cx="120" cy="42" rx="55" ry="12" fill="#4a5e3a"/>
    <ellipse cx="120" cy="40" rx="50" ry="9" fill="#4a5e3a"/>
    <ellipse cx="135" cy="38" rx="8" ry="5" fill="#3a4a28"/>
    <!-- Baret rozeti -->
    <circle cx="95" cy="40" r="6" fill="#8b6914" stroke="#ffd60a" stroke-width="1"/>
    <text x="95" y="44" font-size="7" fill="#ffd60a" text-anchor="middle">★</text>
  `;

  // SVG içine ekle (body'nin hemen üstüne)
  const neck = document.getElementById('headGroup');
  emoSvg.insertBefore(g, neck);

  // Varsa damatlık kıyafeti gizle
  const suit = getSuitEl();
  if (suit) suit.setAttribute('opacity', '0');

  // Fade in
  setTimeout(() => {
    g.style.transition = 'opacity 0.6s ease';
    g.setAttribute('opacity', '1');
  }, 50);
}

function removeUniform() {
  const u = document.getElementById('soldierUniform');
  if (u) {
    u.style.transition = 'opacity 0.5s';
    u.setAttribute('opacity', '0');
    setTimeout(() => u.remove(), 600);
  }
}

/* ── SİLAH ── */
function createGun() {
  const svgNS = 'http://www.w3.org/2000/svg';
  const emoSvg = document.getElementById('emoRoot');
  const gun = document.createElementNS(svgNS, 'g');
  gun.id = 'soldierGun';
  gun.setAttribute('opacity', '0');
  gun.style.transformOrigin = '184px 200px';
  gun.innerHTML = `
    <!-- Silah gövdesi -->
    <rect x="168" y="196" width="48" height="10" rx="3" fill="#2a2a2a"/>
    <!-- Namlu -->
    <rect x="210" y="197" width="28" height="6" rx="2" fill="#1a1a1a"/>
    <!-- Kabza -->
    <rect x="174" y="204" width="12" height="18" rx="3" fill="#3a2a1a"/>
    <!-- Tetik -->
    <path d="M182 206 Q186 212 182 216" fill="none" stroke="#555" stroke-width="1.5"/>
    <!-- Namlu deliği -->
    <circle cx="238" cy="200" r="2" fill="#000"/>
  `;
  emoSvg.appendChild(gun);
  return gun;
}

/* ── ATEŞ EFEKTI ── */
function createMuzzleFlash(x, y) {
  const flash = document.createElement('div');
  flash.style.cssText = `
    position:fixed; left:${x}px; top:${y}px;
    width:30px; height:30px; margin:-15px;
    background:radial-gradient(circle, #fff 0%, #ffd60a 40%, #ff6600 70%, transparent 100%);
    border-radius:50%;
    animation:flashAnim 0.15s ease-out forwards;
    pointer-events:none; z-index:999;
  `;
  document.body.appendChild(flash);
  setTimeout(() => flash.remove(), 200);
}

/* ── MERMI İZİ ── */
function createBulletTrail(startX, startY) {
  const trail = document.createElement('div');
  trail.style.cssText = `
    position:fixed; left:${startX}px; top:${startY}px;
    width:3px; height:3px; background:#ffd60a;
    border-radius:50%;
    box-shadow:0 0 6px #ffd60a;
    animation:bulletTrail 0.4s ease-out forwards;
    pointer-events:none; z-index:998;
  `;
  const style = document.createElement('style');
  style.textContent = `
    @keyframes flashAnim { 0%{transform:scale(0);opacity:1} 100%{transform:scale(3);opacity:0} }
    @keyframes bulletTrail {
      0%   { transform:translate(0,0) scale(1); opacity:1; }
      100% { transform:translate(-80px,-120px) scale(0.2); opacity:0; }
    }
    @keyframes starHit { 0%{transform:scale(1) rotate(0)} 50%{transform:scale(1.5) rotate(180deg)} 100%{transform:scale(0) rotate(360deg)} }
    @keyframes starFall2 { 0%{transform:translateY(0) rotate(0);opacity:1} 100%{transform:translateY(200px) rotate(720deg);opacity:0.3} }
    @keyframes treeFade { 0%{opacity:0;transform:scale(0.5)} 100%{opacity:1;transform:scale(1)} }
    @keyframes starOnTree { 0%{opacity:0;transform:scale(0) rotate(-180deg)} 100%{opacity:1;transform:scale(1) rotate(0)} }
  `;
  document.head.appendChild(style);
  document.body.appendChild(trail);
  setTimeout(() => { trail.remove(); style.remove(); }, 500);
}

/* ── ÇAM AĞACI ── */
function createChristmasTree(starEl) {
  const tree = document.createElement('div');
  tree.id = 'christmasTree';
  tree.style.cssText = `
    position:fixed; right:20px; bottom:100px;
    font-size:70px; line-height:1;
    animation:treeFade 0.8s ease forwards;
    pointer-events:none; z-index:600;
    filter:drop-shadow(0 0 12px rgba(0,255,100,0.4));
  `;
  tree.innerHTML = '🎄';
  document.body.appendChild(tree);

  // Yıldızı ağacın tepesine as
  setTimeout(() => {
    const starOnTree = document.createElement('div');
    starOnTree.style.cssText = `
      position:fixed; right:42px; bottom:160px;
      font-size:28px;
      animation:starOnTree 0.6s cubic-bezier(.34,1.56,.64,1) forwards;
      pointer-events:none; z-index:601;
      filter:drop-shadow(0 0 8px rgba(255,215,0,0.9));
    `;
    starOnTree.textContent = '⭐';
    document.body.appendChild(starOnTree);

    // 4 saniye sonra her şeyi kaldır
    setTimeout(() => {
      tree.style.transition = 'opacity 1s';
      tree.style.opacity = '0';
      starOnTree.style.transition = 'opacity 1s';
      starOnTree.style.opacity = '0';
      setTimeout(() => { tree.remove(); starOnTree.remove(); }, 1000);
    }, 4000);
  }, 600);
}

/* ── ANA SENARYO ── */
async function runSoldierSequence() {
  if (soldierModeActive) return;
  soldierModeActive = true;

  const d = ms => new Promise(r => setTimeout(r, ms));

  // 1. Üniformayı giy
  addBubble('Asker EMO göreve hazır! Üs komutanı rapor veriyor! 🫡', 'ai');
  wearUniform();
  setExpression('excited');
  doHappyBounce(2);
  if (typeof speak === 'function') speak('Asker EMO göreve hazır! Üs komutanı rapor veriyor!', 'excited');
  await d(2500);

  // 2. Silahı çıkar
  const gun = createGun();
  gun.style.transition = 'opacity 0.3s';
  gun.setAttribute('opacity', '1');

  // Kolu yukarı kaldır — nişan al
  const armR = document.getElementById('armR');
  if (armR) {
    armR.style.transition = 'transform 0.5s cubic-bezier(.34,1.56,.64,1)';
    armR.style.transform = 'rotate(-120deg) translateY(-15px)';
  }
  gun.style.transform = 'rotate(-45deg)';
  gun.style.transformOrigin = '184px 200px';
  setHeadTilt(-10);
  addBubble('Hedef tespit edildi... Yıldız 3 saat yönünde! Ateş! 🎯', 'ai');
  await d(1200);

  // 3. Ateş et (3 kez)
  const svgRect = document.getElementById('emoRoot').getBoundingClientRect();
  const gunTipX = svgRect.right - 10;
  const gunTipY = svgRect.top + svgRect.height * 0.45;

  for (let i = 0; i < 3; i++) {
    createMuzzleFlash(gunTipX, gunTipY);
    createBulletTrail(gunTipX, gunTipY);
    // Geri tepme
    if (armR) {
      armR.style.transform = 'rotate(-110deg) translateY(-10px)';
      await d(80);
      armR.style.transform = 'rotate(-120deg) translateY(-15px)';
    }
    await d(300);
  }

  await d(400);

  // 4. Yıldız düşer (vuruldu efekti)
  const fallenStar = document.createElement('div');
  fallenStar.style.cssText = `
    position:fixed;
    left:50%; top:10%;
    font-size:40px;
    transform:translateX(-50%);
    pointer-events:none; z-index:700;
    animation:starHit 0.4s ease forwards;
  `;
  fallenStar.textContent = '⭐';
  document.body.appendChild(fallenStar);
  await d(400);

  // Yıldız aşağı düşer
  fallenStar.style.animation = 'starFall2 1s ease-in forwards';
  fallenStar.style.top = '10%';
  await d(900);

  // 5. Silahı indir, yıldızı yakala
  if (armR) {
    armR.style.transform = 'rotate(-60deg)';
  }
  gun.style.transition = 'opacity 0.4s';
  gun.setAttribute('opacity', '0');
  setTimeout(() => gun.remove(), 500);

  setExpression('happy');
  setHeadTilt(0);
  addBubble('Düşürdüm! Şimdi alıyorum... bu çam ağacına çok yakışacak! 🌟', 'ai');
  if (typeof speak === 'function') speak('Düşürdüm! Şimdi alıyorum, bu çam ağacına çok yakışacak!', 'happy');

  // Yıldızı eline al (kolu yıldıza uzat)
  const starFinalX = window.innerWidth * 0.5;
  const starFinalY = window.innerHeight * 0.6;
  fallenStar.style.animation = 'none';
  fallenStar.style.transition = 'all 0.6s cubic-bezier(.34,1.56,.64,1)';
  fallenStar.style.left = (svgRect.right - 30) + 'px';
  fallenStar.style.top  = (svgRect.top + svgRect.height * 0.55) + 'px';
  fallenStar.style.fontSize = '28px';
  await d(700);

  // 6. Çam ağacına as
  addBubble('İşte bu kadar tatlı! Çam ağacının tam tepesine! 🎄⭐', 'ai');
  doHappyBounce(2);

  fallenStar.style.opacity = '0';
  setTimeout(() => fallenStar.remove(), 400);

  createChristmasTree();
  await d(1000);

  if (typeof speak === 'function') speak('İşte bu kadar tatlı! Çam ağacının tam tepesine!', 'happy');
  await d(2500);

  // 7. Selam ver
  if (armR) {
    armR.style.transform = 'rotate(-90deg)';
    await d(600);
    armR.style.transform = '';
  }
  setExpression('wink');
  addBubble('Görev tamamlandı! Geri dönüyorum normal moda. Rahat! 🫡', 'ai');
  if (typeof speak === 'function') speak('Görev tamamlandı! Geri dönüyorum normal moda. Rahat!', 'happy');
  await d(2000);

  // 8. Üniformayı çıkar, normale dön
  removeUniform();
  setExpression('neutral');
  setHeadTilt(0);
  if (typeof isProcessing !== 'undefined') isProcessing = false;
  if (typeof setState === 'function') setState('idle');
  soldierModeActive = false;
}

/* ── HOOK ── */
const _prevMoodCheck = window.askGroqWithMarriageCheck;
window.askGroqWithMarriageCheck = function(text) {
  if (checkSoldierCommand(text)) {
    runSoldierSequence();
    return;
  }
  if (_prevMoodCheck) _prevMoodCheck(text);
  else askGroq(text);
};
