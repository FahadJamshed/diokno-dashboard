import React, { useState } from 'react';
import { X, Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { DocumentFileType } from '../../../types';
import { useData } from '../../../context/DataContext';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({ isOpen, onClose }) => {
  const { uploadChatDocument } = useData();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fileType, setFileType] = useState<DocumentFileType>('pdf');
  const [source, setSource] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(1500000);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setFileName(file.name);
      setFileSize(file.size);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '));
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      setFileSize(file.size);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !source.trim()) return;

    const chosenFileName = fileName || `${title.replace(/\s+/g, '_')}.${fileType === 'webpage' ? 'html' : fileType}`;

    setIsUploading(true);
    setUploadProgress(15);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 25;
      });
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);

      uploadChatDocument({
        title: title.trim(),
        description: description.trim() || 'Official public document uploaded to knowledge base.',
        fileType,
        fileName: chosenFileName,
        fileSize,
        source: source.trim(),
        uploadedBy: 'Administrator'
      });

      setIsUploading(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Upload Knowledge Document</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Approved public speeches, bills, statements, and transcripts for Chat with Chel.
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isUploading}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Drag & Drop Area */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
              dragActive
                ? 'border-chel-500 bg-chel-50/50'
                : fileName
                ? 'border-emerald-300 bg-emerald-50/30'
                : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'
            }`}
          >
            {fileName ? (
              <div className="flex items-center justify-center gap-3 text-left">
                <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 truncate max-w-xs">{fileName}</div>
                  <div className="text-[11px] text-slate-500">{(fileSize / 1024).toFixed(1)} KB • Ready for upload</div>
                </div>
              </div>
            ) : (
              <div>
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <div className="text-xs font-semibold text-slate-700">
                  Drag and drop document here, or{' '}
                  <label className="text-chel-600 hover:underline cursor-pointer">
                    browse files
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.docx,.doc,.txt"
                      onChange={handleFileSelect}
                    />
                  </label>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Supported: PDF, Word (DOCX), Transcripts (.txt), Webpages</p>
              </div>
            )}
          </div>

          {/* Document Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Document Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. House Bill No. 8920: Judicial Efficiency Act of 2025"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-chel-500"
            />
          </div>

          {/* File Type & Source */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Source Format <span className="text-rose-500">*</span>
              </label>
              <select
                value={fileType}
                onChange={(e) => setFileType(e.target.value as DocumentFileType)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-chel-500"
              >
                <option value="pdf">PDF Document (.pdf)</option>
                <option value="docx">Word Document (.docx)</option>
                <option value="transcript">Speech / Hearing Transcript (.txt)</option>
                <option value="webpage">Official Webpage / Statement Link</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Official Source <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. House Legislative Archives / UP Law Center"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-chel-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Summary & Context</label>
            <textarea
              rows={2}
              placeholder="Brief summary of document topics and scope for citations..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-chel-500 resize-none"
            />
          </div>

          {/* Notice: Approval workflow mandatory */}
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Mandatory Approval Rule:</span> Uploaded documents enter{' '}
              <span className="font-semibold">Pending Approval</span> and are not accessible to the AI assistant
              until explicitly reviewed and approved by an Administrator.
            </div>
          </div>

          {/* Progress bar when uploading */}
          {isUploading && (
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs font-semibold text-slate-600">
                <span>Uploading and extracting metadata...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-chel-600 h-2 rounded-full transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading || !title.trim() || !source.trim()}
              className="px-5 py-2 bg-chel-600 hover:bg-chel-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
            >
              {isUploading ? 'Uploading...' : 'Upload Document'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
