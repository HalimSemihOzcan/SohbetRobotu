/**
 * speech.js
 * Ses tanıma (STT) ve ses sentezi (TTS) işlemlerini yönetir.
 * Groq API üzerinden yapay zeka yanıtı alır.
 */

let recognition = null;

/* ── SHOT / BLOW DETECTION ── */
function checkShot(text) {
  const t = text.toLowerCase();
  return /sıktım|vurdum|bang|pew|ateş ettim|bam|güm|patlattım|öldürdüm|püf|üfle|üfledim|fış|whoosh/.test(t);
}

/* ── BUILD SPEECH RECOGNITION ── */
function buildRecognition() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    showErr('Bu tarayıcı ses tanımayı desteklemiyor. Lütfen Chrome kullan.');
    return null;
  }

  const r = new SR();
  r.lang            = 'tr-TR';
  r.continuous      = false;
  r.interimResults  = false;
  r.maxAlternatives = 1;

  r.onresult = e => {
    const text = e.results[0][0].transcript.trim();
    if (!text) { setState('idle'); return; }

    addBubble(text, 'user');

    if (checkShot(text)) {
      setState('idle');
      setExpression('fallen');
      return;
    }

    setState('thinking');
    setExpression('confused');
    setHeadTilt(10);
    askGroq(text);
  };

  r.onerror = e => {
    setState('idle');
    setExpression('neutral');
    if (e.error === 'not-allowed') showErr('MİKROFON İZNİ GEREKİYOR — tarayıcı adres çubuğundan izin ver.');
    else if (e.error === 'no-speech') showErr('SES ALGILANAMADI — tekrar dene.');
    else showErr('HATA: ' + e.error);
  };

  r.onend = () => {
    if (appState === 'listening') setState('idle');
  };

  return r;
}

/* ── ASK GROQ ── */
async function askGroq(userText) {
  try {
    const res = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + GROQ_API_KEY
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user',   content: userText }
        ],
        max_tokens:  220,
        temperature: 0.85
      })
    });

    const data  = await res.json();
    const reply = data.choices?.[0]?.message?.content || 'Üzgünüm, bir şeyler ters gitti.';

    addBubble(reply, 'ai');
    const emo = detectEmoFromText(reply);
    speak(reply, emo);

  } catch (err) {
    setState('idle');
    setExpression('sad');
    showErr('BAĞLANTI HATASI: ' + err.message);
  }
}

/* ── TTS ── */
function speak(text, emo) {
  const synth = window.speechSynthesis;
  synth.cancel();

  setTimeout(() => {
    const utt    = new SpeechSynthesisUtterance(text);
    utt.lang     = 'tr-TR';
    utt.rate     = 1.05;
    utt.pitch    = 1.05;
    utt.volume   = 1;

    const voices = synth.getVoices();
    const trVoice =
      voices.find(v => v.lang.startsWith('tr') && v.localService && !v.name.includes('Google')) ||
      voices.find(v => v.lang.startsWith('tr') && v.localService) ||
      voices.find(v => v.lang.startsWith('tr'));
    if (trVoice) utt.voice = trVoice;

    utt.onstart = () => {
      setState('speaking');
      setExpression('neutral');
      startMouth();
      startTalkBounce();
    };

    utt.onend = () => {
      stopMouth();
      stopTalkBounce();
      setExpression(emo || 'happy');
      doHappyBounce(2);
      setTimeout(() => {
        if (!['fallen','dizzy','sleeping'].includes(currentEmo)) setExpression('neutral');
      }, 2500);
      setState('idle');
    };

    utt.onerror = () => {
      stopMouth();
      stopTalkBounce();
      setExpression('neutral');
      setState('idle');
    };

    synth.speak(utt);
  }, 80);
}

/* ── INIT ── */
function initSpeech() {
  recognition = buildRecognition();
  if (typeof speechSynthesis !== 'undefined') {
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
    }
    speechSynthesis.getVoices();
  }
}
