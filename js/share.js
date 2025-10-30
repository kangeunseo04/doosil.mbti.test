// 실제 서비스 도메인 (표시용, UT에서는 안 써도 무방)
const url = 'https://www.interiormbti.site/';

let __shareObserver = null;

function setShare(e) {
  if (e && e.preventDefault) e.preventDefault();
  try { sessionStorage.setItem('shareClicked', '1'); } catch (_) {}
  console.log('[UT] share button clicked');
  const ts = Date.now();
  location.hash = `#shared-${ts}`;
  const btn = document.querySelector('#result #shareButton');
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

function bindShareButton() {
  const shareBtn = document.querySelector('#result #shareButton');
  if (shareBtn && !shareBtn.dataset.bound) {
    shareBtn.addEventListener('click', setShare);
    shareBtn.dataset.bound = '1';
    if (__shareObserver) __shareObserver.disconnect();
  }
}

document.addEventListener('DOMContentLoaded', bindShareButton);
if (!__shareObserver) {
  __shareObserver = new MutationObserver(bindShareButton);
  __shareObserver.observe(document.body, { childList: true, subtree: true });
}
window.addEventListener('hashchange', bindShareButton);
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') bindShareButton();
});
