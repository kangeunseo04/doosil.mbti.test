// js/share.js 맨 위 근처에 추가
const BASE = (() => {
  const { hostname, pathname } = location;
  if (hostname.endsWith('github.io')) {
    const segs = pathname.split('/').filter(Boolean);
  return segs.length ? `/${segs[0]}/` : '/';
  }
  return '/';
})();
// [추가 #1] Maze 감지 플래그 (URL에 ?maze=1 붙이면 true)
const IS_MAZE = /[?&]maze=(1|true)\b/i.test(location.search);

// ✅ MBTI 문자열 감지 (ENFP/ISTJ 등)
function detectMBTI() {
  // 1) data-mbti 우선
const el = document.getElementById('result');
var byAttr = '';
if (el && typeof el.getAttribute === 'function') {
  byAttr = el.getAttribute('data-mbti') || '';
}
if (byAttr && /^[EI][NS][FT][JP]$/i.test(byAttr)) {
  return byAttr.toUpperCase();
}

  // 2) 화면 텍스트에서 추출 (예: <span class="mbti-type">ENFP</span>)
  const txtEl = document.querySelector('#result .mbti-type, .mbti-type');
  const txt = txtEl ? txtEl.textContent.trim().toUpperCase() : '';
  if (/^[EI][NS][FT][JP]$/.test(txt)) return txt;

  // 3) 글로벌/스토리지 (있을 때)
  const fromWin = (window.__MBTI || '').toUpperCase();
  if (/^[EI][NS][FT][JP]$/.test(fromWin)) return fromWin;

  const fromLS = (localStorage.getItem('mbti') || '').toUpperCase();
  if (/^[EI][NS][FT][JP]$/.test(fromLS)) return fromLS;

  return '';
}
// ✅ MBTI별 가짜 경로 적용: /result-ENFP#result 처럼 바꿔 Maze가 화면을 구분하게 함
function applyMbtiFakePath() {
  if (!IS_MAZE) return; // ✅ Maze 아닐 땐 실행 안 함
  if (location.hash !== '#result') return;
  const mbti = detectMBTI();
  if (!mbti || isMBTIFakePathApplied()) return;
  history.replaceState({}, '', buildResultURL(mbti));
}

function isMBTIFakePathApplied() {
  // /result-ENFP 또는 /result-ENFP/ 모두 허용
  return /\/result-[A-Z]{4}\/?$/i.test(location.pathname);
}

// ✅ 현재 결과 URL을 계산 (#result 앵커 포함)
function buildResultURL(mbti) {
  const _m = String(mbti || '').toUpperCase();
  return _m ? `${BASE}result-${_m}#result` : `${BASE}#result`;
}


// [추가 #2] '공유 화면'에 들어왔는지에 따라 화면에 배너(마커)를 토글
function ensureSharedMarker(show) {
  let el = document.getElementById('mazeSharedBanner');
  if (!el) {
    el = document.createElement('div');
    el.id = 'mazeSharedBanner';
        // ✅ [추가: 접근성 속성]
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    // 인라인 스타일: 눈에 잘 띄고 스크린샷에 확실히 보이게
    el.style.cssText = [
      'position:fixed',
      'left:50%',
      'bottom:16px',
      'transform:translateX(-50%)',
      'z-index:9999',
      'padding:10px 14px',
      'border-radius:12px',
      'box-shadow:0 6px 18px rgba(0,0,0,.18)',
      'background:#111',
      'color:#fff',
      'font-weight:700',
      'font-size:14px',
      'letter-spacing:.2px'
    ].join(';');
    el.textContent = '🔗 링크 복사됨 · 공유 화면';
    document.body.appendChild(el);
  }
  el.style.display = show ? 'block' : 'none';
}

// [추가 #3] 현재 URL에 맞춰 배너 상태 동기화
function syncSharedMarkerWithURL() {
  const onShared = /\/shared\/\d+/.test(location.pathname);
  ensureSharedMarker(onShared);
}
// js/share.js

// (선택) 도메인 메모: https://www.interiormbti.site/
let _shareObserver = null;

/**
 * 공유 버튼 클릭 핸들러
 * - UT 클릭 로그
 * - Maze용 가짜 페이지 이동 (pushState)
 * - 짧은 지연 후 원래 URL로 복귀 (replaceState)
 * - 버튼 피드백 UI
 */
/**
 * #result 영역에 있는 공유 버튼에 '한 번만' 리스너 바인딩
 */
function bindShareButton() {
 const shareBtn = document.querySelector('#result #shareButton, #shareButton');
  if (shareBtn && !shareBtn.dataset.bound) {
    // preventDefault를 쓰므로 passive:false
    shareBtn.addEventListener('click', setShare, { passive: false });
    shareBtn.dataset.bound = '1';
    // console.log('[bind] share button bound');
  }
}
// [NEW] Maze 모드에서 #result 내부의 모든 클릭을 ‘현재 단계’에서 가로채어 이동을 차단
document.addEventListener('click', (e) => {
  if (!IS_MAZE) return;

  // 결과/추천 영역에서 발생한 클릭만 가로채기
  const hit = e.target.closest(
    '#result a, #result button,' +                 // 결과 영역 내 a, button
    '#result .story-card a, #result .story-card button,' +
    '#result .tag-list a, #result .tag-list button,' +
    '#recommend a, #recommend button'              // 추천 CTA 영역(섹션 id 예시)
  );
  if (!hit) return;

  // Maze에서는 절대 외부/다른 페이지로 이동시키지 않음
  // (절대링크, 상대링크 모두 차단)
  e.preventDefault();
  e.stopPropagation();

  // data-qa 라벨 추출(없으면 카드로 통일)
  const qa =
    hit.getAttribute('data-qa') ||
    (hit.closest('[data-qa]') ? hit.closest('[data-qa]').getAttribute('data-qa') : 'card');

  try { markEvent(`card-${qa}-${currentMbtiSafe()}`); } catch {}

}, { capture: true });  // ← 캡처 단계에서 가장 먼저 가로채도록 유지


  targets.forEach((el, i) => {
    if (!el.getAttribute('data-qa')) {
      el.setAttribute('data-qa', `tag-${String(i + 1).padStart(2, '0')}`);
    }
el.addEventListener('click', (e) => {
  if (IS_MAZE) {
    e.preventDefault();
    e.stopPropagation();
  }
  const name = el.getAttribute('data-qa') || 'card';
  markEvent(`card-${name}-${currentMbtiSafe()}`);
}, { passive: false });

  });
});

  const btn = document.createElement('button');
  btn.id = 'shareButton';
  btn.type = 'button';
  btn.textContent = '친구에게 공유하기(테스트)';
  btn.style.cssText = [
    'position:fixed','right:16px','bottom:80px','z-index:9999',
    'padding:12px 16px','border-radius:12px','border:none',
    'background:#111','color:#fff','font-weight:700','box-shadow:0 6px 18px rgba(0,0,0,.18)',
  ].join(';');

  document.body.appendChild(btn);
  // 기존 바인딩 로직 호출
  bindShareButton();
  // 혹시 모를 상태 동기화
  syncSharedMarkerWithURL();
});
// (선택) 스토리카드/공유 버튼에 data-qa 자동 라벨
document.addEventListener('DOMContentLoaded', () => {
  // 공유 버튼 라벨(중복 방지)
  const shareBtn = document.getElementById('shareButton');
  if (shareBtn && !shareBtn.dataset.qa) shareBtn.setAttribute('data-qa', 'btn-share');

  // 태그/스토리카드 클릭 타겟 라벨링 (button, a, role="button" 모두)
 const targets = document.querySelectorAll(
  '#result .tag-list button, ' +
  '#result .tag-list [role="button"], ' +
  **'#result .tag-list a[href],' +
  '#result .story-card button, ' +
  '#result .story-card a[href], ' +
  '#result .story-card [role="button"]'
);
document.addEventListener('DOMContentLoaded', () => {
  // 추천 CTA (스토리카드 보러가기 등)
  const cta = document.querySelector('#recommend a, #recommend button, #go-story');
  if (!cta) return;

  // Maze 모드에서는 외부로 빠지는 링크를 해시 기반 내부 링크로 강제 변경
  if (IS_MAZE) {
    cta.setAttribute('href', '#result');  // ← 여기 핵심!
  } else if (cta.tagName === 'A') {
    cta.setAttribute('href', `${location.pathname}#result`);
  }

  if (!cta.getAttribute('data-qa')) cta.setAttribute('data-qa', 'go-story');
});

  let i = 1;
  targets.forEach(el => {
    if (!el.getAttribute('data-qa')) {
      const n = String(i).padStart(2, '0');   // 01~36
    el.setAttribute('data-qa', `tag-${n}`);
      i++;
    }
  });
});
// 추천 CTA href/data-qa 강제 고정 + 변경 감시
document.addEventListener('DOMContentLoaded', () => {
  const fixCTA = () => {
    const cta = document.querySelector('#recommend a, #recommend button, #go-story');
    if (!cta) return;

    // 결과 섹션으로만 이동하게 강제(절대링크/외부링크 무력화)
    if (cta.tagName === 'A') cta.setAttribute('href', `${location.pathname}#result`);
    if (!cta.getAttribute('data-qa')) cta.setAttribute('data-qa', 'go-story');
  };

  // 최초 1회 고정
  fixCTA();

  // 이후 DOM 변경으로 href가 덮이면 즉시 재고정
  const mo = new MutationObserver(() => fixCTA());
  mo.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['href'] });
});

// 📌 0) 공통 유틸: 가짜 URL 표식 (무료 플랜용)
function markEvent(name, stayMs = 1000) {
  try {
    const back = location.href;
    const ts = Date.now();
    // 경로에서 특수문자 제거(슬래시, 영숫자, -, _만 허용)
   // (A) 슬래시만 제거
const cleanPath = location.pathname.replace(/[^\w-]/g, ''); // 영문/숫자/밑줄/하이픈만 남김
    history.pushState({ maze: 'event' }, '', `${cleanPath}/ev-${name}-${ts}`);
    setTimeout(() => history.replaceState({}, '', back), stayMs);
  } catch (_) {}
}

// MBTI 추출 (이미 있는 detectMBTI() 재사용)
function currentMbtiSafe() {
  try { return (detectMBTI() || '').toUpperCase(); } catch { return ''; }
}

// Maze 모드 여부
function isMaze() {
  return /[?&]maze=1\b/i.test(location.search);
}

// 공유 버튼 핸들러 내부(setShare) 가장 처음: 클릭 열기
try { markEvent(`share-open-${currentMbtiSafe()}`); } catch (_e) {}

async function setShare(e) {
  if (e && e.preventDefault) e.preventDefault();
  try { sessionStorage.setItem('shareClicked', '1'); } catch (_e) {}

  const ts = Date.now();
  const fakePath = `${BASE}shared/${ts}`;

  try {
    // 1) 경로를 임시로 /shared/<ts> 로 바꿔서 Maze가 클릭을 감지하게
    window.history.pushState({ maze: 'share' }, '', fakePath);
    ensureSharedMarker(true); // 배너 ON

    // 2) (선택) 공유 UI 열기 시점 로깅
    try { markEvent(`share-open-${currentMbtiSafe()}`); } catch (_e) {}

    // 3) 네이티브 공유 시도 로깅
    if (navigator.share) {
      navigator.share({ title: document.title, url: location.href })
        .then(() => markEvent(`share-native-${currentMbtiSafe()}`))
        .catch(() => {/* 취소는 로깅 안 함 */});
    }

    // 4) 복사 성공 로깅 (클립보드 권한 허용 시)
    try {
      await navigator.clipboard.writeText(location.href);
      markEvent(`share-copy-${currentMbtiSafe()}`);
    } catch {}

    // 5) Maze가 화면 스냅샷/체크할 시간을 조금 준 뒤 원래 해시로 복귀
  const delay = IS_MAZE ? 1200 : 300;
setTimeout(() => {
  const backUrl = buildResultURL(detectMBTI()); // /result-ENFP#result 또는 /#result
  window.history.replaceState({ maze: 'result' }, '', backUrl);
  ensureSharedMarker(false);    // 배너 OFF
  syncSharedMarkerWithURL();    // 상태 재확인
}, delay);


  // (선택) 버튼 피드백 UI 유지
  const btn = document.getElementById('shareButton');
  if (btn) {
    const prev = btn.textContent;
    btn.textContent = '공유 완료!';
    btn.setAttribute('aria-pressed', 'true');
    setTimeout(() => {
      btn.textContent = prev;
      btn.removeAttribute('aria-pressed');
    }, 1200);
  }
}
