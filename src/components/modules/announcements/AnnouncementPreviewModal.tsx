import React, { useState } from 'react';
import { X, Smartphone, Monitor, Pin, ExternalLink, Calendar, Heart, Share2, MessageCircle } from 'lucide-react';
import { Announcement } from '../../../types';

interface AnnouncementPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  announcement: Partial<Announcement> | null;
}

export const AnnouncementPreviewModal: React.FC<AnnouncementPreviewModalProps> = ({
  isOpen,
  onClose,
  announcement
}) => {
  const [device, setDevice] = useState<'mobile' | 'desktop'>('mobile');

  if (!isOpen || !announcement) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-slate-900">Announcement Live Preview</h3>
            {/* Device Switcher */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setDevice('mobile')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-colors ${
                  device === 'mobile' ? 'bg-white text-chel-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile App</span>
              </button>
              <button
                onClick={() => setDevice('desktop')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-colors ${
                  device === 'desktop' ? 'bg-white text-chel-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Web Portal</span>
              </button>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preview Frame */}
        <div className="py-6 flex justify-center bg-slate-100/70 rounded-2xl p-4 my-4">
          {device === 'mobile' ? (
            /* Mobile iPhone Simulation */
            <div className="w-[340px] bg-white rounded-[36px] shadow-xl border-4 border-slate-800 overflow-hidden flex flex-col">
              {/* Phone Status Bar */}
              <div className="h-6 bg-slate-900 text-white text-[10px] px-6 flex items-center justify-between font-mono">
                <span>9:41</span>
                <div className="w-16 h-3 bg-slate-800 rounded-full" />
                <span>5G 100%</span>
              </div>

              {/* Mobile App Header */}
              <div className="p-3 bg-white border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-chel-600 text-white text-[10px] font-black flex items-center justify-center">
                    CD
                  </div>
                  <span className="text-xs font-bold text-slate-900">Diokno Volunteer</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-chel-50 text-chel-700 font-semibold">
                  Official Feed
                </span>
              </div>

              {/* Mobile Card Content */}
              <div className="p-4 space-y-3 max-h-[460px] overflow-y-auto">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-chel-50 text-chel-700 uppercase">
                    {announcement.category}
                  </span>
                  {announcement.isPinned && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      <Pin className="w-3 h-3" /> Pinned
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                  {announcement.title}
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                  {announcement.content}
                </p>

                {/* Images */}
                {announcement.images && announcement.images.length > 0 && (
                  <div
                    className={`grid gap-1 rounded-2xl overflow-hidden ${
                      announcement.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
                    }`}
                  >
                    {announcement.images.map((img, idx) => (
                      <img key={idx} src={img} alt="" className="w-full h-32 object-cover" />
                    ))}
                  </div>
                )}

                {/* Link Preview Card */}
                {announcement.externalLink && (
                  <a
                    href={announcement.externalLink}
                    target="_blank"
                    rel="noreferrer"
                    className="block p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors"
                  >
                    <div className="text-[10px] uppercase font-bold text-chel-600 flex items-center gap-1">
                      <span>Article Link</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </div>
                    <div className="text-xs font-bold text-slate-800 truncate mt-0.5">
                      {announcement.title}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">{announcement.externalLink}</div>
                  </a>
                )}

                {/* Mock Reactions */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-slate-400 text-xs">
                  <span className="flex items-center gap-1 hover:text-rose-500 cursor-pointer">
                    <Heart className="w-3.5 h-3.5" /> 184
                  </span>
                  <span className="flex items-center gap-1 hover:text-chel-600 cursor-pointer">
                    <MessageCircle className="w-3.5 h-3.5" /> 32
                  </span>
                  <span className="flex items-center gap-1 hover:text-slate-600 cursor-pointer">
                    <Share2 className="w-3.5 h-3.5" /> Share
                  </span>
                </div>
              </div>

              {/* Bottom Phone Bar */}
              <div className="h-4 bg-white flex justify-center items-center pb-2">
                <div className="w-24 h-1 bg-slate-300 rounded-full" />
              </div>
            </div>
          ) : (
            /* Desktop Web Card Preview */
            <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg border border-slate-200 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-chel-50 text-chel-700">
                    {announcement.category}
                  </span>
                  {announcement.isPinned && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                      <Pin className="w-3 h-3" /> Pinned Announcement
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-400">Published Today</span>
              </div>

              <h3 className="text-lg font-bold text-slate-900">{announcement.title}</h3>

              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {announcement.content}
              </p>

              {announcement.images && announcement.images.length > 0 && (
                <div
                  className={`grid gap-2 rounded-2xl overflow-hidden ${
                    announcement.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
                  }`}
                >
                  {announcement.images.map((img, idx) => (
                    <img key={idx} src={img} alt="" className="w-full h-44 object-cover" />
                  ))}
                </div>
              )}

              {announcement.externalLink && (
                <a
                  href={announcement.externalLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-800">{announcement.title}</div>
                    <div className="text-xs text-chel-600 truncate">{announcement.externalLink}</div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                </a>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};

