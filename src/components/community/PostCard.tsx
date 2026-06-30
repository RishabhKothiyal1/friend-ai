import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Heart, MessageCircle, Bookmark, Share2, Eye, Clock } from "lucide-react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/config";
import type { Post } from "../../types/community";
import { useAuth } from "../../contexts/AuthContext";
import { toggleLike } from "../../hooks/useCommunity";

interface PostCardProps {
  post: Post;
  onClick: () => void;
}

export default function PostCard({ post, onClick }: PostCardProps) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes ?? 0);
  const [commentCount, setCommentCount] = useState(post.commentCount ?? post.comments ?? 0);
  const [bookmarked, setBookmarked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  // Live listener on post doc for like + comment counts
  useEffect(() => {
    if (!db) return;
    const unsub = onSnapshot(doc(db, "posts", post.id), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setLikeCount(data.likes ?? 0);
        setCommentCount(data.commentCount ?? data.comments ?? 0);
      }
    });
    return unsub;
  }, [post.id]);

  // Live listener for whether current user liked this post
  useEffect(() => {
    if (!db || !user) return;
    const unsub = onSnapshot(doc(db, "likes", `${post.id}_${user.uid}`), (snap) => {
      setLiked(snap.exists() && !!snap.data()?.active);
    });
    return unsub;
  }, [post.id, user?.uid]);

  const timeAgo = (timestamp: any) => {
    if (!timestamp?.toDate) return "";
    const diff = Date.now() - timestamp.toDate().getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user || isLiking) return;
    setIsLiking(true);
    // Optimistic update
    setLiked(prev => !prev);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
    try {
      await toggleLike(post.id, user.uid);
    } catch (err) {
      // Revert on failure
      setLiked(prev => !prev);
      setLikeCount(prev => liked ? prev + 1 : prev - 1);
      console.error("Like failed:", err);
    } finally {
      setIsLiking(false);
    }
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarked(!bookmarked);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(`${window.location.origin}/community/post/${post.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className="group p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/[0.07] transition-all cursor-pointer"
    >
      <div className="flex items-start gap-3">
        {post.authorAvatar ? (
          <img src={post.authorAvatar} alt={post.authorName} className="w-9 h-9 rounded-full object-cover shrink-0 bg-slate-700" />
        ) : (
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 text-white text-xs font-black">
            {(post.authorName || "U").charAt(0).toUpperCase()}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span className="font-medium text-slate-200">{post.authorName}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {timeAgo(post.createdAt)}
            </span>
            {post.edited && <span className="text-[10px] text-slate-500">(edited)</span>}
          </div>

          <span className="inline-block px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 text-[10px] font-medium mb-1.5">
            {post.category}
          </span>

          <h3 className="text-sm font-bold text-white mb-1 group-hover:text-indigo-300 transition-colors line-clamp-2">
            {post.title}
          </h3>

          <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-2">
            {post.content.replace(/[#*`>\[\]]/g, "").slice(0, 300)}
          </p>

          {post.image && (
            <img src={post.image} alt="" className="w-full max-h-48 object-cover rounded-lg mb-2" loading="lazy" />
          )}

          {post.tags.length > 0 && (
            <div className="flex gap-1 flex-wrap mb-2">
              {post.tags.map((t) => (
                <span key={t} className="px-1.5 py-0.5 rounded bg-white/5 text-[10px] text-slate-400">#{t}</span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 text-xs text-slate-400">
            <button
              onClick={handleLike}
              disabled={isLiking}
              className={`flex items-center gap-1 hover:text-red-400 transition-colors cursor-pointer ${liked ? "text-red-400" : ""}`}
            >
              <Heart className={`w-3.5 h-3.5 ${liked ? "fill-red-400" : ""}`} />
              <span>{likeCount}</span>
            </button>
            <span className="flex items-center gap-1 hover:text-indigo-400 transition-colors">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{commentCount}</span>
            </span>
            <button onClick={handleBookmark} className={`flex items-center gap-1 hover:text-yellow-400 transition-colors cursor-pointer ${bookmarked ? "text-yellow-400" : ""}`}>
              <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? "fill-yellow-400" : ""}`} />
            </button>
            <button onClick={handleShare} className="flex items-center gap-1 hover:text-indigo-400 transition-colors cursor-pointer">
              <Share2 className="w-3.5 h-3.5" />
            </button>
            <span className="flex items-center gap-1 ml-auto">
              <Eye className="w-3.5 h-3.5" />
              <span>{post.views}</span>
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
