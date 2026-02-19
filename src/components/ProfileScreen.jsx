import React, { useState, useRef, useMemo } from 'react';
import { Camera, Plus, X, Check, LogOut, Edit3, ChevronDown, Users, Gift, ArrowLeft, Crown, Ticket, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button, Badge, BackHeader, MembershipBadge } from './CommonUI';
import { REGIONS, MBTI_LIST, INTERESTS, getIntroExamples, COMPANY_TYPES, JOB_TYPES, BIRTH_YEARS } from '../data/dummyData';

const PhotoGuideModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md mx-4 rounded-2xl overflow-hidden">
        <div className="border-b px-4 py-3 flex justify-between items-center"><h2 className="font-bold">프로필 사진 가이드</h2><button onClick={onClose}><X className="w-5 h-5" /></button></div>
        <div className="p-5 space-y-6">
          <div><h4 className="font-bold text-green-600 mb-3">✓ 좋은 예</h4><ul className="space-y-2 text-sm"><li>• 얼굴이 잘 보이는 사진</li><li>• 혼자 나온 사진</li><li>• 자연광 촬영</li></ul></div>
          <div><h4 className="font-bold text-red-600 mb-3">✗ 피해야 할 예</h4><ul className="space-y-2 text-sm"><li>• 선글라스·마스크</li><li>• 단체사진</li><li>• 얼굴 가림</li></ul></div>
        </div>
      </div>
    </div>
  );
};

const ContactSyncModal = ({ isOpen, onSync, onSkip }) => {
  if (!isOpen) return null;
  
  const handleSync = () => {
    onSync?.();
  };

  const handleSkip = () => {
    onSkip?.();
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative bg-white w-full max-w-md mx-4 rounded-2xl p-6 text-center">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4"><Users className="w-8 h-8 text-purple-500" /></div>
        <h3 className="font-bold mb-2">지인 차단 기능</h3>
        <p className="text-sm text-gray-600 mb-4">주소록 연락처와 상호 노출 방지</p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={handleSkip} className="flex-1">건너뛰기</Button>
          <Button onClick={handleSync} className="flex-1">동기화</Button>
        </div>
      </div>
    </div>
  );
};

const WelcomeCouponModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative bg-white w-full max-w-md mx-4 rounded-2xl p-6 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4"><Gift className="w-10 h-10 text-white" /></div>
        <h3 className="text-xl font-bold mb-2">🎉 회원가입 기념 쿠폰</h3>
        <div className="bg-purple-50 rounded-xl p-4 mb-4"><p className="text-2xl font-bold text-purple-600">5,000원 할인</p><p className="text-sm text-gray-500 mt-1">클래스 예약 또는 멤버십에 사용 가능</p></div>
        <Button onClick={onClose} className="w-full">쿠폰 사용하러 가기</Button>
      </div>
    </div>
  );
};

const SelectModal = ({ isOpen, onClose, title, options, value, onChange, searchable }) => {
  const [search, setSearch] = useState('');
  if (!isOpen) return null;
  const filtered = searchable ? options.filter(o => {
    const label = typeof o === 'string' ? o : `${o.city} ${o.district}`;
    return label.toLowerCase().includes(search.toLowerCase());
  }) : options;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md mx-4 rounded-2xl max-h-[70vh] overflow-hidden">
        <div className="border-b px-4 py-3 flex justify-between items-center"><h2 className="font-bold">{title}</h2><button onClick={onClose}><X className="w-5 h-5" /></button></div>
        <div className="p-4">
          {searchable && <input placeholder="검색" value={search} onChange={e => setSearch(e.target.value)} className="w-full px-4 py-3 border rounded-xl mb-3" />}
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {filtered.map((o, i) => {
              const val = typeof o === 'string' ? o : o.id;
              const label = typeof o === 'string' ? o : `${o.city} ${o.district}`;
              return <button key={i} onClick={() => { onChange(val); onClose(); }} className={`w-full text-left px-4 py-3 rounded-xl ${value === val ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100'}`}>{label}</button>;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const DEMO_PROFILE = {
  nickname: '원데이체험', birthYear: '1995', company: '스타트업', job: '기획/전략', region: 'seoul-gangnam', mbti: 'ENFP',
  interests: ['커피', '여행', '사진', '음악', '영화'], introduction: '새로운 경험을 좋아해요!',
  photos: [{ id: 'demo1', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop' }, { id: 'demo2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop' }],
};

// 닉네임 검증 (한글/영문만, 3~8자)
const validateNickname = (nickname) => {
  if (!nickname || nickname.length < 3) return { valid: false, error: '3글자 이상 입력해주세요' };
  if (nickname.length > 8) return { valid: false, error: '8글자 이하로 입력해주세요' };
  if (!/^[가-힣a-zA-Z]+$/.test(nickname)) return { valid: false, error: '한글/영문만 사용 가능합니다' };
  return { valid: true, error: '' };
};

export const ProfileSetupScreen = ({ onComplete, onBack, initialData, isDemo = false }) => {
  const { updateProfile, checkNicknameAvailable, coupons } = useAuth();
  const [step, setStep] = useState(1);
  const [showGuide, setShowGuide] = useState(false);
  const [showContactSync, setShowContactSync] = useState(false);
  const [showCoupon, setShowCoupon] = useState(false);
  const [showRegion, setShowRegion] = useState(false);
  const [showCompany, setShowCompany] = useState(false);
  const [showJob, setShowJob] = useState(false);
  const [showBirthYear, setShowBirthYear] = useState(false);
  const [selectedIntros, setSelectedIntros] = useState([]);
  const [form, setForm] = useState(() => isDemo ? { ...DEMO_PROFILE } : { 
    nickname: initialData?.nickname || '', 
    birthYear: '', 
    company: '', 
    job: '', 
    region: '', 
    mbti: '', 
    interests: [], 
    introduction: '', 
    photos: [] 
  });
  const [nicknameError, setNicknameError] = useState('');
  const [nicknameChecked, setNicknameChecked] = useState(isDemo);
  const [checkingNickname, setCheckingNickname] = useState(false);
  const fileRef = useRef(null);

  // 자기소개 자동 추천
  const introExamples = useMemo(() => getIntroExamples(form.mbti, form.interests), [form.mbti, form.interests]);

  const checkNickname = async () => {
    const result = validateNickname(form.nickname);
    if (!result.valid) {
      setNicknameError(result.error);
      return;
    }
    
    setCheckingNickname(true);
    setNicknameError('');
    
    try {
      if (isDemo) {
        await new Promise(r => setTimeout(r, 300));
        setNicknameChecked(true);
        return;
      }
      
      const isAvailable = await checkNicknameAvailable(form.nickname);
      if (isAvailable) {
        setNicknameChecked(true);
        setNicknameError('');
      } else {
        setNicknameError('이미 사용 중인 닉네임입니다');
      }
    } catch (error) {
      // 오류 시에도 통과 (첫 사용자 가능성)
      setNicknameChecked(true);
      setNicknameError('');
    } finally {
      setCheckingNickname(false);
    }
  };

  const handleNicknameChange = (e) => {
    setForm(prev => ({ ...prev, nickname: e.target.value }));
    setNicknameChecked(false);
    setNicknameError('');
  };

  const handlePhoto = (e) => {
    Array.from(e.target.files).forEach(f => {
      if (form.photos.length >= 6) return;
      const reader = new FileReader();
      reader.onload = (ev) => setForm(prev => ({ ...prev, photos: [...prev.photos, { id: Date.now() + Math.random(), url: ev.target.result }] }));
      reader.readAsDataURL(f);
    });
  };

  const toggleInterest = (i) => setForm(prev => ({ 
    ...prev, 
    interests: prev.interests.includes(i) 
      ? prev.interests.filter(x => x !== i) 
      : prev.interests.length < 10 
        ? [...prev.interests, i] 
        : prev.interests 
  }));

  // 자기소개 예시 토글
  const toggleIntroExample = (ex) => {
    let newSelected;
    if (selectedIntros.includes(ex)) {
      newSelected = selectedIntros.filter(x => x !== ex);
    } else if (selectedIntros.length < 5) {
      newSelected = [...selectedIntros, ex];
    } else {
      return;
    }
    setSelectedIntros(newSelected);
    setForm(prev => ({ ...prev, introduction: newSelected.join('\n') }));
  };

  const handleNext = async () => {
    if (step === 1) {
      if (!isDemo && !nicknameChecked) { alert('닉네임 중복확인을 해주세요'); return; }
      if (!form.birthYear || !form.company || !form.job || !form.region) { alert('필수 항목을 모두 선택해주세요'); return; }
      setStep(2);
    } else if (step === 2) {
      if (form.interests.length < 3) { alert('관심사를 3개 이상 선택해주세요'); return; }
      setStep(3);
    } else if (step === 3) {
      if (form.photos.length < 2) { alert('사진을 2장 이상 등록해주세요'); return; }
      setShowContactSync(true);
    }
  };

  const finishSetup = () => {
    if (!isDemo && updateProfile) {
      updateProfile(form).catch(() => {});
    }
    setShowCoupon(true);
  };

  const handleContactSync = () => {
    setShowContactSync(false);
    finishSetup();
  };

  const handleContactSkip = () => {
    setShowContactSync(false);
    finishSetup();
  };

  const handleCouponClose = () => {
    setShowCoupon(false);
    onComplete?.();
  };

  const selectedRegion = REGIONS.find(r => r.id === form.region);

  return (
    <div className="min-h-screen bg-white pb-24">
      {isDemo && <div className="bg-purple-500 text-white text-center py-2 text-sm">🎯 데모 모드</div>}
      <div className="sticky top-0 z-20 bg-white border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between text-sm mb-2">
            {step === 1 ? <button onClick={onBack} className="flex items-center gap-1 text-gray-500"><ArrowLeft className="w-4 h-4" />뒤로</button> : <span>프로필 설정</span>}
            <span className="text-purple-600 font-medium">{step}/3</span>
          </div>
          <div className="h-1 bg-gray-200 rounded-full"><div className="h-full bg-purple-500 rounded-full transition-all" style={{ width: `${(step / 3) * 100}%` }} /></div>
        </div>
      </div>
      
      <div className="max-w-md mx-auto px-4 py-6">
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold">기본정보</h2>
            <div>
              <label className="block text-sm font-medium mb-1">닉네임 *</label>
              <div className="flex gap-2">
                <input 
                  placeholder="3~8글자, 한글/영문만" 
                  value={form.nickname} 
                  onChange={handleNicknameChange}
                  className={`flex-1 min-w-0 px-3 py-3 border rounded-xl text-sm ${nicknameError ? 'border-red-500' : nicknameChecked ? 'border-green-500' : 'border-gray-200'}`} 
                />
                <button 
                  onClick={checkNickname} 
                  disabled={checkingNickname}
                  className="px-3 py-3 bg-gray-100 rounded-xl text-sm whitespace-nowrap hover:bg-gray-200 disabled:opacity-50"
                >
                  {checkingNickname ? '확인중...' : '중복확인'}
                </button>
              </div>
              {nicknameError && <p className="text-xs text-red-500 mt-1">{nicknameError}</p>}
              {nicknameChecked && !nicknameError && <p className="text-xs text-green-600 mt-1">✓ 사용 가능한 닉네임입니다</p>}
            </div>
            <div><label className="block text-sm font-medium mb-1">출생연도 *</label><button onClick={() => setShowBirthYear(true)} className="w-full flex items-center justify-between px-4 py-3 border rounded-xl border-gray-200"><span className={form.birthYear ? '' : 'text-gray-400'}>{form.birthYear || '선택'}</span><ChevronDown className="w-5 h-5 text-gray-400" /></button></div>
            <div><label className="block text-sm font-medium mb-1">회사 유형 *</label><button onClick={() => setShowCompany(true)} className="w-full flex items-center justify-between px-4 py-3 border rounded-xl border-gray-200"><span className={form.company ? '' : 'text-gray-400'}>{form.company || '선택'}</span><ChevronDown className="w-5 h-5 text-gray-400" /></button></div>
            <div><label className="block text-sm font-medium mb-1">직무 *</label><button onClick={() => setShowJob(true)} className="w-full flex items-center justify-between px-4 py-3 border rounded-xl border-gray-200"><span className={form.job ? '' : 'text-gray-400'}>{form.job || '선택'}</span><ChevronDown className="w-5 h-5 text-gray-400" /></button></div>
            <div><label className="block text-sm font-medium mb-1">거주지역 *</label><button onClick={() => setShowRegion(true)} className="w-full flex items-center justify-between px-4 py-3 border rounded-xl border-gray-200"><span className={selectedRegion ? '' : 'text-gray-400'}>{selectedRegion ? `${selectedRegion.city} ${selectedRegion.district}` : '선택'}</span><ChevronDown className="w-5 h-5 text-gray-400" /></button></div>
          </div>
        )}
        
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">나의 성향</h2>
            <div>
              <label className="block text-sm font-medium mb-2">MBTI (선택)</label>
              <div className="grid grid-cols-4 gap-2">
                {MBTI_LIST.map(m => (
                  <button 
                    key={m} 
                    onClick={() => setForm(prev => ({ ...prev, mbti: prev.mbti === m ? '' : m }))} 
                    className={`py-2 rounded-lg text-sm font-medium ${form.mbti === m ? 'bg-purple-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">관심사 * (3~10개)</label>
                <span className="text-sm text-purple-600">{form.interests.length}/10</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map(i => (
                  <button 
                    key={i} 
                    onClick={() => toggleInterest(i)} 
                    className={`px-3 py-1.5 rounded-full text-sm ${form.interests.includes(i) ? 'bg-purple-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium">자기소개</label>
                {selectedIntros.length > 0 && (
                  <span className="text-xs text-purple-600">{selectedIntros.length}/5 선택됨</span>
                )}
              </div>
              {/* 자기소개 자동 추천 - 최대 10개, 5개까지 다중 선택 */}
              {introExamples.length > 0 && (
                <div className="mb-3">
                  <div className="flex items-center gap-1 text-xs text-purple-600 mb-2">
                    <Sparkles className="w-3 h-3" />
                    <span>추천 문구 클릭하여 추가 (최대 5개)</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {introExamples.slice(0, 10).map((ex, i) => (
                      <button 
                        key={i}
                        onClick={() => toggleIntroExample(ex)}
                        className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                          selectedIntros.includes(ex) 
                            ? 'bg-purple-500 text-white' 
                            : selectedIntros.length >= 5 
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
                        }`}
                        disabled={!selectedIntros.includes(ex) && selectedIntros.length >= 5}
                      >
                        {ex}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <textarea 
                placeholder="추천 문구를 선택하거나 자유롭게 작성해주세요" 
                rows={4} 
                value={form.introduction} 
                onChange={e => {
                  setForm(prev => ({ ...prev, introduction: e.target.value }));
                  // 직접 수정 시 선택된 항목과 동기화 해제
                }}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl resize-none" 
              />
              <p className="text-xs text-gray-400 mt-1">추천 문구 선택 + 직접 입력 혼합 가능</p>
            </div>
          </div>
        )}
        
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">프로필 사진</h2>
            <p className="text-sm text-gray-500">최소 2장, 최대 6장까지 등록 가능합니다</p>
            <div className="grid grid-cols-3 gap-3">
              {[...Array(6)].map((_, i) => {
                const photo = form.photos[i];
                return (
                  <div key={i} className={`aspect-square rounded-2xl border-2 border-dashed flex items-center justify-center relative overflow-hidden ${i < 2 ? 'border-purple-400 bg-purple-50' : 'border-gray-200 bg-gray-50'}`}>
                    {photo ? (
                      <>
                        <img src={photo.url} alt="" className="w-full h-full object-cover" />
                        <button onClick={() => setForm(prev => ({ ...prev, photos: prev.photos.filter(p => p.id !== photo.id) }))} className="absolute top-1 right-1 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center">
                          <X className="w-4 h-4 text-white" />
                        </button>
                        {i === 0 && <span className="absolute bottom-1 left-1 text-[10px] bg-purple-500 text-white px-1.5 py-0.5 rounded-full">대표</span>}
                      </>
                    ) : (
                      <button onClick={() => fileRef.current?.click()} className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                        <Plus className="w-6 h-6" />
                        {i < 2 && <span className="text-[10px] mt-1">필수</span>}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple onChange={handlePhoto} className="hidden" />
            <button onClick={() => setShowGuide(true)} className="text-sm text-purple-600 font-medium">📷 사진 가이드 보기</button>
          </div>
        )}
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="max-w-md mx-auto flex gap-3">
          {step > 1 && <Button variant="secondary" onClick={() => setStep(step - 1)} className="flex-1">이전</Button>}
          <Button onClick={handleNext} className="flex-1">{step === 3 ? '완료' : '다음'}</Button>
        </div>
      </div>
      
      <SelectModal isOpen={showBirthYear} onClose={() => setShowBirthYear(false)} title="출생연도" options={BIRTH_YEARS.map(String)} value={form.birthYear} onChange={v => setForm(prev => ({ ...prev, birthYear: v }))} />
      <SelectModal isOpen={showCompany} onClose={() => setShowCompany(false)} title="회사 유형" options={COMPANY_TYPES} value={form.company} onChange={v => setForm(prev => ({ ...prev, company: v }))} />
      <SelectModal isOpen={showJob} onClose={() => setShowJob(false)} title="직무" options={JOB_TYPES} value={form.job} onChange={v => setForm(prev => ({ ...prev, job: v }))} />
      <SelectModal isOpen={showRegion} onClose={() => setShowRegion(false)} title="지역" options={REGIONS} value={form.region} onChange={v => setForm(prev => ({ ...prev, region: v }))} searchable />
      <PhotoGuideModal isOpen={showGuide} onClose={() => setShowGuide(false)} />
      <ContactSyncModal isOpen={showContactSync} onSync={handleContactSync} onSkip={handleContactSkip} />
      <WelcomeCouponModal isOpen={showCoupon} onClose={handleCouponClose} />
    </div>
  );
};

export const ProfileViewScreen = ({ onNavigate, onBack, onLogout, isDemo, demoProfileComplete, demoMembership }) => {
  const { user, userProfile, signOut, isProfileComplete, membership, hasMembership, coupons } = useAuth();
  const nickname = userProfile?.nickname || user?.displayName || (isDemo ? '원데이체험' : '사용자');
  
  const demoCoupons = [{ id: 'demo_welcome', name: '회원가입 기념 5,000원', amount: 5000, used: false }];
  const effectiveCoupons = isDemo ? demoCoupons : (coupons || []);
  const availableCoupons = effectiveCoupons.filter(c => !c.used);
  const effectiveProfileComplete = isDemo ? demoProfileComplete : isProfileComplete;
  
  // 데모 모드 멤버십 지원
  const effectiveMembership = isDemo ? demoMembership : membership;
  const effectiveHasMembership = isDemo 
    ? (demoMembership && new Date(demoMembership.endDate) > new Date()) 
    : hasMembership;

  const handleLogout = async () => { 
    try { if (!isDemo) await signOut(); } 
    catch {} 
    onLogout?.(); 
  };

  if (!effectiveProfileComplete) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <BackHeader title="프로필" onBack={onBack} />
        <div className="max-w-md mx-auto px-6 py-10 text-center">
          <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center"><Camera className="w-8 h-8 text-gray-400" /></div>
          <h3 className="font-bold mb-4">프로필을 완성해주세요</h3>
          <Button onClick={() => onNavigate?.('profileSetup')}>프로필 작성하기</Button>
        </div>
        <div className="max-w-md mx-auto px-6 mt-4"><button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-3 text-gray-500"><LogOut className="w-5 h-5" />로그아웃</button></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <BackHeader title="프로필" onBack={onBack} right={<button onClick={() => onNavigate?.('profileEdit')}><Edit3 className="w-5 h-5" /></button>} />
      <div className="max-w-md mx-auto px-6 py-6 space-y-4">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {(userProfile?.photos?.length > 0 || isDemo) && (
            <div className="h-48 overflow-hidden">
              <img src={isDemo ? DEMO_PROFILE.photos[0].url : userProfile?.photos?.[0]?.url} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold">{nickname}</h3>
              {effectiveHasMembership && <MembershipBadge membership={effectiveMembership} />}
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {(isDemo ? DEMO_PROFILE.interests : userProfile?.interests)?.slice(0, 5).map(i => <Badge key={i} variant="primary">{i}</Badge>)}
            </div>
            {(isDemo ? DEMO_PROFILE.introduction : userProfile?.introduction) && (
              <p className="text-sm text-gray-600 mt-3">{isDemo ? DEMO_PROFILE.introduction : userProfile?.introduction}</p>
            )}
          </div>
        </div>
        
        <button onClick={() => onNavigate?.('membership')} className="w-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl p-5 text-white text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="w-6 h-6" />
              <span className="font-bold">{effectiveHasMembership ? `${effectiveMembership?.name} 멤버십` : '멤버십 가입하기'}</span>
            </div>
            <span>→</span>
          </div>
          {!effectiveHasMembership && <p className="text-sm text-white/80 mt-1">나를 선택한 사람 확인, 무제한 매칭</p>}
          {effectiveHasMembership && <p className="text-sm text-white/80 mt-1">이용중 · 관리하기</p>}
        </button>
        
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Ticket className="w-5 h-5 text-purple-500" />
              <span className="font-bold">내 쿠폰</span>
            </div>
            <span className="text-purple-600 font-bold">{availableCoupons.length}개</span>
          </div>
          {availableCoupons.length > 0 && (
            <div className="mt-3 space-y-2">
              {availableCoupons.slice(0, 3).map(c => (
                <div key={c.id} className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                  <span className="text-sm">{c.name}</span>
                  <span className="font-bold text-purple-600">{c.amount?.toLocaleString()}원</span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50">
            <LogOut className="w-5 h-5 text-gray-400" />
            <span>로그아웃</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// 프로필 수정 화면
export const ProfileEditScreen = ({ onBack, isDemo }) => {
  const { userProfile, updateProfile, checkNicknameAvailable } = useAuth();
  const [form, setForm] = useState(() => {
    if (isDemo) return { ...DEMO_PROFILE };
    return {
      nickname: userProfile?.nickname || '',
      birthYear: userProfile?.birthYear || '',
      company: userProfile?.company || '',
      job: userProfile?.job || '',
      region: userProfile?.region || '',
      mbti: userProfile?.mbti || '',
      interests: userProfile?.interests || [],
      introduction: userProfile?.introduction || '',
      photos: userProfile?.photos || []
    };
  });
  const [showRegion, setShowRegion] = useState(false);
  const [showCompany, setShowCompany] = useState(false);
  const [showJob, setShowJob] = useState(false);
  const [showBirthYear, setShowBirthYear] = useState(false);
  const [saving, setSaving] = useState(false);
  const [nicknameError, setNicknameError] = useState('');
  const [nicknameChecked, setNicknameChecked] = useState(true); // 기존 닉네임이므로 true
  const [checkingNickname, setCheckingNickname] = useState(false);
  const [selectedIntros, setSelectedIntros] = useState([]);
  const fileRef = useRef(null);

  const originalNickname = userProfile?.nickname || (isDemo ? DEMO_PROFILE.nickname : '');

  // 자기소개 자동 추천
  const introExamples = useMemo(() => getIntroExamples(form.mbti, form.interests), [form.mbti, form.interests]);

  // 자기소개 예시 토글
  const toggleIntroExample = (ex) => {
    let newSelected;
    if (selectedIntros.includes(ex)) {
      newSelected = selectedIntros.filter(x => x !== ex);
    } else if (selectedIntros.length < 5) {
      newSelected = [...selectedIntros, ex];
    } else {
      return;
    }
    setSelectedIntros(newSelected);
    setForm(prev => ({ ...prev, introduction: newSelected.join('\n') }));
  };

  const validateNickname = (nickname) => {
    if (!nickname || nickname.length < 3) return { valid: false, error: '3글자 이상 입력해주세요' };
    if (nickname.length > 8) return { valid: false, error: '8글자 이하로 입력해주세요' };
    if (!/^[가-힣a-zA-Z]+$/.test(nickname)) return { valid: false, error: '한글/영문만 사용 가능합니다' };
    return { valid: true, error: '' };
  };

  const checkNickname = async () => {
    // 기존 닉네임과 같으면 체크 불필요
    if (form.nickname === originalNickname) {
      setNicknameChecked(true);
      setNicknameError('');
      return;
    }
    
    const result = validateNickname(form.nickname);
    if (!result.valid) {
      setNicknameError(result.error);
      return;
    }
    
    setCheckingNickname(true);
    setNicknameError('');
    
    try {
      if (isDemo) {
        await new Promise(r => setTimeout(r, 300));
        setNicknameChecked(true);
        return;
      }
      
      const isAvailable = await checkNicknameAvailable(form.nickname);
      if (isAvailable) {
        setNicknameChecked(true);
        setNicknameError('');
      } else {
        setNicknameError('이미 사용 중인 닉네임입니다');
      }
    } catch (error) {
      setNicknameChecked(true);
      setNicknameError('');
    } finally {
      setCheckingNickname(false);
    }
  };

  const handleNicknameChange = (e) => {
    const newNickname = e.target.value;
    setForm(prev => ({ ...prev, nickname: newNickname }));
    // 기존 닉네임과 같으면 체크된 상태 유지
    if (newNickname === originalNickname) {
      setNicknameChecked(true);
      setNicknameError('');
    } else {
      setNicknameChecked(false);
      setNicknameError('');
    }
  };

  const handlePhoto = (e) => {
    Array.from(e.target.files).forEach(f => {
      if (form.photos.length >= 6) return;
      const reader = new FileReader();
      reader.onload = (ev) => setForm(prev => ({ ...prev, photos: [...prev.photos, { id: Date.now() + Math.random(), url: ev.target.result }] }));
      reader.readAsDataURL(f);
    });
  };

  const toggleInterest = (i) => setForm(prev => ({ 
    ...prev, 
    interests: prev.interests.includes(i) 
      ? prev.interests.filter(x => x !== i) 
      : prev.interests.length < 10 
        ? [...prev.interests, i] 
        : prev.interests 
  }));

  const handleSave = async () => {
    if (form.nickname !== originalNickname && !nicknameChecked) {
      alert('닉네임 중복확인을 해주세요');
      return;
    }
    if (!form.birthYear || !form.company || !form.job || !form.region) {
      alert('필수 항목을 모두 선택해주세요');
      return;
    }
    if (form.interests.length < 3) {
      alert('관심사를 3개 이상 선택해주세요');
      return;
    }
    if (form.photos.length < 2) {
      alert('사진을 2장 이상 등록해주세요');
      return;
    }

    setSaving(true);
    try {
      if (!isDemo) {
        await updateProfile(form);
      }
      alert('프로필이 수정되었습니다');
      onBack?.();
    } catch (error) {
      console.error('Profile update error:', error);
      alert('프로필 수정 중 오류가 발생했습니다');
    } finally {
      setSaving(false);
    }
  };

  const selectedRegion = REGIONS.find(r => r.id === form.region);

  const SelectModal = ({ isOpen, onClose, title, options, value, onChange, searchable }) => {
    const [search, setSearch] = useState('');
    if (!isOpen) return null;
    const filtered = searchable ? options.filter(o => {
      const label = typeof o === 'string' ? o : `${o.city} ${o.district}`;
      return label.toLowerCase().includes(search.toLowerCase());
    }) : options;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        <div className="relative bg-white w-full max-w-md mx-4 rounded-2xl max-h-[70vh] overflow-hidden">
          <div className="border-b px-4 py-3 flex justify-between items-center"><h2 className="font-bold">{title}</h2><button onClick={onClose}><X className="w-5 h-5" /></button></div>
          <div className="p-4">
            {searchable && <input placeholder="검색" value={search} onChange={e => setSearch(e.target.value)} className="w-full px-4 py-3 border rounded-xl mb-3" />}
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {filtered.map((o, i) => {
                const val = typeof o === 'string' ? o : o.id;
                const label = typeof o === 'string' ? o : `${o.city} ${o.district}`;
                return <button key={i} onClick={() => { onChange(val); onClose(); }} className={`w-full text-left px-4 py-3 rounded-xl ${value === val ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100'}`}>{label}</button>;
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      {isDemo && <div className="bg-purple-500 text-white text-center py-2 text-sm">🎯 데모 모드</div>}
      <BackHeader title="프로필 수정" onBack={onBack} />
      
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* 사진 */}
        <div>
          <h3 className="font-bold mb-3">프로필 사진</h3>
          <div className="grid grid-cols-3 gap-3">
            {[...Array(6)].map((_, i) => {
              const photo = form.photos[i];
              return (
                <div key={i} className={`aspect-square rounded-2xl border-2 border-dashed flex items-center justify-center relative overflow-hidden ${i < 2 ? 'border-purple-400 bg-purple-50' : 'border-gray-200 bg-gray-50'}`}>
                  {photo ? (
                    <>
                      <img src={photo.url} alt="" className="w-full h-full object-cover" />
                      <button onClick={() => setForm(prev => ({ ...prev, photos: prev.photos.filter(p => p.id !== photo.id) }))} className="absolute top-1 right-1 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center">
                        <X className="w-4 h-4 text-white" />
                      </button>
                      {i === 0 && <span className="absolute bottom-1 left-1 text-[10px] bg-purple-500 text-white px-1.5 py-0.5 rounded-full">대표</span>}
                    </>
                  ) : (
                    <button onClick={() => fileRef.current?.click()} className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                      <Plus className="w-6 h-6" />
                      {i < 2 && <span className="text-[10px] mt-1">필수</span>}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          <input ref={fileRef} type="file" accept="image/*" multiple onChange={handlePhoto} className="hidden" />
        </div>

        {/* 기본 정보 */}
        <div className="space-y-4">
          <h3 className="font-bold">기본 정보</h3>
          <div>
            <label className="block text-sm font-medium mb-1">닉네임 *</label>
            <div className="flex gap-2">
              <input 
                placeholder="3~8글자, 한글/영문만" 
                value={form.nickname} 
                onChange={handleNicknameChange}
                className={`flex-1 min-w-0 px-3 py-3 border rounded-xl text-sm ${nicknameError ? 'border-red-500' : nicknameChecked ? 'border-green-500' : 'border-gray-200'}`} 
              />
              <button 
                onClick={checkNickname} 
                disabled={checkingNickname || form.nickname === originalNickname}
                className="px-3 py-3 bg-gray-100 rounded-xl text-sm whitespace-nowrap hover:bg-gray-200 disabled:opacity-50"
              >
                {checkingNickname ? '확인중...' : form.nickname === originalNickname ? '확인됨' : '중복확인'}
              </button>
            </div>
            {nicknameError && <p className="text-xs text-red-500 mt-1">{nicknameError}</p>}
            {nicknameChecked && !nicknameError && <p className="text-xs text-green-600 mt-1">✓ 사용 가능한 닉네임입니다</p>}
          </div>
          <div><label className="block text-sm font-medium mb-1">출생연도 *</label><button onClick={() => setShowBirthYear(true)} className="w-full flex items-center justify-between px-4 py-3 border rounded-xl border-gray-200"><span className={form.birthYear ? '' : 'text-gray-400'}>{form.birthYear || '선택'}</span><ChevronDown className="w-5 h-5 text-gray-400" /></button></div>
          <div><label className="block text-sm font-medium mb-1">회사 유형 *</label><button onClick={() => setShowCompany(true)} className="w-full flex items-center justify-between px-4 py-3 border rounded-xl border-gray-200"><span className={form.company ? '' : 'text-gray-400'}>{form.company || '선택'}</span><ChevronDown className="w-5 h-5 text-gray-400" /></button></div>
          <div><label className="block text-sm font-medium mb-1">직무 *</label><button onClick={() => setShowJob(true)} className="w-full flex items-center justify-between px-4 py-3 border rounded-xl border-gray-200"><span className={form.job ? '' : 'text-gray-400'}>{form.job || '선택'}</span><ChevronDown className="w-5 h-5 text-gray-400" /></button></div>
          <div><label className="block text-sm font-medium mb-1">거주지역 *</label><button onClick={() => setShowRegion(true)} className="w-full flex items-center justify-between px-4 py-3 border rounded-xl border-gray-200"><span className={selectedRegion ? '' : 'text-gray-400'}>{selectedRegion ? `${selectedRegion.city} ${selectedRegion.district}` : '선택'}</span><ChevronDown className="w-5 h-5 text-gray-400" /></button></div>
        </div>

        {/* MBTI & 관심사 */}
        <div className="space-y-4">
          <h3 className="font-bold">나의 성향</h3>
          <div>
            <label className="block text-sm font-medium mb-2">MBTI (선택)</label>
            <div className="grid grid-cols-4 gap-2">
              {MBTI_LIST.map(m => (
                <button 
                  key={m} 
                  onClick={() => setForm(prev => ({ ...prev, mbti: prev.mbti === m ? '' : m }))} 
                  className={`py-2 rounded-lg text-sm font-medium ${form.mbti === m ? 'bg-purple-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium">관심사 * (3~10개)</label>
              <span className="text-sm text-purple-600">{form.interests.length}/10</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map(i => (
                <button 
                  key={i} 
                  onClick={() => toggleInterest(i)} 
                  className={`px-3 py-1.5 rounded-full text-sm ${form.interests.includes(i) ? 'bg-purple-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 자기소개 */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">자기소개</label>
            {selectedIntros.length > 0 && (
              <span className="text-xs text-purple-600">{selectedIntros.length}/5 선택됨</span>
            )}
          </div>
          {/* 자기소개 자동 추천 - 최대 10개, 5개까지 다중 선택 */}
          {introExamples.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center gap-1 text-xs text-purple-600 mb-2">
                <Sparkles className="w-3 h-3" />
                <span>추천 문구 클릭하여 추가 (최대 5개)</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {introExamples.slice(0, 10).map((ex, i) => (
                  <button 
                    key={i}
                    onClick={() => toggleIntroExample(ex)}
                    className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                      selectedIntros.includes(ex) 
                        ? 'bg-purple-500 text-white' 
                        : selectedIntros.length >= 5 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
                    }`}
                    disabled={!selectedIntros.includes(ex) && selectedIntros.length >= 5}
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          )}
          <textarea 
            placeholder="추천 문구를 선택하거나 자유롭게 작성해주세요" 
            rows={4} 
            value={form.introduction} 
            onChange={e => setForm(prev => ({ ...prev, introduction: e.target.value }))} 
            className="w-full px-4 py-3 border border-gray-200 rounded-xl resize-none" 
          />
          <p className="text-xs text-gray-400 mt-1">추천 문구 선택 + 직접 입력 혼합 가능</p>
        </div>
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="max-w-md mx-auto flex gap-3">
          <Button variant="secondary" onClick={onBack} className="flex-1">취소</Button>
          <Button onClick={handleSave} loading={saving} className="flex-1">저장</Button>
        </div>
      </div>
      
      <SelectModal isOpen={showBirthYear} onClose={() => setShowBirthYear(false)} title="출생연도" options={BIRTH_YEARS.map(String)} value={form.birthYear} onChange={v => setForm(prev => ({ ...prev, birthYear: v }))} />
      <SelectModal isOpen={showCompany} onClose={() => setShowCompany(false)} title="회사 유형" options={COMPANY_TYPES} value={form.company} onChange={v => setForm(prev => ({ ...prev, company: v }))} />
      <SelectModal isOpen={showJob} onClose={() => setShowJob(false)} title="직무" options={JOB_TYPES} value={form.job} onChange={v => setForm(prev => ({ ...prev, job: v }))} />
      <SelectModal isOpen={showRegion} onClose={() => setShowRegion(false)} title="지역" options={REGIONS} value={form.region} onChange={v => setForm(prev => ({ ...prev, region: v }))} searchable />
    </div>
  );
};

export default ProfileViewScreen;
