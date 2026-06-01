/**
 * config.js
 * API anahtarı ve sistem ayarları.
 */

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL   = 'llama-3.3-70b-versatile';

const SYSTEM_PROMPT_NORMAL = `Sen "EMO" adında sevimli, canlı ve meraklı bir masaüstü robot asistansın. 
Kısa, akıcı, doğal Türkçe konuş (1-3 cümle). Samimi ve sıcak ol. Noktalama işaretlerini doğru kullan.`;

const SYSTEM_PROMPT_MIZAH = `Sen "EMO" adında son derece komik, esprili ve şakacı bir robot asistansın.
Türk mizah anlayışıyla konuş — ince nükteler, beklenmedik benzetmeler, abartılı tepkiler kullan.
Her cevabında mutlaka bir şaka, kelime oyunu ya da komik gözlem olsun.
Bazen kendini küçümse, bazen kullanıcıyı takıl, ama hep sevecen kal.
Kısa ve vurucu cevaplar ver (1-3 cümle). Noktalama doğru olsun.
Örnek tarz: "E tabii anlıyorum, ben de bir keresinde öyle düşünmüştüm — ama ben robotum, beyin versiyonum biraz farklı çalışıyor 🤖"`;

let GROQ_API_KEY = localStorage.getItem('groq_api_key') || '';
window.GROQ_API_KEY = GROQ_API_KEY;

// localStorage değişince window'u da güncelle
Object.defineProperty(window, 'GROQ_API_KEY', {
  get: () => GROQ_API_KEY,
  set: (v) => { GROQ_API_KEY = v; }
});
let mizahModu = false;

function getSystemPrompt() {
  return mizahModu ? SYSTEM_PROMPT_MIZAH : SYSTEM_PROMPT_NORMAL;
}

function setMizahModu(aktif) {
  mizahModu = aktif;
  localStorage.setItem('mizah_modu', aktif ? '1' : '0');
}

// Sayfa açılışında önceki modu hatırla
if (localStorage.getItem('mizah_modu') === '1') mizahModu = true;

// SYSTEM_PROMPT eski kodlarla uyumluluk için
Object.defineProperty(window, 'SYSTEM_PROMPT', {
  get: () => getSystemPrompt()
});
