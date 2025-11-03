// js/share.js 맨 위 근처에 추가
const BASE = (() => {
  const { hostname, pathname } = location;
  if (hostname.endsWith('github.io')) {
    const segs = pathname.split('/').filter(Boolean);
  return segs.length ? `/${segs[0]}/` : '/';
  }
  return '/';
})();
// BASE 정의 바로 아래에 넣어주세요
function isMaze() {
  try {
    return /[?&]maze=(1|true)\b/i.test(location.search);
  } catch (_) {
    return false;
  }
}

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
// js/share.js  (tail clean block)
let _shareObserver = null;

/** #result 영역의 공유 버튼에 '한 번만' 리스너 바인딩 */
function bindShareButton() {
  const shareBtn = document.querySelector('#result #shareButton, #shareButton');
  if (!shareBtn || shareBtn.dataset.bound) return;

  // 캡처 단계에서 가장 먼저 잡는다
  shareBtn.addEventListener('click', setShare, { passive: false, capture: true });
  shareBtn.dataset.bound = '1';
}

  // Maze 모드에서는 클릭 이벤트 표식 남기기
  if (isMaze()) shareBtn.addEventListener('click', () => markEvent('share'));

// 🔧 여기부터 한 덩어리로 교체
document.addEventListener(
  'click',
  (e) => {
    // 공유 버튼이면 여기서는 아무 것도 하지 않고 바로 종료
    if (e.target.closest('#shareButton')) return;

    // (아래는 기존 태그/스토리카드 처리 로직)
    const el = e.target.closest(
      '#result .tag-list button, ' +
      '#result .tag-list [role="button"], ' +
      '#result .story-card button, ' +
      '#result .story-card a[href], ' +
      '#result .story-card [role="button"]'
    );
    if (!el) return;

   // ... (if (!el) return; 다음)

// Maze 모드에서만 가짜 URL 이벤트 남김 (<- 이 로직을 항상 실행하도록 조건문 제거)
// if (isMaze()) { // <-- 이 줄을 삭제 (또는 //로 주석 처리)
  e.preventDefault();
  const name =
    el.getAttribute('data-qa') ||
    (el.closest('.story-card') ? 'story' : 'tag');
  // ...
  markEvent(`s-${name}-${currentMbtiSafe()}`);
// } // <-- 이 줄을 삭제 (또는 //로 주석 처리)

    // data-qa 자동 부여 (선택)
    if (!el.getAttribute('data-qa')) {
      const siblings = el.parentElement ? [...el.parentElement.children] : [];
      const idx = String(
        siblings.filter((s) => s.hasAttribute?.('data-qa')).length + 1
      ).padStart(2, '0');
      el.setAttribute('data-qa', `tag-${idx}`);
    }
  },
  { capture: true, passive: false }
);

/** 해시/가시성/히스토리 변화에 따른 보조 동기화 */
window.addEventListener('hashchange', () => {
  bindShareButton();
  syncSharedMarkerWithURL();
});
window.addEventListener('popstate', () => {
  bindShareButton();
  syncSharedMarkerWithURL();
});
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    bindShareButton();
    syncSharedMarkerWithURL();
  }
});

/** 추천 CTA(스토리카드 브릿지 등) 내부 링크 강제 */
function fixCTA() {
// OK: recommend/스토리 CTA만
const cta = document.querySelector('#recommend a, #recommend button, #go-story');
  if (!cta) return;
  if (isMaze()) {
    if (cta.tagName === 'A') cta.setAttribute('href', '#result');
    else cta.setAttribute('href', `${location.pathname}#result`);
    if (!cta.getAttribute('data-qa')) cta.setAttribute('data-qa', 'go-story');
  }
}
document.addEventListener('DOMContentLoaded', () => {
  bindShareButton();
  syncSharedMarkerWithURL();
  fixCTA();

  // CTA href가 동적으로 바뀌는 경우 즉시 재고정
  const mo = new MutationObserver(() => fixCTA());
  mo.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['href'] });

  // 동적 생성되는 공유 버튼 감시
  _shareObserver = new MutationObserver(() => bindShareButton());
  _shareObserver.observe(document.body, { childList: true, subtree: true });
});

/** 공통 유틸: 가짜 URL 표시 (무료 플랜용 이벤트 표식) */
function markEvent(name, stayMs = 1500) {
  try {
    const back = location.href;
    const ts = Date.now();
    const cleanPath = location.pathname.replace(/[^\w-]/g, ''); // 영문/숫자/밑줄/하이픈만 남김
    history.pushState({ maze: 'event' }, '', `${cleanPath}/ev-${name}-${ts}`);
    setTimeout(() => history.replaceState({}, '', back), stayMs);
  } catch (_) {}
}

async function setShare(e) {
  if (e && typeof e.preventDefault === 'function') e.preventDefault();
  if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
  if (e && typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();

  try { sessionStorage.setItem('shareClicked', '1'); } catch (_) {}

  const ts = Date.now();
  const fakePath = `${BASE}shared/${ts}`;

  // Maze일 때만 가짜 URL 노출
  if (isMaze()) {
    window.history.pushState({ maze: 'share' }, '', fakePath);
    ensureSharedMarker(true);
  }

  try { markEvent(`share-open-${currentMbtiSafe()}`); } catch (_) {}

  // 네이티브 공유 (가능한 경우)
  if (navigator.share) {
    try {
      await navigator.share({ title: document.title, url: location.href });
      markEvent(`share-native-${currentMbtiSafe()}`);
    } catch { /* 취소해도 무시 */ }
  }

  // 복사 fallback
  try {
    await navigator.clipboard.writeText(location.href);
    markEvent(`share-copy-${currentMbtiSafe()}`);
  } catch {}

  // 원래 URL로 복귀 (Maze일 때만)
  if (isMaze()) {
    const delay = 1200;
    setTimeout(() => {
      const backUrl = buildResultURL(detectMBTI()); // /result-ENFP#result or /#result
      window.history.replaceState({ maze: 'result' }, '', backUrl);
      ensureSharedMarker(false);
      syncSharedMarkerWithURL();
    }, delay);
  }

  // 버튼 피드백 (그대로 유지)
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

/** 디버그/테스트용 전역 노출 (콘솔에서 확인할 수 있게) */
window.isMaze = isMaze;
window.applyMbtiFakePath = applyMbtiFakePath;
Object.defineProperty(window, 'IS_MAZE', { get: () => isMaze() }); // 콘솔에서 IS_MAZE 입력 시 true/false
// 이미 있는 전역 노출 라인들 아래에 이어서 붙이세요.

// 강제 차단 핸들러 (인라인 onclick이 이걸 부름)
window.__onShareClick = function (e) {
  try {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
    if (e && typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
  } catch (_) {}

  try { setShare(e); } catch (_) {}
  return false; // ★ 이게 네비게이션 완전 차단
};

