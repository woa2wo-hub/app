import React from 'react';
import { Home, Heart, Calendar, MessageCircle, User, ArrowLeft, X, Star, Loader2, Crown } from 'lucide-react';

export const BottomNav = ({ current, onChange, matchCount = 0, isAuthenticated, hasMembership }) => {
  const items = [
    { id: 'home', icon: Home, label: '홈' },
    { id: 'favorites', icon: Heart, label: '찜' },
    { id: 'mypage', icon: Calendar, label: '내 클래스' },
    { id: 'chat', icon: MessageCircle, label: '채팅', badge: matchCount },
    { id: 'profile', icon: User, label: '프로필' },
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t z-50">
      <div className="max-w-md mx-auto flex justify-around py-2">
        {items.map(item => (
          <button key={item.id} onClick={() => isAuthenticated || item.id === 'home' ? onChange(item.id) : onChange('login')} className={`flex flex-col items-center py-1 px-3 relative ${current === item.id ? 'text-gray-900' : 'text-gray-400'}`}>
            <item.icon className="w-6 h-6" />
            <span className="text-xs mt-1">{item.label}</span>
            {item.badge > 0 && <span className="absolute -top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">{item.badge}</span>}
          </button>
        ))}
      </div>
    </nav>
  );
};

export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
        {title && (
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-bold text-lg">{title}</h3>
            <button onClick={onClose}><X className="w-6 h-6" /></button>
          </div>
        )}
        <div className="overflow-y-auto max-h-[calc(80vh-60px)]">{children}</div>
      </div>
    </div>
  );
};

export const Button = ({ children, variant = 'primary', loading, className = '', ...props }) => {
  const base = 'px-4 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition disabled:opacity-50';
  const variants = {
    primary: 'bg-gray-900 text-white hover:bg-gray-800',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    google: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50',
    premium: 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700',
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} disabled={loading} {...props}>
      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : children}
    </button>
  );
};

export const Input = ({ label, error, ...props }) => (
  <div>
    {label && <label className="block text-sm font-medium mb-1">{label}</label>}
    <input className={`w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-purple-500 ${error ? 'border-red-500' : 'border-gray-200'}`} {...props} />
    {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
  </div>
);

export const BackHeader = ({ title, onBack, right }) => (
  <div className="sticky top-0 z-20 bg-white border-b">
    <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
      <button onClick={onBack} className="p-1"><ArrowLeft className="w-6 h-6" /></button>
      <h2 className="font-bold">{title}</h2>
      <div className="w-8">{right}</div>
    </div>
  </div>
);

export const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
      <Icon className="w-8 h-8 text-gray-400" />
    </div>
    <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-sm text-gray-500 mb-4">{description}</p>
    {action}
  </div>
);

export const LoadingSpinner = ({ size = 'md' }) => {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return <Loader2 className={`${sizes[size]} animate-spin text-purple-500`} />;
};

export const Badge = ({ children, variant = 'default' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    primary: 'bg-purple-100 text-purple-700',
    premium: 'bg-gradient-to-r from-purple-500 to-blue-500 text-white',
  };
  return <span className={`px-2 py-1 rounded-full text-xs font-medium ${variants[variant]}`}>{children}</span>;
};

export const MembershipBadge = ({ membership }) => {
  if (!membership) return null;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full">
      <Crown className="w-3 h-3" />
      {membership.name}
    </span>
  );
};
