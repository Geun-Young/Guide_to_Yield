'use client';

import Link from 'next/link';
import Image from 'next/image';
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
      wordCount: 1000
    },
    {
      id: 'business_course',
      title: '직장인 실무 영어',
      description: '비즈니스 이메일, 회의, 협상에서 바로 쓰는 핵심 표현. 글로벌 업무 역량을 강화하세요.',
      icon: Briefcase,
      color: 'bg-pastel-purple',
      wordCount: 1060
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 pt-4 pb-16">
        {/* Main Title Image Section */}
        <section className="mb-12 text-center">
          <div className="mx-auto max-w-lg">
            <Image
              src="/modified-title.png"
              alt="메인 타이틀 이미지"
              width={600}
              height={300}
              priority
              className="w-full h-auto"
            />
          </div>
          
          <div className="mt-6 space-y-4">
            <p className="mx-auto max-w-2xl text-lg text-gray-500 font-medium">
              유연하고 스마트한 단어 학습. <br />
              목표에 맞는 코스를 선택하고 고득점을 향해 흐르듯 공부하세요.
            </p>
          </div>
        </section>

        {/* 코스 그리드 */}
        <div className="grid gap-10 md:grid-cols-2 max-w-5xl mx-auto">
          {courses.map((course) => (
            <div key={course.id} className="flex flex-col gap-6 group">
              <CourseCard
                title={course.title}
                description={course.description}
                icon={course.icon}
                color={course.color}
                wordCount={course.wordCount}
                onClick={() => {}}
              />
              <div className="grid grid-cols-2 gap-4 px-2">
                <Link 
                  href={`/study/${course.id}`}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-sm font-bold text-white shadow-lg shadow-indigo-100 transition-all hover:bg-primary-dark hover:scale-[1.02] active:scale-95"
                >
                  <Play size={16} fill="currentColor" /> 학습 시작
                </Link>
                <Link 
                  href={`/quiz/${course.id}`}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-white py-4 text-sm font-bold text-gray-700 border border-gray-100 shadow-sm transition-all hover:bg-gray-50 hover:scale-[1.02] active:scale-95"
                >
                  <BrainCircuit size={16} className="text-pink-400" /> 퀴즈 도전
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
