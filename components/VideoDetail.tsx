// components/VideoDetail.tsx - 增强版视频详情页
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Share2, Heart, Play, Eye, Clock, Bookmark } from 'lucide-react';
import type { Video } from '../services/supabase';
import { supabaseService } from '../services/supabase';
import { Comments } from './Comments'; // 新增：导入评论组件

interface VideoDetailProps {
  videoId: string;
  onBack: () => void;
}

export const VideoDetail: React.FC<VideoDetailProps> = ({ videoId, onBack }) => {
  const [video, setVideo] = useState<Video | null>(null);
  const [liked, setLiked] = useState(false);
  const [favorited, setFavorited] = useState(false); // 新增：收藏状态
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null); // 新增：视频元素引用
  const FALLBACK_VIDEO = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

  useEffect(() => {
    loadVideoDetail();
  }, [videoId]);

  // 新增：监听视频播放进度，自动保存
  useEffect(() => {
    if (!videoRef.current || !video) return;

    const videoElement = videoRef.current;
    let progressInterval: NodeJS.Timeout;

    const handlePlay = () => {
      // 每5秒保存一次进度
      progressInterval = setInterval(() => {
        if (videoElement.currentTime > 0) {
          supabaseService.saveVideoProgress(
            videoId,
            Math.floor(videoElement.currentTime),
            Math.floor(videoElement.duration)
          );
        }
      }, 5000);
    };

    const handlePause = () => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      // 暂停时也保存一次进度
      if (videoElement.currentTime > 0) {
        supabaseService.saveVideoProgress(
          videoId,
          Math.floor(videoElement.currentTime),
          Math.floor(videoElement.duration)
        );
      }
    };

    videoElement.addEventListener('play', handlePlay);
    videoElement.addEventListener('pause', handlePause);
    videoElement.addEventListener('ended', handlePause);

    return () => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      videoElement.removeEventListener('play', handlePlay);
      videoElement.removeEventListener('pause', handlePause);
      videoElement.removeEventListener('ended', handlePause);
    };
  }, [videoId, video]);

  const loadVideoDetail = async () => {
    try {
      setLoading(true);
      const v = await supabaseService.getVideoById(videoId);
      if (v) {
        setVideo(v);
        setLiked(v.isLiked || false); // 新增：设置点赞状态
        setFavorited(v.isFavorited || false); // 新增：设置收藏状态
        
        // 新增：加载并恢复视频进度
        const progress = await supabaseService.getVideoProgress(videoId);
        if (progress && progress.progressSeconds > 0 && !progress.completed) {
          setTimeout(() => {
            if (videoRef.current) {
              videoRef.current.currentTime = progress.progressSeconds;
            }
          }, 500);
        }
      } else {
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

  // 新增：处理点赞
  const handleLike = async () => {
    try {
      const isLiked = await supabaseService.toggleLike(videoId, 'video');
      setLiked(isLiked);
      if (video) {
        setVideo({
          ...video,
          isLiked,
          likesCount: (video.likesCount || 0) + (isLiked ? 1 : -1)
        });
      }
    } catch (error) {
      console.error('点赞失败:', error);
      alert('操作失败，请重试');
    }
  };

  // 新增：处理收藏
  const handleFavorite = async () => {
    try {
      const isFavorited = await supabaseService.toggleFavorite(videoId, 'video');
      setFavorited(isFavorited);
      if (video) {
        setVideo({
          ...video,
          isFavorited
        });
      }
    } catch (error) {
      console.error('收藏失败:', error);
      alert('操作失败，请重试');
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
            {/* 新增：收藏按钮 */}
            <button
              onClick={handleFavorite}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Bookmark
                size={24}
                className={favorited ? 'text-yellow-500 fill-yellow-500' : 'text-gray-700'}
              />
            </button>
            {/* 修改：点赞按钮调用新的处理函数 */}
            <button
              onClick={handleLike}
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
            {/* 新增：显示观看进度 */}
            {video.progress && video.progress > 0 && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                <div
                  className="h-full bg-brand-600"
                  style={{ width: `${video.progress}%` }}
                ></div>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {/* 新增：添加 ref 以便控制播放进度 */}
            <video
              ref={videoRef}
              className="w-full h-full"
              controls
              autoPlay
              poster={video.thumbnail}
              onError={(e) => {
                console.error('视频播放出错', e);
                alert('无法播放该视频');
              }}
            >
              <source src={videoSrc} type="video/mp4" />
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

          {/* Stats - 修改：显示真实的点赞数 */}
          <div className="flex items-center space-x-6 mb-6 pb-6 border-b border-gray-100">
            <div className="flex items-center text-gray-600">
              <Eye size={18} className="mr-2" />
              <span className="text-sm">{video.views} 次观看</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Heart size={18} className="mr-2" />
              <span className="text-sm">{video.likesCount || 0} 点赞</span>
            </div>
            {/* 新增：显示评论数 */}
            <div className="flex items-center text-gray-600">
              <span className="text-sm">{video.commentsCount || 0} 评论</span>
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
        </div>
      </div>

      {/* 新增：评论区 - 添加在内容底部 */}
      <div className="mt-4">
        <Comments 
          contentId={videoId} 
          contentType="video" 
        />
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
