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
    if (!phone || phone.length < 11) {
      alert('请输入正确的手机号码');
      return;
    }
    if (isRegister && !name) {
      alert('请输入昵称');
      return;
    }
    onLogin(phone, name || `用户${phone.slice(-4)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-emerald-200 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-teal-200 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute top-[40%] left-[20%] w-48 h-48 bg-cyan-200 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-pulse"></div>

      <div className="bg-white/90 backdrop-blur-lg w-full max-w-md p-8 rounded-3xl shadow-2xl z-10 border border-white/50">
        <div className="flex flex-col items-center mb-10">
          <div className="mb-6">
            <Logo className="h-32 w-32" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Rehaber 锐汗步</h1>
          <p className="text-emerald-600/80 font-medium text-sm tracking-wide">开启你的轻康复之旅</p>
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
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-white/50"
              placeholder="请输入11位手机号码"
              required
              maxLength={11}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading || !phone || phone.length !== 11}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl focus:ring-4 focus:ring-emerald-300 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                {isRegister ? '立即注册' : '登录 / 注册'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            {isRegister ? '已有账号？' : '首次使用？'}
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-emerald-600 font-bold ml-1 hover:underline"
            >
              {isRegister ? '直接登录' : '了解更多'}
            </button>
          </p>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            登录即表示同意<span className="text-emerald-600">用户协议</span>和<span className="text-emerald-600">隐私政策</span>
          </p>
        </div>
      </div>
      
      <div className="mt-8 text-xs text-gray-400 font-light z-10">
        &copy; 2024 Rehaber Inc.
      </div>
    </div>
  );
};
