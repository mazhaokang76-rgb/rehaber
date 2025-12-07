// components/EventDetail.tsx - 增强版活动详情页
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Share2, Heart, MapPin, Calendar, Users, Bookmark } from 'lucide-react';
import { supabaseService } from '../services/supabase';
import type { Event } from '../services/supabase';
import { Comments } from './Comments'; // 新增：导入评论组件

interface EventDetailProps {
  eventId: string;
  onBack: () => void;
}

export const EventDetail: React.FC<EventDetailProps> = ({ eventId, onBack }) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [liked, setLiked] = useState(false);
  const [favorited, setFavorited] = useState(false); // 新增：收藏状态
  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEventDetail();
  }, [eventId]);

  const loadEventDetail = async () => {
    try {
      setLoading(true);
      const data = await supabaseService.getEventById(eventId);
      if (data) {
        setEvent(data);
        setLiked(data.isLiked || false); // 新增：设置点赞状态
        setFavorited(data.isFavorited || false); // 新增：设置收藏状态
        setJoined(data.joined);
      }
    } catch (error) {
      console.error('加载活动失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: event?.title || '锐汗步活动',
      text: `${event?.title} - ${event?.time}`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('链接已复制到剪贴板！');
      }
    } catch (error) {
      console.error('分享失败:', error);
    }
  };

  // 新增：处理点赞
  const handleLike = async () => {
    try {
      const isLiked = await supabaseService.toggleLike(eventId, 'event');
      setLiked(isLiked);
      if (event) {
        setEvent({
          ...event,
          isLiked,
          likes: event.likes + (isLiked ? 1 : -1)
        });
      }
    } catch (error) {
      console.error('点赞失败:', error);
      alert('操作失败，请重试');
    }
  };

  // 新增：处理收藏
  const handleFavorite = async () => {
    try {
      const isFavorited = await supabaseService.toggleFavorite(eventId, 'event');
      setFavorited(isFavorited);
      if (event) {
        setEvent({
          ...event,
          isFavorited
        });
      }
    } catch (error) {
      console.error('收藏失败:', error);
      alert('操作失败，请重试');
    }
  };

  const handleJoin = async () => {
    try {
      setRegistering(true);
      const isRegistered = await supabaseService.registerEvent(eventId);
      setJoined(isRegistered);
      
      if (isRegistered) {
        // 显示成功提示
        const notification = document.createElement('div');
        notification.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-brand-600 text-white px-6 py-3 rounded-full shadow-lg z-50';
        notification.innerHTML = '✅ 报名成功！我们会在活动开始前提醒你';
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
      } else {
        alert('已取消报名');
      }
    } catch (error) {
      console.error('报名失败:', error);
      alert('操作失败，请重试');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="text-gray-400 mb-4">活动不存在</div>
        <button onClick={onBack} className="text-brand-600 font-bold">返回</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <div className="flex items-center space-x-2">
            {/* 新增：收藏按钮 */}
            <button
              onClick={handleFavorite}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Bookmark
                size={24}
                className={favorited ? 'text-yellow-500 fill-yellow-500' : 'text-gray-700'}
              />
            </button>
            {/* 修改：点赞按钮调用新的处理函数 */}
            <button
              onClick={handleLike}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Heart
                size={24}
                className={liked ? 'text-red-500 fill-red-500' : 'text-gray-700'}
              />
            </button>
            <button
              onClick={handleShare}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Share2 size={24} className="text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      <div className="relative w-full h-72 bg-gray-200">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex flex-wrap gap-2">
            {event.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-white/90 backdrop-blur-sm text-brand-600 text-xs font-bold px-3 py-1 rounded-full shadow-lg"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-t-3xl -mt-6 relative z-10">
        <div className="px-6 py-6">
          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-4">
            {event.title}
          </h1>

          {/* Quick Info Cards */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-brand-50 rounded-xl p-4">
              <div className="flex items-center text-brand-600 mb-1">
                <Calendar size={18} className="mr-2" />
                <span className="text-xs font-medium">活动时间</span>
              </div>
              <div className="text-sm font-bold text-gray-900">{event.time}</div>
            </div>
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-center text-blue-600 mb-1">
                <MapPin size={18} className="mr-2" />
                <span className="text-xs font-medium">活动地点</span>
              </div>
              <div className="text-sm font-bold text-gray-900">{event.location}</div>
            </div>
          </div>

          {/* Organizer */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center">
                  <Users size={24} className="text-brand-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">主办方</div>
                  <div className="font-bold text-gray-900">{event.organizer}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats - 修改：显示真实的点赞和评论数 */}
          <div className="flex items-center space-x-6 mb-6 pb-6 border-b border-gray-100">
            <div className="flex items-center text-gray-600">
              <Heart size={18} className="mr-2" />
              <span className="text-sm">{event.likes} 人感兴趣</span>
            </div>
            {/* 新增：显示评论数 */}
            <div className="flex items-center text-gray-600">
              <span className="text-sm">{event.commentsCount || 0} 条评论</span>
            </div>
          </div>

          {/* Description */}
          {event.description && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">活动介绍</h3>
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {event.description}
              </div>
            </div>
          )}

          {/* Participants */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-gray-900">已报名</h3>
              <span className="text-sm text-gray-500">{event.likes} 人</span>
            </div>
            <div className="flex -space-x-3">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <img
                  key={i}
                  src={`https://picsum.photos/seed/user${i}/100/100`}
                  alt="参与者"
                  className="w-10 h-10 rounded-full border-2 border-white"
                />
              ))}
              {event.likes > 8 && (
                <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                  +{event.likes - 8}
                </div>
              )}
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">活动位置</h3>
            <div className="w-full h-48 bg-gray-200 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <MapPin size={32} className="text-gray-400 mx-auto mb-2" />
                <div className="text-sm text-gray-500">地图加载中...</div>
              </div>
            </div>
          </div>

          {/* 新增：快捷操作栏 */}
          <div className="flex items-center justify-center space-x-3 py-6 border-t border-b border-gray-100 mb-6">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-full transition-all ${
                liked
                  ? 'bg-red-50 text-red-600 border-2 border-red-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Heart
                size={18}
                className={liked ? 'fill-red-600' : ''}
              />
              <span className="font-medium text-sm">{liked ? '已感兴趣' : '感兴趣'}</span>
            </button>
            <button
              onClick={handleFavorite}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-full transition-all ${
                favorited
                  ? 'bg-yellow-50 text-yellow-600 border-2 border-yellow-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Bookmark
                size={18}
                className={favorited ? 'fill-yellow-600' : ''}
              />
              <span className="font-medium text-sm">{favorited ? '已收藏' : '收藏'}</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
            >
              <Share2 size={18} />
              <span className="font-medium text-sm">分享</span>
            </button>
          </div>

          {/* Important Info */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-start">
              <div className="text-2xl mr-3">⚠️</div>
              <div>
                <div className="font-bold text-gray-900 mb-1">重要提示</div>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 请提前10分钟到达现场</li>
                  <li>• 如遇恶劣天气活动将取消</li>
                  <li>• 取消报名请提前24小时通知</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 新增：评论区 - 添加在内容底部，Fixed Button 之前 */}
      <div className="mt-4 mb-20">
        <Comments 
          contentId={eventId} 
          contentType="event" 
        />
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-lg z-40">
        <div className="max-w-md mx-auto flex items-center space-x-3">
          <div className="flex-1">
            <div className="text-xs text-gray-500">活动费用</div>
            <div className="text-xl font-bold text-brand-600">免费</div>
          </div>
          <button
            onClick={handleJoin}
            disabled={registering}
            className={`px-8 py-3 rounded-xl font-bold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              joined
                ? 'bg-gray-200 text-gray-600'
                : 'bg-brand-600 text-white hover:bg-brand-700 shadow-brand-200'
            }`}
          >
            {registering ? '处理中...' : joined ? '已报名' : '我要报名'}
          </button>
        </div>
      </div>
    </div>
  );
};
