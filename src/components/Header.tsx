import React from 'react';
import Link from 'next/link';
import { Settings, Star, User, GraduationCap, History } from 'lucide-react';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* 로고 영역 */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-indigo-200">
            <GraduationCap size={24} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xl font-black tracking-tighter text-gray-900">
              GY <span className="text-primary font-black">지와이</span>
            </span>
            <span className="text-[10px] font-bold text-gray-400">Guide to Yield</span>
          </div>
        </Link>

        {/* 네비게이션/아이콘 */}
        <div className="flex items-center gap-1 sm:gap-3 text-gray-500">
          <Link 
            href="/bookmarks" 
            className="flex items-center gap-1.5 rounded-full px-2 py-1.5 text-xs sm:text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            <Star size={18} className="text-yellow-500" fill="currentColor" />
            <span className="hidden md:inline">내 단어장</span>
          </Link>
          <Link 
            href="/review" 
            className="flex items-center gap-1.5 rounded-full px-2 py-1.5 text-xs sm:text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            <History size={18} className="text-red-400" />
            <span className="hidden md:inline">복습 단어장</span>
          </Link>
          <div className="h-4 w-[1px] bg-gray-200 mx-1" />
          <button className="rounded-full p-2 hover:bg-gray-100 transition-colors">
            <Settings size={18} />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-full bg-pastel-purple text-primary hover:bg-indigo-100 transition-colors">
            <User size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
