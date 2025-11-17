// share.js - MBTI 결과 공유 + Maze 트래킹 최소 구현

(function () {
  // ===== BASE 경로 계산 (GitHub Pages / 일반 도메인 공통) =====
  const { hostname, pathname } = location;
  let base = '/';
  if (hostname.endsWith('github.io')) {
    const segs = pathname.split('/').filter(Boolean);
    base = segs.length ? `/${segs[0]}/` : '/';
  }
  window.__BASE = window.__BASE || base;

  // ===== Maze 환경 여부 =====
  function isMaze() {
    try {
      return /[?&]maze=(1|true)\b/i.test(location.search);
    } catch (_) {
      return false;
    }
  }
  window.isMaze = isMaze;
  Object.defineProperty(window, 'IS_MAZE', { get: () => isMaze() });

  // ===== MBTI 추출 (DOM / URL 에서 최대한 안전하게) =====
  function detectMBTI() {
    const dom = document.querySelector('.resultname');
    if (dom && dom.textContent) {
      const t = dom.textContent.trim().toUpperCase();
      if (/^[EI][NS][FT][JP]$/.test(t)) return t;
    }
    const qs =
      (location.search.match(/[?&]mbti=([A-Za-z]{4})/) || [])[1] ||
      (location.hash.match(/([A-Za-z]{4})$/) || [])[1] ||
      '';
    const up = qs.toUpperCase();
    return /^[EI][NS][FT][JP]$/.test(up) ? up : '';
  }

  function currentMbtiSafe() {
    return detectMBTI() || 'NA';
  }

  // ===== 결과 URL을 Maze용 가짜 path로 바꾸기 (/result-INTJ/#result) =====
  function buildResultURL(mbti) {
    const _m = String(mbti || '').toUpperCase();
    const BASE = window.__BASE || '/';
    return `${BASE}result-${_m}/#result`;
  }

 function applyMbtiFakePath() {
  if (location.hash !== '#result') return;

  const mbti = detectMBTI();
  if (!mbti) return;

  const target  = buildResultURL(mbti);
  const current = location.pathname + location.search + location.hash;
  if (current === target) return;

  try {
    history.replaceState({}, '', target);
  } catch (e) {
    console.warn('applyMbtiFakePath 실패:', e);
  }
}


  // start.js 에서 쓰던 오타 버전까지 모두 지원
  function applyMbtIFakePath() {
    return applyMbtiFakePath();
  }
  window.applyMbtiFakePath = applyMbtiFakePath;
  window.applyMbtIFakePath = applyMbtIFakePath;

  // ===== Maze 이벤트 찍기용 markEvent (start.js 가 사용 중) =====
  function markEvent(name, stayMs = 1500) {
    if (!isMaze()) {
      console.log('markEvent:', name);
      return;
    }
    try {
      const back = location.href;
      const ts = Date.now();
      const cleanPath = location.pathname.replace(/[^\w\-\/]/g, '');
      history.pushState({ maze: 'event' }, '', `${cleanPath}/~${name}~${ts}`);
      setTimeout(() => history.replaceState({}, '', back), stayMs);
    } catch (e) {
      console.warn('markEvent 실패:', e);
    }
  }
  window.markEvent = markEvent;

  // ===== 공유 버튼 클릭 처리 =====
  async function setShare(e) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
    if (e && typeof e.stopImmediatePropagation === 'function')
      e.stopImmediatePropagation();

    try {
      sessionStorage.setItem('shareClicked', '1');
    } catch (_) {}

    const title =
      (document.querySelector('.resultname')?.textContent || '').trim();

    if (window.Maze && typeof window.Maze.customEvent === 'function') {
      try {
        window.Maze.customEvent('share_click', { tag: title });
      } catch (_) {}
    } else {
      console.log('share_click:', title);
    }

    // 버튼 문구/상태 변경
    const btn = document.getElementById('shareButton');
    if (btn) {
      btn.textContent = '공유 완료';
      btn.disabled = true;
      btn.classList.add('shared');
      btn.setAttribute('aria-pressed', 'true');
    }

    return false;
  }
  window.setShare = setShare;

  // HTML 에서 onClick="return window.__onShareClick && window.__onShareClick(event);"
  // 이런 식으로 부르는 경우를 위해 래핑
  window.__onShareClick = function (e) {
    return setShare(e);
  };

  // ===== 결과 화면의 태그/스토리카드 클릭 트래킹 =====
  document.addEventListener(
    'click',
    function (e) {
      const resultSection = document.getElementById('result');
      if (!resultSection || resultSection.style.display === 'none') return;

      // 공유 버튼은 여기서 제외
      if (e.target.closest('#shareButton')) return;

      const el = e.target.closest(
        '#result .tag-list button,' +
          '#result .tag-list [role="button"],' +
          '#result .story-card button,' +
          '#result .story-card a[href],' +
          '#result .story-card [role="button"]'
      );
      if (!el) return;

      // 실제 페이지 이동은 막고, 이벤트 버블링은 허용 (Maze 히트맵용)
      if (el.tagName === 'A') e.preventDefault();

      // data-qa 없으면 형제 순번 기준으로 자동 부여
      if (!el.getAttribute('data-qa')) {
        const siblings = el.parentElement
          ? Array.from(el.parentElement.children)
          : [];
        const count =
          siblings.filter(
            (s) => s.getAttribute && s.getAttribute('data-qa')
          ).length + 1;
        const idx = String(count).padStart(2, '0');
        el.setAttribute('data-qa', `tag-${idx}`);
      }

      const name =
        el.getAttribute('data-qa') ||
        (el.closest('.story-card') ? 'story' : 'tag');

      if (window.Maze && typeof window.Maze.customEvent === 'function') {
        try {
          window.Maze.customEvent('storycard_click', {
            tag: `${name}-${currentMbtiSafe()}`,
          });
        } catch (_) {}
      } else {
        console.log('storycard_click:', name, currentMbtiSafe());
      }

      // Path 용 로깅
      markEvent(name || 'tag_item');
    },
    { capture: true, passive: false }
  );

  // ===== Maze 테스트용 진행바/점 숨기기 (원하면 사용) =====
  function hideTestUIElements() {
    const progressBar = document.getElementById('progress-bar-container');
    if (progressBar) progressBar.style.display = 'none';

    const indicator = document.getElementById('question-indicator');
    if (indicator) indicator.style.display = 'none';
  }
  window.hideTestUIElements = hideTestUIElements;
})();
