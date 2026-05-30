# EMO — Türkçe Sesli Sohbet Robotu

Tarayıcıda çalışan, EMO robot tasarımlı Türkçe sesli AI sohbet uygulaması.

## Özellikler

- 🎙️ Türkçe ses tanıma (Web Speech API)
- 🔊 Türkçe ses sentezi (TTS)
- 🤖 Groq API üzerinden Llama 3.3 ile yapay zeka yanıtları
- 😊 10+ yüz ifadesi (mutlu, üzgün, kızgın, şaşkın, uyuyan…)
- 🚶 Kendi kendine yürüme ve serbest yüzme animasyonu
- 💥 "Sıktım / püf" dediğinde yere düşme animasyonu

## Dosya Yapısı

```
emo-robot/
├── index.html   → Ana sayfa ve SVG robot
├── style.css    → Tüm stiller
├── config.js    → API anahtarı ve sabitler
├── face.js      → Yüz ifadeleri, göz & ağız animasyonları
├── body.js      → Vücut hareketleri (yürüme, zıplama, düşme)
├── speech.js    → STT, TTS ve Groq API entegrasyonu
└── app.js       → Durum yönetimi ve mikrofon butonu
```

## Kurulum

### Yerel kullanım
1. Bu klasörü bilgisayarına indir.
2. `index.html` dosyasını **Chrome** ile aç.
3. Mikrofon izni ver.
4. Butona bas ve Türkçe konuş!

### GitHub Pages ile yayınlama
1. Bu klasörü bir GitHub reposuna yükle.
2. Repo Ayarları → Pages → Branch: `main`, Klasör: `/ (root)`.
3. Birkaç dakika sonra sitenin linki hazır olur.

## API Anahtarı Değiştirme

`config.js` dosyasını aç ve `GROQ_API_KEY` satırını kendi anahtarınla değiştir:

```js
const GROQ_API_KEY = 'gsk_SENIN_ANAHTARIN';
```

Ücretsiz Groq anahtarı almak için: https://console.groq.com

## Ses Kalitesi

En iyi Türkçe TTS için:
- **Windows:** Ayarlar → Konuşma → Türkçe ses paketi indir
- **macOS:** Sistem Ayarları → Erişilebilirlik → Konuşma → Türkçe ses ekle
- **Chrome** tarayıcısı önerilir.
