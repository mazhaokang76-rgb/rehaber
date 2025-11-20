import React, { useEffect, useState } from 'react';
import { Play, BookOpen, Search, Bell } from 'lucide-react';
import { User, TrainingVideo, HealthNews } from '../types';
import { supabaseService } from '../services/supabase';
import { Logo } from '../components/Logo';

interface HomeTabProps {
  user: User;
}

export const HomeTab: React.FC<HomeTabProps> = ({ user }) => {
  const [videos, setVideos] = useState<TrainingVideo[]>([]);
  const [news, setNews] = useState<HealthNews[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [fetchedVideos, fetchedNews] = await Promise.all([
          supabaseService.getVideos(user.subscriptions),
          supabaseService.getNews(user.subscriptions),
        ]);
        setVideos(fetchedVideos);
        setNews(fetchedNews);
      } catch (error) {
        console.error("Failed to fetch home data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.subscriptions]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
         <Logo showText={false} className="animate-bounce" />
         <div className="text-emerald-600 font-medium text-sm">Loading Rehaber...</div>
      </div>
    );
  }

  return (
    <div className="pb-24 pt-16 px-4 max-w-md mx-auto">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-lg z-40 border-b border-emerald-100/50 shadow-sm">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <Logo className="scale-90" />
          <div className="flex items-center space-x-3">
            <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full relative transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            </button>
          </div>
        </div>
      </div>

      {/* Greeting */}
      <div className="mt-4 mb-8 animate-fadeIn">
        <h1 className="text-2xl font-bold text-gray-900">
          你好, <span className="text-emerald-600">{user.name}</span>
        </h1>
        <p className="text-gray-500 text-sm mt-1 flex items-center">
          今天也要保持健康活力！
          <span className="ml-2 inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
        </p>
      </div>

      {/* Section: Training Videos */}
      <div className="mb-8 animate-slideUp">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center">
            <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center mr-2">
              <Play className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
            </div>
            推荐训练
          </h3>
          {user.subscriptions.length > 0 && (
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
              订阅推荐
            </span>
          )}
        </div>
        
        {/* Horizontal Scroll Container */}
        <div className="flex overflow-x-auto space-x-4 pb-4 -mx-4 px-4 no-scrollbar snap-x">
          {videos.length === 0 ? (
            <div className="w-full p-8 text-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              暂无推荐视频，请尝试订阅更多主题
            </div>
          ) : (
            videos.map((video) => (
              <div key={video.id} className="flex-none w-72 snap-center group">
                <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 transform group-hover:-translate-y-1">
                  <div className="relative h-40 overflow-hidden">
                    <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-medium px-2 py-1 rounded backdrop-blur-sm">
                      {video.duration}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-[1px]">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg transform scale-50 group-hover:scale-100 transition-transform">
                        <Play className="w-5 h-5 text-emerald-600 fill-emerald-600 ml-1" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold tracking-wider text-emerald-600 uppercase bg-emerald-50 px-2 py-0.5 rounded">
                        {video.category}
                      </span>
                      <span className="text-[10px] text-gray-400">{video.views} 次观看</span>
                    </div>
                    <h4 className="font-bold text-gray-800 truncate text-sm">{video.title}</h4>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Section: Health News */}
      <div className="animate-slideUp" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center">
             <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center mr-2">
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
            </div>
            健康资讯
          </h3>
        </div>
        
        <div className="space-y-4">
          {news.length === 0 ? (
            <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              暂无资讯更新
            </div>
          ) : (
            news.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex items-start space-x-4 hover:bg-gray-50 transition-colors cursor-pointer group">
                <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-200 relative">
                  <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex-1 flex flex-col justify-between h-24 py-0.5">
                  <div>
                     <div className="flex items-center space-x-2 mb-1.5">
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                        {item.category}
                      </span>
                      <span className="text-[10px] text-gray-400">{item.date}</span>
                    </div>
                    <h4 className="font-bold text-gray-800 leading-snug line-clamp-2 text-sm group-hover:text-emerald-600 transition-colors">{item.title}</h4>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-1">{item.summary}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};