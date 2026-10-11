import React, { useState, useRef } from 'react';
import {
  X,
  ArrowLeft,
  Image as ImageIcon,
  Sliders,
  Sparkles,
  MapPin,
  Smile,
  Check,
  Upload,
} from 'lucide-react';
import { useInstagram } from '../context/InstagramContext';
import { ASSET_IMAGES } from '../data/mockData';

interface FilterOption {
  name: string;
  cssClass: string;
}

const FILTERS: FilterOption[] = [
  { name: 'Normal', cssClass: 'filter-normal' },
  { name: 'Clarendon', cssClass: 'filter-clarendon' },
  { name: 'Gingham', cssClass: 'filter-gingham' },
  { name: 'Juno', cssClass: 'filter-juno' },
  { name: 'Lark', cssClass: 'filter-lark' },
  { name: 'Ludwig', cssClass: 'filter-ludwig' },
  { name: 'Slumber', cssClass: 'filter-slumber' },
  { name: 'Valencia', cssClass: 'filter-valencia' },
  { name: 'Noir', cssClass: 'filter-noir' },
];

const SAMPLE_PHOTOS = [
  { label: 'Streetwear', url: ASSET_IMAGES.urbanStreetwear },
  { label: 'Coffee', url: ASSET_IMAGES.coffeeFlatlay },
  { label: 'Surf Wave', url: ASSET_IMAGES.coastalSurf },
  { label: 'Interior', url: ASSET_IMAGES.nordicInterior },
  { label: 'Gastronomy', url: ASSET_IMAGES.culinaryPlating },
];

export const CreatePostModal: React.FC = () => {
  const { isCreateModalOpen, setIsCreateModalOpen, addNewPost, addNewStory, currentUser } =
    useInstagram();

  const [step, setStep] = useState<'select' | 'filter' | 'caption'>('select');
  const [selectedImage, setSelectedImage] = useState<string>(ASSET_IMAGES.urbanStreetwear);
  const [selectedFilter, setSelectedFilter] = useState<string>('filter-normal');
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [saturation, setSaturation] = useState<number>(100);

  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('London, UK');
  const [shareToStory, setShareToStory] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isCreateModalOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setSelectedImage(reader.result);
          setStep('filter');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = () => {
    setIsSubmitting(true);

    // Extract hashtags from caption
    const hashtags = caption
      .split(/\s+/)
      .filter(w => w.startsWith('#'))
      .map(w => w.replace('#', ''));

    setTimeout(() => {
      addNewPost({
        mediaUrl: selectedImage,
        caption: caption.trim() || 'A new memory captured ✨',
        location,
        filter: selectedFilter,
        tags: hashtags.length > 0 ? hashtags : ['instagram', 'photography'],
      });

      if (shareToStory) {
        addNewStory(selectedImage, caption.slice(0, 50));
      }

      setIsSubmitting(false);
      resetState();
    }, 600);
  };

  const resetState = () => {
    setStep('select');
    setCaption('');
    setSelectedFilter('filter-normal');
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setIsCreateModalOpen(false);
  };

  const addEmoji = (emoji: string) => {
    setCaption(prev => prev + emoji);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#262626] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col border border-neutral-200 dark:border-neutral-800 animate-in fade-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="h-12 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between px-4">
          {step !== 'select' ? (
            <button
              onClick={() => setStep(step === 'caption' ? 'filter' : 'select')}
              className="text-neutral-700 dark:text-neutral-200 hover:opacity-75 p-1"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <div className="w-5" />
          )}

          <h2 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
            {step === 'select' && 'Create new post'}
            {step === 'filter' && 'Edit photo'}
            {step === 'caption' && 'New post details'}
          </h2>

          <div className="flex items-center gap-2">
            {step === 'select' && (
              <button
                onClick={() => setStep('filter')}
                className="text-xs font-semibold text-sky-500 hover:text-sky-600 px-2 py-1"
              >
                Next
              </button>
            )}

            {step === 'filter' && (
              <button
                onClick={() => setStep('caption')}
                className="text-xs font-semibold text-sky-500 hover:text-sky-600 px-2 py-1"
              >
                Next
              </button>
            )}

            {step === 'caption' && (
              <button
                onClick={handlePublish}
                disabled={isSubmitting}
                className="text-xs font-semibold text-sky-500 hover:text-sky-600 px-2 py-1 flex items-center gap-1"
              >
                {isSubmitting ? 'Sharing...' : 'Share'}
              </button>
            )}

            <button
              onClick={resetState}
              className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 min-h-[420px] max-h-[580px] flex flex-col md:flex-row overflow-y-auto">
          {/* Left Preview Box */}
          <div className="flex-1 bg-neutral-950 flex flex-col items-center justify-center p-3 relative select-none">
            <div className="w-full max-w-[360px] aspect-square rounded-xl overflow-hidden bg-neutral-900 relative shadow-inner">
              <img
                src={selectedImage}
                alt="Upload preview"
                className={`w-full h-full object-cover transition-all ${selectedFilter}`}
                style={{
                  filter: `${selectedFilter !== 'filter-normal' ? '' : ''} brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`,
                }}
              />
            </div>
          </div>

          {/* Right Controls / Sidebar */}
          <div className="w-full md:w-72 border-t md:border-t-0 md:border-l border-neutral-200 dark:border-neutral-800 p-4 flex flex-col justify-between bg-white dark:bg-[#1a1a1a]">
            {/* Step 1: Select Image */}
            {step === 'select' && (
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                    Choose photo source
                  </h3>

                  {/* Device upload button */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2.5 px-3 border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-sky-500 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold text-neutral-700 dark:text-neutral-200 mb-4 transition-colors"
                  >
                    <Upload className="w-4 h-4 text-sky-500" />
                    <span>Upload from device</span>
                  </button>

                  <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                    Or select sample shot
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {SAMPLE_PHOTOS.map(sample => (
                      <button
                        key={sample.label}
                        onClick={() => setSelectedImage(sample.url)}
                        className={`p-1 rounded-lg border text-left flex items-center gap-2 text-xs transition-colors ${
                          selectedImage === sample.url
                            ? 'border-sky-500 bg-sky-500/10 font-semibold'
                            : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
                        }`}
                      >
                        <img
                          src={sample.url}
                          alt={sample.label}
                          className="w-8 h-8 rounded object-cover"
                        />
                        <span className="truncate">{sample.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <p className="text-[11px] text-neutral-400 mt-4 leading-normal">
                  Select a photo from your gallery or choose one of our high-res presets to edit and share to your feed.
                </p>
              </div>
            )}

            {/* Step 2: Filters & Adjustments */}
            {step === 'filter' && (
              <div className="flex-1 flex flex-col overflow-y-auto pr-1">
                <div className="mb-4">
                  <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2.5">
                    Filter Presets
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {FILTERS.map(f => (
                      <button
                        key={f.name}
                        onClick={() => setSelectedFilter(f.cssClass)}
                        className={`flex flex-col items-center p-1 rounded-lg border transition-all ${
                          selectedFilter === f.cssClass
                            ? 'border-sky-500 bg-sky-500/10'
                            : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
                        }`}
                      >
                        <div className="w-12 h-12 rounded overflow-hidden mb-1">
                          <img
                            src={selectedImage}
                            alt={f.name}
                            className={`w-full h-full object-cover ${f.cssClass}`}
                          />
                        </div>
                        <span className="text-[10px] font-medium text-neutral-700 dark:text-neutral-300">
                          {f.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Adjustments */}
                <div className="space-y-3 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                  <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5" /> Adjustments
                  </h3>

                  <div>
                    <div className="flex justify-between text-[11px] text-neutral-500 mb-1">
                      <span>Brightness</span>
                      <span>{brightness}%</span>
                    </div>
                    <input
                      type="range"
                      min={60}
                      max={140}
                      value={brightness}
                      onChange={e => setBrightness(Number(e.target.value))}
                      className="w-full accent-sky-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-neutral-500 mb-1">
                      <span>Contrast</span>
                      <span>{contrast}%</span>
                    </div>
                    <input
                      type="range"
                      min={70}
                      max={150}
                      value={contrast}
                      onChange={e => setContrast(Number(e.target.value))}
                      className="w-full accent-sky-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-neutral-500 mb-1">
                      <span>Saturation</span>
                      <span>{saturation}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={180}
                      value={saturation}
                      onChange={e => setSaturation(Number(e.target.value))}
                      className="w-full accent-sky-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Caption & Details */}
            {step === 'caption' && (
              <div className="flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  {/* User info */}
                  <div className="flex items-center gap-2">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.username}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                      {currentUser.username}
                    </span>
                  </div>

                  {/* Caption Input */}
                  <textarea
                    rows={4}
                    value={caption}
                    onChange={e => setCaption(e.target.value)}
                    placeholder="Write a caption... Include #hashtags"
                    className="w-full text-xs p-2 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:border-sky-500 resize-none text-neutral-900 dark:text-neutral-100"
                  />

                  {/* Emoji Quick Picker */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {['📸', '✨', '☕️', '🌊', '🏙️', '🎨', '🤍', '🔥'].map(emoji => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => addEmoji(emoji)}
                        className="text-sm p-1 hover:scale-125 transition-transform"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>

                  {/* Location Field */}
                  <div className="flex items-center gap-2 p-2 bg-neutral-100 dark:bg-neutral-900 rounded-lg text-xs">
                    <MapPin className="w-4 h-4 text-neutral-400 shrink-0" />
                    <input
                      type="text"
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      placeholder="Add location"
                      className="w-full bg-transparent focus:outline-none text-neutral-800 dark:text-neutral-200"
                    />
                  </div>

                  {/* Also Share to Story Toggle */}
                  <label className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer text-xs">
                    <span className="text-neutral-700 dark:text-neutral-300">
                      Also share to Your Story
                    </span>
                    <input
                      type="checkbox"
                      checked={shareToStory}
                      onChange={e => setShareToStory(e.target.checked)}
                      className="rounded accent-sky-500 w-4 h-4"
                    />
                  </label>
                </div>

                <div className="pt-3">
                  <button
                    onClick={handlePublish}
                    disabled={isSubmitting}
                    className="w-full py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-sky-500/20 active:scale-95 transition-all"
                  >
                    {isSubmitting ? (
                      'Publishing to Feed...'
                    ) : (
                      <>
                        <Check className="w-4 h-4" /> Share Post
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
