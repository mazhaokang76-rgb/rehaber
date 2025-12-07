// pages/Profile.tsx - 增强版个人中心
import React, { useState, useEffect } from 'react';
import { Settings, ChevronRight, Award, BookOpen, Activity, LogOut, Bell, Bookmark, Calendar, Video } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ProfileEdit } from '../components/ProfileEdit';
import { MyFavorites } from '../components/MyFavorites';
import { supabaseService } from '../services/supabase';

// 周活动数据
const weeklyActivityData = [
  { name: '周一', mins: 30 },
  { name: '周二', mins: 45 },
  { name: '周三', mins: 20 },
  { name: '周四', mins: 60 },
  { name: '周五', mins: 0 },
  { name: '周六', mins: 90 },
  { name: '周日', mins: 30 },
];

interface ProfileProps {
  onSelectVideo?: (id: string) => void;
  onSelectNews?: (id: string) => void;
  onSelectEvent?: (id: string) => void;
}

export const Profile: React.FC<ProfileProps> = ({ 
  onSelectVideo,
  onSelectNews,
  onSelectEvent
}) => {
  const [currentUser, setCurrentUser] = useState({
    id: '',
    name: '用户',
    avatar: 'https://picsum.photos/seed/user_alex/200/200',
    createdAt: new Date().toISOString(),
    loginCount: 0,
    stats: {
      trainingMinutes: 0,
      daysStreak: 0,
      caloriesBurned: 0
    }
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    loadUserData();
    loadFavoritesCount();
    loadUnreadNotifications();
  }, []);

  const loadUserData = () => {
    const userStr = localStorage.getItem('rehaber_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUser(user);
    }
  };

  const loadFavoritesCount = async () => {
    try {
      const favorites = await supabaseService.getFavorites();
      setFavoritesCount(favorites.length);
    } catch (error) {
      console.error('加载收藏数失败:', error);
    }
  };

  const loadUnreadNotifications = async () => {
    try {
      const count = await supabaseService.getUnreadNotificationCount();
      setUnreadNotifications(count);
    } catch (error) {
      console.error('加载通知数失败:', error);
    }
  };

  const handleSaveProfile = (name: string, avatar: string) => {
    const updatedUser = { ...currentUser, name, avatar };
    setCurrentUser(updatedUser);
    localStorage.setItem('rehaber_user', JSON.stringify(updatedUser));
    setIsEditing(false);
  };

  const handleLogout = () => {
    if (confirm('确定要退出登录吗？')) {
      localStorage.removeItem('rehaber_user');
      localStorage.removeItem('rehaber_token');
      window.location.reload();
    }
  };

  // 如果正在编辑，显示编辑页面
  if (isEditing) {
    return (
      <ProfileEdit
        userId={currentUser.id}
        currentName={currentUser.name}
        currentAvatar={currentUser.avatar}
        onSave={handleSaveProfile}
        onBack={() => setIsEditing(false)}
      />
    );
  }

  // 如果查看收藏，显示收藏页面
  if (showFavorites) {
    return (
      <MyFavorites
        onBack={() => {
          setShowFavorites(false);
          loadFavoritesCount(); // 刷新收藏数
        }}
        onSelectVideo={onSelectVideo}
        onSelectNews={onSelectNews}
        onSelectEvent={onSelectEvent}
      />
    );
  }

  return (
    <div className="pb-24 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white pb-6 pt-10 px-6 rounded-b-3xl shadow-sm">
        <div className="flex items-center space-x-4">
            <div
              onClick={() => setIsEditing(true)}
              className="relative cursor-pointer group"
            >
                <img
                  src={currentUser.avatar}
                  alt="Profile"
                  className="w-20 h-20 rounded-full border-4 border-brand-100 group-hover:border-brand-300 transition-colors object-cover"
                />
                <div className="absolute bottom-0 right-0 bg-brand-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white">
                    LV.5
                </div>
                <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                  <div className="text-white text-xs font-bold">编辑</div>
                </div>
            </div>
            <div className="flex-1">
                <h1 className="text-xl font-bold text-gray-900">{currentUser.name}</h1>
                <p className="text-sm text-gray-500">加入时间 {new Date(currentUser.createdAt).toLocaleDateString()}</p>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="text-gray-400 hover:text-gray-600"
            >
                <Settings size={24} />
            </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{currentUser.stats.trainingMinutes}</div>
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">训练时长 (分)</div>
            </div>
            <div className="text-center border-l border-r border-gray-100">
                <div className="text-2xl font-bold text-gray-900">{currentUser.loginCount}</div>
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">坚持天数</div>
            </div>
             <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{currentUser.stats.caloriesBurned}</div>
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">消耗 (千卡)</div>
            </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        
        {/* Activity Chart */}
        <div className="bg-white p-5 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800 flex items-center">
                    <Activity size={18} className="mr-2 text-brand-500" />
                    本周运动数据
                </h3>
                <span className="text-xs text-gray-400">近7天</span>
            </div>
            <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyActivityData}>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af'}} />
                        <Tooltip 
                            cursor={{fill: '#f3f4f6'}}
                            contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                        />
                        <Bar dataKey="mins" radius={[4, 4, 0, 0]}>
                            {weeklyActivityData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.mins > 40 ? '#22c55e' : '#bbf7d0'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setShowFavorites(true)}
            className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            <div className="flex items-center justify-between mb-2">
              <Bookmark size={24} className="text-yellow-500" />
              <ChevronRight size={18} className="text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{favoritesCount}</div>
            <div className="text-xs text-gray-500 font-medium">我的收藏</div>
          </button>

          <button
            className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            <div className="flex items-center justify-between mb-2">
              <Video size={24} className="text-purple-500" />
              <ChevronRight size={18} className="text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">12</div>
            <div className="text-xs text-gray-500 font-medium">观看历史</div>
          </button>
        </div>

        {/* Menu List */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {[
                { icon: Award, label: '我的成就', value: '已解锁 12', badge: null },
                { icon: Calendar, label: '我的活动', value: '2 个报名', badge: null },
                { icon: BookOpen, label: '我的订阅', value: '复健, 核心', badge: null },
                { icon: Bell, label: '消息通知', value: '开启', badge: unreadNotifications > 0 ? unreadNotifications : null },
            ].map((item, idx) => (
                <button key={idx} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                    <div className="flex items-center space-x-3">
                        <div className="bg-gray-100 p-2 rounded-full text-gray-600 relative">
                            <item.icon size={18} />
                            {item.badge && (
                              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center">
                                {item.badge}
                              </div>
                            )}
                        </div>
                        <span className="font-medium text-gray-700">{item.label}</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                        <span className="text-xs mr-2">{item.value}</span>
                        <ChevronRight size={16} />
                    </div>
                </button>
            ))}
        </div>

         <button 
           onClick={handleLogout}
           className="w-full bg-white text-red-500 font-bold py-4 rounded-2xl shadow-sm flex items-center justify-center space-x-2 hover:bg-red-50 transition-colors"
         >
            <LogOut size={18} />
            <span>退出登录</span>
        </button>

        <div className="text-center text-xs text-gray-300 py-4">
            Rehaber 锐汗步 v1.0.0
        </div>

      </div>
    </div>
  );
};
