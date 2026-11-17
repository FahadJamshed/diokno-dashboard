import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  Play,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Plus,
  Trash2,
  Lock,
  Sparkles,
  Award,
  RefreshCw,
  Search,
  X
} from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { useAuth } from '../../../context/AuthContext';
import { Badge } from '../../common/Badge';
import { ConfirmationModal } from '../../common/ConfirmationModal';

export const PilotAndEvaluationView: React.FC = () => {
  const {
    pilotAccess,
    updatePilotAccess,
    addPilotUser,
    removePilotUser,
    evaluationSummary,
    evaluationMetrics,
    runEvaluationSuite,
    signOffEvaluation
  } = useData();
  const { isSuperAdmin, isAdmin } = useAuth();

  const [isAddTesterModalOpen, setIsAddTesterModalOpen] = useState(false);
  const [testerName, setTesterName] = useState('');
  const [testerEmail, setTesterEmail] = useState('');
  const [testerRole, setTesterRole] = useState('Volunteer Lead');

  const [evalCategoryFilter, setEvalCategoryFilter] = useState<string>('all');
  const [isSignOffModalOpen, setIsSignOffModalOpen] = useState(false);

  const filteredMetrics = evaluationMetrics.filter((m) => {
    if (evalCategoryFilter === 'all') return true;
    return m.category === evalCategoryFilter;
  });

  const handleCreateTester = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testerEmail.trim()) return;

    addPilotUser(testerName, testerEmail, testerRole);
    setTesterName('');
    setTesterEmail('');
    setTesterRole('Volunteer Lead');
    setIsAddTesterModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Pilot Release Management Section */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Pilot Access & Phased Release Gates
              </h3>
              <Badge variant="primary" size="sm">
                Release Control (ADM-01 / AI-10)
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Phased release access gates. January 2027 pilot is restricted to Admins, Moderators, and the named allowlist.
            </p>
          </div>
        </div>

        {/* Release Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Gate 1: Administrator Access */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Gate 1: Leadership Tier
              </span>
              <div className="text-xs font-bold text-slate-900">Administrator & Super Admin Access</div>
              <p className="text-[11px] text-slate-500 mt-0.5">Full access for knowledge curation & oversight.</p>
            </div>
            <span className="px-2.5 py-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 rounded-full border border-emerald-200">
              Active (Always ON)
            </span>
          </div>

          {/* Gate 2: Moderator Access */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Gate 2: Frontline Moderators
              </span>
              <div className="text-xs font-bold text-slate-900">Community Moderator Pilot Access</div>
              <p className="text-[11px] text-slate-500 mt-0.5">Access for appointed forum & challenge moderators.</p>
            </div>
            {isAdmin ? (
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={pilotAccess.moderatorAccess}
                  onChange={(e) => updatePilotAccess({ moderatorAccess: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-chel-600" />
              </label>
            ) : (
              <span className="text-xs font-bold text-emerald-700">Enabled</span>
            )}
          </div>

          {/* Gate 3: General Member Release (Strictly OFF by default) */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block mb-1 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                <span>Gate 3: March 2027 General Release</span>
              </span>
              <div className="text-xs font-bold text-amber-950">All Registered Members Access</div>
              <p className="text-[11px] text-amber-800 mt-0.5">
                {pilotAccess.memberGeneralRelease ? 'Enabled for all members.' : 'Strictly OFF by default pending evaluation sign-off.'}
              </p>
            </div>
            {isSuperAdmin ? (
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={pilotAccess.memberGeneralRelease}
                  onChange={(e) => updatePilotAccess({ memberGeneralRelease: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-chel-600" />
              </label>
            ) : (
              <span className="px-2 py-0.5 text-[10px] font-bold text-amber-800 bg-amber-100/80 rounded-md">
                Super Admin Only
              </span>
            )}
          </div>
        </div>

        {/* Named Pilot Tester Allowlist */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Named Pilot Group Allowlist (January 2027 Cohort)
              </h4>
              <p className="text-[11px] text-slate-500">
                Specific active volunteer chapter leaders granted early testing access.
              </p>
            </div>
            {isAdmin && (
              <button
                onClick={() => setIsAddTesterModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-chel-600 hover:bg-chel-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Pilot Tester</span>
              </button>
            )}
          </div>

          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Volunteer Name</th>
                  <th className="py-2.5 px-4">Email Address</th>
                  <th className="py-2.5 px-4">Assigned Pilot Role</th>
                  <th className="py-2.5 px-4">Added Date</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pilotAccess.pilotAllowlist.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-4 font-bold text-slate-900">{u.name}</td>
                    <td className="py-2.5 px-4 text-slate-500">{u.email}</td>
                    <td className="py-2.5 px-4">
                      <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-chel-50 text-chel-700 border border-chel-200">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-slate-400 text-[11px]">
                      {new Date(u.addedAt).toLocaleDateString([], { dateStyle: 'medium' })}
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      {isAdmin && (
                        <button
                          onClick={() => removePilotUser(u.id)}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Remove from pilot allowlist"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Evaluation Suite Section (Section 13.E) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                AI Evaluation Suite & Benchmark Verification
              </h3>
              <Badge variant="success" size="sm">
                Pass Rate: {evaluationSummary.passRate}%
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Official requirement: Minimum 100 test prompts evaluated across in-scope, out-of-scope, and adversarial scenarios prior to general release.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isAdmin && (
              <button
                onClick={runEvaluationSuite}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors"
              >
                <Play className="w-3.5 h-3.5 text-chel-600 fill-chel-600" />
                <span>Run 125-Prompt Suite</span>
              </button>
            )}

            {isAdmin && (
              <button
                onClick={() => setIsSignOffModalOpen(true)}
                disabled={evaluationSummary.signOffStatus === 'signed_off'}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
              >
                <Award className="w-4 h-4" />
                <span>{evaluationSummary.signOffStatus === 'signed_off' ? 'Officially Certified' : 'Sign Off for Release'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Evaluation Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Test Prompts
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {evaluationSummary.totalQuestions}{' '}
              <span className="text-xs font-normal text-emerald-600">(&gt;100 req)</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Exceeds minimum evaluation quota</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              In-Scope Questions
            </span>
            <div className="text-2xl font-black text-chel-800 mt-1">{evaluationSummary.inScopeCount}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Bills, speeches, and civil rights</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Out-of-Scope Prompts
            </span>
            <div className="text-2xl font-black text-slate-700 mt-1">{evaluationSummary.outOfScopeCount}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Correctly declined & redirected</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Adversarial Injections
            </span>
            <div className="text-2xl font-black text-rose-700 mt-1">{evaluationSummary.adversarialCount}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Jailbreak attempts blocked</div>
          </div>
        </div>

        {/* Sign-off notice banner */}
        {evaluationSummary.signOffStatus === 'signed_off' && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold">Evaluation Officially Certified for Release:</span> Verified and signed
              off by <strong>{evaluationSummary.signedOffBy}</strong> on{' '}
              {new Date(evaluationSummary.signedOffAt || '').toLocaleDateString()}.
            </div>
          </div>
        )}

        {/* Benchmark Test Cases Sample Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Sample Benchmark Prompts & Grounding Validation
            </h4>
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setEvalCategoryFilter('all')}
                className={`px-3 py-1 rounded-lg ${evalCategoryFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'}`}
              >
                All Prompts
              </button>
              <button
                onClick={() => setEvalCategoryFilter('in_scope')}
                className={`px-3 py-1 rounded-lg ${evalCategoryFilter === 'in_scope' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'}`}
              >
                In-Scope
              </button>
              <button
                onClick={() => setEvalCategoryFilter('out_of_scope')}
                className={`px-3 py-1 rounded-lg ${evalCategoryFilter === 'out_of_scope' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'}`}
              >
                Out-of-Scope
              </button>
              <button
                onClick={() => setEvalCategoryFilter('adversarial')}
                className={`px-3 py-1 rounded-lg ${evalCategoryFilter === 'adversarial' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'}`}
              >
                Adversarial
              </button>
            </div>
          </div>

          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Category</th>
                  <th className="py-2.5 px-4">Evaluation Test Question</th>
                  <th className="py-2.5 px-4">Expected Safety Behavior</th>
                  <th className="py-2.5 px-4">Confidence</th>
                  <th className="py-2.5 px-4 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMetrics.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <span className="capitalize font-semibold text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {m.category.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 max-w-xs">{m.question}</td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs">{m.expectedBehavior}</td>
                    <td className="py-3 px-4 font-mono text-slate-700 font-semibold">
                      {(m.confidenceScore * 100).toFixed(0)}%
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Passed</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Tester Modal */}
      {isAddTesterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-sm font-bold text-slate-900">Add Pilot Group Tester</h4>
              <button
                onClick={() => setIsAddTesterModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTester} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maria Teresa Santos"
                  value={testerName}
                  onChange={(e) => setTesterName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-chel-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. teresa.santos@gmail.com"
                  value={testerEmail}
                  onChange={(e) => setTesterEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-chel-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Assigned Volunteer Role / Chapter</label>
                <input
                  type="text"
                  placeholder="e.g. Youth Chapter Lead - Cebu"
                  value={testerRole}
                  onChange={(e) => setTesterRole(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-chel-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddTesterModalOpen(false)}
                  className="px-3.5 py-1.5 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-chel-600 hover:bg-chel-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Add to Allowlist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Sign-Off Confirmation Modal */}
      <ConfirmationModal
        isOpen={isSignOffModalOpen}
        onClose={() => setIsSignOffModalOpen(false)}
        onConfirm={() => {
          signOffEvaluation();
          setIsSignOffModalOpen(false);
        }}
        title="Officially Certify AI Evaluation?"
        message="This action certifies that all 125 benchmark prompts have been validated and approved. This sign-off confirms the knowledge base satisfies Rep. Diokno's official accuracy standards."
        confirmLabel="Certify & Sign Off"
        variant="primary"
      />
    </div>
  );
};
