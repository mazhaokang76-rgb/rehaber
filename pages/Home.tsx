// pages/Home.tsx - 集成搜索和通知的首页
import React, { useState, useEffect } from 'react';
import { Play, Clock, ChevronRight, Search, Bookmark, Heart } from 'lucide-react';
import { supabaseService } from '../services/supabase';
import type { Video, NewsItem } from '../services/supabase';
import { VideoDetail } from '../components/VideoDetail';
import { NewsDetail } from '../components/NewsDetail';
import { SearchResults } from '../components/SearchResults';
import { Notifications } from '../components/Notifications';
import { NotificationBell } from '../components/Notifications';

export const Home: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('全部');
  const [videos, setVideos] = useState<Video[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState({ name: '用户', stats: { daysStreak: 0 } });
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const categories = ['全部', '复健', '核心', '有氧', '柔韧性'];
  
  const categoryMap: Record<string, string> = {
    '全部': 'All',
    '复健': 'Rehab',
    '核心': 'Core',
    '有氧': 'Cardio',
    '柔韧性': 'Flexibility'
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [videosData, newsData] = await Promise.all([
        supabaseService.getVideos(),
        supabaseService.getNews()
      ]);
      setVideos(videosData);
      setNews(newsData);
      
      const userStr = localStorage.getItem('rehaber_user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
      }
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async (contentId: string, contentType: 'video' | 'news') => {
    try {
      const isFavorited = await supabaseService.toggleFavorite(contentId, contentType);
      
      if (contentType === 'video') {
        setVideos(prev =>
          prev.map(v => v.id === contentId ? { ...v, isFavorited } : v)
        );
      } else {
        setNews(prev =>
          prev.map(n => n.id === contentId ? { ...n, isFavorited } : n)
        );
      }
    } catch (error) {
      console.error('收藏失败:', error);
      alert('收藏失败，请重试');
    }
  };

  const handleLike = async (contentId: string, contentType: 'video' | 'news') => {
    try {
      const isLiked = await supabaseService.toggleLike(contentId, contentType);
      
      if (contentType === 'video') {
        setVideos(prev =>
          prev.map(v => 
            v.id === contentId 
              ? { ...v, isLiked, likesCount: (v.likesCount || 0) + (isLiked ? 1 : -1) } 
              : v
          )
        );
      } else {
        setNews(prev =>
          prev.map(n => 
            n.id === contentId 
              ? { ...n, isLiked, likesCount: (n.likesCount || 0) + (isLiked ? 1 : -1) } 
              : n
          )
        );
      }
    } catch (error) {
      console.error('点赞失败:', error);
    }
  };

  const filteredVideos = activeCategory === '全部' 
    ? videos 
    : videos.filter(v => v.category === categoryMap[activeCategory]);

  // 页面路由
  if (selectedVideoId) {
    return (
      <VideoDetail
        videoId={selectedVideoId}
        onBack={() => setSelectedVideoId(null)}
      />
    );
  }

  if (selectedNewsId) {
    return (
      <NewsDetail
        newsId={selectedNewsId}
        onBack={() => setSelectedNewsId(null)}
      />
    );
  }

  if (showSearch) {
    return (
      <SearchResults
        onBack={() => setShowSearch(false)}
        onSelectVideo={(id) => {
          setShowSearch(false);
          setSelectedVideoId(id);
        }}
        onSelectNews={(id) => {
          setShowSearch(false);
          setSelectedNewsId(id);
        }}
        onSelectEvent={(id) => {
          setShowSearch(false);
          // 处理活动选择
        }}
      />
    );
  }

  if (showNotifications) {
    return (
      <Notifications
        onClose={() => setShowNotifications(false)}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  const latestNews = news.length > 0 ? news[0] : null;

  return (
    <div className="space-y-6 pb-24">
      {/* Header Section */}
      <div className="bg-brand-600 text-white p-6 rounded-b-3xl shadow-lg relative overflow-hidden">
        {/* Header Actions */}
        <div className="absolute top-4 right-4 flex items-center space-x-2 z-20">
          <button
            onClick={() => setShowSearch(true)}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm"
          >
            <Search size={20} />
          </button>
          <NotificationBell onClick={() => setShowNotifications(true)} />
        </div>

        <div className="absolute top-0 right-0 opacity-10 transform translate-x-10 -translate-y-10">
           <svg width="200" height="200" viewBox="0 0 200 200" fill="white">
             <circle cx="100" cy="100" r="80" />
           </svg>
        </div>
        
        <h1 className="text-2xl font-bold mb-1 relative z-10">欢迎回来，{currentUser.name}!</h1>
        <p className="text-brand-100 text-sm mb-6 relative z-10">准备好开始今天的康复训练了吗？</p>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 flex items-center justify-between relative z-10">
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
          {filteredVideos.length === 0 ? (
            <div className="text-center py-10 text-gray-400">暂无视频</div>
          ) : (
            filteredVideos.slice(0, 5).map(video => (
              <div
                key={video.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden flex active:scale-[0.99] transition-transform duration-100 cursor-pointer relative"
              >
                {/* Progress Bar */}
                {video.progress && video.progress > 0 && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 z-10">
                    <div
                      className="h-full bg-brand-600"
                      style={{ width: `${video.progress}%` }}
                    ></div>
                  </div>
                )}

                <div
                  className="w-1/3 relative overflow-hidden"
                  onClick={() => setSelectedVideoId(video.id)}
                  style={{ 
                    borderTopLeftRadius: '12px', 
                    borderBottomLeftRadius: '12px' 
                  }}
                >
                  <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="bg-white/30 backdrop-blur-sm p-1.5 rounded-full">
                       <Play size={16} className="text-white fill-white" />
                    </div>
                  </div>
                </div>
                <div className="w-2/3 p-3 flex flex-col justify-between">
                  <div onClick={() => setSelectedVideoId(video.id)}>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-[10px] px-1.5 py-0.5 bg-brand-50 text-brand-600 rounded font-medium border border-brand-100">
                        {video.category === 'Rehab' ? '复健' : video.category === 'Core' ? '核心' : video.category === 'Cardio' ? '有氧' : video.category}
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
                    {video.views > 0 &&  <span className="text-[10px] text-gray-400">{video.views} 次观看</span>}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Health Tips Preview */}
      <div className="px-4">
        <h2 className="text-lg font-bold text-gray-800 mb-3">每日健康贴士</h2>
        {latestNews ? (
          <div
            onClick={() => setSelectedNewsId(latestNews.id)}
            className="bg-gradient-to-r from-green-50 to-brand-50 p-4 rounded-xl border border-green-100 cursor-pointer active:scale-[0.99] transition-transform relative"
          >
            <div className="absolute top-3 right-3 flex items-center space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFavorite(latestNews.id, 'news');
                }}
                className="flex items-center space-x-0.5 bg-white hover:bg-gray-50 rounded-full transition-colors shadow-sm px-2 py-1.5"
              >
                <Bookmark
                  size={12}
                  className={latestNews.isFavorited ? 'text-yellow-500 fill-yellow-500' : 'text-gray-500'}
                />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike(latestNews.id, 'news');
                }}
                className="flex items-center space-x-1 bg-white hover:bg-gray-50 rounded-full transition-colors shadow-sm px-2 py-1.5"
              >
                <Heart
                  size={12}
                  className={latestNews.isLiked ? 'text-red-500 fill-red-500' : 'text-gray-500'}
                />
                {latestNews.likesCount && latestNews.likesCount > 0 && (
                  <span className="text-[9px] text-gray-600 min-w-[12px] text-center font-medium">{latestNews.likesCount}</span>
                )}
              </button>
            </div>
            <div className="flex items-start space-x-3 mb-3">
              <div className="flex-shrink-0 w-16 h-16 overflow-hidden bg-gray-200" style={{ borderRadius: '8px' }}>
                <img 
                  src={latestNews.coverImage} 
                  alt={latestNews.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 pr-24">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-[10px] px-2 py-0.5 bg-brand-600 text-white rounded-full font-medium">
                    {latestNews.category}
                  </span>
                  <span className="text-[10px] text-gray-500">{latestNews.date}</span>
                </div>
                <h3 className="font-bold text-gray-800 text-sm line-clamp-2 leading-snug">
                  {latestNews.title}
                </h3>
              </div>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2 mb-3 leading-relaxed">
              {latestNews.summary}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-xs text-gray-500">
                <Clock size={12} className="mr-1" />
                {latestNews.readTime}
              </div>
              <button className="text-xs font-bold text-brand-700 bg-white px-3 py-1.5 rounded-full shadow-sm hover:shadow-md transition-shadow">
                查看详情 →
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 text-gray-400">暂无资讯</div>
        )}
      </div>
    </div>
  );
};
