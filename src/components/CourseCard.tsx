import React from 'react';
import { ChevronRight, LucideIcon } from 'lucide-react';

interface CourseCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  wordCount: number;
  onClick: () => void;
}

const CourseCard = ({ 
  title, 
  description, 
  icon: Icon, 
  color, 
  wordCount, 
  onClick 
}: CourseCardProps) => {
  return (
    <button
      onClick={onClick}
      className={`group relative flex w-full flex-col overflow-hidden rounded-3xl border border-white/50 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
    >
      {/* 장식용 배경 */}
      <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full ${color} opacity-20 blur-2xl group-hover:opacity-40 transition-opacity`} />
      
      {/* 아이콘 및 뱃지 */}
      <div className="mb-6 flex items-start justify-between">
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${color} bg-opacity-20 text-indigo-600`}>
          <Icon size={24} className="group-hover:scale-110 transition-transform" />
        </div>
        <span className="inline-flex items-center rounded-full bg-gray-50 px-3 py-1 text-xs font-medium text-gray-500">
          {wordCount} 단어
        </span>
      </div>

      {/* 텍스트 영역 */}
      <div className="flex flex-col text-left">
        <h3 className="mb-2 text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="mb-6 text-sm leading-relaxed text-gray-500">
          {description}
        </p>
      </div>

      {/* 하단 버튼 영역 */}
      <div className="mt-auto flex items-center justify-between text-sm font-semibold text-primary">
        <span>학습 시작하기</span>
        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
      </div>
    </button>
  );
};

export default CourseCard;
