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

// 실제 서비스 도메인 (표시용, UT에서는 안 써도 무방)
const url = 'https://www.interiormbti.site/';
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
function setShare(e) {
  if (e && e.preventDefault) e.preventDefault();
  try { sessionStorage.setItem('shareClicked', '1'); } catch (_) {}

  const ts = Date.now();
  const fakePath = `${BASE}shared/${ts}`;

  try {
    // [수정] shared 경로로 이동 + 배너 ON
    window.history.pushState({ maze: 'share' }, '', fakePath);
    ensureSharedMarker(true);   // ← 여기!

    // [수정] Maze일 땐 1200ms 정도 머물렀다가 #result로 복귀
    const delay = IS_MAZE ? 1200 : 300;
    setTimeout(() => {
      const backUrl = `${BASE}#result`;
      window.history.replaceState({ maze: 'result' }, '', backUrl);
      ensureSharedMarker(false);  // 복귀 시 배너 OFF
      syncSharedMarkerWithURL();   // ← 복귀 직후 최종 상태 재확인
    }, delay);
  } catch (err) {
    console.error('[Maze] navigation failed:', err);
  }

  // (버튼 피드백 기존 로직 그대로 두면 됨)
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

// 1) 초기 DOM 로드 시도
document.addEventListener('DOMContentLoaded', bindShareButton);

// 2) 결과 섹션/버튼이 동적으로 생기는 경우 감시
if (!_shareObserver) {
  _shareObserver = new MutationObserver(bindShareButton);
  _shareObserver.observe(document.body, { childList: true, subtree: true });
}

// 3) 해시 기반 화면 전환 시도(예: #q/1 -> #result)
window.addEventListener('hashchange', bindShareButton);

// [추가 #4] 최초 진입 시 배너 상태 동기화
document.addEventListener('DOMContentLoaded', syncSharedMarkerWithURL);

// [추가 #5] 뒤로가기/앞으로가기 등 history 변화 대응
window.addEventListener('popstate', syncSharedMarkerWithURL);

// [추가 #6] 해시 변화 대응(#result 등)
window.addEventListener('hashchange', syncSharedMarkerWithURL);
document.addEventListener('visibilitychange', () => {
 if (document.visibilityState === 'visible') {
   bindShareButton();
   syncSharedMarkerWithURL();
  }
});
// [Maze 전용] 공유 버튼이 없으면 테스트용으로 주입
document.addEventListener('DOMContentLoaded', () => {
  if (!IS_MAZE) return;
  // 이미 버튼이 있으면 스킵
  if (document.getElementById('shareButton')) return; 

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


