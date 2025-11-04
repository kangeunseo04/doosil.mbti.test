/*
'isfp',0 
'isfj',1 
'istp',2 
'istj',3 
'infp',4 
'infj',5 
'intp',6 
'intj',7 
'esfp',8 
'esfj',9 
'estp',10
'estj',11
'enfp',12
'enfj',13
'entp',14
'entj',15
*/

const qnaList = [
  //질문그룹_01  
    {
      //E_I 구분질문_01
      q: '오랜만에 술이 먹고 싶을 때, 나는?',
      a: [
        //E답변
        { answer: '바로 친구한테 전화한다.', 
        type: ['8', '9', '10', '11', '12', '13', '14', '15'] },
        { answer: '혼자 혼술한다.', 
        //I답변
        type: ['0', '1', '2', '3', '4', '5', '6', '7'] },
      ]
    },
    {
      //E_I 구분질문_02
      q: '친구들 사이에서의 내 모습은? ',
      a: [
        //E답변
        { answer: '친구들과 조잘조잘 말하고 있다.', 
        type: ['8', '9', '10', '11', '12', '13', '14', '15'] },
        //I답변
        { answer: '주로 친구들 이야기를 듣고 있다.', 
        type: ['0', '1', '2', '3', '4', '5', '6', '7'] },
      ] 
    },
    {
      //E_I 구분질문_03
      q: '친구들하고 술을 마실 때 주로 선호하는 술집은?',
      a: [
        //E답변
        { answer: '시끌벅적하고 신나는 분위기의 술집', 
        type: ['8', '9', '10', '11', '12', '13', '14', '15'] },
        //I답변
        { answer: '조용하고 잔잔한 분위기의 술집', 
        type: ['0', '1', '2', '3', '4', '5', '6', '7'] },
      ]
    },
  //질문그룹_02
    {
      //S_N 구분질문_01
      q: '애인이 "우리 첫만남 때 어땠어?" 라고 물을때 나의 대답은?',
      a: [
        //N답변
        { answer: '그때 당시 느꼈던 기분, 첫인상등에 대해 말해준다. '
        , type: ['4', '5', '6', '7', '12', '13', '14', '15'] },
        //S답변
        { answer: '그떄 당시 만났던 장소, 그날의 날씨에 대해 말해준다.'
        , type: ['0', '1', '2', '3', '8', '9', '10', '11'] },
      ]
    },
    {
      //S_N 구분질문_02
      q: '내가 사는 아파트에 갑자기 좀비가 나타난다면?',
      a: [
        //N답변
        { answer: '먼저 생존을 위해 필요한 식량과 생존 키트를 챙기고...상황에 100%이입한다.'
        , type: ['4', '5', '6', '7', '12', '13', '14', '15'] },
        //S답변
        { answer: '좀비는 나타나지 않아.'
        , type: ['0', '1', '2', '3', '8', '9', '10', '11']},
      ]
    },
    {
      //S_N 구분질문_03
      q: '친구가 무슨 생각하냐고 물어볼 때 나는?',
      a: [
        //N답변
        { answer: '별 생각 안해 (눈 앞에 있는 건물은 왜 저렇게 생겼는지 생각 중)'
        , type: ['4', '5', '6', '7', '12', '13', '14', '15'] },
        //S답변
        { answer: '별 생각 안해 (머릿 속이 백지)'
        , type: ['0', '1', '2', '3', '8', '9', '10', '11'] },
      ]
    },
  //질문그룹_03
    {
      //T_F 구분질문_01
      q: '여행을 갔는데, 숙소에 도착하니 문제가 생겼다. 이때 내가 원하는 응대 방식은?',
      a: [
        //T답변
        { answer: '문제와 관련하여 생기게 된 이유를 설명 후 사과하고, 빠른 해결을 해준다.'
        , type: ['2', '3', '6', '7', '10', '11', '14', '15'] },
        //F답변
        { answer: '우선 내가 겪은 불편과 관련하여 공감 후 사과 및 해결을 해준다.'
        , type: ['0', '1', '4', '5', '8', '9', '12', '13'] },
      ]
    },
    {
      //T_F 구분질문_02
      q: '애인에게 우리 더운데 워터파크로 놀러가자!라고 했는데 사람 많은건 싫어라고 말할때 나는?',
      a: [
        //T답변
        { answer: '더운데 그럼 어디로 놀러가야 하지? 라고 다음장소를 생각한다.'
        , type: ['2', '3', '6', '7', '10', '11', '14', '15'] },
        //F답변
        { answer: '머리로 이해는 되지만 너무 단호한 애인에게 괜히 서운하다.'
        , type: ['0', '1', '4', '5', '8', '9', '12', '13'] },
      ]
    },
    {
      //T_F 구분질문_03
      q: '슬픔을 반으로 나누면?',
      a: [
        //T답변
        { answer: '반이 된다!'
        , type: ['2', '3', '6', '7', '10', '11', '14', '15'] },
        //F답변
        { answer: '슬픈 사람이 둘'
        , type: ['0', '1', '4', '5', '8', '9', '12', '13'] },
      ]
    },
  //질문그룹_04
    {
      //J_P 구분질문_01
      q: '데이트 당일, 애인이 갑자기 다른 곳이 가보고 싶다며 계획을 변경하고 가자고 한다. 이때 나는?',
      a: [
        //J답변
        { answer: '전날 새웠던 계획을 수정하고 새로운 계획을 세우느라 머릿속이 바빠진다.'
        , type: ['1', '3', '5', '7', '9', '11', '13', '15'] },
        //P답변
        { answer: '가보고 싶은 곳은 가야지, 바로 그 장소로 이동한다.'
        , type: ['0', '2', '4', '6', '8', '10', '12', '14'] },
      ]
    },
    {
      //J_P 구분질문_02
      q: '밤 10시, 친구가 "지금 바다보러 가자!"라고 한다면?',
      a: [
          //J답변
        { answer: '지금? 뭐타고 갈건데? 숙소는? 어디로 갈건데?'
        , type: ['1', '3', '5', '7', '9', '11', '13', '15'] },
        //P답변
        { answer: '지금? ㅇㅋ 바로 출발하자!'
        , type: ['0', '2', '4', '6', '8', '10', '12', '14'] },
      ]
    },
    {
      //J_P 구분질문_03
      q: '드디어 기다리고 기다리던 주말이 다가왔다. 이때 나는?',
      a: [
        //J답변
        { answer: '기상하자마자 바로 오늘 할일들을 정리 후 계획한다.'
        , type: ['1', '3', '5', '7', '9', '11', '13', '15'] },
        //P답변
        { answer: '기상하자마자 다시 눈을 붙인다.'
        , type: ['0', '2', '4', '6', '8', '10', '12', '14'] },
      ]
    }
  ]
  
  const infolist = [
    {
      name: 'ISFP',
      desc: '<br><br><br><span style="font-size:1.3rem; font-weight: 400;">✨ 당신에게 추천하는 스토리카드 ✨</span><br><div style="width:100%; height:0.1rem; background-color:#fff;"></div><br><a target="_blank" href="https://doosil.com/toad/search/search?q=%EC%96%B4%EB%A5%B8%EC%95%84%EC%9D%B4&t=tagview&tagId=599#utm_source=style_test&utm_medium=cpc&utm_campaign=style_test&utm_id=style_test" style="text-decoration: none; color:#fff; white-space: nowrap; font-weight: 400;">#어른아이</a><a target="_blank" href="https://doosil.com/toad/search/search?q=%EC%B7%A8%ED%96%A5%EA%B3%B5%EC%9C%A0&t=tagview&tagId=1230#utm_source=style_test&utm_medium=cpc&utm_campaign=style_test&utm_id=style_test" style="text-decoration: none; color:#fff; white-space: nowrap; font-weight: 400;">#취향공유</a><a target="_blank" href="https://doosil.com/toad/search/search?q=%EC%A7%91%EC%9D%98%EA%B8%B0%EC%A4%80&t=tagview&tagId=637#utm_source=style_test&utm_medium=cpc&utm_campaign=style_test&utm_id=style_test" style="text-decoration: none; color:#fff; white-space: nowrap; font-weight: 400;">#집의기준</a><br><br><span style="font-size:1.2rem; font-weight: 300; display: block; margin: 8px;">☝🏻 위 태그를 눌러 스토리카드를 확인해보세요.</span>'
    },
    {
      name: 'ISFJ',
      desc: '<br><br><br><span style="font-size:1.3rem; font-weight: 400;">✨ 당신에게 추천하는 스토리카드 ✨</span><br><div style="width:100%; height:0.1rem; background-color:#fff;"></div><br><a target="_blank" href="https://doosil.com/toad/search/search?q=%EC%A7%80%EC%86%8D%EA%B0%80%EB%8A%A5%ED%95%9C&t=tagview&tagId=623#utm_source=style_test&utm_medium=cpc&utm_campaign=style_test&utm_id=style_test" style="text-decoration: none; color:#fff; white-space: nowrap; font-weight: 400;">#지속가능한소비</a><a target="_blank" href="https://doosil.com/toad/search/search?q=%ED%98%BC%EB%B0%A5&t=tagview&tagId=369#utm_source=style_test&utm_medium=cpc&utm_campaign=style_test&utm_id=style_test" style="text-decoration: none; color:#fff; white-space: nowrap; font-weight: 400;">#혼밥</a><a target="_blank" href="https://doosil.com/toad/search/search?q=%EA%B0%80%EC%A1%B1%ED%96%89%EC%82%AC&t=tagview&tagId=86#utm_source=style_test&utm_medium=cpc&utm_campaign=style_test&utm_id=style_test" style="text-decoration: none; color:#fff; white-space: nowrap; font-weight: 400;">#가족행사</a><br><br><span style="font-size:1.2rem; font-weight: 300; display: block; margin: 8px;">☝🏻 위 태그를 눌러 스토리카드를 확인해보세요.</span>'
    },
    {
      name: 'ISTP',
      desc: '<br><br><span style="font-size:1.3rem; font-weight: 400;">✨ 당신에게 추천하는 스토리카드 ✨</span><br><div style="width:100%; height:0.1rem; background-color:#fff;"></div><br><a target="_blank" href="https://doosil.com/toad/search/search?q=%ED%9E%90%EB%A7%81%ED%83%80%EC%9E%84&t=tagview&tagId=299#utm_source=style_test&utm_medium=cpc&utm_campaign=style_test&utm_id=style_test" style="text-decoration: none; color:#fff; white-space: nowrap; font-weight: 400;">#힐링타임</a><a target="_blank" href="https://doosil.com/toad/search/search?q=%EC%83%9D%EA%B0%81%EC%89%AC%EC%96%B4%EC%A3%BC%EA%B8%B0&t=tagview&tagId=1793#utm_source=style_test&utm_medium=cpc&utm_campaign=style_test&utm_id=style_test" style="text-decoration: none; color:#fff; white-space: nowrap; font-weight: 400;">#생각쉬어주기</a><a target="_blank" href="https://doosil.com/toad/search/search?q=%EA%B4%80%EA%B3%84%EC%9D%98%EC%A0%95%EC%9D%98&t=tagview&tagId=157#utm_source=style_test&utm_medium=cpc&utm_campaign=style_test&utm_id=style_test" style="text-decoration: none; color:#fff; white-space: nowrap; font-weight: 400;">#관계의정의</a><br><br><span style="font-size:1.2rem; font-weight: 300; display: block; margin: 8px;">☝🏻 위 태그를 눌러 스토리카드를 확인해보세요.</span>'
    },
    {
      name: 'ISTJ',
      desc: '<br><br><span style="font-size:1.3rem; font-weight: 400;">✨ 당신에게 추천하는 스토리카드 ✨</span><br><div style="width:100%; height:0.1rem; background-color:#fff;"></div><br><a target="_blank" href="https://doosil.com/toad/search/search?q=%EC%98%81%ED%99%94&t=tagview&tagId=1799#utm_source=style_test&utm_medium=cpc&utm_campaign=style_test&utm_id=style_test" style="text-decoration: none; color:#fff; white-space: nowrap; font-weight: 400;">#영화</a><a target="_blank" href="https://doosil.com/toad/search/search?q=%EC%A7%91%EC%9D%98%EB%B3%80%EC%8B%A0&t=tagview&tagId=638#utm_source=style_test&utm_medium=cpc&utm_campaign=style_test&utm_id=style_test" style="text-decoration: none; color:#fff; white-space: nowrap; font-weight: 400;">#집의변신</a><br><span style="font-size:1.2rem; font-weight: 300; display: block; margin: 8px;">☝🏻 위 태그를 눌러 스토리카드를 확인해보세요.</span>'
    },
    {
      name: 'INFP',
      desc: '<br><br><span style="font-size:1.3rem; font-weight: 400;">✨ 당신에게 추천하는 스토리카드 ✨</span><br><div style="width:100%; height:0.1rem; background-color:#fff;"></div><br><a target="_blank" href="https://doosil.com/toad/search/search?q=%EA%B1%B4%EA%B0%95%EB%A3%A8%ED%8B%B4&t=tagview&tagId=150#utm_source=style_test&utm_medium=cpc&utm_campaign=style_test&utm_id=style_test" style="text-decoration: none; color:#fff; white-space: nowrap; font-weight: 400;">#건강루틴</a><a target="_blank" href="https://doosil.com/toad/search/search?q=%EC%9E%90%EA%B8%B0%EC%9E%90%EC%8B%A0&t=tagview&tagId=100#utm_source=style_test&utm_medium=cpc&utm_campaign=style_test&utm_id=style_test" style="text-decoration: none; color:#fff; white-space: nowrap; font-weight: 400;">#자기자신</a><a target="_blank" href="https://doosil.com/toad/search/search?q=%EB%AF%B8%EB%9E%98%EC%A7%80%ED%96%A5&t=tagview&tagId=206#utm_source=style_test&utm_medium=cpc&utm_campaign=style_test&utm_id=style_test" style="text-decoration: none; color:#fff; white-space: nowrap; font-weight: 400;">#미래지향</a><br><br><span style="font-size:1.2rem; font-weight: 300; display: block; margin: 8px;">☝🏻 위 태그를 눌러 스토리카드를 확인해보세요.</span>'
    },
    {
      name: 'INFJ',
      desc: '<br><br><span style="font-size:1.3rem; font-weight: 400;">✨ 당신에게 추천하는 스토리카드 ✨</span><br><div style="width:100%; height:0.1rem; background-color:#fff;"></div><br><a target="_blank" href="https://doosil.com/toad/search/search?q=%ED%95%A9%EB%A6%AC%EC%A0%81%EC%A7%80%EC%B6%9C&t=tagview&tagId=178#utm_source=style_test&utm_medium=cpc&utm_campaign=style_test&utm_id=style_test" style="text-decoration: none; color:#fff; white-space: nowrap; font-weight: 400;">#합리적지출</a><a target="_blank" href="https://doosil.com/toad/search/search?q=%EB%8F%99%EB%84%A4%EC%82%B0%EC%B1%85&t=tagview&tagId=1177#utm_source=style_test&utm_medium=cpc&utm_campaign=style_test&utm_id=style_test" style="text-decoration: none; color:#fff; white-space: nowrap; font-weight: 400;">#동네산책</a><a target="_blank" href="https://doosil.com/toad/search/search?q=%EC%9D%BC%EC%83%81%EC%9D%98%EB%A7%8C%EB%82%A8&t=tagview&tagId=42#utm_source=style_test&utm_medium=cpc&utm_campaign=style_test&utm_id=style_test" style="text-decoration: none; color:#fff; white-space: nowrap; font-weight: 400;">#일상의만남</a><br><br><span style="font-size:1.2rem; font-weight: 300; display: block; margin: 8px;">☝🏻 위 태그를 눌러 스토리카드를 확인해보세요.</span>'
    },
    {
      name: 'INTP',
      desc: '<br><br><span style="font-size:1.3rem; font-weight: 400;">✨ 당신에게 추천하는 스토리카드 ✨</span><br><div style="width:100%; height:0.1rem; background-color:#fff;"></div><br><a target="_blank" href="https://doosil.com/toad/search/search?q=%EC%9A%B0%EB%A6%AC%EC%9D%98%EA%B8%B0%EC%A4%80&t=tagview&tagId=634#utm_source=style_test&utm_medium=cpc&utm_campaign=style_test&utm_id=style_test" style="text-decoration: none; color:#fff; white-space: nowrap; font-weight: 400;">#우리의기준</a><a target="_blank" href="https://doosil.com/toad/search/search?q=%EC%97%AC%ED%96%89%EC%8A%A4%ED%83%80%EC%9D%BC&t=tagview&tagId=669#utm_source=style_test&utm_medium=cpc&utm_campaign=style_test&utm_id=style_test" style="text-decoration: none; color:#fff; white-space: nowrap; font-weight: 400;">#여행스타일</a><a target="_blank" href="https://doosil.com/toad/search/search?q=%EB%A7%9B%EC%A7%91%ED%83%90%EB%B0%A9&t=tagview&tagId=1402#utm_source=style_test&utm_medium=cpc&utm_campaign=style_test&utm_id=style_test" style="text-decoration: none; color:#fff; white-space: nowrap; font-weight: 400;">#맛집탐방</a><br><br><span style="font-size:1.2rem; font-weight: 300; display: block; margin: 8px;">☝🏻 위 태그를 눌러 스토리카드를 확인해보세요.</span>'
    },
    {
      name: 'INTJ',
      desc: '<br><br><span style="font-size:1.3rem; font-weight: 400;">✨ 당신에게 추천하는 스토리카드 ✨</span><br><div style="width:100%; height:0.1rem; background-color:#fff;"></div><br><a target="_blank" href="https://doosil.com/toad/search/search?q=%EC%84%9C%EC%A0%90&t=tagview&tagId=614#utm_source=style_test&utm_medium=cpc&utm_campaign=style_test&utm_id=style_test" style="text-decoration: none; color:#fff; white-space: nowrap; font-weight: 400;">#서점</a><a target="_blank" href="https://doosil.com/toad/search/search?q=%EC%A3%BC%EB%B0%A9%EC%9D%98%EA%BD%83&t=tagview&tagId=606#utm_source=style_test&utm_medium=cpc&utm_campaign=style_test&utm_id=style_test" style="text-decoration: none; color:#fff; white-space: nowrap; font-weight: 400;">#주방의꽃</a><a target="_blank" href="https://doosil.com/toad/search/search?q=%EB%82%B4%EC%A7%91%EB%A7%88%EB%A0%A8&t=tagview&tagId=625#utm_source=style_test&utm_medium=cpc&utm_campaign=style_test&utm_id=style_test" style="text-decoration: none; color:#fff; white-space: nowrap; font-weight: 400;">#내집마련</a><br><br><span style="font-size:1.2rem; font-weight: 300; display: block; margin: 8px;">☝🏻 위 태그를 눌러 스토리카드를 확인해보세요.</span>'
    },
    {
      name: 'ESFP',
      desc: '<br><br><span style="font-size:1.3rem; font-weight: 400;">✨ 당신에게 추천하는 스토리카드 ✨</span><br><div style="width:100%; height:0.1rem; background-color:#fff;"></div><br><a target="_blank" href="https://doosil.com/toad/search/search?q=%EC%97%AC%ED%96%89%EC%88%99%EC%86%8C&t=tagview&tagId=626#utm_source=style_test&utm_medium=cpc&utm_campaign=style_test&utm_id=style_test" style="text-decoration: none; color:#fff; white-space: nowrap; font-weight: 400;">#여행숙소</a><a target="_blank" href="https://doosil.com/toad/search/search?q=%EB%82%98%EC%97%90%EA%B2%8C%EC%A7%91%EC%9D%B4%EB%9E%80&t=tagview&tagId=134#utm_source=style_test&utm_medium=cpc&utm_campaign=style_test&utm_id=style_test" style="text-decoration: none; color:#fff; white-space: nowrap; font-weight: 400;">#나에게집이한</a><a target="_blank" href="https://doosil.com/toad/search/search?q=%EB%B0%B0%EB%8B%AC%EC%96%B4%ED%94%8C&t=tagview&tagId=618#utm_source=style_test&utm_medium=cpc&utm_campaign=style_test&utm_id=style_test" style="text-decoration: none; color:#fff; white-space: nowrap; font-weight: 400;">#배달어플</a><br><br><span style="font-size:1.2rem; font-weight: 300; display: block; margin: 8px;">☝🏻 위 태그를 눌러 스토리카드를 확인해보세요.</span>'
    },
    {
      name: 'ESFJ',
      desc: '<br><br><span style="font-size:1.3rem; font-weight: 400;">✨ 당신에게 추천하는 스토리카드 ✨</span><br><div style="width:100%; height:0.1rem; background-color:#fff;"></div><br><a target="_blank" href="https://doosil.com/toad/search/search?q=%EC%95%84%ED%8A%B8%EA%B0%A4%EB%9F%AC%EB%A6%AC&t=tagview&tagId=611#utm_source=style_test&utm_medium=cpc&utm_campaign=style_test&utm_id=style_test" style="text-decoration: none; color:#fff; white-space: nowrap; font-weight: 400;">#아트갤러리</a><a target="_blank" href="https://doosil.com/toad/search/search?q=%EC%A3%BC%EB%B0%A9%ED%8A%B8%EB%9E%9C%EB%93%9C&t=tagview&tagId=605#utm_source=style_test&utm_medium=cpc&utm_campaign=style_test&utm_id=style_test" style="text-decoration: none; color:#fff; white-space: nowrap; font-weight: 400;">#주방트랜드</a><br><br><span style="font-size:1.2rem; font-weight: 300; display: block; margin: 8px;">☝🏻 위 태그를 눌러 스토리카드를 확인해보세요.</span>'
    },
    {
      name: 'ESTP',
      desc: '<br><br><span style="font-size:1.3rem; font-weight: 400;">✨ 당신에게 추천하는 스토리카드 ✨</span><br><div style="width:100%; height:0.1rem; background-color:#fff;"></div><br><a target="_blank" href="https://doosil.com/toad/search/search?q=%ED%9C%B4%EC%8B%9D%EC%9D%98%EB%B0%A9%EB%B2%95&t=tagview&tagId=652#utm_source=style_test&utm_medium=cpc&utm_campaign=style_test&utm_id=style_test" style="text-decoration: none; color:#fff; white-space: nowrap; font-weight: 400;">#휴식의방법</a><a target="_blank" href="https://doosil.com/toad/search/search?q=%EC%9D%B8%EC%83%9D%EA%B8%B0%ED%98%B8%EC%8B%9D%ED%92%88&t=tagview&tagId=660#utm_source=style_test&utm_medium=cpc&utm_campaign=style_test&utm_id=style_test" style="text-decoration: none; color:#fff; white-space: nowrap; font-weight: 400;">#인생기호식품</a><a target="_blank" href="https://doosil.com/toad/search/search?q=%EC%95%84%ED%8A%B8%ED%8E%98%EC%96%B4&t=tagview&tagId=609#utm_source=style_test&utm_medium=cpc&utm_campaign=style_test&utm_id=style_test" style="text-decoration: none; color:#fff; white-space: nowrap; font-weight: 400;">#아트페어</a><br><br><span style="font-size:1.2rem; font-weight: 300; display: block; margin: 8px;">☝🏻 위 태그를 눌러 스토리카드를 확인해보세요.</span>'
    },
    {
      name: 'ESTJ',
      desc: '<br><br><span style="font-size:1.3rem; font-weight: 400;">✨ 당신에게 추천하는 스토리카드 ✨</span><br><div style="width:100%; height:0.1rem; background-color:#fff;"></div><br><a target="_blank" href="https://doosil.com/toad/search/search?q=%EB%9D%BC%EC%9D%B4%ED%94%84%EC%8A%A4%ED%83%80%EC%9D%BC&t=tagview&tagId=120#utm_source=style_test&utm_medium=cpc&utm_campaign=style_test&utm_id=style_test" style="text-decoration: none; color:#fff; white-space: nowrap; font-weight: 400;">#라이프스타일</a><a target="_blank" href="https://doosil.com/toad/search/search?q=%EC%9D%BC%ED%95%98%EB%8A%94%EA%B3%B5%EA%B0%84&t=tagview&tagId=119#utm_source=style_test&utm_medium=cpc&utm_campaign=style_test&utm_id=style_test" style="text-decoration: none; color:#fff; white-space: nowrap; font-weight: 400;">#일하는공간</a><a target="_blank" href="https://doosil.com/toad/search/search?q=%EC%97%AC%ED%96%89%EC%9D%98%EB%AA%A9%EC%A0%81&t=tagview&tagId=668#utm_source=style_test&utm_medium=cpc&utm_campaign=style_test&utm_id=style_test" style="text-decoration: none; color:#fff; white-space: nowrap; font-weight: 400;">#여행의목적</a><br><br><span style="font-size:1.2rem; font-weight: 300; display: block; margin: 8px;">☝🏻 위 태그를 눌러 스토리카드를 확인해보세요.</span>'
    },
    {
      name: 'ENFP',
      desc: '<br><br><span style="font-size:1.3rem; font-weight: 400;">✨ 당신에게 추천하는 스토리카드 ✨</span><br><div style="width:100%; height:0.1rem; background-color:#fff;"></div><br><a target="_blank" href="https://doosil.com/toad/search/search?q=%EC%8A%A4%ED%8A%B8%EB%A6%AC%EB%B0%8D%EB%9D%BC%EC%9D%B4%ED%94%84&t=tagview&tagId=126#utm_source=style_test&utm_medium=cpc&utm_campaign=style_test&utm_id=style_test" style="text-decoration: none; color:#fff; white-space: nowrap; font-weight: 400;">#스트리밍라이프</a><a target="_blank" href="https://doosil.com/toad/search/search?q=%EA%B5%AD%EB%82%B4%EA%B1%B4%EC%B6%95&t=tagview&tagId=592#utm_source=style_test&utm_medium=cpc&utm_campaign=style_test&utm_id=style_test" style="text-decoration: none; color:#fff; white-space: nowrap; font-weight: 400;">#국내건축</a><a target="_blank" href="https://doosil.com/toad/search/search?q=%ED%95%B4%EC%99%B8%EC%97%AC%ED%96%89&t=tagview&tagId=666#utm_source=style_test&utm_medium=cpc&utm_campaign=style_test&utm_id=style_test" style="text-decoration: none; color:#fff; white-space: nowrap; font-weight: 400;">#해외여행</a><br><br><span style="font-size:1.2rem; font-weight: 300; display: block; margin: 8px;">☝🏻 위 태그를 눌러 스토리카드를 확인해보세요.</span>'
    },
    {
      name: 'ENFJ',
      desc: '<br><br><span style="font-size:1.3rem; font-weight: 400;">✨ 당신에게 추천하는 스토리카드 ✨</span><br><div style="width:100%; height:0.1rem; background-color:#fff;"></div><br><a target="_blank" href="https://doosil.com/toad/search/search?q=%EC%A0%9C2%EC%9D%98%EC%9D%B8%EC%83%9D&t=tagview&tagId=646#utm_source=style_test&utm_medium=cpc&utm_campaign=style_test&utm_id=style_test" style="text-decoration: none; color:#fff; white-space: nowrap; font-weight: 400;">#제2의인생</a><a target="_blank" href="https://doosil.com/toad/search/search?q=%EC%86%8C%EC%85%9C%ED%94%8C%EB%9E%AB%ED%8F%BC&t=tagview&tagId=183#utm_source=style_test&utm_medium=cpc&utm_campaign=style_test&utm_id=style_test" style="text-decoration: none; color:#fff; white-space: nowrap; font-weight: 400;">#소셜플랫폼</a><a target="_blank" href="https://doosil.com/toad/search/search?q=%EC%98%88%EC%88%A0%ED%88%AC%EC%9E%90&t=tagview&tagId=610#utm_source=style_test&utm_medium=cpc&utm_campaign=style_test&utm_id=style_test" style="text-decoration: none; color:#fff; white-space: nowrap; font-weight: 400;">#예술투자</a><br><br><span style="font-size:1.2rem; font-weight: 300; display: block; margin: 8px;">☝🏻 위 태그를 눌러 스토리카드를 확인해보세요.</span>'
    },
    {
      name: 'ENTP',
      desc: '<br><br><span style="font-size:1.3rem; font-weight: 400;">✨ 당신에게 추천하는 스토리카드 ✨</span><br><div style="width:100%; height:0.1rem; background-color:#fff;"></div><br><a target="_blank" href="https://doosil.com/toad/search/search?q=%EC%9A%B4%EB%8F%99%EC%9D%98%EB%AA%A9%EC%A0%81&t=tagview&tagId=653#utm_source=style_test&utm_medium=cpc&utm_campaign=style_test&utm_id=style_test" style="text-decoration: none; color:#fff; white-space: nowrap; font-weight: 400;">#운동의목적</a><a target="_blank" href="https://doosil.com/toad/search/search?q=%EC%B7%A8%EB%AF%B8%EC%83%9D%ED%99%9C&t=tagview&tagId=285#utm_source=style_test&utm_medium=cpc&utm_campaign=style_test&utm_id=style_test" style="text-decoration: none; color:#fff; white-space: nowrap; font-weight: 400;">#취미생활</a><a target="_blank" href="https://doosil.com/toad/search/search?q=%EA%B0%80%EC%A1%B1%EC%9D%98%EA%B5%AC%EC%84%B1&t=tagview&tagId=635#utm_source=style_test&utm_medium=cpc&utm_campaign=style_test&utm_id=style_test" style="text-decoration: none; color:#fff; white-space: nowrap; font-weight: 400;">#가족의구성</a><br><br><span style="font-size:1.2rem; font-weight: 300; display: block; margin: 8px;">☝🏻 위 태그를 눌러 스토리카드를 확인해보세요.</span>'
    },
    {
      name: 'ENTJ',
      desc: '<br><br><span style="font-size:1.3rem; font-weight: 400;">✨ 당신에게 추천하는 스토리카드 ✨</span><br><div style="width:100%; height:0.1rem; background-color:#fff;"></div><br><a target="_blank" href="https://doosil.com/toad/search/search?q=%EC%BB%A4%EB%A6%AC%EC%96%B4%ED%94%8C%EB%9E%9C&t=tagview&tagId=648#utm_source=style_test&utm_medium=cpc&utm_campaign=style_test&utm_id=style_test" style="text-decoration: none; color:#fff; white-space: nowrap; font-weight: 400;">#커리어플랜</a><a target="_blank" href="https://doosil.com/toad/search/search?q=POP&t=tagview&tagId=1629#utm_source=style_test&utm_medium=cpc&utm_campaign=style_test&utm_id=style_test" style="text-decoration: none; color:#fff; white-space: nowrap; font-weight: 400;">#POP</a><a target="_blank" href="https://doosil.com/toad/search/search?q=%EC%97%AC%ED%96%89%EB%A9%94%EC%9D%B4%ED%8A%B8&t=tagview&tagId=391#utm_source=style_test&utm_medium=cpc&utm_campaign=style_test&utm_id=style_test" style="text-decoration: none; color:#fff; white-space: nowrap; font-weight: 400;">#여행메이트</a><br><br><span style="font-size:1.2rem; font-weight: 300; display: block; margin: 8px;">☝🏻 위 태그를 눌러 스토리카드를 확인해보세요.</span>'
    },
  ]
