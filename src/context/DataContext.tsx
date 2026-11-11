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
  UserRole
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
  INITIAL_APP_SETTINGS
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

  // Events
  events: Event[];
  eventAttendees: EventAttendee[];
  createEvent: (event: Omit<Event, 'id' | 'createdAt' | 'rsvpCount' | 'attendanceCount'>) => { success: boolean; error?: string };
  updateEvent: (id: string, updates: Partial<Event>) => { success: boolean; error?: string };
  cancelEvent: (id: string, reason: string) => void;
  checkInAttendee: (attendeeId: string) => void;
  addEventAttendee: (eventId: string, userName: string, userEmail: string, userPhone: string, userProvince: string) => void;

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

  // Users
  users: User[];
  updateUserRole: (userId: string, newRole: UserRole) => { success: boolean; error?: string };
  approveModeratorApplication: (userId: string) => void;
  rejectModeratorApplication: (userId: string) => void;
  processAccountDeletion: (userId: string) => void;
  liftSanction: (userId: string) => void;

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

    const isWaitlist = event.rsvpCount >= event.capacity;
    const newAttendee: EventAttendee = {
      id: 'att-' + Math.random().toString(36).substring(2, 9),
      eventId,
      userId: 'usr-' + Math.random().toString(36).substring(2, 9),
      userName,
      userEmail,
      userPhone,
      userProvince,
      userRole: 'volunteer',
      rsvpDate: new Date().toISOString(),
      checkedIn: false,
      qrCodeId: `QR-${eventId.substring(0, 4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      waitlisted: isWaitlist
    };

    setEventAttendees((prev) => [newAttendee, ...prev]);
    if (!isWaitlist) {
      setEvents((prev) =>
        prev.map((e) => (e.id === eventId ? { ...e, rsvpCount: e.rsvpCount + 1 } : e))
      );
    }

    showSuccess(
      isWaitlist ? 'Added to Waitlist' : 'RSVP Registered',
      `${userName} registered for ${event.title}`
    );
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
  const updateUserRole = (userId: string, newRole: UserRole) => {
    const target = users.find((u) => u.id === userId);
    if (!target) return { success: false, error: 'User not found.' };

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
    showSuccess('Reset to Initial Demo Data', 'All data records restored.');
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
        checkInAttendee,
        addEventAttendee,
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
        updateUserRole,
        approveModeratorApplication,
        rejectModeratorApplication,
        processAccountDeletion,
        liftSanction,
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

