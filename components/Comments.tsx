// components/Comments.tsx - 评论组件
import React, { useState, useEffect } from 'react';
import { MessageCircle, Heart, Send, Trash2, MoreVertical } from 'lucide-react';
import { supabaseService, Comment } from '../services/supabase';

interface CommentsProps {
  contentId: string;
  contentType: 'video' | 'news' | 'event';
}

export const Comments: React.FC<CommentsProps> = ({ contentId, contentType }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadComments();
  }, [contentId, contentType]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const data = await supabaseService.getComments(contentId, contentType);
      setComments(data);
    } catch (error) {
      console.error('加载评论失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      const comment = await supabaseService.addComment(
        contentId,
        contentType,
        newComment,
        replyingTo || undefined
      );

      if (comment) {
        setNewComment('');
        setReplyingTo(null);
        await loadComments();
      }
    } catch (error) {
      console.error('发送评论失败:', error);
      alert('评论失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (commentId: string) => {
    try {
      await supabaseService.toggleLike(commentId, 'comment');
      await loadComments();
    } catch (error) {
      console.error('点赞失败:', error);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm('确定要删除这条评论吗？')) return;

    try {
      const success = await supabaseService.deleteComment(commentId);
      if (success) {
        await loadComments();
      }
    } catch (error) {
      console.error('删除失败:', error);
      alert('删除失败，请重试');
    }
  };

  const getCurrentUserId = (): string | null => {
    try {
      const userStr = localStorage.getItem('rehaber_user');
      if (userStr) {
        const user = JSON.parse(userStr);
        return user.id;
      }
    } catch (error) {
      console.error('获取用户ID失败:', error);
    }
    return null;
  };

  const currentUserId = getCurrentUserId();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <MessageCircle size={20} className="text-brand-600" />
          <h3 className="font-bold text-gray-900">评论 ({comments.length})</h3>
        </div>
      </div>

      {/* Comment Input */}
      <div className="px-6 py-4 border-b border-gray-100">
        {replyingTo && (
          <div className="mb-2 flex items-center justify-between bg-brand-50 px-3 py-2 rounded-lg">
            <span className="text-sm text-brand-700">
              回复 {comments.find(c => c.id === replyingTo)?.userName}
            </span>
            <button
              onClick={() => setReplyingTo(null)}
              className="text-brand-600 hover:text-brand-700"
            >
              取消
            </button>
          </div>
        )}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
            <img
              src={
                currentUserId
                  ? JSON.parse(localStorage.getItem('rehaber_user') || '{}').avatar
                  : 'https://api.dicebear.com/7.x/avataaars/svg?seed=guest'
              }
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="写下你的评论..."
              className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-400 text-sm"
              disabled={submitting}
            />
            <button
              onClick={handleSubmit}
              disabled={!newComment.trim() || submitting}
              className="ml-2 text-brand-600 disabled:text-gray-300 hover:text-brand-700 transition-colors"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Send size={20} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="divide-y divide-gray-100">
        {comments.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <MessageCircle size={48} className="mx-auto mb-3 opacity-30" />
            <div className="text-sm">暂无评论，来抢沙发吧！</div>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUserId={currentUserId}
              onLike={handleLike}
              onReply={(id) => setReplyingTo(id)}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

interface CommentItemProps {
  comment: Comment;
  currentUserId: string | null;
  onLike: (id: string) => void;
  onReply: (id: string) => void;
  onDelete: (id: string) => void;
  isReply?: boolean;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  currentUserId,
  onLike,
  onReply,
  onDelete,
  isReply = false
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const isOwner = currentUserId === comment.userId;

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return date.toLocaleDateString('zh-CN');
  };

  return (
    <div className={`${isReply ? 'ml-12' : ''} px-6 py-4`}>
      <div className="flex space-x-3">
        <img
          src={comment.userAvatar}
          alt={comment.userName}
          className="w-10 h-10 rounded-full flex-shrink-0 object-cover"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-gray-900 text-sm">{comment.userName}</span>
              <span className="text-xs text-gray-400">{formatTime(comment.createdAt)}</span>
            </div>
            {isOwner && (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <MoreVertical size={16} className="text-gray-400" />
                </button>
                {showMenu && (
                  <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10">
                    <button
                      onClick={() => {
                        onDelete(comment.id);
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <Trash2 size={14} />
                      <span>删除</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          <p className="text-gray-700 text-sm leading-relaxed mb-2">{comment.content}</p>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onLike(comment.id)}
              className={`flex items-center space-x-1 text-xs transition-colors ${
                comment.isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
              }`}
            >
              <Heart
                size={14}
                className={comment.isLiked ? 'fill-red-500' : ''}
              />
              <span>{comment.likesCount > 0 ? comment.likesCount : '点赞'}</span>
            </button>
            {!isReply && (
              <button
                onClick={() => onReply(comment.id)}
                className="text-xs text-gray-400 hover:text-brand-600 transition-colors"
              >
                回复
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              currentUserId={currentUserId}
              onLike={onLike}
              onReply={onReply}
              onDelete={onDelete}
              isReply={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};
