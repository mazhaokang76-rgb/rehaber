import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Heart, Bookmark, Share2, ArrowLeft, CheckCircle, Clock, Bell } from 'lucide-react';

// ============================================
// 模拟 Supabase 服务（实际项目中已经存在）
// ============================================
const mockSupabase = {
  // 获取当前用户ID
  getCurrentUserId: () => {
    try {
      const userStr = localStorage.getItem('rehaber_user');
      if (userStr) {
        const user = JSON.parse(userStr);
        return user.id;
      }
    } catch (error) {
      console.error('获取用户ID失败:', error);
    }
    return 'user_demo_123'; // Demo用户
  },

  // 活动报名/取消
  registerEvent: async (eventId: string): Promise<boolean> => {
    const userId = mockSupabase.getCurrentUserId();
    const key = `event_reg_${userId}_${eventId}`;
    
    const isRegistered = localStorage.getItem(key) === 'true';
    
    if (isRegistered) {
      localStorage.removeItem(key);
      // 移除通知
      const notifKey = `event_notif_${userId}_${eventId}`;
      localStorage.removeItem(notifKey);
      return false;
    } else {
      localStorage.setItem(key, 'true');
      // 添加通知
      const notifKey = `event_notif_${userId}_${eventId}`;
      const notification = {
        id: `notif_${Date.now()}`,
        title: '报名成功',
        message: '您已成功报名活动，我们会在活动开始前提醒您',
        type: 'event',
        relatedId: eventId,
        read: false,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem(notifKey, JSON.stringify(notification));
      return true;
    }
  },

  // 检查是否已报名
  checkRegistration: (eventId: string): boolean => {
    const userId = mockSupabase.getCurrentUserId();
    const key = `event_reg_${userId}_${eventId}`;
    return localStorage.getItem(key) === 'true';
  },

  // 获取我的活动报名
  getMyRegistrations: (): string[] => {
    const userId = mockSupabase.getCurrentUserId();
    const registrations: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(`event_reg_${userId}_`)) {
        const eventId = key.replace(`event_reg_${userId}_`, '');
        registrations.push(eventId);
      }
    }
    
    return registrations;
  },

  // 获取通知
  getNotifications: () => {
    const userId = mockSupabase.getCurrentUserId();
    const notifications: any[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(`event_notif_${userId}_`)) {
        const notifStr = localStorage.getItem(key);
        if (notifStr) {
          notifications.push(JSON.parse(notifStr));
        }
      }
    }
    
    return notifications.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
};

// ============================================
// 模拟活动数据
// ============================================
const mockEvents = [
  {
    id: 'event_1',
    title: '城市健康跑 - 春季马拉松',
    location: '北京奥林匹克公园',
    time: '2025-03-15 08:00',
    image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800',
    description: '春季马拉松活动，全程42公里，半程21公里，迷你跑5公里，适合各个水平的跑者参加。赛事提供专业计时、补给站、医疗保障等服务。',
    likes: 234,
    organizer: '北京跑步协会',
    tags: ['马拉松', '户外', '有氧运动'],
  },
  {
    id: 'event_2',
    title: '瑜伽工作坊 - 身心平衡',
    location: '朝阳区瑜伽馆',
    time: '2025-03-20 14:00',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
    description: '专业瑜伽导师带领，学习基础到进阶的瑜伽体式，包括呼吸控制、冥想技巧等。适合初学者和有经验的练习者。',
    likes: 156,
    organizer: '和谐瑜伽中心',
    tags: ['瑜伽', '放松', '柔韧性'],
  },
  {
    id: 'event_3',
    title: '核心力量训练营',
    location: '海淀区健身中心',
    time: '2025-03-25 10:00',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800',
    description: '为期4周的核心力量训练计划，包括腹肌、背部、臀部等核心肌群的专项训练。适合想要提升运动表现和改善体态的人群。',
    likes: 189,
    organizer: '强健体能工作室',
    tags: ['力量训练', '核心', '体能'],
  }
];

// ============================================
// 活动详情页组件
// ============================================
const EventDetailPage: React.FC<{
  event: any;
  onBack: () => void;
  onRegistrationChange: () => void;
}> = ({ event, onBack, onRegistrationChange }) => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [liked, setLiked] = useState(false);
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    setIsRegistered(mockSupabase.checkRegistration(event.id));
  }, [event.id]);

  const handleRegister = async () => {
    setRegistering(true);
    
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newStatus = await mockSupabase.registerEvent(event.id);
    setIsRegistered(newStatus);
    onRegistrationChange();
    
    if (newStatus) {
      // 显示成功提示
      const notification = document.createElement('div');
      notification.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg z-[9999] animate-bounce';
      notification.innerHTML = '✅ 报名成功！我们会在活动开始前提醒你';
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
    }
    
    setRegistering(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
              onClick={() => setFavorited(!favorited)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Bookmark
                size={24}
                className={favorited ? 'text-yellow-500 fill-yellow-500' : 'text-gray-700'}
              />
            </button>
            <button
              onClick={() => setLiked(!liked)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Heart
                size={24}
                className={liked ? 'text-red-500 fill-red-500' : 'text-gray-700'}
              />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
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
            {event.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="bg-white/90 backdrop-blur-sm text-emerald-600 text-xs font-bold px-3 py-1 rounded-full shadow-lg"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-t-3xl -mt-6 relative z-10 pb-24">
        <div className="px-6 py-6">
          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-4">
            {event.title}
          </h1>

          {/* Quick Info Cards */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-emerald-50 rounded-xl p-4">
              <div className="flex items-center text-emerald-600 mb-1">
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
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Users size={24} className="text-emerald-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">主办方</div>
                  <div className="font-bold text-gray-900">{event.organizer}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-6 mb-6 pb-6 border-b border-gray-100">
            <div className="flex items-center text-gray-600">
              <Heart size={18} className="mr-2" />
              <span className="text-sm">{event.likes} 人感兴趣</span>
            </div>
            {isRegistered && (
              <div className="flex items-center text-green-600">
                <CheckCircle size={18} className="mr-2" />
                <span className="text-sm font-bold">已报名</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">活动介绍</h3>
            <div className="text-gray-700 leading-relaxed">
              {event.description}
            </div>
          </div>

          {/* Important Info */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
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
            <div className="text-xl font-bold text-emerald-600">免费</div>
          </div>
          <button
            onClick={handleRegister}
            disabled={registering}
            className={`px-8 py-3 rounded-xl font-bold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              isRegistered
                ? 'bg-gray-200 text-gray-600'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            {registering ? '处理中...' : isRegistered ? '已报名' : '我要报名'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// 我的活动页面
// ============================================
const MyEventsPage: React.FC<{
  onBack: () => void;
  onSelectEvent: (event: any) => void;
}> = ({ onBack, onSelectEvent }) => {
  const [myEventIds, setMyEventIds] = useState<string[]>([]);

  useEffect(() => {
    loadMyEvents();
  }, []);

  const loadMyEvents = () => {
    setMyEventIds(mockSupabase.getMyRegistrations());
  };

  const myEvents = mockEvents.filter(e => myEventIds.includes(e.id));

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft size={24} className="text-gray-700" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">我的活动</h1>
                <p className="text-xs text-gray-500">共 {myEvents.length} 个报名</p>
              </div>
            </div>
            <Calendar size={24} className="text-emerald-500" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4">
        {myEvents.length === 0 ? (
          <div className="text-center py-20">
            <Calendar size={64} className="mx-auto text-gray-300 mb-4" />
            <div className="text-gray-400 font-medium mb-2">还没有报名任何活动</div>
            <div className="text-gray-300 text-sm">去社区看看有哪些精彩活动吧！</div>
          </div>
        ) : (
          <div className="space-y-3">
            {myEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => onSelectEvent(event)}
                className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-all active:scale-[0.99]"
              >
                <div className="flex">
                  {/* Thumbnail */}
                  <div className="w-32 h-32 flex-shrink-0 relative">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                      <CheckCircle size={12} className="mr-1" />
                      已报名
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-3 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-gray-900 line-clamp-2 leading-snug mb-2">
                        {event.title}
                      </h3>
                      <div className="space-y-1">
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock size={12} className="mr-1" />
                          {event.time}
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <MapPin size={12} className="mr-1" />
                          {event.location}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// 通知中心
// ============================================
const NotificationsPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    setNotifications(mockSupabase.getNotifications());
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft size={24} className="text-gray-700" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">通知中心</h1>
                <p className="text-xs text-gray-500">{notifications.length} 条通知</p>
              </div>
            </div>
            <Bell size={24} className="text-emerald-500" />
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="divide-y divide-gray-100">
        {notifications.length === 0 ? (
          <div className="text-center py-20">
            <Bell size={64} className="mx-auto text-gray-300 mb-4" />
            <div className="text-gray-400 font-medium">暂无通知</div>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className="bg-blue-50/50 px-4 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <Calendar size={20} className="text-green-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 text-sm leading-snug mb-1">
                    {notif.title}
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed mb-2">
                    {notif.message}
                  </p>
                  <span className="text-xs text-gray-400">
                    {new Date(notif.createdAt).toLocaleString('zh-CN')}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ============================================
// 主应用组件
// ============================================
const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'list' | 'detail' | 'myEvents' | 'notifications'>('list');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSelectEvent = (event: any) => {
    setSelectedEvent(event);
    setCurrentView('detail');
  };

  const handleRegistrationChange = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (currentView === 'detail' && selectedEvent) {
    return (
      <EventDetailPage
        event={selectedEvent}
        onBack={() => setCurrentView('list')}
        onRegistrationChange={handleRegistrationChange}
      />
    );
  }

  if (currentView === 'myEvents') {
    return (
      <MyEventsPage
        onBack={() => setCurrentView('list')}
        onSelectEvent={handleSelectEvent}
      />
    );
  }

  if (currentView === 'notifications') {
    return (
      <NotificationsPage
        onBack={() => setCurrentView('list')}
      />
    );
  }

  // 活动列表（社区页面）
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">社区活动</h1>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentView('notifications')}
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Bell size={20} className="text-gray-600" />
                {mockSupabase.getNotifications().length > 0 && (
                  <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                )}
              </button>
              <button
                onClick={() => setCurrentView('myEvents')}
                className="flex items-center space-x-1 bg-emerald-50 text-emerald-600 px-3 py-2 rounded-full text-sm font-bold hover:bg-emerald-100 transition-colors"
              >
                <Calendar size={16} />
                <span>我的活动</span>
                {mockSupabase.getMyRegistrations().length > 0 && (
                  <span className="bg-emerald-600 text-white text-xs px-1.5 rounded-full">
                    {mockSupabase.getMyRegistrations().length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="p-4 space-y-4" key={refreshKey}>
        {mockEvents.map((event) => {
          const isRegistered = mockSupabase.checkRegistration(event.id);
          
          return (
            <div
              key={event.id}
              onClick={() => handleSelectEvent(event)}
              className="bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-all active:scale-[0.99]"
            >
              <div className="relative h-48">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover"
                />
                {isRegistered && (
                  <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center shadow-lg">
                    <CheckCircle size={14} className="mr-1" />
                    已报名
                  </div>
                )}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded-md text-gray-800 shadow-sm">
                  {event.tags[0]}
                </div>
              </div>
              
              <div className="p-5">
                <h2 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h2>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar size={16} className="mr-2 text-emerald-500" />
                    {event.time}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin size={16} className="mr-2 text-emerald-500" />
                    {event.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users size={16} className="mr-2 text-emerald-500" />
                    {event.organizer}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-gray-50 pt-4">
                  <div className="flex items-center text-gray-500">
                    <Heart size={16} className="mr-1" />
                    <span className="text-sm">{event.likes} 人感兴趣</span>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectEvent(event);
                    }}
                    className="bg-emerald-600 text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg hover:bg-emerald-700 transition-colors"
                  >
                    {isRegistered ? '查看详情' : '立即报名'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default App;
