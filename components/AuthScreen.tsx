import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Logo } from './Logo';

interface AuthScreenProps {
  onLogin: (phone: string, name: string) => void;
  loading?: boolean;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, loading = false }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    onLogin(phone, name);
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-emerald-200 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-teal-200 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute top-[40%] left-[20%] w-48 h-48 bg-yellow-200 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-pulse"></div>

      <div className="bg-white/80 backdrop-blur-lg w-full max-w-md p-8 rounded-3xl shadow-xl z-10 border border-white/50">
        <div className="flex flex-col items-center mb-10">
          <Logo className="scale-150 mb-4" />
          <p className="text-emerald-600/80 font-medium mt-4 text-sm tracking-wide">开启你的轻康复之旅</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div className="animate-fadeIn">
              <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">昵称</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-white/50"
                placeholder="请输入昵称"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">手机号码</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-white/50"
              placeholder="请输入手机号码"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl focus:ring-4 focus:ring-emerald-300 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center mt-6"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                {isRegister ? '立即注册' : '微信一键登录'}
                {!isRegister && <ArrowRight className="w-4 h-4 ml-2" />}
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            {isRegister ? '已有账号？' : '还没有账号？'}
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-emerald-600 font-bold ml-1 hover:underline"
            >
              {isRegister ? '去登录' : '去注册'}
            </button>
          </p>
        </div>
      </div>
      
      <div className="mt-8 text-xs text-gray-400 font-light">
        &copy; 2024 Rehaber Inc.
      </div>
    </div>
  );
};