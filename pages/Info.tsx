import React from 'react';
import { supabaseService } from '../services/supabase';
import type { Video, NewsItem } from '../services/supabase';
import { Share2, Heart } from 'lucide-react';

export const Info: React.FC = () => {
  return (
    <div className="pb-24 px-4 pt-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">健康资讯</h1>
      
      {/* Waterfall Layout */}
      <div className="columns-2 gap-4 space-y-4">
        {news.map((item) => (
          <div key={item.id} className="break-inside-avoid bg-white rounded-xl shadow-sm overflow-hidden mb-4 group">
            <div className="relative">
              <img src={item.coverImage} alt={item.title} className="w-full object-cover" />
              <div className="absolute top-2 right-2 bg-black/30 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded-full">
                {item.category}
              </div>
            </div>
            <div className="p-3">
              <h3 className="text-sm font-bold text-gray-800 mb-2 leading-snug group-hover:text-brand-600 transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-gray-500 line-clamp-3 mb-3">
                {item.summary}
              </p>
              <div className="flex justify-between items-center border-t border-gray-50 pt-2">
                <span className="text-[10px] text-gray-400">{item.date}</span>
                <div className="flex space-x-3">
                   <button className="text-gray-400 hover:text-red-500 transition-colors">
                     <Heart size={14} />
                   </button>
                   <button className="text-gray-400 hover:text-brand-600 transition-colors">
                     <Share2 size={14} />
                   </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Add dummy extra content to show waterfall better */}
        <div className="break-inside-avoid bg-brand-600 rounded-xl shadow-sm overflow-hidden mb-4 p-4 text-white text-center flex flex-col items-center justify-center min-h-[150px]">
           <h3 className="font-bold text-lg mb-2">会员计划</h3>
           <p className="text-xs opacity-90 mb-3">解锁更多专业内容</p>
           <button className="bg-white text-brand-600 text-xs px-4 py-1.5 rounded-full font-bold">了解详情</button>
        </div>
      </div>
    </div>
  );
};
