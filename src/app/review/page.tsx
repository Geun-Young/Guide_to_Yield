'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, CheckCircle2, RotateCcw, 
  BookOpen, Send, History, Trophy, Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import wordsData from '@/data/words.json';
import { Word, CourseData } from '@/types/word';

export default function ReviewPage() {
  const [wrongWordIds, setWrongWordIds] = useState<string[]>([]);
  const [wrongWords, setWrongWords] = useState<Word[]>([]);
  const [userInput, setUserInput] = useState<{ [key: string]: string }>({});
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());

  // 오답 데이터 로드
  useEffect(() => {
    const saved = localStorage.getItem('wordflow_wrong_words');
    if (saved) {
      const ids = JSON.parse(saved) as string[];
      setWrongWordIds(ids);
      
      const allWords = [
        ...(wordsData as unknown as CourseData).toeic_course,
        ...(wordsData as unknown as CourseData).business_course
      ];
      
      const filtered = allWords.filter(word => ids.includes(word.id));
      setWrongWords(filtered);
    }
  }, []);

  // 정답 체크 및 삭제 로직
  const handleCheck = (word: Word) => {
    const input = userInput[word.id]?.trim().toLowerCase() || '';
    if (input === word.blank_answer.toLowerCase()) {
      // 정답일 경우 리스트에서 제거
      const updatedIds = wrongWordIds.filter(id => id !== word.id);
      setWrongWordIds(updatedIds);
      localStorage.setItem('wordflow_wrong_words', JSON.stringify(updatedIds));
      
      // 화면에서도 제거 (애니메이션과 함께)
      setWrongWords(prev => prev.filter(w => w.id !== word.id));
      
      // 입력값 초기화
      const newInputs = { ...userInput };
      delete newInputs[word.id];
      setUserInput(newInputs);
    }
  };

  const toggleReveal = (id: string) => {
    const newRevealed = new Set(revealedIds);
    if (newRevealed.has(id)) newRevealed.delete(id);
    else newRevealed.add(id);
    setRevealedIds(newRevealed);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto max-w-3xl px-4 py-12">
        {/* 상단 헤더 섹션 */}
        <div className="mb-10">
          <Link href="/" className="mb-2 flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-primary transition-colors">
            <ArrowLeft size={16} />
            <span>메인으로</span>
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            복습 단어장 
            <span className="text-sm font-bold bg-pastel-red text-red-500 px-3 py-1 rounded-full">
              {wrongWords.length}
            </span>
          </h1>
          <p className="mt-2 text-gray-500">틀렸던 단어들을 다시 한번 복습해 보세요. 맞히면 목록에서 사라집니다!</p>
        </div>

        {/* 오답 목록 */}
        {wrongWords.length > 0 ? (
          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {wrongWords.map((word, index) => (
                <motion.div
                  key={word.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-3xl border border-gray-100 bg-white p-6 shadow-md"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-black text-gray-900 mb-1">{word.meaning}</h3>
                      <p className="text-sm text-gray-400 font-medium">{word.source}</p>
                    </div>
                    <button 
                      onClick={() => toggleReveal(word.id)}
                      className="p-2 text-gray-300 hover:text-primary transition-colors"
                    >
                      <Eye size={20} />
                    </button>
                  </div>

                  <div className="mb-6 rounded-2xl bg-gray-50 p-5">
                    <p className="text-lg leading-relaxed text-gray-700">
                      {word.example.split('________').map((part, i, arr) => (
                        <span key={i}>
                          {part}
                          {i < arr.length - 1 && (
                            <span className="inline-block border-b-2 border-gray-300 px-2 font-bold text-transparent">
                              ______
                            </span>
                          )}
                        </span>
                      ))}
                    </p>
                    {revealedIds.has(word.id) && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 font-bold text-primary">
                        정답: {word.blank_answer}
                      </motion.p>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="단어를 입력하세요"
                      value={userInput[word.id] || ''}
                      onChange={(e) => setUserInput({ ...userInput, [word.id]: e.target.value })}
                      onKeyDown={(e) => e.key === 'Enter' && handleCheck(word)}
                      className="flex-1 rounded-xl border-2 border-gray-100 bg-white px-4 py-3 font-bold text-gray-900 outline-none focus:border-primary transition-all"
                    />
                    <button 
                      onClick={() => handleCheck(word)}
                      className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-indigo-100 hover:bg-primary-dark transition-all"
                    >
                      <CheckCircle2 size={24} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          /* 복습 완료 화면 */
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center rounded-[3rem] bg-white p-20 text-center shadow-xl border border-gray-100"
          >
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-pastel-green text-green-600">
              <Trophy size={48} />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900">완벽하게 복습하셨어요!</h2>
            <p className="mb-10 text-gray-500 max-w-xs mx-auto">
              틀렸던 단어들을 모두 맞히셨습니다. <br />
              이제 다음 학습으로 넘어가 볼까요?
            </p>
            <Link 
              href="/"
              className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 font-bold text-white shadow-lg transition-all hover:bg-primary-dark"
            >
              <BookOpen size={20} /> 새로운 학습 시작
            </Link>
          </motion.div>
        )}
      </main>
    </div>
  );
}
