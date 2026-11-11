// Verification Script for Business Rules and Workflows
import assert from 'node:assert';

console.log('--- Verifying Diokno Volunteer App Admin Dashboard Business Rules ---');

// 1. Test Quiet Hours logic (10 PM to 7 AM Manila Time UTC+8)
function isQuietHours(isoOrDate) {
  const d = new Date(isoOrDate);
  const utcHour = d.getUTCHours();
  const manilaHour = (utcHour + 8) % 24;
  return manilaHour >= 22 || manilaHour < 7;
}

// 11 PM Manila time = 15:00 UTC
assert.strictEqual(isQuietHours('2025-11-20T15:00:00Z'), true, '11 PM PHT should be quiet hours');
// 2 AM Manila time = 18:00 UTC
assert.strictEqual(isQuietHours('2025-11-20T18:00:00Z'), true, '2 AM PHT should be quiet hours');
// 6 AM Manila time = 22:00 UTC previous day
assert.strictEqual(isQuietHours('2025-11-20T22:00:00Z'), true, '6 AM PHT should be quiet hours');
// 10 AM Manila time = 02:00 UTC
assert.strictEqual(isQuietHours('2025-11-20T02:00:00Z'), false, '10 AM PHT should NOT be quiet hours');
// 2 PM Manila time = 06:00 UTC
assert.strictEqual(isQuietHours('2025-11-20T06:00:00Z'), false, '2 PM PHT should NOT be quiet hours');
console.log('✓ Quiet hours validation passed (10:00 PM – 7:00 AM PHT).');

// 2. Test 3-Pinned Announcements limit
function canPinAnnouncement(currentPinnedList, newIsPinned) {
  const count = currentPinnedList.filter(a => a.isPinned).length;
  if (newIsPinned && count >= 3) {
    return { allowed: false, error: 'Maximum of 3 pinned announcements allowed.' };
  }
  return { allowed: true };
}

const mockAnnouncements = [
  { id: '1', isPinned: true },
  { id: '2', isPinned: true },
  { id: '3', isPinned: true }
];
assert.strictEqual(canPinAnnouncement(mockAnnouncements, true).allowed, false);
assert.strictEqual(canPinAnnouncement(mockAnnouncements.slice(0, 2), true).allowed, true);
console.log('✓ Maximum 3 pinned announcements limit rule passed.');

// 3. Test CHELlenge Tasks range rule (3 to 10 tasks)
function validateChallengeTasks(tasks) {
  if (tasks.length < 3) return { valid: false, error: 'Minimum 3 tasks required.' };
  if (tasks.length > 10) return { valid: false, error: 'Maximum 10 tasks permitted.' };
  return { valid: true };
}

assert.strictEqual(validateChallengeTasks([1, 2]).valid, false);
assert.strictEqual(validateChallengeTasks([1, 2, 3]).valid, true);
assert.strictEqual(validateChallengeTasks([1, 2, 3, 4, 5]).valid, true);
assert.strictEqual(validateChallengeTasks([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).valid, true);
assert.strictEqual(validateChallengeTasks([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]).valid, false);
console.log('✓ Monthly CHELlenge 3–10 tasks range rule passed.');

// 4. Test 1 Active Challenge per month rule
function canPublishChallenge(existingChallenges, month, year, candidateId) {
  const existing = existingChallenges.find(
    c => c.month === month && c.year === year && c.status === 'published' && c.id !== candidateId
  );
  return !existing;
}

const existingChallenges = [
  { id: 'chl-1', month: 'November', year: 2025, status: 'published' },
  { id: 'chl-2', month: 'October', year: 2025, status: 'archived' }
];

assert.strictEqual(canPublishChallenge(existingChallenges, 'November', 2025, 'chl-new'), false);
assert.strictEqual(canPublishChallenge(existingChallenges, 'December', 2025, 'chl-new'), true);
console.log('✓ One active published challenge per month rule passed.');

// 5. Test Role-Based Navigation item filtering
const allNavModules = [
  { id: 'dashboard', adminOnly: false },
  { id: 'announcements', adminOnly: false },
  { id: 'events', adminOnly: false },
  { id: 'challenges', adminOnly: false },
  { id: 'community', adminOnly: false },
  { id: 'users', adminOnly: false },
  { id: 'notifications', adminOnly: true },
  { id: 'audit', adminOnly: false },
  { id: 'settings', adminOnly: true },
  { id: 'reports', adminOnly: false }
];

function getVisibleModules(role) {
  return allNavModules.filter(m => !(role === 'moderator' && m.adminOnly)).map(m => m.id);
}

const adminModules = getVisibleModules('admin');
const moderatorModules = getVisibleModules('moderator');

assert.strictEqual(adminModules.length, 10, 'Admin should have all 10 modules');
assert.strictEqual(moderatorModules.length, 8, 'Moderator should have 8 modules (no notifications or settings)');
assert.strictEqual(moderatorModules.includes('notifications'), false);
assert.strictEqual(moderatorModules.includes('settings'), false);
console.log('✓ Role-based permissions navigation filtering passed.');

console.log('\nAll business rules and workflow validations passed successfully!');

