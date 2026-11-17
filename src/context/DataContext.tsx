import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  User,
  Announcement,
  Event,
  EventAttendee,
  Challenge,
  ChallengeProof,
  ForumTopic,
  CommunityReport,
  KeywordBlockItem,
  NotificationItem,
  AuditLog,
  AppSettings,
  UserRole,
  ChatDocument,
  ChatConversation,
  DeclinedTopic,
  AIConfiguration,
  RoleDefinition,
  PilotAccessSettings,
  EvaluationMetric,
  EvaluationSummary,
  ModeratorPermission
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_EVENTS,
  INITIAL_EVENT_ATTENDEES,
  INITIAL_CHALLENGES,
  INITIAL_CHALLENGE_PROOFS,
  INITIAL_FORUM_TOPICS,
  INITIAL_COMMUNITY_REPORTS,
  INITIAL_KEYWORD_BLOCKLIST,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_APP_SETTINGS,
  INITIAL_CHAT_DOCUMENTS,
  INITIAL_CHAT_CONVERSATIONS,
  INITIAL_DECLINED_TOPICS,
  INITIAL_AI_CONFIG,
  INITIAL_ROLE_DEFINITIONS,
  INITIAL_PILOT_ACCESS,
  INITIAL_EVALUATION_METRICS,
  INITIAL_EVALUATION_SUMMARY
} from '../data/mockData';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface DataContextType {
  // Announcements
  announcements: Announcement[];
  createAnnouncement: (announcement: Omit<Announcement, 'id' | 'createdAt' | 'authorName' | 'authorId' | 'viewCount'>) => { success: boolean; error?: string };
  updateAnnouncement: (id: string, updates: Partial<Announcement>) => { success: boolean; error?: string };
  deleteAnnouncement: (id: string) => void;
  togglePinAnnouncement: (id: string) => { success: boolean; error?: string };
  publishAnnouncement: (id: string) => void;
  unpublishAnnouncement: (id: string) => void;

  // Events (Phase 1)
  events: Event[];
  eventAttendees: EventAttendee[];
  createEvent: (event: Omit<Event, 'id' | 'createdAt' | 'rsvpCount' | 'attendanceCount'>) => { success: boolean; error?: string };
  updateEvent: (id: string, updates: Partial<Event>) => { success: boolean; error?: string };
  cancelEvent: (id: string, reason: string) => void;
  addEventAttendee: (eventId: string, userName: string, userEmail: string, userPhone: string, userProvince: string) => void;
  cancelRSVP: (attendeeId: string) => void;

  // Challenges
  challenges: Challenge[];
  challengeProofs: ChallengeProof[];
  createChallenge: (challenge: Omit<Challenge, 'id' | 'createdAt' | 'participationCount' | 'completionCount'>) => { success: boolean; error?: string };
  updateChallenge: (id: string, updates: Partial<Challenge>) => { success: boolean; error?: string };
  approveProof: (proofId: string) => void;
  rejectProof: (proofId: string, mandatoryReason: string) => { success: boolean; error?: string };
  bulkApproveProofs: (proofIds: string[]) => void;

  // Community
  forumTopics: ForumTopic[];
  createForumTopic: (topic: Omit<ForumTopic, 'id' | 'postCount' | 'latestActivityAt' | 'order'>) => void;
  updateForumTopic: (id: string, updates: Partial<ForumTopic>) => void;
  reorderForumTopic: (id: string, direction: 'up' | 'down') => void;
  archiveForumTopic: (id: string) => void;
  assignTopicModerator: (topicId: string, moderatorId: string, moderatorName: string) => void;

  communityReports: CommunityReport[];
  resolveReportAction: (reportId: string, action: 'remove_post' | 'lock_post' | 'warn_user' | 'mute_24h' | 'mute_7d' | 'ban_user' | 'dismiss', notes?: string) => void;

  keywordBlocklist: KeywordBlockItem[];
  addKeyword: (word: string, language: 'en' | 'fil') => { success: boolean; error?: string };
  removeKeyword: (id: string) => void;

  // Users & Roles
  users: User[];
  roleDefinitions: RoleDefinition[];
  createUser: (userData: Partial<User>) => { success: boolean; error?: string };
  updateUserRole: (userId: string, newRole: UserRole) => { success: boolean; error?: string };
  updateModeratorPermissions: (userId: string, permissions: ModeratorPermission[]) => { success: boolean; error?: string };
  approveModeratorApplication: (userId: string) => void;
  rejectModeratorApplication: (userId: string) => void;
  processAccountDeletion: (userId: string) => void;
  liftSanction: (userId: string) => void;

  // Chat with Chel & Document Library
  chatDocuments: ChatDocument[];
  uploadChatDocument: (doc: Omit<ChatDocument, 'id' | 'uploadedAt' | 'approvalStatus' | 'indexingStatus' | 'lastUpdated'>) => { success: boolean; error?: string };
  approveChatDocument: (id: string) => void;
  rejectChatDocument: (id: string, reason: string) => { success: boolean; error?: string };
  startChatDocumentIndexing: (id: string) => void;
  reindexChatDocument: (id: string) => void;
  removeChatDocument: (id: string) => void;

  chatConversations: ChatConversation[];
  updateChatConversationReview: (id: string, status: 'under_review' | 'resolved' | 'dismissed', notes?: string) => void;

  declinedTopics: DeclinedTopic[];
  addDeclinedTopic: (topic: Omit<DeclinedTopic, 'id' | 'createdAt' | 'updatedAt'>) => { success: boolean; error?: string };
  updateDeclinedTopic: (id: string, updates: Partial<DeclinedTopic>) => void;
  removeDeclinedTopic: (id: string) => void;
  toggleDeclinedTopicStatus: (id: string) => void;

  aiConfig: AIConfiguration;
  updateAIConfig: (updates: Partial<AIConfiguration>) => void;

  pilotAccess: PilotAccessSettings;
  updatePilotAccess: (updates: Partial<PilotAccessSettings>) => void;
  addPilotUser: (name: string, email: string, role: string) => { success: boolean; error?: string };
  removePilotUser: (id: string) => void;

  evaluationSummary: EvaluationSummary;
  evaluationMetrics: EvaluationMetric[];
  runEvaluationSuite: () => void;
  signOffEvaluation: () => void;

  // Notifications
  notifications: NotificationItem[];
  composeNotification: (notification: Omit<NotificationItem, 'id' | 'createdAt' | 'createdBy' | 'stats'>) => { success: boolean; error?: string; quietHourWarning?: boolean };

  // Audit Logs
  auditLogs: AuditLog[];
  logAuditAction: (action: string, category: AuditLog['category'], recordId: string, recordType: string, recordName: string, previous?: string, updated?: string) => void;

  // Settings
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;

  // Reset
  resetAllData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'diokno_dashboard_';

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage save error:', e);
  }
}

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { success: showSuccess, error: showError, warning: showWarning } = useToast();

  const [announcements, setAnnouncements] = useState<Announcement[]>(() =>
    loadFromStorage('announcements', INITIAL_ANNOUNCEMENTS)
  );
  const [events, setEvents] = useState<Event[]>(() =>
    loadFromStorage('events', INITIAL_EVENTS)
  );
  const [eventAttendees, setEventAttendees] = useState<EventAttendee[]>(() =>
    loadFromStorage('attendees', INITIAL_EVENT_ATTENDEES)
  );
  const [challenges, setChallenges] = useState<Challenge[]>(() =>
    loadFromStorage('challenges', INITIAL_CHALLENGES)
  );
  const [challengeProofs, setChallengeProofs] = useState<ChallengeProof[]>(() =>
    loadFromStorage('proofs', INITIAL_CHALLENGE_PROOFS)
  );
  const [forumTopics, setForumTopics] = useState<ForumTopic[]>(() =>
    loadFromStorage('topics', INITIAL_FORUM_TOPICS)
  );
  const [communityReports, setCommunityReports] = useState<CommunityReport[]>(() =>
    loadFromStorage('reports', INITIAL_COMMUNITY_REPORTS)
  );
  const [keywordBlocklist, setKeywordBlocklist] = useState<KeywordBlockItem[]>(() =>
    loadFromStorage('keywords', INITIAL_KEYWORD_BLOCKLIST)
  );
  const [users, setUsers] = useState<User[]>(() =>
    loadFromStorage('users', INITIAL_USERS)
  );
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    loadFromStorage('notifications', INITIAL_NOTIFICATIONS)
  );
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() =>
    loadFromStorage('audit_logs', INITIAL_AUDIT_LOGS)
  );
  const [settings, setSettings] = useState<AppSettings>(() =>
    loadFromStorage('settings', INITIAL_APP_SETTINGS)
  );
  const [roleDefinitions, setRoleDefinitions] = useState<RoleDefinition[]>(() =>
    loadFromStorage('role_definitions', INITIAL_ROLE_DEFINITIONS)
  );
  const [chatDocuments, setChatDocuments] = useState<ChatDocument[]>(() =>
    loadFromStorage('chat_documents', INITIAL_CHAT_DOCUMENTS)
  );
  const [chatConversations, setChatConversations] = useState<ChatConversation[]>(() =>
    loadFromStorage('chat_conversations', INITIAL_CHAT_CONVERSATIONS)
  );
  const [declinedTopics, setDeclinedTopics] = useState<DeclinedTopic[]>(() =>
    loadFromStorage('declined_topics', INITIAL_DECLINED_TOPICS)
  );
  const [aiConfig, setAiConfig] = useState<AIConfiguration>(() =>
    loadFromStorage('ai_config', INITIAL_AI_CONFIG)
  );
  const [pilotAccess, setPilotAccess] = useState<PilotAccessSettings>(() =>
    loadFromStorage('pilot_access', INITIAL_PILOT_ACCESS)
  );
  const [evaluationSummary, setEvaluationSummary] = useState<EvaluationSummary>(() =>
    loadFromStorage('evaluation_summary', INITIAL_EVALUATION_SUMMARY)
  );
  const [evaluationMetrics, setEvaluationMetrics] = useState<EvaluationMetric[]>(() =>
    loadFromStorage('evaluation_metrics', INITIAL_EVALUATION_METRICS)
  );

  // Sync to local storage
  useEffect(() => saveToStorage('announcements', announcements), [announcements]);
  useEffect(() => saveToStorage('events', events), [events]);
  useEffect(() => saveToStorage('attendees', eventAttendees), [eventAttendees]);
  useEffect(() => saveToStorage('challenges', challenges), [challenges]);
  useEffect(() => saveToStorage('proofs', challengeProofs), [challengeProofs]);
  useEffect(() => saveToStorage('topics', forumTopics), [forumTopics]);
  useEffect(() => saveToStorage('reports', communityReports), [communityReports]);
  useEffect(() => saveToStorage('keywords', keywordBlocklist), [keywordBlocklist]);
  useEffect(() => saveToStorage('users', users), [users]);
  useEffect(() => saveToStorage('notifications', notifications), [notifications]);
  useEffect(() => saveToStorage('audit_logs', auditLogs), [auditLogs]);
  useEffect(() => saveToStorage('settings', settings), [settings]);
  useEffect(() => saveToStorage('role_definitions', roleDefinitions), [roleDefinitions]);
  useEffect(() => saveToStorage('chat_documents', chatDocuments), [chatDocuments]);
  useEffect(() => saveToStorage('chat_conversations', chatConversations), [chatConversations]);
  useEffect(() => saveToStorage('declined_topics', declinedTopics), [declinedTopics]);
  useEffect(() => saveToStorage('ai_config', aiConfig), [aiConfig]);
  useEffect(() => saveToStorage('pilot_access', pilotAccess), [pilotAccess]);
  useEffect(() => saveToStorage('evaluation_summary', evaluationSummary), [evaluationSummary]);
  useEffect(() => saveToStorage('evaluation_metrics', evaluationMetrics), [evaluationMetrics]);

  // Audit Logger Helper
  const logAuditAction = useCallback((
    action: string,
    category: AuditLog['category'],
    recordId: string,
    recordType: string,
    recordName: string,
    previous?: string,
    updated?: string
  ) => {
    const newLog: AuditLog = {
      id: 'aud-' + Math.random().toString(36).substring(2, 9),
      adminId: user?.id || 'usr-system',
      adminName: user?.name || 'System Admin',
      adminRole: user?.role || 'admin',
      action,
      category,
      affectedRecordId: recordId,
      affectedRecordType: recordType,
      affectedRecordName: recordName,
      previousValue: previous,
      updatedValue: updated,
      timestamp: new Date().toISOString(),
      ipAddress: '120.28.182.44'
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  }, [user]);

  // --- Announcements Actions ---
  const createAnnouncement = (
    ann: Omit<Announcement, 'id' | 'createdAt' | 'authorName' | 'authorId' | 'viewCount'>
  ) => {
    // Check pinned limit: max 3 pinned announcements
    const pinnedCount = announcements.filter((a) => a.isPinned).length;
    if (ann.isPinned && pinnedCount >= 3) {
      showError('Pinned Limit Reached', 'A maximum of 3 announcements can be pinned at any time. Unpin an existing announcement first.');
      return { success: false, error: 'Maximum of 3 pinned announcements allowed.' };
    }

    const newId = 'ann-' + Math.random().toString(36).substring(2, 9);
    const newAnnouncement: Announcement = {
      ...ann,
      id: newId,
      createdAt: new Date().toISOString(),
      publishedAt: ann.status === 'published' ? new Date().toISOString() : undefined,
      authorName: user?.name || 'Admin',
      authorId: user?.id || 'usr-admin-01',
      viewCount: 0
    };

    setAnnouncements((prev) => [newAnnouncement, ...prev]);

    logAuditAction(
      'Created Announcement',
      'announcements',
      newId,
      'Announcement',
      newAnnouncement.title,
      'None (New)',
      `Category: ${newAnnouncement.category}, Status: ${newAnnouncement.status}, Pinned: ${newAnnouncement.isPinned}`
    );

    // If push notification is checked, automatically trigger a notification record
    if (newAnnouncement.sendPushNotification && newAnnouncement.status === 'published') {
      const notifId = 'notif-' + Math.random().toString(36).substring(2, 9);
      const newNotif: NotificationItem = {
        id: notifId,
        title: newAnnouncement.title,
        message: newAnnouncement.content.substring(0, 140) + '...',
        category: 'Announcements',
        audience: 'everyone',
        sentAt: new Date().toISOString(),
        status: 'sent',
        stats: { sent: 10482, opened: 0, failed: 0 },
        createdBy: user?.name || 'Admin',
        createdAt: new Date().toISOString()
      };
      setNotifications((prev) => [newNotif, ...prev]);
      showSuccess('Push Notification Broadcasted', 'Notification dispatched via FCM & APNs.');
    }

    showSuccess('Announcement Created', `"${newAnnouncement.title}" has been saved.`);
    return { success: true };
  };

  const updateAnnouncement = (id: string, updates: Partial<Announcement>) => {
    const existing = announcements.find((a) => a.id === id);
    if (!existing) return { success: false, error: 'Announcement not found.' };

    if (updates.isPinned && !existing.isPinned) {
      const pinnedCount = announcements.filter((a) => a.isPinned && a.id !== id).length;
      if (pinnedCount >= 3) {
        showError('Pinned Limit Reached', 'Only 3 announcements can be pinned at once.');
        return { success: false, error: 'Maximum of 3 pinned announcements allowed.' };
      }
    }

    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );

    logAuditAction(
      'Updated Announcement',
      'announcements',
      id,
      'Announcement',
      existing.title,
      `Status: ${existing.status}, Pinned: ${existing.isPinned}`,
      `Status: ${updates.status ?? existing.status}, Pinned: ${updates.isPinned ?? existing.isPinned}`
    );

    showSuccess('Announcement Updated', 'Changes were saved successfully.');
    return { success: true };
  };

  const deleteAnnouncement = (id: string) => {
    const existing = announcements.find((a) => a.id === id);
    if (!existing) return;

    setAnnouncements((prev) => prev.filter((a) => a.id !== id));

    logAuditAction(
      'Deleted Announcement',
      'announcements',
      id,
      'Announcement',
      existing.title,
      `Status: ${existing.status}`,
      'DELETED'
    );

    showSuccess('Announcement Deleted', `"${existing.title}" removed.`);
  };

  const togglePinAnnouncement = (id: string) => {
    const target = announcements.find((a) => a.id === id);
    if (!target) return { success: false, error: 'Not found' };

    if (!target.isPinned) {
      const currentPinned = announcements.filter((a) => a.isPinned).length;
      if (currentPinned >= 3) {
        showError('Pinned Limit Reached', 'You can only pin up to 3 announcements. Please unpin another item first.');
        return { success: false, error: 'Limit reached (3 max)' };
      }
    }

    const newPinned = !target.isPinned;
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isPinned: newPinned } : a))
    );

    logAuditAction(
      newPinned ? 'Pinned Announcement' : 'Unpinned Announcement',
      'announcements',
      id,
      'Announcement',
      target.title,
      `Pinned: ${target.isPinned}`,
      `Pinned: ${newPinned}`
    );

    showSuccess(newPinned ? 'Announcement Pinned' : 'Announcement Unpinned');
    return { success: true };
  };

  const publishAnnouncement = (id: string) => {
    updateAnnouncement(id, { status: 'published', publishedAt: new Date().toISOString() });
  };

  const unpublishAnnouncement = (id: string) => {
    updateAnnouncement(id, { status: 'unpublished' });
  };

  // --- Events Actions ---
  const createEvent = (evt: Omit<Event, 'id' | 'createdAt' | 'rsvpCount' | 'attendanceCount'>) => {
    const newId = 'evt-' + Math.random().toString(36).substring(2, 9);
    const newEvent: Event = {
      ...evt,
      id: newId,
      rsvpCount: 0,
      attendanceCount: 0,
      createdAt: new Date().toISOString()
    };

    setEvents((prev) => [newEvent, ...prev]);

    logAuditAction(
      'Created Event',
      'events',
      newId,
      'Event',
      newEvent.title,
      'None',
      `Type: ${newEvent.eventType}, Venue: ${newEvent.venue}, Capacity: ${newEvent.capacity}`
    );

    showSuccess('Event Created', `"${newEvent.title}" is now listed.`);
    return { success: true };
  };

  const updateEvent = (id: string, updates: Partial<Event>) => {
    const existing = events.find((e) => e.id === id);
    if (!existing) return { success: false, error: 'Event not found.' };

    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));

    logAuditAction(
      'Updated Event',
      'events',
      id,
      'Event',
      existing.title,
      `Status: ${existing.status}`,
      `Status: ${updates.status ?? existing.status}`
    );

    showSuccess('Event Updated', 'Event details refreshed.');
    return { success: true };
  };

  const cancelEvent = (id: string, reason: string) => {
    const existing = events.find((e) => e.id === id);
    if (!existing) return;

    setEvents((prev) =>
      prev.map((e) =>
        e.id === id
          ? { ...e, status: 'cancelled', cancellationReason: reason }
          : e
      )
    );

    logAuditAction(
      'Cancelled Event',
      'events',
      id,
      'Event',
      existing.title,
      `Status: ${existing.status}`,
      `Status: cancelled (Reason: ${reason})`
    );

    // Notify registered attendees
    const notifId = 'notif-' + Math.random().toString(36).substring(2, 9);
    const cancelNotif: NotificationItem = {
      id: notifId,
      title: `Event Cancelled: ${existing.title}`,
      message: `Notice: This event has been cancelled. Reason: ${reason}`,
      category: 'Events',
      audience: 'event_rsvp',
      targetEventId: id,
      targetEventName: existing.title,
      sentAt: new Date().toISOString(),
      status: 'sent',
      stats: { sent: existing.rsvpCount, opened: 0, failed: 0 },
      createdBy: user?.name || 'Admin',
      createdAt: new Date().toISOString()
    };
    setNotifications((prev) => [cancelNotif, ...prev]);

    showWarning('Event Cancelled', `Cancellation notice sent to ${existing.rsvpCount} registered participants.`);
  };

  const checkInAttendee = (attendeeId: string) => {
    const attendee = eventAttendees.find((a) => a.id === attendeeId);
    if (!attendee) return;

    const newCheckedIn = !attendee.checkedIn;
    setEventAttendees((prev) =>
      prev.map((a) =>
        a.id === attendeeId
          ? {
              ...a,
              checkedIn: newCheckedIn,
              checkedInAt: newCheckedIn ? new Date().toISOString() : undefined
            }
          : a
      )
    );

    // Update event attendance count
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === attendee.eventId) {
          return {
            ...e,
            attendanceCount: Math.max(0, e.attendanceCount + (newCheckedIn ? 1 : -1))
          };
        }
        return e;
      })
    );

    logAuditAction(
      newCheckedIn ? 'Checked-in Event Attendee' : 'Reverted Check-in',
      'events',
      attendee.id,
      'EventAttendee',
      `${attendee.userName} (${attendee.qrCodeId})`,
      `Checked-in: ${attendee.checkedIn}`,
      `Checked-in: ${newCheckedIn}`
    );

    showSuccess(newCheckedIn ? 'Attendee Checked In' : 'Check-in Reverted', attendee.userName);
  };

  const addEventAttendee = (
    eventId: string,
    userName: string,
    userEmail: string,
    userPhone: string,
    userProvince: string
  ) => {
    const event = events.find((e) => e.id === eventId);
    if (!event) return;

    const newAttendee: EventAttendee = {
      id: 'att-' + Math.random().toString(36).substring(2, 9),
      eventId,
      userId: 'usr-' + Math.random().toString(36).substring(2, 9),
      userName,
      userEmail,
      userPhone,
      userProvince,
      userRole: 'member',
      rsvpDate: new Date().toISOString(),
      status: 'going'
    };

    setEventAttendees((prev) => [newAttendee, ...prev]);
    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, rsvpCount: e.rsvpCount + 1 } : e))
    );

    showSuccess('RSVP Confirmed', `${userName} is confirmed for ${event.title}`);
  };

  const cancelRSVP = (attendeeId: string) => {
    const attendee = eventAttendees.find((a) => a.id === attendeeId);
    if (!attendee) return;

    setEventAttendees((prev) =>
      prev.map((a) => (a.id === attendeeId ? { ...a, status: 'cancelled' } : a))
    );

    setEvents((prev) =>
      prev.map((e) =>
        e.id === attendee.eventId ? { ...e, rsvpCount: Math.max(0, e.rsvpCount - 1) } : e
      )
    );

    showWarning('RSVP Cancelled', `${attendee.userName}'s reservation was marked as cancelled.`);
  };

  // --- CHELlenges Actions ---
  const createChallenge = (
    chl: Omit<Challenge, 'id' | 'createdAt' | 'participationCount' | 'completionCount'>
  ) => {
    if (chl.tasks.length < 3 || chl.tasks.length > 10) {
      showError('Invalid Tasks Count', 'Each CHELlenge must contain between 3 and 10 tasks.');
      return { success: false, error: 'Must contain 3–10 tasks.' };
    }

    const newId = 'chl-' + Math.random().toString(36).substring(2, 9);
    const newChallenge: Challenge = {
      ...chl,
      id: newId,
      participationCount: 0,
      completionCount: 0,
      createdAt: new Date().toISOString()
    };

    setChallenges((prev) => [newChallenge, ...prev]);

    logAuditAction(
      'Created Monthly CHELlenge',
      'challenges',
      newId,
      'Challenge',
      newChallenge.name,
      'None',
      `Month: ${newChallenge.month} ${newChallenge.year}, Tasks: ${newChallenge.tasks.length}`
    );

    showSuccess('CHELlenge Created', `"${newChallenge.name}" is now configured.`);
    return { success: true };
  };

  const updateChallenge = (id: string, updates: Partial<Challenge>) => {
    setChallenges((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    showSuccess('Challenge Updated', 'Saved challenge adjustments.');
    return { success: true };
  };

  const approveProof = (proofId: string) => {
    const proof = challengeProofs.find((p) => p.id === proofId);
    if (!proof) return;

    setChallengeProofs((prev) =>
      prev.map((p) =>
        p.id === proofId
          ? {
              ...p,
              status: 'approved',
              badgeStatus: 'confirmed',
              reviewedBy: user?.name || 'Moderator',
              reviewedAt: new Date().toISOString()
            }
          : p
      )
    );

    // Update challenge completion count
    setChallenges((prev) =>
      prev.map((c) =>
        c.id === proof.challengeId ? { ...c, completionCount: c.completionCount + 1 } : c
      )
    );

    logAuditAction(
      'Approved CHELlenge Proof',
      'challenges',
      proofId,
      'ChallengeProof',
      `${proof.userName} – ${proof.taskTitle}`,
      'status: pending_review',
      'status: approved, badgeStatus: confirmed'
    );

    showSuccess('Proof Approved', `${proof.userName}'s submission accepted. Badge confirmed.`);
  };

  const rejectProof = (proofId: string, mandatoryReason: string) => {
    if (!mandatoryReason.trim()) {
      showError('Reason Required', 'A mandatory rejection reason is required so the volunteer can be notified.');
      return { success: false, error: 'Mandatory reason required' };
    }

    const proof = challengeProofs.find((p) => p.id === proofId);
    if (!proof) return { success: false, error: 'Proof not found' };

    setChallengeProofs((prev) =>
      prev.map((p) =>
        p.id === proofId
          ? {
              ...p,
              status: 'rejected',
              badgeStatus: 'none',
              rejectionReason: mandatoryReason,
              reviewedBy: user?.name || 'Moderator',
              reviewedAt: new Date().toISOString()
            }
          : p
      )
    );

    logAuditAction(
      'Rejected CHELlenge Proof',
      'challenges',
      proofId,
      'ChallengeProof',
      `${proof.userName} – ${proof.taskTitle}`,
      'status: pending_review',
      `status: rejected (Reason: ${mandatoryReason})`
    );

    showWarning('Proof Rejected', `Notification sent to ${proof.userName} with reason.`);
    return { success: true };
  };

  const bulkApproveProofs = (proofIds: string[]) => {
    setChallengeProofs((prev) =>
      prev.map((p) =>
        proofIds.includes(p.id)
          ? {
              ...p,
              status: 'approved',
              badgeStatus: 'confirmed',
              reviewedBy: user?.name || 'Admin',
              reviewedAt: new Date().toISOString()
            }
          : p
      )
    );

    logAuditAction(
      'Bulk Approved CHELlenge Proofs',
      'challenges',
      'bulk',
      'ChallengeProofBatch',
      `${proofIds.length} submissions`,
      'status: pending_review',
      'status: approved'
    );

    showSuccess('Bulk Approval Complete', `${proofIds.length} submissions approved.`);
  };

  // --- Community Actions ---
  const createForumTopic = (
    topic: Omit<ForumTopic, 'id' | 'postCount' | 'latestActivityAt' | 'order'>
  ) => {
    const newId = 'top-' + Math.random().toString(36).substring(2, 9);
    const newTopic: ForumTopic = {
      ...topic,
      id: newId,
      postCount: 0,
      latestActivityAt: new Date().toISOString(),
      order: forumTopics.length + 1
    };

    setForumTopics((prev) => [...prev, newTopic]);

    logAuditAction(
      'Created Forum Topic',
      'community',
      newId,
      'ForumTopic',
      newTopic.name,
      'None',
      `Assigned Mod: ${newTopic.assignedModeratorName || 'Unassigned'}`
    );

    showSuccess('Topic Created', `"${newTopic.name}" added to forum.`);
  };

  const updateForumTopic = (id: string, updates: Partial<ForumTopic>) => {
    setForumTopics((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    showSuccess('Topic Updated', 'Saved topic details.');
  };

  const reorderForumTopic = (id: string, direction: 'up' | 'down') => {
    const index = forumTopics.findIndex((t) => t.id === id);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === forumTopics.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const newTopics = [...forumTopics];
    const [moved] = newTopics.splice(index, 1);
    newTopics.splice(targetIndex, 0, moved);

    // Reassign order
    const ordered = newTopics.map((t, idx) => ({ ...t, order: idx + 1 }));
    setForumTopics(ordered);
  };

  const archiveForumTopic = (id: string) => {
    const topic = forumTopics.find((t) => t.id === id);
    if (!topic) return;

    const newStatus = topic.status === 'active' ? 'archived' : 'active';
    setForumTopics((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );

    logAuditAction(
      newStatus === 'archived' ? 'Archived Forum Topic' : 'Restored Forum Topic',
      'community',
      id,
      'ForumTopic',
      topic.name,
      `Status: ${topic.status}`,
      `Status: ${newStatus}`
    );

    showSuccess(newStatus === 'archived' ? 'Topic Archived' : 'Topic Restored');
  };

  const assignTopicModerator = (topicId: string, moderatorId: string, moderatorName: string) => {
    const topic = forumTopics.find((t) => t.id === topicId);
    if (!topic) return;

    setForumTopics((prev) =>
      prev.map((t) =>
        t.id === topicId
          ? { ...t, assignedModeratorId: moderatorId, assignedModeratorName: moderatorName }
          : t
      )
    );

    logAuditAction(
      'Assigned Topic Moderator',
      'community',
      topicId,
      'ForumTopic',
      topic.name,
      `Moderator: ${topic.assignedModeratorName || 'None'}`,
      `Moderator: ${moderatorName}`
    );

    showSuccess('Moderator Assigned', `${moderatorName} assigned to ${topic.name}`);
  };

  const resolveReportAction = (
    reportId: string,
    action: 'remove_post' | 'lock_post' | 'warn_user' | 'mute_24h' | 'mute_7d' | 'ban_user' | 'dismiss',
    notes?: string
  ) => {
    const report = communityReports.find((r) => r.id === reportId);
    if (!report) return;

    let actionLabel = '';
    let targetUserStatus: 'active' | 'muted' | 'suspended' = 'active';

    switch (action) {
      case 'remove_post':
        actionLabel = 'Removed Post';
        break;
      case 'lock_post':
        actionLabel = 'Locked Post Thread';
        break;
      case 'warn_user':
        actionLabel = 'Issued Warning to User';
        break;
      case 'mute_24h':
        actionLabel = 'Muted User for 24 Hours';
        targetUserStatus = 'muted';
        break;
      case 'mute_7d':
        actionLabel = 'Muted User for 7 Days';
        targetUserStatus = 'muted';
        break;
      case 'ban_user':
        actionLabel = 'Banned User Account';
        targetUserStatus = 'suspended';
        break;
      case 'dismiss':
        actionLabel = 'Dismissed Report (No Violation)';
        break;
    }

    setCommunityReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? {
              ...r,
              status: action === 'dismiss' ? 'dismissed' : 'action_taken',
              actionTaken: actionLabel,
              actionNote: notes || 'Handled by moderator',
              moderatorId: user?.id,
              moderatorName: user?.name
            }
          : r
      )
    );

    // If user sanction applies, update user record
    if (action.startsWith('mute_') || action === 'ban_user' || action === 'warn_user') {
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id === report.postAuthorId || u.name === report.postAuthorName) {
            return {
              ...u,
              status: targetUserStatus,
              sanctions: [
                ...u.sanctions,
                {
                  type: action === 'ban_user' ? 'ban' : action === 'mute_7d' ? 'mute_7d' : action === 'mute_24h' ? 'mute_24h' : 'warning',
                  reason: notes || `Report violation: ${report.reason}`,
                  imposedBy: user?.name || 'Moderator',
                  imposedAt: new Date().toISOString(),
                  active: true
                }
              ]
            };
          }
          return u;
        })
      );
    }

    logAuditAction(
      `Moderation: ${actionLabel}`,
      'community',
      report.id,
      'CommunityReport',
      `Post by ${report.postAuthorName} in ${report.topicName}`,
      'status: pending',
      `Action: ${actionLabel}. Notes: ${notes || 'None'}`
    );

    showSuccess('Moderation Action Applied', `${actionLabel} recorded in audit log.`);
  };

  const addKeyword = (word: string, language: 'en' | 'fil') => {
    const trimmed = word.trim().toLowerCase();
    if (!trimmed) return { success: false, error: 'Keyword cannot be empty.' };

    if (keywordBlocklist.some((k) => k.word.toLowerCase() === trimmed)) {
      showError('Duplicate Keyword', 'This keyword already exists in the blocklist.');
      return { success: false, error: 'Already exists' };
    }

    const newItem: KeywordBlockItem = {
      id: 'kw-' + Math.random().toString(36).substring(2, 9),
      word: trimmed,
      language,
      addedAt: new Date().toISOString(),
      addedBy: user?.name || 'Admin'
    };

    setKeywordBlocklist((prev) => [newItem, ...prev]);

    logAuditAction(
      'Added Keyword to Blocklist',
      'community',
      newItem.id,
      'KeywordBlocklist',
      trimmed,
      'None',
      `Language: ${language}`
    );

    showSuccess('Keyword Added', `"${trimmed}" added to active filter.`);
    return { success: true };
  };

  const removeKeyword = (id: string) => {
    const target = keywordBlocklist.find((k) => k.id === id);
    if (!target) return;

    setKeywordBlocklist((prev) => prev.filter((k) => k.id !== id));

    logAuditAction(
      'Removed Keyword from Blocklist',
      'community',
      id,
      'KeywordBlocklist',
      target.word,
      `Language: ${target.language}`,
      'REMOVED'
    );

    showSuccess('Keyword Removed', `"${target.word}" removed.`);
  };

  // --- Users Actions ---
  const createUser = (userData: Partial<User>) => {
    if (!userData.name?.trim() || !userData.email?.trim()) {
      showError('Validation Error', 'Volunteer name and email are required.');
      return { success: false, error: 'Name and email are required.' };
    }

    if (userData.role === 'super_admin' && user?.role !== 'super_admin') {
      showError('Unauthorized Action', 'Only an active Super Admin can create Super Admin accounts.');
      return { success: false, error: 'Only Super Admin can create Super Admin accounts' };
    }

    // Role capacity checks (ADM-01 / ADM-07)
    if (userData.role === 'super_admin') {
      const count = users.filter((u) => u.role === 'super_admin').length;
      if (count >= 3) {
        showError('Capacity Reached', 'Maximum limit of 3 Super Admins has been reached.');
        return { success: false, error: 'Super Admin limit reached (max 3)' };
      }
    } else if (userData.role === 'admin') {
      const count = users.filter((u) => u.role === 'admin').length;
      if (count >= 12) {
        showError('Capacity Reached', 'Maximum limit of 12 Administrators has been reached.');
        return { success: false, error: 'Administrator limit reached (max 12)' };
      }
    } else if (userData.role === 'moderator') {
      const count = users.filter((u) => u.role === 'moderator').length;
      if (count >= 150) {
        showError('Capacity Reached', 'Maximum limit of 150 Moderators has been reached.');
        return { success: false, error: 'Moderator limit reached (max 150)' };
      }
    }

    const newUser: User = {
      id: `usr-${Date.now().toString(36)}`,
      name: userData.name.trim(),
      email: userData.email.trim().toLowerCase(),
      avatar:
        userData.avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      phone: userData.phone || '+63 917 000 0000',
      isPhoneVerified: userData.isPhoneVerified ?? true,
      province: userData.province || 'Metro Manila',
      city: userData.city || 'Quezon City',
      organization: userData.organization || 'Independent Volunteer',
      interests: userData.interests || ['Legal Reform', 'Community Organizing'],
      registeredAt: new Date().toISOString(),
      role: userData.role || 'volunteer',
      status: 'active',
      profileCompletion: 100,
      eventAttendanceCount: 0,
      badgesEarned: [],
      communityPostCount: 0,
      points: userData.points || 0,
      age: userData.age,
      gender: userData.gender,
      demographicsConsent: userData.demographicsConsent ?? true,
      moderatorPermissions:
        userData.role === 'moderator'
          ? userData.moderatorPermissions || ['forum_moderation']
          : undefined,
      sanctions: []
    };

    setUsers((prev) => [newUser, ...prev]);

    logAuditAction(
      'Registered New User',
      'users',
      newUser.id,
      'User',
      newUser.name,
      'None',
      `Registered with role ${newUser.role.toUpperCase()}`
    );

    showSuccess('Volunteer Added', `${newUser.name} was successfully registered.`);
    return { success: true };
  };

  const updateUserRole = (userId: string, newRole: UserRole) => {
    const target = users.find((u) => u.id === userId);
    if (!target) return { success: false, error: 'User not found.' };

    // Super Admin privilege enforcement (ADM-01 / ADM-07: Admins cannot assign Super Admin)
    if (newRole === 'super_admin' && user?.role !== 'super_admin') {
      showError('Unauthorized Action', 'Only an active Super Admin can assign or promote Super Admin privileges.');
      return { success: false, error: 'Only Super Admin can assign Super Admin role' };
    }

    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );

    logAuditAction(
      'Changed User Role',
      'users',
      userId,
      'User',
      target.name,
      `Role: ${target.role}`,
      `Role: ${newRole}`
    );

    showSuccess('Role Updated', `${target.name} is now assigned as ${newRole.toUpperCase()}.`);
    return { success: true };
  };

  const updateModeratorPermissions = (userId: string, permissions: ModeratorPermission[]) => {
    const target = users.find((u) => u.id === userId);
    if (!target) return { success: false, error: 'User not found.' };

    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, moderatorPermissions: permissions } : u))
    );

    logAuditAction(
      'Updated Moderator Permissions',
      'users',
      userId,
      'User',
      target.name,
      `Permissions: ${(target.moderatorPermissions || []).join(', ') || 'None'}`,
      `Permissions: ${permissions.join(', ') || 'None'}`
    );

    showSuccess('Permissions Updated', `Permissions updated for ${target.name}.`);
    return { success: true };
  };

  const approveModeratorApplication = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (!target) return;

    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, role: 'moderator', moderatorApplicationStatus: 'approved' }
          : u
      )
    );

    logAuditAction(
      'Approved Moderator Application',
      'users',
      userId,
      'User',
      target.name,
      'Role: volunteer, status: pending_application',
      'Role: moderator, status: approved'
    );

    showSuccess('Moderator Approved', `${target.name} has been promoted to Moderator.`);
  };

  const rejectModeratorApplication = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (!target) return;

    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, moderatorApplicationStatus: 'rejected' }
          : u
      )
    );

    logAuditAction(
      'Rejected Moderator Application',
      'users',
      userId,
      'User',
      target.name,
      'status: pending_application',
      'status: rejected'
    );

    showWarning('Application Declined', `${target.name}'s moderator application rejected.`);
  };

  const processAccountDeletion = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (!target) return;

    setUsers((prev) => prev.filter((u) => u.id !== userId));

    logAuditAction(
      'Processed Account Deletion Request',
      'users',
      userId,
      'User',
      target.name,
      `Email: ${target.email}`,
      'DELETED per Data Privacy Act Compliance'
    );

    showSuccess('Account Deleted', `${target.name}'s data permanently purged.`);
  };

  const liftSanction = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (!target) return;

    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              status: 'active',
              sanctions: u.sanctions.map((s) => ({ ...s, active: false }))
            }
          : u
      )
    );

    logAuditAction(
      'Lifted User Sanction',
      'users',
      userId,
      'User',
      target.name,
      `Status: ${target.status}`,
      'Status: active'
    );

    showSuccess('Sanction Lifted', `${target.name} restored to active status.`);
  };

  // --- Notifications Actions ---
  const composeNotification = (
    notif: Omit<NotificationItem, 'id' | 'createdAt' | 'createdBy' | 'stats'>
  ) => {
    // Check Quiet Hours: 10:00 PM to 7:00 AM Manila Time (UTC+8)
    // If scheduling or sending now, check hour in Manila
    const now = notif.scheduledAt ? new Date(notif.scheduledAt) : new Date();
    // Convert to Manila hour (UTC + 8)
    const utcHour = now.getUTCHours();
    const manilaHour = (utcHour + 8) % 24;

    const isQuietHour = manilaHour >= 22 || manilaHour < 7;

    const newId = 'notif-' + Math.random().toString(36).substring(2, 9);
    const newNotif: NotificationItem = {
      ...notif,
      id: newId,
      createdAt: new Date().toISOString(),
      createdBy: user?.name || 'Admin',
      sentAt: notif.status === 'sent' ? new Date().toISOString() : undefined,
      stats: {
        sent: notif.status === 'sent' ? (notif.audience === 'everyone' ? 10482 : 450) : 0,
        opened: 0,
        failed: 0
      }
    };

    setNotifications((prev) => [newNotif, ...prev]);

    logAuditAction(
      notif.status === 'sent' ? 'Dispatched Push Notification' : 'Scheduled Push Notification',
      'notifications',
      newId,
      'Notification',
      newNotif.title,
      'None',
      `Category: ${newNotif.category}, Audience: ${newNotif.audience}, Status: ${newNotif.status}`
    );

    if (isQuietHour) {
      showWarning(
        'Quiet Hours Notice',
        `This notification was scheduled/sent during Manila Quiet Hours (10 PM – 7 AM PHT). Volunteers in silent mode will receive it in morning digest.`
      );
    } else {
      showSuccess(
        notif.status === 'sent' ? 'Notification Sent' : 'Notification Scheduled',
        `Targeting: ${notif.audience}`
      );
    }

    return { success: true, quietHourWarning: isQuietHour };
  };

  // --- Chat with Chel Actions ---
  const uploadChatDocument = (
    doc: Omit<ChatDocument, 'id' | 'uploadedAt' | 'approvalStatus' | 'indexingStatus' | 'lastUpdated'>
  ) => {
    const newId = 'doc-' + Math.random().toString(36).substring(2, 9);
    const newDoc: ChatDocument = {
      ...doc,
      id: newId,
      uploadedAt: new Date().toISOString(),
      approvalStatus: 'pending_approval',
      indexingStatus: 'pending_approval',
      lastUpdated: new Date().toISOString()
    };

    setChatDocuments((prev) => [newDoc, ...prev]);

    logAuditAction(
      'Uploaded Knowledge Document',
      'settings',
      newId,
      'ChatDocument',
      newDoc.title,
      'None (New)',
      `Type: ${newDoc.fileType}, Source: ${newDoc.source}, Status: pending_approval`
    );

    showSuccess('Document Uploaded', `"${newDoc.title}" submitted for administrative approval.`);
    return { success: true };
  };

  const approveChatDocument = (id: string) => {
    const doc = chatDocuments.find((d) => d.id === id);
    if (!doc) return;

    setChatDocuments((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              approvalStatus: 'approved',
              approvedBy: user?.name || 'Administrator',
              approvedAt: new Date().toISOString(),
              indexingStatus: 'ready_for_indexing',
              lastUpdated: new Date().toISOString()
            }
          : d
      )
    );

    logAuditAction(
      'Approved Knowledge Document',
      'settings',
      id,
      'ChatDocument',
      doc.title,
      'approvalStatus: pending_approval',
      'approvalStatus: approved, indexingStatus: ready_for_indexing'
    );

    showSuccess('Document Approved', `"${doc.title}" is approved and eligible for indexing.`);
  };

  const rejectChatDocument = (id: string, reason: string) => {
    if (!reason.trim()) {
      showError('Rejection Reason Required', 'Please provide a reason for rejecting this document.');
      return { success: false, error: 'Reason required' };
    }

    const doc = chatDocuments.find((d) => d.id === id);
    if (!doc) return { success: false, error: 'Document not found' };

    setChatDocuments((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              approvalStatus: 'rejected',
              rejectionReason: reason,
              indexingStatus: 'indexing_failed',
              lastUpdated: new Date().toISOString()
            }
          : d
      )
    );

    logAuditAction(
      'Rejected Knowledge Document',
      'settings',
      id,
      'ChatDocument',
      doc.title,
      'approvalStatus: pending_approval',
      `approvalStatus: rejected (Reason: ${reason})`
    );

    showWarning('Document Rejected', `"${doc.title}" was rejected with reason recorded.`);
    return { success: true };
  };

  const startChatDocumentIndexing = (id: string) => {
    const doc = chatDocuments.find((d) => d.id === id);
    if (!doc) return;

    if (doc.approvalStatus !== 'approved') {
      showError('Approval Required', 'Only approved documents are eligible for vector indexing.');
      return;
    }

    // Mark as indexing
    setChatDocuments((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...d, indexingStatus: 'indexing', lastUpdated: new Date().toISOString() }
          : d
      )
    );

    // Simulate completion
    setTimeout(() => {
      setChatDocuments((prev) =>
        prev.map((d) =>
          d.id === id
            ? {
                ...d,
                indexingStatus: 'indexed',
                indexedAt: new Date().toISOString(),
                chunkCount: Math.floor(Math.random() * 30) + 12,
                lastUpdated: new Date().toISOString()
              }
            : d
        )
      );
      showSuccess('Indexing Completed', `Embeddings generated for "${doc.title}".`);
    }, 1500);

    logAuditAction(
      'Triggered Document Indexing',
      'settings',
      id,
      'ChatDocument',
      doc.title,
      `indexingStatus: ${doc.indexingStatus}`,
      'indexingStatus: indexed'
    );
  };

  const reindexChatDocument = (id: string) => {
    startChatDocumentIndexing(id);
  };

  const removeChatDocument = (id: string) => {
    const doc = chatDocuments.find((d) => d.id === id);
    if (!doc) return;

    setChatDocuments((prev) => prev.filter((d) => d.id !== id));

    logAuditAction(
      'Removed Knowledge Document',
      'settings',
      id,
      'ChatDocument',
      doc.title,
      `Status: ${doc.approvalStatus}`,
      'DELETED'
    );

    showSuccess('Document Removed', `"${doc.title}" removed from knowledge library.`);
  };

  const updateChatConversationReview = (
    id: string,
    status: 'under_review' | 'resolved' | 'dismissed',
    notes?: string
  ) => {
    const conv = chatConversations.find((c) => c.id === id);
    if (!conv) return;

    setChatConversations((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              reviewStatus: status,
              reviewNotes: notes || c.reviewNotes,
              reviewedBy: user?.name || 'Admin',
              reviewedAt: new Date().toISOString()
            }
          : c
      )
    );

    logAuditAction(
      `Reviewed Flagged AI Response (${status})`,
      'settings',
      id,
      'ChatConversation',
      `Conversation with ${conv.userName}`,
      `reviewStatus: ${conv.reviewStatus || 'new'}`,
      `reviewStatus: ${status}, Notes: ${notes || 'None'}`
    );

    showSuccess('Review Status Updated', `Conversation marked as ${status.replace('_', ' ').toUpperCase()}.`);
  };

  const addDeclinedTopic = (topic: Omit<DeclinedTopic, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newId = 'dec-' + Math.random().toString(36).substring(2, 9);
    const newTopic: DeclinedTopic = {
      ...topic,
      id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setDeclinedTopics((prev) => [newTopic, ...prev]);

    logAuditAction(
      'Added Declined Topic Guardrail',
      'settings',
      newId,
      'DeclinedTopic',
      newTopic.title,
      'None',
      `Category: ${newTopic.category}`
    );

    showSuccess('Declined Topic Added', `"${newTopic.title}" added to safety guardrails.`);
    return { success: true };
  };

  const updateDeclinedTopic = (id: string, updates: Partial<DeclinedTopic>) => {
    setDeclinedTopics((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
      )
    );
    showSuccess('Topic Guardrail Updated', 'Changes saved successfully.');
  };

  const removeDeclinedTopic = (id: string) => {
    const target = declinedTopics.find((t) => t.id === id);
    if (!target) return;

    setDeclinedTopics((prev) => prev.filter((t) => t.id !== id));

    logAuditAction(
      'Removed Declined Topic Guardrail',
      'settings',
      id,
      'DeclinedTopic',
      target.title,
      `Category: ${target.category}`,
      'REMOVED'
    );

    showSuccess('Guardrail Removed', `"${target.title}" removed.`);
  };

  const toggleDeclinedTopicStatus = (id: string) => {
    const target = declinedTopics.find((t) => t.id === id);
    if (!target) return;

    const newStatus = target.status === 'active' ? 'inactive' : 'active';
    setDeclinedTopics((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: newStatus, updatedAt: new Date().toISOString() } : t
      )
    );
    showSuccess(`Topic ${newStatus === 'active' ? 'Activated' : 'Deactivated'}`, target.title);
  };

  const updateAIConfig = (updates: Partial<AIConfiguration>) => {
    setAiConfig((prev) => ({
      ...prev,
      ...updates,
      lastUpdated: new Date().toISOString(),
      updatedBy: user?.name || 'Administrator'
    }));

    logAuditAction(
      'Updated AI Assistant Configuration',
      'settings',
      'ai_config',
      'AIConfiguration',
      'Assistant Settings',
      'Previous AI Config',
      JSON.stringify(updates).substring(0, 80)
    );

    showSuccess('AI Configuration Saved', 'System prompt and parameters updated.');
  };

  const updatePilotAccess = (updates: Partial<PilotAccessSettings>) => {
    setPilotAccess((prev) => ({ ...prev, ...updates }));

    logAuditAction(
      'Updated Pilot Access Settings',
      'settings',
      'pilot_access',
      'PilotAccessSettings',
      'Access Management',
      'Previous Pilot Config',
      `General Release: ${updates.memberGeneralRelease !== undefined ? updates.memberGeneralRelease : pilotAccess.memberGeneralRelease}`
    );

    showSuccess('Pilot Access Updated', 'Access gates and release status updated.');
  };

  const addPilotUser = (name: string, email: string, role: string) => {
    if (!email || !email.includes('@')) {
      showError('Invalid Email', 'Please enter a valid email address.');
      return { success: false, error: 'Invalid email' };
    }

    const newUser = {
      id: 'plt-' + Math.random().toString(36).substring(2, 9),
      name: name.trim() || email.split('@')[0],
      email: email.trim().toLowerCase(),
      role: role.trim() || 'Pilot Tester',
      addedAt: new Date().toISOString()
    };

    setPilotAccess((prev) => ({
      ...prev,
      pilotAllowlist: [newUser, ...prev.pilotAllowlist]
    }));

    showSuccess('Pilot Tester Added', `${newUser.name} added to pilot allowlist.`);
    return { success: true };
  };

  const removePilotUser = (id: string) => {
    setPilotAccess((prev) => ({
      ...prev,
      pilotAllowlist: prev.pilotAllowlist.filter((u) => u.id !== id)
    }));
    showSuccess('Pilot Tester Removed', 'User removed from pilot allowlist.');
  };

  const runEvaluationSuite = () => {
    showSuccess('Evaluation Suite Running', 'Executing 125 benchmark questions across in-scope, out-of-scope, and adversarial scenarios...');
    setTimeout(() => {
      setEvaluationSummary((prev) => ({
        ...prev,
        lastRunDate: new Date().toISOString(),
        passRate: 98.2,
        status: 'ready'
      }));
      showSuccess('Evaluation Complete', 'Pass rate: 98.2% across 125 test prompts. Exceeds launch threshold.');
    }, 2000);
  };

  const signOffEvaluation = () => {
    setEvaluationSummary((prev) => ({
      ...prev,
      signOffStatus: 'signed_off',
      signedOffBy: user?.name || 'Atty. Maria Victoria Santos',
      signedOffAt: new Date().toISOString()
    }));

    logAuditAction(
      'Signed Off AI Evaluation Benchmark',
      'settings',
      'eval_signoff',
      'EvaluationSummary',
      'Chat with Chel Evaluation',
      'signOffStatus: pending',
      `Signed off by ${user?.name || 'Admin'} for release.`
    );

    showSuccess('Evaluation Signed Off', 'Release evaluation officially certified.');
  };

  // --- Settings Actions ---
  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));

    logAuditAction(
      'Updated Application Settings',
      'settings',
      'app_config',
      'AppSettings',
      'Global App Config',
      JSON.stringify(settings).substring(0, 50) + '...',
      JSON.stringify(newSettings).substring(0, 50) + '...'
    );

    showSuccess('Settings Saved', 'System configurations updated.');
  };

  // Reset to Demo
  const resetAllData = () => {
    localStorage.clear();
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setEvents(INITIAL_EVENTS);
    setEventAttendees(INITIAL_EVENT_ATTENDEES);
    setChallenges(INITIAL_CHALLENGES);
    setChallengeProofs(INITIAL_CHALLENGE_PROOFS);
    setForumTopics(INITIAL_FORUM_TOPICS);
    setCommunityReports(INITIAL_COMMUNITY_REPORTS);
    setKeywordBlocklist(INITIAL_KEYWORD_BLOCKLIST);
    setUsers(INITIAL_USERS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setSettings(INITIAL_APP_SETTINGS);
    setRoleDefinitions(INITIAL_ROLE_DEFINITIONS);
    setChatDocuments(INITIAL_CHAT_DOCUMENTS);
    setChatConversations(INITIAL_CHAT_CONVERSATIONS);
    setDeclinedTopics(INITIAL_DECLINED_TOPICS);
    setAiConfig(INITIAL_AI_CONFIG);
    setPilotAccess(INITIAL_PILOT_ACCESS);
    setEvaluationSummary(INITIAL_EVALUATION_SUMMARY);
    setEvaluationMetrics(INITIAL_EVALUATION_METRICS);
    showSuccess('Reset to Initial Demo Data', 'All Phase 1 data records restored.');
  };

  return (
    <DataContext.Provider
      value={{
        announcements,
        createAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
        togglePinAnnouncement,
        publishAnnouncement,
        unpublishAnnouncement,
        events,
        eventAttendees,
        createEvent,
        updateEvent,
        cancelEvent,
        addEventAttendee,
        cancelRSVP,
        challenges,
        challengeProofs,
        createChallenge,
        updateChallenge,
        approveProof,
        rejectProof,
        bulkApproveProofs,
        forumTopics,
        createForumTopic,
        updateForumTopic,
        reorderForumTopic,
        archiveForumTopic,
        assignTopicModerator,
        communityReports,
        resolveReportAction,
        keywordBlocklist,
        addKeyword,
        removeKeyword,
        users,
        roleDefinitions,
        createUser,
        updateUserRole,
        updateModeratorPermissions,
        approveModeratorApplication,
        rejectModeratorApplication,
        processAccountDeletion,
        liftSanction,
        chatDocuments,
        uploadChatDocument,
        approveChatDocument,
        rejectChatDocument,
        startChatDocumentIndexing,
        reindexChatDocument,
        removeChatDocument,
        chatConversations,
        updateChatConversationReview,
        declinedTopics,
        addDeclinedTopic,
        updateDeclinedTopic,
        removeDeclinedTopic,
        toggleDeclinedTopicStatus,
        aiConfig,
        updateAIConfig,
        pilotAccess,
        updatePilotAccess,
        addPilotUser,
        removePilotUser,
        evaluationSummary,
        evaluationMetrics,
        runEvaluationSuite,
        signOffEvaluation,
        notifications,
        composeNotification,
        auditLogs,
        logAuditAction,
        settings,
        updateSettings,
        resetAllData
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

