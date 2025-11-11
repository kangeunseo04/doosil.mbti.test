const main   = document.querySelector('#main');
const qna    = document.querySelector('#qna');
const result = document.querySelector('#result');

// 질문 개수와 선택 카운트(예시)
const endPoint = 12; // 질문 수에 맞게 조정
const select = new Array(16).fill(0);

// 선택값으로 결과 index 계산
function calResult() {
  if (!Array.isArray(select) || select.length === 0) return 0;
  const max = Math.max(...select);
  if (!isFinite(max)) return 0;
  const idx = select.indexOf(max);
  return idx >= 0 ? idx : 0;
}

// 결과 그리기
let __infoRetry = 0;
let __qnaRetry  = 0;

function setResult() {
  // 1) 결과 index
  let point = calResult();

  // 2) infoList 확인
  const list = window.infoList || window.infolist;
  console.log('infoList loaded?', Array.isArray(list), 'len', Array.isArray(list) ? list.length : 'N/A');

  // 3) infoList 없으면 대기 (최대 3초 정도 대기)
  if (!Array.isArray(list) || !list.length) {
    if (__infoRetry++ < 60) return setTimeout(setResult, 50);
    console.error('infoList 미로드 또는 인덱스 오류. point=', point, {
      listType: typeof list,
      listLen: Array.isArray(list) ? list.length : 'N/A'
    });
    return;
  }

  // 4) point 범위 보정
  if (point < 0 || point >= list.length) point = 0;

  // 5) 타이틀
  const resultNameEl =
    document.querySelector('.resultname') ||
    document.querySelector('#resultName');
  if (resultNameEl) resultNameEl.textContent = list[point].name || '';

  // 6) 결과 이미지
  const imgDiv = document.querySelector('#resultImg');
  if (imgDiv) {
    imgDiv.innerHTML = '';
    const img = document.createElement('img');
    img.src = `img/image-${point}.png`;
    img.alt = list[point].name || String(point);
    img.classList.add('img-fluid');
    img.addEventListener('error', () => {
      console.warn('이미지 로드 실패:', img.src);
    });
    imgDiv.appendChild(img);
  }
  
 // 3) 설명 + 내부 링크 제어
const resultDesc = document.querySelector('.resultDesc');
if (resultDesc) {
  resultDesc.innerHTML = list[point].desc || '';

  const links = resultDesc.querySelectorAll('a');
  const sendEvent = (a) => {
    const tag = (a.textContent || '').trim();
    if (window.Maze && typeof Maze.customEvent === 'function') {
      Maze.customEvent('storycard_click', { tag });
    } else {
      console.log('✔️ 스토리카드 클릭:', tag);
    }
  };

  links.forEach((a) => {
    a.removeAttribute('target');
    a.removeAttribute('href');
    a.setAttribute('role', 'button');
    a.setAttribute('tabindex', '0');

    a.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      sendEvent(a);
    }, { capture: true });

    a.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopImmediatePropagation();
        sendEvent(a);
      }
    }, { capture: true });
  });
} // ←←← 이 중괄호가 반드시 필요!

// 4) 결과 화면으로 전환
function goResult() { /* ... 그대로 ... */ }

// 보기(답변) 버튼 생성
function addAnswer(answerText, qIdx, idx) { /* ... 그대로 ... */ }

// 다음 질문
function goNext(qIdx) { /* ... 그대로 ... */ }

// 시작하기
function begin() { /* ... 그대로 ... */ }
window.begin = begin;

// DOMContentLoaded 초기 바인딩
document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('startButton');
  if (startBtn && !startBtn.dataset.bound) {
    startBtn.addEventListener('click', begin);
    startBtn.dataset.bound = '1';
  }
}); // ←←← 마지막은 꼭 }); 로 끝나야 함


// 3. 파일 맨 마지막에 있던 불필요한 } 들을 모두 제거했습니다.
