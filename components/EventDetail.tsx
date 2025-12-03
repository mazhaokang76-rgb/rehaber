import React, { useState, useEffect } from 'react';
import { ArrowLeft, Share2, Heart, MapPin, Calendar, Users, Clock } from 'lucide-react';
import type { Event } from '../services/supabase';

interface EventDetailProps {
  eventId: string;
  onBack: () => void;
}

export const EventDetail: React.FC<EventDetailProps> = ({ eventId, onBack }) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [liked, setLiked] = useState(false);
  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEventDetail();
  }, [eventId]);

  const loadEventDetail = async () => {
    try {
      setLoading(true);
      // 模拟数据
      const mockEvent: Event = {
        id: eventId,
        title: '周日晨间瑜伽',
        location: '朝阳公园·绿地区',
        time: '周日, 8:00 AM - 9:30 AM',
        image: 'https://picsum.photos/seed/yoga/800/500',
        likes: 45,
        joined: false,
        organizer: '艾德琳瑜伽',
        tags: ['瑜伽', '户外', '初级']
      };
      setEvent(mockEvent);
      setLiked(mockEvent.joined);
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

  const handleJoin = () => {
    setJoined(!joined);
    alert(joined ? '已取消报名' : '报名成功！');
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
            <button
              onClick={() => setLiked(!liked)}
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
              <button className="text-brand-600 text-sm font-bold">
                查看主页
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">活动介绍</h3>
            <div className="text-gray-700 leading-relaxed space-y-3">
              <p>
                在这个美好的周日清晨，让我们一起在朝阳公园的绿地上练习瑜伽，迎接新一天的阳光。本次活动适合所有水平的瑜伽爱好者，我们将进行舒缓的晨间流瑜伽练习。
              </p>
              <p>
                <strong>活动亮点：</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>专业瑜伽教练指导</li>
                <li>户外新鲜空气，亲近自然</li>
                <li>适合初学者，无需基础</li>
                <li>提供瑜伽垫租借服务</li>
                <li>活动后提供健康早餐</li>
              </ul>
            </div>
          </div>

          {/* What to Bring */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <div className="flex items-start">
              <div className="text-2xl mr-3">🎒</div>
              <div>
                <div className="font-bold text-gray-900 mb-2">需要携带</div>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 舒适的运动服装</li>
                  <li>• 水杯和毛巾</li>
                  <li>• 防晒用品（夏季）</li>
                  <li>• 瑜伽垫（可选，现场提供租借）</li>
                </ul>
              </div>
            </div>
          </div>

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

          {/* Important Info */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
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

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-lg z-40">
        <div className="max-w-md mx-auto flex items-center space-x-3">
          <div className="flex-1">
            <div className="text-xs text-gray-500">活动费用</div>
            <div className="text-xl font-bold text-brand-600">免费</div>
          </div>
          <button
            onClick={handleJoin}
            className={`px-8 py-3 rounded-xl font-bold shadow-lg transition-all ${
              joined
                ? 'bg-gray-200 text-gray-600'
                : 'bg-brand-600 text-white hover:bg-brand-700 shadow-brand-200'
            }`}
          >
            {joined ? '已报名' : '立即报名'}
          </button>
        </div>
      </div>
    </div>
  );
};
