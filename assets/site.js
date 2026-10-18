// 픽앤필 웹사이트 공통: 방문 통계(Google Analytics 4), 버튼 클릭 세기, 스크롤 등장 효과, App Store 링크

// ▼ 여기 두 곳만 채우면 됨 (README 참고)
const GA_ID = 'G-9KE590DBGT';            // Google Analytics 측정 ID, 예: 'G-XXXXXXXXXX' (비어 있으면 통계 끔)
const APP_STORE_URL = '';    // 출시 후 'https://apps.apple.com/app/id0000000000' (비어 있으면 "출시 준비 중")

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
  const phone = story.querySelector('[data-story-phone]');
  let current = 0;
  const update = () => {
    const r = story.getBoundingClientRect();
    const p = Math.min(Math.max(-r.top / (r.height - innerHeight), 0), 0.9999);
    const i = Math.floor(p * steps.length);
    if (i !== current) {
      [steps, shots, dots].forEach((list) => list.forEach((el, k) => el.classList.toggle('on', k === i)));
      current = i;
    }
    if (!still && phone) {
      const f = p * steps.length - i; // 이 단계 안에서 0 → 1
      phone.style.setProperty('--ry', `${-20 + f * 16}deg`);
      phone.style.setProperty('--rx', `${7 - f * 4}deg`);
    }
  };
  addEventListener('scroll', update, { passive: true });
  update();
}

// 첫 화면 아이폰: 마우스를 따라 살짝 기울어짐 (터치 기기 제외)
const hero = document.querySelector('[data-parallax]');
if (hero && !still && matchMedia('(hover: hover)').matches) {
  const phones = [...hero.querySelectorAll('.iphone')].map((el) => ({ el, ry: parseFloat(getComputedStyle(el).getPropertyValue('--ry')) || -18, rx: parseFloat(getComputedStyle(el).getPropertyValue('--rx')) || 6 }));
  addEventListener('pointermove', (e) => {
    const x = e.clientX / innerWidth - 0.5, y = e.clientY / innerHeight - 0.5;
    phones.forEach(({ el, ry, rx }) => {
      el.style.setProperty('--ry', `${ry + x * 12}deg`);
      el.style.setProperty('--rx', `${rx - y * 8}deg`);
    });
  }, { passive: true });
}
