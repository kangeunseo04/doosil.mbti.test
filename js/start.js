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

// start.js (emergency safe)
(function(){
  function markEvent(name){ try{ const back=location.href; history.pushState({},'', location.pathname + '?evt='+encodeURIComponent(name)); setTimeout(()=>history.replaceState({},'',back),600); }catch(e){} }
  window.__onShareClick = function(e){ e&&e.preventDefault&&e.preventDefault(); markEvent('share_click'); return false; };
  document.addEventListener('click', function(e){
    const a = e.target.closest('#result a, #result button, .resultDesc a, .resultDesc button');
    if(a){ e.preventDefault(); e.stopImmediatePropagation(); markEvent('result_click'); }
  }, true);
})();

// ========== 결과 화면에서 링크/버튼 네비게이션 차단 & 로깅 ==========
function wireResultClicks() {
  // 결과 설명 안의 링크/버튼
  const resultDesc = document.querySelector('.resultDesc');
  if (resultDesc) {
    const links = resultDesc.querySelectorAll('a,button');
    const send = (el) => {
      const tag = (el.textContent || el.getAttribute('aria-label') || el.getAttribute('href') || '').trim();
      if (window.Maze && typeof Maze.customEvent === 'function') {
        Maze.customEvent('storycard_click', { tag });
      } else {
        console.log('✅ story/desc click:', tag);
      }
      markEvent(tag || 'story_item');
    };
    links.forEach((el) => {
      // 실제 이동 막기
      el.removeAttribute && el.removeAttribute('target');
      el.addEventListener('click', (e) => {
        e.preventDefault(); e.stopImmediatePropagation();
        send(el);
      }, { capture: true });
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault(); e.stopImmediatePropagation();
          send(el);
        }
      }, { capture: true });
    });
  }

  // 태그 리스트(버튼들) 전역 캡처
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('#result .tag-list button, #result .story-card a, #result .story-card button');
    if (!btn) return;
    e.preventDefault(); e.stopImmediatePropagation();
    const tag = (btn.getAttribute('data-qa') || btn.textContent || '').trim();
    if (window.Maze && typeof Maze.customEvent === 'function') {
      Maze.customEvent('tag_click', { tag });
    } else {
      console.log('✅ tag click:', tag);
    }
    markEvent(tag || 'tag_item');
  }, true);
}
// ========== 시작 버튼 바인딩 & 해시 복구 ==========
function bindStartButton() {
  const startBtn = document.getElementById('startButton');
  // '응급 코드'가 남긴 꼬리표(dataset.bound)가 없으면,
  // 진짜 begin 함수를 연결합니다.
  if (startBtn && !startBtn.dataset.bound) {
    startBtn.addEventListener('click', begin);
    startBtn.dataset.bound = '1';
  }
}

// ========== 공유 버튼 핸들러 (페이지 이동 없이 기록만) ==========
// (이것도 지워졌길래 같이 넣습니다)
window.__onShareClick = (ev) => {
  if (ev && typeof ev.preventDefault === 'function') ev.preventDefault();
  if (ev && typeof ev.stopPropagation === 'function') ev.stopPropagation();

  const title = document.querySelector('.resultname')?.textContent?.trim() || '';
  try {
    sessionStorage.setItem('shareClicked', '1');
  } catch (_) {}

  if (window.Maze && typeof Maze.customEvent === 'function') {
    try { Maze.customEvent('share_click', { tag: title }); } catch (_) {}
  } else {
    console.log('✅ 공유 클릭(로컬 로그):', title);
  }

  // 이동 없이 히스토리만 찍고 복구
  // (markEvent 함수가 없어서 이 부분은 주석 처리합니다.
  //  만약 markEvent가 필요하면 '응급 코드' 섹션에서 가져와야 합니다.)
  // markEvent('share_click'); 
  return false; // inline onclick 에서도 이동 차단
};


// ========== 페이지 로드 완료 시 실행 ==========
document.addEventListener('DOMContentLoaded', () => {
  bindStartButton(); // <--- '시작하기' 버튼 연결
  wireResultClicks(); // <--- 결과 페이지 버튼들 연결
});

// ========== 디버깅용 fetch (이것도 지워졌길래 넣습니다) ==========
fetch('js/start.js?v=' + Date.now(), {cache:'no-store'})
  .then(r=>r.text())
  .then(t => {
    console.log('---LAST 300 CHARS---\n' + t.slice(-300));
    let s=[], ln=1;
    for (const ch of t){ if(ch==='\n') ln++; if('{[('.includes(ch)) s.push({ch,ln}); if('}])'.includes(ch)) s.pop(); }
    console.log('미닫힘 남은 개수:', s.length, s);
  });
