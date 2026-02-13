import React, { useState } from 'react';
import { Star, X } from 'lucide-react';
import { Button } from './CommonUI';

export const ReviewList = ({ reviews = [], rating, reviewCount }) => (
  <div>
    <div className="flex items-center gap-2 mb-4">
      <div className="flex items-center gap-1">{[1,2,3,4,5].map(i => <Star key={i} className={`w-5 h-5 ${i <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />)}</div>
      <span className="font-bold">{rating}</span>
      <span className="text-sm text-gray-500">({reviewCount}개)</span>
    </div>
    <div className="space-y-4">
      {reviews.slice(0, 3).map(r => (
        <div key={r.id} className="border-b pb-4">
          <div className="flex items-center justify-between mb-2"><span className="font-medium">{r.userName}</span><div className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /><span className="text-sm">{r.rating}</span></div></div>
          <p className="text-sm text-gray-600">{r.content}</p>
          <span className="text-xs text-gray-400">{r.date}</span>
        </div>
      ))}
    </div>
  </div>
);

export const ReviewWriteModal = ({ isOpen, onClose, classInfo, onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  if (!isOpen) return null;
  const handleSubmit = () => { if (!content.trim()) { alert('내용을 입력해주세요'); return; } onSubmit({ rating, content }); setRating(5); setContent(''); };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b"><h3 className="font-bold">후기 작성</h3><button onClick={onClose}><X className="w-6 h-6" /></button></div>
        <div className="p-4 space-y-4">
          <div className="text-center"><p className="text-sm text-gray-500 mb-2">클래스 어떠셨나요?</p><div className="flex items-center justify-center gap-2">{[1,2,3,4,5].map(i => <button key={i} onClick={() => setRating(i)}><Star className={`w-8 h-8 ${i <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} /></button>)}</div></div>
          <textarea placeholder="클래스 경험을 공유해주세요" value={content} onChange={e => setContent(e.target.value)} rows={4} className="w-full px-4 py-3 border rounded-xl resize-none" />
          <Button onClick={handleSubmit} className="w-full">후기 등록</Button>
        </div>
      </div>
    </div>
  );
};
