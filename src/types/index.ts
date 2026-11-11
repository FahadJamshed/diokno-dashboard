// Diokno Volunteer App - Domain Types

export type UserRole = 'admin' | 'moderator' | 'volunteer';

export type UserStatus = 'active' | 'muted' | 'suspended' | 'deletion_requested';

export interface UserSanction {
  type: 'warning' | 'mute_24h' | 'mute_7d' | 'ban';
  reason: string;
  imposedBy: string;
  imposedAt: string;
  expiresAt?: string;
  active: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  isPhoneVerified: boolean;
  province: string;
  city: string;
  organization?: string;
  interests: string[];
  registeredAt: string;
  role: UserRole;
  status: UserStatus;
  profileCompletion: number; // percentage 0-100
  eventAttendanceCount: number;
  badgesEarned: string[];
  communityPostCount: number;
  moderatorApplicationStatus?: 'pending' | 'approved' | 'rejected';
  deletionRequestedAt?: string;
  sanctions: UserSanction[];
}

export type AnnouncementCategory = 'Social Media' | 'Legislative Updates' | 'Volunteer Events';
export type AnnouncementStatus = 'published' | 'draft' | 'scheduled' | 'unpublished';

export interface Announcement {
  id: string;
  title: string;
  category: AnnouncementCategory;
  content: string;
  images: string[];
  externalLink?: string;
  linkPreview?: {
    title: string;
    description: string;
    domain: string;
    imageUrl?: string;
  };
  associatedEventId?: string;
  isPinned: boolean;
  status: AnnouncementStatus;
  authorName: string;
  authorId: string;
  publishedAt?: string;
  scheduledAt?: string;
  createdAt: string;
  sendPushNotification: boolean;
  viewCount: number;
}

export type EventType = 'Townhall' | 'Legal Mission' | 'Community Outreach' | 'Volunteer Training' | 'Youth Rally' | 'Webinar';
export type EventStatus = 'upcoming' | 'in_progress' | 'completed' | 'cancelled';

export interface Event {
  id: string;
  title: string;
  description: string;
  eventType: EventType;
  startDateTime: string;
  endDateTime: string;
  venue: string;
  province: string;
  mapsUrl?: string;
  onlineMeetingUrl?: string;
  capacity: number;
  rsvpCount: number;
  attendanceCount: number;
  isMembersOnly: boolean;
  status: EventStatus;
  cancellationReason?: string;
  createdAt: string;
  bannerImage?: string;
}

export interface EventAttendee {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  userProvince: string;
  userRole: UserRole;
  rsvpDate: string;
  checkedIn: boolean;
  checkedInAt?: string;
  qrCodeId: string;
  waitlisted: boolean;
}

export interface ChallengeTask {
  id: string;
  title: string;
  instructions: string;
  acceptedProofTypes: ('photo' | 'video' | 'link')[];
  order: number;
}

export interface Challenge {
  id: string;
  name: string;
  month: string;
  year: number;
  description: string;
  badgeTitle: string;
  badgeImageUrl: string;
  startDate: string;
  closingDate: string;
  tasks: ChallengeTask[];
  participationCount: number;
  completionCount: number;
  status: 'published' | 'draft' | 'archived';
  createdAt: string;
}

export type ProofStatus = 'submitted' | 'pending_review' | 'approved' | 'rejected';
export type BadgeStatus = 'none' | 'provisional' | 'confirmed';

export interface ChallengeProof {
  id: string;
  challengeId: string;
  challengeName: string;
  taskId: string;
  taskTitle: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar: string;
  province: string;
  submittedAt: string;
  proofType: 'photo' | 'video' | 'link';
  proofUrl: string;
  proofNotes?: string;
  status: ProofStatus;
  badgeStatus: BadgeStatus;
  rejectionReason?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface ForumTopic {
  id: string;
  name: string;
  description: string;
  postCount: number;
  latestActivityAt: string;
  assignedModeratorId?: string;
  assignedModeratorName?: string;
  status: 'active' | 'archived';
  order: number;
}

export type ReportReason = 'Harassment' | 'Profanity' | 'Spam' | 'Misinformation' | 'Inappropriate content';
export type ReportStatus = 'pending' | 'reviewed' | 'dismissed' | 'action_taken';

export interface CommunityReport {
  id: string;
  postId: string;
  postTitle?: string;
  postSnippet: string;
  postFullContent: string;
  postAuthorId: string;
  postAuthorName: string;
  postAuthorAvatar: string;
  reportingUserId: string;
  reportingUserName: string;
  reason: ReportReason;
  submittedAt: string;
  status: ReportStatus;
  topicName: string;
  repliesCount: number;
  actionTaken?: string;
  actionNote?: string;
  moderatorId?: string;
  moderatorName?: string;
}

export interface KeywordBlockItem {
  id: string;
  word: string;
  language: 'en' | 'fil';
  addedAt: string;
  addedBy: string;
}

export type NotificationCategory = 'Announcements' | 'Events' | 'Community' | 'CHELlenges';
export type NotificationAudience = 'everyone' | 'members_only' | 'province' | 'event_rsvp';
export type NotificationStatus = 'sent' | 'scheduled' | 'draft' | 'failed';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  audience: NotificationAudience;
  targetProvince?: string;
  targetEventId?: string;
  targetEventName?: string;
  scheduledAt?: string;
  sentAt?: string;
  status: NotificationStatus;
  stats?: {
    sent: number;
    opened: number;
    failed: number;
  };
  createdBy: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  adminId: string;
  adminName: string;
  adminRole: 'admin' | 'moderator';
  action: string;
  category: 'announcements' | 'events' | 'challenges' | 'community' | 'users' | 'notifications' | 'settings' | 'auth';
  affectedRecordId: string;
  affectedRecordType: string;
  affectedRecordName: string;
  previousValue?: string;
  updatedValue?: string;
  timestamp: string;
  ipAddress?: string;
}

export interface AppSettings {
  minimumAppVersion: string;
  forcedUpdate: boolean;
  forcedUpdateMessage: string;
  featureFlags: {
    enableVoterEducationLeaderboard: boolean;
    enableInAppPushV2: boolean;
    enableCommunityDirectReplies: boolean;
    enableCivicBadgeQrSharing: boolean;
    enableLiveEventCheckInAlerts: boolean;
  };
  guidelinesEnglish: string;
  guidelinesFilipino: string;
  twoFactorEnforced: boolean;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'moderator';
  avatar: string;
  twoFactorEnabled: boolean;
}

