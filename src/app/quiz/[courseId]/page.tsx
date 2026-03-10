'use client';

import React, { useState, use, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, CheckCircle2, XCircle, RotateCcw, 
  Home, Trophy, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import wordsData from '@/data/words.json';
import { Word, CourseData } from '@/types/word';

export default function QuizPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const data = wordsData as unknown as CourseData;
  const words = useMemo(() => data[courseId as keyof CourseData] || [], [data, courseId]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [options, setOptions] = useState<string[]>([]);

  // 퀴즈 선택지 생성 함수 (영어 단어로 생성)
  const generateOptions = (currentWord: Word) => {
    const wrongAnswers = words
      .filter(w => w.id !== currentWord.id)
      .map(w => w.word); // 뜻 대신 단어(word)를 가져옴
    
    const shuffledWrong = [...wrongAnswers].sort(() => Math.random() - 0.5).slice(0, 3);
    const combined = [...shuffledWrong, currentWord.word].sort(() => Math.random() - 0.5);
    return combined;
  };

  useEffect(() => {
    if (words.length > 0 && currentIndex < words.length) {
      setOptions(generateOptions(words[currentIndex]));
      setSelectedAnswer(null);
      setIsCorrect(null);
    }
  }, [currentIndex, words]);

  const handleAnswer = (answer: string) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answer);
    const correct = answer === words[currentIndex].word; // 단어(word)와 비교
    setIsCorrect(correct);
    if (correct) {
      setScore(score + 1);
    } else {
      // 오답일 경우 복습 리스트에 추가
      const wrong = JSON.parse(localStorage.getItem('wordflow_wrong_words') || '[]');
      if (!wrong.includes(words[currentIndex].id)) {
        localStorage.setItem('wordflow_wrong_words', JSON.stringify([...wrong, words[currentIndex].id]));
      }
    }

    setTimeout(() => {
      if (currentIndex < words.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setIsFinished(true);
      }
    }, 1200);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setScore(0);
    setIsFinished(false);
  };

  const currentWord = words[currentIndex];

  if (!currentWord) return null;

  const progress = ((currentIndex + 1) / words.length) * 100;

  if (isFinished) {
    const accuracy = Math.round((score / words.length) * 100);
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container mx-auto max-w-2xl px-4 py-20 text-center">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="rounded-[3rem] bg-white p-12 shadow-2xl">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-pastel-yellow text-amber-500 shadow-inner"><Trophy size={56} /></div>
            <h2 className="mb-2 text-4xl font-extrabold text-gray-900">테스트 종료!</h2>
            <p className="mb-10 text-gray-500">한국어 뜻을 보고 단어를 얼마나 잘 기억하시나요?</p>
            <div className="mb-12 grid grid-cols-2 gap-6">
              <div className="rounded-3xl bg-indigo-50 p-8 border border-indigo-100">
                <p className="mb-1 text-sm font-bold text-indigo-400 uppercase tracking-widest">맞춘 개수</p>
                <p className="text-4xl font-black text-indigo-600">{score} / {words.length}</p>
              </div>
              <div className="rounded-3xl bg-pastel-green p-8 border border-green-100">
                <p className="mb-1 text-sm font-bold text-green-500 uppercase tracking-widest">정확도</p>
                <p className="text-4xl font-black text-green-600">{accuracy}%</p>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <button onClick={handleReset} className="flex items-center justify-center gap-3 rounded-2xl bg-primary py-5 font-bold text-white shadow-xl transition-all hover:bg-primary-dark"><RotateCcw size={22} /> 다시 도전하기</button>
              <Link href="/" className="flex items-center justify-center gap-3 rounded-2xl bg-gray-100 py-5 font-bold text-gray-600 transition-all hover:bg-gray-200"><Home size={22} /> 홈으로 돌아가기</Link>
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
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary transition-colors"><ArrowLeft size={18} /><span>퀴즈 중단</span></Link>
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-1.5 text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full"><Zap size={14} fill="currentColor" /><span>Score: {score}</span></div>
             <div className="text-sm font-bold text-gray-900"><span className="text-primary font-bold">{currentIndex + 1}</span><span className="text-gray-300 mx-1">/</span><span>{words.length}</span></div>
          </div>
        </div>

        <div className="mb-16 h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <motion.div className="h-full bg-primary" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
        </div>

        <div className="mb-12 text-center">
          <span className="inline-block mb-4 px-4 py-1 rounded-full bg-pastel-purple text-primary text-xs font-black uppercase tracking-widest">다음 뜻에 알맞은 단어는?</span>
          <h2 className="text-5xl font-black tracking-tight text-gray-900 mb-8 leading-tight">{currentWord.meaning}</h2>
          <div className="mx-auto w-full max-w-md rounded-2xl bg-gray-100/50 p-6 text-gray-600 italic">"{currentWord.example.replace('________', '______')}"</div>
        </div>

        <div className="grid gap-4">
          <AnimatePresence mode="wait">
            <motion.div key={currentIndex} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid gap-4">
              {options.map((option, idx) => {
                const isSelected = selectedAnswer === option;
                const isCorrectOption = option === currentWord.word;
                
                let buttonStyle = "bg-white border-gray-100 text-gray-700 hover:border-primary hover:bg-indigo-50/30";
                let icon = null;

                if (selectedAnswer !== null) {
                  if (isCorrectOption) {
                    buttonStyle = "bg-green-50 border-green-500 text-green-700 ring-4 ring-green-100";
                    icon = <CheckCircle2 size={20} className="text-green-500" />;
                  } else if (isSelected) {
                    buttonStyle = "bg-red-50 border-red-500 text-red-700 ring-4 ring-red-100";
                    icon = <XCircle size={20} className="text-red-500" />;
                  } else {
                    buttonStyle = "bg-white border-gray-100 text-gray-300 opacity-50";
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(option)}
                    disabled={selectedAnswer !== null}
                    className={`flex items-center justify-between rounded-3xl border-2 px-8 py-6 text-xl font-black transition-all duration-200 ${buttonStyle}`}
                  >
                    <span className="tracking-tight">{option}</span>
                    {icon}
                  </button>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
