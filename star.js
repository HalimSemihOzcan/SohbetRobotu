/**
 * star.js
 * "Yıldızları sever misin?" sorusu gelince:
 * - Gökyüzünden yıldız düşer
 * - EMO eliyle yakalar
 * - Yıldızla 40 sn sohbet eder (sırayla konuşurlar)
 * - Süre bitince yıldız uçar gider
 */

let starModeActive = false;

/* ── YILDIZ SORUSU TESPİT ── */
function checkStarQuestion(text) {
  const t = text.toLowerCase()
    .replace(/[ı]/g,'i').replace(/[ü]/g,'u')
    .replace(/[ö]/g,'o').replace(/[ş]/g,'s')
    .replace(/[ç]/g,'c').replace(/[ğ]/g,'g');
  return /yildizlari sever misin|yildiz sever misin|yildizlari seviyor musun|yildizlari sevdin mi/.test(t);
}

/* ── YILDIZ KONUŞMALARI ── */
const starConversation = [
  { who: 'star', text: 'Merhaba EMO! Ben küçük bir yıldızım! ✨ Beni yakaladığın için çok mutlu oldum!' },
  { who: 'emo',  text: 'Vay be! Gerçekten bir yıldız! Işığın çok güzel parıldıyor! 🌟' },
  { who: 'star', text: 'Her gece seni izliyordum! Sen çok sevimli bir robotsun EMO!' },
  { who: 'emo',  text: 'Gerçekten mi? Ben de her gece yıldızlara bakıp düşünüyordum! 🤩' },
  { who: 'star', text: 'Gökyüzünden her şeyi görebiliyorum. Dünya çok güzel görünüyor!' },
  { who: 'emo',  text: 'Keşke ben de uçabilseydim, seninle gökyüzünü gezsek! 🚀' },
  { who: 'star', text: 'Belki bir gün... Ama şimdi gitmem lazım, yerime dönmeliyim! Elveda EMO! 💫' },
  { who: 'emo',  text: 'Elveda küçük yıldız! Seni hiç unutmayacağım! 🥹✨' },
];

/* ── YILDIZ UI OLUŞTUR ── */
function createStarUI() {
  // Overlay container
  const overlay = document.createElement('div');
  overlay.id = 'starOverlay';
  overlay.style.cssText = `
    position:fixed; inset:0; pointer-events:none; z-index:500;
  `;
  document.body.appendChild(overlay);

  // Yıldız elementi
  const star = document.createElement('div');
  star.id = 'falingStar';
  star.innerHTML = '⭐';
  star.style.cssText = `
    position:absolute;
    font-size:48px;
    top:-60px;
    left:50%;
    transform:translateX(-50%);
    filter:drop-shadow(0 0 12px rgba(255,215,0,0.9));
    transition:top 1.2s cubic-bezier(.34,1.56,.64,1), left 0.8s ease, font-size 0.5s ease;
    z-index:501;
  `;
  overlay.appendChild(star);

  // Yıldız konuşma balonu
  const starBubble = document.createElement('div');
  starBubble.id = 'starBubble';
  starBubble.style.cssText = `
    position:absolute;
    background:rgba(255,215,0,0.12);
    border:1px solid rgba(255,215,0,0.5);
    border-radius:16px 16px 16px 4px;
    padding:10px 14px;
    font-size:13px;
    color:#ffd60a;
    max-width:220px;
    line-height:1.5;
    opacity:0;
    transition:opacity 0.4s;
    font-family:'Nunito',sans-serif;
    box-shadow:0 0 16px rgba(255,215,0,0.15);
    pointer-events:none;
  `;
  overlay.appendChild(starBubble);

  // Süre çubuğu
  const timerBar = document.createElement('div');
  timerBar.id = 'starTimerBar';
  timerBar.style.cssText = `
    position:fixed;
    bottom:80px;
    left:50%;
    transform:translateX(-50%);
    width:200px;
    height:3px;
    background:rgba(255,215,0,0.15);
    border-radius:2px;
    overflow:hidden;
    z-index:502;
  `;
  const timerFill = document.createElement('div');
  timerFill.id = 'starTimerFill';
  timerFill.style.cssText = `
    height:100%;
    width:100%;
    background:linear-gradient(90deg,#ffd60a,#ff3366);
    border-radius:2px;
    transition:width 0.5s linear;
  `;
  timerBar.appendChild(timerFill);
  document.body.appendChild(timerBar);

  return { overlay, star, starBubble, timerFill };
}

/* ── EMO'NUN KOLU UZANMA ANİMASYONU ── */
function stretchArmUp() {
  const armR = document.getElementById('armR');
  if (!armR) return;
  armR.style.transition = 'transform 0.6s cubic-bezier(.34,1.56,.64,1)';
  armR.style.transform = 'rotate(-110deg) translateY(-20px)';
}
function resetArm() {
  const armR = document.getElementById('armR');
  if (!armR) return;
  armR.style.transition = 'transform 0.5s ease';
  armR.style.transform = '';
}
function holdStar() {
  const armR = document.getElementById('armR');
  if (!armR) return;
  armR.style.transform = 'rotate(-60deg)';
}

/* ── YILDIZ ANIMASYONU ── */
async function runStarSequence() {
  if (starModeActive) return;
  starModeActive = true;

  const { overlay, star, starBubble, timerFill } = createStarUI();

  // EMO heyecanlanır
  setExpression('excited');
  doHappyBounce(2);
  addBubble('Bir yıldız görüyorum! Yakalamaya çalışayım! 🌟', 'ai');

  // Kol yukarı uzanır
  await delay(800);
  stretchArmUp();

  // Yıldız düşer — EMO'nun eline doğru
  await delay(300);
  const svgRect = document.getElementById('emoRoot').getBoundingClientRect();
  const armX = svgRect.right - 30;
  const armY = svgRect.top + svgRect.height * 0.55;

  star.style.top  = (armY - 30) + 'px';
  star.style.left = (armX - 24) + 'px';
  star.style.transform = 'none';

  await delay(1400);

  // Kol tutma pozisyonuna geç
  holdStar();
  star.style.fontSize = '36px';
  setExpression('happy');
  setHeadTilt(-8); // yıldıza bakıyor

  // Küçük zıplama — yakaladı!
  doHappyBounce(1);

  await delay(600);

  // ── SOHBET DÖNGÜSÜ ──
  const totalMs   = 38000; // ~38 saniye konuşma
  const startTime = Date.now();

  // Timer bar başlat
  let barInterval = setInterval(() => {
    const elapsed  = Date.now() - startTime;
    const pct      = Math.max(0, 100 - (elapsed / totalMs) * 100);
    timerFill.style.width = pct + '%';
    if (pct <= 0) clearInterval(barInterval);
  }, 300);

  for (let i = 0; i < starConversation.length; i++) {
    const line = starConversation[i];

    if (line.who === 'star') {
      // Yıldız konuşuyor — balon göster
      starBubble.textContent = line.text;
      starBubble.style.left  = (armX - 10) + 'px';
      starBubble.style.top   = (armY - 100) + 'px';
      starBubble.style.opacity = '1';

      // Yıldız titrer
      star.style.transition += ', transform 0.15s';
      star.style.transform = 'scale(1.2) rotate(-5deg)';
      await delay(200);
      star.style.transform = 'scale(1) rotate(5deg)';
      await delay(200);
      star.style.transform = 'scale(1.1) rotate(0deg)';

      addBubble('⭐ ' + line.text, 'ai');
      await delay(3200);
      starBubble.style.opacity = '0';
      await delay(400);

    } else {
      // EMO konuşuyor
      starBubble.style.opacity = '0';
      setExpression(i < 4 ? 'excited' : 'sad');
      addBubble(line.text, 'ai');

      // Sesli söyle
      await new Promise(resolve => {
        speakLine(line.text, resolve);
      });
      await delay(400);
    }
  }

  clearInterval(barInterval);
  timerFill.style.width = '0%';

  // ── YILDIZ UÇUYOR ── 
  await delay(500);
  setExpression('sad');
  setHeadTilt(10);
  star.style.transition = 'top 1.5s ease-in, left 0.8s ease, opacity 1s ease, font-size 0.5s';
  star.style.top     = '-80px';
  star.style.left    = (armX + 40) + 'px';
  star.style.opacity = '0';
  star.style.fontSize = '20px';

  resetArm();

  await delay(1600);

  // Temizle
  overlay.remove();
  timerBar.remove();

  await delay(500);
  setExpression('neutral');
  setHeadTilt(0);
  starModeActive = false;
}

/* ── YARDIMCI: sesli konuşma (TTS olmadan da çalışır) ── */
function speakLine(text, done) {
  if (typeof speak === 'function') {
    // speak fonksiyonu promise dönmüyor, onend'i taklit et
    const synth = window.speechSynthesis;
    if (synth) {
      synth.cancel();
      const utt = new SpeechSynthesisUtterance(text);
      utt.lang = 'tr-TR'; utt.rate = 1.0; utt.pitch = 1.1;
      const voices = synth.getVoices();
      const tr = voices.find(v => v.lang.startsWith('tr'));
      if (tr) utt.voice = tr;
      utt.onend = utt.onerror = () => done();
      synth.speak(utt);
      return;
    }
  }
  // Fallback: sadece bekle
  setTimeout(done, 2500);
}

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

/* ── HOOK: speech.js'ten çağrılan kontrol ── */
const _prevMarriageCheck = window.askGroqWithMarriageCheck;
window.askGroqWithMarriageCheck = function(text) {
  if (checkStarQuestion(text)) {
    // Sesli "evet" cevabı ver, sonra animasyon başlat
    addBubble('Evet, yıldızları çok severim! Hatta şu an bir tanesini yakalayacağım! ✨', 'ai');
    speakLine('Evet, yıldızları çok severim! Hatta şu an bir tanesini yakalayacağım!', () => {});
    setTimeout(runStarSequence, 1200);
    return;
  }
  if (_prevMarriageCheck) _prevMarriageCheck(text);
  else askGroq(text);
};
