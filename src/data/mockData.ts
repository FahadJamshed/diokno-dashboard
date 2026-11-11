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
  AuthUser
} from '../types';

export const CURRENT_ADMIN: AuthUser = {
  id: 'usr-admin-01',
  name: 'Atty. Maria Victoria Santos',
  email: 'admin@diokno.ph',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  twoFactorEnabled: true,
};

export const CURRENT_MODERATOR: AuthUser = {
  id: 'usr-mod-01',
  name: 'Juan Paolo dela Cruz',
  email: 'mod.juan@diokno.ph',
  role: 'moderator',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  twoFactorEnabled: true,
};

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-001',
    name: 'Atty. Maria Victoria Santos',
    email: 'admin@diokno.ph',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    phone: '+63 917 123 4567',
    isPhoneVerified: true,
    province: 'Metro Manila',
    city: 'Quezon City',
    organization: 'Diokno National Volunteers HQ',
    interests: ['Legal Reform', 'Human Rights', 'Policy Advocacy'],
    registeredAt: '2025-01-15T08:00:00Z',
    role: 'admin',
    status: 'active',
    profileCompletion: 100,
    eventAttendanceCount: 24,
    badgesEarned: ['Founding Volunteer', 'Legal Luminary', 'Civic Champion 2025'],
    communityPostCount: 42,
    sanctions: []
  },
  {
    id: 'usr-002',
    name: 'Juan Paolo dela Cruz',
    email: 'mod.juan@diokno.ph',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phone: '+63 918 234 5678',
    isPhoneVerified: true,
    province: 'Metro Manila',
    city: 'Manila',
    organization: 'Youth for Chel – University Belt',
    interests: ['Youth Mobilization', 'Voter Education', 'Social Media'],
    registeredAt: '2025-02-01T09:30:00Z',
    role: 'moderator',
    status: 'active',
    profileCompletion: 100,
    eventAttendanceCount: 18,
    badgesEarned: ['Community Sentinel', 'Master Moderator', 'Voter Hero'],
    communityPostCount: 88,
    sanctions: []
  },
  {
    id: 'usr-003',
    name: 'Bea Clarisse Alcantara',
    email: 'bea.alcantara@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    phone: '+63 920 345 6789',
    isPhoneVerified: true,
    province: 'Cebu',
    city: 'Cebu City',
    organization: 'Akbayan Youth Cebu',
    interests: ['Grassroots Organizing', 'Environmental Action'],
    registeredAt: '2025-03-10T14:20:00Z',
    role: 'moderator',
    status: 'active',
    profileCompletion: 95,
    eventAttendanceCount: 15,
    badgesEarned: ['Visayas Champion', 'CHELlenge Master Oct 2025'],
    communityPostCount: 54,
    sanctions: []
  },
  {
    id: 'usr-004',
    name: 'Mark Lester Bautista',
    email: 'mark.bautista@student.up.edu.ph',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '+63 927 456 7890',
    isPhoneVerified: true,
    province: 'Pampanga',
    city: 'San Fernando',
    organization: 'Pampanga Civic Network',
    interests: ['Voter Registration', 'Youth Rallies'],
    registeredAt: '2025-04-12T11:00:00Z',
    role: 'volunteer',
    status: 'active',
    profileCompletion: 85,
    eventAttendanceCount: 7,
    badgesEarned: ['Voter Hero', 'First Responder'],
    communityPostCount: 12,
    moderatorApplicationStatus: 'pending',
    sanctions: []
  },
  {
    id: 'usr-005',
    name: 'Kristine Joy Mendoza',
    email: 'kristine.mendoza@yahoo.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    phone: '+63 908 567 8901',
    isPhoneVerified: true,
    province: 'Iloilo',
    city: 'Iloilo City',
    organization: 'Western Visayas Legal Aid Vol.',
    interests: ['Free Legal Advice', 'Community Forums'],
    registeredAt: '2025-05-18T16:45:00Z',
    role: 'volunteer',
    status: 'active',
    profileCompletion: 90,
    eventAttendanceCount: 9,
    badgesEarned: ['Legal Mission Aide', 'CHELlenge Oct 2025'],
    communityPostCount: 23,
    sanctions: []
  },
  {
    id: 'usr-006',
    name: 'Rafael Jose David',
    email: 'rj.david@techcorp.ph',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    phone: '+63 915 678 9012',
    isPhoneVerified: false,
    province: 'Batangas',
    city: 'Lipa City',
    organization: 'Civic Tech Philippines',
    interests: ['Tech for Democracy', 'Data Analytics'],
    registeredAt: '2025-06-22T10:15:00Z',
    role: 'volunteer',
    status: 'active',
    profileCompletion: 60,
    eventAttendanceCount: 3,
    badgesEarned: ['New Volunteer'],
    communityPostCount: 4,
    sanctions: []
  },
  {
    id: 'usr-007',
    name: 'Danilo Christian Sison',
    email: 'dan.sison99@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    phone: '+63 922 789 0123',
    isPhoneVerified: true,
    province: 'Pangasinan',
    city: 'Dagupan City',
    organization: '',
    interests: ['Grassroots Advocacy'],
    registeredAt: '2025-07-05T13:30:00Z',
    role: 'volunteer',
    status: 'muted',
    profileCompletion: 70,
    eventAttendanceCount: 2,
    badgesEarned: [],
    communityPostCount: 19,
    sanctions: [
      {
        type: 'mute_24h',
        reason: 'Violated community guidelines: aggressive trolling and profanity in Legal Aid topic',
        imposedBy: 'Juan Paolo dela Cruz',
        imposedAt: '2025-11-10T14:00:00Z',
        expiresAt: '2025-11-11T14:00:00Z',
        active: true
      }
    ]
  },
  {
    id: 'usr-008',
    name: 'Camille Anne Reyes',
    email: 'camille.reyes@dlsu.edu.ph',
    avatar: 'https://images.unsplash.com/photo-1534751516642-a171ed282186?w=150&auto=format&fit=crop&q=80',
    phone: '+63 919 890 1234',
    isPhoneVerified: true,
    province: 'Metro Manila',
    city: 'Pasig City',
    organization: 'Youth Advocates for Governance',
    interests: ['Anti-Corruption', 'Educational Drives'],
    registeredAt: '2025-08-14T08:20:00Z',
    role: 'volunteer',
    status: 'deletion_requested',
    deletionRequestedAt: '2025-11-09T17:30:00Z',
    profileCompletion: 80,
    eventAttendanceCount: 5,
    badgesEarned: ['Civic Contributor'],
    communityPostCount: 8,
    sanctions: []
  },
  {
    id: 'usr-009',
    name: 'Arvin Gabriel Cruz',
    email: 'arvin.cruz@outlook.com',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    phone: '+63 939 901 2345',
    isPhoneVerified: true,
    province: 'Davao del Sur',
    city: 'Davao City',
    organization: 'Mindanao Peace & Rights Forum',
    interests: ['Peacebuilding', 'Legal Education'],
    registeredAt: '2025-08-30T15:10:00Z',
    role: 'volunteer',
    status: 'active',
    profileCompletion: 90,
    eventAttendanceCount: 6,
    badgesEarned: ['Mindanao Pathfinder'],
    communityPostCount: 15,
    moderatorApplicationStatus: 'pending',
    sanctions: []
  },
  {
    id: 'usr-010',
    name: 'Patricia Louise Tan',
    email: 'patty.tan@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
    phone: '+63 928 012 3456',
    isPhoneVerified: true,
    province: 'Albay',
    city: 'Legazpi City',
    organization: 'Bicol University Student Council',
    interests: ['Disaster Relief', 'Civic Action'],
    registeredAt: '2025-09-12T12:00:00Z',
    role: 'volunteer',
    status: 'active',
    profileCompletion: 100,
    eventAttendanceCount: 8,
    badgesEarned: ['Disaster Volunteer Hero', 'CHELlenge Oct 2025'],
    communityPostCount: 31,
    sanctions: []
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-001',
    title: 'Free Legal Aid Caravan Rolls Out to 5 Luzon Provinces this November',
    category: 'Volunteer Events',
    content: 'Rep. Chel Diokno and the Free Legal Assistance Group (FLAG) volunteer attorneys will be holding mobile legal consultations across Bulacan, Pampanga, Tarlac, Pangasinan, and Nueva Ecija. We are calling all local volunteers to assist in logistics, triage, and registration.',
    images: [
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop&q=80'
    ],
    externalLink: 'https://cheldiokno.ph/legal-caravan',
    linkPreview: {
      title: 'Free Legal Assistance Group (FLAG) Caravan 2025',
      description: 'Schedule, locations, and volunteer deployment guide for mobile legal clinic.',
      domain: 'cheldiokno.ph',
      imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80'
    },
    associatedEventId: 'evt-001',
    isPinned: true,
    status: 'published',
    authorName: 'Atty. Maria Victoria Santos',
    authorId: 'usr-admin-01',
    publishedAt: '2025-11-01T08:00:00Z',
    createdAt: '2025-10-30T10:00:00Z',
    sendPushNotification: true,
    viewCount: 3840
  },
  {
    id: 'ann-002',
    title: 'Legislative Update: House Bill on Judicial Reform & Speedy Trial Filed',
    category: 'Legislative Updates',
    content: 'Rep. Chel Diokno has officially sponsored House Bill No. 8920, the Judicial Efficiency and Speedy Trial Act. The bill proposes digitized court filings, strict trial calendar enforcement, and increased support for indigent litigants.',
    images: [
      'https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=600&auto=format&fit=crop&q=80'
    ],
    externalLink: 'https://congress.gov.ph/legisdocs/basic_19/HB08920.pdf',
    linkPreview: {
      title: 'House Bill No. 8920 - Full Text & Explanatory Note',
      description: 'An Act instituting mandatory electronic docketing and timeline guarantees in lower trial courts.',
      domain: 'congress.gov.ph',
      imageUrl: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=600&auto=format&fit=crop&q=80'
    },
    isPinned: true,
    status: 'published',
    authorName: 'Atty. Maria Victoria Santos',
    authorId: 'usr-admin-01',
    publishedAt: '2025-11-04T10:30:00Z',
    createdAt: '2025-11-03T14:15:00Z',
    sendPushNotification: true,
    viewCount: 4920
  },
  {
    id: 'ann-003',
    title: 'November CHELlenge Kickoff: Voter Rights Sprint & Civic Action',
    category: 'Social Media',
    content: 'Get your exclusive November Civic Champion badge! Complete 5 actionable tasks including voter registration verification, hosting a human rights circle, and barangay engagement. Join thousands of youth leaders nationwide.',
    images: [
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&auto=format&fit=crop&q=80'
    ],
    isPinned: true, // 3rd pinned announcement (max 3!)
    status: 'published',
    authorName: 'Juan Paolo dela Cruz',
    authorId: 'usr-mod-01',
    publishedAt: '2025-11-01T09:00:00Z',
    createdAt: '2025-10-31T16:00:00Z',
    sendPushNotification: true,
    viewCount: 6150
  },
  {
    id: 'ann-004',
    title: 'Volunteers Needed: UP Diliman People’s Townhall Logistics Team',
    category: 'Volunteer Events',
    content: 'We need 30 volunteer ushers, sound engineers, and crowd marshals for the upcoming Townhall on November 20 at UP Theater. Orientation will be conducted via Zoom this coming Saturday.',
    images: [],
    associatedEventId: 'evt-002',
    isPinned: false,
    status: 'published',
    authorName: 'Atty. Maria Victoria Santos',
    authorId: 'usr-admin-01',
    publishedAt: '2025-11-06T11:00:00Z',
    createdAt: '2025-11-05T12:00:00Z',
    sendPushNotification: false,
    viewCount: 1820
  },
  {
    id: 'ann-005',
    title: 'Special Live Stream: Ask Atty. Chel – Legal Questions on Cyber Libel',
    category: 'Social Media',
    content: 'Join Rep. Chel Diokno live on Facebook and YouTube as he tackles pressing questions on freedom of speech, cyber libel laws, and defending digital rights in the Philippines.',
    images: [
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80'
    ],
    externalLink: 'https://youtube.com/cheldiokno',
    isPinned: false,
    status: 'scheduled',
    scheduledAt: '2025-11-15T18:00:00Z',
    authorName: 'Juan Paolo dela Cruz',
    authorId: 'usr-mod-01',
    createdAt: '2025-11-08T09:00:00Z',
    sendPushNotification: true,
    viewCount: 0
  },
  {
    id: 'ann-006',
    title: 'Draft: Year-End Volunteer Recognition Gala & Community Assembly',
    category: 'Volunteer Events',
    content: 'Celebrating the incredible hard work of our 10,000+ volunteers across 17 regions. Award categories include Most Active Chapter, Outstanding Legal Clinic Volunteer, and Youth Organizer of the Year.',
    images: [],
    isPinned: false,
    status: 'draft',
    authorName: 'Atty. Maria Victoria Santos',
    authorId: 'usr-admin-01',
    createdAt: '2025-11-09T14:30:00Z',
    sendPushNotification: false,
    viewCount: 0
  }
];

export const INITIAL_EVENTS: Event[] = [
  {
    id: 'evt-001',
    title: 'People’s Legislative Townhall – UP Diliman Theater',
    description: 'An open dialogue with Rep. Chel Diokno discussing the upcoming budget deliberations, judicial reform bills, and student welfare initiatives. Open to all students, civil society members, and volunteers.',
    eventType: 'Townhall',
    startDateTime: '2025-11-20T14:00:00Z',
    endDateTime: '2025-11-20T17:30:00Z',
    venue: 'University Theater, Osmeña Ave, Diliman',
    province: 'Metro Manila',
    mapsUrl: 'https://maps.google.com/?q=UP+Theater+Diliman',
    capacity: 500,
    rsvpCount: 482,
    attendanceCount: 0,
    isMembersOnly: false,
    status: 'upcoming',
    createdAt: '2025-10-25T08:00:00Z',
    bannerImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'evt-002',
    title: 'FLAG Mobile Free Legal Consultation Caravan – Barangay Payatas',
    description: 'Free face-to-face legal assistance for indigent residents, covering family law, tenant disputes, labor rights, and barangay conciliation. Free legal notarization and consultation provided on-site.',
    eventType: 'Legal Mission',
    startDateTime: '2025-11-23T08:30:00Z',
    endDateTime: '2025-11-23T15:00:00Z',
    venue: 'Payatas Covered Court, Lupang Pangako',
    province: 'Metro Manila',
    mapsUrl: 'https://maps.google.com/?q=Barangay+Payatas+Covered+Court',
    capacity: 200,
    rsvpCount: 198,
    attendanceCount: 0,
    isMembersOnly: false,
    status: 'upcoming',
    createdAt: '2025-10-28T09:15:00Z',
    bannerImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'evt-003',
    title: 'Visayas Civic Leaders Summit & Volunteer Training',
    description: 'Regional capacity-building workshop for volunteer organizers across Cebu, Bohol, Negros Oriental, and Leyte. Focus on digital advocacy, community fact-checking, and grassroots mobilization.',
    eventType: 'Volunteer Training',
    startDateTime: '2025-11-29T09:00:00Z',
    endDateTime: '2025-11-29T16:00:00Z',
    venue: 'Cebu City Sports Center Activity Hall',
    province: 'Cebu',
    mapsUrl: 'https://maps.google.com/?q=Cebu+City+Sports+Complex',
    capacity: 250,
    rsvpCount: 250,
    attendanceCount: 0,
    isMembersOnly: true,
    status: 'upcoming',
    createdAt: '2025-11-01T10:00:00Z',
    bannerImage: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'evt-004',
    title: 'Online National Volunteer Briefing: Q4 2025 Legislative Road Ahead',
    description: 'Quarterly virtual general assembly. Atty. Chel Diokno will present key legislative victories in Congress and discuss priority community bills for early 2026.',
    eventType: 'Webinar',
    startDateTime: '2025-11-18T19:00:00Z',
    endDateTime: '2025-11-18T20:30:00Z',
    venue: 'Zoom / YouTube Private Volunteer Live',
    province: 'Metro Manila',
    onlineMeetingUrl: 'https://zoom.us/j/9823471829',
    capacity: 1000,
    rsvpCount: 840,
    attendanceCount: 0,
    isMembersOnly: true,
    status: 'upcoming',
    createdAt: '2025-11-02T11:30:00Z',
    bannerImage: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'evt-005',
    title: 'Iloilo Youth for Good Governance Rally & Concert',
    description: 'Youth solidarity concert featuring local indie artists and keynote speech from Atty. Chel Diokno. Celebrating youth participation in democratic institution-building.',
    eventType: 'Youth Rally',
    startDateTime: '2025-10-25T16:00:00Z',
    endDateTime: '2025-10-25T21:00:00Z',
    venue: 'Iloilo Provincial Capitol Amphitheater',
    province: 'Iloilo',
    capacity: 600,
    rsvpCount: 590,
    attendanceCount: 542,
    isMembersOnly: false,
    status: 'completed',
    createdAt: '2025-10-01T12:00:00Z',
    bannerImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'evt-006',
    title: 'Barangay Health & Human Rights Outreach – Lipa City',
    description: 'Medical and legal mission in coordination with local healthcare workers. Event cancelled due to typhoon signal warnings across Batangas.',
    eventType: 'Community Outreach',
    startDateTime: '2025-10-18T08:00:00Z',
    endDateTime: '2025-10-18T14:00:00Z',
    venue: 'Plaza Independencia Covered Court, Lipa',
    province: 'Batangas',
    capacity: 150,
    rsvpCount: 132,
    attendanceCount: 0,
    isMembersOnly: false,
    status: 'cancelled',
    cancellationReason: 'PAGASA Severe Tropical Storm Warning Signal #2 over Southern Tagalog region.',
    createdAt: '2025-09-28T09:00:00Z'
  }
];

export const INITIAL_EVENT_ATTENDEES: EventAttendee[] = [
  {
    id: 'att-001',
    eventId: 'evt-001',
    userId: 'usr-004',
    userName: 'Mark Lester Bautista',
    userEmail: 'mark.bautista@student.up.edu.ph',
    userPhone: '+63 927 456 7890',
    userProvince: 'Pampanga',
    userRole: 'volunteer',
    rsvpDate: '2025-10-26T10:00:00Z',
    checkedIn: false,
    qrCodeId: 'QR-EVT1-USR4-7890',
    waitlisted: false
  },
  {
    id: 'att-002',
    eventId: 'evt-001',
    userId: 'usr-006',
    userName: 'Rafael Jose David',
    userEmail: 'rj.david@techcorp.ph',
    userPhone: '+63 915 678 9012',
    userProvince: 'Batangas',
    userRole: 'volunteer',
    rsvpDate: '2025-10-27T11:20:00Z',
    checkedIn: false,
    qrCodeId: 'QR-EVT1-USR6-9012',
    waitlisted: false
  },
  {
    id: 'att-003',
    eventId: 'evt-001',
    userId: 'usr-002',
    userName: 'Juan Paolo dela Cruz',
    userEmail: 'mod.juan@diokno.ph',
    userPhone: '+63 918 234 5678',
    userProvince: 'Metro Manila',
    userRole: 'moderator',
    rsvpDate: '2025-10-25T08:30:00Z',
    checkedIn: true,
    checkedInAt: '2025-11-20T13:45:00Z',
    qrCodeId: 'QR-EVT1-USR2-5678',
    waitlisted: false
  },
  {
    id: 'att-004',
    eventId: 'evt-005',
    userId: 'usr-005',
    userName: 'Kristine Joy Mendoza',
    userEmail: 'kristine.mendoza@yahoo.com',
    userPhone: '+63 908 567 8901',
    userProvince: 'Iloilo',
    userRole: 'volunteer',
    rsvpDate: '2025-10-05T14:00:00Z',
    checkedIn: true,
    checkedInAt: '2025-10-25T15:30:00Z',
    qrCodeId: 'QR-EVT5-USR5-8901',
    waitlisted: false
  },
  {
    id: 'att-005',
    eventId: 'evt-003',
    userId: 'usr-003',
    userName: 'Bea Clarisse Alcantara',
    userEmail: 'bea.alcantara@gmail.com',
    userPhone: '+63 920 345 6789',
    userProvince: 'Cebu',
    userRole: 'moderator',
    rsvpDate: '2025-11-02T09:00:00Z',
    checkedIn: false,
    qrCodeId: 'QR-EVT3-USR3-6789',
    waitlisted: false
  }
];

export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'chl-2025-11',
    name: 'November Civic Action & Voter Education Sprint',
    month: 'November',
    year: 2025,
    description: 'Empowering communities through voter rights awareness, civic participation, and community action. Complete at least 4 tasks to earn the November 2025 Civic Hero badge.',
    badgeTitle: 'November Civic Champion 2025',
    badgeImageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=300&auto=format&fit=crop&q=80',
    startDate: '2025-11-01T00:00:00Z',
    closingDate: '2025-11-30T23:59:59Z',
    participationCount: 1620,
    completionCount: 480,
    status: 'published',
    createdAt: '2025-10-25T12:00:00Z',
    tasks: [
      {
        id: 'tsk-101',
        title: 'Task 1: Verify Voter Registration Status',
        instructions: 'Check your status via COMELEC online portal or local office. Submit a screenshot or photo confirmation of your voter registration verification.',
        acceptedProofTypes: ['photo'],
        order: 1
      },
      {
        id: 'tsk-102',
        title: 'Task 2: Share Chel Diokno Human Rights Infographic',
        instructions: 'Share our official know-your-rights primer on social media (Facebook, Instagram, or X). Submit the public post URL or screenshot.',
        acceptedProofTypes: ['link', 'photo'],
        order: 2
      },
      {
        id: 'tsk-103',
        title: 'Task 3: Host or Attend a 3-Person Civic Study Circle',
        instructions: 'Gather at least 2 friends, schoolmates, or neighbors to discuss basic constitutional rights or local community concerns. Upload a photo or short video clip.',
        acceptedProofTypes: ['photo', 'video'],
        order: 3
      },
      {
        id: 'tsk-104',
        title: 'Task 4: Attend Local Barangay Council Session or Townhall',
        instructions: 'Visit your local barangay hall during public hearings or attend one of our physical/virtual townhalls. Submit photo proof with date stamp.',
        acceptedProofTypes: ['photo'],
        order: 4
      },
      {
        id: 'tsk-105',
        title: 'Task 5: Community Service or Coastal/Street Clean-up',
        instructions: 'Volunteer for at least 2 hours in a community feeding, clean-up, or book drive. Submit photo proof showing your participation.',
        acceptedProofTypes: ['photo', 'video'],
        order: 5
      }
    ]
  },
  {
    id: 'chl-2025-10',
    name: 'October Barangay Empowerment CHELlenge',
    month: 'October',
    year: 2025,
    description: 'Focusing on grassroots democracy, local community dialogue, and legal aid volunteer coordination.',
    badgeTitle: 'October Grassroots Sentinel',
    badgeImageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=300&auto=format&fit=crop&q=80',
    startDate: '2025-10-01T00:00:00Z',
    closingDate: '2025-10-31T23:59:59Z',
    participationCount: 2840,
    completionCount: 1940,
    status: 'archived',
    createdAt: '2025-09-20T10:00:00Z',
    tasks: [
      {
        id: 'tsk-001',
        title: 'Task 1: Barangay Issue Mapping',
        instructions: 'Document three main civic challenges in your barangay.',
        acceptedProofTypes: ['photo', 'link'],
        order: 1
      },
      {
        id: 'tsk-002',
        title: 'Task 2: Recruit 2 New Diokno Volunteers',
        instructions: 'Invite two peers to install and register on the Diokno Volunteer App.',
        acceptedProofTypes: ['photo'],
        order: 2
      },
      {
        id: 'tsk-003',
        title: 'Task 3: Participate in Flag Caravan Support',
        instructions: 'Volunteer on-site or assist online triage for legal consultations.',
        acceptedProofTypes: ['photo', 'video'],
        order: 3
      }
    ]
  },
  {
    id: 'chl-2025-12',
    name: 'December Holiday Solidarity & Community Gift Giving',
    month: 'December',
    year: 2025,
    description: 'Year-end civic drive mobilizing volunteers for food pack distributions, children book drives, and indigent community support.',
    badgeTitle: 'December Solidarity Star 2025',
    badgeImageUrl: 'https://images.unsplash.com/photo-1513297887119-d46091b24bfa?w=300&auto=format&fit=crop&q=80',
    startDate: '2025-12-01T00:00:00Z',
    closingDate: '2025-12-31T23:59:59Z',
    participationCount: 0,
    completionCount: 0,
    status: 'draft',
    createdAt: '2025-11-05T14:00:00Z',
    tasks: [
      {
        id: 'tsk-201',
        title: 'Task 1: Donate 3 Children Books to Public Library',
        instructions: 'Take a photo handing over story books or learning materials to a local daycare or public library.',
        acceptedProofTypes: ['photo'],
        order: 1
      },
      {
        id: 'tsk-202',
        title: 'Task 2: Food Pack Packing or Distribution Shift',
        instructions: 'Join our local volunteer center in packing disaster relief / holiday packs.',
        acceptedProofTypes: ['photo', 'video'],
        order: 2
      },
      {
        id: 'tsk-203',
        title: 'Task 3: Share Your 2025 Volunteer Story',
        instructions: 'Post a 1-minute video reflection on what serving your community taught you this year.',
        acceptedProofTypes: ['video', 'link'],
        order: 3
      }
    ]
  }
];

export const INITIAL_CHALLENGE_PROOFS: ChallengeProof[] = [
  {
    id: 'prf-001',
    challengeId: 'chl-2025-11',
    challengeName: 'November Civic Action & Voter Education Sprint',
    taskId: 'tsk-101',
    taskTitle: 'Task 1: Verify Voter Registration Status',
    userId: 'usr-004',
    userName: 'Mark Lester Bautista',
    userEmail: 'mark.bautista@student.up.edu.ph',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    province: 'Pampanga',
    submittedAt: '2025-11-10T11:20:00Z',
    proofType: 'photo',
    proofUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&auto=format&fit=crop&q=80',
    proofNotes: 'Verified at COMELEC San Fernando office! Active voter in Precinct 0041B.',
    status: 'pending_review',
    badgeStatus: 'provisional'
  },
  {
    id: 'prf-002',
    challengeId: 'chl-2025-11',
    challengeName: 'November Civic Action & Voter Education Sprint',
    taskId: 'tsk-102',
    taskTitle: 'Task 2: Share Chel Diokno Human Rights Infographic',
    userId: 'usr-006',
    userName: 'Rafael Jose David',
    userEmail: 'rj.david@techcorp.ph',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    province: 'Batangas',
    submittedAt: '2025-11-10T09:45:00Z',
    proofType: 'link',
    proofUrl: 'https://facebook.com/rj.david/posts/10928374829',
    proofNotes: 'Shared on my personal FB wall with 1,200 friends. Reached 45 shares already!',
    status: 'pending_review',
    badgeStatus: 'provisional'
  },
  {
    id: 'prf-003',
    challengeId: 'chl-2025-11',
    challengeName: 'November Civic Action & Voter Education Sprint',
    taskId: 'tsk-103',
    taskTitle: 'Task 3: Host or Attend a 3-Person Civic Study Circle',
    userId: 'usr-005',
    userName: 'Kristine Joy Mendoza',
    userEmail: 'kristine.mendoza@yahoo.com',
    userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    province: 'Iloilo',
    submittedAt: '2025-11-09T16:15:00Z',
    proofType: 'photo',
    proofUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80',
    proofNotes: 'Conducted study circle at UP Visayas library with 4 pre-law peers on the Bill of Rights.',
    status: 'approved',
    badgeStatus: 'confirmed',
    reviewedBy: 'Juan Paolo dela Cruz',
    reviewedAt: '2025-11-10T10:00:00Z'
  },
  {
    id: 'prf-004',
    challengeId: 'chl-2025-11',
    challengeName: 'November Civic Action & Voter Education Sprint',
    taskId: 'tsk-105',
    taskTitle: 'Task 5: Community Service or Coastal/Street Clean-up',
    userId: 'usr-010',
    userName: 'Patricia Louise Tan',
    userEmail: 'patty.tan@gmail.com',
    userAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
    province: 'Albay',
    submittedAt: '2025-11-08T14:30:00Z',
    proofType: 'photo',
    proofUrl: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800&auto=format&fit=crop&q=80',
    proofNotes: 'Participated in Legazpi coastal cleanup alongside 40 student volunteers.',
    status: 'approved',
    badgeStatus: 'confirmed',
    reviewedBy: 'Atty. Maria Victoria Santos',
    reviewedAt: '2025-11-09T08:30:00Z'
  },
  {
    id: 'prf-005',
    challengeId: 'chl-2025-11',
    challengeName: 'November Civic Action & Voter Education Sprint',
    taskId: 'tsk-101',
    taskTitle: 'Task 1: Verify Voter Registration Status',
    userId: 'usr-007',
    userName: 'Danilo Christian Sison',
    userEmail: 'dan.sison99@gmail.com',
    userAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    province: 'Pangasinan',
    submittedAt: '2025-11-07T12:00:00Z',
    proofType: 'photo',
    proofUrl: 'https://images.unsplash.com/photo-1584433144859-1fc3ab64a957?w=800&auto=format&fit=crop&q=80',
    proofNotes: 'Random blurry photo with no COMELEC document or name visible.',
    status: 'rejected',
    badgeStatus: 'none',
    rejectionReason: 'The submitted photo is too blurry and does not display any legible COMELEC voter certificate or official precinct stub.',
    reviewedBy: 'Juan Paolo dela Cruz',
    reviewedAt: '2025-11-07T15:00:00Z'
  },
  {
    id: 'prf-006',
    challengeId: 'chl-2025-11',
    challengeName: 'November Civic Action & Voter Education Sprint',
    taskId: 'tsk-104',
    taskTitle: 'Task 4: Attend Local Barangay Council Session or Townhall',
    userId: 'usr-009',
    userName: 'Arvin Gabriel Cruz',
    userEmail: 'arvin.cruz@outlook.com',
    userAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    province: 'Davao del Sur',
    submittedAt: '2025-11-10T14:10:00Z',
    proofType: 'photo',
    proofUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&auto=format&fit=crop&q=80',
    proofNotes: 'Attended Barangay Matina Aplaya session on youth sports and disaster preparedness.',
    status: 'pending_review',
    badgeStatus: 'provisional'
  }
];

export const INITIAL_FORUM_TOPICS: ForumTopic[] = [
  {
    id: 'top-001',
    name: 'Know Your Rights & Legal Aid Q&A',
    description: 'Post legal questions for volunteer attorneys, FLAG updates, and discussion on constitutional rights.',
    postCount: 420,
    latestActivityAt: '2025-11-11T13:40:00Z',
    assignedModeratorId: 'usr-002',
    assignedModeratorName: 'Juan Paolo dela Cruz',
    status: 'active',
    order: 1
  },
  {
    id: 'top-002',
    name: 'Youth for Chel – Campus & Youth Chapters',
    description: 'Connecting student leaders, high school advocates, and youth councils across Luzon, Visayas, and Mindanao.',
    postCount: 890,
    latestActivityAt: '2025-11-11T14:15:00Z',
    assignedModeratorId: 'usr-003',
    assignedModeratorName: 'Bea Clarisse Alcantara',
    status: 'active',
    order: 2
  },
  {
    id: 'top-003',
    name: 'Barangay Volunteer Initiatives & Clean-ups',
    description: 'Share your local community drives, feeding programs, tree planting, and civic mobilization stories.',
    postCount: 312,
    latestActivityAt: '2025-11-10T18:20:00Z',
    assignedModeratorId: 'usr-002',
    assignedModeratorName: 'Juan Paolo dela Cruz',
    status: 'active',
    order: 3
  },
  {
    id: 'top-004',
    name: 'Legislative Watch & House Floor Debates',
    description: 'Track bills sponsored by Rep. Chel Diokno, committee hearings, and legislative research collaborations.',
    postCount: 260,
    latestActivityAt: '2025-11-09T16:00:00Z',
    assignedModeratorId: 'usr-admin-01',
    assignedModeratorName: 'Atty. Maria Victoria Santos',
    status: 'active',
    order: 4
  },
  {
    id: 'top-005',
    name: 'CHELlenge Monthly Highlights & Tips',
    description: 'Share tips on completing tasks, showcase your badges, and encourage fellow volunteers.',
    postCount: 540,
    latestActivityAt: '2025-11-11T11:00:00Z',
    assignedModeratorId: 'usr-002',
    assignedModeratorName: 'Juan Paolo dela Cruz',
    status: 'active',
    order: 5
  },
  {
    id: 'top-006',
    name: 'Archived: 2024 General Campaign Discussions',
    description: 'Historic volunteer campaign memories and archived working threads.',
    postCount: 1450,
    latestActivityAt: '2024-12-31T23:00:00Z',
    status: 'archived',
    order: 6
  }
];

export const INITIAL_COMMUNITY_REPORTS: CommunityReport[] = [
  {
    id: 'rep-001',
    postId: 'pst-901',
    postTitle: 'Trolling on Legal Caravan in Pangasinan',
    postSnippet: 'Walang kwenta tong mga abogado na to puro yabang lang kayo...',
    postFullContent: 'Walang kwenta tong mga abogado na to puro yabang lang kayo, puro pulitika lang ginagawa nyo imbes na tumahimik kayo. Mga bayaran kayo ng oposisyon!',
    postAuthorId: 'usr-007',
    postAuthorName: 'Danilo Christian Sison',
    postAuthorAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    reportingUserId: 'usr-005',
    reportingUserName: 'Kristine Joy Mendoza',
    reason: 'Harassment',
    submittedAt: '2025-11-10T13:15:00Z',
    status: 'pending',
    topicName: 'Know Your Rights & Legal Aid Q&A',
    repliesCount: 4
  },
  {
    id: 'rep-002',
    postId: 'pst-902',
    postSnippet: 'Check this crypto trading bot guaranteed 200% returns in 7 days telegram @scamlink...',
    postFullContent: 'Make money while volunteering! Check this crypto trading bot guaranteed 200% returns in 7 days telegram @scamlink guaranteed legit payout.',
    postAuthorId: 'usr-bot-99',
    postAuthorName: 'CryptoSignalsPH',
    postAuthorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    reportingUserId: 'usr-004',
    reportingUserName: 'Mark Lester Bautista',
    reason: 'Spam',
    submittedAt: '2025-11-10T14:40:00Z',
    status: 'pending',
    topicName: 'Youth for Chel – Campus & Youth Chapters',
    repliesCount: 0
  },
  {
    id: 'rep-003',
    postId: 'pst-903',
    postSnippet: 'G*go ka ba bakit mo sinasabi na bawal magrally sa UP tang*na mo...',
    postFullContent: 'G*go ka ba bakit mo sinasabi na bawal magrally sa UP tang*na mo basahin mo kaya ang UP-DND Accord bago ka magkalat ng kabobohan dito!',
    postAuthorId: 'usr-304',
    postAuthorName: 'Leo Gonzales',
    postAuthorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    reportingUserId: 'usr-006',
    reportingUserName: 'Rafael Jose David',
    reason: 'Profanity',
    submittedAt: '2025-11-09T18:00:00Z',
    status: 'action_taken',
    actionTaken: 'Muted user for 24 hours & locked post',
    actionNote: 'Violation of Rule 1: Respectful Dialogue. Warning issued to user account.',
    moderatorId: 'usr-002',
    moderatorName: 'Juan Paolo dela Cruz',
    topicName: 'Legislative Watch & House Floor Debates',
    repliesCount: 12
  },
  {
    id: 'rep-004',
    postId: 'pst-904',
    postSnippet: 'Fake news post claiming the November Townhall has been moved to December...',
    postFullContent: 'Announcement to all: The Nov 20 townhall at UP Theater is cancelled and moved to Dec 15 due to university conflict. Do not go on Nov 20!',
    postAuthorId: 'usr-512',
    postAuthorName: 'Anonymous Student',
    postAuthorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    reportingUserId: 'usr-002',
    reportingUserName: 'Juan Paolo dela Cruz',
    reason: 'Misinformation',
    submittedAt: '2025-11-09T09:30:00Z',
    status: 'action_taken',
    actionTaken: 'Removed post & warned user',
    actionNote: 'False information regarding official event dates. Confirmed with UP Admin that schedule remains Nov 20.',
    moderatorId: 'usr-admin-01',
    moderatorName: 'Atty. Maria Victoria Santos',
    topicName: 'Youth for Chel – Campus & Youth Chapters',
    repliesCount: 6
  },
  {
    id: 'rep-005',
    postId: 'pst-905',
    postSnippet: 'Someone sharing unverified personal phone numbers of local coordinators...',
    postFullContent: 'Here is the direct personal mobile of coordinator in District 2: 0917-xxx-xxxx, call him anytime for questions.',
    postAuthorId: 'usr-611',
    postAuthorName: 'Marvin Santos',
    postAuthorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    reportingUserId: 'usr-003',
    reportingUserName: 'Bea Clarisse Alcantara',
    reason: 'Inappropriate content',
    submittedAt: '2025-11-08T15:00:00Z',
    status: 'action_taken',
    actionTaken: 'Removed post (Data Privacy violation)',
    actionNote: 'Personal identifiable data removed per Philippine Data Privacy Act compliance.',
    moderatorId: 'usr-003',
    moderatorName: 'Bea Clarisse Alcantara',
    topicName: 'Barangay Volunteer Initiatives & Clean-ups',
    repliesCount: 1
  },
  {
    id: 'rep-006',
    postId: 'pst-906',
    postSnippet: 'Repeated advertising of unofficial branded T-shirts and merchandise...',
    postFullContent: 'Buy your official Chel shirts here! 500 pesos only, order via GCash number 0922-333-4444.',
    postAuthorId: 'usr-819',
    postAuthorName: 'MerchStore PH',
    postAuthorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    reportingUserId: 'usr-004',
    reportingUserName: 'Mark Lester Bautista',
    reason: 'Spam',
    submittedAt: '2025-11-10T16:00:00Z',
    status: 'pending',
    topicName: 'CHELlenge Monthly Highlights & Tips',
    repliesCount: 2
  },
  {
    id: 'rep-007',
    postId: 'pst-907',
    postSnippet: 'Debate on legal aid funding escalated into personal insults...',
    postFullContent: 'Tarantado ka wala kang alam sa budgeting, wag kang makialam dito.',
    postAuthorId: 'usr-412',
    postAuthorName: 'Gary Soriano',
    postAuthorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    reportingUserId: 'usr-005',
    reportingUserName: 'Kristine Joy Mendoza',
    reason: 'Profanity',
    submittedAt: '2025-11-11T12:00:00Z',
    status: 'pending',
    topicName: 'Legislative Watch & House Floor Debates',
    repliesCount: 8
  }
];

export const INITIAL_KEYWORD_BLOCKLIST: KeywordBlockItem[] = [
  { id: 'kw-001', word: 'tangina', language: 'fil', addedAt: '2025-01-15T00:00:00Z', addedBy: 'System Default' },
  { id: 'kw-002', word: 'tanginamo', language: 'fil', addedAt: '2025-01-15T00:00:00Z', addedBy: 'System Default' },
  { id: 'kw-003', word: 'gago', language: 'fil', addedAt: '2025-01-15T00:00:00Z', addedBy: 'System Default' },
  { id: 'kw-004', word: 'tarantado', language: 'fil', addedAt: '2025-01-15T00:00:00Z', addedBy: 'System Default' },
  { id: 'kw-005', word: 'ulol', language: 'fil', addedAt: '2025-01-15T00:00:00Z', addedBy: 'System Default' },
  { id: 'kw-006', word: 'bobo', language: 'fil', addedAt: '2025-01-15T00:00:00Z', addedBy: 'System Default' },
  { id: 'kw-007', word: 'punyeta', language: 'fil', addedAt: '2025-01-15T00:00:00Z', addedBy: 'System Default' },
  { id: 'kw-008', word: 'leche', language: 'fil', addedAt: '2025-01-15T00:00:00Z', addedBy: 'System Default' },
  { id: 'kw-009', word: 'putangina', language: 'fil', addedAt: '2025-01-15T00:00:00Z', addedBy: 'System Default' },
  { id: 'kw-010', word: 'fuck', language: 'en', addedAt: '2025-01-15T00:00:00Z', addedBy: 'System Default' },
  { id: 'kw-011', word: 'shit', language: 'en', addedAt: '2025-01-15T00:00:00Z', addedBy: 'System Default' },
  { id: 'kw-012', word: 'bitch', language: 'en', addedAt: '2025-01-15T00:00:00Z', addedBy: 'System Default' },
  { id: 'kw-013', word: 'bastard', language: 'en', addedAt: '2025-01-15T00:00:00Z', addedBy: 'System Default' },
  { id: 'kw-014', word: 'scam', language: 'en', addedAt: '2025-02-01T00:00:00Z', addedBy: 'Atty. Maria Victoria Santos' },
  { id: 'kw-015', word: 'telegram @', language: 'en', addedAt: '2025-02-10T00:00:00Z', addedBy: 'Juan Paolo dela Cruz' }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-001',
    title: 'New Legislative Update: Judicial Reform Bill HB 8920',
    message: 'Rep. Chel Diokno files the Judicial Efficiency and Speedy Trial Act. Tap to read the key highlights and summary.',
    category: 'Announcements',
    audience: 'everyone',
    sentAt: '2025-11-04T10:35:00Z',
    status: 'sent',
    stats: {
      sent: 10420,
      opened: 6890,
      failed: 42
    },
    createdBy: 'Atty. Maria Victoria Santos',
    createdAt: '2025-11-04T10:30:00Z'
  },
  {
    id: 'notif-002',
    title: 'Reminder: UP Diliman Townhall this Friday!',
    message: 'Doors open at 1:00 PM at UP Theater. Please present your QR code pass from the app at the registration booth.',
    category: 'Events',
    audience: 'event_rsvp',
    targetEventId: 'evt-001',
    targetEventName: 'People’s Legislative Townhall – UP Diliman Theater',
    scheduledAt: '2025-11-19T09:00:00Z',
    status: 'scheduled',
    stats: {
      sent: 482,
      opened: 0,
      failed: 0
    },
    createdBy: 'Atty. Maria Victoria Santos',
    createdAt: '2025-11-08T11:00:00Z'
  },
  {
    id: 'notif-003',
    title: 'Visayas Volunteers: Regional Briefing Announcement',
    message: 'Important briefing guidelines for our Cebu & Western Visayas chapter coordinators.',
    category: 'Events',
    audience: 'province',
    targetProvince: 'Cebu',
    sentAt: '2025-11-02T14:00:00Z',
    status: 'sent',
    stats: {
      sent: 890,
      opened: 720,
      failed: 3
    },
    createdBy: 'Atty. Maria Victoria Santos',
    createdAt: '2025-11-02T13:45:00Z'
  },
  {
    id: 'notif-004',
    title: 'Earn your November Civic Champion Badge!',
    message: '5 brand-new CHELlenge tasks are now live. Verify your voter registration today to get started.',
    category: 'CHELlenges',
    audience: 'everyone',
    sentAt: '2025-11-01T09:30:00Z',
    status: 'sent',
    stats: {
      sent: 10350,
      opened: 8120,
      failed: 38
    },
    createdBy: 'Atty. Maria Victoria Santos',
    createdAt: '2025-11-01T09:15:00Z'
  },
  {
    id: 'notif-005',
    title: 'Draft: Urgent Action Alert – Support for Human Rights Defenders',
    message: 'Urgent sign-on statement for volunteers regarding grassroots safety protocols.',
    category: 'Community',
    audience: 'members_only',
    status: 'draft',
    createdBy: 'Atty. Maria Victoria Santos',
    createdAt: '2025-11-10T15:20:00Z'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-001',
    adminId: 'usr-admin-01',
    adminName: 'Atty. Maria Victoria Santos',
    adminRole: 'admin',
    action: 'Changed User Role',
    category: 'users',
    affectedRecordId: 'usr-003',
    affectedRecordType: 'User',
    affectedRecordName: 'Bea Clarisse Alcantara',
    previousValue: 'volunteer',
    updatedValue: 'moderator',
    timestamp: '2025-11-05T10:15:00Z',
    ipAddress: '120.28.182.44'
  },
  {
    id: 'aud-002',
    adminId: 'usr-admin-01',
    adminName: 'Atty. Maria Victoria Santos',
    adminRole: 'admin',
    action: 'Published Announcement',
    category: 'announcements',
    affectedRecordId: 'ann-002',
    affectedRecordType: 'Announcement',
    affectedRecordName: 'Legislative Update: House Bill on Judicial Reform & Speedy Trial Filed',
    previousValue: 'status: draft',
    updatedValue: 'status: published, pinned: true',
    timestamp: '2025-11-04T10:30:00Z',
    ipAddress: '120.28.182.44'
  },
  {
    id: 'aud-003',
    adminId: 'usr-admin-01',
    adminName: 'Atty. Maria Victoria Santos',
    adminRole: 'admin',
    action: 'Created Event',
    category: 'events',
    affectedRecordId: 'evt-001',
    affectedRecordType: 'Event',
    affectedRecordName: 'People’s Legislative Townhall – UP Diliman Theater',
    previousValue: 'None (New Record)',
    updatedValue: 'Capacity: 500, Venue: UP Diliman Theater, Date: 2025-11-20',
    timestamp: '2025-10-25T08:00:00Z',
    ipAddress: '120.28.182.44'
  },
  {
    id: 'aud-004',
    adminId: 'usr-mod-01',
    adminName: 'Juan Paolo dela Cruz',
    adminRole: 'moderator',
    action: 'Approved CHELlenge Proof',
    category: 'challenges',
    affectedRecordId: 'prf-003',
    affectedRecordType: 'ChallengeProof',
    affectedRecordName: 'Task 3: Study Circle (Kristine Joy Mendoza)',
    previousValue: 'status: pending_review',
    updatedValue: 'status: approved, badgeStatus: confirmed',
    timestamp: '2025-11-10T10:00:00Z',
    ipAddress: '112.198.102.15'
  },
  {
    id: 'aud-005',
    adminId: 'usr-mod-01',
    adminName: 'Juan Paolo dela Cruz',
    adminRole: 'moderator',
    action: 'Rejected CHELlenge Proof',
    category: 'challenges',
    affectedRecordId: 'prf-005',
    affectedRecordType: 'ChallengeProof',
    affectedRecordName: 'Task 1: Voter Status (Danilo Christian Sison)',
    previousValue: 'status: pending_review',
    updatedValue: 'status: rejected (Reason: Blurry image, no COMELEC stub)',
    timestamp: '2025-11-07T15:00:00Z',
    ipAddress: '112.198.102.15'
  },
  {
    id: 'aud-006',
    adminId: 'usr-mod-01',
    adminName: 'Juan Paolo dela Cruz',
    adminRole: 'moderator',
    action: 'Imposed User Sanction (Mute 24h)',
    category: 'community',
    affectedRecordId: 'usr-007',
    affectedRecordType: 'User',
    affectedRecordName: 'Danilo Christian Sison',
    previousValue: 'status: active',
    updatedValue: 'status: muted (Duration: 24h, Reason: Harassment)',
    timestamp: '2025-11-10T14:00:00Z',
    ipAddress: '112.198.102.15'
  },
  {
    id: 'aud-007',
    adminId: 'usr-admin-01',
    adminName: 'Atty. Maria Victoria Santos',
    adminRole: 'admin',
    action: 'Dispatched Push Notification',
    category: 'notifications',
    affectedRecordId: 'notif-001',
    affectedRecordType: 'Notification',
    affectedRecordName: 'New Legislative Update: Judicial Reform Bill HB 8920',
    previousValue: 'status: draft',
    updatedValue: 'status: sent, target: 10420 volunteers (APNs & FCM)',
    timestamp: '2025-11-04T10:35:00Z',
    ipAddress: '120.28.182.44'
  },
  {
    id: 'aud-008',
    adminId: 'usr-admin-01',
    adminName: 'Atty. Maria Victoria Santos',
    adminRole: 'admin',
    action: 'Updated App Minimum Version',
    category: 'settings',
    affectedRecordId: 'cfg-version',
    affectedRecordType: 'AppSettings',
    affectedRecordName: 'Minimum Mobile App Version',
    previousValue: '1.4.1',
    updatedValue: '1.4.2 (Mandatory update for Phase 1 stability)',
    timestamp: '2025-11-01T09:00:00Z',
    ipAddress: '120.28.182.44'
  }
];

export const INITIAL_APP_SETTINGS: AppSettings = {
  minimumAppVersion: '1.4.2',
  forcedUpdate: false,
  forcedUpdateMessage: 'A new version of the Diokno Volunteer App is required to continue enjoying all features. Please update via Google Play Store or Apple App Store.',
  featureFlags: {
    enableVoterEducationLeaderboard: true,
    enableInAppPushV2: true,
    enableCommunityDirectReplies: true,
    enableCivicBadgeQrSharing: true,
    enableLiveEventCheckInAlerts: true
  },
  guidelinesEnglish: `### Diokno Volunteer App Community Standards

1. **Civic Dignity & Respect**: We are united in promoting honest, responsive, and humane governance. Treat every volunteer, moderator, and citizen with dignity.
2. **Strictly No Harassment or Defamation**: Abusive, misogynistic, homophobic, or threatening speech will not be tolerated.
3. **No Commercial Solicitation or Spam**: Unauthorized merchandise, crypto schemes, or external sales promotions are strictly prohibited.
4. **Protect Personal Data Privacy**: Do not publicly publish mobile numbers, home addresses, or private details of fellow volunteers.
5. **Truth in Evidence**: When submitting CHELlenge proofs, submit only authentic, verified materials. Falsified documents will disqualify accounts.`,
  guidelinesFilipino: `### Mga Pamantayan ng Komunidad ng Diokno Volunteer App

1. **Dangal at Respeto**: Nagkakaisa tayo para sa tapat, makatao, at maasahang pamamahala. Irespeto ang bawat kapwa boluntaryo at kababayan.
2. **Bawal ang Pang-aabuso o Bastusan**: Hindi kukunsintihin ang kahit anong uri ng pambabastos, pananakot, o paninira.
3. **Bawal ang Spam at Pagbebenta**: Ipinagbabawal ang pag-post ng mga negosyo, scam, o hindi awtorisadong paninda.
4. **Proteksyon sa Privacy**: Huwag ilalabas sa publiko ang mga personal na numero o tirahan ng kapwa miyembro.
5. **Katotohanan sa Patunay**: Magpasa lamang ng totoo at beripikadong patunay para sa mga CHELlenge. Ang palsipikasyon ay may kaakibat na parusa.`,
  twoFactorEnforced: true
};

export const PHILIPPINE_PROVINCES = [
  'Metro Manila',
  'Abra', 'Agusan del Norte', 'Agusan del Sur', 'Aklan', 'Albay', 'Antique', 'Apayao', 'Aurora',
  'Basilan', 'Bataan', 'Batanes', 'Batangas', 'Benguet', 'Biliran', 'Bohol', 'Bukidnon', 'Bulacan',
  'Cagayan', 'Camarines Norte', 'Camarines Sur', 'Camiguin', 'Capiz', 'Catanduanes', 'Cavite', 'Cebu',
  'Cotabato', 'Davao de Oro', 'Davao del Norte', 'Davao del Sur', 'Davao Occidental', 'Davao Oriental',
  'Dinagat Islands', 'Eastern Samar', 'Guimaras', 'Ifugao', 'Ilocos Norte', 'Ilocos Sur', 'Iloilo', 'Isabela',
  'Kalinga', 'La Union', 'Laguna', 'Lanao del Norte', 'Lanao del Sur', 'Leyte', 'Maguindanao del Norte',
  'Maguindanao del Sur', 'Marinduque', 'Masbate', 'Misamis Occidental', 'Misamis Oriental', 'Mountain Province',
  'Negros Occidental', 'Negros Oriental', 'Northern Samar', 'Nueva Ecija', 'Nueva Vizcaya', 'Occidental Mindoro',
  'Oriental Mindoro', 'Palawan', 'Pampanga', 'Pangasinan', 'Quezon', 'Quirino', 'Rizal', 'Romblon',
  'Samar', 'Sarangani', 'Siquijor', 'Sorsogon', 'South Cotabato', 'Southern Leyte', 'Sultan Kudarat',
  'Sulu', 'Surigao del Norte', 'Surigao del Sur', 'Tarlac', 'Tawi-Tawi', 'Zambales', 'Zamboanga del Norte',
  'Zamboanga del Sur', 'Zamboanga Sibugay'
];
