// BASE 경로 (싱글턴)
window.__BASE = window.__BASE || (function () {
  const { hostname, pathname } = location;
  if (hostname.endsWith('github.io')) {
    const segs = pathname.split('/').filter(Boolean);
    return segs.length ? `/${segs[0]}/` : '/';
  }
  return '/';
})();
const BASE = window.__BASE;

function isMaze() {
  try { return /[?&]maze=(1|true)\b/i.test(location.search); }
  catch (_){ return false; }
}

// MBTI 안전 추출
function detectMBTI() {
  const el = document.getElementById('result');
  let byAttr = '';
  if (el && typeof el.getAttribute === 'function') {
    byAttr = el.getAttribute('data-mbti') || '';
  }
  if (byAttr && /^[EI][NS][FT][JP]$/i.test(byAttr)) return byAttr.toUpperCase();

  const txtEl = document.querySelector('#result .mbti-type, .mbti-type');
  const txt = (txtEl ? txtEl.textContent.trim() : '').toUpperCase();
  if (/^[EI][NS][FT][JP]$/.test(txt)) return txt;

  const fromWin = (window.__MBTI || '').toUpperCase();
  if (/^[EI][NS][FT][JP]$/.test(fromWin)) return fromWin;

  const fromLS = (localStorage.getItem('mbti') || '').toUpperCase();
  if (/^[EI][NS][FT][JP]$/.test(fromLS)) return fromLS;

  return '';
}

function currentMbitSafe() {
  const mbti = (detectMBTI() || '').toUpperCase();
  return /^[EI][NS][FT][JP]$/.test(mbti) ? mbti : 'XXXX';
}

// 결과 해시 가짜 경로 적용 (/result→/result-ENFP 등)
function buildResultURL(mbti) {
  const _m = String(mbti || '').toUpperCase();
  return `${BASE}result-${_m}#result`;
}
function isMBTIFakePathApplied() {
  return /\/result-[A-Z]{4}\//i.test(location.pathname);
}
function applyMbtIFakePath() {
  if (!isMaze()) return;            // Maze 아닐 땐 원본 유지
  if (location.hash !== '#result') return;
  const mbti = detectMBTI();
  if (!mbti || isMBTIFakePathApplied()) return;
  history.replaceState({}, '', buildResultURL(mbti));
}

// 공유 완료 배지(접근성 배려)
function ensureSharedMarker(show) {
  let el = document.getElementById('mazeSharedBanner');
  if (!el) {
    el = document.createElement('div');
    el.id = 'mazeSharedBanner';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    el.style.cssText = [
      'position:fixed','left:50%','bottom:16px','transform:translateX(-50%)',
      'z-index:9999','padding:10px 14px','border-radius:12px',
      'box-shadow:0 6px 18px rgba(0,0,0,.18)','background:#111','color:#fff',
      'font-weight:700','font-size:14px','letter-spacing:.2px'
    ].join(';');
    el.textContent = '🔗 링크 복사됨 · 공유 확인';
    document.body.appendChild(el);
  }
  el.style.display = show ? 'block' : 'none';
}

function syncSharedMarkerWithURL() {
  const onShared = /\/shared\/\d+/.test(location.pathname);
  ensureSharedMarker(onShared);
}

// 공유 버튼 및 결과영역 클릭/키보드 트래킹
let _shareObserver = null;

function bindShareButton() {
  const shareBtn = document.querySelector('#result #shareButton, #shareButton');
  if (!shareBtn || shareBtn.dataset.bound) return;
  shareBtn.addEventListener('click', setShare, { passive: false, capture: true });
  shareBtn.dataset.bound = '1';
}

document.addEventListener('click', (e) => {
  if (e.target.closest('#shareButton')) return;

  const el = e.target.closest(
    '#result .tag-list button,' +
    '#result .tag-list [role="button"],' +
    '#result .story-card button,' +
    '#result .story-card a[href],' +
    '#result .story-card [role="button"]'
  );
  if (!el) return;

  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();

  const name =
    el.getAttribute('data-qa') ||
    (el.closest('.story-card') ? 'story' : 'tag');

  // 커스텀 이벤트(옵션)
  if (window.Maze && typeof Maze.customEvent === 'function') {
    Maze.customEvent('storycard_click', { tag: `${name}-${currentMbitSafe()}` });
  } else {
    console.log('✅ storycard_click:', name, currentMbitSafe());
  }

  // data-qa 없으면 자동 부여 (선택)
  if (!el.getAttribute('data-qa')) {
    const siblings = el.parentElement ? [...el.parentElement.children] : [];
    const idx = String(siblings.filter(s => s.hasAttribute?.('data-qa')).length + 1).padStart(2, '0');
    el.setAttribute('data-qa', `tag-${idx}`);
  }
}, { capture: true, passive: false });

// 해시/히스토리/가시성 변경에 따른 바인딩 & 배지 동기화
window.addEventListener('hashchange', () => { bindShareButton(); syncSharedMarkerWithURL(); });
window.addEventListener('popstate',   () => { bindShareButton(); syncSharedMarkerWithURL(); });
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    bindShareButton();
    syncSharedMarkerWithURL();
  }
});

// 추천 CTA 링크 정리 (Maze일 때 네비게이션 차단)
function fixCTA() {
  const cta = document.querySelector('#recommend a, #recommend button, #go-story');
  if (!cta) return;
  if (isMaze()) {
    if (cta.tagName === 'A') cta.setAttribute('href', 'javascript:void(0)');
    if (!cta.getAttribute('data-qa')) cta.setAttribute('data-qa', 'go-story');
  } else {
    if (cta.tagName === 'A') cta.setAttribute('href', '#result');
    if (!cta.getAttribute('data-qa')) cta.setAttribute('data-qa', 'go-story');
  }
}
document.addEventListener('DOMContentLoaded', () => {
  bindShareButton();
  syncSharedMarkerWithURL();
  fixCTA();

  // 동적 생성 감지용 옵저버
  _shareObserver = new MutationObserver(() => bindShareButton());
  _shareObserver.observe(document.body, { childList: true, subtree: true });
});

// 간단 로그용 (옵션)
function markEvent(name, stayMs = 1500) {
  try {
    const back = location.href;
    const ts = Date.now();
    const cleanPath = location.pathname.replace(/[^\w\-\/]/g, '');
    history.pushState({ maze: 'event' }, '', `${cleanPath}/~${name}~${ts}`);
    setTimeout(() => history.replaceState({}, '', back), stayMs);
  } catch (_) {}
}

// 공유 처리
async function setShare(e) {
  if (e && typeof e.preventDefault === 'function') e.preventDefault();
  if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
  if (e && typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();

  try { sessionStorage.setItem('shareClicked', '1'); } catch (_) {}

  const title = document.querySelector('.resultname')?.textContent.trim() || '';

  // Maze 이벤트(옵션)
  if (window.Maze && typeof Maze.customEvent === 'function') {
    try { Maze.customEvent('share_click', { tag: title }); } catch (_) {}
  } else {
    console.log('✅ 공유 버튼 클릭(로컬 로깅):', title);
  }

  // 버튼 피드백
  const btn = document.getElementById('shareButton');
  if (btn) {
    const prev = btn.textContent;
    btn.textContent = '복사 완료!';
    btn.setAttribute('aria-pressed', 'true');
    setTimeout(() => {
      btn.textContent = prev;
      btn.removeAttribute('aria-pressed');
    }, 1200);
  }

  return false; // 네비게이션 완전 차단
}

// 테스트용 노출(콘솔에서 확인 가능)
window.isMaze = isMaze;
window.applyMbtIFakePath = applyMbtIFakePath;
Object.defineProperty(window, 'IS_MAZE', { get: () => isMaze() });

// 기존 onShareClick(인라인 onclick) 이탈 방지 → 여기로 집결
window.__onShareClick = (e) => {
  try {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
    if (e && typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
  } catch (_) {}
  return setShare(e);
};
