// 너의 실제 도메인으로 교체
const url = 'https://www.interiormbti.site/';   // ← 이걸로
// 맨 위 상단, url 아래에 한 줄 추가
let __shareObserver = null;
function setShare(){
  var resultImg = document.querySelector('#resultImg');
  if (!resultImg || !resultImg.firstElementChild) return; // ✅ 이미지 로드 안 됐으면 함수 종료
  const resultAlt = resultImg.firstElementChild.alt;
  const shareTitle = '유형테스트 결과';
  const shareDes = infoList[resultAlt].name;
  const shareImage = url + 'img/image-' + resultAlt + '.png';
  const shareURL = url + 'test_page/' + resultAlt + '_page' + '.html' ;

   Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: shareTitle,
        description: shareDes,
        imageUrl: shareImage,
        link: {
          mobileWebUrl: shareURL,
          webUrl: shareURL,
        },
      },

    buttons: [
      {
        title: '결과 확인하기',
        link: {
          mobileWebUrl: shareURL,
          webUrl: shareURL,
        }, 
      },
    ],
  });
}

// ✅ 공유 버튼 한 번만 바인딩
function bindShareButton() {
  const shareBtn = document.getElementById('shareButton');
  if (shareBtn && !shareBtn.dataset.bound) {
    shareBtn.addEventListener('click', setShare);
    shareBtn.dataset.bound = '1';

     // ✅ 바인딩 성공했으면 더 이상 감시 필요 없음
    if (__shareObserver) __shareObserver.disconnect();
  }
}

// 초기 DOM 로드 시 한 번
document.addEventListener('DOMContentLoaded', bindShareButton);

// 초기 DOM 로드 시 한 번
document.addEventListener('DOMContentLoaded', bindShareButton);

// 동적 업데이트 대비: 버튼이 DOM에 나타나면 한 번만 바인딩하고 감시 종료
__shareObserver = new MutationObserver(bindShareButton);
__shareObserver.observe(document.body, { childList: true, subtree: true });
