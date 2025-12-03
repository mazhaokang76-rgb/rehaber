import React, { useState, useRef } from 'react';
import { ArrowLeft, Camera, Check, Upload } from 'lucide-react';
import { supabaseService } from '../services/supabase';

interface ProfileEditProps {
  userId: string;
  currentName: string;
  currentAvatar: string;
  onSave: (name: string, avatar: string) => void;
  onBack: () => void;
}

export const ProfileEdit: React.FC<ProfileEditProps> = ({
  userId,
  currentName,
  currentAvatar,
  onSave,
  onBack
}) => {
  const [name, setName] = useState(currentName);
  const [avatar, setAvatar] = useState(currentAvatar);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 预设头像选项
  const avatarOptions = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Mittens',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Whiskers',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Patches',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Max',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Bella',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucy',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Milo'
  ];

  const handleSave = async () => {
    if (!name.trim()) {
      alert('请输入昵称');
      return;
    }

    try {
      setSaving(true);
      
      // 更新到 Supabase
      const updatedUser = await supabaseService.updateUser(userId, {
        name,
        avatar
      });

      if (updatedUser) {
        onSave(name, avatar);
      } else {
        throw new Error('更新失败');
      }
    } catch (error) {
      console.error('保存失败:', error);
      alert('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件');
      return;
    }

    // 检查文件大小（限制2MB）
    if (file.size > 2 * 1024 * 1024) {
      alert('图片大小不能超过2MB');
      return;
    }

    try {
      setUploading(true);
      
      // 上传到 Supabase Storage
      const avatarUrl = await supabaseService.uploadAvatar(file, userId);
      
      if (avatarUrl) {
        setAvatar(avatarUrl);
        alert('头像上传成功！');
      } else {
        throw new Error('上传失败');
      }
    } catch (error) {
      console.error('上传失败:', error);
      alert('上传失败，请重试');
    } finally {
      setUploading(false);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">编辑资料</h1>
          <button
            onClick={handleSave}
            disabled={saving}
            className="p-2 text-brand-600 hover:bg-brand-50 rounded-full transition-colors disabled:opacity-50"
          >
            {saving ? (
              <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Check size={24} />
            )}
          </button>
        </div>
      </div>

      <div className="px-6 py-8">
        {/* Avatar Section */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-4">头像</label>
          
          {/* Current Avatar */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <img
                src={avatar}
                alt="当前头像"
                className="w-32 h-32 rounded-full border-4 border-brand-100 shadow-lg object-cover"
              />
              {uploading ? (
                <div className="absolute bottom-0 right-0 bg-brand-600 text-white p-3 rounded-full shadow-lg">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <button
                  onClick={triggerFileUpload}
                  className="absolute bottom-0 right-0 bg-brand-600 text-white p-3 rounded-full shadow-lg hover:bg-brand-700 transition-colors"
                >
                  <Camera size={20} />
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Upload Button */}
          <button
            onClick={triggerFileUpload}
            disabled={uploading}
            className="w-full bg-white border-2 border-brand-600 text-brand-600 font-bold py-3 rounded-xl hover:bg-brand-50 transition-colors disabled:opacity-50 flex items-center justify-center mb-4"
          >
            {uploading ? (
              <>
                <div className="w-5 h-5 border-2 border-brand-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                上传中...
              </>
            ) : (
              <>
                <Upload size={20} className="mr-2" />
                上传自定义头像
              </>
            )}
          </button>

          {/* Avatar Options */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="text-sm font-medium text-gray-700 mb-3">选择预设头像</div>
            <div className="grid grid-cols-4 gap-3">
              {avatarOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() => setAvatar(option)}
                  className={`relative aspect-square rounded-full overflow-hidden border-2 transition-all ${
                    avatar === option
                      ? 'border-brand-600 ring-2 ring-brand-200 scale-105'
                      : 'border-gray-200 hover:border-brand-300'
                  }`}
                >
                  <img src={option} alt={`头像选项 ${index + 1}`} className="w-full h-full" />
                  {avatar === option && (
                    <div className="absolute inset-0 bg-brand-600/20 flex items-center justify-center">
                      <Check size={20} className="text-brand-600" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Name Section */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">昵称</label>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={20}
              className="w-full px-4 py-4 text-lg focus:outline-none"
              placeholder="请输入昵称"
            />
            <div className="px-4 pb-3 flex items-center justify-between text-xs text-gray-400">
              <span>2-20个字符</span>
              <span>{name.length}/20</span>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start">
            <div className="text-2xl mr-3">💡</div>
            <div>
              <div className="font-bold text-gray-900 mb-1">提示</div>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• 昵称将在社区和评论中显示</li>
                <li>• 支持 JPG、PNG、GIF 格式</li>
                <li>• 图片大小不超过 2MB</li>
                <li>• 头像可以随时更换</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Random Avatar Generator */}
        <div className="mt-6">
          <button
            onClick={() => {
              const randomSeed = Math.random().toString(36).substring(7);
              setAvatar(`https://api.dicebear.com/7.x/avataaars/svg?seed=${randomSeed}`);
            }}
            className="w-full bg-white text-gray-700 font-medium py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            🎲 随机生成头像
          </button>
        </div>
      </div>

      {/* Save Button (Fixed at bottom on mobile) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-lg md:hidden">
        <button
          onClick={handleSave}
          disabled={saving || !name.trim()}
          className="w-full bg-brand-600 text-white font-bold py-4 rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {saving ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              保存中...
            </>
          ) : (
            '保存修改'
          )}
        </button>
      </div>
    </div>
  );
};
