import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Settings, Star, User, History } from 'lucide-react';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-50 bg-white/90 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* 3D Bubble Logo Area */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <div className="flex shrink-0">
            <Image
              src="/top-left-logo.png"
              alt="GY Logo"
              width={64}
              height={80}
              className="h-10 w-auto object-contain"
              priority
              unoptimized
            />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-black tracking-tight text-gray-900">GY 지와이</span>
            <span className="text-[9px] font-bold text-pink-400/80 tracking-widest uppercase">Guide to Yield</span>
          </div>
        </Link>

        {/* Navigation / Icons */}
        <div className="flex items-center gap-1 sm:gap-3 text-gray-500">
          <Link 
            href="/bookmarks" 
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs sm:text-sm font-bold hover:bg-pink-50 hover:text-pink-500 transition-all"
          >
            <Star size={18} className="text-yellow-400" fill="currentColor" />
            <span className="hidden md:inline">내 단어장</span>
          </Link>
          <Link 
            href="/review" 
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs sm:text-sm font-bold hover:bg-pink-50 hover:text-pink-500 transition-all"
          >
            <History size={18} className="text-pink-400" />
            <span className="hidden md:inline">복습 단어장</span>
          </Link>
          <div className="h-4 w-[1px] bg-gray-100 mx-1" />
          <button className="rounded-full p-2 hover:bg-gray-100 transition-colors">
            <Settings size={18} />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-100 text-pink-500 hover:bg-pink-200 transition-colors">
            <User size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
