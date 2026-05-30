/**
 * config.js
 * API anahtarı kullanıcıdan alınır ve tarayıcıda saklanır.
 * Anahtarı değiştirmek için sayfayı yenile ve yeni anahtar gir.
 */

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL   = 'llama-3.3-70b-versatile';

const SYSTEM_PROMPT =
  'Sen "EMO" adında canlı, meraklı ve sevimli bir masaüstü robot asistansın. ' +
  'Kısa, akıcı, doğal Türkçe konuş (1-3 cümle). Samimi ve sıcak ol. ' +
  'Noktalama işaretlerini doğru kullan.';

let GROQ_API_KEY = localStorage.getItem('groq_api_key') || '';
