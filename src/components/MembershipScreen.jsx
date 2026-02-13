import React, { useState } from 'react';
import { Check, Crown, X, CreditCard, Ticket, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button, Modal, BackHeader } from './CommonUI';
import { MEMBERSHIP_PLANS } from '../data/dummyData';

export const MembershipScreen = ({ onBack, isDemo, demoCoupons, setDemoCoupons, demoMembership, setDemoMembership }) => {
  const { membership, hasMembership, purchaseMembership, cancelMembership, coupons } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [showCoupons, setShowCoupons] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCancelSuccess, setShowCancelSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // 데모 모드 지원
  const effectiveMembership = isDemo ? demoMembership : membership;
  const effectiveHasMembership = isDemo 
    ? (effectiveMembership && new Date(effectiveMembership.endDate) > new Date()) 
    : hasMembership;
  const effectiveCoupons = isDemo ? (demoCoupons || []) : (coupons || []);
  const availableCoupons = effectiveCoupons.filter(c => !c.used);
  const discount = selectedCoupon?.amount || 0;
  const finalPrice = selectedPlan ? Math.max(0, selectedPlan.price - discount) : 0;

  const getRemainingDays = () => {
    if (!effectiveMembership?.endDate) return 0;
    const diff = new Date(effectiveMembership.endDate) - new Date();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const handlePurchase = async () => {
    if (!selectedPlan) return;
    setProcessing(true);
    try {
      const membershipData = {
        plan: selectedPlan.id,
        name: selectedPlan.name,
        price: selectedPlan.price,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + selectedPlan.duration * 24 * 60 * 60 * 1000).toISOString(),
        features: selectedPlan.features
      };
      
      if (isDemo) {
        // 데모 모드: 로컬 상태 업데이트
        if (selectedCoupon) {
          setDemoCoupons(prev => prev.map(c => c.id === selectedCoupon.id ? { ...c, used: true } : c));
        }
        setDemoMembership(membershipData);
      } else {
        // 실제 모드: Firebase 업데이트
        await purchaseMembership(selectedPlan, selectedCoupon);
      }
      
      setSuccessMessage(`${selectedPlan.name} 멤버십 ${effectiveHasMembership ? '변경' : '구매'}`);
      setShowPayment(false);
      setSelectedPlan(null);
      setSelectedCoupon(null);
      setShowSuccess(true);
    } catch (e) {
      alert('결제 실패: ' + e.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleCancel = async () => {
    setProcessing(true);
    try {
      if (isDemo) {
        setDemoMembership(null);
      } else {
        await cancelMembership();
      }
      setShowCancel(false);
      setShowCancelSuccess(true);
    } catch (e) {
      alert('해지 실패: ' + e.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <BackHeader title="멤버십" onBack={onBack} />
      
      <div className="max-w-md mx-auto px-4 py-6">
        {/* 현재 멤버십 상태 */}
        {effectiveHasMembership && effectiveMembership && (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-5 text-white mb-6 relative overflow-hidden">
            <div className="absolute top-3 right-3">
              <span className="bg-white/30 backdrop-blur px-3 py-1 rounded-full text-xs font-bold">
                ✓ 가입중
              </span>
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-6 h-6" />
              <span className="font-bold text-lg">{effectiveMembership.name} 멤버십</span>
            </div>
            
            <p className="text-sm text-white/90">
              {new Date(effectiveMembership.endDate).toLocaleDateString('ko-KR')}까지 ({getRemainingDays()}일 남음)
            </p>
            
            <div className="mt-3 flex flex-wrap gap-2">
              {effectiveMembership.features?.slice(0, 3).map((f, i) => (
                <span key={i} className="text-xs bg-white/20 px-2 py-1 rounded-full">{f}</span>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-white/20 flex gap-2">
              <button 
                onClick={() => setShowCancel(true)}
                className="flex-1 py-2 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30"
              >
                해지하기
              </button>
              <button 
                onClick={() => {
                  const otherPlans = MEMBERSHIP_PLANS.filter(p => p.id !== effectiveMembership?.plan);
                  if (otherPlans.length > 0) setSelectedPlan(otherPlans[0]);
                  setShowPayment(true);
                }}
                className="flex-1 py-2 bg-white rounded-lg text-orange-500 text-sm font-bold hover:bg-white/90"
              >
                플랜 변경
              </button>
            </div>
          </div>
        )}

        <h2 className="font-bold text-lg mb-4">
          {effectiveHasMembership ? '다른 플랜으로 변경' : '멤버십 가입'}
        </h2>
        
        <div className="space-y-4">
          {MEMBERSHIP_PLANS.map(plan => {
            const isCurrentPlan = effectiveHasMembership && effectiveMembership?.plan === plan.id;
            
            return (
              <div 
                key={plan.id} 
                onClick={() => !isCurrentPlan && setSelectedPlan(plan)}
                className={`relative bg-white rounded-2xl p-5 transition-all ${
                  isCurrentPlan 
                    ? 'ring-2 ring-orange-400 cursor-default'
                    : selectedPlan?.id === plan.id 
                      ? 'ring-2 ring-purple-500 shadow-lg cursor-pointer' 
                      : 'border border-gray-200 hover:border-purple-300 cursor-pointer'
                }`}
              >
                {isCurrentPlan && (
                  <div className="absolute -top-3 left-4">
                    <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      현재 플랜
                    </span>
                  </div>
                )}
                
                {plan.popular && !isCurrentPlan && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      인기
                    </span>
                  </div>
                )}
                
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-lg">{plan.name}</h3>
                    <p className="text-2xl font-bold text-purple-600">
                      {plan.price.toLocaleString()}원
                      <span className="text-sm text-gray-500 font-normal">/월</span>
                    </p>
                  </div>
                  {!isCurrentPlan && (
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedPlan?.id === plan.id 
                        ? 'border-purple-500 bg-purple-500' 
                        : 'border-gray-300'
                    }`}>
                      {selectedPlan?.id === plan.id && <Check className="w-4 h-4 text-white" />}
                    </div>
                  )}
                  {isCurrentPlan && (
                    <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                
                <ul className="space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {!effectiveHasMembership && (
          <div className="mt-6">
            <Button 
              variant="premium" 
              onClick={() => selectedPlan && setShowPayment(true)} 
              disabled={!selectedPlan}
              className="w-full"
            >
              <Crown className="w-5 h-5" />
              {selectedPlan ? `${selectedPlan.name} 멤버십 시작하기` : '플랜을 선택하세요'}
            </Button>
          </div>
        )}

        <div className="mt-8 bg-purple-50 rounded-2xl p-5">
          <h3 className="font-bold mb-3">✨ 멤버십 혜택</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• 나를 선택한 참가자 바로 확인</li>
            <li>• 무제한 매칭으로 더 많은 인연 만들기</li>
            <li>• 프로필 우선 노출로 매칭 확률 UP</li>
            <li>• 멤버십 전용 할인 쿠폰 지급</li>
          </ul>
        </div>
      </div>

      {/* 결제 모달 */}
      <Modal isOpen={showPayment} onClose={() => setShowPayment(false)} title={effectiveHasMembership ? "플랜 변경" : "결제하기"}>
        <div className="p-5 space-y-4">
          {selectedPlan && (
            <>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">상품</span>
                  <span className="font-medium">{selectedPlan.name} 멤버십</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">가격</span>
                  <span>{selectedPlan.price.toLocaleString()}원</span>
                </div>
                
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">할인 쿠폰</span>
                  <button 
                    onClick={() => setShowCoupons(true)}
                    className="text-purple-600 text-sm font-medium"
                  >
                    {selectedCoupon ? `-${selectedCoupon.amount.toLocaleString()}원` : availableCoupons.length > 0 ? '쿠폰 선택' : '없음'}
                  </button>
                </div>
                
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold">최종 결제 금액</span>
                    <span className="font-bold text-purple-600 text-lg">
                      {finalPrice.toLocaleString()}원
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">결제 수단</h4>
                <div className="space-y-2">
                  {['신용/체크카드', '카카오페이', '네이버페이', '토스'].map(method => (
                    <label key={method} className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50">
                      <input type="radio" name="payment" defaultChecked={method === '신용/체크카드'} className="accent-purple-500" />
                      <CreditCard className="w-5 h-5 text-gray-400" />
                      <span>{method}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Button onClick={handlePurchase} loading={processing} className="w-full">
                {finalPrice.toLocaleString()}원 결제하기
              </Button>
              
              <p className="text-xs text-gray-400 text-center">
                결제 시 이용약관에 동의합니다.
              </p>
            </>
          )}
        </div>
      </Modal>

      {/* 해지 확인 모달 */}
      <Modal isOpen={showCancel} onClose={() => setShowCancel(false)} title="멤버십 해지">
        <div className="p-5 space-y-4">
          <div className="bg-red-50 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-800">정말 해지하시겠어요?</p>
              <p className="text-sm text-red-600 mt-1">
                {getRemainingDays()}일 남은 혜택을 더 이상 이용할 수 없습니다.
              </p>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="font-medium mb-2">해지 시 사라지는 혜택:</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 나를 선택한 참가자 확인</li>
              <li>• 무제한 매칭</li>
              <li>• 프로필 우선 노출</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setShowCancel(false)} className="flex-1">
              취소
            </Button>
            <button 
              onClick={handleCancel} 
              disabled={processing}
              className="flex-1 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 disabled:opacity-50"
            >
              {processing ? '처리중...' : '해지하기'}
            </button>
          </div>
        </div>
      </Modal>

      {/* 쿠폰 선택 모달 */}
      <Modal isOpen={showCoupons} onClose={() => setShowCoupons(false)} title="쿠폰 선택">
        <div className="p-4">
          {availableCoupons.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Ticket className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>사용 가능한 쿠폰이 없습니다</p>
            </div>
          ) : (
            <div className="space-y-2">
              <button
                onClick={() => { setSelectedCoupon(null); setShowCoupons(false); }}
                className={`w-full p-4 border rounded-xl text-left ${!selectedCoupon ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}`}
              >
                <span className="text-gray-600">쿠폰 사용 안함</span>
              </button>
              {availableCoupons.map(coupon => (
                <button
                  key={coupon.id}
                  onClick={() => { setSelectedCoupon(coupon); setShowCoupons(false); }}
                  className={`w-full p-4 border rounded-xl text-left ${
                    selectedCoupon?.id === coupon.id ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
                  }`}
                >
                  <div className="font-bold text-purple-600">{coupon.amount?.toLocaleString()}원 할인</div>
                  <div className="text-sm text-gray-600">{coupon.name}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </Modal>

      {/* 결제 완료 모달 */}
      <Modal isOpen={showSuccess} onClose={() => { setShowSuccess(false); onBack?.(); }}>
        <div className="p-6 text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h3 className="text-xl font-bold mb-2">{successMessage} 완료!</h3>
          <p className="text-gray-600 mb-4">멤버십 혜택을 바로 이용하실 수 있습니다</p>
          <Button onClick={() => { setShowSuccess(false); onBack?.(); }} className="w-full">확인</Button>
        </div>
      </Modal>

      {/* 해지 완료 모달 */}
      <Modal isOpen={showCancelSuccess} onClose={() => setShowCancelSuccess(false)}>
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-xl font-bold mb-2">멤버십 해지 완료</h3>
          <p className="text-gray-600 mb-4">멤버십이 해지되었습니다.<br/>언제든 다시 가입하실 수 있어요!</p>
          <Button onClick={() => setShowCancelSuccess(false)} className="w-full">확인</Button>
        </div>
      </Modal>
    </div>
  );
};

export default MembershipScreen;
