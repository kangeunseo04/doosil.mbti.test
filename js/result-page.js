// js/result-page.js
(function () {
  // URL에서 ?idx=숫자 꺼내기
  function getIndexFromURL() {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get('idx');
    const n = parseInt(raw, 10);
    if (!Number.isFinite(n) || n < 0) return 0;
    return n;
  }

  document.addEventListener('DOMContentLoaded', () => {
    const idx = getIndexFromURL();

    // 원래 start.js 에서 정의한 calResult 대신,
    // 결과 페이지에서는 URL의 idx를 그대로 반환하도록 덮어쓴다.
    window.calResult = function () {
      return idx;
    };

    // data.js + start.js 가 로드된 뒤라면 setResult 를 호출할 수 있다.
    if (typeof window.setResult === 'function') {
      window.setResult();
    } else {
      console.error('setResult 함수가 없습니다. start.js 로드 순서를 확인하세요.');
    }

    // Maze 에서 결과 페이지 URL을 /result-INTJ/ 처럼 보이게 하고 싶다면
    if (window.applyMbtIFakePath) {
      try {
        window.applyMbtIFakePath();
      } catch (e) {
        console.warn('applyMbtIFakePath 실패:', e);
      }
    }
  });
})();
