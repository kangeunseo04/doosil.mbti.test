// =========================
//  start.js (clean version)
// =========================

// 기본 엘리먼트
const main   = document.querySelector('#main');
const qna    = document.querySelector('#qna');
const result = document.querySelector('#result');

// 질문 개수와 선택 카운트(예시)
const endPoint = 12;
const select   = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

// 최종 결과 인덱스 계산
function calResult() {
  // console.log(select);
  const idx = select.indexOf(Math.max(...select));
  return idx;
}

// 결과 화면 세팅: 이름/이미지/설명
function setResult() {
  const point = calResult();

  // 안전가드
  if (!window.infoList || !infoList[point]) {
    console.error('Invalid result point or infoList missing:', point);
    return;
  }

  // 이름
  const resultName = document.querySelector('.resultname');
  resultName.innerHTML = infoList[point].name;

  // 이미지 (중복 방지)
  const imgDiv = document.querySelector('#resultImg');
  imgDiv.innerHTML = '';
  const resultImg = document.createElement('img');
  const imgURL = 'img/image-' + point + '.png';
  resultImg.src = imgURL;
  resultImg.alt = point;
  resultImg.classList.add('img-fluid');
  imgDiv.appendChild(resultImg);

  // 설명 (여기까지만 — 이벤트 X)
  const resultDesc = document.querySelector('.resultDesc');
  resultDesc.innerHTML = infoList[point].desc;
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
      for (let i = 0; i < target.length; i++) select[target[i]] += 1;

      for (let i = 0; i < children.length; i++) children[i].style.display = 'none';

      goNext(++qIdx);
    }, 450);
  }, false);
}

// 다음 질문 세팅
function goNext(qIdx) {
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

document.addEventListener(
  'click',
  function (e) {
    const link = e.target.closest('.resultDesc a');
    if (!link) return; // 링크가 아니면 다른 버튼/링크는 그대로 동작

    e.preventDefault();              // 새창/이동 막기
    e.stopImmediatePropagation();    // 필요 시 상위 전파 차단

    const now = Date.now();
    if (now - lastTagAt < 400) return; // 0.4초 이내 중복 클릭 무시
    lastTagAt = now;

    const tag = link.textContent.trim();

    if (window.Maze && typeof Maze.customEvent === 'function') {
      // ⚠️ Maze 플랜/세팅에 따라 수집 가능 여부가 다를 수 있음
      Maze.customEvent('storycard_click', { tag });
      console.log('🎯 Maze 이벤트 전송:', tag);
    } else {
      console.log('⚠️ Maze 미탑재 → 클릭만 로깅:', tag);
    }
  },
  { capture: true }
);





