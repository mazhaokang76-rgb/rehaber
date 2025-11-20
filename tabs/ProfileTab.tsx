import React, { useState } from 'react';
import { Settings, LogOut, CheckCircle2, Circle, Activity } from 'lucide-react';
import { User, Category } from '../types';
import { supabaseService } from '../services/supabase';

interface ProfileTabProps {
  user: User;
  onUpdateUser: (user: User) => void;
  onLogout: () => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({ user, onUpdateUser, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSubs, setSelectedSubs] = useState<Category[]>(user.subscriptions);
  const [saving, setSaving] = useState(false);

  const toggleSub = (cat: Category) => {
    if (selectedSubs.includes(cat)) {
      setSelectedSubs(selectedSubs.filter(c => c !== cat));
    } else {
      setSelectedSubs([...selectedSubs, cat]);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedUser = await supabaseService.updateSubscriptions(user.id, selectedSubs);
      onUpdateUser(updatedUser);
      setIsEditing(false);
    } catch (error) {
      alert("保存失败");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const categories = Object.values(Category);

  return (
    <div className="pb-24 min-h-screen bg-gray-50 max-w-md mx-auto">
      {/* Profile Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-500 pt-16 pb-24 px-6 rounded-b-[2.5rem] shadow-xl mb-12">
         {/* Abstract shapes */}
         <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
         <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-400/20 rounded-full -ml-10 -mb-10 blur-xl"></div>

         <div className="absolute top-4 right-4 z-10">
           <button onClick={onLogout} className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all">
             <LogOut className="w-5 h-5" />
           </button>
         </div>
         
        <div className="flex items-center space-x-5 relative z-10">
          <div className="relative group">
            <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full border-4 border-white/30 shadow-lg object-cover group-hover:scale-105 transition-transform" />
            <div className="absolute bottom-0 right-0 bg-yellow-400 w-6 h-6 rounded-full border-2 border-emerald-600 flex items-center justify-center shadow-md">
               <Activity className="w-3 h-3 text-emerald-900" />
            </div>
          </div>
          <div className="text-white">
            <h1 className="text-2xl font-bold tracking-tight">{user.name}</h1>
            <div className="flex items-center mt-2 space-x-3">
              <span className="text-emerald-900 text-xs font-bold bg-emerald-200/80 px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                VIP 运动家
              </span>
            </div>
          </div>
        </div>
        
        {/* Stats Card */}
        <div className="absolute -bottom-12 left-6 right-6 bg-white p-5 rounded-2xl shadow-xl shadow-emerald-900/5 flex justify-around items-center border border-gray-50 animate-slideUp">
           <div className="text-center">
             <div className="text-xl font-bold text-gray-800">{user.loginCount}</div>
             <div className="text-xs text-gray-400 font-medium uppercase tracking-wide mt-1">登录天数</div>
           </div>
           <div className="w-px h-10 bg-gray-100"></div>
           <div className="text-center">
             <div className="text-xl font-bold text-gray-800">{user.subscriptions.length}</div>
             <div className="text-xs text-gray-400 font-medium uppercase tracking-wide mt-1">订阅主题</div>
           </div>
           <div className="w-px h-10 bg-gray-100"></div>
           <div className="text-center">
             <div className="text-xl font-bold text-gray-800">--</div>
             <div className="text-xs text-gray-400 font-medium uppercase tracking-wide mt-1">完成训练</div>
           </div>
        </div>
      </div>

      {/* Settings Section */}
      <div className="px-4 mt-14">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-bold text-gray-800 flex items-center">
              <div className="p-1.5 bg-emerald-100 rounded-lg mr-2">
                <Settings className="w-4 h-4 text-emerald-600" />
              </div>
              订阅偏好设置
            </h3>
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="text-xs text-emerald-600 font-bold px-4 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 transition-colors border border-emerald-100"
              >
                修改
              </button>
            ) : (
               <button 
                onClick={handleSave}
                disabled={saving}
                className="text-xs text-white font-bold px-5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-md disabled:opacity-50 flex items-center"
              >
                {saving ? '保存中...' : '完成'}
              </button>
            )}
          </div>
          
          <div className="p-4 grid grid-cols-1 gap-3">
            {categories.map((cat) => {
              const isSubscribed = isEditing ? selectedSubs.includes(cat) : user.subscriptions.includes(cat);
              
              return (
                <div 
                  key={cat}
                  onClick={() => isEditing && toggleSub(cat)}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 ${
                    isEditing 
                      ? 'cursor-pointer hover:scale-[1.01] active:scale-[0.99]' 
                      : ''
                  } ${
                    isSubscribed 
                      ? 'bg-gradient-to-r from-emerald-50 to-teal-50/50 border-emerald-200 shadow-sm' 
                      : 'bg-white border-gray-100 opacity-70 grayscale-[0.5]'
                  }`}
                >
                  <div className="flex items-center">
                    <span className={`font-bold text-sm ${isSubscribed ? 'text-emerald-900' : 'text-gray-500'}`}>
                      {cat}
                    </span>
                  </div>
                  
                  {isEditing ? (
                    <div className={`transition-colors ${isSubscribed ? 'text-emerald-500' : 'text-gray-300'}`}>
                       {isSubscribed ? <CheckCircle2 className="w-6 h-6 fill-emerald-100" /> : <Circle className="w-6 h-6" />}
                    </div>
                  ) : (
                    isSubscribed && (
                       <span className="text-[10px] text-emerald-700 font-bold bg-white/80 px-2 py-1 rounded-md shadow-sm">
                         已订阅
                       </span>
                    )
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="mt-8 text-center pb-8">
          <p className="text-[10px] text-gray-300 uppercase tracking-widest">Rehaber Version 1.0.2</p>
        </div>
      </div>
    </div>
  );
};