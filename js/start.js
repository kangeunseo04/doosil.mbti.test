// =========================
//  start.js (clean version)
// =========================

// 기본 엘리먼트
const main   = document.querySelector('#main');
const qna    = document.querySelector('#qna');
const result = document.querySelector('#result');

// 질문 개수와 선택 카운트(예시)
const endPoint = 12;
const select = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

// 선택값으로 결과 index 계산
function calResult() {
  if (!Array.isArray(select) || select.length === 0) return 0;
  const max = Math.max(...select);
  if (!isFinite(max)) return 0;
  const idx = select.indexOf(max);
  return idx >= 0 ? idx : 0;
}

// ===== 결과 그리기 =====
let __infoRetry = 0;   // 이미 네 파일 상단에 있다면 중복 선언 X
let __qnaRetry  = 0;

function setResult() {
  // 1) infoList 확보 (대소문자 혼용 방지)
  const list = window.infoList || window.infolist;
  // 2) 로딩 대기 & 인덱스 유효성 체크
  if (!Array.isArray(list) || !Number.isInteger(point) || point < 0 || point >= list.length) {
    if (__infoRetry++ < 60) return setTimeout(setResult, 50);
    console.error('infoList 미로딩 또는 인덱스 오류. point=', point, 'len=', list && list.length);
    return;
  }

  const item = list[point];

  // 3) 결과 타이틀
  const resultNameEl =
    document.querySelector('.resultname') ||
    document.querySelector('#resultName');
  if (resultNameEl) resultNameEl.textContent = item.name || '';

  // 4) 결과 이미지
  const imgDiv = document.querySelector('#resultImg');
  if (imgDiv) {
    imgDiv.replaceChildren();
    const img = new Image();
    // ★ 파일명/경로 확인: /img/image-0.png 형식으로 맞추거나 item.img가 있으면 그걸 사용
    img.src = item.img ? item.img : `img/image-0.png`;
    img.alt = item.name || String(point);
    img.className = 'img-fluid';
    img.addEventListener('error', () => {
      console.error('이미지 로드 실패. 경로 확인:', img.src);
    });
    imgDiv.appendChild(img);
  }

  // 5) 결과 설명 + 내부 링크 무력화(클릭만 추적)
  const resultDesc = document.querySelector('.resultDesc');
  if (resultDesc) {
    resultDesc.innerHTML = item.desc || '';

    const links = resultDesc.querySelectorAll('a');
    links.forEach((a) => {
      a.removeAttribute('target');
      a.removeAttribute('href');
      a.setAttribute('role', 'button');
      a.setAttribute('tabindex', '0');
    });

    // 결과영역 내 링크: 클릭/키보드(Enter/Space) → 네비게이션 차단 + Maze 이벤트(옵션)
    const sendEvent = (a) => {
      const tag = (a.textContent || '').trim();
      if (window.Maze && typeof Maze.customEvent === 'function') {
        Maze.customEvent('storycard_click', { tag });
      } else {
        console.log('✅ 스토리카드 클릭(로컬 로깅):', tag);
      }
    };

    resultDesc.addEventListener(
      'click',
      (e) => {
        const a = e.target.closest('.resultDesc a');
        if (!a) return;
        e.preventDefault();
        e.stopImmediatePropagation();
        sendEvent(a);
      },
      { capture: true }
    );

    resultDesc.addEventListener(
      'keydown',
      (e) => {
        const a = e.target.closest('.resultDesc a');
        if (!a) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopImmediatePropagation();
          sendEvent(a);
        }
      },
      { capture: true }
    );
  }
}

// 결과 화면으로 전환
function goResult() {
  qna.style.webkitAnimation = 'fadeOut 1s';
  qna.style.animation = 'fadeOut 1s';
  setTimeout(() => {
    result.style.webkitAnimation = 'fadeIn 1s';
    result.style.animation = 'fadeIn 1s';
    setTimeout(() => {
      qna.style.display = 'none';
      result.style.display = 'block';
    }, 450);
  }, 450);
  window.location.hash = '#result';
  setResult();
}

// 보기(답변) 버튼 생성
function addAnswer(answerText, qIdx, idx) {
  const wrap = document.querySelector('.answerBox');
  const btn = document.createElement('button');
  btn.classList.add('answerList', 'my-3', 'py-3', 'mx-auto', 'fadeIn');
  btn.setAttribute('data-maze', `q${String(qIdx).padStart(2,'0')}->a${idx}`);
  btn.textContent = answerText;
  wrap.appendChild(btn);

  btn.addEventListener('click', function () {
    const children = document.querySelectorAll('.answerList');
    for (let i = 0; i < children.length; i++) children[i].disabled = true;
    for (let i = 0; i < children.length; i++) {
      children[i].style.webkitAnimation = 'fadeOut 0.5s';
      children[i].style.animation = 'fadeOut 0.5s';
    }
    setTimeout(() => {
      const target = qnaList[qIdx].a[idx].type; // 예: [0,1,0,0] 이런 배열
      for (let i = 0; i < target.length; i++) select[i] += Number(target[i]) || 0;
      for (let i = 0; i < children.length; i++) children[i].style.display = 'none';
      goNext(++qIdx);
    }, 450);
  }, false);
}

// 다음 질문 세팅
function goNext(qIdx) {
  if (qIdx === endPoint) { goResult(); return; }

  // qnaList가 아직 로딩 안 됐으면 기다렸다가 재시도
  if (typeof qnaList === 'undefined' || !Array.isArray(qnaList) || !qnaList[qIdx]) {
    if (++__qnaRetry < 60) return setTimeout(() => goNext(qIdx), 50);
    console.error('qnaList 미로딩 또는 인덱스 오류. qIdx=', qIdx);
    return;
  }

  window.location.hash = `#q/${qIdx}`;

  // 질문/보기 그리기
  const q = document.querySelector('.qBox');
  q.innerHTML = qnaList[qIdx].q;
  const wrap = document.querySelector('.answerBox');
  wrap.innerHTML = '';
  for (let i in qnaList[qIdx].a) addAnswer(qnaList[qIdx].a[i].answer, qIdx, i);

  // 진행 상태 바
  const status = document.querySelector('.statusBar');
  status.style.width = (100 / endPoint) * (qIdx + 1) + '%';
}

// 진입: 시작하기 버튼 → Q&A로
function begin() {
  main.style.webkitAnimation = 'fadeOut 1s';
  main.style.animation = 'fadeOut 1s';
  setTimeout(() => {
    qna.style.webkitAnimation = 'fadeIn 1s';
    qna.style.animation = 'fadeIn 1s';
    setTimeout(() => {
      main.style.display = 'none';
      qna.style.display = 'block';
    }, 450);
  }, 450);

  let qIdx = 0;
  window.location.hash = '#q/0';
  goNext(qIdx);
}

// 초기 바인딩
document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('startButton');
  if (startBtn && !startBtn.dataset.bound) {
    startBtn.addEventListener('click', begin);
    startBtn.dataset.bound = '1';
  }
});

// 결과 영역(스토리카드) 클릭 + 키보드(Enter/Space) 처리 — 이동 없이 이벤트만
document.addEventListener('click', (e) => {
  const link = e.target.closest('.resultDesc a');
  if (!link) return;
  e.preventDefault(); e.stopImmediatePropagation();
}, { capture: true });

document.addEventListener('keydown', (e) => {
  const link = e.target.closest('.resultDesc a');
  if (!link) return;
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault(); e.stopImmediatePropagation();
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
