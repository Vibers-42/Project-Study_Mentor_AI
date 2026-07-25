import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/layout/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Badge from '../../components/common/Badge';
import Avatar from '../../components/common/Avatar';
import ToggleSwitch from '../../components/common/ToggleSwitch';
import ThemeToggle from '../../components/common/ThemeToggle';

/* ─── Section Wrapper ──────────────────────────────────────────── */
const SettingsSection = ({ id, icon, title, description, children }) => (
  <Card id={id} className="border-slate-200/80 dark:border-slate-800">
    <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg shrink-0">
        {icon}
      </div>
      <div>
        <h2 className="font-bold text-slate-900 dark:text-slate-100">{title}</h2>
        {description && <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>}
      </div>
    </div>
    <div className="p-5 space-y-5">{children}</div>
  </Card>
);

/** Divider line inside a section */
const Divider = () => <hr className="border-slate-100 dark:border-slate-800" />;

/* ═══════════════════════════════════════════════════════════════
   MAIN SETTINGS PAGE
   ═══════════════════════════════════════════════════════════════ */

const Settings = () => {
  const navigate = useNavigate();
  const avatarInputRef = useRef(null);

  // ── Profile State ─────────────────────────────────────
  const [profileForm, setProfileForm] = useState({
    name: 'Alex Rivera',
    email: 'alex@studymentor.ai',
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [profileSaved, setProfileSaved] = useState(false);

  // ── Appearance State ──────────────────────────────────
  const [themePreference, setThemePreference] = useState('system');

  // ── Security State ────────────────────────────────────
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // ── Notification State ────────────────────────────────
  const [notifications, setNotifications] = useState({
    email: true,
    interviewReminders: true,
    studyReminders: false,
    weeklyDigest: true,
    achievements: true,
  });

  // ── Delete Account State ──────────────────────────────
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  /* ─── Handlers ───────────────────────────────────────── */

  const handleProfileChange = (field, value) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }));
    setProfileSaved(false);
  };

  const handleProfileSave = () => {
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordSave = () => {
    setPasswordError('');
    if (!passwordForm.current || !passwordForm.new || !passwordForm.confirm) {
      setPasswordError('All fields are required.');
      return;
    }
    if (passwordForm.new.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (passwordForm.new !== passwordForm.confirm) {
      setPasswordError('New passwords do not match.');
      return;
    }
    setPasswordSaved(true);
    setPasswordForm({ current: '', new: '', confirm: '' });
    setTimeout(() => setPasswordSaved(false), 3000);
  };

  const handleNotificationChange = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const handleDeleteAccount = () => {
    setShowDeleteConfirm(false);
    alert('Account deletion requested (simulated). You would be redirected to a confirmation flow.');
  };

  /* ─── Password Eye Icon ──────────────────────────────── */
  const EyeButton = ({ field }) => (
    <button
      type="button"
      onClick={() => setShowPasswords((p) => ({ ...p, [field]: !p[field] }))}
      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none"
      aria-label={showPasswords[field] ? 'Hide password' : 'Show password'}
    >
      {showPasswords[field] ? (
        <svg className="w-4 h-4 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
        </svg>
      ) : (
        <svg className="w-4 h-4 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12c1.341-4.574 5.357-7.5 9.964-7.5s8.623 2.926 9.964 7.5c-1.341 4.574-5.357 7.5-9.964 7.5s-8.623-2.926-9.964-7.5z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )}
    </button>
  );

  /* ═══════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════ */

  return (
    <div className="space-y-8 max-w-3xl">

      {/* ── PAGE HEADER ──────────────────────────────────── */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your profile, preferences, and account settings.
        </p>
      </div>

      {/* ═══════════════════════════════════════════════════
         1. PROFILE
         ═══════════════════════════════════════════════════ */}
      <SettingsSection id="profile" icon="👤" title="Profile" description="Your personal information and avatar.">
        {/* Avatar Upload */}
        <div className="flex items-center gap-5">
          <div className="relative group">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar"
                className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-200 dark:border-slate-700 shadow-sm"
              />
            ) : (
              <Avatar name={profileForm.name} size="xl" />
            )}
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              className="absolute inset-0 rounded-2xl bg-black/40 text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
            >
              Change
            </button>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
            />
          </div>
          <div className="space-y-1">
            <p className="font-bold text-slate-900 dark:text-slate-100">{profileForm.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{profileForm.email}</p>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs mt-1"
              onClick={() => avatarInputRef.current?.click()}
            >
              Upload Photo
            </Button>
          </div>
        </div>

        <Divider />

        {/* Name & Email Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            value={profileForm.name}
            onChange={(e) => handleProfileChange('name', e.target.value)}
            placeholder="Your full name"
            leftIcon={
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            }
          />
          <Input
            label="Email Address"
            type="email"
            value={profileForm.email}
            onChange={(e) => handleProfileChange('email', e.target.value)}
            placeholder="you@example.com"
            leftIcon={
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            }
          />
        </div>

        {/* Save */}
        <div className="flex items-center gap-3">
          <Button variant="primary" size="sm" onClick={handleProfileSave}>
            Save Changes
          </Button>
          {profileSaved && (
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-fade-in">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Profile updated successfully
            </span>
          )}
        </div>
      </SettingsSection>

      {/* ═══════════════════════════════════════════════════
         2. APPEARANCE
         ═══════════════════════════════════════════════════ */}
      <SettingsSection id="appearance" icon="🎨" title="Appearance" description="Customize how Study Mentor AI looks for you.">
        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Dark Mode</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Toggle between light and dark themes.</p>
          </div>
          <ThemeToggle size="md" />
        </div>

        <Divider />

        {/* Theme Preference */}
        <Select
          label="Theme Preference"
          value={themePreference}
          onChange={(e) => setThemePreference(e.target.value)}
        >
          <option value="system">System Default</option>
          <option value="light">Always Light</option>
          <option value="dark">Always Dark</option>
        </Select>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 -mt-3">
          When set to "System Default", the theme follows your OS or browser preference.
        </p>
      </SettingsSection>

      {/* ═══════════════════════════════════════════════════
         3. SECURITY
         ═══════════════════════════════════════════════════ */}
      <SettingsSection id="security" icon="🔒" title="Security" description="Update your password to keep your account secure.">
        <div className="space-y-4">
          <Input
            label="Current Password"
            type={showPasswords.current ? 'text' : 'password'}
            value={passwordForm.current}
            onChange={(e) => setPasswordForm((p) => ({ ...p, current: e.target.value }))}
            placeholder="Enter current password"
            autoComplete="current-password"
            rightIcon={<EyeButton field="current" />}
            leftIcon={
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            }
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="New Password"
              type={showPasswords.new ? 'text' : 'password'}
              value={passwordForm.new}
              onChange={(e) => setPasswordForm((p) => ({ ...p, new: e.target.value }))}
              placeholder="At least 6 characters"
              autoComplete="new-password"
              rightIcon={<EyeButton field="new" />}
            />
            <Input
              label="Confirm New Password"
              type={showPasswords.confirm ? 'text' : 'password'}
              value={passwordForm.confirm}
              onChange={(e) => setPasswordForm((p) => ({ ...p, confirm: e.target.value }))}
              placeholder="Re-enter new password"
              autoComplete="new-password"
              rightIcon={<EyeButton field="confirm" />}
            />
          </div>
        </div>

        {passwordError && (
          <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {passwordError}
          </p>
        )}

        <div className="flex items-center gap-3">
          <Button variant="primary" size="sm" onClick={handlePasswordSave}>
            Update Password
          </Button>
          {passwordSaved && (
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Password changed successfully
            </span>
          )}
        </div>
      </SettingsSection>

      {/* ═══════════════════════════════════════════════════
         4. NOTIFICATIONS
         ═══════════════════════════════════════════════════ */}
      <SettingsSection id="notifications" icon="🔔" title="Notifications" description="Control what notifications you receive.">
        <ToggleSwitch
          label="Email Notifications"
          description="Receive important updates and announcements via email."
          checked={notifications.email}
          onChange={() => handleNotificationChange('email')}
        />

        <Divider />

        <ToggleSwitch
          label="Interview Reminders"
          description="Get notified before scheduled mock interviews."
          checked={notifications.interviewReminders}
          onChange={() => handleNotificationChange('interviewReminders')}
        />

        <Divider />

        <ToggleSwitch
          label="Study Reminders"
          description="Daily reminders to maintain your learning streak."
          checked={notifications.studyReminders}
          onChange={() => handleNotificationChange('studyReminders')}
        />

        <Divider />

        <ToggleSwitch
          label="Weekly Digest"
          description="Summary of your weekly progress and insights."
          checked={notifications.weeklyDigest}
          onChange={() => handleNotificationChange('weeklyDigest')}
        />

        <Divider />

        <ToggleSwitch
          label="Achievement Alerts"
          description="Get notified when you unlock new achievements."
          checked={notifications.achievements}
          onChange={() => handleNotificationChange('achievements')}
        />
      </SettingsSection>

      {/* ═══════════════════════════════════════════════════
         5. ACCOUNT
         ═══════════════════════════════════════════════════ */}
      <SettingsSection id="account" icon="⚙️" title="Account" description="Manage your session and account status.">
        {/* Logout */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Sign Out</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              End your current session on this device.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            leftIcon={
              <svg className="w-4 h-4 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
            }
          >
            Logout
          </Button>
        </div>

        <Divider />

        {/* Delete Account */}
        <div className="rounded-xl border border-rose-200/70 dark:border-rose-900/40 bg-rose-50/30 dark:bg-rose-950/10 p-4 space-y-3">
          <div>
            <p className="text-sm font-semibold text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
              <svg className="w-4 h-4 stroke-current stroke-2 fill-none shrink-0" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Danger Zone
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
          </div>

          {!showDeleteConfirm ? (
            <Button
              variant="outline"
              size="sm"
              className="!border-rose-300 dark:!border-rose-800 !text-rose-600 dark:!text-rose-400 hover:!bg-rose-50 dark:hover:!bg-rose-950/30"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete Account
            </Button>
          ) : (
            <div className="flex items-center gap-2 pt-1">
              <p className="text-xs font-bold text-rose-700 dark:text-rose-300">Are you sure?</p>
              <Button
                variant="primary"
                size="sm"
                className="!bg-rose-600 hover:!bg-rose-700 !shadow-none"
                onClick={handleDeleteAccount}
              >
                Yes, Delete
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </SettingsSection>

    </div>
  );
};

export default Settings;
