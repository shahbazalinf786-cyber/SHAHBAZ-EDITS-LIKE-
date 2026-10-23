import React, { useState } from 'react';
import { X, Copy, Check, Share2, Code, MessageCircle, Send } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url?: string;
  currentTime?: number;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  title,
  url,
  currentTime = 0
}) => {
  const [includeTimestamp, setIncludeTimestamp] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'link' | 'embed'>('link');

  if (!isOpen) return null;

  const baseUrl = url || window.location.href;
  const timeQuery = includeTimestamp && currentTime > 0 ? `?t=${Math.floor(currentTime)}s` : '';
  const finalShareUrl = `${baseUrl}${timeQuery}`;
  const embedCode = `<iframe width="560" height="315" src="${finalShareUrl}" title="${title}" frameborder="0" allowfullscreen></iframe>`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const socialLinks = [
    { name: 'X / Twitter', color: 'hover:text-sky-400', url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(finalShareUrl)}` },
    { name: 'WhatsApp', color: 'hover:text-emerald-500', url: `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + finalShareUrl)}` },
    { name: 'Reddit', color: 'hover:text-orange-500', url: `https://reddit.com/submit?url=${encodeURIComponent(finalShareUrl)}&title=${encodeURIComponent(title)}` },
    { name: 'LinkedIn', color: 'hover:text-blue-600', url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(finalShareUrl)}` },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#16161c] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-5 shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Share2 className="w-4 h-4 text-rose-500" />
            <span>Share Video</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex gap-2 my-4 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('link')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'link' 
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' 
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Direct Link
          </button>
          <button
            onClick={() => setActiveTab('embed')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'embed' 
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' 
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Embed HTML
          </button>
        </div>

        {activeTab === 'link' ? (
          <div className="space-y-4">
            {/* Quick Share Buttons */}
            <div className="flex justify-between gap-2">
              {socialLinks.map((s, idx) => (
                <a
                  key={idx}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex-1 py-2 px-1 text-center bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors ${s.color}`}
                >
                  {s.name}
                </a>
              ))}
            </div>

            {/* URL Input with copy */}
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1.5">
              <input
                type="text"
                readOnly
                value={finalShareUrl}
                className="flex-1 bg-transparent px-2 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none truncate"
              />
              <button
                onClick={() => handleCopy(finalShareUrl)}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Start at timestamp checkbox */}
            {currentTime > 0 && (
              <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeTimestamp}
                  onChange={(e) => setIncludeTimestamp(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
                <span>Start at {Math.floor(currentTime)}s</span>
              </label>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <textarea
              readOnly
              rows={4}
              value={embedCode}
              className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-700 dark:text-slate-300 focus:outline-none resize-none"
            />
            <div className="flex justify-end">
              <button
                onClick={() => handleCopy(embedCode)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Code className="w-4 h-4" />}
                <span>{copied ? 'Copied HTML' : 'Copy Embed Code'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
