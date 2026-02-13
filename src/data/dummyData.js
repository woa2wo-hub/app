export const DUMMY_CLASSES = [
  {
    id: 'class1',
    title: '한남동 핸드드립 커피',
    subtitle: '원두 향기와 함께하는 오후',
    description: '직접 원두를 선택하고 핸드드립으로 나만의 커피를 만들어보세요. 바리스타가 1:1로 가이드해 드립니다.',
    category: '커피',
    type: 'group',
    location: '서울 용산구',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400',
    rating: 4.8,
    reviewCount: 24,
    basePrice: 32000,
    platformFee: 3000,
    totalPrice: 35000,
    schedules: [
      { id: 's1', date: '2025-02-03', time: '14:00', maxCapacity: 4, currentEnrollment: 3 },
      { id: 's2', date: '2025-02-05', time: '15:00', maxCapacity: 4, currentEnrollment: 1 },
      { id: 's3', date: '2025-02-08', time: '14:00', maxCapacity: 4, currentEnrollment: 4 },
    ],
    reviews: [
      { id: 'r1', userName: '커피러버', rating: 5, content: '정말 좋은 경험이었어요!', date: '2025-01-28' },
      { id: 'r2', userName: '오후의여유', rating: 4, content: '분위기도 좋고 커피도 맛있었어요', date: '2025-01-25' },
    ]
  },
  {
    id: 'class2',
    title: '성수동 도자기 클래스',
    subtitle: '흙과 함께하는 힐링 시간',
    description: '물레를 돌려 나만의 도자기를 만들어보세요. 초보자도 쉽게 따라할 수 있습니다.',
    category: '공예',
    type: '1on1',
    location: '서울 성동구',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400',
    rating: 4.9,
    reviewCount: 18,
    basePrice: 55000,
    platformFee: 5000,
    totalPrice: 60000,
    schedules: [
      { id: 's1', date: '2025-02-04', time: '11:00', maxCapacity: 1, currentEnrollment: 0 },
      { id: 's2', date: '2025-02-06', time: '14:00', maxCapacity: 1, currentEnrollment: 1 },
    ],
    reviews: [
      { id: 'r1', userName: '도예가꿈나무', rating: 5, content: '선생님이 정말 잘 가르쳐주세요!', date: '2025-01-20' },
    ]
  },
  {
    id: 'class3',
    title: '망원동 와인 테이스팅',
    subtitle: '소믈리에와 함께하는 와인 여행',
    description: '5종의 와인을 테이스팅하며 와인의 기초를 배워보세요.',
    category: '와인',
    type: 'group',
    location: '서울 마포구',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400',
    rating: 4.7,
    reviewCount: 32,
    basePrice: 45000,
    platformFee: 5000,
    totalPrice: 50000,
    schedules: [
      { id: 's1', date: '2025-02-07', time: '19:00', maxCapacity: 4, currentEnrollment: 2 },
      { id: 's2', date: '2025-02-14', time: '19:00', maxCapacity: 4, currentEnrollment: 0 },
    ],
    reviews: [
      { id: 'r1', userName: '와인입문자', rating: 5, content: '와인에 대해 많이 배웠어요', date: '2025-01-22' },
    ]
  },
  {
    id: 'class4',
    title: '연남동 수채화 드로잉',
    subtitle: '감성 가득 그림 그리기',
    description: '기초부터 배우는 수채화 클래스. 오늘의 풍경을 그려보세요.',
    category: '그림',
    type: 'group',
    location: '서울 마포구',
    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400',
    rating: 4.6,
    reviewCount: 15,
    basePrice: 38000,
    platformFee: 4000,
    totalPrice: 42000,
    schedules: [
      { id: 's1', date: '2025-02-09', time: '13:00', maxCapacity: 4, currentEnrollment: 1 },
    ],
    reviews: []
  },
  {
    id: 'class5',
    title: '이태원 쿠킹 클래스',
    subtitle: '셰프에게 배우는 파스타',
    description: '정통 이탈리안 파스타를 직접 만들어보세요.',
    category: '요리',
    type: 'group',
    location: '서울 용산구',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400',
    rating: 4.8,
    reviewCount: 28,
    basePrice: 52000,
    platformFee: 5000,
    totalPrice: 57000,
    schedules: [
      { id: 's1', date: '2025-02-10', time: '18:00', maxCapacity: 4, currentEnrollment: 3 },
      { id: 's2', date: '2025-02-15', time: '12:00', maxCapacity: 4, currentEnrollment: 0 },
    ],
    reviews: [
      { id: 'r1', userName: '요리초보', rating: 5, content: '너무 맛있게 만들었어요!', date: '2025-01-18' },
    ]
  },
  {
    id: 'class6',
    title: '북촌 전통 다도 체험',
    subtitle: '한옥에서 즐기는 차 한 잔',
    description: '전통 한옥에서 다도를 배우고 마음의 평화를 찾아보세요.',
    category: '전통',
    type: '1on1',
    location: '서울 종로구',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400',
    rating: 4.9,
    reviewCount: 12,
    basePrice: 40000,
    platformFee: 4000,
    totalPrice: 44000,
    schedules: [
      { id: 's1', date: '2025-02-11', time: '10:00', maxCapacity: 1, currentEnrollment: 0 },
      { id: 's2', date: '2025-02-12', time: '15:00', maxCapacity: 1, currentEnrollment: 0 },
    ],
    reviews: []
  },
];

export const MEMBERSHIP_PLANS = [
  {
    id: 'basic',
    name: '베이직',
    price: 9900,
    duration: 30,
    features: ['나를 선택한 참가자 확인', '월 3회 무료 매칭', '기본 프로필 노출'],
    popular: false
  },
  {
    id: 'premium',
    name: '프리미엄',
    price: 19900,
    duration: 30,
    features: ['나를 선택한 참가자 확인', '무제한 매칭', '우선 프로필 노출', '채팅 읽음 확인', '5,000원 쿠폰 지급'],
    popular: true
  },
  {
    id: 'vip',
    name: 'VIP',
    price: 39900,
    duration: 30,
    features: ['프리미엄 모든 혜택', '전담 매니저 배정', '프로필 컨설팅', '매월 10,000원 쿠폰', 'VIP 전용 클래스 초대'],
    popular: false
  }
];

export const REGIONS = [
  { id: 'seoul-gangnam', city: '서울', district: '강남구' },
  { id: 'seoul-seocho', city: '서울', district: '서초구' },
  { id: 'seoul-yongsan', city: '서울', district: '용산구' },
  { id: 'seoul-mapo', city: '서울', district: '마포구' },
  { id: 'seoul-seongdong', city: '서울', district: '성동구' },
  { id: 'seoul-jongno', city: '서울', district: '종로구' },
  { id: 'seoul-songpa', city: '서울', district: '송파구' },
  { id: 'gyeonggi-suwon', city: '경기', district: '수원시' },
  { id: 'gyeonggi-seongnam', city: '경기', district: '성남시' },
  { id: 'busan-haeundae', city: '부산', district: '해운대구' },
];

export const SORT_OPTIONS = [
  { id: 'date_asc', name: '가까운 일정 순' },
  { id: 'review_desc', name: '리뷰 높은 순' },
  { id: 'price_desc', name: '가격 높은 순' },
  { id: 'price_asc', name: '가격 낮은 순' },
];

export const COMPANY_TYPES = ['대기업', '중견기업', '중소기업', '스타트업', '외국계', '공기업/공공기관', '프리랜서', '자영업', '학생', '기타'];
export const JOB_TYPES = ['개발/IT', '디자인', '기획/전략', '마케팅/광고', '영업/세일즈', '인사/총무', '재무/회계', '연구/R&D', '생산/제조', '서비스/고객지원', '교육', '의료/보건', '법률', '미디어/콘텐츠', '기타'];

export const BIRTH_YEARS = (() => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 30 }, (_, i) => currentYear - 20 - i);
})();

export const MBTI_LIST = ['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'];
export const INTERESTS = ['커피', '와인', '요리', '베이킹', '운동', '요가', '등산', '여행', '사진', '그림', '음악', '영화', '독서', '전시', '공예'];

export const getIntroExamples = (mbti, interests) => {
  const examples = [];
  
  // MBTI 기반 추천 (3개)
  const mbtiExamples = {
    ENFP: ['새로운 경험을 좋아해요!', '사람들과 대화하는 게 즐거워요', '호기심이 많은 편이에요'],
    ENFJ: ['함께하는 시간을 소중히 여겨요', '다양한 사람들을 만나고 싶어요', '긍정적인 에너지를 가진 사람이에요'],
    INFP: ['조용히 취미를 즐기는 걸 좋아해요', '깊은 대화를 나누고 싶어요', '감성적인 편이에요'],
    INFJ: ['의미 있는 만남을 원해요', '진솔한 대화를 좋아해요', '생각이 깊은 편이에요'],
    ENTP: ['재미있는 아이디어를 나누고 싶어요', '새로운 도전을 즐겨요', '토론하는 걸 좋아해요'],
    ENTJ: ['목표 지향적인 사람이에요', '효율적인 걸 좋아해요', '리더십이 있는 편이에요'],
    INTP: ['논리적인 대화를 좋아해요', '새로운 것을 배우는 게 즐거워요', '분석적인 편이에요'],
    INTJ: ['계획적인 사람이에요', '깊이 있는 대화를 선호해요', '독립적인 편이에요'],
    ESFP: ['즐거운 시간을 만들어요', '활동적인 데이트를 좋아해요', '밝은 에너지를 가졌어요'],
    ESTP: ['스릴 있는 걸 좋아해요', '적극적인 편이에요', '현재를 즐기는 타입이에요'],
    ISFP: ['감각적인 걸 좋아해요', '예술적 취미가 있어요', '자유로운 영혼이에요'],
    ISTP: ['실용적인 걸 좋아해요', '손으로 만드는 걸 즐겨요', '차분한 편이에요'],
    ESFJ: ['다른 사람을 챙기는 걸 좋아해요', '따뜻한 분위기를 만들어요', '배려심이 있는 편이에요'],
    ESTJ: ['책임감이 강해요', '약속을 잘 지켜요', '신뢰할 수 있는 사람이에요'],
    ISFJ: ['세심한 편이에요', '편안한 만남을 좋아해요', '배려심이 깊어요'],
    ISTJ: ['성실한 사람이에요', '약속을 중요하게 여겨요', '꾸준한 편이에요'],
  };
  
  if (mbti && mbtiExamples[mbti]) {
    examples.push(...mbtiExamples[mbti]);
  }
  
  // 관심사 기반 추천 (선택된 모든 관심사)
  const interestExamples = {
    '커피': '카페 투어를 즐겨요 ☕',
    '여행': '여행 이야기 나누고 싶어요 ✈️',
    '음악': '음악 듣는 걸 좋아해요 🎵',
    '영화': '영화 보는 걸 좋아해요 🎬',
    '맛집': '맛집 탐방을 즐겨요 🍽️',
    '운동': '운동으로 건강을 챙겨요 💪',
    '독서': '책 읽는 시간을 좋아해요 📚',
    '사진': '사진 찍는 걸 즐겨요 📷',
    '요리': '요리하는 걸 좋아해요 🍳',
    '게임': '가끔 게임도 해요 🎮',
    '반려동물': '동물을 좋아해요 🐾',
    '자기계발': '성장하는 삶을 추구해요 📈',
  };
  
  if (interests?.length > 0) {
    interests.forEach(interest => {
      if (interestExamples[interest]) {
        examples.push(interestExamples[interest]);
      }
    });
  }
  
  // 기본 추천 (10개 채우기 위해)
  const defaultExamples = [
    '반가워요! 좋은 만남 기대해요 😊',
    '편하게 대화 나눠요',
    '서로 알아가는 시간이 되면 좋겠어요',
    '소소한 일상을 공유하고 싶어요',
    '함께 즐거운 시간 보내요',
    '새로운 인연을 기대해요',
    '취미가 비슷한 분 만나고 싶어요',
  ];
  
  // 10개가 안 되면 기본 예시로 채우기
  let idx = 0;
  while (examples.length < 10 && idx < defaultExamples.length) {
    if (!examples.includes(defaultExamples[idx])) {
      examples.push(defaultExamples[idx]);
    }
    idx++;
  }
  
  // 최대 10개까지 반환
  return examples.slice(0, 10);
};

export const getEnrollmentText = (current, max, type) => {
  if (type === '1on1') return `잔여석 ${max - current}석`;
  return `현재 ${current}명 / 최대 ${max}명`;
};

export const getShortStatus = (current, max) => {
  const remaining = max - current;
  if (remaining <= 0) return '마감';
  return `잔여 ${remaining}석`;
};

export const isClosingSoon = (schedule) => {
  return schedule.maxCapacity - schedule.currentEnrollment === 1;
};

export const formatDate = (date, time) => {
  const d = new Date(date);
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return `${d.getMonth() + 1}.${String(d.getDate()).padStart(2, '0')}(${days[d.getDay()]}) ${time}`;
};

export const getEarliest = (schedules) => {
  return schedules.reduce((a, b) => new Date(a.date) < new Date(b.date) ? a : b);
};
