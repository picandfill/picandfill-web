# 픽앤필 소개 웹사이트

https://picandfill.taegabi.com · GitHub Pages (main 브랜치 맨 위 폴더)

## 파일
- `index.html` 소개 · `privacy.html` 개인정보처리방침(초안) · `terms.html` 이용약관(초안) · `404.html`
- `assets/site.css` 모양 · `assets/site.js` 방문 통계·클릭 세기·움직임 · `assets/og.png` 공유 미리보기 그림(1200×630)
- `robots.txt` · `sitemap.xml`: 페이지를 더하면 sitemap에도 한 줄 더하기
- `CNAME`: 내 도메인 (GitHub → Settings → Pages → Custom domain에서 넣으면 자동 생성)

## 채울 곳
- `assets/site.js` 맨 위 `GA_ID`: Google Analytics 측정 ID (G-로 시작)
- `assets/site.js` 맨 위 `APP_STORE_URL`: 출시 후 App Store 주소 (비어 있으면 버튼이 "아이폰 출시 준비 중")
- `index.html` 머리의 `google-site-verification`, `naver-site-verification`: 검색 소유 확인 값 (주석을 풀고 넣기)
- `privacy.html`, `terms.html`의 [ ] 칸: 운영자 이름, 문의 이메일, 시행일 → 검토 후 노란 "초안" 상자 지우기

## 클릭 세기
버튼·링크에 `data-track="이름"`을 붙이면 Google Analytics에 `click_cta` 이벤트로 남아요 (보고서 → 참여도 → 이벤트, 매개변수 cta).

## 미리 보기
`python3 -m http.server 8000` → http://localhost:8000
