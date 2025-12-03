import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Users, Heart, Search } from 'lucide-react';
import { supabaseService } from '../services/supabase';
import type { Event } from '../services/supabase';

export const Community: React.FC = () => {
  const [filter, setFilter] = useState<'动态' | '附近' | '我的活动'>('动态');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await supabaseService.getEvents();
      setEvents(data);
    } catch (error) {
      console.error('加载活动失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  return (
    <div className="pb-24 bg-gray-50 min-h-screen">
      {/* Sticky Header */}
      <div className="bg-white sticky top-0 z-20 px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">社区</h1>
            <button className="bg-brand-50 text-brand-600 p-2 rounded-full">
                <Search size={20} />
            </button>
        </div>
        
        <div className="flex space-x-6 border-b border-gray-100">
            {['动态', '附近', '我的活动'].map((tab) => (
                <button
                    key={tab}
                    onClick={() => setFilter(tab as any)}
                    className={`pb-3 text-sm font-medium transition-colors relative ${
                        filter === tab ? 'text-brand-600' : 'text-gray-400'
                    }`}
                >
                    {tab}
                    {filter === tab && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600 rounded-full"></div>
                    )}
                </button>
            ))}
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Create Post Prompt */}
        <div className="bg-white rounded-xl p-4 shadow-sm flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                 <img src="https://picsum.photos/seed/user_alex/200/200" alt="User" />
            </div>
            <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm text-gray-500">
                分享你的康复进展...
            </div>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏃‍♂️</div>
            <div className="text-gray-400 font-medium">暂无社区活动</div>
            <div className="text-gray-300 text-sm mt-2">请稍后再来查看</div>
          </div>
        ) : (
          events.map(event => (
            <div key={event.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="relative h-48">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded-md text-gray-800 shadow-sm">
                        {event.tags && event.tags.length > 0 ? event.tags[0] : '活动'}
                    </div>
                    <button className="absolute top-3 right-3 bg-black/40 hover:bg-brand-500/80 text-white p-2 rounded-full backdrop-blur transition-colors">
                        <Heart size={18} fill={event.joined ? "currentColor" : "none"} className={event.joined ? "text-red-500" : ""} />
                    </button>
                </div>
                
                <div className="p-5">
                    <h2 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h2>
                    
                    <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-500">
                            <Calendar size={16} className="mr-2 text-brand-500" />
                            {event.time}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                            <MapPin size={16} className="mr-2 text-brand-500" />
                            {event.location}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                            <Users size={16} className="mr-2 text-brand-500" />
                            {event.organizer}
                        </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-50 pt-4">
                         <div className="flex -space-x-2">
                            {[1,2,3].map(i => (
                                <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-300 overflow-hidden">
                                    <img src={`https://picsum.photos/seed/${i}/50/50`} alt="" />
                                </div>
                            ))}
                            <div className="text-xs text-gray-500 pl-3 py-1">
                                {event.likes} 人感兴趣
                            </div>
                         </div>
                         
                         <button className="bg-brand-600 text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg shadow-brand-200 hover:bg-brand-700 transition-colors">
                             立即报名
                         </button>
                    </div>
                </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
