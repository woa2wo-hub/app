import React, { useState, useMemo, useEffect } from 'react';
import { Heart, Calendar, Clock, MapPin, Star, ArrowLeft, Search, X, SlidersHorizontal, MessageCircle, Users, Check, Sparkles } from 'lucide-react';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { BottomNav, Modal, Button, EmptyState, LoadingSpinner, BackHeader } from './components/CommonUI';
import AuthScreen from './components/AuthScreen';
import { ProfileSetupScreen, ProfileViewScreen, ProfileEditScreen } from './components/ProfileScreen';
import MembershipScreen from './components/MembershipScreen';
import { ReviewList, ReviewWriteModal } from './components/ReviewSystem';
import { DUMMY_CLASSES, SORT_OPTIONS, getEnrollmentText, getShortStatus, isClosingSoon, formatDate, getEarliest } from './data/dummyData';

// 스플래시 화면
const SplashScreen = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen w-full">
      <img 
        src="/splash.png" 
        alt="ONE DAY" 
        className="w-full h-screen object-cover"
      />
    </div>
  );
};

const ScheduleModal = ({ isOpen, onClose, classItem, onSelect }) => {
  if (!isOpen || !classItem) return null;
  const available = classItem.schedules.filter(s => s.currentEnrollment < s.maxCapacity);
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="날짜 선택">
      <div className="p-4 space-y-3">
        {available.length === 0 ? <p className="text-center text-gray-500 py-4">예약 가능한 일정이 없습니다</p> : available.map(s => (
          <button key={s.id} onClick={() => { onSelect(s); onClose(); }} className="w-full flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50">
            <div><div className="font-medium">{formatDate(s.date, s.time)}</div><div className="text-sm text-gray-500">{getShortStatus(s.currentEnrollment, s.maxCapacity)}</div></div>
          </button>
        ))}
      </div>
    </Modal>
  );
};

const CouponSelectModal = ({ isOpen, onClose, coupons, selectedCoupon, onSelect, maxPrice }) => {
  if (!isOpen) return null;
  const available = (coupons || []).filter(c => !c.used && c.amount <= maxPrice);
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="쿠폰 선택">
      <div className="p-4 space-y-2">
        <button onClick={() => { onSelect(null); onClose(); }} className={`w-full p-4 border rounded-xl text-left ${!selectedCoupon ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}`}>
          <span className="text-gray-600">쿠폰 사용 안함</span>
        </button>
        {available.length === 0 ? (
          <p className="text-center text-gray-400 py-4 text-sm">사용 가능한 쿠폰이 없습니다</p>
        ) : available.map(c => (
          <button key={c.id} onClick={() => { onSelect(c); onClose(); }} className={`w-full p-4 border rounded-xl text-left ${selectedCoupon?.id === c.id ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}`}>
            <div className="font-bold text-purple-600">{c.amount?.toLocaleString()}원 할인</div>
            <div className="text-sm text-gray-600">{c.name}</div>
          </button>
        ))}
      </div>
    </Modal>
  );
};

// 온보딩 화면
const OnboardingScreen = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      icon: '✨',
      title: '원데이에 오신 것을 환영해요',
      description: '특별한 하루, 특별한 만남을\n함께 시작해보세요'
    },
    {
      icon: '📅',
      title: '원데이 클래스',
      description: '커피, 와인, 도자기 등\n다양한 취미 클래스를 즐겨보세요'
    },
    {
      icon: '💕',
      title: '자연스러운 만남',
      description: '같은 관심사를 가진 사람들과\n함께하는 특별한 경험'
    },
    {
      icon: '💬',
      title: '대화 이어가기',
      description: '클래스가 끝나도 인연은 계속!\n서로 선택하면 대화가 시작돼요'
    }
  ];

  // 2초마다 자동으로 다음 슬라이드 (마지막 슬라이드 제외)
  useEffect(() => {
    if (currentSlide < slides.length - 1) {
      const timer = setTimeout(() => {
        setCurrentSlide(prev => prev + 1);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentSlide, slides.length]);

  const handleStart = () => {
    localStorage.setItem('oneday_onboarding_done', 'true');
    onComplete();
  };

  const handleSkip = () => {
    localStorage.setItem('oneday_onboarding_done', 'true');
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 via-purple-500 to-blue-500 flex flex-col">
      {/* Skip 버튼 */}
      <div className="p-4 flex justify-end">
        <button onClick={handleSkip} className="text-white/80 text-sm px-4 py-2">
          건너뛰기
        </button>
      </div>

      {/* 슬라이드 콘텐츠 */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <div className="text-7xl mb-8">{slides[currentSlide].icon}</div>
        <h2 className="text-2xl font-bold text-white mb-4">{slides[currentSlide].title}</h2>
        <p className="text-white/90 whitespace-pre-line leading-relaxed">{slides[currentSlide].description}</p>
      </div>

      {/* 인디케이터 & 버튼 */}
      <div className="p-8">
        {/* 인디케이터 */}
        <div className="flex justify-center gap-2 mb-6">
          {slides.map((_, i) => (
            <div 
              key={i} 
              className={`w-2 h-2 rounded-full transition-all ${i === currentSlide ? 'w-6 bg-white' : 'bg-white/40'}`} 
            />
          ))}
        </div>

        {/* 마지막 슬라이드에서만 시작하기 버튼 표시 */}
        {currentSlide === slides.length - 1 && (
          <button 
            onClick={handleStart}
            className="w-full py-4 bg-white text-purple-600 rounded-2xl font-bold text-lg hover:bg-white/90 transition"
          >
            시작하기
          </button>
        )}
      </div>
    </div>
  );
};

const ClassCard = ({ c, onView, onFavorite, isFav }) => {
  const [showSchedule, setShowSchedule] = useState(false);
  const [schedule, setSchedule] = useState(() => getEarliest(c.schedules));
  const remaining = schedule.maxCapacity - schedule.currentEnrollment;
  const closing = isClosingSoon(schedule);
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div onClick={() => onView(c, schedule)} className="cursor-pointer">
        <div className="relative">
          <img src={c.image} alt={c.title} className="w-full h-44 object-cover" />
          <div className="absolute top-3 left-3 flex gap-2">
            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${c.type === 'group' ? 'bg-white/90' : 'bg-purple-500 text-white'}`}>{c.type === 'group' ? '그룹' : '1:1'}</span>
            {closing && <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-amber-500 text-white">곧 마감</span>}
          </div>
          <button onClick={e => { e.stopPropagation(); onFavorite(c.id); }} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center">
            <Heart className={`w-5 h-5 ${isFav ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
          </button>
        </div>
        <div className="p-4">
          <h3 className="font-bold">{c.title}</h3>
          <p className="text-sm text-gray-500">{c.subtitle}</p>
          <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-2"><MapPin className="w-4 h-4" />{c.location}</div>
          <div className="flex items-center gap-1.5 text-sm mt-1">
            <Clock className="w-4 h-4 text-gray-400" /><span>{formatDate(schedule.date, schedule.time)}</span>
            <span className={`ml-auto text-xs px-2 py-0.5 rounded ${remaining <= 0 ? 'bg-gray-200 text-gray-500' : 'bg-green-100 text-green-700'}`}>{getShortStatus(schedule.currentEnrollment, schedule.maxCapacity)}</span>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t">
            <div className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /><span className="text-sm font-medium">{c.rating}</span><span className="text-xs text-gray-400">({c.reviewCount})</span></div>
            <span className="font-bold">{c.totalPrice.toLocaleString()}원</span>
          </div>
        </div>
      </div>
      <div className="px-4 pb-4 flex gap-3">
        <button onClick={(e) => { e.stopPropagation(); setShowSchedule(true); }} className="flex-1 py-3 text-sm font-medium border border-gray-300 rounded-xl hover:bg-gray-50">다른 날짜</button>
        <button onClick={() => onView(c, schedule)} className="flex-1 py-3 text-sm font-medium bg-purple-500 text-white rounded-xl hover:bg-purple-600">상세보기</button>
      </div>
      <ScheduleModal isOpen={showSchedule} onClose={() => setShowSchedule(false)} classItem={c} onSelect={setSchedule} />
    </div>
  );
};

const AppContent = () => {
  const { user, userProfile, isAuthenticated, isProfileComplete, isLoading, favorites, toggleFavorite, coupons, useCoupon, hasMembership, membership } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(() => !localStorage.getItem('oneday_onboarding_done'));
  const [screen, setScreen] = useState('login');
  const [signupData, setSignupData] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date_asc');
  const [hideFull, setHideFull] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [myClasses, setMyClasses] = useState([]);
  const [completedClasses, setCompletedClasses] = useState([]);
  const [cancelledClasses, setCancelledClasses] = useState([]);
  const [mypageTab, setMypageTab] = useState('upcoming');
  const [matches, setMatches] = useState([]);
  const [showSort, setShowSort] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [reviewWritten, setReviewWritten] = useState(false);
  const [mySelections, setMySelections] = useState([]);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isDemo, setIsDemo] = useState(false);
  const [demoProfileComplete, setDemoProfileComplete] = useState(false);
  const [demoCoupons, setDemoCoupons] = useState([{ id: 'demo_welcome', name: '회원가입 기념 5,000원', amount: 5000, used: false }]);
  // 데모 모드는 처음에 멤버십 없이 시작 (가입 절차 후 이용 가능)
  const [demoMembership, setDemoMembership] = useState(null);
  const [showCouponSelect, setShowCouponSelect] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  
  // 모달 state 추가
  const [showBookingComplete, setShowBookingComplete] = useState(false);
  const [showMatchComplete, setShowMatchComplete] = useState(false);
  const [showInterestSent, setShowInterestSent] = useState(false);
  const [matchedPerson, setMatchedPerson] = useState(null);
  const [interestPerson, setInterestPerson] = useState(null);
  const [bookingInfo, setBookingInfo] = useState(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [classToCancal, setClassToCancel] = useState(null);
  const [prevScreen, setPrevScreen] = useState('profile'); // 멤버십 화면 이전 화면 추적
  
  const effectiveProfileComplete = isDemo ? demoProfileComplete : isProfileComplete;
  const effectiveCoupons = isDemo ? demoCoupons : (coupons || []);
  const effectiveMembership = isDemo ? demoMembership : membership;
  const effectiveHasMembership = effectiveMembership && new Date(effectiveMembership.endDate) > new Date();

  useEffect(() => {
    if (isAuthenticated && screen === 'login') {
      if (isProfileComplete) setScreen('home');
      else setScreen('profileSetup');
    }
  }, [isAuthenticated, isProfileComplete, screen]);

  const handleAuthSuccess = (type, data) => {
    if (type === 'signup') { setSignupData(data); setScreen('profileSetup'); }
    else if (isProfileComplete) setScreen('home');
    else setScreen('profileSetup');
  };

  const handleDemo = () => { setIsDemo(true); setSignupData({ demo: true }); setScreen('profileSetup'); };
  const handleProfileComplete = () => { if (isDemo) setDemoProfileComplete(true); setScreen('home'); };
  const handleFavorite = (id) => { if (isAuthenticated || isDemo) toggleFavorite(id); };
  const viewDetail = (c, schedule) => { setSelectedClass(c); setSelectedSchedule(schedule || getEarliest(c.schedules)); setSelectedCoupon(null); setScreen('detail'); };
  
  // 멤버십 화면으로 이동 (이전 화면 저장)
  const goToMembership = (fromScreen) => {
    setPrevScreen(fromScreen);
    setScreen('membership');
  };
  
  const finalPrice = selectedClass ? Math.max(0, selectedClass.totalPrice - (selectedCoupon?.amount || 0)) : 0;

  const bookClass = async () => {
    if (!effectiveProfileComplete) { setScreen('profileSetup'); return; }
    if (selectedCoupon) {
      if (isDemo) {
        setDemoCoupons(prev => prev.map(c => c.id === selectedCoupon.id ? { ...c, used: true } : c));
      } else {
        await useCoupon(selectedCoupon.id);
      }
    }
    setMyClasses([...myClasses, { ...selectedClass, schedule: selectedSchedule, paidPrice: finalPrice }]);
    setBookingInfo({ title: selectedClass.title, discount: selectedCoupon?.amount });
    setShowBookingComplete(true);
    setSelectedCoupon(null);
  };

  const completeClass = (c) => {
    const completedAt = new Date().toISOString();
    const participants = c.type === 'group' ? [
      { id: 1, name: '민지', photo: '👩', intro: '반가워요!', selectedMe: true },
      { id: 2, name: '서준', photo: '👨', intro: '다음에 또 만나요~', selectedMe: false },
      { id: 3, name: '하은', photo: '👩', intro: '좋은 시간이었어요!', selectedMe: false },
    ] : [{ id: 1, name: '민지', photo: '👩', intro: '반가워요!', selectedMe: true }];
    setCompletedClasses([...completedClasses, { ...c, participants, completedAt }]);
    setMyClasses(myClasses.filter(x => x.id !== c.id));
    setSelectedClass({ ...c, participants, completedAt });
    setReviewWritten(false);
    setMySelections([]);
    setScreen('afterClass');
  };

  const handleReviewSubmit = () => { setReviewWritten(true); setShowReview(false); };
  const handleSelectParticipant = (p) => { setMySelections(mySelections.find(x => x.id === p.id) ? [] : [p]); };

  const confirmSelection = () => {
    if (mySelections.length === 0) return;
    const selected = mySelections[0];
    if (selected.selectedMe) { 
      setMatches([...matches, selected]); 
      setMatchedPerson(selected);
      setShowMatchComplete(true);
      // 매칭 시 상대방 첫 인사 메시지 추가
      setMessages([{ text: `안녕하세요! 클래스에서 뵀던 ${selected.name}입니다 😊`, sender: 'other', time: new Date() }]);
    } else { 
      setInterestPerson(selected);
      setShowInterestSent(true);
    }
    setMySelections([]);
  };

  // 상대방 자동 응답
  const partnerResponses = [
    '네 반가워요! 😊',
    '저도 클래스 재밌었어요!',
    '다음에 또 함께해요~',
    '오 좋아요!',
    'ㅎㅎ 그러게요',
    '맞아요~ 저도 그랬어요',
    '다음 주에 시간 되세요?',
    '저도요! 👍',
  ];

  const sendMessage = () => { 
    if (!chatInput.trim()) return; 
    setMessages(prev => [...prev, { text: chatInput, sender: 'me', time: new Date() }]); 
    setChatInput(''); 
    
    // 상대방 자동 응답 (1-3초 후)
    if (matches.length > 0) {
      setTimeout(() => {
        const randomResponse = partnerResponses[Math.floor(Math.random() * partnerResponses.length)];
        setMessages(prev => [...prev, { text: randomResponse, sender: 'other', time: new Date() }]);
      }, 1000 + Math.random() * 2000);
    }
  };

  const filteredClasses = useMemo(() => {
    let result = [...DUMMY_CLASSES];
    if (searchQuery.trim()) { const q = searchQuery.toLowerCase(); result = result.filter(c => c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q) || c.location.toLowerCase().includes(q)); }
    if (filter === 'group') result = result.filter(c => c.type === 'group');
    else if (filter === '1on1') result = result.filter(c => c.type === '1on1');
    if (hideFull) result = result.filter(c => { const s = getEarliest(c.schedules); return s.currentEnrollment < s.maxCapacity; });
    result.sort((a, b) => { const sa = getEarliest(a.schedules), sb = getEarliest(b.schedules); if (sortBy === 'date_asc') return new Date(sa.date) - new Date(sb.date); if (sortBy === 'review_desc') return b.rating - a.rating; if (sortBy === 'price_desc') return b.totalPrice - a.totalPrice; if (sortBy === 'price_asc') return a.totalPrice - b.totalPrice; return 0; });
    return result;
  }, [searchQuery, filter, sortBy, hideFull]);

  const favoriteClasses = useMemo(() => DUMMY_CLASSES.filter(c => favorites.includes(c.id)), [favorites]);

  // 스플래시 화면
  if (showSplash) return <SplashScreen onComplete={() => setShowSplash(false)} />;

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>;

  // 온보딩 화면
  if (showOnboarding) return <OnboardingScreen onComplete={() => setShowOnboarding(false)} />;

  if (screen === 'login') return <AuthScreen onSuccess={handleAuthSuccess} onSkip={() => setScreen('home')} onDemo={handleDemo} />;
  if (screen === 'profileSetup') return <ProfileSetupScreen onComplete={handleProfileComplete} onBack={() => setScreen('login')} initialData={signupData} isDemo={isDemo} />;
  if (screen === 'profile') return <ProfileViewScreen onNavigate={(s) => s === 'membership' ? goToMembership('profile') : setScreen(s)} onBack={() => setScreen('home')} onLogout={() => { setIsDemo(false); setDemoProfileComplete(false); setDemoMembership(null); setScreen('login'); }} isDemo={isDemo} demoProfileComplete={demoProfileComplete} demoMembership={demoMembership} />;
  if (screen === 'profileEdit') return <ProfileEditScreen onBack={() => setScreen('profile')} isDemo={isDemo} />;
  if (screen === 'membership') return <MembershipScreen onBack={() => setScreen(prevScreen)} isDemo={isDemo} demoCoupons={demoCoupons} setDemoCoupons={setDemoCoupons} demoMembership={demoMembership} setDemoMembership={setDemoMembership} />;

  if (screen === 'detail' && selectedClass) {
    const remaining = selectedSchedule.maxCapacity - selectedSchedule.currentEnrollment;
    const availableCoupons = effectiveCoupons.filter(c => !c.used);
    return (
      <div className="min-h-screen bg-white pb-32">
        <div className="relative h-64">
          <img src={selectedClass.image} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <button onClick={() => setScreen('home')} className="absolute top-4 left-4 bg-white/90 rounded-full p-2"><ArrowLeft className="w-5 h-5" /></button>
          <button onClick={() => handleFavorite(selectedClass.id)} className="absolute top-4 right-4 bg-white/90 rounded-full p-2"><Heart className={`w-5 h-5 ${favorites.includes(selectedClass.id) ? 'text-red-500 fill-red-500' : ''}`} /></button>
          <div className="absolute bottom-4 left-4 right-4">
            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${selectedClass.type === 'group' ? 'bg-white/90' : 'bg-purple-500 text-white'}`}>{selectedClass.type === 'group' ? '그룹' : '1:1'}</span>
            <h2 className="text-2xl font-bold text-white mt-2">{selectedClass.title}</h2>
          </div>
        </div>
        <div className="max-w-md mx-auto px-6 py-6 space-y-6">
          <p className="text-gray-600">{selectedClass.description}</p>
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2"><Calendar className="w-5 h-5 text-gray-400" /><span>{formatDate(selectedSchedule.date, selectedSchedule.time)}</span></div>
            <div className="flex items-center gap-2"><MapPin className="w-5 h-5 text-gray-400" /><span>{selectedClass.location}</span></div>
            <div className="flex items-center gap-2"><Users className="w-5 h-5 text-gray-400" /><span>{getEnrollmentText(selectedSchedule.currentEnrollment, selectedSchedule.maxCapacity, selectedClass.type)}</span></div>
          </div>
          <div><h3 className="font-bold mb-3">후기</h3><ReviewList reviews={selectedClass.reviews} rating={selectedClass.rating} reviewCount={selectedClass.reviewCount} /></div>
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2"><span className="text-gray-600">클래스 가격</span><span>{selectedClass.totalPrice.toLocaleString()}원</span></div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">할인 쿠폰</span>
              <button onClick={() => setShowCouponSelect(true)} className="text-purple-600 font-medium text-sm">
                {selectedCoupon ? `-${selectedCoupon.amount.toLocaleString()}원` : availableCoupons.length > 0 ? `쿠폰 선택 (${availableCoupons.length}개)` : '없음'}
              </button>
            </div>
            <div className="border-t pt-2 mt-2"><div className="flex justify-between items-center"><span className="font-bold">최종 결제 금액</span><span className="font-bold text-purple-600 text-lg">{finalPrice.toLocaleString()}원</span></div></div>
          </div>
        </div>
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4"><div className="max-w-md mx-auto">{remaining > 0 ? <Button onClick={bookClass} className="w-full">{finalPrice.toLocaleString()}원 결제하기</Button> : <div className="w-full py-4 bg-gray-200 text-gray-500 rounded-xl text-center font-medium">마감되었습니다</div>}</div></div>
        <CouponSelectModal isOpen={showCouponSelect} onClose={() => setShowCouponSelect(false)} coupons={effectiveCoupons} selectedCoupon={selectedCoupon} onSelect={setSelectedCoupon} maxPrice={selectedClass.totalPrice} />
        
        {/* 예약 완료 모달 */}
        <Modal isOpen={showBookingComplete} onClose={() => { setShowBookingComplete(false); setScreen('mypage'); }}>
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">예약 완료!</h3>
            <p className="text-gray-600 mb-2">{bookingInfo?.title}</p>
            {bookingInfo?.discount && (
              <p className="text-purple-600 text-sm mb-4">🎫 {bookingInfo.discount.toLocaleString()}원 할인 적용</p>
            )}
            <Button onClick={() => { setShowBookingComplete(false); setScreen('mypage'); }} className="w-full">확인</Button>
          </div>
        </Modal>
      </div>
    );
  }

  if (screen === 'mypage') {
    const handleCancelClass = (c) => {
      setClassToCancel(c);
      setShowCancelConfirm(true);
    };
    
    const confirmCancelClass = () => {
      if (classToCancal) {
        setCancelledClasses([...cancelledClasses, { ...classToCancal, cancelledAt: new Date().toISOString() }]);
        setMyClasses(myClasses.filter(x => x.id !== classToCancal.id));
        setShowCancelConfirm(false);
        setClassToCancel(null);
      }
    };

    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-white border-b">
          <div className="px-6 py-4">
            <h2 className="text-xl font-bold">내 클래스</h2>
          </div>
          {/* 탭 메뉴 */}
          <div className="flex border-b">
            <button 
              onClick={() => setMypageTab('upcoming')}
              className={`flex-1 py-3 text-sm font-medium text-center border-b-2 transition-colors ${
                mypageTab === 'upcoming' 
                  ? 'text-purple-600 border-purple-600' 
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              다가오는 클래스
            </button>
            <button 
              onClick={() => setMypageTab('completed')}
              className={`flex-1 py-3 text-sm font-medium text-center border-b-2 transition-colors ${
                mypageTab === 'completed' 
                  ? 'text-purple-600 border-purple-600' 
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              완료된 클래스
            </button>
            <button 
              onClick={() => setMypageTab('cancelled')}
              className={`flex-1 py-3 text-sm font-medium text-center border-b-2 transition-colors ${
                mypageTab === 'cancelled' 
                  ? 'text-purple-600 border-purple-600' 
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              취소된 클래스
            </button>
          </div>
        </div>
        
        <div className="max-w-md mx-auto px-4 py-4">
          {/* 다가오는 클래스 */}
          {mypageTab === 'upcoming' && (
            myClasses.length === 0 ? (
              <EmptyState icon={Calendar} title="예약된 클래스가 없습니다" action={<Button onClick={() => setScreen('home')}>클래스 보러가기</Button>} />
            ) : (
              <div className="space-y-3">
                {myClasses.map((c, i) => (
                  <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex gap-3">
                      <img src={c.image} alt="" className="w-20 h-20 rounded-lg object-cover" />
                      <div className="flex-1">
                        <div className="font-bold">{c.title}</div>
                        <div className="text-sm text-gray-500 mt-1">{formatDate(c.schedule.date, c.schedule.time)}</div>
                        <div className="text-sm text-purple-600 font-medium mt-1">{c.paidPrice?.toLocaleString()}원</div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button 
                        onClick={() => handleCancelClass(c)} 
                        className="flex-1 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                      >
                        예약 취소
                      </button>
                      <button 
                        onClick={() => completeClass(c)} 
                        className="flex-1 py-2 bg-purple-500 text-white rounded-lg text-sm hover:bg-purple-600"
                      >
                        클래스 완료
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
          
          {/* 완료된 클래스 */}
          {mypageTab === 'completed' && (
            completedClasses.length === 0 ? (
              <EmptyState icon={Check} title="완료된 클래스가 없습니다" />
            ) : (
              <div className="space-y-3">
                {completedClasses.map((c, i) => (
                  <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex gap-3">
                      <img src={c.image} alt="" className="w-20 h-20 rounded-lg object-cover" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{c.title}</span>
                          <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">완료</span>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">{formatDate(c.schedule.date, c.schedule.time)}</div>
                        <div className="text-sm text-purple-600 font-medium mt-1">{c.paidPrice?.toLocaleString()}원</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => { setSelectedClass(c); setScreen('afterClass'); }}
                      className="w-full mt-3 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200"
                    >
                      대화 이어가기
                    </button>
                  </div>
                ))}
              </div>
            )
          )}
          
          {/* 취소된 클래스 */}
          {mypageTab === 'cancelled' && (
            cancelledClasses.length === 0 ? (
              <EmptyState icon={X} title="취소된 클래스가 없습니다" />
            ) : (
              <div className="space-y-3">
                {cancelledClasses.map((c, i) => (
                  <div key={i} className="bg-white rounded-xl p-4 shadow-sm opacity-70">
                    <div className="flex gap-3">
                      <img src={c.image} alt="" className="w-20 h-20 rounded-lg object-cover grayscale" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-500">{c.title}</span>
                          <span className="text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">취소됨</span>
                        </div>
                        <div className="text-sm text-gray-400 mt-1">{formatDate(c.schedule.date, c.schedule.time)}</div>
                        <div className="text-sm text-gray-400 mt-1 line-through">{c.paidPrice?.toLocaleString()}원</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
        
        {/* 예약 취소 확인 모달 */}
        <Modal isOpen={showCancelConfirm} onClose={() => setShowCancelConfirm(false)}>
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">예약을 취소하시겠어요?</h3>
            <p className="text-gray-600 mb-4">{classToCancal?.title}</p>
            <p className="text-sm text-gray-500 mb-4">취소 후에는 되돌릴 수 없습니다</p>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setShowCancelConfirm(false)} className="flex-1">아니오</Button>
              <button 
                onClick={confirmCancelClass}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600"
              >
                예약 취소
              </button>
            </div>
          </div>
        </Modal>
        
        <BottomNav current="mypage" onChange={setScreen} matchCount={matches.length} isAuthenticated={isAuthenticated || isDemo} hasMembership={effectiveHasMembership} />
      </div>
    );
  }

  if (screen === 'afterClass') {
    const participants = selectedClass?.participants || [];
    const completedAt = selectedClass?.completedAt ? new Date(selectedClass.completedAt) : new Date();
    const now = new Date();
    const hoursSinceComplete = (now - completedAt) / (1000 * 60 * 60);
    const reviewExpired = hoursSinceComplete > 24;
    const selectionExpired = hoursSinceComplete > 48;
    const reviewRemainingHours = Math.max(0, Math.ceil(24 - hoursSinceComplete));
    const selectionRemainingHours = Math.max(0, Math.ceil(48 - hoursSinceComplete));
    const selectedMeParticipants = participants.filter(p => p.selectedMe);
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white pb-20">
        <BackHeader title="클래스 완료" onBack={() => setScreen('mypage')} />
        <div className="max-w-md mx-auto px-6 py-6 space-y-6">
          {/* 리뷰 작성 섹션 */}
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <h3 className="font-bold mb-3">클래스는 어떠셨나요?</h3>
            {reviewWritten ? (
              <div className="flex items-center gap-2 text-green-600 text-sm"><Check className="w-4 h-4" />후기 작성 완료!</div>
            ) : reviewExpired ? (
              <div className="text-gray-400 text-sm">⏰ 후기 작성 기한이 만료되었습니다 (24시간)</div>
            ) : (
              <>
                <Button variant="secondary" onClick={() => setShowReview(true)}>후기 작성하기</Button>
                <p className="text-xs text-gray-400 mt-2">⏰ {reviewRemainingHours}시간 내 작성 가능</p>
              </>
            )}
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl p-5 text-white">
            <div className="flex items-center gap-2 mb-2"><Sparkles className="w-5 h-5" /><h3 className="font-bold">대화 이어가기</h3></div>
            <p className="text-white/90 text-sm">서로 선택하면 대화가 시작됩니다!</p>
            {!selectionExpired && <p className="text-white/70 text-xs mt-2">⏰ {selectionRemainingHours}시간 내 선택 가능</p>}
          </div>
          
          {/* 나를 선택한 참가자 - 리뷰 작성 후에만 표시 */}
          {reviewWritten && (
            <div className={`rounded-xl p-4 ${effectiveHasMembership ? 'bg-pink-50 border-2 border-pink-200' : 'bg-gray-100'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-500" />
                  <span className="font-bold text-sm">나를 선택한 참가자</span>
                </div>
                {effectiveHasMembership ? (
                  <span className="text-xs bg-pink-500 text-white px-2 py-1 rounded-full">멤버십 혜택</span>
                ) : (
                  <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">멤버십 전용</span>
                )}
              </div>
              {effectiveHasMembership ? (
                <div className="mt-3">
                  {selectedMeParticipants.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-sm text-pink-600 font-medium">
                        💕 {selectedMeParticipants.map(p => p.name).join(', ')}님이 회원님을 선택했어요!
                      </p>
                      <p className="text-xs text-pink-500">
                        회원님도 선택하면 바로 매칭됩니다
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">아직 선택한 참가자가 없어요</p>
                  )}
                </div>
              ) : (
                <button onClick={() => goToMembership('afterClass')} className="mt-2 text-xs text-purple-600 font-medium">멤버십 가입하고 확인하기 →</button>
              )}
            </div>
          )}
          
          {/* 참가자 선택 섹션 */}
          {selectionExpired ? (
            <div className="bg-gray-100 rounded-xl p-4 text-center text-gray-400 text-sm">
              <Clock className="w-5 h-5 mx-auto mb-2" />
              참가자 선택 기한이 만료되었습니다 (48시간)
            </div>
          ) : reviewWritten ? (
            <div className="space-y-3">
              <h4 className="font-bold text-sm">함께한 참가자</h4>
              {participants.map(p => (
                <div key={p.id} onClick={() => handleSelectParticipant(p)} className={`bg-white rounded-xl p-4 flex items-center gap-3 cursor-pointer shadow-sm ${mySelections.find(x => x.id === p.id) ? 'ring-2 ring-purple-500' : ''} ${effectiveHasMembership && p.selectedMe ? 'border-2 border-pink-300' : ''}`}>
                  <div className="text-3xl">{p.photo}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{p.name}</span>
                      {effectiveHasMembership && p.selectedMe && <span className="text-xs bg-pink-100 text-pink-600 px-1.5 py-0.5 rounded">💕 나를 선택함</span>}
                    </div>
                    <div className="text-sm text-gray-500">{p.intro}</div>
                  </div>
                  {mySelections.find(x => x.id === p.id) && <Check className="w-5 h-5 text-purple-500" />}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-100 rounded-xl p-4 text-center text-gray-500 text-sm">
              <Users className="w-5 h-5 mx-auto mb-2" />
              후기를 작성하면 참가자를 선택할 수 있어요
            </div>
          )}
          
          {reviewWritten && mySelections.length > 0 && !selectionExpired && (
            <Button onClick={confirmSelection} className="w-full">{mySelections[0].name}님 선택하기</Button>
          )}
        </div>
        <ReviewWriteModal isOpen={showReview} onClose={() => setShowReview(false)} classInfo={selectedClass} onSubmit={handleReviewSubmit} />
        
        {/* 매칭 완료 모달 */}
        <Modal isOpen={showMatchComplete} onClose={() => { setShowMatchComplete(false); setScreen('chat'); }}>
          <div className="p-6 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-xl font-bold mb-2">매칭 성공!</h3>
            <p className="text-gray-600 mb-4">{matchedPerson?.name}님과 매칭되었어요!</p>
            <p className="text-sm text-gray-500 mb-4">서로 선택한 특별한 인연이에요<br/>지금 바로 대화를 시작해보세요 💬</p>
            <Button onClick={() => { setShowMatchComplete(false); setScreen('chat'); }} className="w-full">대화 시작하기</Button>
          </div>
        </Modal>
        
        {/* 관심 표시 모달 */}
        <Modal isOpen={showInterestSent} onClose={() => setShowInterestSent(false)}>
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-pink-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">관심 표시 완료</h3>
            <p className="text-gray-600 mb-4">{interestPerson?.name}님에게<br/>관심을 표현했어요!</p>
            <p className="text-sm text-gray-500 mb-4">{interestPerson?.name}님도 회원님을 선택하면<br/>대화가 시작됩니다 💕</p>
            <Button onClick={() => setShowInterestSent(false)} className="w-full">확인</Button>
          </div>
        </Modal>
      </div>
    );
  }

  if (screen === 'chat') return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-20">
      <div className="bg-white border-b px-6 py-4"><h2 className="text-xl font-bold">대화</h2>{matches.length > 0 && <p className="text-sm text-gray-500">{matches[0]?.name}님과 대화 중</p>}</div>
      {matches.length === 0 ? <div className="flex-1 flex items-center justify-center"><EmptyState icon={MessageCircle} title="아직 매칭된 사람이 없어요" /></div> : <><div className="flex-1 p-4 space-y-3 overflow-y-auto">{messages.length === 0 && <div className="text-center text-gray-400 py-8"><p>🎉 {matches[0]?.name}님과 매칭되었어요!</p><p className="text-sm mt-1">먼저 인사를 건네보세요</p></div>}{messages.map((m, i) => <div key={i} className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[70%] px-4 py-2 rounded-2xl ${m.sender === 'me' ? 'bg-gray-900 text-white' : 'bg-white'}`}>{m.text}</div></div>)}</div><div className="bg-white border-t p-4"><div className="flex gap-2"><input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) sendMessage(); }} placeholder="메시지 입력" className="flex-1 border rounded-xl px-4 py-2" /><Button onClick={sendMessage}>전송</Button></div></div></>}
      <BottomNav current="chat" onChange={setScreen} matchCount={matches.length} isAuthenticated={isAuthenticated || isDemo} hasMembership={effectiveHasMembership} />
    </div>
  );

  if (screen === 'favorites') return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b px-6 py-4"><h2 className="text-xl font-bold">찜한 클래스</h2></div>
      <div className="max-w-md mx-auto px-4 py-4">{favoriteClasses.length === 0 ? <EmptyState icon={Heart} title="찜한 클래스가 없어요" action={<Button onClick={() => setScreen('home')}>클래스 보러가기</Button>} /> : <div className="space-y-4">{favoriteClasses.map(c => <ClassCard key={c.id} c={c} onView={viewDetail} onFavorite={handleFavorite} isFav={true} />)}</div>}</div>
      <BottomNav current="favorites" onChange={setScreen} matchCount={matches.length} isAuthenticated={isAuthenticated || isDemo} hasMembership={effectiveHasMembership} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="sticky top-0 z-20 bg-white border-b">
        <div className="max-w-md mx-auto px-4 pt-3 pb-3">
          <div className="relative mb-3"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" placeholder="클래스, 카테고리, 지역 검색" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-10 py-3 rounded-full border bg-white focus:outline-none focus:ring-2 focus:ring-purple-500" />{searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2"><X className="w-5 h-5 text-gray-400" /></button>}</div>
          <div className="flex items-center justify-between"><div className="flex gap-4">{[{id:'all',l:'전체'},{id:'group',l:'그룹'},{id:'1on1',l:'1:1'}].map(t => <button key={t.id} onClick={() => setFilter(t.id)} className={`pb-2 text-sm ${filter === t.id ? 'font-semibold border-b-2 border-gray-900' : 'text-gray-500'}`}>{t.l}</button>)}</div><button onClick={() => setShowSort(true)} className="flex items-center gap-1 text-sm text-gray-600"><SlidersHorizontal className="w-4 h-4" />{SORT_OPTIONS.find(o => o.id === sortBy)?.name}</button></div>
        </div>
      </div>
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4"><span className="text-sm text-gray-600">{filteredClasses.length}개의 클래스</span><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={hideFull} onChange={e => setHideFull(e.target.checked)} className="rounded accent-purple-500" />마감 숨기기</label></div>
        {filteredClasses.length === 0 ? <EmptyState icon={Search} title="검색 결과가 없어요" /> : <div className="space-y-4">{filteredClasses.map(c => <ClassCard key={c.id} c={c} onView={viewDetail} onFavorite={handleFavorite} isFav={favorites.includes(c.id)} />)}</div>}
      </div>
      <Modal isOpen={showSort} onClose={() => setShowSort(false)} title="정렬"><div className="p-4 space-y-2">{SORT_OPTIONS.map(o => <button key={o.id} onClick={() => { setSortBy(o.id); setShowSort(false); }} className={`w-full text-left px-4 py-3 rounded-xl ${sortBy === o.id ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100'}`}>{o.name}</button>)}</div></Modal>
      <BottomNav current="home" onChange={setScreen} matchCount={matches.length} isAuthenticated={isAuthenticated || isDemo} hasMembership={effectiveHasMembership} />
    </div>
  );
};

const App = () => <AuthProvider><AppContent /></AuthProvider>;
export default App;
