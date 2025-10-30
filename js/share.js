// 실제 서비스 도메인 (표시용, UT에서는 안 써도 무방)
const url = 'https://www.interiormbti.site/';

let __shareObserver = null;

/**
 * UT 전용 공유 버튼 핸들러
 * - 카카오 호출 없이 클릭 기록만 남기고
 * - 해시를 바꿔 Maze가 상태 변화를 인지하도록 함
 */
function setShare(e) {
  if (e && e.preventDefault) e.preventDefault();

  // 1) 클릭 기록
  try { sessionStorage.setItem('shareClicked', '1'); } catch (_) {}
  console.log('[UT] share button clicked');

  // 2) 해시 변경 (매 클릭마다 달라지게 타임스탬프 추가)
  const ts = Date.now();
  location.hash = `#shared-${ts}`;

  // 3) 시각 피드백 (선택)
  const btn = document.getElementById('shareButton');
  if (btn) {
    const prev = btn.textContent;
    btn.textContent = '공유 클릭됨 ✔';
    btn.setAttribute('aria-pressed', 'true');
    setTimeout(() => {
      btn.textContent = prev;
      btn.removeAttribute('aria-pressed');
    }, 1200);
  }
}

/**
 * 버튼에 핸들러 1회만 바인딩
 */
function bindShareButton() {
  const shareBtn = document.getElementById('shareButton');
  if (shareBtn && !shareBtn.dataset.bound) {
    shareBtn.addEventListener('click', setShare);
    shareBtn.dataset.bound = '1';
    // 바인딩 성공했으면 옵저버 중단 (불필요한 관찰 방지)
    if (__shareObserver) __shareObserver.disconnect();
  }
}

// 초기 DOM 로드 시 1회 바인딩 시도
document.addEventListener('DOMContentLoaded', bindShareButton);

// 동적 DOM 변화 대비: 버튼이 늦게 나타나도 바인딩되도록 관찰
__shareObserver = new MutationObserver(bindShareButton);
__shareObserver.observe(document.body, { childList: true, subtree: true });
