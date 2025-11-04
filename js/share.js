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
function currentMbitSafe() {
  const mbti = (detectMBTI() || '').toUpperCase();
  return /^[EI][NS][FT][JP]$/.test(mbti) ? mbti : 'XXXX';
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

function bindShareButton() {
  const shareBtn = document.querySelector('#result #shareButton, #shareButton');
  if (!shareBtn || shareBtn.dataset.bound) return;

  // 캡처 단계에서 가장 먼저 잡는다
  shareBtn.addEventListener('click', setShare, { passive: false, capture: true });
  shareBtn.dataset.bound = '1';

  // ✅ Maze 표식은 "여기"에서 shareBtn가 있을 때만 등록
 if (isMaze()) shareBtn.addEventListener('click', setShare);
}

// (기존) 한 덩어리로 정리된 클릭 리스너
document.addEventListener(
  'click',
  (e) => {
    // 공유버튼은 여기서 무시
    if (e.target.closest('#shareButton')) return;

    // 결과영역의 태그/스토리카드 클릭만 잡기
    const el = e.target.closest(
      '#result .tag-list button, ' +
      '#result .tag-list [role="button"], ' +
      '#result .story-card button, ' +
      '#result .story-card a[href], ' +
      '#result .story-card [role="button"]'
    );
    if (!el) return;

    // 네비게이션/버블링 막기 (Maze에서만 굴리려는 목적)
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    const name =
      el.getAttribute('data-qa') ||
      (el.closest('.story-card') ? 'story' : 'tag');

    markEvent(`s-${name}-${currentMbitSafe()}`);

    // data-qa 없으면 자동 부여 (선택)
    if (!el.getAttribute('data-qa')) {
      const siblings = el.parentElement ? [...el.parentElement.children] : [];
      const idx = String(siblings.filter((s) => s.hasAttribute('data-qa')).length + 1).padStart(2, '0');
      el.setAttribute('data-qa', `tag-${idx}`);
    }

    // ★ return은 "이 함수 안"의 마지막에 두기
    return false;
  },
  { capture: true, passive: false }
); // ★ 여기서 '});'로 정확히 닫힘

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

function fixCTA() {
  const cta = document.querySelector('#recommend a, #recommend button, #go-story');
  if (!cta) return;
  if (isMaze()) {
  if (cta.tagName === 'A') {
    cta.setAttribute('href', 'javascript:void(0)');
    cta.setAttribute('role', 'button');
    cta.setAttribute('tabindex', '0');
  } else {
    cta.setAttribute('data-qa', 'go-story');
  }
}

+ // Maze 여부와 관계없이 네비게이션 완전 차단
+ if (cta.tagName === 'A') cta.setAttribute('href', 'javascript:void(0)');
+ if (!cta.getAttribute('data-qa')) cta.setAttribute('data-qa', 'go-story');
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

// 클릭만 처리: 새창/공유/복사/URL 변경 없음
async function setShare(e) {
  if (e && typeof e.preventDefault === 'function') e.preventDefault();
  if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
  if (e && typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();

  try { sessionStorage.setItem('shareClicked', '1'); } catch (_) {}

  const title = document.querySelector('.resultname')?.textContent.trim() || '';

  // (옵션) Maze 이벤트
  if (window.Maze && typeof Maze.customEvent === 'function') {
    try { Maze.customEvent('share_click', { tag: title }); } catch (_) {}
    console.log('🎯 Maze 이벤트 전송:', title);
  } else {
    console.log('✅ 공유 버튼 클릭(로컬 로그):', title);
  }

  // (옵션) 버튼 피드백
  const btn = document.getElementById('shareButton');
  if (btn) {
    const prev = btn.textContent;
    btn.textContent = '클릭 완료!';
    btn.setAttribute('aria-pressed', 'true');
    setTimeout(() => {
      btn.textContent = prev;
      btn.removeAttribute('aria-pressed');
    }, 1200);
  }
if (e && typeof e.preventDefault === 'function') e.preventDefault();
if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
return false; // 네비게이션 완전 차단
}

/** 디버그/테스트용 전역 노출 (콘솔에서 확인할 수 있게) */
window.isMaze = isMaze;
window.applyMbtiFakePath = applyMbtiFakePath;
Object.defineProperty(window, 'IS_MAZE', { get: () => isMaze() }); // 콘솔에서 IS_MAZE 입력 시 true/false
// 이미 있는 전역 노출 라인들 아래에 이어서 붙이세요.

// 강제 차단 핸들러 (인라인 onclick이 이걸 부름)
window._onShareClick = (e) => {
  if (e && typeof e.preventDefault === 'function') e.preventDefault();
  if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
  return setShare(e);
};
