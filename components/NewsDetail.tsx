// components/NewsDetail.tsx - 完整增强版
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Share2, Heart, Clock, Bookmark, MessageCircle } from 'lucide-react';
import { supabaseService } from '../services/supabase';
import type { NewsItem } from '../services/supabase';
import { Comments } from './Comments';

interface NewsDetailProps {
  newsId: string;
  onBack: () => void;
}

export const NewsDetail: React.FC<NewsDetailProps> = ({ newsId, onBack }) => {
  const [news, setNews] = useState<NewsItem | null>(null);
  const [liked, setLiked] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNewsDetail();
  }, [newsId]);

  const loadNewsDetail = async () => {
    try {
      setLoading(true);
      const data = await supabaseService.getNewsById(newsId);
      if (data) {
        setNews(data);
        setLiked(data.isLiked || false);
        setFavorited(data.isFavorited || false);
      }
    } catch (error) {
      console.error('加载文章失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: news?.title || '锐汗步',
      text: news?.summary || '',
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

  const handleLike = async () => {
    try {
      const isLiked = await supabaseService.toggleLike(newsId, 'news');
      setLiked(isLiked);
      if (news) {
        setNews({
          ...news,
          isLiked,
          likesCount: (news.likesCount || 0) + (isLiked ? 1 : -1)
        });
      }
    } catch (error) {
      console.error('点赞失败:', error);
      alert('操作失败，请重试');
    }
  };

  const handleFavorite = async () => {
    try {
      const isFavorited = await supabaseService.toggleFavorite(newsId, 'news');
      setFavorited(isFavorited);
      if (news) {
        setNews({
          ...news,
          isFavorited
        });
      }
      
      // 显示友好提示
      if (isFavorited) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-brand-600 text-white px-6 py-3 rounded-full shadow-lg z-50 animate-bounce';
        notification.textContent = '已添加到收藏';
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2000);
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

  if (!news) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="text-gray-400 mb-4">文章不存在</div>
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
              onClick={handleFavorite}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Bookmark
                size={24}
                className={favorited ? 'text-yellow-500 fill-yellow-500' : 'text-gray-700'}
              />
            </button>
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

      {/* Cover Image */}
      <div className="relative w-full h-64 bg-gray-200">
        <img
          src={news.coverImage}
          alt={news.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4 bg-brand-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
          {news.category}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-t-3xl -mt-6 relative z-10">
        <div className="px-6 py-6">
          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-4">
            {news.title}
          </h1>

          {/* Meta Info */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              {news.authorAvatar && (
                <img
                  src={news.authorAvatar}
                  alt={news.author}
                  className="w-10 h-10 rounded-full border-2 border-brand-100"
                />
              )}
              <div>
                <div className="font-medium text-gray-900">{news.author || '未知作者'}</div>
                <div className="text-xs text-gray-500">{news.date}</div>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-1">
              <div className="flex items-center text-gray-500 text-sm">
                <Clock size={16} className="mr-1" />
                {news.readTime}
              </div>
              <div className="flex items-center space-x-3 text-xs text-gray-400">
                <span className="flex items-center">
                  <Heart size={12} className="mr-1" />
                  {news.likesCount || 0}
                </span>
                <span>•</span>
                <span className="flex items-center">
                  <MessageCircle size={12} className="mr-1" />
                  {news.commentsCount || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-brand-50 border-l-4 border-brand-600 p-4 rounded-r-lg mb-6">
            <p className="text-sm text-gray-700 leading-relaxed">
              {news.summary}
            </p>
          </div>

          {/* Main Content */}
          <div className="prose prose-sm max-w-none mb-8">
            {news.content ? (
              <div 
                className="text-gray-700 leading-relaxed whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: news.content }}
              />
            ) : (
              <div className="text-gray-700 leading-relaxed space-y-4">
                <p>这是一篇关于{news.category}的文章。{news.summary}</p>
                <p>康复训练是一个循序渐进的过程，需要耐心和坚持。根据个人情况制定合理的训练计划，在专业指导下进行训练，才能达到最佳效果。</p>
                <p>记住，任何运动都应该在身体可承受的范围内进行，如果感到不适应立即停止并咨询专业人士。</p>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              #{news.category}
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              #康复训练
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              #健康生活
            </span>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-center space-x-4 py-6 border-t border-b border-gray-100 mb-6">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all ${
                liked
                  ? 'bg-red-50 text-red-600 border-2 border-red-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Heart
                size={20}
                className={liked ? 'fill-red-600' : ''}
              />
              <span className="font-medium">{liked ? '已点赞' : '点赞'}</span>
              {news.likesCount && news.likesCount > 0 && (
                <span className="text-sm">({news.likesCount})</span>
              )}
            </button>
            <button
              onClick={handleFavorite}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all ${
                favorited
                  ? 'bg-yellow-50 text-yellow-600 border-2 border-yellow-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Bookmark
                size={20}
                className={favorited ? 'fill-yellow-600' : ''}
              />
              <span className="font-medium">{favorited ? '已收藏' : '收藏'}</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 px-6 py-3 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
            >
              <Share2 size={20} />
              <span className="font-medium">分享</span>
            </button>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-4">
        <Comments 
          contentId={newsId} 
          contentType="news" 
        />
      </div>

      {/* Related Articles */}
      <div className="px-6 py-6 bg-gray-50">
        <h3 className="text-lg font-bold text-gray-900 mb-4">相关文章</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden flex shadow-sm cursor-pointer hover:shadow-md transition-shadow">
              <div className="w-24 h-24 relative flex-shrink-0">
                <img
                  src={`https://picsum.photos/seed/ra${i}/200/200`}
                  alt="相关文章"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3 flex-1">
                <h4 className="font-bold text-sm text-gray-800 line-clamp-2 mb-1">
                  运动康复的5个关键要素
                </h4>
                <p className="text-xs text-gray-500">3天前 • 5分钟阅读</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
