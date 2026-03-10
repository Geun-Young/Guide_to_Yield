'use client';

import React, { useState, use, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, ChevronLeft, ChevronRight, Eye, EyeOff, 
  RotateCcw, Star, CheckCircle2, Trophy, Home, Send, HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import wordsData from '@/data/words.json';
import { Word, CourseData } from '@/types/word';

export default function StudyPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const data = wordsData as unknown as CourseData;
  const words = data[courseId as keyof CourseData] || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [hintLevel, setHintLevel] = useState(0); // 0: none, 1: first letter, 2: full answer
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [direction, setDirection] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);

  // 북마크 로드
  useEffect(() => {
    const saved = localStorage.getItem('wordflow_bookmarks');
    if (saved) setBookmarks(JSON.parse(saved));
  }, []);

  // 단어 바뀔 때마다 초기화
  useEffect(() => {
    setUserInput('');
    setIsCorrect(null);
    setHintLevel(0);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [currentIndex]);

  const currentWord = words[currentIndex];

  const handleCheck = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentWord) return;

    const correct = userInput.trim().toLowerCase() === currentWord.blank_answer.toLowerCase();
    setIsCorrect(correct);
    if (correct) {
      setHintLevel(2); // 정답 맞추면 정답 상태로
    } else {
      // 오답일 경우 복습 리스트에 추가
      const wrong = JSON.parse(localStorage.getItem('wordflow_wrong_words') || '[]');
      if (!wrong.includes(currentWord.id)) {
        localStorage.setItem('wordflow_wrong_words', JSON.stringify([...wrong, currentWord.id]));
      }
    }
  };

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setDirection(1);
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (!currentWord) return null;

  const progress = ((currentIndex + 1) / words.length) * 100;

  if (isFinished) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container mx-auto max-w-2xl px-4 py-20 text-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="rounded-[3rem] bg-white p-12 shadow-2xl">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-pastel-green text-green-600"><Trophy size={48} /></div>
            <h2 className="mb-2 text-3xl font-extrabold text-gray-900">학습 완료!</h2>
            <p className="mb-10 text-gray-500">직접 입력하며 단어를 완벽하게 익히셨네요.</p>
            <div className="flex flex-col gap-4">
              <button onClick={() => { setIsFinished(false); setCurrentIndex(0); }} className="flex items-center justify-center gap-2 rounded-2xl bg-primary py-4 font-bold text-white shadow-lg transition-all hover:bg-primary-dark"><RotateCcw size={20} /> 다시 학습하기</button>
              <Link href="/" className="flex items-center justify-center gap-2 rounded-2xl bg-gray-100 py-4 font-bold text-gray-600 transition-all hover:bg-gray-200"><Home size={20} /> 홈으로 돌아가기</Link>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <Header />
      <main className="container mx-auto max-w-2xl px-4 py-12">
        <div className="mb-8 flex items-center justify-between text-sm font-medium text-gray-500">
          <Link href="/" className="flex items-center gap-2 hover:text-primary transition-colors"><ArrowLeft size={18} /><span>목록으로</span></Link>
          <div className="flex items-center gap-2 text-gray-900"><span className="text-primary font-bold">{currentIndex + 1}</span><span className="text-gray-300">/</span><span>{words.length}</span></div>
        </div>

        <div className="mb-12 h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <motion.div className="h-full bg-primary" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
        </div>

        <div className="relative mb-10 h-[480px]">
          <AnimatePresence initial={false} mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              initial={(d: number) => ({ x: d > 0 ? 50 : -50, opacity: 0 })}
              animate={{ x: 0, opacity: 1 }}
              exit={(d: number) => ({ x: d > 0 ? -50 : 50, opacity: 0 })}
              className="absolute inset-0 flex flex-col items-center justify-center rounded-[3rem] border border-white/50 bg-white p-10 text-center shadow-2xl"
            >
              <button onClick={() => {
                const updated = bookmarks.includes(currentWord.id) ? bookmarks.filter(id => id !== currentWord.id) : [...bookmarks, currentWord.id];
                setBookmarks(updated);
                localStorage.setItem('wordflow_bookmarks', JSON.stringify(updated));
              }} className={`absolute right-8 top-8 rounded-full p-2 transition-all ${bookmarks.includes(currentWord.id) ? 'bg-yellow-50 text-yellow-500' : 'bg-gray-50 text-gray-300 hover:text-gray-400'}`}>
                <Star size={24} fill={bookmarks.includes(currentWord.id) ? "currentColor" : "none"} />
              </button>

              <span className="mb-4 text-xs font-bold uppercase tracking-widest text-indigo-400">의미를 보고 단어를 입력하세요</span>
              <h2 className="mb-10 text-4xl font-black text-gray-900">{currentWord.meaning}</h2>

              <form onSubmit={handleCheck} className="w-full space-y-8 text-left">
                <div className="rounded-2xl bg-gray-50 p-8">
                  <p className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-400">Example Sentence</p>
                  <div className="text-xl leading-relaxed text-gray-700">
                    {currentWord.example.split('________').map((part, i, arr) => (
                      <span key={i} className="flex flex-wrap items-center gap-2">
                        {part}
                        {i < arr.length - 1 && (
                          <input
                            ref={inputRef}
                            type="text"
                            value={userInput}
                            onChange={(e) => {
                              setUserInput(e.target.value);
                              setIsCorrect(null);
                            }}
                            autoFocus
                            placeholder={hintLevel === 1 ? `${currentWord.blank_answer.charAt(0)}...` : "단어 입력"}
                            className={`inline-block min-w-[140px] border-b-4 bg-transparent px-2 py-1 text-center font-bold outline-none transition-all ${
                              isCorrect === true ? 'border-green-500 text-green-600' : 
                              isCorrect === false ? 'border-red-400 text-red-500' : 
                              'border-indigo-200 focus:border-primary text-primary'
                            }`}
                          />
                        )}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm h-6">
                  <div className="flex gap-2">
                    <span className="rounded-full bg-pastel-blue px-3 py-1 font-semibold text-indigo-600">{currentWord.source}</span>
                    <span className={`rounded-full px-3 py-1 font-semibold ${currentWord.difficulty === 'Hard' ? 'bg-pastel-red text-red-600' : 'bg-pastel-green text-green-600'}`}>{currentWord.difficulty}</span>
                  </div>
                  <AnimatePresence>
                    {hintLevel === 1 && !isCorrect && (
                      <motion.p initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="font-bold text-amber-500">
                        힌트: {currentWord.blank_answer.charAt(0)}...
                      </motion.p>
                    )}
                    {hintLevel === 2 && (
                      <motion.p initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="font-bold text-primary">
                        정답: {currentWord.blank_answer}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </form>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between gap-4">
          <button onClick={handlePrev} disabled={currentIndex === 0} className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-gray-400 shadow-md transition-all hover:bg-gray-50 disabled:opacity-30"><ChevronLeft size={28} /></button>
          
          <button 
            onClick={isCorrect === true || hintLevel === 2 ? handleNext : handleCheck}
            className={`flex flex-1 items-center justify-center gap-3 rounded-2xl h-14 font-bold text-white shadow-lg transition-all active:scale-95 ${
              isCorrect === true ? 'bg-green-500 shadow-green-100' : 'bg-primary shadow-indigo-100'
            }`}
          >
            {isCorrect === true || hintLevel === 2 ? (
              <>{currentIndex === words.length - 1 ? '학습 완료' : '다음 단어'} <ChevronRight size={20} /></>
            ) : (
              <><Send size={20} /> 정답 확인</>
            )}
          </button>

          {!isCorrect && hintLevel < 2 && (
            <button 
              onClick={() => setHintLevel(prev => prev + 1)}
              className="flex h-14 w-24 items-center justify-center gap-2 rounded-2xl bg-white text-gray-500 shadow-md hover:bg-gray-50 transition-all border border-gray-100"
              title={hintLevel === 0 ? "힌트 보기" : "정답 보기"}
            >
              {hintLevel === 0 ? (
                <><HelpCircle size={22} className="text-amber-500" /><span className="text-xs font-bold">힌트</span></>
              ) : (
                <><Eye size={22} className="text-primary" /><span className="text-xs font-bold">정답</span></>
              )}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
