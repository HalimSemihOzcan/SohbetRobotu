/**
 * body.js
 * EMO'nun vücut hareketlerini yönetir:
 * serbest yüzme, yürüyüş, konuşma zıplaması,
 * mutlu sıçrama ve düşme animasyonu.
 */

const emoRoot = document.getElementById('emoRoot');
const headGroup = document.getElementById('headGroup');
const legL = document.getElementById('legL');
const legR = document.getElementById('legR');
const armL = document.getElementById('armL');
const armR = document.getElementById('armR');

let bodyX = 0;
let bodyY = 0;
let walkDir = 1;
let isWalking = false;

let idleInterval    = null;
let walkInterval    = null;
let talkInterval    = null;
let wanderTimer     = null;
let idlePhase       = 0;

/* ── TRANSFORM HELPERS ── */
function setBodyTransform(x, y, rotate = 0) {
  emoRoot.style.transform = `translate(${x}px,${y}px) rotate(${rotate}deg)`;
}

function setHeadTilt(deg) {
  headGroup.style.transform = `rotate(${deg}deg)`;
}

/* ── IDLE FLOAT ── */
function tickIdle() {
  if (isWalking) return;
  idlePhase += 0.04;
  const y    = Math.sin(idlePhase) * 5;
  const tilt = Math.sin(idlePhase * 0.7) * 1.5;
  setBodyTransform(bodyX, y);
  setHeadTilt(tilt);
}

/* ── WALKING ── */
function startWalk(targetX) {
  isWalking = true;
  const startX = bodyX;
  const dist   = targetX - startX;
  const steps  = Math.abs(dist) / 1.5;
  let step = 0;
  let phase = 0;
  walkDir = dist > 0 ? 1 : -1;

  clearInterval(walkInterval);
  walkInterval = setInterval(() => {
    step++;
    phase += 0.18;
    const progress = step / steps;
    bodyX = startX + dist * Math.min(progress, 1);
    const sway = Math.sin(phase * Math.PI * 2) * 4;
    const bob  = Math.abs(Math.sin(phase * Math.PI * 2)) * 3;

    legL.style.transform = `rotate(${Math.sin(phase * Math.PI * 2) * 8}deg)`;
    legR.style.transform = `rotate(${-Math.sin(phase * Math.PI * 2) * 8}deg)`;
    armL.style.transform = `rotate(${-Math.sin(phase * Math.PI * 2) * 14}deg)`;
    armR.style.transform = `rotate(${Math.sin(phase * Math.PI * 2) * 14}deg)`;

    setBodyTransform(bodyX, -bob, sway * 0.3);

    if (step >= steps) {
      clearInterval(walkInterval);
      isWalking = false;
      legL.style.transform = '';
      legR.style.transform = '';
      armL.style.transform = '';
      armR.style.transform = '';
    }
  }, 22);
}

/* ── IDLE WANDER ── */
function scheduleWander() {
  const delay = 5000 + Math.random() * 8000;
  wanderTimer = setTimeout(() => {
    if (!isWalking) {
      const target = (Math.random() - 0.5) * 70;
      startWalk(target);
    }
    scheduleWander();
  }, delay);
}

/* ── TALK BOUNCE ── */
function startTalkBounce() {
  let phase = 0;
  talkInterval = setInterval(() => {
    phase += 0.25;
    const y    = Math.sin(phase * Math.PI) * 4;
    const tilt = Math.sin(phase * Math.PI * 0.5) * 2;
    setBodyTransform(bodyX, y);
    setHeadTilt(tilt);
  }, 30);
}

function stopTalkBounce() {
  clearInterval(talkInterval);
  setBodyTransform(bodyX, 0);
  setHeadTilt(0);
}

/* ── HAPPY BOUNCE ── */
function doHappyBounce(times) {
  let t = 0;
  let up = true;
  const iv = setInterval(() => {
    setBodyTransform(bodyX, up ? -12 : 0);
    legL.style.transform = up ? 'rotate(-5deg)' : '';
    legR.style.transform = up ? 'rotate(5deg)'  : '';
    up = !up;
    t++;
    if (t >= times * 2) {
      clearInterval(iv);
      legL.style.transform = '';
      legR.style.transform = '';
      setBodyTransform(bodyX, 0);
    }
  }, 200);
}

/* ── FALL ANIMATION ── */
function doFallAnimation() {
  emoRoot.style.transition = 'transform .4s cubic-bezier(.36,.07,.19,.97)';
  setBodyTransform(bodyX + walkDir * 30, 20, walkDir * 80);
  setTimeout(() => {
    emoRoot.style.transition = 'transform .06s linear';
    setExpression('dizzy');
    setTimeout(() => {
      if (currentEmo === 'dizzy') setExpression('neutral');
    }, 2200);
  }, 3000);
}

/* ── INIT ── */
function initBody() {
  idleInterval = setInterval(tickIdle, 30);
  scheduleWander();
}
