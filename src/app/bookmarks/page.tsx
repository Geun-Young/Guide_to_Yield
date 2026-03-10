'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Star, Trash2, BookOpen, ChevronRight, 
  Search, Eye, EyeOff 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import wordsData from '@/data/words.json';
import { Word, CourseData } from '@/types/word';

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [bookmarkedWords, setBookmarkedWords] = useState<Word[]>([]);
  const [showAllMeanings, setShowAllMeanings] = useState(false);
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());

  // 데이터 로드 및 북마크 필터링
  useEffect(() => {
    const saved = localStorage.getItem('wordflow_bookmarks');
    if (saved) {
      const ids = JSON.parse(saved) as string[];
      setBookmarks(ids);
      
      const allWords = [
        ...(wordsData as unknown as CourseData).toeic_course,
        ...(wordsData as unknown as CourseData).business_course
      ];
      
      const filtered = allWords.filter(word => ids.includes(word.id));
      setBookmarkedWords(filtered);
    }
  }, []);

  // 개별 뜻 토글
  const toggleReveal = (id: string) => {
    const newRevealed = new Set(revealedIds);
    if (newRevealed.has(id)) {
      newRevealed.delete(id);
    } else {
      newRevealed.add(id);
    }
    setRevealedIds(newRevealed);
  };

  // 북마크 삭제
  const removeBookmark = (id: string) => {
    const updatedIds = bookmarks.filter(bid => bid !== id);
    setBookmarks(updatedIds);
    localStorage.setItem('wordflow_bookmarks', JSON.stringify(updatedIds));
    setBookmarkedWords(prev => prev.filter(w => w.id !== id));
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto max-w-3xl px-4 py-12">
        {/* 상단 헤더 섹션 */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link href="/" className="mb-2 flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-primary transition-colors">
              <ArrowLeft size={16} />
              <span>메인으로</span>
            </Link>
            <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
              내 단어장 
              <span className="text-sm font-bold bg-pastel-yellow text-amber-600 px-3 py-1 rounded-full">
                {bookmarkedWords.length}
              </span>
            </h1>
          </div>

          {bookmarkedWords.length > 0 && (
            <button 
              onClick={() => setShowAllMeanings(!showAllMeanings)}
              className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-gray-700 shadow-sm border border-gray-100 hover:bg-gray-50 transition-all"
            >
              {showAllMeanings ? (
                <><EyeOff size={18} /> 모두 숨기기</>
              ) : (
                <><Eye size={18} /> 모두 보기</>
              )}
            </button>
          )}
        </div>

        {/* 북마크 목록 */}
        {bookmarkedWords.length > 0 ? (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {bookmarkedWords.map((word, index) => (
                <motion.div
                  key={word.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="group relative flex flex-col sm:flex-row sm:items-center justify-between rounded-3xl border border-white/50 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-3">
                      <h3 className="text-xl font-bold text-gray-900">{word.word}</h3>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50 px-2 py-0.5 rounded">
                        {word.source.split(' ')[0]}
                      </span>
                    </div>
                    
                    <div className="min-h-[1.5rem]">
                      {(showAllMeanings || revealedIds.has(word.id)) ? (
                        <p className="text-indigo-600 font-medium">{word.meaning}</p>
                      ) : (
                        <button 
                          onClick={() => toggleReveal(word.id)}
                          className="text-xs font-semibold text-gray-300 hover:text-gray-400 flex items-center gap-1 py-1 transition-colors"
                        >
                          뜻 보기 <ChevronRight size={14} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between sm:mt-0 sm:ml-4 sm:justify-end gap-3">
                    <button 
                      onClick={() => toggleReveal(word.id)}
                      className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                    >
                      {revealedIds.has(word.id) ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                    <button 
                      onClick={() => removeBookmark(word.id)}
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition-all ml-auto sm:ml-0"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          /* 비어 있음 화면 (Empty State) */
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center rounded-[3rem] bg-white p-20 text-center shadow-xl border border-white/50"
          >
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-pastel-yellow text-amber-500">
              <Star size={48} fill="currentColor" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900">단어장이 비어있어요</h2>
            <p className="mb-10 text-gray-500 max-w-xs mx-auto">
              학습 중에 모르는 단어나 중요한 단어를 <br />
              별표 아이콘을 눌러 저장해 보세요!
            </p>
            <Link 
              href="/"
              className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-primary-dark active:scale-95"
            >
              <BookOpen size={20} /> 학습하러 가기
            </Link>
          </motion.div>
        )}
      </main>
    </div>
  );
}
