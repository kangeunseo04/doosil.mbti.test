const main = document.querySelector("#main"); 
const qna = document.querySelector("#qna");
const result = document.querySelector("#result");

const endPoint = 12;
const select = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

function calResult(){
  console.log(select);
  var result = select.indexOf(Math.max(...select));
  return result;
}

function setResult(){
  let point = calResult();

  const resultName = document.querySelector('.resultname');
  resultName.innerHTML = infoList[point].name;

  const imgDiv = document.querySelector('#resultImg');
  imgDiv.innerHTML = ''; // (선택) 중복 이미지 방지
  const resultImg = document.createElement('img');
  const imgURL = 'img/image-' + point + '.png';
  resultImg.src = imgURL;
  resultImg.alt = point;
  resultImg.classList.add('img-fluid');
  imgDiv.appendChild(resultImg);

  const resultDesc = document.querySelector('.resultDesc');
  resultDesc.innerHTML = infoList[point].desc; // ✅ 여기까지만 (이벤트 X)
}

function goResult(){
  qna.style.WebkitAnimation = "fadeOut 1s";
  qna.style.animation = "fadeOut 1s";
  setTimeout(() => {
    result.style.WebkitAnimation = "fadeIn 1s";
    result.style.animation = "fadeIn 1s";
    setTimeout(() => {
      qna.style.display = "none";
      result.style.display = "block"
    }, 450)})
    window.location.hash = "#result";     // ✅ 결과 도달
    setResult();
}

function addAnswer(answerText, qIdx, idx){
  var a = document.querySelector('.answerBox');
  var answer = document.createElement('button');
  answer.classList.add('answerList');
  answer.setAttribute('data-maze', `q${qIdx}-a${idx}`); // 예: q3-a1
  answer.classList.add('my-3');
  answer.classList.add('py-3');
  answer.classList.add('mx-auto');
  answer.classList.add('fadeIn');

  a.appendChild(answer);
  answer.innerHTML = answerText;
 
  answer.addEventListener("click", function(){
    var children = document.querySelectorAll('.answerList');
    for(let i = 0; i < children.length; i++){
      children[i].disabled = true;
      children[i].style.WebkitAnimation = "fadeOut 0.5s";
      children[i].style.animation = "fadeOut 0.5s";
    }
    setTimeout(() => {
      var target = qnaList[qIdx].a[idx].type;
      for(let i = 0; i < target.length; i++){
        select[target[i]] += 1;
      }

      for(let i = 0; i < children.length; i++){
        children[i].style.display = 'none';
      }
      goNext(++qIdx);
    },450)
  }, false);
}
function goNext(qIdx){
  if(qIdx === endPoint){
    goResult();
    return;
  }
  window.location.hash = `#q/${qIdx}`;    // ✅ 각 문항 진입마다 해시 변경

  var q = document.querySelector('.qBox');
  q.innerHTML = qnaList[qIdx].q;
  for(let i in qnaList[qIdx].a){
    addAnswer(qnaList[qIdx].a[i].answer, qIdx, i);
  }
  var status = document.querySelector('.statusBar');
  status.style.width = (100/endPoint) * (qIdx+1) + "%";
}
function begin(){
  main.style.WebkitAnimation = "fadeOut 1s";
  main.style.animation = "fadeOut 1s";
  setTimeout(() => {
    qna.style.WebkitAnimation = "fadeIn 1s";
    qna.style.animation = "fadeIn 1s";
    setTimeout(() => {
      main.style.display = "none";
      qna.style.display = "block";
    }, 450)
    let qIdx = 0;
    window.location.hash = "#q/0";        // ✅ 첫 문항 진입
    goNext(qIdx);
  }, 450);
} 
// ✅ 전역 등록 (onclick으로도 접근 가능하게)
window.begin = begin;

// ✅ 결과 설명(.resultDesc) 영역의 앵커 클릭을 '추적만' 하도록 전역 가로채기
document.addEventListener('click', function (e) {
  const link = e.target.closest('.resultDesc a');
  if (!link) return;                     // 링크가 아니면 아무 것도 하지 않음 (다른 버튼 정상 동작)

  e.preventDefault();                    // 새창/이동 막기
  e.stopImmediatePropagation();          // (필요시) 상위 전파 차단

  // 🔹 Maze 커스텀 이벤트 (로딩 안 된 경우 콘솔로 폴백)
  const tag = link.textContent.trim();
  if (window.Maze && typeof Maze.customEvent === 'function') {
    Maze.customEvent('storycard_click', { tag });
    console.log('🎯 Maze 이벤트 전송:', tag);
  } else {
    console.log('⚠️ Maze 미탑재 → 클릭만 로깅:', tag);
  }
}, { capture: true });


