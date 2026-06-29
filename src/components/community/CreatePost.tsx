import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Image, Link, Globe, Lock, Users, Loader2 } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { createPost, uploadImage } from "../../hooks/useCommunity";
import { CATEGORIES } from "../../types/community";

interface CreatePostProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreatePost({ isOpen, onClose }: CreatePostProps) {
  const { user, profile } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [link, setLink] = useState("");
  const [visibility, setVisibility] = useState<"public" | "followers" | "private">("public");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be under 10 MB");
      return;
    }
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t) && tags.length < 5) {
      setTags([...tags, t]);
      setTagInput("");
    }
  };

  const handleSubmit = async () => {
    if (!user || !profile || !db) return;
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required");
      return;
    }

    setUploading(true);
    setError("");

    try {
      let imageUrl = "";
      if (image) {
        imageUrl = await uploadImage(image, `posts/${user.uid}/${Date.now()}`);
      }

      await createPost({
        title: title.trim(),
        content: content.trim(),
        category,
        tags,
        image: imageUrl,
        authorId: user.uid,
        authorName: profile.displayName,
        authorAvatar: profile.photoURL,
        visibility,
        link: link.trim() || undefined,
      });

      setTitle("");
      setContent("");
      setCategory("General");
      setTags([]);
      setImage(null);
      setImagePreview("");
      setLink("");
      setVisibility("public");
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const charCount = content.length;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-slate-900/95 backdrop-blur-xl p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Create Post</h2>
              <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">{error}</div>
            )}

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Post title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={200}
                className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-base font-bold placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />

              <textarea
                placeholder="What's on your mind? (Markdown supported)"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
              />
              <div className="text-right text-[10px] text-slate-500">{charCount} characters</div>

              <div className="flex gap-2">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:border-indigo-500"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} className="bg-slate-800">{c}</option>
                  ))}
                </select>

                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value as any)}
                  className="px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:border-indigo-500"
                >
                  <option value="public" className="bg-slate-800"><Globe className="w-3 h-3 inline" /> Public</option>
                  <option value="followers" className="bg-slate-800"><Users className="w-3 h-3 inline" /> Followers</option>
                  <option value="private" className="bg-slate-800"><Lock className="w-3 h-3 inline" /> Private</option>
                </select>
              </div>

              <div className="flex gap-2">
                <div className="flex-1 flex gap-1 flex-wrap">
                  {tags.map((t) => (
                    <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-medium">
                      #{t}
                      <button onClick={() => setTags(tags.filter((x) => x !== t))} className="hover:text-white cursor-pointer">&times;</button>
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  className="flex-1 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <button onClick={addTag} className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition-colors cursor-pointer">Add</button>
              </div>

              <input
                type="text"
                placeholder="Optional link..."
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
              />

              <div className="flex items-center gap-3">
                <button
                  onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 text-slate-300 text-xs hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <Image className="w-3.5 h-3.5" />
                  {image ? "Change Image" : "Add Image"}
                </button>
                <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={handleImageSelect} className="hidden" />
                {imagePreview && (
                  <div className="relative">
                    <img src={imagePreview} alt="preview" className="h-12 rounded-lg object-cover" />
                    <button
                      onClick={() => { setImage(null); setImagePreview(""); }}
                      className="absolute -top-1 -right-1 p-0.5 bg-red-500 rounded-full text-white cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
              <div className="flex gap-2">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[10px] text-slate-400">{visibility === "public" ? "Visible to everyone" : visibility === "followers" ? "Visible to followers" : "Only you"}</span>
              </div>
              <button
                onClick={handleSubmit}
                disabled={uploading || !title.trim() || !content.trim()}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {uploading && <Loader2 className="w-4 h-4 animate-spin" />}
                Publish
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

import { db } from "../../firebase/config";
