const url = 'https://incredible-malasada-1a045c.netlify.app/';

function setShare(){
  var resultImg = document.querySelector('#resultImg');
  var resultAlt = resultImg.firstElementChild.alt;
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
// ✅ 결과 화면의 "공유하기" 버튼 한 번만 바인딩
document.addEventListener('DOMContentLoaded', function () {
  const shareBtn = document.getElementById('shareButton');
  if (shareBtn && !shareBtn.dataset.bound) {
    shareBtn.addEventListener('click', setShare);
    shareBtn.dataset.bound = '1'; // 중복 방지 플래그
  }
});
