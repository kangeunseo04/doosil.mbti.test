// BASE 경로 (싱글턴)
window.__BASE = window.__BASE || (function () {
  const { hostname, pathname } = location;
  if (hostname.endsWith('github.io')) {
    const segs = pathname.split('/').filter(Boolean);
    return segs.length ? `/${segs[0]}/` : '/';
  }
  return '/';
})();

function isMaze() {
  try { return /[?&]maze=(1|true)\b/i.test(location.search); }
  catch (_){ return false; }
}

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
function buildResultURL(mbti) {
  const _m = String(mbti || '').toUpperCase();
  const BASE = window.__BASE || '/';     // 🔹 실제 BASE 사용
  // /repo-name/result-INTJ/ 형태가 되도록 끝에 / 붙이기
  return `${BASE}result-${_m}/#result`;
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
// ===== 결과 화면에서 태그/스토리카드 클릭 트래킹 =====
document.addEventListener('click', (e) => {
  // 결과 섹션이 안 보이면 무시
  const resultSection = document.getElementById('result');
  if (!resultSection || resultSection.style.display === 'none') return;

  // 공유 버튼은 여기서 처리하지 않음
  if (e.target.closest('#shareButton')) return;

  // 태그/스토리카드 안에 있는 버튼/링크만 잡기
  const el = e.target.closest(
    '#result .tag-list button,' +
    '#result .tag-list [role="button"],' +
    '#result .story-card button,' +
    '#result .story-card a[href],' +
    '#result .story-card [role="button"]'
  );
  if (!el) return;

  // Maze 히트맵을 위해 버블링은 막지 않고,
  // 실제 페이지 이동만 막고 싶으면 a 태그일 때만 막기
  if (el.tagName === 'A') {
    e.preventDefault();
  }

  // data-qa 없으면 형제 순서 기준으로 자동 부여
  if (!el.getAttribute('data-qa')) {
    const siblings = el.parentElement ? [...el.parentElement.children] : [];
    const idx = String(
      siblings.filter((s) => s.hasAttribute && s.hasAttribute('data-qa')).length + 1
    ).padStart(2, '0');
    el.setAttribute('data-qa', `tag-${idx}`);
  }

  const name =
    el.getAttribute('data-qa') ||
    (el.closest('.story-card') ? 'story' : 'tag');

  // Maze 커스텀 이벤트로 (어떤 태그/스토리, 어떤 MBTI인지) 보내기
  if (window.Maze && typeof Maze.customEvent === 'function') {
    Maze.customEvent('storycard_click', {
      tag: `${name}-${currentMbitSafe()}`,
    });
  } else {
    console.log('✅ storycard_click:', name, currentMbitSafe());
  }
});


  // data-qa 없으면 자동 부여 (선택)
  if (!el.getAttribute('data-qa')) {
    const siblings = el.parentElement ? [...el.parentElement.children] : [];
    const idx = String(siblings.filter(s => s.hasAttribute?.('data-qa')).length + 1).padStart(2, '0');
    el.setAttribute('data-qa', `tag-${idx}`);
  }
 { capture: true, passive: false });

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

  // 👉 버튼 문구 · 상태 영구 변경
  const btn = document.getElementById('shareButton');
  if (btn) {
    btn.textContent = '공유 완료';     // 원하는 문구로 고정
    btn.disabled = true;              // 다시 못 누르게 하고 싶으면 유지, 아니면 이 줄 지워도 됨
    btn.classList.add('shared');      // 필요하면 CSS에서 .shared 스타일 줄 수 있음
    btn.setAttribute('aria-pressed', 'true');
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
 /* 
================================================================
  이 코드를 여러분의 메인 JavaScript 파일 최상단 또는
  결과 페이지가 로드될 때 실행되는 함수 내에 추가하세요.
================================================================
*/


function hideTestUIElements() {
  
  // 1. 진행률 표시줄 숨기기
  // (주의: 'progress-bar-container'는 실제 HTML의 ID로 변경해야 합니다)
  const progressBar = document.getElementById('progress-bar-container');
  if (progressBar) {
    progressBar.style.display = 'none'; // 요소를 화면에서 완전히 숨깁니다.
  }

  // 2. 마지막 질문 UI 숨기기
  // (주의: 'question-indicator'는 실제 HTML의 ID로 변경해야 합니다)
  const questionIndicator = document.getElementById('question-indicator');
  if (questionIndicator) {
    questionIndicator.style.display = 'none'; // 요소를 화면에서 완전히 숨깁니다.
  }
}


/*
================================================================
  문제 2: 공유하기 버튼 기능 활성화 함수 (Image 2)
================================================================
*/
function initializeShareButton() {
  
  // (주의: 'share-button-id'는 실제 HTML의 ID로 변경해야 합니다)
  const shareButton = document.getElementById('share-button-id');

  if (shareButton) {
    
    const shareData = {
      title: '내 라이프스타일 취향 테스트',
      text: '내 라이프스타일 MBTI 결과를 확인해보세요!',
      url: window.location.href // 현재 페이지 URL을 공유합니다.
    };
  }
}
