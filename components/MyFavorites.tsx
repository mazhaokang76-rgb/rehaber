// components/MyFavorites.tsx - 我的收藏页面
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Bookmark, Play, Calendar, Clock, Trash2 } from 'lucide-react';
import { supabaseService } from '../services/supabase';

interface MyFavoritesProps {
  onBack: () => void;
  onSelectVideo?: (id: string) => void;
  onSelectNews?: (id: string) => void;
  onSelectEvent?: (id: string) => void;
}

export const MyFavorites: React.FC<MyFavoritesProps> = ({ 
  onBack,
  onSelectVideo,
  onSelectNews,
  onSelectEvent
}) => {
  const [filter, setFilter] = useState<'all' | 'video' | 'news' | 'event'>('all');
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailedFavorites, setDetailedFavorites] = useState<any[]>([]);

  useEffect(() => {
    loadFavorites();
  }, [filter]);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const contentType = filter === 'all' ? undefined : filter as any;
      const favs = await supabaseService.getFavorites(contentType);
      setFavorites(favs);

      // Load detailed information for each favorite
      const detailed = await Promise.all(
        favs.map(async (fav) => {
          let item = null;
          try {
            if (fav.content_type === 'video') {
              item = await supabaseService.getVideoById(fav.content_id);
            } else if (fav.content_type === 'news') {
              item = await supabaseService.getNewsById(fav.content_id);
            } else if (fav.content_type === 'event') {
              item = await supabaseService.getEventById(fav.content_id);
            }
          } catch (error) {
            console.error('加载收藏详情失败:', error);
          }
          return item ? { ...item, _type: fav.content_type, _favoriteTime: fav.created_at } : null;
        })
      );

      setDetailedFavorites(detailed.filter(item => item !== null));
    } catch (error) {
      console.error('加载收藏失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (contentId: string, contentType: string) => {
    if (!confirm('确定要取消收藏吗？')) return;

    try {
      await supabaseService.toggleFavorite(contentId, contentType as any);
      await loadFavorites();
    } catch (error) {
      console.error('取消收藏失败:', error);
      alert('操作失败，请重试');
    }
  };

  const handleItemClick = (item: any) => {
    if (item._type === 'video' && onSelectVideo) {
      onSelectVideo(item.id);
    } else if (item._type === 'news' && onSelectNews) {
      onSelectNews(item.id);
    } else if (item._type === 'event' && onSelectEvent) {
      onSelectEvent(item.id);
    }
  };

  const getTypeLabel = (type: string) => {
    const labels = { video: '视频', news: '文章', event: '活动' };
    return labels[type as keyof typeof labels] || type;
  };

  const filteredFavorites = filter === 'all' 
    ? detailedFavorites 
    : detailedFavorites.filter(f => f._type === filter);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft size={24} className="text-gray-700" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">我的收藏</h1>
                <p className="text-xs text-gray-500">
                  共 {detailedFavorites.length} 个收藏
                </p>
              </div>
            </div>
            <Bookmark size={24} className="text-yellow-500 fill-yellow-500" />
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-2">
            {[
              { value: 'all', label: '全部', icon: '📚' },
              { value: 'video', label: '视频', icon: '🎥' },
              { value: 'news', label: '文章', icon: '📰' },
              { value: 'event', label: '活动', icon: '🎉' }
            ].map(tab => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value as any)}
                className={`flex items-center space-x-1 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  filter === tab.value
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
          </div>
        ) : filteredFavorites.length === 0 ? (
          <div className="text-center py-20">
            <Bookmark size={64} className="mx-auto text-gray-300 mb-4" />
            <div className="text-gray-400 font-medium mb-2">
              {filter === 'all' ? '还没有收藏任何内容' : `还没有收藏${getTypeLabel(filter)}`}
            </div>
            <div className="text-gray-300 text-sm">
              点击内容右上角的书签图标即可收藏
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFavorites.map((item) => (
              <FavoriteCard
                key={`${item._type}-${item.id}`}
                item={item}
                onClick={() => handleItemClick(item)}
                onRemove={() => handleRemoveFavorite(item.id, item._type)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Favorite Card Component
interface FavoriteCardProps {
  item: any;
  onClick: () => void;
  onRemove: () => void;
}

const FavoriteCard: React.FC<FavoriteCardProps> = ({ item, onClick, onRemove }) => {
  const getTypeColor = (type: string) => {
    const colors = {
      video: 'bg-purple-100 text-purple-700',
      news: 'bg-blue-100 text-blue-700',
      event: 'bg-green-100 text-green-700'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const getTypeLabel = (type: string) => {
    const labels = { video: '视频', news: '文章', event: '活动' };
    return labels[type as keyof typeof labels] || type;
  };

  const formatFavoriteTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / 86400000);

    if (days === 0) return '今天收藏';
    if (days === 1) return '昨天收藏';
    if (days < 7) return `${days}天前收藏`;
    if (days < 30) return `${Math.floor(days / 7)}周前收藏`;
    return date.toLocaleDateString('zh-CN');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="flex">
        {/* Thumbnail */}
        <div
          onClick={onClick}
          className="w-32 h-32 flex-shrink-0 relative cursor-pointer"
        >
          <img
            src={item.thumbnail || item.coverImage || item.image || 'https://picsum.photos/200/200'}
            alt={item.title}
            className="w-full h-full object-cover"
          />
          {item._type === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full">
                <Play size={20} className="text-brand-600 fill-brand-600" />
              </div>
            </div>
          )}
          <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-bold ${getTypeColor(item._type)}`}>
            {getTypeLabel(item._type)}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-3 flex flex-col justify-between">
          <div onClick={onClick} className="cursor-pointer">
            {/* Category */}
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs px-2 py-0.5 bg-brand-50 text-brand-600 rounded-full font-medium">
                {item.category}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-bold text-sm text-gray-900 line-clamp-2 leading-snug mb-2">
              {item.title}
            </h3>

            {/* Meta Info */}
            <div className="space-y-1">
              {item._type === 'video' && (
                <div className="flex items-center text-xs text-gray-400">
                  <Clock size={12} className="mr-1" />
                  <span>{item.duration}</span>
                  <span className="mx-2">•</span>
                  <span>{item.views} 观看</span>
                </div>
              )}
              {item._type === 'news' && (
                <div className="flex items-center text-xs text-gray-400">
                  <Clock size={12} className="mr-1" />
                  <span>{item.readTime}</span>
                  <span className="mx-2">•</span>
                  <span>{item.date}</span>
                </div>
              )}
              {item._type === 'event' && (
                <div className="flex items-center text-xs text-gray-400">
                  <Calendar size={12} className="mr-1" />
                  <span>{item.time}</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-400">
              {formatFavoriteTime(item._favoriteTime)}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="flex items-center space-x-1 text-xs text-red-500 hover:text-red-600 font-medium transition-colors"
            >
              <Trash2 size={14} />
              <span>取消收藏</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
