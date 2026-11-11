# Diokno Volunteer App – Admin Dashboard

A complete, responsive, enterprise-grade civic-tech administrative and moderation web application built for the **Diokno Volunteer App** platform (supporting Rep. Chel Diokno's nationwide volunteer movement).

---

## 🏛️ Platform Architecture & Overview

The Admin Dashboard is built as an independent, responsive single-page web console (Vite + React 18 + TypeScript + Tailwind CSS) designed to interface with the shared Diokno Volunteer backend and manage Phase 1 mobile application activities.

### Core Tech Stack
- **Framework:** React 18 (TypeScript)
- **Bundler & Dev Server:** Vite 5
- **Styling:** Tailwind CSS with Diokno Civic branding (Chel Cyan `#0284C7`, Deep Civic Navy `#0B1528`, Warm Civic Gold `#F59E0B`, Slate borders)
- **Icons:** Lucide React
- **Persistence & State:** Unified reactive DataContext with LocalStorage synchronization, automatic audit logging, and accessible Toast system.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v20)
- npm 9+

### Installation & Run

```bash
# 1. Install dependencies
npm install

# 2. Run in development mode
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build
npm run preview
```

The application runs at `http://localhost:5173/`.

---

## 🔐 Credentials & Quick Demo Testing

The application includes an instant 1-click credential auto-fill and quick-test bypass on both the Login and 2FA screens for seamless evaluation:

| Role | Email | Password | 2FA Code | Access Scope |
| :--- | :--- | :--- | :--- | :--- |
| **Administrator** | `admin@diokno.ph` | `DioknoAdmin2025!` | `246810` | Full platform control (all 10 modules, role changes, settings, exports) |
| **Moderator** | `mod.juan@diokno.ph` | `DioknoMod2025!` | `246810` | Moderation queue, CHELlenge proof verification, event check-in/QR tools |

> **Quick Role Toggle:** While logged in, you can switch between **Administrator** and **Moderator** at any time by clicking the **Admin Mode / Moderator Mode** pill in the top header or sidebar.

---

## 📱 Implemented Dashboard Modules

### 1. Authentication & Security
- **Screen 01 – Admin Login:** Email, password with toggle show/hide, remember me, validation error states, and quick demo auto-fill buttons.
- **Screen 02 – Two-Factor Authentication:** Mandatory 6-digit TOTP verification, auto-focus inputs, paste support, 45s resend countdown timer, and invalid/expired code handling (`000000` simulates expired code).
- **Screen 03 – Forgot Password:** Self-service password recovery instructions with email verification confirmation.

### 2. Module 01 – Dashboard Overview
- **8 Primary KPI Cards:** Total Registered Users (10,482), Completed Profiles (8,940 / 85.3%), Weekly Active Users (4,210), Monthly Active Users (9,120), Event RSVPs (3,450), Event Check-ins (2,890), CHELlenge Completions (1,620), Open Reports (7).
- **Date Range Filters:** 7 Days, 30 Days, This Month, Quarter, Year-to-Date.
- **Interactive Visualizations:**
  - Weekly user registrations and active engagement comparison chart.
  - Profile completion, event attendance %, and community health progress indicators.
- **Pending Actions Banner:** Quick jump cards to open community reports, pending proof reviews, and moderator applications.
- **Recent Activity Stream:** Chronological feed linking directly to the audit log.

### 3. Module 02 – Announcements Management
- **Listing & Filters:** Search by title/primer/author, filter by Category (*Social Media*, *Legislative Updates*, *Volunteer Events*) and Status (*Published*, *Draft*, *Scheduled*, *Unpublished*).
- **Pin Enforcement:** Strict validation capping pinned announcements at a maximum of 3 items.
- **Create / Edit Modal:**
  - Rich text body formatting.
  - Image attachment support (up to 4 images with live previews & removal).
  - External link with live Link Preview card generation.
  - Associated event selector.
  - Immediate publish or schedule date/time selector (PHT).
  - Optional push notification dispatch on publish.
- **Preview Modal:** Simulated iOS/Android Mobile Feed card view and Desktop Web portal card view.

### 4. Module 03 – Events Management
- **Events Directory:** Townhalls, Free Legal Aid Missions, Volunteer Trainings, Community Outreaches, Youth Rallies, and Webinars.
- **Capacity & RSVP Tracking:** Live progress indicators monitoring RSVPs against venue capacity limits.
- **Event Details & Attendance Check-in Tools:**
  - On-site QR Code Pass Scanner simulation and manual verification search input (enabling real-time check-ins for field volunteers).
  - Categorized RSVP tables (*All*, *Checked In*, *Absent*, *Waitlist*).
  - Walk-in attendee registration form.
  - Attendee roster CSV export.
  - Event cancellation modal requiring mandatory cancellation explanation with automated push notification triggers.

### 5. Module 04 – CHELlenges Management
- **Monthly Challenges Roster:** Configure monthly civic sprints with custom badge artwork, date ranges, and 3–10 mandatory tasks.
- **Rule Enforcement:** Enforces exactly one active challenge per calendar month.
- **Task Builder:** Reorder tasks (up/down), customize instructions, and configure accepted proof formats (*Photo*, *Video*, or *Link*).
- **Dedicated Proof Review Queue:**
  - Inspect volunteer photo evidence, video links, or social post URLs.
  - Provisional vs. Confirmed badge tracking.
  - Single approval, bulk approval for batch processing, and rejection with **mandatory reason** recording and notification.
  - Privacy indicator ensuring proofs remain confidential to staff.

### 6. Module 05 – Community Management
- **Forum Topics Directory:** Reorder discussion boards (up/down), assign dedicated moderators, create topics, and archive/restore threads.
- **Community Incident Queue:** Detailed inspection of reported harassment, profanity, misinformation, and spam.
- **Moderation Actions:** Remove post, Lock thread, Warn user, Mute for 24h, Mute for 7 days, Ban account, or Dismiss report.
- **Moderation Controls & Keyword Blocklist:**
  - Interactive blocklist editor with pre-loaded English and Filipino (Tagalog) profanity and scam terms.
  - Active user sanctions tracker with one-click sanction lift capability.
  - Automatic audit logging for every disciplinary action.

### 7. Module 06 – User Management
- **Volunteer Directory:** Searchable by name, email, organization, or province; filterable by role, registration date, and profile completion (≥80% vs &lt;80%).
- **Detailed Volunteer Profile Modal:**
  - Demographics, mobile verification badge, campus/organization, and advocacy tags.
  - Earned CHELlenge badges showcase and event attendance history.
  - Moderation history and sanction records.
- **Role Elevation:** Real-time role transitions between Volunteer, Moderator, and Administrator (enforced by backend simulation with immediate audit logging).
- **Moderator Application Queue:** Approve or decline volunteer leader applications.
- **Data Privacy Act Compliance:** Process and permanently purge account data upon verified user deletion requests.

### 8. Module 07 – Notifications Management *(Administrator Only)*
- **Push Notification Broadcasts:** Integrated simulation of Apple Push Notification service (APNs) and Firebase Cloud Messaging (FCM).
- **Target Audience Segmentation:** Everyone, Members Only (verified profiles), Specific Province, or RSVPs to a specific event.
- **Quiet Hours Enforcement:** Automated detection and policy warning when scheduling or broadcasting during Manila quiet hours (10:00 PM – 7:00 AM PHT).
- **Live Device Preview:** Interactive lock-screen push notification preview on iOS and Android mockups.
- **Delivery Analytics:** Delivery volume, open rates, and failed delivery diagnostics.

### 9. Module 08 – Audit Log
- **Immutable Administrative Activity Stream:** Chronological logging of all role modifications, content publications, moderation sanctions, event cancellations, and setting changes.
- **Diff Inspector Modal:** Side-by-side comparison displaying previous vs. updated values for affected records.
- **Filters & Export:** Filter by administrator/moderator, role, action category, or search; export to CSV.
- **Tamper Resistance:** Read-only compliance view; records cannot be deleted or edited.

### 10. Module 09 – System Settings *(Administrator Only)*
- **Mobile Version Deprecation:** Configure minimum supported client version (e.g., `1.4.2`) and toggle forced update gates with custom user prompts.
- **Remote Feature Flags:** Toggle live features (Voter Education Leaderboard, In-App Push V2, Threaded Replies, Badge Sharing, Live QR Check-in Alerts).
- **Bilingual Community Guidelines:** Dual English and Filipino (Tagalog) markdown editors for official community standards.
- **Account Security:** Administrator profile details, password updates, and 2FA TOTP configuration.

### 11. Module 10 – Reports & Analytics
- **Civic Engagement Reports:** User growth velocity, profile verification rates, event attendance vs. RSVPs, and CHELlenge completion rates.
- **Regional Demographic Breakdown:** Tabular breakdown of volunteer distribution across NCR, Region VII (Cebu), Region VI (Iloilo), Region III (Central Luzon), Region IV-A (CALABARZON), Region XI (Davao), and nationwide chapters.
- **Multi-Format Exporting:**
  - Instant CSV download for spreadsheet analysis.
  - Clean, styled print-ready layout for PDF export (`window.print()`).

---

## 🛡️ Role-Based Access Control (RBAC) Matrix

| Capability / Module | Administrator | Moderator |
| :--- | :---: | :---: |
| **Dashboard Overview** | Full Access | Relevant Overview |
| **Announcements** | Create, Edit, Pin (Max 3), Delete, Schedule | View-only |
| **Events** | Create, Edit, Cancel, Export | View, QR Check-in Tool, Attendee Management |
| **CHELlenges** | Create Challenge, Configure Tasks, Approve/Reject Proofs | Proof Review Queue, Approve/Reject Proofs |
| **Community** | Full Moderation, Topic Ordering, Blocklist Editor | Moderation Queue, Sanctions, Blocklist |
| **User Management** | Change Roles, Approve Mod Apps, Process Deletions | Read-only Directory View |
| **Notifications** | Compose, Schedule, Global Broadcast | ⛔ Hidden / Blocked |
| **Audit Log** | Full View & Export | View Assigned Actions |
| **Settings** | Full Access (Version, Flags, Guidelines) | ⛔ Hidden / Blocked |
| **Reports** | Full Access & Data Export | View Engagement Metrics |

---

## 🔒 Security & Privacy Standards
- **Mandatory 2FA:** Required for both Administrators and Moderators prior to console access.
- **Data Privacy Act of 2012 (RA 10173):** Dedicated workflow for volunteer account deletion and data sanitization requests.
- **Quiet Hours Policy:** Automatic guard preventing late-night volunteer notification fatigue between 10:00 PM and 7:00 AM PHT.
- **Role Enforcement:** Navigation items for unauthorized modules are omitted for Moderators, and protected with defensive `RoleGuard` barriers.

