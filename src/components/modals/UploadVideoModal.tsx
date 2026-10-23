import React, { useState, useRef } from 'react';
import { 
  X, 
  UploadCloud, 
  Film, 
  Image as ImageIcon, 
  CheckCircle2, 
  Loader2, 
  Eye, 
  Lock, 
  Globe, 
  Sparkles,
  Camera
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VideoVisibility } from '../../types';
import { storeMediaBlob } from '../../lib/storage';

export const UploadVideoModal: React.FC = () => {
  const { 
    isUploadModalOpen, 
    setIsUploadModalOpen, 
    uploadVideo, 
    currentChannel, 
    navigateTo,
    currentUser,
    setIsAuthModalOpen
  } = useApp();

  const [step, setStep] = useState<'select' | 'details' | 'uploading' | 'complete'>('select');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>('');
  
  // Details form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Tech & AI');
  const [tagsInput, setTagsInput] = useState('Tech, AI, Innovation');
  const [visibility, setVisibility] = useState<VideoVisibility>('public');
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('/src/assets/images/thumb_tech_ai_1792757458005.jpg');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [newVideoId, setNewVideoId] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  if (!isUploadModalOpen) return null;

  const categories = [
    'Tech & AI',
    'Nature & Travel',
    'Lofi & Music',
    'Culinary',
    'Coding & Dev',
    'Gaming',
    'Education',
    'Film & Media'
  ];

  const presetThumbnails = [
    { url: '/src/assets/images/thumb_tech_ai_1792757458005.jpg', label: 'Quantum Tech' },
    { url: '/src/assets/images/thumb_cinematic_travel_1792757458722.jpg', label: 'Fjords 4K' },
    { url: '/src/assets/images/thumb_lofi_music_1792757458806.jpg', label: 'Lofi Midnight' },
    { url: '/src/assets/images/thumb_cooking_culinary_1792757459060.jpg', label: 'Artisan Hearth' }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreviewUrl(url);
      setTitle(file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));
      setStep('details');
    }
  };

  const handlePresetSelect = (presetUrl: string, sampleTitle: string) => {
    setVideoPreviewUrl(presetUrl);
    setTitle(sampleTitle);
    setStep('details');
  };

  const handleCustomThumbnail = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setThumbnailUrl(url);
    }
  };

  const handlePublish = async () => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    setStep('uploading');

    // Simulate reliable multi-step encoding progress
    for (let p = 10; p <= 100; p += 15) {
      await new Promise(r => setTimeout(r, 120));
      setUploadProgress(Math.min(100, p));
    }

    let finalVideoUrl = videoPreviewUrl;
    if (videoFile) {
      // Store blob in IndexedDB
      const blobKey = `vid_blob_${Date.now()}`;
      await storeMediaBlob(blobKey, videoFile);
      finalVideoUrl = videoPreviewUrl;
    }

    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

    const created = uploadVideo({
      title: title.trim() || 'Untitled Video',
      description: description.trim() || 'Uploaded to VidPulse',
      videoUrl: finalVideoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnailUrl: thumbnailUrl,
      duration: 360,
      formattedDuration: '06:00',
      tags,
      category,
      visibility,
    });

    setNewVideoId(created.id);
    setStep('complete');
  };

  const handleClose = () => {
    setStep('select');
    setVideoFile(null);
    setVideoPreviewUrl('');
    setTitle('');
    setDescription('');
    setUploadProgress(0);
    setIsUploadModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#16161c] border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Film className="w-5 h-5 text-rose-500" />
              <span>Upload Video</span>
            </h2>
            <div className="text-xs text-slate-400">
              Publish high-definition content to {currentChannel?.name || 'your channel'}
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body based on step */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 'select' && (
            <div className="space-y-6">
              {/* Drag & Drop Zone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-rose-500 dark:hover:border-rose-500 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-900/40"
              >
                <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center mb-3">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Drag and drop video files to upload
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Supports MP4, WebM, MOV up to 4K resolution. Your videos will be private until published.
                </p>
                <button
                  type="button"
                  className="mt-4 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
                >
                  Select File from Computer
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* Sample Quick-Select Option */}
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Or test with high-performance sample streams:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handlePresetSelect('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'Next-Gen Quantum Waveguide Teardown')}
                    className="p-3 text-left bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl transition-colors cursor-pointer"
                  >
                    <div className="text-xs font-semibold text-slate-900 dark:text-white">
                      🔬 Quantum Architecture 4K
                    </div>
                    <div className="text-[11px] text-slate-500">Fast 1080p sample clip</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePresetSelect('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', 'Alpine Glaciers & Fjord Horizons')}
                    className="p-3 text-left bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl transition-colors cursor-pointer"
                  >
                    <div className="text-xs font-semibold text-slate-900 dark:text-white">
                      🦅 Norwegian Fjord FPV
                    </div>
                    <div className="text-[11px] text-slate-500">Drone 60fps sample clip</div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 'details' && (
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Video Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Catchy, informative title..."
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-rose-500 text-slate-900 dark:text-slate-100"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell viewers what your video is about..."
                  rows={3}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-rose-500 text-slate-900 dark:text-slate-100"
                />
              </div>

              {/* Thumbnail Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Thumbnail
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                  {presetThumbnails.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setThumbnailUrl(preset.url)}
                      className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        thumbnailUrl === preset.url ? 'border-rose-500 ring-2 ring-rose-500/30' : 'border-transparent opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                      <span className="absolute bottom-1 left-1 bg-black/75 text-white text-[9px] px-1 rounded">
                        {preset.label}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => thumbInputRef.current?.click()}
                    className="px-3 py-1.5 text-xs font-medium border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer flex items-center gap-1.5"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Upload Custom Thumbnail</span>
                  </button>
                  <input
                    ref={thumbInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCustomThumbnail}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Category & Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-rose-500 text-slate-900 dark:text-slate-100 cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="AI, tech, review..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-rose-500 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Visibility Options */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Visibility
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'public', label: 'Public', icon: Globe, desc: 'Anyone can search and watch' },
                    { id: 'unlisted', label: 'Unlisted', icon: Eye, desc: 'Anyone with the link' },
                    { id: 'private', label: 'Private', icon: Lock, desc: 'Only you can view' },
                  ].map((v) => {
                    const Icon = v.icon;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setVisibility(v.id as VideoVisibility)}
                        className={`p-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                          visibility === v.id 
                            ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20' 
                            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                          <Icon className="w-3.5 h-3.5 text-rose-500" />
                          <span>{v.label}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                          {v.desc}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {step === 'uploading' && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <Loader2 className="w-12 h-12 text-rose-600 animate-spin" />
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Encoding & Transcoding Video
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Generating multiple resolutions (1080p, 720p, 480p) and optimizing streaming bitrate...
                </p>
              </div>

              <div className="w-full max-w-md bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden mt-4">
                <div
                  className="bg-gradient-to-r from-rose-500 to-red-600 h-full rounded-full transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <div className="text-xs font-mono font-semibold text-rose-600 dark:text-rose-400">
                {uploadProgress}% processed
              </div>
            </div>
          )}

          {step === 'complete' && (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Video Published Successfully!
              </h3>
              <p className="text-xs text-slate-500 max-w-sm">
                "{title}" is now available to stream on VidPulse.
              </p>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => {
                    handleClose();
                    navigateTo('watch', newVideoId);
                  }}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-sm"
                >
                  Watch Video Now
                </button>
                <button
                  onClick={handleClose}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        {step === 'details' && (
          <div className="px-6 py-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
            <button
              onClick={() => setStep('select')}
              className="px-4 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
            >
              Back
            </button>
            <button
              onClick={handlePublish}
              disabled={!title.trim()}
              className="px-6 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-colors"
            >
              Publish Video
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
