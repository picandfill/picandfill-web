// 픽앤필 웹사이트 공통: 방문 통계(Google Analytics 4), 버튼 클릭 세기, 스크롤 등장 효과, App Store 링크

// ▼ 여기 두 곳만 채우면 됨 (README 참고)
const GA_ID = 'G-9KE590DBGT';            // Google Analytics 측정 ID, 예: 'G-XXXXXXXXXX' (비어 있으면 통계 끔)
const APP_STORE_URL = 'https://apps.apple.com/app/id6824755586';

if (GA_ID) {
  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { dataLayer.push(arguments); };
  gtag('js', new Date());
  gtag('config', GA_ID);
}

// data-track="이름" 이 붙은 링크·버튼을 누르면 GA4 이벤트 'click_cta'로 셈 (GA → 보고서 → 이벤트)
document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-track]');
  if (el && window.gtag) gtag('event', 'click_cta', { cta: el.dataset.track });
});

// App Store 버튼: 출시 전엔 "출시 준비 중"
document.querySelectorAll('[data-appstore]').forEach((a) => {
  if (APP_STORE_URL) {
    a.href = APP_STORE_URL;
  } else {
    a.removeAttribute('href');
    a.classList.add('soon');
    a.querySelector('.label').textContent = '아이폰 출시 준비 중';
  }
});

// 화면에 들어오면 아래에서 올라오며 나타남
const io = new IntersectionObserver((entries) => {
  for (const en of entries) {
    if (en.isIntersecting) {
      en.target.classList.add('in');
      io.unobserve(en.target);
    }
  }
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// 첫 화면 폴라로이드: 메모가 타자 치듯 바뀜
const memo = document.querySelector('[data-typing]');
if (memo && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const lines = JSON.parse(memo.dataset.typing);
  let i = 0;
  const type = async () => {
    const text = lines[i++ % lines.length];
    for (let n = 0; n <= text.length; n++) {
      memo.textContent = text.slice(0, n);
      await new Promise((r) => setTimeout(r, 70));
    }
    setTimeout(type, 2200);
  };
  type();
}

const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

// 머리: 내리면 반투명 바탕
const topBar = document.getElementById('top');
const onScrollTop = () => topBar && topBar.classList.toggle('scrolled', scrollY > 20);
addEventListener('scroll', onScrollTop, { passive: true });
onScrollTop();

// 스크롤 이야기: 고정된 아이폰 속 화면과 글이 단계마다 바뀜, 단계 안에서는 아이폰이 정면으로 조금씩 돎
const story = document.querySelector('.story');
if (story) {
  const steps = story.querySelectorAll('.story-step');
  const shots = story.querySelectorAll('.story-phone .screen img');
  const dots = story.querySelectorAll('.story-dots i');
  let current = 0;
  const update = () => {
    const r = story.getBoundingClientRect();
    const p = Math.min(Math.max(-r.top / (r.height - innerHeight), 0), 0.9999);
    const i = Math.floor(p * steps.length);
    if (i !== current) {
      [steps, shots, dots].forEach((list) => list.forEach((el, k) => el.classList.toggle('on', k === i)));
      current = i;
    }
  };
  addEventListener('scroll', update, { passive: true });
  update();
}

// 세 공간: 단계를 누르면 폰 화면이 바뀜. 휴대폰에선 옆으로 밀어도 바뀜
document.querySelectorAll('.chapter').forEach((ch) => {
  const list = ch.querySelector('.ch-steps');
  const btns = [...list.querySelectorAll('button')];
  const shots = ch.querySelectorAll('.screen img');
  const show = (i) => {
    btns.forEach((b, k) => (k === i ? b.setAttribute('aria-current', 'true') : b.removeAttribute('aria-current')));
    shots.forEach((s, k) => s.classList.toggle('on', k === i));
  };
  btns.forEach((b, i) => b.addEventListener('click', () => show(i)));
  list.addEventListener('scroll', () => {
    if (list.scrollWidth <= list.clientWidth) return;
    const w = list.children[0].offsetWidth + 12;
    show(Math.min(Math.round(list.scrollLeft / w), btns.length - 1));
  }, { passive: true });
});

// 책처럼 읽기: 화면에 들어올 때 한 번 넘김 (4초, 반복 없음). 움직임 줄이기면 멈춘 그림, 버튼으로만 재생
const curl = document.querySelector('[data-curl]');
if (curl) {
  const replay = () => { curl.currentTime = 0; curl.play().catch(() => {}); };
  document.querySelector('[data-replay]').addEventListener('click', replay);
  if (!still) new IntersectionObserver((es, o) => {
    if (es[0].isIntersecting) { replay(); o.disconnect(); }
  }, { threshold: 0.6 }).observe(curl);
}

// 교토 예시: 화살표로 넘기기
const reel = document.querySelector('.reel');
document.querySelectorAll('[data-reel]').forEach((b) => b.addEventListener('click', () => {
  reel.scrollBy({ left: Number(b.dataset.reel) * reel.clientWidth * 0.6, behavior: still ? 'auto' : 'smooth' });
}));
