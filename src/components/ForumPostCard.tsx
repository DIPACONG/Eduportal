'use client';

import React, { useState } from 'react';
import { usePortal } from '@/lib/store';
import { ForumPost, ForumComment } from '@/lib/types';
import { formatRelativeTime } from '@/lib/utils';
import {
  Heart,
  MessageSquare,
  Share2,
  Trash2,
  Edit3,
  CornerDownRight,
  Send,
  ShieldCheck,
  GraduationCap,
  Pin,
  MoreVertical,
  Check
} from 'lucide-react';

interface ForumPostCardProps {
  post: ForumPost;
  onEdit?: (post: ForumPost) => void;
}

export const ForumPostCard: React.FC<ForumPostCardProps> = ({ post, onEdit }) => {
  const {
    currentUser,
    toggleLikePost,
    addComment,
    deleteComment,
    deletePost
  } = usePortal();

  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyInput, setReplyInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const isLiked = post.liked_by_users.includes(currentUser.id);
  const canModify = currentUser.role === 'guru' || currentUser.id === post.user_id;

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    addComment(post.id, commentInput.trim(), null);
    setCommentInput('');
    setShowComments(true);
  };

  const handleSendReply = (parentId: string) => {
    if (!replyInput.trim()) return;
    addComment(post.id, replyInput.trim(), parentId);
    setReplyInput('');
    setReplyingToId(null);
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const categoryColors: Record<string, string> = {
    'Pengumuman Guru': 'bg-amber-100 text-amber-800 border-amber-200',
    'Pemrograman Web': 'bg-blue-100 text-blue-800 border-blue-200',
    'Basis Data': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'Algoritma & Struktur Data': 'bg-purple-100 text-purple-800 border-purple-200',
    'Jaringan Komputer': 'bg-cyan-100 text-cyan-800 border-cyan-200',
    'Umum': 'bg-slate-100 text-slate-800 border-slate-200',
  };

  return (
    <article className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow overflow-hidden">
      
      {/* Pinned banner */}
      {post.is_pinned && (
        <div className="bg-amber-500/10 border-b border-amber-200 px-5 py-1.5 flex items-center gap-2 text-xs font-semibold text-amber-800">
          <Pin className="w-3.5 h-3.5 rotate-45 text-amber-600" />
          <span>Postingan Disematkan oleh Dosen / Guru</span>
        </div>
      )}

      <div className="p-5 sm:p-6">
        {/* Post Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <img
              src={post.author_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
              alt={post.author_name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm text-slate-900">{post.author_name}</span>
                {post.author_role === 'guru' ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                    <ShieldCheck className="w-3 h-3 text-amber-600" />
                    <span>Guru / Dosen</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <GraduationCap className="w-3 h-3 text-emerald-600" />
                    <span>Siswa</span>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                <span>{formatRelativeTime(post.created_at)}</span>
                <span>•</span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.2 rounded-full border ${
                    categoryColors[post.category] || categoryColors['Umum']
                  }`}
                >
                  {post.category}
                </span>
              </div>
            </div>
          </div>

          {/* Action menu (Edit / Delete) */}
          {canModify && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showMenu && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowMenu(false)} />
                  <div className="absolute right-0 mt-1 w-36 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-40 text-xs">
                    {onEdit && (
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          onEdit(post);
                        }}
                        className="w-full px-3 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                        <span>Edit Post</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        if (confirm('Yakin ingin menghapus postingan ini?')) {
                          deletePost(post.id);
                        }
                      }}
                      className="w-full px-3 py-2 text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus Post</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Post Title & Content */}
        <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">{post.title}</h3>
        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line mb-4">
          {post.content}
        </p>

        {/* Post Actions (Like, Comment, Share) */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            
            {/* Like button */}
            <button
              onClick={() => toggleLikePost(post.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold transition ${
                isLiked
                  ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-rose-500'
              }`}
            >
              <Heart
                className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`}
              />
              <span>{post.likes_count}</span>
              <span className="hidden sm:inline">Suka</span>
            </button>

            {/* Comment button */}
            <button
              onClick={() => setShowComments(!showComments)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold transition ${
                showComments
                  ? 'bg-brand-50 text-brand-600'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-brand-600'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>{post.comments_count}</span>
              <span className="hidden sm:inline">Komentar</span>
            </button>

          </div>

          {/* Share button */}
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 font-medium transition"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600 font-semibold">Tersalin!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Bagikan</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Comment Section */}
      {showComments && (
        <div className="bg-slate-50/70 border-t border-slate-100 p-4 sm:p-6 space-y-4">
          
          {/* Main Comment Input */}
          <form onSubmit={handleSendComment} className="flex gap-2.5">
            <img
              src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
              alt={currentUser.full_name}
              className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5"
            />
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                placeholder="Tulis komentar atau pertanyaan edukatif..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
              <button
                type="submit"
                disabled={!commentInput.trim()}
                className="px-3.5 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Kirim</span>
              </button>
            </div>
          </form>

          {/* Comments List (Nested Tree) */}
          <div className="space-y-3 pt-2">
            {post.comments.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-2">
                Belum ada komentar. Jadilah yang pertama berdiskusi!
              </p>
            ) : (
              post.comments.map((comment) => (
                <div key={comment.id} className="space-y-2">
                  
                  {/* Top-level comment */}
                  <div className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
                    <img
                      src={comment.author_avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80'}
                      alt={comment.author_name}
                      className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-xs text-slate-900">{comment.author_name}</span>
                          {comment.author_role === 'guru' && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                              Guru
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400">
                            {formatRelativeTime(comment.created_at)}
                          </span>
                        </div>

                        {/* Delete comment action */}
                        {(currentUser.role === 'guru' || currentUser.id === comment.user_id) && (
                          <button
                            onClick={() => deleteComment(post.id, comment.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 rounded"
                            title="Hapus komentar"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-slate-700 mt-1 leading-relaxed">{comment.content}</p>

                      {/* Reply button */}
                      <div className="mt-1.5">
                        <button
                          onClick={() => setReplyingToId(replyingToId === comment.id ? null : comment.id)}
                          className="text-[11px] font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                        >
                          <CornerDownRight className="w-3 h-3" />
                          <span>Balas</span>
                        </button>
                      </div>

                      {/* Nested reply input box */}
                      {replyingToId === comment.id && (
                        <div className="mt-2.5 pt-2 border-t border-slate-100 flex gap-2">
                          <input
                            type="text"
                            placeholder={`Balas ${comment.author_name}...`}
                            value={replyInput}
                            onChange={(e) => setReplyInput(e.target.value)}
                            className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSendReply(comment.id)}
                            disabled={!replyInput.trim()}
                            className="px-3 py-1.5 bg-brand-600 text-white rounded-lg text-xs font-semibold disabled:opacity-40"
                          >
                            Kirim
                          </button>
                          <button
                            onClick={() => setReplyingToId(null)}
                            className="px-2 py-1.5 text-slate-400 hover:text-slate-600 text-xs"
                          >
                            Batal
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Nested replies (level 2) */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="pl-6 sm:pl-8 space-y-2 border-l-2 border-brand-200/60 ml-3">
                      {comment.replies.map((reply) => (
                        <div
                          key={reply.id}
                          className="flex items-start gap-2.5 bg-white/90 p-2.5 rounded-xl border border-slate-200/60 shadow-2xs"
                        >
                          <img
                            src={reply.author_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                            alt={reply.author_name}
                            className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-xs text-slate-900">{reply.author_name}</span>
                                {reply.author_role === 'guru' && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                                    Guru
                                  </span>
                                )}
                                <span className="text-[10px] text-slate-400">
                                  {formatRelativeTime(reply.created_at)}
                                </span>
                              </div>
                              {(currentUser.role === 'guru' || currentUser.id === reply.user_id) && (
                                <button
                                  onClick={() => deleteComment(post.id, reply.id)}
                                  className="text-slate-400 hover:text-rose-600 p-0.5"
                                  title="Hapus balasan"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                            <p className="text-xs text-slate-700 mt-0.5 leading-relaxed">{reply.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              ))
            )}
          </div>

        </div>
      )}

    </article>
  );
};
