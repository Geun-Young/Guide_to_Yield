'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import CourseCard from '@/components/CourseCard';
import { GraduationCap, Briefcase, Play, BrainCircuit } from 'lucide-react';

export default function Home() {
  const courses = [
    {
      id: 'toeic_course',
      title: '토익(TOEIC) 마스터',
      description: '최신 기출 유형을 반영한 빈출 어휘와 예문으로 고득점을 달성하세요. Part 5, 6 완벽 대비!',
      icon: GraduationCap,
      color: 'bg-pastel-blue',
      wordCount: 1200
    },
    {
      id: 'business_course',
      title: '직장인 실무 영어',
      description: '비즈니스 이메일, 회의, 협상에서 바로 쓰는 핵심 표현. 글로벌 업무 역량을 강화하세요.',
      icon: Briefcase,
      color: 'bg-pastel-purple',
      wordCount: 850
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* 히어로 섹션 */}
        <section className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-black tracking-tighter text-gray-900 sm:text-6xl">
            GY <span className="text-primary font-black">지와이</span>
          </h1>
          <p className="mb-6 text-xl font-bold text-gray-400">Guide to Yield: 고득점으로 가는 가이드</p>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            당신의 목표에 맞는 코스를 선택하고 스마트하게 단어를 정복하세요. <br />
            주관식 학습과 퀴즈를 통해 실전 어휘력을 극대화합니다.
          </p>
        </section>

        {/* 코스 그리드 */}
        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          {courses.map((course) => (
            <div key={course.id} className="flex flex-col gap-4">
              <CourseCard
                title={course.title}
                description={course.description}
                icon={course.icon}
                color={course.color}
                wordCount={course.wordCount}
                onClick={() => {}}
              />
              <div className="grid grid-cols-2 gap-3">
                <Link 
                  href={`/study/${course.id}`}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-sm font-bold text-white shadow-lg shadow-indigo-100 transition-all hover:bg-primary-dark active:scale-95"
                >
                  <Play size={16} fill="currentColor" /> 학습 시작
                </Link>
                <Link 
                  href={`/quiz/${course.id}`}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-white py-4 text-sm font-bold text-gray-700 border border-gray-100 shadow-sm transition-all hover:bg-gray-50 active:scale-95"
                >
                  <BrainCircuit size={16} className="text-primary" /> 퀴즈 도전
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
