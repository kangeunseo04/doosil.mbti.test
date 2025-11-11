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

  // 결과영역 내 모든 링크 가져오기
  const links = resultDesc.querySelectorAll('a');

  // Maze 이벤트 전송용 헬퍼
  const sendEvent = (a) => {
    const tag = (a.textContent || '').trim();
    if (window.Maze && typeof Maze.customEvent === 'function') {
      Maze.customEvent('storycard_click', { tag });
    } else {
      console.log('✅ 스토리카드 클릭(로컬 로깅):', tag);
    }
  };

  // 링크를 버튼처럼 동작시키고 네비게이션 차단
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
}

// 결과 화면으로 전환
function goResult() {
  qna.style.webkitAnimation = 'fadeOut 1s';
  qna.style.animation      = 'fadeOut 1s';

  setTimeout(() => {
    result.style.webkitAnimation = 'fadeIn 1s';
    result.style.animation       = 'fadeIn 1s';
  }, 450);

  setTimeout(() => {
    main.style.display  = 'none';
    result.style.display = 'block';
  }, 450);

  window.location.hash = '#result';
  setResult();
}

// 보기(답변) 버튼 생성
function addAnswer(answerText, qIdx, idx) {
  const wrap = document.querySelector('.answerBox');
  const btn  = document.createElement('button');
  btn.classList.add('answerList', 'my-3', 'py-3', 'mx-auto', 'fadeIn');
  btn.setAttribute('data-maze', `q${qIdx}->a${idx}`);
  btn.textContent = answerText;
  wrap.appendChild(btn);

  btn.addEventListener('click', function () {
    const children = document.querySelectorAll('.answerList');

    for (let i = 0; i < children.length; i++) {
      children[i].disabled = true;
      children[i].style.webkitAnimation = 'fadeOut 0.5s';
      children[i].style.animation       = 'fadeOut 0.5s';
    }

    setTimeout(() => {
      const target = qnaList[qIdx].a[idx].type;
      for (let i = 0; i < target.length; i++) select[Number(target[i])] += 1;
      for (let i = 0; i < children.length; i++) children[i].style.display = 'none';
      goNext(qIdx + 1);
    }, 450);
  });
}

// 다음 질문
function goNext(qIdx) {
  if (qIdx === endPoint) {
    goResult();
    return;
  }

  if (typeof qnaList === 'undefined' || !Array.isArray(qnaList) || !qnaList[qIdx]) {
    if (__qnaRetry++ < 60) return setTimeout(() => goNext(qIdx), 50);
    console.error('qnaList 미로드 또는 인덱스 오류, qIdx=', qIdx);
    return;
  }

  window.location.hash = `#q/${qIdx}`;

  // 질문/보기를 그림
  const q = document.querySelector('.qBox');
  q.innerHTML = qnaList[qIdx].q;

  for (let i = 0; i < qnaList[qIdx].a.length; i++) {
    addAnswer(qnaList[qIdx].a[i].answer, qIdx, i);
  }

  // 진행 상태 바
  const status = document.querySelector('.statusBar');
  if (status) status.style.width = (100 / endPoint) * (qIdx + 1) + '%';
}

// 시작하기 눌렀을 때 첫 화면으로
function begin() {
  main.style.webkitAnimation = 'fadeOut 1s';
  main.style.animation       = 'fadeOut 1s';

  setTimeout(() => {
    qna.style.webkitAnimation = 'fadeIn 1s';
    qna.style.animation       = 'fadeIn 1s';
  }, 450);

  setTimeout(() => {
    main.style.display = 'none';
    qna.style.display  = 'block';
  }, 450);

  window.location.hash = '#q/0';
  goNext(0);
}

// 외부에서도 begin() 호출 가능하게 노출
window.begin = begin;

// DOMContentLoaded 초기 바인딩
document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('startButton');
  if (startBtn && !startBtn.dataset.bound) {
    startBtn.addEventListener('click', begin);
    startBtn.dataset.bound = '1';
  }
}); 
