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

  // 1) 클릭 로그
  try {
    sessionStorage.setItem('shareClicked', '1');
    console.log('[UT] share button clicked');
  } catch (_) {}

  // 2) Maze가 "새 페이지 방문"으로 인식하도록 URL 변경
  const ts = Date.now();
  const fakePath = '/shared/' + ts;

  try {
    window.history.pushState({ maze: 'share' }, '', fakePath);
    console.log('[Maze Trick] navigated to', fakePath);

    // 2-1) 짧게 기다렸다가 결과 페이지 해시로 복귀
    setTimeout(() => {
      const backUrl = '/#result';
      window.history.replaceState({ maze: 'result' }, '', backUrl);
      console.log('[Maze Trick] back to', backUrl);
    }, 300);
  } catch (err) {
    console.error('Maze navigation trick failed', err);
  }

  // 3) 버튼 피드백 (문구 잠깐 바꾸기)
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
  const shareBtn = document.querySelector('#result #shareButton');
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

// 4) 탭이 다시 활성화될 때도 보강
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') bindShareButton();
});
