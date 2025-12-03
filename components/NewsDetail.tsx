import React, { useState, useEffect } from 'react';
import { ArrowLeft, Share2, Heart, Clock, User } from 'lucide-react';
import type { NewsItem } from '../services/supabase';

interface NewsDetailProps {
  newsId: string;
  onBack: () => void;
}

export const NewsDetail: React.FC<NewsDetailProps> = ({ newsId, onBack }) => {
  const [news, setNews] = useState<NewsItem | null>(null);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNewsDetail();
  }, [newsId]);

  const loadNewsDetail = async () => {
    try {
      setLoading(true);
      // 这里应该从 Supabase 获取完整的文章内容
      // 暂时模拟数据
      const mockNews: NewsItem = {
        id: newsId,
        title: '了解肌肉记忆：身体如何记忆动作',
        category: '科普',
        summary: '受伤后身体如何通过肌肉记忆快速恢复运动能力。',
        coverImage: 'https://picsum.photos/seed/n1/800/500',
        date: '2024-01-15',
        readTime: '5分钟',
        type: 'article',
        author: '陈医生',
        authorAvatar: 'https://picsum.photos/seed/doc1/100/100'
      };
      setNews(mockNews);
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
        // 降级方案：复制链接
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
            <div className="flex items-center text-gray-500 text-sm">
              <Clock size={16} className="mr-1" />
              {news.readTime}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-brand-50 border-l-4 border-brand-600 p-4 rounded-r-lg mb-6">
            <p className="text-sm text-gray-700 leading-relaxed">
              {news.summary}
            </p>
          </div>

          {/* Main Content */}
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              肌肉记忆是一个复杂而神奇的生理现象。当我们重复某个动作时，大脑和肌肉之间会建立起特殊的神经连接。这种连接使得我们在经过一段时间的训练后，能够更加流畅和自然地完成这些动作。
            </p>

            <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">什么是肌肉记忆？</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              肌肉记忆实际上是一种神经肌肉适应。当我们反复练习某个动作时，大脑会优化控制这些动作的神经通路。同时，肌肉细胞内部也会发生结构性变化，使得肌肉能够更有效地响应神经信号。
            </p>

            <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">康复训练中的应用</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              对于康复训练来说，肌肉记忆具有重要意义。即使在受伤或长期休息后，之前建立的肌肉记忆也不会完全消失。这意味着康复训练可以比从零开始要快得多。
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 my-6">
              <div className="flex items-start">
                <div className="text-2xl mr-3">💡</div>
                <div>
                  <div className="font-bold text-gray-900 mb-1">专家提示</div>
                  <div className="text-sm text-gray-700">
                    康复训练应该循序渐进，不要急于恢复到受伤前的强度。给身体足够的时间重新建立和加强肌肉记忆。
                  </div>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">如何利用肌肉记忆加速康复</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>保持规律的训练频率，即使强度较低</li>
              <li>重复正确的动作模式，避免形成不良习惯</li>
              <li>结合可视化训练，在脑海中模拟动作</li>
              <li>确保充足的休息，让神经系统有时间巩固</li>
            </ul>

            <p className="text-gray-700 leading-relaxed mb-4">
              研究表明，经过系统训练的运动员在停训后，只需要之前训练时间的三分之一就能恢复到原有水平。这就是肌肉记忆的力量。
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-8">
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              #肌肉记忆
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              #康复训练
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              #运动科学
            </span>
          </div>
        </div>
      </div>

      {/* Related Articles */}
      <div className="px-6 py-6 bg-gray-50">
        <h3 className="text-lg font-bold text-gray-900 mb-4">相关推荐</h3>
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-xl p-3 flex items-center space-x-3 shadow-sm">
              <img
                src={`https://picsum.photos/seed/related${i}/100/100`}
                alt="相关文章"
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h4 className="font-bold text-sm text-gray-800 line-clamp-2">
                  如何科学制定康复计划
                </h4>
                <p className="text-xs text-gray-500 mt-1">5分钟阅读</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
