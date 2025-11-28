import React from 'react';
import { Settings, ChevronRight, Award, BookOpen, Activity, LogOut, Bell } from 'lucide-react';
import { currentUser, weeklyActivityData } from '../services/mockData';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const Profile: React.FC = () => {
  return (
    <div className="pb-24 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white pb-6 pt-10 px-6 rounded-b-3xl shadow-sm">
        <div className="flex items-center space-x-4">
            <div className="relative">
                <img src={currentUser.avatar} alt="Profile" className="w-20 h-20 rounded-full border-4 border-brand-100" />
                <div className="absolute bottom-0 right-0 bg-brand-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white">
                    LV.5
                </div>
            </div>
            <div className="flex-1">
                <h1 className="text-xl font-bold text-gray-900">{currentUser.name}</h1>
                <p className="text-sm text-gray-500">加入时间 {new Date(currentUser.createdAt).toLocaleDateString()}</p>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
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

        {/* Menu List */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {[
                { icon: Award, label: '我的成就', value: '已解锁 12' },
                { icon: BookOpen, label: '我的订阅', value: '复健, 核心' },
                { icon: Bell, label: '消息通知', value: '开启' },
            ].map((item, idx) => (
                <button key={idx} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                    <div className="flex items-center space-x-3">
                        <div className="bg-gray-100 p-2 rounded-full text-gray-600">
                            <item.icon size={18} />
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

         <button className="w-full bg-white text-red-500 font-bold py-4 rounded-2xl shadow-sm flex items-center justify-center space-x-2 hover:bg-red-50 transition-colors">
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