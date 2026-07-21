'use client';

import React, { useState } from 'react';
import { MessageSquare, Send, Trash2 } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { formatRelativeTime } from '@/lib/utils';
import { Task } from '@/types';

interface TaskCommentsProps {
  task: Task;
}

export function TaskComments({ task }: TaskCommentsProps) {
  const { addComment, deleteComment, users } = useAppStore();
  const [commentText, setCommentText] = useState('');
  const currentUser = users[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(task.id, commentText);
    setCommentText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
      {/* Header */}
      <div className="flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-brand-500" />
        <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
          Activity & Discussion
        </h4>
        <span className="text-[11px] text-slate-400">({task.comments.length})</span>
      </div>

      {/* Comments List */}
      <div className="space-y-3">
        {task.comments.map((comment) => {
          const author = users.find((u) => u.id === comment.userId) || comment.user || currentUser;
          const isOwnComment = comment.userId === currentUser.id;

          return (
            <div
              key={comment.id}
              className="flex gap-3 p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 group"
            >
              <Avatar src={author.avatar} name={author.name} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      {author.name}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {formatRelativeTime(comment.createdAt)}
                    </span>
                  </div>
                  {isOwnComment && (
                    <button
                      onClick={() => deleteComment(task.id, comment.id)}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 transition p-0.5 rounded"
                      title="Delete comment"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>
            </div>
          );
        })}

        {task.comments.length === 0 && (
          <div className="py-6 text-center text-xs text-slate-400">
            No comments yet. Start the conversation!
          </div>
        )}
      </div>

      {/* Comment Input Box */}
      <form onSubmit={handleSubmit} className="pt-2">
        <div className="flex gap-2">
          <Avatar src={currentUser.avatar} name={currentUser.name} size="sm" />
          <div className="flex-1 space-y-2">
            <textarea
              rows={2}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Write a comment... (Ctrl+Enter to post)"
              className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500 resize-none"
            />
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400">Pro-tip: Press Ctrl+Enter to send</span>
              <Button type="submit" size="sm" disabled={!commentText.trim()} className="text-xs">
                <Send className="w-3 h-3 mr-1" />
                Comment
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
