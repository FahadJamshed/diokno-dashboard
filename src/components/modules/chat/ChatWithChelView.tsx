import React, { useState } from 'react';
import {
  Bot,
  BookOpen,
  Sliders,
  ShieldAlert,
  Flag,
  Rocket,
  Sparkles,
  Info
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useData } from '../../../context/DataContext';
import { DocumentLibrary } from './DocumentLibrary';
import { AIConfigurationView } from './AIConfigurationView';
import { DeclinedTopicsView } from './DeclinedTopicsView';
import { FlaggedConversationsView } from './FlaggedConversationsView';
import { PilotAndEvaluationView } from './PilotAndEvaluationView';

export type ChatTab = 'library' | 'config' | 'declined' | 'flagged' | 'pilot';

export const ChatWithChelView: React.FC = () => {
  const { isSuperAdmin, isAdmin } = useAuth();
  const { chatDocuments, chatConversations, pilotAccess, evaluationSummary } = useData();

  const [activeTab, setActiveTab] = useState<ChatTab>('library');

  const pendingDocsCount = chatDocuments.filter((d) => d.approvalStatus === 'pending_approval').length;
  const flaggedConvCount = chatConversations.filter((c) => !!c.flagReason).length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-xs shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Chat with Chel</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wider">
                  AI-01 — AI-15
                </span>
                {pilotAccess.memberGeneralRelease ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Live: General Release
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    Pilot Access Only (Jan 2027)
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Official RAG Knowledge Base, System Guardrails, Declined Topics, Quality Evaluation, and Flagged Inquiries.
              </p>
            </div>
          </div>
        </div>

        {/* Global Stats Pill */}
        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-200/80 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-white shadow-2xs border border-slate-100 flex items-center gap-2">
            <span className="text-slate-400 font-medium">Benchmark:</span>
            <span className="font-bold text-slate-800">{evaluationSummary.passRate}% Pass</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-white shadow-2xs border border-slate-100 flex items-center gap-2">
            <span className="text-slate-400 font-medium">Release Sign-off:</span>
            <span className={`font-bold ${evaluationSummary.signOffStatus === 'signed_off' ? 'text-emerald-600' : 'text-amber-600'}`}>
              {evaluationSummary.signOffStatus === 'signed_off' ? 'Signed Off' : 'Pending'}
            </span>
          </div>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 text-xs font-bold">
        <button
          onClick={() => setActiveTab('library')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all shrink-0 ${
            activeTab === 'library'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Knowledge Library & Approvals</span>
          {pendingDocsCount > 0 && (
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                activeTab === 'library' ? 'bg-white text-indigo-700' : 'bg-rose-500 text-white'
              }`}
            >
              {pendingDocsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('config')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all shrink-0 ${
            activeTab === 'config'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>AI Persona & System Prompt</span>
        </button>

        <button
          onClick={() => setActiveTab('declined')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all shrink-0 ${
            activeTab === 'declined'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Declined Topics (8 Safety Categories)</span>
        </button>

        <button
          onClick={() => setActiveTab('flagged')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all shrink-0 ${
            activeTab === 'flagged'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Flag className="w-4 h-4" />
          <span>Flagged Inquiries & Citations</span>
          {flaggedConvCount > 0 && (
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                activeTab === 'flagged' ? 'bg-white text-indigo-700' : 'bg-amber-500 text-white'
              }`}
            >
              {flaggedConvCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('pilot')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all shrink-0 ${
            activeTab === 'pilot'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Rocket className="w-4 h-4" />
          <span>Pilot Rollout & Benchmark Suite</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="transition-all duration-150">
        {activeTab === 'library' && <DocumentLibrary />}
        {activeTab === 'config' && <AIConfigurationView />}
        {activeTab === 'declined' && <DeclinedTopicsView />}
        {activeTab === 'flagged' && <FlaggedConversationsView />}
        {activeTab === 'pilot' && <PilotAndEvaluationView />}
      </div>
    </div>
  );
};
