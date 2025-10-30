const url = 'https://www.interiormbti.site/'; // (유지 가능)
let __shareObserver = null;
// ✅ UT 전용 클릭 처리: 클릭 기록 + 해시 변경
function setShare(e) {
  if (e && e.preventDefault) e.preventDefault();

  try { sessionStorage.setItem('shareClicked', '1'); } catch (_) {}
  console.log('[UT] share button clicked');

  const ts = Date.now();
  location.hash = `#shared-${ts}`; // Maze가 상태변화로 잡기 쉬움

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

// ✅ 버튼 한 번만 바인딩
function bindShareButton() {
  const shareBtn = document.getElementById('shareButton');
  if (shareBtn && !shareBtn.dataset.bound) {
    shareBtn.addEventListener('click', setShare);
    shareBtn.dataset.bound = '1';
    if (__shareObserver) __shareObserver.disconnect(); // 바인딩 성공시 관찰 중단
  }
}
// 초기 DOM 로드 시 한 번
document.addEventListener('DOMContentLoaded', bindShareButton);

// 동적 업데이트 대비: 버튼이 DOM에 나타나면 한 번만 바인딩하고 감시 종료
__shareObserver = new MutationObserver(bindShareButton);
__shareObserver.observe(document.body, { childList: true, subtree: true });
