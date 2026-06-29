import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Reply, Trash2, Edit3, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import type { Comment } from "../../types/community";
import { useAuth } from "../../contexts/AuthContext";
import { useReplies } from "../../hooks/useCommunity";
import { addComment } from "../../hooks/useCommunity";
import { db } from "../../firebase/config";
import { doc, updateDoc, deleteDoc, increment } from "firebase/firestore";

interface CommentsProps {
  postId: string;
  comments: Comment[];
  loading: boolean;
  onRefresh: () => void;
}

export default function Comments({ postId, comments, loading }: CommentsProps) {
  const { user, profile } = useAuth();
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());

  const handleSubmit = async () => {
    if (!user || !profile || !newComment.trim()) return;
    setSubmitting(true);
    try {
      await addComment({
        postId,
        parentId: null,
        authorId: user.uid,
        authorName: profile.displayName,
        authorAvatar: profile.photoURL,
        content: newComment.trim(),
      });
      setNewComment("");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async (parentId: string) => {
    if (!user || !profile || !replyContent.trim()) return;
    setSubmitting(true);
    try {
      await addComment({
        postId,
        parentId,
        authorId: user.uid,
        authorName: profile.displayName,
        authorAvatar: profile.photoURL,
        content: replyContent.trim(),
      });
      setReplyContent("");
      setReplyTo(null);
      setExpandedReplies((prev) => new Set(prev).add(parentId));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!db) return;
    await deleteDoc(doc(db, "comments", commentId));
    await updateDoc(doc(db, "posts", postId), { comments: increment(-1) });
  };

  const timeAgo = (timestamp: any) => {
    if (!timestamp?.toDate) return "";
    const diff = Date.now() - timestamp.toDate().getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const toggleReplies = (id: string) => {
    setExpandedReplies((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-3">
      {user && (
        <div className="flex gap-2">
          <img
            src={profile?.photoURL || "/friend_ai_mascot.jpg"}
            alt=""
            className="w-7 h-7 rounded-full object-cover shrink-0"
          />
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className="flex-1 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={handleSubmit}
              disabled={submitting || !newComment.trim()}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition-colors cursor-pointer disabled:opacity-50"
            >
              {submitting ? <Loader2 className="w-3 h-3 animate-spin" /> : "Post"}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-4">
          <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
        </div>
      ) : comments.length === 0 ? (
        <p className="text-xs text-slate-500 text-center py-4">No comments yet. Be the first to share your thoughts!</p>
      ) : (
        comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            postId={postId}
            userId={user?.uid}
            onDelete={handleDelete}
            onReply={(id) => setReplyTo(replyTo === id ? null : id)}
            replyTo={replyTo}
            replyContent={replyContent}
            onReplyContentChange={setReplyContent}
            onSubmitReply={handleReply}
            expandedReplies={expandedReplies}
            onToggleReplies={toggleReplies}
            timeAgo={timeAgo}
            submitting={submitting}
          />
        ))
      )}
    </div>
  );
}

interface CommentItemProps {
  comment: Comment;
  postId: string;
  userId?: string;
  onDelete: (id: string) => void;
  onReply: (id: string) => void;
  replyTo: string | null;
  replyContent: string;
  onReplyContentChange: (v: string) => void;
  onSubmitReply: (parentId: string) => void;
  expandedReplies: Set<string>;
  onToggleReplies: (id: string) => void;
  timeAgo: (ts: any) => string;
  submitting: boolean;
}

function CommentItem({
  comment,
  postId,
  userId,
  onDelete,
  onReply,
  replyTo,
  replyContent,
  onReplyContentChange,
  onSubmitReply,
  expandedReplies,
  onToggleReplies,
  timeAgo,
  submitting,
}: CommentItemProps) {
  const { replies, loading: repliesLoading } = useReplies(comment.id);
  const isExpanded = expandedReplies.has(comment.id);
  const isOwn = userId === comment.authorId;

  return (
    <div className="p-3 rounded-xl border border-white/5 bg-white/[0.03]">
      <div className="flex items-start gap-2">
        <img src={comment.authorAvatar || "/friend_ai_mascot.jpg"} alt="" className="w-6 h-6 rounded-full object-cover shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-0.5">
            <span className="font-medium text-slate-200">{comment.authorName}</span>
            <span>·</span>
            <span>{timeAgo(comment.createdAt)}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{comment.content}</p>
          <div className="flex items-center gap-3 mt-1.5">
            <button className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-indigo-400 transition-colors cursor-pointer">
              <Heart className="w-3 h-3" />
              {comment.likes}
            </button>
            <button onClick={() => onReply(comment.id)} className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-indigo-400 transition-colors cursor-pointer">
              <Reply className="w-3 h-3" />
              Reply
            </button>
            {isOwn && (
              <button onClick={() => onDelete(comment.id)} className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-red-400 transition-colors cursor-pointer">
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>

          {replyTo === comment.id && (
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                placeholder="Write a reply..."
                value={replyContent}
                onChange={(e) => onReplyContentChange(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSubmitReply(comment.id)}
                className="flex-1 px-2 py-1 rounded-lg border border-white/10 bg-white/5 text-white text-[10px] placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                autoFocus
              />
              <button
                onClick={() => onSubmitReply(comment.id)}
                disabled={submitting || !replyContent.trim()}
                className="px-2 py-1 rounded-lg bg-indigo-600 text-white text-[10px] font-bold hover:bg-indigo-500 transition-colors cursor-pointer disabled:opacity-50"
              >
                Reply
              </button>
            </div>
          )}

          {replies.length > 0 && (
            <div className="mt-2">
              <button
                onClick={() => onToggleReplies(comment.id)}
                className="flex items-center gap-1 text-[10px] text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
              >
                {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                {replies.length} {replies.length === 1 ? "reply" : "replies"}
              </button>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2 space-y-2 pl-4 border-l border-white/10">
                      {replies.map((reply) => (
                        <div key={reply.id} className="flex items-start gap-2">
                          <img src={reply.authorAvatar || "/friend_ai_mascot.jpg"} alt="" className="w-5 h-5 rounded-full object-cover shrink-0" />
                          <div>
                            <div className="flex items-center gap-1 text-[10px] text-slate-400">
                              <span className="font-medium text-slate-200">{reply.authorName}</span>
                              <span>·</span>
                              <span>{timeAgo(reply.createdAt)}</span>
                            </div>
                            <p className="text-[11px] text-slate-300">{reply.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
