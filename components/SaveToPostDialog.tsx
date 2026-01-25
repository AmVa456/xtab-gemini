/**
 * Dialog for saving generated images to xTab-dashboard as posts
 */

import React, { useState } from 'react';
import type { Platform, PostStatus } from '../lib/types';

const XIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export interface SaveToPostDialogProps {
  isOpen: boolean;
  images: string[];
  onClose: () => void;
  onSave: (data: {
    title: string;
    content: string;
    platforms: Platform[];
    status: PostStatus;
    scheduledAt?: Date;
    tags: string[];
  }) => Promise<void>;
  isSaving?: boolean;
}

const PLATFORMS: { id: Platform; label: string }[] = [
  { id: 'reddit', label: 'Reddit' },
  { id: 'twitter', label: 'Twitter' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'medium', label: 'Medium' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'instagram', label: 'Instagram' },
];

const SaveToPostDialog: React.FC<SaveToPostDialogProps> = ({
  isOpen,
  images,
  onClose,
  onSave,
  isSaving = false,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [status, setStatus] = useState<PostStatus>('draft');
  const [scheduledDate, setScheduledDate] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handlePlatformToggle = (platform: Platform) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (selectedPlatforms.length === 0) {
      setError('Please select at least one platform');
      return;
    }

    if (status === 'scheduled' && !scheduledDate) {
      setError('Scheduled date is required for scheduled posts');
      return;
    }

    try {
      await onSave({
        title: title.trim(),
        content: content.trim(),
        platforms: selectedPlatforms,
        status,
        scheduledAt: scheduledDate ? new Date(scheduledDate) : undefined,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      });

      // Reset form on success
      setTitle('');
      setContent('');
      setSelectedPlatforms([]);
      setStatus('draft');
      setScheduledDate('');
      setTags('');
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save post');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 className="text-xl font-bold text-slate-100">Save to Dashboard</h2>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="p-1 text-slate-400 hover:text-slate-200 transition-colors disabled:opacity-50"
            aria-label="Close dialog"
          >
            <XIcon />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Image Preview */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Images ({images.length})
            </label>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Preview ${index + 1}`}
                  className="h-20 w-20 object-cover rounded border border-slate-700"
                />
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="post-title" className="block text-sm font-medium text-slate-300 mb-1">
              Title *
            </label>
            <input
              id="post-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              placeholder="Enter post title"
              disabled={isSaving}
              required
            />
          </div>

          {/* Content */}
          <div>
            <label htmlFor="post-content" className="block text-sm font-medium text-slate-300 mb-1">
              Content / Caption
            </label>
            <textarea
              id="post-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
              placeholder="Enter post content or caption"
              disabled={isSaving}
            />
          </div>

          {/* Platforms */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Platforms *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PLATFORMS.map((platform) => (
                <label
                  key={platform.id}
                  className={`flex items-center gap-2 p-2 rounded-md border cursor-pointer transition-colors ${
                    selectedPlatforms.includes(platform.id)
                      ? 'bg-sky-900/50 border-sky-600'
                      : 'bg-slate-900 border-slate-700 hover:border-slate-600'
                  } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={selectedPlatforms.includes(platform.id)}
                    onChange={() => handlePlatformToggle(platform.id)}
                    disabled={isSaving}
                    className="rounded text-sky-600 focus:ring-sky-500"
                  />
                  <span className="text-sm text-slate-200">{platform.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <label htmlFor="post-status" className="block text-sm font-medium text-slate-300 mb-1">
              Status
            </label>
            <select
              id="post-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as PostStatus)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              disabled={isSaving}
            >
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="published">Published</option>
            </select>
          </div>

          {/* Scheduled Date (only if status is scheduled) */}
          {status === 'scheduled' && (
            <div>
              <label htmlFor="scheduled-date" className="block text-sm font-medium text-slate-300 mb-1">
                Schedule Date & Time *
              </label>
              <input
                id="scheduled-date"
                type="datetime-local"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                disabled={isSaving}
                required
              />
            </div>
          )}

          {/* Tags */}
          <div>
            <label htmlFor="post-tags" className="block text-sm font-medium text-slate-300 mb-1">
              Tags (comma-separated)
            </label>
            <input
              id="post-tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              placeholder="design, ai, creative"
              disabled={isSaving}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-900/50 border border-red-700 text-red-300 rounded-md text-sm">
              {error}
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-slate-700">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-slate-100 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-700 disabled:text-slate-500 text-white text-sm font-medium rounded-md transition-colors"
          >
            {isSaving ? 'Saving...' : 'Save to Dashboard'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveToPostDialog;
