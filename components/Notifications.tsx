// components/Notifications.tsx - 通知中心组件
import React, { useState, useEffect } from 'react';
import { Bell, X, Check, Calendar, MessageCircle, Heart, AlertCircle } from 'lucide-react';
import { supabaseService, Notification } from '../services/supabase';

interface NotificationsProps {
  onClose: () => void;
}

export const Notifications: React.FC<NotificationsProps> = ({ onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await supabaseService.getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('加载通知失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await supabaseService.markNotificationAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('标记已读失败:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await supabaseService.markAllNotificationsAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('标记全部已读失败:', error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'event': return <Calendar size={20} className="text-blue-500" />;
      case 'comment': return <MessageCircle size={20} className="text-green-500" />;
      case 'like': return <Heart size={20} className="text-red-500" />;
      case 'system': return <AlertCircle size={20} className="text-yellow-500" />;
      default: return <Bell size={20} className="text-gray-500" />;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return date.toLocaleDateString('zh-CN');
  };

  const filteredNotifications = filter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={onClose}>
      <div className="bg-white w-full max-w-md mx-auto rounded-t-3xl max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-4 py-3 rounded-t-3xl flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} className="text-gray-700" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">通知中心</h1>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm text-brand-600 font-medium hover:text-brand-700"
            >
              全部已读
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-4">
          {[
            { value: 'all', label: '全部' },
            { value: 'unread', label: `未读 (${unreadCount})` }
          ].map(tab => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value as any)}
              className={`pb-2 text-sm font-medium transition-colors relative ${
                filter === tab.value ? 'text-brand-600' : 'text-gray-400'
              }`}
            >
              {tab.label}
              {filter === tab.value && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600 rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Bell size={64} className="text-gray-300 mb-4" />
            <div className="text-gray-400 font-medium">
              {filter === 'unread' ? '没有未读通知' : '暂无通知'}
            </div>
            <div className="text-gray-300 text-sm mt-2">
              {filter === 'unread' ? '太好了，你已经看完所有通知了！' : '有新消息时会在这里显示'}
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => !notification.read && markAsRead(notification.id)}
                className={`px-4 py-4 cursor-pointer transition-colors ${
                  notification.read ? 'bg-white' : 'bg-blue-50/50'
                } hover:bg-gray-50`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="font-bold text-gray-900 text-sm leading-snug">
                        {notification.title}
                      </h4>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2 mt-1"></div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed mb-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        {formatTime(notification.createdAt)}
                      </span>
                      {!notification.read && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification.id);
                          }}
                          className="text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center space-x-1"
                        >
                          <Check size={12} />
                          <span>标记已读</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
  );
};

// 通知铃铛按钮组件
export const NotificationBell: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadUnreadCount();
    // 每30秒刷新一次未读数
    const interval = setInterval(loadUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadUnreadCount = async () => {
    const count = await supabaseService.getUnreadNotificationCount();
    setUnreadCount(count);
  };

  return (
    <button
      onClick={onClick}
      className="relative p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-full transition-colors"
    >
      <Bell size={20} />
      {unreadCount > 0 && (
        <div className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center ring-2 ring-white">
          {unreadCount > 99 ? '99+' : unreadCount}
        </div>
      )}
    </button>
  );
};
