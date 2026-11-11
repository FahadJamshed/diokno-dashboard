import React, { useState } from 'react';
import {
  X,
  Compass,
  ArrowRight,
  Shield,
  Megaphone,
  Calendar,
  Trophy,
  MessageSquare,
  Users,
  Bell,
  ClipboardList,
  BarChart3,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { NavModule } from './Sidebar';

interface WorkflowGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (module: NavModule) => void;
}

interface WorkflowItem {
  id: string;
  letter: string;
  title: string;
  module: NavModule;
  description: string;
  steps: string[];
  role: 'admin' | 'moderator' | 'both';
}

export const WorkflowGuideModal: React.FC<WorkflowGuideModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowItem | null>(null);

  if (!isOpen) return null;

  const workflows: WorkflowItem[] = [
    {
      id: 'wf-a',
      letter: 'A',
      title: 'Admin & Moderator Authentication',
      module: 'dashboard',
      description: 'Mandatory two-factor authentication, device remembering, and role-specific dashboard routing.',
      steps: [
        'Open Login screen (Screen 01)',
        'Click "Admin Demo" or "Moderator Demo" for instant credential fill',
        'Submit to advance to Mandatory 2FA verification (Screen 02)',
        'Enter 6-digit TOTP code (or click "Fill Valid 246810")',
        'Console authenticates and loads role-tailored sidebar navigation'
      ],
      role: 'both'
    },
    {
      id: 'wf-b',
      letter: 'B',
      title: 'Publish Official Announcement',
      module: 'announcements',
      description: 'Broadcast statements, legislative updates, and mobilize volunteers with pinned priority.',
      steps: [
        'Navigate to Announcements module',
        'Click "+ Create Announcement"',
        'Fill title, select category (Social Media, Legislative Updates, Volunteer Events)',
        'Attach up to 4 photos and external press release link',
        'Enforce maximum 3 pinned announcements policy',
        'Preview how it looks on mobile app vs desktop web portal',
        'Choose "Publish Now" with optional push notification, or schedule for later'
      ],
      role: 'admin'
    },
    {
      id: 'wf-c',
      letter: 'C',
      title: 'Create Event & On-Site Attendance',
      module: 'events',
      description: 'Coordinate townhalls, free legal clinics, and verify attendee arrivals with QR scanners.',
      steps: [
        'Open Events module to view active rallies and consultations',
        'Click "+ Create Event" and specify venue, date, and capacity limit',
        'Publish event for mobile app volunteers to RSVP',
        'Open event details to monitor capacity fill rate',
        'Use on-site QR Code Scanner or quick pass verification tool to check in attendees',
        'Export attendee roster to CSV for field records'
      ],
      role: 'both'
    },
    {
      id: 'wf-d',
      letter: 'D',
      title: 'Manage Monthly CHELlenge & Proofs',
      module: 'challenges',
      description: 'Monthly volunteer sprint with 3–10 civic tasks, proof verification, and confirmed badges.',
      steps: [
        'Open CHELlenges module',
        'Enforce one active challenge per month with 3–10 tasks builder',
        'Open the dedicated "Proof Review Queue" tab',
        'Inspect volunteer evidence (voter registration screenshots, clean-up photos, video links)',
        'Click "Approve" to confer confirmed monthly badges, or "Reject" with mandatory feedback reason',
        'Use bulk-approve to process batches of submissions at once'
      ],
      role: 'both'
    },
    {
      id: 'wf-e',
      letter: 'E',
      title: 'Moderate Community & Incidents',
      module: 'community',
      description: 'Maintain respectful civic dialogue and resolve flagged harassment or profanity.',
      steps: [
        'Open Community module "Report Queue" tab',
        'Inspect flagged posts, context snippet, and reported user details',
        'Select moderation action: Remove Post, Lock Thread, Warn User, Mute 24h/7d, or Ban Account',
        'Action is automatically logged immutably into the central Audit Trail',
        'Manage keyword blocklist with English and Filipino profanity tags'
      ],
      role: 'both'
    },
    {
      id: 'wf-f',
      letter: 'F',
      title: 'Manage Volunteers & Roles',
      module: 'users',
      description: 'Volunteer directory, moderator applications, role transitions, and Data Privacy Act compliance.',
      steps: [
        'Open Users module and search volunteers across 17 Philippine regions',
        'Inspect volunteer profile, event attendance count, and earned badges',
        'Promote volunteer to Moderator with immediate backend privilege enforcement',
        'Approve pending regional moderator applications',
        'Process and purge user data upon verified account deletion requests'
      ],
      role: 'admin'
    },
    {
      id: 'wf-g',
      letter: 'G',
      title: 'Send Push Notifications',
      module: 'notifications',
      description: 'Segmented push broadcasts across FCM and APNs with Manila quiet hours enforcement.',
      steps: [
        'Open Notifications module (Administrator only)',
        'Click "+ Compose Push Notification"',
        'Target audience: Everyone, Verified Members, Specific Province, or Event RSVPs',
        'System automatically checks and warns if scheduled during Manila Quiet Hours (10 PM – 7 AM PHT)',
        'Inspect live iOS & Android lock screen push banner preview',
        'Dispatch notification and track delivery statistics and open rates'
      ],
      role: 'admin'
    },
    {
      id: 'wf-h',
      letter: 'H',
      title: 'Review Administrative Audit Trail',
      module: 'audit',
      description: 'Immutable, cryptographically logged administrative history with before/after diffs.',
      steps: [
        'Open Audit Log module',
        'Filter by staff member, role, or action category',
        'Click "View Diff" to inspect previous values vs updated values',
        'Export audit logs to CSV for transparency compliance'
      ],
      role: 'both'
    },
    {
      id: 'wf-i',
      letter: 'I',
      title: 'Generate Reports & Analytics',
      module: 'reports',
      description: 'Civic engagement metrics, regional demographic distribution, and multi-format exports.',
      steps: [
        'Open Reports & Analytics module',
        'Filter by date range (30D, 90D, YTD) or province',
        'Review regional volunteer breakdown (NCR, Cebu, Iloilo, Central Luzon, etc.)',
        'Export data instantly via CSV spreadsheet or clean printable PDF report'
      ],
      role: 'admin'
    }
  ];

  const currentWf = selectedWorkflow || workflows[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-chel-50 text-chel-600 border border-chel-200">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Interactive Workflows Guide</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Explore the 9 key end-to-end administrative and moderation workflows
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Layout */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Workflows List (Left 1 Col) */}
          <div className="space-y-1.5 max-h-[55vh] overflow-y-auto pr-1">
            {workflows.map((wf) => (
              <button
                key={wf.id}
                onClick={() => setSelectedWorkflow(wf)}
                className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between group ${
                  currentWf.id === wf.id
                    ? 'bg-chel-50 border-chel-300 shadow-2xs'
                    : 'bg-slate-50/60 hover:bg-slate-100 border-slate-200/70'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`w-6 h-6 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 ${
                      currentWf.id === wf.id
                        ? 'bg-chel-600 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {wf.letter}
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 truncate">{wf.title}</div>
                    <div className="text-[10px] text-slate-500 capitalize">{wf.module}</div>
                  </div>
                </div>
                <ArrowRight
                  className={`w-4 h-4 shrink-0 transition-transform ${
                    currentWf.id === wf.id
                      ? 'text-chel-600 translate-x-0.5'
                      : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Workflow Details (Right 2 Cols) */}
          <div className="md:col-span-2 p-5 bg-slate-50 rounded-3xl border border-slate-200/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-chel-100 text-chel-800 uppercase">
                  Workflow {currentWf.letter}
                </span>
                <span className="text-[11px] font-semibold text-slate-500 capitalize">
                  Required Role: <span className="font-bold text-slate-800">{currentWf.role}</span>
                </span>
              </div>

              <h4 className="text-base font-bold text-slate-900 mb-1">{currentWf.title}</h4>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">{currentWf.description}</p>

              <div className="space-y-2">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Step-by-Step Implementation:
                </div>
                {currentWf.steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">Target Module: {currentWf.module}</span>
              <button
                onClick={() => {
                  onNavigate(currentWf.module);
                  onClose();
                }}
                className="px-4 py-2 bg-chel-600 hover:bg-chel-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <span>Jump to {currentWf.module.toUpperCase()}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-4 mt-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-xs font-semibold"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};

