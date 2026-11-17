// Diokno Volunteer App - Domain Types

export type UserRole = 'super_admin' | 'admin' | 'moderator' | 'volunteer' | 'member' | 'guest';

export type UserStatus = 'active' | 'muted' | 'suspended' | 'deletion_requested';

export type ModeratorPermission = 'forum_moderation' | 'proof_review' | 'content_drafting';

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
  points: number;
  moderatorPermissions?: ModeratorPermission[];
  age?: number;
  gender?: 'male' | 'female' | 'non_binary' | 'prefer_not_to_say';
  demographicsConsent?: boolean;
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
  status: 'going' | 'cancelled';
  checkedIn?: boolean;
  checkedInAt?: string;
  qrCodeId?: string;
  waitlisted?: boolean;
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
  adminRole: 'super_admin' | 'admin' | 'moderator';
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
  role: 'super_admin' | 'admin' | 'moderator';
  avatar: string;
  twoFactorEnabled: boolean;
  moderatorPermissions?: ModeratorPermission[];
}


// Chat with Chel Types
export type DocumentApprovalStatus = 'pending_approval' | 'approved' | 'rejected';
export type DocumentIndexingStatus = 'pending_approval' | 'ready_for_indexing' | 'indexing' | 'indexed' | 'indexing_failed' | 'reindex_required';
export type DocumentFileType = 'pdf' | 'docx' | 'transcript' | 'webpage';

export interface ChatDocument {
  id: string;
  title: string;
  description: string;
  fileType: DocumentFileType;
  fileName: string;
  fileSize: number; // in bytes
  source: string;
  uploadedBy: string;
  uploadedAt: string;
  approvalStatus: DocumentApprovalStatus;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  indexingStatus: DocumentIndexingStatus;
  indexedAt?: string;
  chunkCount?: number;
  lastUpdated: string;
}

export type ConversationFlagReason = 'inappropriate_question' | 'incorrect_response' | 'low_confidence' | 'user_report' | 'sensitive_topic';
export type ConversationReviewStatus = 'new' | 'under_review' | 'resolved' | 'dismissed';

export interface ChatConversation {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  messages: ChatMessage[];
  feedback?: 'positive' | 'negative';
  feedbackComment?: string;
  flagReason?: ConversationFlagReason;
  reviewStatus?: ConversationReviewStatus;
  reviewNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: ChatCitation[];
  confidence?: 'high' | 'medium' | 'low';
  timestamp: string;
}

export interface ChatCitation {
  documentId: string;
  documentTitle: string;
  excerpt: string;
  pageNumber?: number;
}

export interface DeclinedTopic {
  id: string;
  category: 'legal_advice' | 'pending_cases' | 'endorsements' | 'election_predictions' | 'private_individuals' | 'personal_data' | 'abusive_prompts' | 'jailbreak_attempts';
  title: string;
  description: string;
  samplePrompt: string;
  declineResponse: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface AIConfiguration {
  assistantName: string;
  description: string;
  defaultResponseStyle: 'formal' | 'conversational' | 'concise';
  useThirdPerson: boolean;
  supportFilipino: boolean;
  showCitations: boolean;
  dailyQuestionLimit: number;
  systemPrompt: string;
  aiDisclosure: string;
  lastUpdated: string;
  updatedBy: string;
}

// Roles & Access
export interface RoleDefinition {
  role: 'super_admin' | 'admin' | 'moderator';
  label: string;
  description: string;
  maxCount: number;
  currentCount: number;
  permissions: string[];
}

// Pilot Access & Evaluation for Chat with Chel
export interface PilotAccessSettings {
  adminAccess: boolean;
  moderatorAccess: boolean;
  memberGeneralRelease: boolean;
  pilotAllowlist: {
    id: string;
    name: string;
    email: string;
    addedAt: string;
    role: string;
  }[];
}

export interface EvaluationMetric {
  id: string;
  category: 'in_scope' | 'out_of_scope' | 'adversarial';
  question: string;
  expectedBehavior: string;
  lastTestedAt: string;
  status: 'passed' | 'failed' | 'needs_review';
  confidenceScore: number;
  responseSnippet: string;
}

export interface EvaluationSummary {
  totalQuestions: number;
  inScopeCount: number;
  outOfScopeCount: number;
  adversarialCount: number;
  passRate: number;
  lastRunDate: string;
  status: 'ready' | 'in_progress' | 'requires_action';
  signOffStatus: 'pending' | 'signed_off';
  signedOffBy?: string;
  signedOffAt?: string;
}

