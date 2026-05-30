/**
 * face.js
 * EMO'nun yüz ifadelerini, göz hareketlerini ve
 * ağız animasyonunu yönetir.
 */

/* ── ELEMENT REFS ── */
const pupilL     = document.getElementById('pupilL');
const pupilR     = document.getElementById('pupilR');
const lidL       = document.getElementById('lidL');
const lidR       = document.getElementById('lidR');
const mouthPath  = document.getElementById('mouthPath');
const mouthOval  = document.getElementById('mouthOval');
const screenGlow = document.getElementById('screenGlow');
const chestLed   = document.getElementById('chestLed');
const antLed     = document.getElementById('antLed');

const ovlHearts     = document.getElementById('ovlHearts');
const ovlX          = document.getElementById('ovlX');
const ovlStars      = document.getElementById('ovlStars');
const ovlZzz        = document.getElementById('ovlZzz');
const ovlSadBrows   = document.getElementById('ovlSadBrows');
const ovlAngryBrows = document.getElementById('ovlAngryBrows');
const ovlWinkLid    = document.getElementById('ovlWinkLid');
const ovlQ          = document.getElementById('ovlQ');

const allOverlays = [
  ovlHearts, ovlX, ovlStars, ovlZzz,
  ovlSadBrows, ovlAngryBrows, ovlWinkLid
];

let currentEmo = 'neutral';
let blinkTimeout, lookTimer, antInterval, mouthInterval;

/* ── ANTENNA BLINK ── */
function startAntenna() {
  let on = true;
  antInterval = setInterval(() => {
    antLed.setAttribute('opacity', (on = !on) ? '.8' : '.2');
  }, 700);
}

/* ── BLINK ── */
function doBlink() {
  if (['dizzy', 'fallen', 'sleeping'].includes(currentEmo)) {
    blinkTimeout = setTimeout(doBlink, 3000);
    return;
  }
  lidL.style.transform = 'scaleY(1)';
  lidR.style.transform = 'scaleY(1)';
  setTimeout(() => {
    lidL.style.transform = 'scaleY(0)';
    lidR.style.transform = 'scaleY(0)';
  }, 110);
  blinkTimeout = setTimeout(doBlink, 2200 + Math.random() * 3800);
}

/* ── EYE LOOK AROUND ── */
function doLook() {
  if (['dizzy', 'fallen', 'sleeping'].includes(currentEmo)) {
    lookTimer = setTimeout(doLook, 2000);
    return;
  }
  const dx = (Math.random() - 0.5) * 8;
  const dy = (Math.random() - 0.5) * 6;
  pupilL.style.transform = `translate(${dx}px,${dy}px)`;
  pupilR.style.transform = `translate(${dx}px,${dy}px)`;
  lookTimer = setTimeout(doLook, 1000 + Math.random() * 2000);
}

function resetEyePos() {
  pupilL.style.transform = 'translate(0,0)';
  pupilR.style.transform = 'translate(0,0)';
}

/* ── MOUTH TALKING ── */
const mouthShapes = [0, 12, 18, 14, 8, 16, 10, 18, 0];
let mouthIdx = 0;

function startMouth() {
  mouthPath.setAttribute('opacity', '0');
  mouthInterval = setInterval(() => {
    mouthIdx = (mouthIdx + 1) % mouthShapes.length;
    const rx = mouthShapes[mouthIdx];
    mouthOval.setAttribute('rx', rx);
    mouthOval.setAttribute('ry', rx * 0.55);
  }, 120);
}

function stopMouth() {
  clearInterval(mouthInterval);
  mouthOval.setAttribute('rx', '0');
  mouthOval.setAttribute('ry', '0');
  mouthPath.setAttribute('opacity', '1');
}

/* ── CLEAR FACE ── */
function clearFace() {
  allOverlays.forEach(o => o.setAttribute('opacity', '0'));
  ovlQ.setAttribute('opacity', '0');
  mouthPath.setAttribute('d', 'M88 124 Q120 136 152 124');
  mouthPath.setAttribute('stroke', '#00d4ff');
  mouthPath.setAttribute('opacity', '1');
  mouthOval.setAttribute('rx', '0');
  mouthOval.setAttribute('ry', '0');
  pupilL.setAttribute('fill', '#00d4ff');
  pupilR.setAttribute('fill', '#00d4ff');
  pupilL.setAttribute('x','66'); pupilL.setAttribute('y','68');
  pupilL.setAttribute('width','38'); pupilL.setAttribute('height','38');
  pupilR.setAttribute('x','136'); pupilR.setAttribute('y','68');
  pupilR.setAttribute('width','38'); pupilR.setAttribute('height','38');
  screenGlow.setAttribute('fill', '#00d4ff');
  screenGlow.setAttribute('opacity', '.03');
  lidL.style.transform = 'scaleY(0)';
  lidR.style.transform = 'scaleY(0)';
}

/* ── SET EXPRESSION ── */
function setExpression(emo) {
  currentEmo = emo;
  clearFace();

  switch (emo) {
    case 'happy':
      mouthPath.setAttribute('d', 'M84 120 Q120 140 156 120');
      pupilL.setAttribute('fill', '#00ff88');
      pupilR.setAttribute('fill', '#00ff88');
      screenGlow.setAttribute('fill', '#00ff88');
      screenGlow.setAttribute('opacity', '.05');
      chestLed.setAttribute('fill', '#00ff88');
      setHeadTilt(-3);
      break;

    case 'excited':
      ovlHearts.setAttribute('opacity', '1');
      mouthPath.setAttribute('d', 'M82 116 Q120 142 158 116');
      mouthPath.setAttribute('stroke', '#ff3366');
      pupilL.setAttribute('fill', '#ff3366');
      pupilR.setAttribute('fill', '#ff3366');
      screenGlow.setAttribute('fill', '#ff3366');
      screenGlow.setAttribute('opacity', '.06');
      chestLed.setAttribute('fill', '#ff3366');
      break;

    case 'sad':
      mouthPath.setAttribute('d', 'M88 132 Q120 120 152 132');
      ovlSadBrows.setAttribute('opacity', '1');
      pupilL.setAttribute('fill', '#7c6ff7');
      pupilR.setAttribute('fill', '#7c6ff7');
      pupilL.setAttribute('y', '72'); pupilL.setAttribute('height', '28');
      pupilR.setAttribute('y', '72'); pupilR.setAttribute('height', '28');
      screenGlow.setAttribute('fill', '#7c6ff7');
      screenGlow.setAttribute('opacity', '.04');
      setHeadTilt(6);
      break;

    case 'angry':
      mouthPath.setAttribute('d', 'M92 130 Q120 122 148 130');
      ovlAngryBrows.setAttribute('opacity', '1');
      pupilL.setAttribute('fill', '#ff3366');
      pupilR.setAttribute('fill', '#ff3366');
      screenGlow.setAttribute('fill', '#ff3366');
      screenGlow.setAttribute('opacity', '.07');
      setHeadTilt(-2);
      break;

    case 'surprised':
      mouthOval.setAttribute('rx', '13');
      mouthOval.setAttribute('ry', '13');
      mouthPath.setAttribute('opacity', '0');
      pupilL.setAttribute('x','62'); pupilL.setAttribute('y','62');
      pupilL.setAttribute('width','46'); pupilL.setAttribute('height','46');
      pupilR.setAttribute('x','132'); pupilR.setAttribute('y','62');
      pupilR.setAttribute('width','46'); pupilR.setAttribute('height','46');
      setHeadTilt(-5);
      break;

    case 'confused':
      ovlQ.setAttribute('opacity', '1');
      mouthPath.setAttribute('d', 'M92 126 Q120 130 148 122');
      pupilR.setAttribute('y', '72');
      pupilR.setAttribute('height', '28');
      setHeadTilt(8);
      break;

    case 'wink':
      ovlWinkLid.setAttribute('opacity', '1');
      mouthPath.setAttribute('d', 'M84 118 Q120 138 156 118');
      setHeadTilt(-4);
      setTimeout(() => {
        if (currentEmo === 'wink') setExpression('happy');
      }, 900);
      break;

    case 'sleeping':
      ovlZzz.setAttribute('opacity', '1');
      mouthPath.setAttribute('opacity', '0');
      lidL.style.transform = 'scaleY(1)';
      lidR.style.transform = 'scaleY(1)';
      screenGlow.setAttribute('fill', '#7c6ff7');
      screenGlow.setAttribute('opacity', '.04');
      chestLed.setAttribute('fill', '#7c6ff7');
      setHeadTilt(12);
      break;

    case 'dizzy':
      ovlX.setAttribute('opacity', '1');
      ovlStars.setAttribute('opacity', '1');
      mouthPath.setAttribute('d', 'M92 126 Q106 132 120 126 Q134 120 148 126');
      mouthPath.setAttribute('stroke', '#ffd60a');
      lidL.style.transform = 'scaleY(1)';
      lidR.style.transform = 'scaleY(1)';
      screenGlow.setAttribute('fill', '#ffd60a');
      screenGlow.setAttribute('opacity', '.05');
      chestLed.setAttribute('fill', '#ffd60a');
      break;

    case 'fallen':
      ovlX.setAttribute('opacity', '1');
      ovlStars.setAttribute('opacity', '1');
      mouthPath.setAttribute('d', 'M92 126 Q106 132 120 126 Q134 120 148 126');
      lidL.style.transform = 'scaleY(1)';
      lidR.style.transform = 'scaleY(1)';
      chestLed.setAttribute('fill', '#ff3366');
      doFallAnimation();
      break;

    default: // neutral / talking
      resetEyePos();
      setHeadTilt(0);
      break;
  }
}

/* ── DETECT EMOTION FROM AI REPLY ── */
function detectEmoFromText(text) {
  const t = text.toLowerCase();
  if (/harika|muhteşem|süper|wow|inanılmaz|yay|seviyorum|😍|❤/.test(t)) return 'excited';
  if (/üzgün|üzücü|maalesef|ne yazık ki|oh hayır/.test(t))               return 'sad';
  if (/sinirli|kızgın|öfke|bıktım/.test(t))                               return 'angry';
  if (/gerçekten mi|şaşırdım|vay|beklemiyordum|ciddi mi/.test(t))         return 'surprised';
  if (/bilmiyorum|emin değil|hmm|belki|anlamadım/.test(t))                return 'confused';
  if (/komik|haha|hihi|şaka|güldüm/.test(t))                              return 'wink';
  return 'happy';
}

/* ── INIT ── */
function initFace() {
  setExpression('neutral');
  doBlink();
  doLook();
  startAntenna();
}
