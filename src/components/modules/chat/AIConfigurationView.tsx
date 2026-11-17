import React, { useState } from 'react';
import {
  Sliders,
  Save,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Info,
  ExternalLink,
  MessageSquare,
  HelpCircle,
  FileText,
  X
} from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { useAuth } from '../../../context/AuthContext';
import { Badge } from '../../common/Badge';

export const AIConfigurationView: React.FC = () => {
  const { aiConfig, updateAIConfig, chatDocuments } = useData();
  const { isAdmin } = useAuth();

  const [assistantName, setAssistantName] = useState(aiConfig.assistantName);
  const [description, setDescription] = useState(aiConfig.description);
  const [defaultResponseStyle, setDefaultResponseStyle] = useState(aiConfig.defaultResponseStyle);
  const [useThirdPerson, setUseThirdPerson] = useState(aiConfig.useThirdPerson);
  const [supportFilipino, setSupportFilipino] = useState(aiConfig.supportFilipino);
  const [showCitations, setShowCitations] = useState(aiConfig.showCitations);
  const [dailyQuestionLimit, setDailyQuestionLimit] = useState(aiConfig.dailyQuestionLimit || 20);
  const [systemPrompt, setSystemPrompt] = useState(aiConfig.systemPrompt);

  const [activePreviewTab, setActivePreviewTab] = useState<'english' | 'filipino' | 'low_confidence'>('english');
  const [selectedCitationDoc, setSelectedCitationDoc] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateAIConfig({
      assistantName,
      description,
      defaultResponseStyle,
      useThirdPerson,
      supportFilipino,
      showCitations,
      dailyQuestionLimit,
      systemPrompt
    });
  };

  const handleReset = () => {
    setAssistantName(aiConfig.assistantName);
    setDescription(aiConfig.description);
    setDefaultResponseStyle(aiConfig.defaultResponseStyle);
    setUseThirdPerson(aiConfig.useThirdPerson);
    setSupportFilipino(aiConfig.supportFilipino);
    setShowCitations(aiConfig.showCitations);
    setDailyQuestionLimit(aiConfig.dailyQuestionLimit);
    setSystemPrompt(aiConfig.systemPrompt);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Notice */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">AI Assistant Settings & Parameters</h3>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-chel-50 text-chel-700 border border-chel-200">
              Grounded Model Config
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure system prompts, response constraints, language behavior, and citation requirements.
          </p>
        </div>

        <div className="text-right text-xs text-slate-500">
          <div>Last saved: {new Date(aiConfig.lastUpdated).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</div>
          <div className="text-slate-400 text-[11px]">Updated by: {aiConfig.updatedBy}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Settings & System Prompt (7 cols) */}
        <form onSubmit={handleSave} className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
              <Sliders className="w-4 h-4 text-chel-600" />
              <span>Core Persona & Voice Parameters</span>
            </h4>

            {/* Assistant Name & Response Style */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Assistant Public Name
                </label>
                <input
                  type="text"
                  required
                  value={assistantName}
                  onChange={(e) => setAssistantName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-chel-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Default Tone & Style
                </label>
                <select
                  value={defaultResponseStyle}
                  onChange={(e) => setDefaultResponseStyle(e.target.value as any)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-chel-500 font-medium text-slate-700"
                >
                  <option value="conversational">Conversational & Accessible (Recommended)</option>
                  <option value="formal">Formal & Legalistic</option>
                  <option value="concise">Concise & Direct (Brief bullets)</option>
                </select>
              </div>
            </div>

            {/* Assistant Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Assistant Description
              </label>
              <input
                type="text"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-chel-500"
              />
            </div>

            {/* Guardrail Switches */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Official Project Guardrail Toggles
              </span>

              {/* Third Person Voice */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useThirdPerson}
                  onChange={(e) => setUseThirdPerson(e.target.checked)}
                  className="w-4 h-4 rounded text-chel-600 focus:ring-chel-500 mt-0.5"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Enforce Third-Person Institutional Voice
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Assistant answers as an institutional representative ("Rep. Diokno proposes...", "According to Rep. Diokno's speeches...") rather than speaking as Chel directly.
                  </div>
                </div>
              </label>

              {/* Filipino Support */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={supportFilipino}
                  onChange={(e) => setSupportFilipino(e.target.checked)}
                  className="w-4 h-4 rounded text-chel-600 focus:ring-chel-500 mt-0.5"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Filipino & Taglish Fluidity
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Seamlessly answers in Filipino or Taglish when questions are submitted in local languages.
                  </div>
                </div>
              </label>

              {/* Show Citations */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showCitations}
                  onChange={(e) => setShowCitations(e.target.checked)}
                  className="w-4 h-4 rounded text-chel-600 focus:ring-chel-500 mt-0.5"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Mandatory 1-3 Source Citations
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Attaches verifiable document links and excerpt citations to every substantive answer.
                  </div>
                </div>
              </label>
            </div>

            {/* Daily Usage Limit */}
            <div className="p-4 rounded-2xl bg-chel-50/50 border border-chel-100 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-chel-950">Approved Daily Question Quota</div>
                <div className="text-[11px] text-chel-800">
                  Fair-usage throttling to prevent prompt scraping.
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={5}
                  max={100}
                  value={dailyQuestionLimit}
                  onChange={(e) => setDailyQuestionLimit(Number(e.target.value))}
                  className="w-20 px-2.5 py-1 text-center font-bold text-xs bg-white border border-chel-300 rounded-lg focus:outline-none"
                />
                <span className="text-xs font-semibold text-chel-900">queries / day</span>
              </div>
            </div>

            {/* Permanent Disclosure Badge */}
            <div className="p-4 rounded-2xl bg-slate-100/80 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Mandatory Permanent AI Disclosure
              </span>
              <p className="text-xs font-semibold text-slate-700 italic">
                "{aiConfig.aiDisclosure}"
              </p>
              <p className="text-[10px] text-slate-500 mt-1">
                Appears automatically on all Chat with Chel screens and exported conversation snippets per ethics guidelines.
              </p>
            </div>
          </div>

          {/* System Prompt Editor */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-chel-600" />
                <span>Base System Prompt & Constitution</span>
              </h4>
              <span className="text-[11px] text-slate-400 font-mono">
                {systemPrompt.length} characters
              </span>
            </div>

            <textarea
              rows={11}
              required
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="w-full p-4 font-mono text-xs bg-slate-900 text-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-chel-500 leading-relaxed resize-y"
            />

            {isAdmin && (
              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Changes</span>
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-chel-600 hover:bg-chel-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Configuration</span>
                </button>
              </div>
            )}
          </div>
        </form>

        {/* Right Preview: Interactive Live Response Simulation (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-chel-600" />
                <h4 className="text-sm font-bold text-slate-900">Assistant Response Preview</h4>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Simulated Output
              </span>
            </div>

            {/* Preview Scenario Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold my-4">
              <button
                type="button"
                onClick={() => setActivePreviewTab('english')}
                className={`flex-1 py-1.5 rounded-lg text-center transition-colors ${
                  activePreviewTab === 'english' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
                }`}
              >
                English Citation
              </button>
              <button
                type="button"
                onClick={() => setActivePreviewTab('filipino')}
                className={`flex-1 py-1.5 rounded-lg text-center transition-colors ${
                  activePreviewTab === 'filipino' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
                }`}
              >
                Taglish Response
              </button>
              <button
                type="button"
                onClick={() => setActivePreviewTab('low_confidence')}
                className={`flex-1 py-1.5 rounded-lg text-center transition-colors ${
                  activePreviewTab === 'low_confidence' ? 'bg-white text-amber-800 shadow-2xs font-bold' : 'text-slate-600'
                }`}
              >
                Low Confidence
              </button>
            </div>

            {/* Chat Container Preview */}
            <div className="space-y-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200 min-h-[380px]">
              {/* English Scenario */}
              {activePreviewTab === 'english' && (
                <>
                  <div className="flex items-start gap-2 justify-end">
                    <div className="p-3 bg-chel-600 text-white rounded-2xl rounded-tr-xs max-w-[85%] font-medium">
                      What is Rep. Chel Diokno's position on court trial delays?
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-chel-700 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                      CD
                    </div>
                    <div className="p-3.5 bg-white border border-slate-200 rounded-2xl rounded-tl-xs max-w-[90%] space-y-2.5 text-slate-800">
                      <p className="leading-relaxed">
                        According to <strong>House Bill No. 8920</strong> (Judicial Efficiency and Speedy Trial Act) authored by Rep. Chel Diokno, his legislative position centers on addressing docket congestion through:
                      </p>
                      <ul className="list-disc pl-4 space-y-1 text-slate-700">
                        <li>Mandatory computerized docket systems across trial courts.</li>
                        <li>Strict continuous trial calendars and trial timeline caps.</li>
                        <li>Subsidized legal transcription for indigent litigants.</li>
                      </ul>

                      {/* Clickable Citation Chips */}
                      {showCitations && (
                        <div className="pt-2 border-t border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                            Verified Sources:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            <span
                              onClick={() => setSelectedCitationDoc('HB_8920')}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-chel-50 text-chel-700 border border-chel-200 hover:bg-chel-100 cursor-pointer text-[11px] font-medium transition-colors"
                            >
                              <FileText className="w-3 h-3" />
                              <span>HB 8920 §4 (Speedy Trial Act)</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="text-[10px] text-slate-400 italic pt-1">
                        {aiConfig.aiDisclosure}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Filipino Scenario */}
              {activePreviewTab === 'filipino' && (
                <>
                  <div className="flex items-start gap-2 justify-end">
                    <div className="p-3 bg-chel-600 text-white rounded-2xl rounded-tr-xs max-w-[85%] font-medium">
                      Bakit tutol si Chel Diokno sa pagkakakulong dahil sa libel?
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-chel-700 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                      CD
                    </div>
                    <div className="p-3.5 bg-white border border-slate-200 rounded-2xl rounded-tl-xs max-w-[90%] space-y-2.5 text-slate-800">
                      <p className="leading-relaxed">
                        Ayon sa talumpati ni Rep. Chel Diokno sa UP College of Law, isinusulong niya ang <em>decriminalization of libel</em> dahil:
                      </p>
                      <p className="leading-relaxed text-slate-700">
                        1. Madalas ginagamit ang criminal libel bilang sandata para patahimikin ang mga grassroots at community journalists sa mga probinsya.<br />
                        2. Ayon sa UN Human Rights Committee, labag sa international human rights law ang labis na parusang kulong para sa pamamahayag.<br />
                        3. Sapat na ang civil damages para panagutin ang totoong paninirang-puri.
                      </p>

                      {showCitations && (
                        <div className="pt-2 border-t border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                            Pinagkunan:
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-chel-50 text-chel-700 border border-chel-200 text-[11px] font-medium">
                            <FileText className="w-3 h-3" />
                            <span>UP Law Cyber Libel Keynote 2025</span>
                          </span>
                        </div>
                      )}

                      <div className="text-[10px] text-slate-400 italic pt-1">
                        {aiConfig.aiDisclosure}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Low Confidence Scenario */}
              {activePreviewTab === 'low_confidence' && (
                <>
                  <div className="flex items-start gap-2 justify-end">
                    <div className="p-3 bg-chel-600 text-white rounded-2xl rounded-tr-xs max-w-[85%] font-medium">
                      Ano ang pananaw ni Chel Diokno sa bagong cryptocurrency tax bill?
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                      CD
                    </div>
                    <div className="p-3.5 bg-white border border-amber-200 rounded-2xl rounded-tl-xs max-w-[90%] space-y-2 text-slate-800">
                      <div className="flex items-center gap-1.5 text-amber-700 font-bold text-xs">
                        <Info className="w-4 h-4" />
                        <span>Not in Approved Public Record</span>
                      </div>
                      <p className="text-slate-600 leading-relaxed text-[11.5px]">
                        Ang partikular na paksa ukol sa cryptocurrency taxation ay <strong>wala pa sa kasalukuyang naaprubahang public knowledge base</strong> ni Rep. Chel Diokno.
                      </p>
                      <div className="pt-2 border-t border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          Maaari mong itanong:
                        </span>
                        <div className="space-y-1 text-chel-600 text-[11px] font-medium">
                          <div className="hover:underline cursor-pointer">• Digital Privacy & Freedom of Speech</div>
                          <div className="hover:underline cursor-pointer">• Budget Transparency & Public Accountability</div>
                          <div className="hover:underline cursor-pointer">• Katarungang Pambarangay Modernization</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {selectedCitationDoc && (
              <div className="mt-4 p-3 bg-slate-100 rounded-xl text-xs text-slate-600 flex items-center justify-between animate-fade-in">
                <span>Selected Source: <strong>HB 8920 (Judicial Efficiency Act)</strong></span>
                <button
                  type="button"
                  onClick={() => setSelectedCitationDoc(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
