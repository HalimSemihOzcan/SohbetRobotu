/**
 * speech.js
 * iOS + Android + Desktop tam uyumlu ses sistemi.
 *
 * STT:  Önce SpeechRecognition (Chrome/Android), yoksa Whisper API (iOS)
 * TTS:  Önce Groq PlayAI TTS (MP3, mobil uyumlu), yoksa Web Speech API
 */

let recognition   = null;
let currentAudio  = null;
let mediaRecorder = null;
let audioChunks   = [];
let isRecording   = false;
let isProcessing  = false; // tekrar tetiklenmeyi önler

/* ── PLATFORM DETECTION ── */
const hasNativeSpeech = !!(window.SpeechRecognition || window.webkitSpeechRecognition);

/* ── SHOT / BLOW DETECTION ── */
function checkShot(text) {
  const t = text.toLowerCase();
  return /sıktım|vurdum|bang|pew|ateş ettim|bam|güm|patlattım|öldürdüm|püf|üfle|üfledim|fış|whoosh/.test(t);
}

/* ─────────────────────────────────────────
   STT — YÖNTEM 1: SpeechRecognition (Chrome/Android)
───────────────────────────────────────── */
function buildRecognition() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return null;

  const r = new SR();
  r.lang            = 'tr-TR';
  r.continuous      = false;
  r.interimResults  = false;
  r.maxAlternatives = 1;

  r.onresult = e => {
    // Zaten işleme alındıysa ikinci sonucu yoksay
    if (isProcessing) return;
    isProcessing = true;

    // Sadece final sonucu al
    let text = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      if (e.results[i].isFinal) {
        text = e.results[i][0].transcript.trim();
        break;
      }
    }

    if (!text) { isProcessing = false; setState('idle'); return; }

    addBubble(text, 'user');

    if (checkShot(text)) {
      isProcessing = false;
      setState('idle');
      setExpression('fallen');
      return;
    }

    setState('thinking');
    setExpression('confused');
    setHeadTilt(10);
    window.askGroqWithMarriageCheck ? window.askGroqWithMarriageCheck(text) : askGroq(text);
  };

  r.onerror = e => {
    isProcessing = false;
    setState('idle');
    setExpression('neutral');
    if (e.error === 'not-allowed') showErr('MİKROFON İZNİ GEREKİYOR.');
    else if (e.error === 'no-speech') showErr('SES ALGILANAMADI — tekrar dene.');
    else if (e.error === 'aborted') { /* kasıtlı durdurma, hata gösterme */ }
    else showErr('HATA: ' + e.error);
  };

  r.onend = () => {
    if (appState === 'listening') setState('idle');
  };

  return r;
}

/* ─────────────────────────────────────────
   STT — YÖNTEM 2: Whisper API (iOS / Safari)
───────────────────────────────────────── */
async function startWhisperRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioChunks   = [];
    const mimeType = getSupportedMimeType();
    mediaRecorder  = new MediaRecorder(stream, { mimeType });

    mediaRecorder.ondataavailable = e => {
      if (e.data.size > 0) audioChunks.push(e.data);
    };

    mediaRecorder.onstop = async () => {
      stream.getTracks().forEach(t => t.stop());
      if (isProcessing) return; // çift gönderimi önle
      isProcessing = true;
      const blob = new Blob(audioChunks, { type: mimeType });
      await sendToWhisper(blob, mimeType);
    };

    mediaRecorder.start();
    isRecording = true;
    setState('listening');
  } catch (err) {
    showErr('MİKROFON HATASI: ' + err.message);
    setState('idle');
  }
}

function stopWhisperRecording() {
  if (mediaRecorder && isRecording && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
    isRecording = false;
    setState('thinking');
    setExpression('confused');
    setHeadTilt(10);
  }
}

function getSupportedMimeType() {
  const types = ['audio/webm', 'audio/mp4', 'audio/ogg', 'audio/wav'];
  return types.find(t => MediaRecorder.isTypeSupported(t)) || 'audio/mp4';
}

async function sendToWhisper(blob, mimeType) {
  try {
    const ext  = mimeType.includes('mp4') ? 'm4a'
               : mimeType.includes('ogg') ? 'ogg'
               : mimeType.includes('wav') ? 'wav' : 'webm';
    const form = new FormData();
    form.append('file', blob, 'audio.' + ext);
    form.append('model', 'whisper-large-v3-turbo');
    form.append('language', 'tr');
    form.append('response_format', 'json');

    const res  = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + GROQ_API_KEY },
      body: form
    });

    const data = await res.json();
    const text = data.text && data.text.trim();

    if (!text) { showErr('SES ANLAŞILAMADI — tekrar dene.'); isProcessing = false; setState('idle'); return; }

    addBubble(text, 'user');
    if (checkShot(text)) { isProcessing = false; setState('idle'); setExpression('fallen'); return; }
    window.askGroqWithMarriageCheck ? window.askGroqWithMarriageCheck(text) : askGroq(text);

  } catch (err) {
    isProcessing = false;
    setState('idle');
    setExpression('sad');
    showErr('SES TANIMA HATASI: ' + err.message);
  }
}

/* ─────────────────────────────────────────
   KAYIT BAŞLAT / DURDUR
───────────────────────────────────────── */
function startListening() {
  if (isProcessing) return; // işlem devam ediyorsa yeni kayıt başlatma
  isProcessing = false;

  if (hasNativeSpeech) {
    // Her seferinde sıfırdan recognition oluştur — eski state'i temizler
    if (recognition) {
      try { recognition.abort(); } catch(e) {}
    }
    recognition = buildRecognition();
    setState('listening');
    setExpression('neutral');
    try { recognition.start(); }
    catch (e) { setState('idle'); }
  } else {
    startWhisperRecording();
  }
}

function stopListening() {
  if (hasNativeSpeech) {
    try { recognition && recognition.abort(); } catch(e) {}
    setState('idle');
  } else {
    stopWhisperRecording();
  }
}

/* ─────────────────────────────────────────
   GROQ TEXT API
───────────────────────────────────────── */
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
        max_tokens: 220,
        temperature: 0.85
      })
    });

    const data  = await res.json();
    const reply = data.choices?.[0]?.message?.content || 'Üzgünüm, bir şeyler ters gitti.';
    addBubble(reply, 'ai');
    await speak(reply, detectEmoFromText(reply));

  } catch (err) {
    isProcessing = false;
    setState('idle');
    setExpression('sad');
    showErr('BAĞLANTI HATASI: ' + err.message);
  }
}

/* ─────────────────────────────────────────
   TTS — GROQ PlayAI
───────────────────────────────────────── */
async function speakWithGroqTTS(text) {
  const res = await fetch('https://api.groq.com/openai/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + GROQ_API_KEY
    },
    body: JSON.stringify({
      model: 'playai-tts',
      input: text,
      voice: 'Celeste-PlayAI',
      response_format: 'mp3'
    })
  });
  if (!res.ok) throw new Error('TTS API hatası: ' + res.status);
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

/* ─────────────────────────────────────────
   TTS — Web Speech (fallback)
───────────────────────────────────────── */
function speakWithWebSpeech(text) {
  return new Promise(resolve => {
    const synth = window.speechSynthesis;
    synth.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'tr-TR'; utt.rate = 1.05; utt.pitch = 1.05; utt.volume = 1;
    const voices = synth.getVoices();
    const tr = voices.find(v => v.lang.startsWith('tr') && v.localService && !v.name.includes('Google'))
            || voices.find(v => v.lang.startsWith('tr') && v.localService)
            || voices.find(v => v.lang.startsWith('tr'));
    if (tr) utt.voice = tr;
    utt.onend = utt.onerror = () => resolve();
    synth.speak(utt);
  });
}

/* ─────────────────────────────────────────
   ANA SPEAK
───────────────────────────────────────── */
async function speak(text, emo) {
  setState('speaking');
  setExpression('neutral');
  startMouth();
  startTalkBounce();

  try {
    const audioUrl = await speakWithGroqTTS(text);
    if (currentAudio) { currentAudio.pause(); currentAudio = null; }
    const audio = new Audio(audioUrl);
    currentAudio = audio;
    audio.onended = () => { URL.revokeObjectURL(audioUrl); finishSpeaking(emo); };
    audio.onerror = () => { URL.revokeObjectURL(audioUrl); finishSpeaking(emo); };
    await audio.play();
  } catch (err) {
    console.warn('Groq TTS başarısız, Web Speech deneniyor:', err.message);
    try { await speakWithWebSpeech(text); } catch(e) {}
    finishSpeaking(emo);
  }
}

function finishSpeaking(emo) {
  isProcessing = false; // bir sonraki konuşmaya izin ver
  stopMouth();
  stopTalkBounce();
  setExpression(emo || 'happy');
  doHappyBounce(2);
  setTimeout(() => {
    if (!['fallen','dizzy','sleeping'].includes(currentEmo)) setExpression('neutral');
  }, 2500);
  setState('idle');
}

function stopSpeaking() {
  if (currentAudio) { currentAudio.pause(); currentAudio = null; }
  window.speechSynthesis && window.speechSynthesis.cancel();
  isProcessing = false;
}

/* ─────────────────────────────────────────
   INIT
───────────────────────────────────────── */
function initSpeech() {
  if (hasNativeSpeech) recognition = buildRecognition();
  if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
    speechSynthesis.getVoices();
  }
}

function updateMicLabel(text) {
  document.getElementById('micLbl').textContent = text;
}
