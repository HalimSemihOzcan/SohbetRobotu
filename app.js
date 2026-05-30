/**
 * app.js
 * Ana uygulama mantığı: durum yönetimi, UI güncellemeleri,
 * mikrofon butonu, sohbet balonları ve API anahtar yönetimi.
 */

/* ── API ANAHTAR KONTROLÜ ── */
(function checkApiKey() {
  let key = localStorage.getItem('groq_api_key');
  if (!key) {
    key = prompt(
      'Groq API anahtarını gir.\n\n' +
      'Ücretsiz almak için: console.groq.com\n\n' +
      'Anahtar "gsk_..." ile başlar:'
    );
    if (key && key.trim()) {
      localStorage.setItem('groq_api_key', key.trim());
      GROQ_API_KEY = key.trim();
    }
  } else {
    GROQ_API_KEY = key;
  }
})();

/* ── UI ELEMENTS ── */
const btnMic = document.getElementById('btnMic');
const sLed   = document.getElementById('sLed');
const sText  = document.getElementById('sText');
const micLbl = document.getElementById('micLbl');
const chatEl = document.getElementById('chat');
const errEl  = document.getElementById('errEl');

/* ── APP STATE ── */
let appState = 'idle';

const STATE_CONFIG = {
  idle:      { ledCls: 'cyan',   txt: 'HAZIR',       lbl: 'KONUŞMAK İÇİN BAS', chest: '#00ff88' },
  listening: { ledCls: 'red',    txt: 'DİNLİYORUM',  lbl: 'DURDUR — BAS',      chest: '#ff3366' },
  thinking:  { ledCls: 'yellow', txt: 'DÜŞÜNÜYORUM', lbl: '',                   chest: '#ffd60a' },
  speaking:  { ledCls: 'green',  txt: 'KONUŞUYORUM', lbl: 'DURDUR — BAS',      chest: '#00d4ff' },
};

function setState(s) {
  appState = s;
  const cfg = STATE_CONFIG[s] || STATE_CONFIG.idle;
  sLed.className     = 'led ' + cfg.ledCls;
  sText.textContent  = cfg.txt;
  micLbl.textContent = cfg.lbl;
  btnMic.className   = 'mic-btn' + (s === 'listening' ? ' active' : '');
  document.getElementById('chestLed').setAttribute('fill', cfg.chest);
}

/* ── ERROR MESSAGE ── */
function showErr(msg) {
  errEl.textContent   = msg;
  errEl.style.display = 'block';
  setTimeout(() => { errEl.style.display = 'none'; }, 6000);
}

/* ── CHAT BUBBLE ── */
function addBubble(text, who) {
  const b = document.createElement('div');
  b.className   = 'bubble ' + who;
  b.textContent = text;
  chatEl.appendChild(b);
  chatEl.scrollTop = chatEl.scrollHeight;
}

/* ── MIC BUTTON ── */
btnMic.addEventListener('click', () => {
  errEl.style.display = 'none';

  if (appState === 'speaking') {
    window.speechSynthesis.cancel();
    stopMouth();
    stopTalkBounce();
    setExpression('neutral');
    setState('idle');
    return;
  }

  if (appState === 'listening') {
    recognition && recognition.stop();
    setState('idle');
    return;
  }

  if (appState === 'idle') {
    if (!GROQ_API_KEY) {
      const key = prompt('Önce Groq API anahtarını gir (console.groq.com):');
      if (key && key.trim()) {
        localStorage.setItem('groq_api_key', key.trim());
        GROQ_API_KEY = key.trim();
      } else return;
    }
    if (!recognition) recognition = buildRecognition();
    setState('listening');
    setExpression('neutral');
    try {
      recognition.start();
    } catch (e) {
      recognition = buildRecognition();
      try { recognition && recognition.start(); }
      catch (e2) { setState('idle'); }
    }
  }
});

/* ── BOOT ── */
(function init() {
  initFace();
  initBody();
  initSpeech();
  setState('idle');
})();
