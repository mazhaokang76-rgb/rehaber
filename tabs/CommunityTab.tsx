import React, { useEffect, useState } from 'react';
import { MapPin, Clock, Heart, Plus } from 'lucide-react';
import { CommunityEvent } from '../types';
import { supabaseService } from '../services/supabase';
import { Logo } from '../components/Logo';

export const CommunityTab: React.FC = () => {
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await supabaseService.getEvents();
        setEvents(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) return (
    <div className="h-screen flex items-center justify-center">
       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
    </div>
  );

  return (
    <div className="pb-24 pt-16 px-3 bg-gray-50 min-h-screen max-w-md mx-auto">
       {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-40 border-b border-gray-200 shadow-sm">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <h2 className="text-lg font-bold text-gray-800 mr-2">社区动态</h2>
            <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">Live</span>
          </div>
          <button className="bg-emerald-600 text-white p-2 rounded-full hover:bg-emerald-700 transition-all hover:scale-105 shadow-lg shadow-emerald-200">
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Waterfall Feed */}
      <div className="columns-2 gap-3 space-y-3 mt-2">
        {events.length === 0 ? (
          <div className="col-span-2 text-center py-10 text-gray-400">暂无活动</div>
        ) : (
          events.map((event) => (
            <div key={event.id} className="break-inside-avoid bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 group hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="relative">
                <img src={event.image} alt={event.title} className="w-full h-auto object-cover" />
                <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
                   <div className="bg-black/50 backdrop-blur-md px-2 py-1 rounded text-[10px] text-white flex items-center max-w-[80%]">
                    <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-3">
                <h3 className="font-bold text-gray-800 text-sm mb-2 leading-snug line-clamp-2">{event.title}</h3>
                
                <div className="flex items-center text-xs text-emerald-600/80 mb-3 font-medium bg-emerald-50 inline-block px-2 py-0.5 rounded">
                  <Clock className="w-3 h-3 mr-1" />
                  {event.time}
                </div>

                <div className="flex items-center justify-between border-t border-gray-50 pt-2">
                  <div className="flex items-center">
                    <img src={event.userAvatar} alt={event.userName} className="w-6 h-6 rounded-full mr-1.5 border border-white shadow-sm" />
                    <span className="text-[10px] text-gray-500 truncate max-w-[60px] font-medium">{event.userName}</span>
                  </div>
                  <div className="flex items-center text-gray-400 group-hover:text-pink-500 transition-colors cursor-pointer hover:scale-110 active:scale-95">
                    <Heart className="w-3.5 h-3.5 mr-1" />
                    <span className="text-[10px]">{event.likes}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};