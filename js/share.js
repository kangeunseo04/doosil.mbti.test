const url = 'https://incredible-malasada-1a045c.netlify.app/';

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
  }
}

// 초기 DOM 로드 시 한 번
document.addEventListener('DOMContentLoaded', bindShareButton);

// 페이지가 동적으로 업데이트될 경우도 감지
const observer = new MutationObserver(() => bindShareButton());
observer.observe(document.body, { childList: true, subtree: true });
