import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { auth, db, googleProvider } from '../lib/firebase';
import { 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  arrayUnion,
  arrayRemove,
  serverTimestamp
} from 'firebase/firestore';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [membership, setMembership] = useState(null);

  // 사용자 프로필 로드
  const loadUserProfile = useCallback(async (firebaseUser) => {
    try {
      const profileDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (profileDoc.exists()) {
        const profileData = profileDoc.data();
        setUserProfile(profileData);
        setFavorites(profileData.favorites || []);
        setCoupons(profileData.coupons || []);
        setMembership(profileData.membership || null);
        return profileData;
      }
      return null;
    } catch (error) {
      console.error('Load profile error:', error);
      return null;
    }
  }, []);

  // 새 사용자 프로필 생성
  const createUserProfile = useCallback(async (firebaseUser, provider, phone = null) => {
    const welcomeCoupon = { 
      id: 'welcome_' + Date.now(), 
      name: '회원가입 기념 5,000원', 
      amount: 5000, 
      used: false, 
      createdAt: new Date().toISOString() 
    };
    
    const profileData = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName || null,
      photoURL: firebaseUser.photoURL || null,
      phone: phone,
      provider: provider,
      createdAt: serverTimestamp(),
      profileComplete: false,
      favorites: [],
      coupons: [welcomeCoupon],
      membership: null
    };
    
    await setDoc(doc(db, 'users', firebaseUser.uid), profileData);
    
    setUserProfile(profileData);
    setCoupons([welcomeCoupon]);
    setFavorites([]);
    setMembership(null);
    
    return profileData;
  }, []);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser?.email);
      
      if (firebaseUser) {
        setUser(firebaseUser);
        await loadUserProfile(firebaseUser);
      } else {
        setUser(null);
        setUserProfile(null);
        setFavorites([]);
        setCoupons([]);
        setMembership(null);
      }
      setIsLoading(false);
    });

    getRedirectResult(auth).then(async (result) => {
      if (result?.user) {
        const profileDoc = await getDoc(doc(db, 'users', result.user.uid));
        if (!profileDoc.exists()) {
          await createUserProfile(result.user, 'google');
        }
      }
    }).catch(console.error);

    return () => unsubscribe();
  }, [loadUserProfile, createUserProfile]);

  const isInAppBrowser = () => {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    return /KAKAOTALK|NAVER|Line|Instagram|FB_IAB|FBAN|FBAV|Twitter/i.test(ua);
  };

  // Google Sign In
  const signInWithGoogle = () => {
    return new Promise((resolve, reject) => {
      if (isInAppBrowser()) {
        signInWithRedirect(auth, googleProvider).catch(reject);
        resolve(null);
        return;
      }

      signInWithPopup(auth, googleProvider)
        .then(async (result) => {
          const profileDoc = await getDoc(doc(db, 'users', result.user.uid));
          const isNewUser = !profileDoc.exists();
          if (isNewUser) {
            await createUserProfile(result.user, 'google');
          }
          resolve({ user: result.user, isNewUser });
        })
        .catch((error) => {
          if (error.message?.includes('Cross-Origin-Opener-Policy') || 
              error.message?.includes('window.closed') ||
              error.code === 'auth/popup-closed-by-user') {
            setTimeout(async () => {
              const currentUser = auth.currentUser;
              if (currentUser) {
                const profileDoc = await getDoc(doc(db, 'users', currentUser.uid));
                const isNewUser = !profileDoc.exists();
                if (isNewUser) {
                  await createUserProfile(currentUser, 'google');
                }
                resolve({ user: currentUser, isNewUser });
              } else {
                reject(new Error('로그인이 취소되었습니다'));
              }
            }, 1500);
            return;
          }
          reject(error);
        });
    });
  };

  // 휴대폰 인증
  const sendVerificationCode = async (phone) => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    sessionStorage.setItem('verificationCode', code);
    sessionStorage.setItem('verificationPhone', phone);
    console.log('📱 인증번호:', code);
    alert(`테스트용 인증번호: ${code}`);
    return true;
  };

  const verifyCode = async (inputCode) => {
    const storedCode = sessionStorage.getItem('verificationCode');
    return inputCode === storedCode;
  };

  // 이메일 회원가입
  const signUp = async (email, password, phone) => {
    try {
      const phoneQuery = query(collection(db, 'users'), where('phone', '==', phone));
      const phoneSnapshot = await getDocs(phoneQuery);
      if (!phoneSnapshot.empty) {
        throw new Error('이미 가입된 전화번호입니다');
      }
    } catch (error) {
      if (error.message === '이미 가입된 전화번호입니다') throw error;
    }

    let firebaseUser;
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      firebaseUser = result.user;
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') throw new Error('이미 가입된 이메일입니다');
      if (error.code === 'auth/weak-password') throw new Error('비밀번호가 너무 약합니다 (6자 이상)');
      if (error.code === 'auth/invalid-email') throw new Error('올바른 이메일 형식이 아닙니다');
      throw new Error('회원가입 실패: ' + error.message);
    }

    try {
      await createUserProfile(firebaseUser, 'email', phone);
    } catch (error) {
      console.error('Profile create error:', error);
    }

    return firebaseUser;
  };

  // 이메일 로그인
  const signIn = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error) {
      if (error.code === 'auth/user-not-found') throw new Error('가입되지 않은 이메일입니다');
      if (error.code === 'auth/wrong-password') throw new Error('비밀번호가 올바르지 않습니다');
      if (error.code === 'auth/invalid-credential') throw new Error('이메일 또는 비밀번호가 올바르지 않습니다');
      throw new Error('로그인 실패: ' + error.message);
    }
  };

  // 로그아웃
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setUserProfile(null);
      setFavorites([]);
      setCoupons([]);
      setMembership(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // 프로필 업데이트
  const updateProfile = async (profileData) => {
    if (!user) return;
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        ...profileData,
        profileComplete: true,
        updatedAt: serverTimestamp()
      });
      
      const updatedDoc = await getDoc(userRef);
      const newData = updatedDoc.data();
      setUserProfile(newData);
      setCoupons(newData.coupons || []);
      setMembership(newData.membership || null);
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  // 닉네임 중복 확인 (타임아웃 포함)
  const checkNicknameAvailable = async (nickname) => {
    try {
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('timeout')), 5000)
      );
      
      const checkPromise = (async () => {
        const nicknameQuery = query(collection(db, 'users'), where('nickname', '==', nickname));
        const snapshot = await getDocs(nicknameQuery);
        return snapshot.empty;
      })();
      
      return await Promise.race([checkPromise, timeoutPromise]);
    } catch (error) {
      console.error('Nickname check error:', error);
      return true; // 타임아웃이나 오류 시 통과
    }
  };

  // 찜하기 토글
  const toggleFavorite = async (classId) => {
    if (!user) {
      // 로컬 상태만 변경 (데모용)
      setFavorites(prev => 
        prev.includes(classId) ? prev.filter(id => id !== classId) : [...prev, classId]
      );
      return;
    }
    try {
      const userRef = doc(db, 'users', user.uid);
      if (favorites.includes(classId)) {
        await updateDoc(userRef, { favorites: arrayRemove(classId) });
        setFavorites(prev => prev.filter(id => id !== classId));
      } else {
        await updateDoc(userRef, { favorites: arrayUnion(classId) });
        setFavorites(prev => [...prev, classId]);
      }
    } catch (error) {
      console.error('Toggle favorite error:', error);
    }
  };

  // 쿠폰 사용
  const useCoupon = async (couponId) => {
    if (!user) {
      setCoupons(prev => prev.map(c => c.id === couponId ? { ...c, used: true } : c));
      return;
    }
    try {
      const userRef = doc(db, 'users', user.uid);
      const updatedCoupons = coupons.map(c => c.id === couponId ? { ...c, used: true } : c);
      await updateDoc(userRef, { coupons: updatedCoupons });
      setCoupons(updatedCoupons);
    } catch (error) {
      console.error('Use coupon error:', error);
    }
  };

  // 멤버십 구매
  const purchaseMembership = async (plan, coupon = null) => {
    const membershipData = {
      plan: plan.id,
      name: plan.name,
      price: plan.price,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + plan.duration * 24 * 60 * 60 * 1000).toISOString(),
      features: plan.features
    };
    
    if (!user) {
      // 데모 모드
      if (coupon) {
        setCoupons(prev => prev.map(c => c.id === coupon.id ? { ...c, used: true } : c));
      }
      setMembership(membershipData);
      return membershipData;
    }
    
    try {
      const userRef = doc(db, 'users', user.uid);
      
      if (coupon) {
        const updatedCoupons = coupons.map(c => c.id === coupon.id ? { ...c, used: true } : c);
        await updateDoc(userRef, { membership: membershipData, coupons: updatedCoupons });
        setCoupons(updatedCoupons);
      } else {
        await updateDoc(userRef, { membership: membershipData });
      }
      
      setMembership(membershipData);
      return membershipData;
    } catch (error) {
      console.error('Purchase membership error:', error);
      throw error;
    }
  };

  // 멤버십 해지
  const cancelMembership = async () => {
    if (!user) {
      setMembership(null);
      return;
    }
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { membership: null });
      setMembership(null);
    } catch (error) {
      console.error('Cancel membership error:', error);
      throw error;
    }
  };

  const isAuthenticated = !!user;
  const isProfileComplete = userProfile?.profileComplete || false;
  const hasMembership = membership && new Date(membership.endDate) > new Date();

  return (
    <AuthContext.Provider value={{
      user,
      userProfile,
      isAuthenticated,
      isProfileComplete,
      isLoading,
      favorites,
      coupons,
      membership,
      hasMembership,
      signInWithGoogle,
      sendVerificationCode,
      verifyCode,
      signUp,
      signIn,
      signOut,
      updateProfile,
      checkNicknameAvailable,
      toggleFavorite,
      useCoupon,
      purchaseMembership,
      cancelMembership,
      isInAppBrowser
    }}>
      {children}
    </AuthContext.Provider>
  );
};
