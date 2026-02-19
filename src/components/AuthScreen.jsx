import React, { useState } from 'react';
import { Phone, ArrowRight, Eye, EyeOff, Lock, Mail, AlertTriangle, ExternalLink } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './CommonUI';

const AuthScreen = ({ onSuccess, onSkip, onDemo }) => {
  const { signIn, signUp, signInWithGoogle, sendVerificationCode, verifyCode, isInAppBrowser } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ email: '', phone: '', password: '', verificationCode: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);

  const isInApp = isInAppBrowser();

  const handleLogin = async () => {
    if (!form.email) { setError('이메일(아이디)을 입력해주세요'); return; }
    if (!form.password) { setError('비밀번호를 입력해주세요'); return; }
    setLoading(true); setError('');
    try {
      await signIn(form.email, form.password);
      onSuccess?.();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendCode = async () => {
    if (!form.phone || form.phone.length < 10) {
      setError('올바른 전화번호를 입력해주세요');
      return;
    }
    setSendingCode(true); setError('');
    try {
      await sendVerificationCode(form.phone);
      setCodeSent(true);
    } catch (e) {
      setError('인증번호 발송에 실패했습니다');
    } finally {
      setSendingCode(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!form.verificationCode || form.verificationCode.length !== 6) {
      setError('6자리 인증번호를 입력해주세요');
      return;
    }
    const isValid = await verifyCode(form.verificationCode);
    if (isValid) {
      setCodeVerified(true);
      setError('');
    } else {
      setError('인증번호가 일치하지 않습니다');
    }
  };

  const handleSignup = async () => {
    setError('');
    if (!codeVerified) { setError('휴대폰 인증을 완료해주세요'); return; }
    if (!form.email || !form.email.includes('@')) { setError('올바른 이메일(아이디)을 입력해주세요'); return; }
    if (!form.password || form.password.length < 6) { setError('비밀번호 6자 이상 입력해주세요'); return; }
    
    setLoading(true);
    setError('');
    try {
      await signUp(form.email, form.password, form.phone);
      onSuccess?.('signup', form);
    } catch (e) {
      setError(e.message || '회원가입에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true); 
    setError('');
    try {
      const result = await signInWithGoogle();
      if (result?.user) {
        onSuccess?.('signup', { provider: 'google', isNewUser: result.isNewUser });
      }
    } catch (e) {
      if (e.message === '로그인이 취소되었습니다') {
        setError('로그인이 취소되었습니다');
      } else if (e.code === 'auth/popup-blocked') {
        setError('팝업이 차단되었습니다. 팝업을 허용해주세요.');
      } else {
        setError(e.message || '구글 로그인 중 오류가 발생했습니다');
      }
    } finally {
      setLoading(false);
    }
  };

  const openInBrowser = () => {
    const url = window.location.href;
    // Try to open in external browser
    window.open(url, '_system');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 via-purple-500 to-blue-500">
      <div className="pt-8 pb-4 text-center text-white">
        <div className="text-3xl mb-1">✨</div>
        <h1 className="text-xl font-bold">원데이</h1>
        <p className="text-xs text-white/80">특별한 만남의 시작</p>
      </div>

      {/* 인앱 브라우저 경고 */}
      {isInApp && (
        <div className="mx-4 mb-4 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-800">인앱 브라우저 감지됨</p>
              <p className="text-xs text-yellow-700 mt-1">Google 로그인을 사용하려면 Safari나 Chrome에서 열어주세요.</p>
              <button onClick={openInBrowser} className="mt-2 flex items-center gap-1 text-xs text-purple-600 font-medium">
                <ExternalLink className="w-4 h-4" /> 브라우저로 열기
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mx-4 bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex border-b">
          <button onClick={() => { setMode('login'); setError(''); setCodeSent(false); setCodeVerified(false); }} className={`flex-1 py-4 text-sm font-medium ${mode === 'login' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-400'}`}>로그인</button>
          <button onClick={() => { setMode('signup'); setError(''); }} className={`flex-1 py-4 text-sm font-medium ${mode === 'signup' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-400'}`}>회원가입</button>
        </div>

        <div className="p-6">
          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>}

          {/* 로그인 */}
          {mode === 'login' && (
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="email" placeholder="이메일 (아이디)" value={form.email} onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))} className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl" />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type={showPw ? 'text' : 'password'} placeholder="비밀번호" value={form.password} onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))} className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2">{showPw ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}</button>
              </div>
              <Button onClick={handleLogin} loading={loading} className="w-full">로그인 <ArrowRight className="w-5 h-5" /></Button>
            </div>
          )}

          {/* 회원가입 - 한 화면에 모두 */}
          {mode === 'signup' && (
            <div className="space-y-4">
              {/* 휴대폰 인증 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">휴대폰 번호 *</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="tel" 
                      placeholder="01012345678" 
                      value={form.phone} 
                      onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))} 
                      disabled={codeVerified}
                      className={`w-full pl-12 pr-4 py-3 border rounded-xl ${codeVerified ? 'bg-green-50 border-green-300' : 'border-gray-200'}`} 
                    />
                  </div>
                  <button 
                    onClick={handleSendCode} 
                    disabled={sendingCode || codeVerified}
                    className={`px-4 py-3 rounded-xl font-medium whitespace-nowrap ${codeVerified ? 'bg-green-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                  >
                    {codeVerified ? '✓ 인증완료' : sendingCode ? '발송중...' : codeSent ? '재발송' : '인증요청'}
                  </button>
                </div>
              </div>

              {/* 인증번호 입력 */}
              {codeSent && !codeVerified && (
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="인증번호 6자리" 
                    maxLength={6}
                    value={form.verificationCode} 
                    onChange={e => setForm(prev => ({ ...prev, verificationCode: e.target.value }))} 
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-center tracking-widest" 
                  />
                  <button onClick={handleVerifyCode} className="px-4 py-3 bg-purple-500 text-white rounded-xl font-medium">확인</button>
                </div>
              )}

              {/* 이메일 (아이디) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">이메일 (아이디) *</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="email" placeholder="example@email.com" value={form.email} onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))} className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl" />
                </div>
                <p className="text-xs text-gray-400 mt-1">이메일이 로그인 아이디가 됩니다</p>
              </div>

              {/* 비밀번호 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호 *</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type={showPw ? 'text' : 'password'} placeholder="6자 이상" value={form.password} onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))} className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl" />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2">{showPw ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}</button>
                </div>
              </div>

              {/* 가입하기 버튼 */}
              <Button onClick={handleSignup} loading={loading} className="w-full" disabled={!codeVerified}>
                가입하기 <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          )}

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
            <div className="relative flex justify-center"><span className="px-4 bg-white text-sm text-gray-500">또는</span></div>
          </div>

          <Button variant="google" onClick={handleGoogle} loading={loading} className="w-full">
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Google로 시작하기
          </Button>

          {isInApp && (
            <p className="text-xs text-center text-gray-400 mt-2">
              * 인앱 브라우저에서는 Google 로그인이 제한될 수 있습니다
            </p>
          )}

          {mode === 'login' && (
            <p className="text-center text-sm text-gray-500 mt-4">
              계정이 없으신가요? <button onClick={() => { setMode('signup'); setError(''); }} className="text-purple-600 font-medium">회원가입</button>
            </p>
          )}
        </div>
      </div>

      <div className="mx-4 mt-4 space-y-3">
        <p className="text-center text-sm text-white/80">로그인하면 이런 것들이 가능해요</p>
        <div className="grid grid-cols-2 gap-2">
          {[{ icon: '📅', text: '클래스 예약' }, { icon: '💬', text: '매칭 & 채팅' }, { icon: '❤️', text: '찜하기' }, { icon: '👑', text: '멤버십 혜택' }].map((item, i) => (
            <div key={i} className="flex items-center gap-2 bg-white/10 backdrop-blur rounded-xl p-2.5">
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm text-white">{item.text}</span>
            </div>
          ))}
        </div>
        {onSkip && <button onClick={onSkip} className="w-full py-2.5 text-white/80 text-sm">로그인 없이 둘러보기</button>}
        {onDemo && <button onClick={onDemo} className="w-full py-2.5 bg-white/20 backdrop-blur rounded-xl text-white text-sm font-medium hover:bg-white/30 transition">🎯 데모 계정으로 전체 기능 체험하기</button>}
      </div>
      <div className="h-4" />
    </div>
  );
};

export default AuthScreen;
