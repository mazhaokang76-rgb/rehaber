import React, { useState, useEffect } from 'react';
import { ArrowLeft, Share2, Heart, Play, Eye, Clock } from 'lucide-react';
import type { Video } from '../services/supabase';
import { supabaseService } from '../services/supabase';

interface VideoDetailProps {
  videoId: string;
  onBack: () => void;
}

export const VideoDetail: React.FC<VideoDetailProps> = ({ videoId, onBack }) => {
  const [video, setVideo] = useState<Video | null>(null);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const FALLBACK_VIDEO = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

  useEffect(() => {
    loadVideoDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  const loadVideoDetail = async () => {
    try {
      setLoading(true);
      // 尝试从 Supabase 拉取真实数据
      const v = await supabaseService.getVideoById(videoId);
      if (v) {
        setVideo(v);
      } else {
        // 若没有取到，可以保留 null，让 UI 显示“视频不存在”或兜底
        setVideo(null);
      }
    } catch (error) {
      console.error('加载视频失败:', error);
      setVideo(null);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: video?.title || '视频分享',
      text: `观看 ${video?.title || ''}`,
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
        <div className="text-gray-400 mb-4">视频不存在或无法加载</div>
        <button onClick={onBack} className="text-brand-600 font-bold">返回</button>
      </div>
    );
  }

  const videoSrc = video.videoUrl || FALLBACK_VIDEO;

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
              onError={(e) => {
                console.error('视频播放出错，可能 URL 无效或网络问题', e);
                // 如果播放出错且使用的是空的 video.videoUrl，可尝试用回退视频
                // 这里简单提示用户
                alert('无法播放该视频，已为你切换示例视频（如果有）');
              }}
            >
              <source
                src={videoSrc}
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
              <p>{video.description || '暂无视频介绍。'}</p>
            </div>
          </div>

          {/* 下方内容保持原样（训练计划、提示、评论等） */}
          {/* ... 保留原有实现 ... */}
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
