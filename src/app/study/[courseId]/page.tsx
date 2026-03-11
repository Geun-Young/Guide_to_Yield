'use client';

import React, { useState, use, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, ChevronLeft, ChevronRight, Eye, 
  RotateCcw, Star, Trophy, Home, Send, HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import wordsData from '@/data/words.json';
import { CourseData } from '@/types/word';

export default function StudyPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const data = wordsData as unknown as CourseData;
  const words = data[courseId as keyof CourseData] || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInputs, setUserInputs] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [hintLevel, setHintLevel] = useState(0); // 0: none, 1: first letter, 2: full answer
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [direction, setDirection] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 로컬 스토리지 데이터 로드 및 초기화
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('wordflow_bookmarks');
    if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));

    const savedProgress = localStorage.getItem(`wordflow_study_progress_${courseId}`);
    let initialIndex = 0;
    if (savedProgress) {
      const index = parseInt(savedProgress, 10);
      if (index >= 0 && index < words.length) {
        initialIndex = index;
        setCurrentIndex(index);
      }
    }

    // 초기 입력창 설정
    const currentWord = words[initialIndex];
    if (currentWord) {
      const wordCount = currentWord.blank_answer.split(' ').length;
      setUserInputs(new Array(wordCount).fill(''));
    }

    setIsLoaded(true);
  }, [courseId, words]);

  // 학습 진행도 저장
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(`wordflow_study_progress_${courseId}`, currentIndex.toString());
    }
  }, [currentIndex, courseId, isLoaded]);

  const currentWord = words[currentIndex];

  // 단어 바뀔 때마다 초기화 (currentIndex 변화에 대응)
  useEffect(() => {
    if (!isLoaded || !currentWord) return;
    const wordCount = currentWord.blank_answer.split(' ').length;
    setUserInputs(new Array(wordCount).fill(''));
    setIsCorrect(null);
    setHintLevel(0); // 힌트 레벨 초기화
    inputRefs.current = new Array(wordCount).fill(null);
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  }, [currentIndex, isLoaded, currentWord]);

  const handleCheck = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentWord) return;

    const fullInput = userInputs.map(s => s.trim()).join(' ').toLowerCase();
    const correct = fullInput === currentWord.blank_answer.toLowerCase();
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

  const handleInputChange = (index: number, value: string) => {
    if (value.includes(' ')) {
      const parts = value.split(' ');
      const newInputs = [...userInputs];
      newInputs[index] = parts[0];
      setUserInputs(newInputs);
      
      const nextIndex = index + 1;
      if (inputRefs.current[nextIndex]) {
        inputRefs.current[nextIndex]?.focus();
        if (parts[1]) {
           handleInputChange(nextIndex, parts[1]);
        }
      }
      return;
    }

    const newInputs = [...userInputs];
    newInputs[index] = value;
    setUserInputs(newInputs);
    setIsCorrect(null);
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !userInputs[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'Enter') {
      // Enter 키의 기본 폼 제출 동작을 막아 다음 단어에서 handleCheck가 실행되는 것을 방지
      e.preventDefault();
      if (isCorrect === true || hintLevel === 2) {
        handleNext();
      } else {
        handleCheck();
      }
    }
  };

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setDirection(1);
      // 다음 단어로 넘어가기 전에 즉시 상태 초기화
      const nextIndex = currentIndex + 1;
      const nextWord = words[nextIndex];
      if (nextWord) {
        const wordCount = nextWord.blank_answer.split(' ').length;
        setUserInputs(new Array(wordCount).fill(''));
      }
      setIsCorrect(null);
      setHintLevel(0);
      setCurrentIndex(nextIndex);
    } else {
      setIsFinished(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      // 이전 단어로 돌아갈 때도 즉시 상태 초기화
      const prevIndex = currentIndex - 1;
      const prevWord = words[prevIndex];
      if (prevWord) {
        const wordCount = prevWord.blank_answer.split(' ').length;
        setUserInputs(new Array(wordCount).fill(''));
      }
      setIsCorrect(null);
      setHintLevel(0);
      setCurrentIndex(prevIndex);
    }
  };

  if (!isLoaded || !currentWord) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="animate-pulse text-primary font-bold">로딩 중...</div>
    </div>
  );

  const progress = ((currentIndex + 1) / words.length) * 100;
  const answerWords = currentWord.blank_answer.split(' ');

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
              <button onClick={() => { 
                setIsFinished(false); 
                setCurrentIndex(0); 
                localStorage.setItem(`wordflow_study_progress_${courseId}`, '0');
              }} className="flex items-center justify-center gap-2 rounded-2xl bg-primary py-4 font-bold text-white shadow-lg transition-all hover:bg-primary-dark"><RotateCcw size={20} /> 처음부터 다시 학습하기</button>
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
                  <div className="text-xl leading-relaxed text-gray-700 flex flex-wrap items-center gap-x-2 gap-y-4">
                    {currentWord.example.split('________').map((part, i, arr) => (
                      <React.Fragment key={i}>
                        <span>{part}</span>
                        {i < arr.length - 1 && (
                          <div className="flex flex-wrap gap-2">
                            {answerWords.map((word, wordIdx) => (
                              <input
                                key={wordIdx}
                                ref={(el) => { inputRefs.current[wordIdx] = el; }}
                                type="text"
                                value={userInputs[wordIdx] || ''}
                                onChange={(e) => handleInputChange(wordIdx, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(wordIdx, e)}
                                autoFocus={wordIdx === 0}
                                placeholder={hintLevel === 1 && wordIdx === 0 ? word.charAt(0) : ""}
                                className={`inline-block border-b-4 bg-transparent px-2 py-1 text-center font-bold outline-none transition-all ${
                                  isCorrect === true ? 'border-green-500 text-green-600' : 
                                  isCorrect === false ? 'border-red-400 text-red-500' : 
                                  'border-indigo-200 focus:border-primary text-primary'
                                }`}
                                style={{ width: `${Math.max(word.length * 1.1, 4)}rem` }}
                              />
                            ))}
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                  
                  {/* 예문 해석 추가 */}
                  <AnimatePresence>
                    {(isCorrect === true || hintLevel === 2) && currentWord.example_meaning && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }} 
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-6 pt-6 border-t border-gray-200/50"
                      >
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2 text-[10px]">Translation</p>
                        <p className="text-gray-500 font-medium leading-relaxed">
                          {currentWord.example_meaning
                            .replace(/\[공백\]/g, '[정답]')
                            .replace(/\[blank\]/g, '[정답]')
                            .replace(/\[빈칸\]/g, '[정답]')
                            .replace(/________/g, '[정답]')
                          }
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex items-center justify-between text-sm h-6">
                  <div className="flex gap-2">
                    <span className="rounded-full bg-pastel-blue px-3 py-1 font-semibold text-indigo-600">{currentWord.source}</span>
                    <span className={`rounded-full px-3 py-1 font-semibold ${currentWord.difficulty === 'Hard' ? 'bg-pastel-red text-red-600' : 'bg-pastel-green text-green-600'}`}>{currentWord.difficulty}</span>
                  </div>
                  <AnimatePresence>
                    {hintLevel === 1 && !isCorrect && (
                      <motion.p initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="font-bold text-amber-500">
                        힌트: {currentWord.blank_answer.charAt(0)}
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
              onClick={() => {
                const nextHintLevel = hintLevel + 1;
                setHintLevel(nextHintLevel);
                
                // 정답 보기(hintLevel 2)를 누른 경우 무조건 복습 리스트에 추가
                if (nextHintLevel === 2) {
                  const wrong = JSON.parse(localStorage.getItem('wordflow_wrong_words') || '[]');
                  if (!wrong.includes(currentWord.id)) {
                    localStorage.setItem('wordflow_wrong_words', JSON.stringify([...wrong, currentWord.id]));
                  }
                }
              }}
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
