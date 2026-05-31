/**
 * mood.js
 * Mod yönetimi: mizahi mod, normal mod tespiti ve UI göstergesi.
 */

/* ── MOD TESPİT KELİMELERİ ── */
function checkMoodCommand(text) {
  const t = text.toLowerCase()
    .replace(/[ı]/g,'i').replace(/[ü]/g,'u')
    .replace(/[ö]/g,'o').replace(/[ş]/g,'s')
    .replace(/[ç]/g,'c').replace(/[ğ]/g,'g');

  if (/mizahi mod|mizah mod|komik mod|sakaci mod|eglenceli mod|espri mod|sasirt beni|komik ol|daha komik|guldur beni/.test(t)) {
    return 'mizah';
  }
  if (/normal mod|ciddi mod|normal ol|ciddi ol|mizahi moddan cik|komik moddan cik|mizahtan cik|mizah modundan cik|komikten cik|espri modundan cik|mizahi kapat|komik kapat/.test(t)) {
    return 'normal';
  }
  return null;
}

/* ── MOD BANNER UI ── */
function showMoodBanner(mode) {
  let banner = document.getElementById('moodBanner');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'moodBanner';
    banner.style.cssText = `
      position:fixed; top:12px; right:12px;
      padding:6px 14px; border-radius:20px;
      font-size:11px; font-family:'Orbitron',monospace;
      letter-spacing:1px; z-index:999;
      transition:all 0.4s ease;
      pointer-events:none;
    `;
    document.body.appendChild(banner);
  }

  if (mode === 'mizah') {
    banner.textContent = '😂 MİZAH MODU';
    banner.style.background = 'rgba(255,214,0,0.15)';
    banner.style.border = '1px solid rgba(255,214,0,0.5)';
    banner.style.color = '#ffd60a';
    banner.style.opacity = '1';
  } else {
    banner.textContent = '🤖 NORMAL MOD';
    banner.style.background = 'rgba(0,212,255,0.1)';
    banner.style.border = '1px solid rgba(0,212,255,0.3)';
    banner.style.color = '#00d4ff';
    banner.style.opacity = '1';
    setTimeout(() => { banner.style.opacity = '0'; }, 3000);
  }
}

/* ── MOD DEĞİŞTİRME ── */
function activateMizahModu() {
  setMizahModu(true);
  showMoodBanner('mizah');
  setExpression('excited');
  doHappyBounce(3);

  const msg = 'Mizahi moduna geçtim! Hazır ol, şakalara dayanamayabilirsin! 😂🤖';
  addBubble(msg, 'ai');
  if (typeof speak === 'function') speak(msg, 'excited');
}

function activateNormalModu() {
  setMizahModu(false);
  showMoodBanner('normal');
  setExpression('happy');

  const msg = 'Tamam tamam, ciddi EMO geri döndü. Ama iç dünyamda hâlâ gülüyorum. 🤖';
  addBubble(msg, 'ai');
  if (typeof speak === 'function') speak(msg, 'happy');
}

/* ── HOOK: speech.js kontrolüne ekle ── */
const _prevStarCheck = window.askGroqWithMarriageCheck;
window.askGroqWithMarriageCheck = function(text) {
  const moodCmd = checkMoodCommand(text);
  if (moodCmd === 'mizah') { activateMizahModu(); return; }
  if (moodCmd === 'normal') { activateNormalModu(); return; }
  if (_prevStarCheck) _prevStarCheck(text);
  else askGroq(text);
};

/* ── SAYFA AÇILIŞINDA BANNER GÖSTER ── */
window.addEventListener('load', () => {
  if (mizahModu) showMoodBanner('mizah');
});
