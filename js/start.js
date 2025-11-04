// =========================
//  start.js (clean version)
// =========================

// 기본 엘리먼트
const main   = document.querySelector('#main');
const qna    = document.querySelector('#qna');
const result = document.querySelector('#result');

// 질문 개수와 선택 카운트(예시)
const endPoint = 12;
const select   = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

// 최종 결과 인덱스 계산
function calResult() {
  // select가 비어 있거나 이상하면 0번으로 폴백
  if (!Array.isArray(select) || select.length === 0) return 0;

  const max = Math.max(...select);
  if (!isFinite(max)) return 0;

  const idx = select.indexOf(max);
  return idx >= 0 ? idx : 0;
}
let __infoRetry = 0;
let __qnaRetry = 0;

function setResult() {
  const point = calResult();

  // data.js 로드 지연이면 잠깐 기다렸다 재시도 (최대 60회 ≒ 3초)
 if (typeof infolist === 'undefined' || !Array.isArray(infolist) || !infolist[point]) {
    if (__infoRetry++ < 60) {
      return setTimeout(setResult, 50);
    } else {
      console.error('infoList 미로딩 또는 인덱스 오류. point=', point);
      return;
    }
  }

  const resultName = document.querySelector('#resultName');
resultName.innerHTML = infolist[point].name;

  const imgDiv = document.querySelector('#resultImg');
  imgDiv.innerHTML = '';
  const img = document.createElement('img');
  img.src = 'img/image-' + point + '.png';
  img.alt = infolist[point].name || String(point);
  img.classList.add('img-fluid');
  imgDiv.appendChild(img);

 // 결과 설명 주입 직후
const resultDesc = document.querySelector('.resultDesc');
resultDesc.innerHTML = infolist[point].desc;

// ▼ 추천 스토리카드 링크들: 클릭만, 이동 금지
const links = resultDesc.querySelectorAll('a');

// 접근성/속성 정리
links.forEach((a) => {
  a.removeAttribute('target');
  a.removeAttribute('href');        // 네비게이션 자체 차단
  a.setAttribute('role', 'button'); // 스크린리더용
  a.setAttribute('tabindex', '0');  // 키보드 포커스 가능
});

// 이벤트 바인딩 (클릭 + 키보드)
links.forEach((a) => {
  const sendEvent = () => {
    const tag = (a.textContent || '').trim();
    if (window.Maze && typeof Maze.customEvent === 'function') {
      Maze.customEvent('storycard_click', { tag });
    } else {
      console.log('✅ 스토리카드 클릭(로컬 로깅):', tag);
    }
  };

  a.addEventListener(
    'click',
    (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      sendEvent();
    },
    { capture: true }
  );

  a.addEventListener(
    'keydown',
    (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopImmediatePropagation();
        sendEvent();
      }
    },
    { capture: true }
  );
}); // ← forEach는 여기서 '한 번만' 닫힘
}
// 결과 화면으로 전환
function goResult() {
  qna.style.WebkitAnimation = 'fadeOut 1s';
  qna.style.animation = 'fadeOut 1s';

  setTimeout(() => {
    result.style.WebkitAnimation = 'fadeIn 1s';
    result.style.animation = 'fadeIn 1s';

    setTimeout(() => {
      qna.style.display = 'none';
      result.style.display = 'block';
    }, 450);
  }, 450);

  window.location.hash = '#result'; // 해시
  setResult();
}

// 보기(답변) 버튼 생성
function addAnswer(answerText, qIdx, idx) {
  const wrap = document.querySelector('.answerBox');
  const btn = document.createElement('button');
  btn.classList.add('answerList', 'my-3', 'py-3', 'mx-auto', 'fadeIn');
  btn.setAttribute('data-maze', `q${qIdx}->a${idx}`);
  btn.innerHTML = answerText;

  wrap.appendChild(btn);

  btn.addEventListener('click', function () {
    const children = document.querySelectorAll('.answerList');

    // 더블클릭/중복 입력 방지
    for (let i = 0; i < children.length; i++) {
      children[i].disabled = true;
      children[i].style.WebkitAnimation = 'fadeOut 0.5s';
      children[i].style.animation = 'fadeOut 0.5s';
    }

    setTimeout(() => {
      const target = qnaList[qIdx].a[idx].type;
      ffor (let i = 0; i < target.length; i++) select[Number(target[i])] += 1;

      for (let i = 0; i < children.length; i++) children[i].style.display = 'none';

      goNext(++qIdx);
    }, 450);
  }, false);
// 다음 질문 세팅
function goNext(qIdx) {
 if (typeof qnaList === 'undefined' || !Array.isArray(qnaList) || !qnaList[qIdx]) {
    if (__qnaRetry++ < 60) { // 3초간 재시도
      return setTimeout(() => goNext(qIdx), 50);
    } else {
      console.error('qnaList 미로딩 또는 인덱스 오류. qIdx=', qIdx);
      return; // 실패
    }
  }
  // ▲▲▲ 여기까지 추가 ▲▲▲

  if (qIdx === endPoint) {
    goResult();
    return;
  }

  window.location.hash = `#q/${qIdx}`; // 각 문항 해시

  // 질문/보기 그리기
  const q = document.querySelector('.qBox');
  q.innerHTML = qnaList[qIdx].q;

  for (let i in qnaList[qIdx].a) {
    addAnswer(qnaList[qIdx].a[i].answer, qIdx, i);
  }

  // 진행 상태 바
  const status = document.querySelector('.statusBar');
  status.style.width = (100 / endPoint) * (qIdx + 1) + '%';
}

// 시작하기 클릭 시 첫 문항으로
function begin() {
  main.style.WebkitAnimation = 'fadeOut 1s';
  main.style.animation = 'fadeOut 1s';

  setTimeout(() => {
    qna.style.WebkitAnimation = 'fadeIn 1s';
    qna.style.animation = 'fadeIn 1s';

    setTimeout(() => {
      main.style.display = 'none';
      qna.style.display = 'block';
    }, 450);
  }, 450);

  // 첫 문항
  let qIdx = 0;
  window.location.hash = '#q/0';
  goNext(qIdx);
}

// 외부에서도 begin을 호출할 수 있게 노출(인라인 onclick 대비)
window.begin = begin;

// ================================
//  DOMContentLoaded 초기 바인딩
// ================================
document.addEventListener('DOMContentLoaded', () => {
  // 시작하기 버튼 바인딩 (onclick 없이도 동작)
  const startBtn = document.getElementById('startButton');
  if (startBtn && !startBtn.dataset.bound) {
    startBtn.addEventListener('click', begin);
    startBtn.dataset.bound = '1';
  }
});

// ===================================================
//  스토리카드(결과 설명 내부 a) 클릭: 새창 방지 + 추적만
//  - 동적 생성 링크까지 모두 커버 (이벤트 위임)
//  - Maze 커스텀 이벤트 (없으면 콘솔 폴백)
// ===================================================
let lastTagAt = 0; // (선택) 더블클릭 방지

// 결과 영역(스토리카드) 클릭 + 키보드(Enter/Space) 처리 – 이동 없이 이벤트만
document.addEventListener('click', e => {
  const link = e.target.closest('.resultDesc a');
  if (!link) return;

  e.preventDefault();
  e.stopImmediatePropagation();

  const tag = link.textContent.trim();
  if (window.Maze && typeof Maze.customEvent === 'function') {
    Maze.customEvent('storycard_click', { tag });
  } else {
    console.log('✅ 스토리카드 클릭(로컬 로깅):', tag);
  }
}, { capture: true });

document.addEventListener('keydown', e => {
  const link = e.target.closest('.resultDesc a');
  if (!link) return;

  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    e.stopImmediatePropagation();

    const tag = link.textContent.trim();
   if (window.Maze && typeof Maze.customEvent === 'function') {
      Maze.customEvent('storycard_click', { tag });
    } else {
      console.log('✅ 스토리카드 키보드 활성화:', tag);
    }
  } // <-- 245줄: if문 닫힘

}, { capture: true }); // <-- 246줄: 콜백 함수 닫는 '}' 추가, 쉼표(,) 뒤에 옵션 객체
