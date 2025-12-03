import React, { useState, useEffect } from 'react';
import { ArrowLeft, Share2, Heart, Play, Eye, Clock } from 'lucide-react';
import type { Video } from '../services/supabase';

interface VideoDetailProps {
  videoId: string;
  onBack: () => void;
}

export const VideoDetail: React.FC<VideoDetailProps> = ({ videoId, onBack }) => {
  const [video, setVideo] = useState<Video | null>(null);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    loadVideoDetail();
  }, [videoId]);

  const loadVideoDetail = async () => {
    try {
      setLoading(true);
      // 模拟数据 - 实际应该从 Supabase 获取
      const mockVideo: Video = {
        id: videoId,
        title: '清晨脊柱唤醒训练',
        category: 'Rehab',
        thumbnail: 'https://picsum.photos/seed/v1/800/450',
        duration: '15:30',
        views: 1205,
        author: '陈医生',
        authorAvatar: 'https://picsum.photos/seed/doc1/100/100',
        publishedAt: '2024-01-15'
      };
      setVideo(mockVideo);
    } catch (error) {
      console.error('加载视频失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: video?.title || '锐汗步视频',
      text: `观看 ${video?.title}`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('链接已复制到剪贴板！');
      }
    } catch (error) {
      console.error('分享失败:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="text-gray-400 mb-4">视频不存在</div>
        <button onClick={onBack} className="text-brand-600 font-bold">返回</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
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
              onClick={() => setLiked(!liked)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Heart
                size={24}
                className={liked ? 'text-red-500 fill-red-500' : 'text-gray-700'}
              />
            </button>
            <button
              onClick={handleShare}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Share2 size={24} className="text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Video Player */}
      <div className="relative w-full aspect-video bg-black">
        {!isPlaying ? (
          <>
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <button
                onClick={() => setIsPlaying(true)}
                className="w-20 h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-2xl"
              >
                <Play size={32} className="text-brand-600 ml-1" fill="currentColor" />
              </button>
            </div>
            <div className="absolute bottom-4 right-4 bg-black/60 text-white text-sm px-2 py-1 rounded backdrop-blur-sm">
              {video.duration}
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {/* HTML5 Video Player */}
            <video
              className="w-full h-full"
              controls
              autoPlay
              poster={video.thumbnail}
            >
              {/* 示例视频链接 - 实际应该从数据库获取 */}
              <source
                src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                type="video/mp4"
              />
              您的浏览器不支持视频播放
            </video>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="bg-white">
        <div className="px-6 py-6">
          {/* Title and Category */}
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-3 py-1 bg-brand-50 text-brand-600 text-xs font-bold rounded-full border border-brand-200">
                {video.category === 'Rehab' ? '复健' : video.category === 'Core' ? '核心' : video.category}
              </span>
              <span className="text-xs text-gray-400">发布于 {video.publishedAt}</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 leading-tight">
              {video.title}
            </h1>
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-6 mb-6 pb-6 border-b border-gray-100">
            <div className="flex items-center text-gray-600">
              <Eye size={18} className="mr-2" />
              <span className="text-sm">{video.views} 次观看</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Heart size={18} className="mr-2" />
              <span className="text-sm">{Math.floor(video.views * 0.1)} 点赞</span>
            </div>
          </div>

          {/* Author */}
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <img
                src={video.authorAvatar}
                alt={video.author}
                className="w-12 h-12 rounded-full border-2 border-brand-100"
              />
              <div>
                <div className="font-bold text-gray-900">{video.author}</div>
                <div className="text-xs text-gray-500">专业康复教练</div>
              </div>
            </div>
            <button className="px-4 py-2 bg-brand-600 text-white font-bold rounded-full text-sm hover:bg-brand-700 transition-colors">
              + 关注
            </button>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">视频介绍</h3>
            <div className="text-gray-700 leading-relaxed space-y-3">
              <p>
                这套清晨脊柱唤醒训练专为久坐人群设计，通过温和的伸展动作帮助你唤醒沉睡的脊柱，改善体态，缓解腰背不适。
              </p>
              <p>
                <strong>训练重点：</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>颈部放松与活动</li>
                <li>胸椎灵活性训练</li>
                <li>腰椎稳定性练习</li>
                <li>骨盆中立位调整</li>
              </ul>
            </div>
          </div>

          {/* Training Plan */}
          <div className="bg-brand-50 border-l-4 border-brand-600 rounded-r-xl p-4 mb-6">
            <div className="flex items-start">
              <div className="text-2xl mr-3">📋</div>
              <div>
                <div className="font-bold text-gray-900 mb-2">训练计划建议</div>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• <strong>频率：</strong>每天早晨练习一次</li>
                  <li>• <strong>时长：</strong>15-20分钟</li>
                  <li>• <strong>难度：</strong>初级，适合所有人</li>
                  <li>• <strong>器材：</strong>瑜伽垫（可选）</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <div className="flex items-start">
              <div className="text-2xl mr-3">💡</div>
              <div>
                <div className="font-bold text-gray-900 mb-2">训练提示</div>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 动作要缓慢、温和，避免突然用力</li>
                  <li>• 保持自然呼吸，不要憋气</li>
                  <li>• 感到疼痛立即停止，咨询医生</li>
                  <li>• 空腹或饭后1小时进行效果最佳</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">评论</h3>
            <div className="space-y-4">
              {[
                { user: '健康生活', avatar: 'https://picsum.photos/seed/c1/50/50', comment: '每天早上都跟着练，腰疼好多了！', time: '2天前' },
                { user: '运动达人', avatar: 'https://picsum.photos/seed/c2/50/50', comment: '动作很温和，适合新手', time: '5天前' }
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0">
                  <img src={item.avatar} alt={item.user} className="w-10 h-10 rounded-full" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-gray-900">{item.user}</span>
                      <span className="text-xs text-gray-400">{item.time}</span>
                    </div>
                    <p className="text-sm text-gray-700">{item.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related Videos */}
      <div className="px-6 py-6 bg-gray-50">
        <h3 className="text-lg font-bold text-gray-900 mb-4">相关视频</h3>
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden flex shadow-sm">
              <div className="w-32 h-24 relative flex-shrink-0">
                <img
                  src={`https://picsum.photos/seed/rv${i}/200/150`}
                  alt="相关视频"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <Play size={20} className="text-white" fill="white" />
                </div>
              </div>
              <div className="p-3 flex-1">
                <h4 className="font-bold text-sm text-gray-800 line-clamp-2 mb-1">
                  颈椎保健操 - 办公室必备
                </h4>
                <p className="text-xs text-gray-500">陈医生 • 12:30</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
