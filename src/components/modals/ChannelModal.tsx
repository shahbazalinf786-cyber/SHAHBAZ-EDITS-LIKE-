import React, { useState, useEffect } from 'react';
import { X, Tv, Image as ImageIcon, Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ChannelModalProps {
  channelId?: string;
}

export const ChannelModal: React.FC<ChannelModalProps> = ({ channelId }) => {
  const { 
    isChannelModalOpen, 
    setIsChannelModalOpen, 
    currentChannel, 
    updateChannel, 
    createChannel, 
    navigateTo, 
    currentUser 
  } = useApp();

  const isEditing = Boolean(channelId || currentChannel);
  const targetChannel = currentChannel;

  const [name, setName] = useState(targetChannel?.name || '');
  const [handle, setHandle] = useState(targetChannel?.handle || '');
  const [description, setDescription] = useState(targetChannel?.description || '');
  const [banner, setBanner] = useState(targetChannel?.banner || '/src/assets/images/vidpulse_channel_banner_1792757456590.jpg');
  const [avatar, setAvatar] = useState(targetChannel?.avatar || currentUser?.avatar || '');

  useEffect(() => {
    if (targetChannel) {
      setName(targetChannel.name);
      setHandle(targetChannel.handle);
      setDescription(targetChannel.description);
      setBanner(targetChannel.banner);
      setAvatar(targetChannel.avatar);
    }
  }, [targetChannel]);

  if (!isChannelModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (isEditing && targetChannel) {
      updateChannel(targetChannel.id, {
        name: name.trim(),
        handle: handle.startsWith('@') ? handle.trim() : `@${handle.trim()}`,
        description: description.trim(),
        banner,
        avatar,
      });
      setIsChannelModalOpen(false);
      navigateTo('channel', targetChannel.id);
    } else {
      const created = createChannel({
        name: name.trim(),
        handle: handle.trim(),
        description: description.trim(),
        banner,
        avatar,
      });
      setIsChannelModalOpen(false);
      navigateTo('channel', created.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#16161c] border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <Tv className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isEditing ? 'Customize Channel' : 'Create Channel'}
              </h3>
              <p className="text-[11px] text-slate-400">
                Setup your brand identity, handle, and banner
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsChannelModalOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Channel Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!isEditing) {
                  setHandle(`@${e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '')}`);
                }
              }}
              placeholder="e.g. Apex Tech Lab"
              required
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-rose-500 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Channel Handle (@handle) *
            </label>
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="@apextech"
              required
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-rose-500 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Channel Description & Bio
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell viewers what content you create..."
              rows={3}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-rose-500 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Channel Banner
            </label>
            <div className="relative aspect-[4/1] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 mb-2">
              <img src={banner} alt="Banner Preview" className="w-full h-full object-cover" />
            </div>
            <div className="flex gap-2">
              {[
                { label: 'Cyber Pulse', src: '/src/assets/images/vidpulse_channel_banner_1792757456590.jpg' },
                { label: 'Nordic Fjord', src: '/src/assets/images/thumb_cinematic_travel_1792757458722.jpg' },
                { label: 'Midnight Tokyo', src: '/src/assets/images/thumb_lofi_music_1792757458806.jpg' }
              ].map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setBanner(p.src)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                    banner === p.src ? 'border-rose-500 text-rose-500 font-bold bg-rose-50 dark:bg-rose-950/20' : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsChannelModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs cursor-pointer shadow-xs transition-colors"
            >
              {isEditing ? 'Save Changes' : 'Create Channel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
