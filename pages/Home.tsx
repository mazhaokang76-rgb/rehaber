import React, { useState } from 'react';
import { Play, Clock, ChevronRight } from 'lucide-react';
import { videos, news, currentUser } from '../services/mockData';

export const Home: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('全部');

  const categories = ['全部', '复健', '核心', '有氧', '柔韧性'];
  
  // Simple mapping for filtering based on English keys in mock data vs Chinese UI
  const categoryMap: Record<string, string> = {
    '全部': 'All',
    '复健': 'Rehab',
    '核心': 'Core',
    '有氧': 'Cardio',
    '柔韧性': 'Flexibility'
  };

  const filteredVideos = activeCategory === '全部' 
    ? videos 
    : videos.filter(v => v.category === categoryMap[activeCategory]);

  return (
    <div className="space-y-6 pb-24">
      {/* Header Section */}
      <div className="bg-brand-600 text-white p-6 rounded-b-3xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 transform translate-x-10 -translate-y-10">
           <svg width="200" height="200" viewBox="0 0 200 200" fill="white">
             <circle cx="100" cy="100" r="80" />
           </svg>
        </div>
        
        <h1 className="text-2xl font-bold mb-1 relative z-10">欢迎回来，{currentUser.name}!</h1>
        <p className="text-brand-100 text-sm mb-6 relative z-10">准备好开始今天的康复训练了吗？</p>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 flex items-center justify-between">
            <div>
              <div className="text-xs text-brand-100">今日目标</div>
              <div className="text-xl font-bold">30 分钟</div>
            </div>
            <div className="h-8 w-px bg-white/20"></div>
             <div>
              <div className="text-xs text-brand-100">连续打卡</div>
              <div className="text-xl font-bold">{currentUser.stats.daysStreak} 天</div>
            </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="px-4">
        <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Recommended Video Section */}
      <div className="px-4">
        <div className="flex justify-between items-end mb-3">
          <h2 className="text-lg font-bold text-gray-800">推荐训练</h2>
          <span className="text-xs text-brand-600 font-semibold flex items-center">
            全部 <ChevronRight size={14} />
          </span>
        </div>
        
        <div className="space-y-4">
          {filteredVideos.map(video => (
            <div key={video.id} className="bg-white rounded-xl shadow-sm overflow-hidden flex active:scale-[0.99] transition-transform duration-100">
              <div className="w-1/3 relative">
                <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="bg-white/30 backdrop-blur-sm p-1.5 rounded-full">
                     <Play size={16} className="text-white fill-white" />
                  </div>
                </div>
              </div>
              <div className="w-2/3 p-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-[10px] px-1.5 py-0.5 bg-brand-50 text-brand-600 rounded font-medium border border-brand-100">
                      {video.category === 'Rehab' ? '复健' : video.category === 'Core' ? '核心' : '其他'}
                    </span>
                    <span className="text-[10px] text-gray-400 flex items-center">
                      <Clock size={10} className="mr-1" /> {video.duration}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-gray-800 leading-snug line-clamp-2">{video.title}</h3>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-1.5">
                    <img src={video.authorAvatar} alt={video.author} className="w-5 h-5 rounded-full" />
                    <span className="text-xs text-gray-500 truncate max-w-[80px]">{video.author}</span>
                  </div>
                  <span className="text-[10px] text-gray-400">{video.views} 次观看</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Health Tips Preview */}
      <div className="px-4">
        <h2 className="text-lg font-bold text-gray-800 mb-3">每日健康贴士</h2>
        <div className="bg-gradient-to-r from-green-50 to-brand-50 p-4 rounded-xl border border-green-100">
          <h3 className="font-bold text-gray-800 mb-1">{news[0].title}</h3>
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{news[0].summary}</p>
          <button className="text-xs font-bold text-brand-700 bg-white px-3 py-1.5 rounded shadow-sm">阅读全文</button>
        </div>
      </div>
    </div>
  );
};