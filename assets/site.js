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
