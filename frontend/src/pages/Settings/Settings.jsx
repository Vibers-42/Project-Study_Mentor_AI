import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import api from '../../services/api';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const SKILL_LEVELS = ['beginner', 'intermediate', 'advanced'];
const LEARNING_GOALS_OPTS = [
  'Land a new job', 'Prepare for interviews', 'Upskill in current role',
  'Switch to tech', 'Learn new frameworks', 'Improve coding skills',
];

const Settings = () => {
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const [darkMode, setDarkMode] = useState(() => document.documentElement.classList.contains('dark'));
  const [selectedGoals, setSelectedGoals] = useState([]);

  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: {
      full_name: user?.full_name || '',
      email: user?.email || '',
      job_role: user?.job_role || '',
      skill_level: 'intermediate',
    },
  });

  const onSave = async (data) => {
    try {
      await api.put('/auth/profile', data);
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile.');
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    navigate('/login');
  };

  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      setDarkMode(false);
    } else {
      html.classList.add('dark');
      setDarkMode(true);
    }
    toast.info(`Switched to ${darkMode ? 'light' : 'dark'} mode`);
  };

  const toggleGoal = (goal) => {
    setSelectedGoals(prev =>
      prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
    );
  };

  return (
    <div className="page-enter" style={{ maxWidth: 640, margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '6px' }}>Settings</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Manage your profile and preferences</p>
      </div>

      {/* Profile */}
      <div className="glass-card" style={{ padding: '28px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          👤 Profile Information
        </h2>
        <form onSubmit={handleSubmit(onSave)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Input id="settings-name" label="Full Name" placeholder="Your name" {...register('full_name')} />
            <Input id="settings-email" label="Email" type="email" placeholder="you@example.com" {...register('email')} />
          </div>
          <Input id="settings-job-role" label="Current / Target Job Role" placeholder="e.g. Senior Frontend Developer" {...register('job_role')} />

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Skill Level
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {SKILL_LEVELS.map(l => (
                <label
                  key={l}
                  htmlFor={`skill-${l}`}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-elevated)',
                    textAlign: 'center',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <input type="radio" id={`skill-${l}`} value={l} {...register('skill_level')} style={{ display: 'none' }} />
                  {l.charAt(0).toUpperCase() + l.slice(1)}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Learning Goals
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {LEARNING_GOALS_OPTS.map(g => (
                <button
                  key={g}
                  type="button"
                  onClick={() => toggleGoal(g)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-full)',
                    border: selectedGoals.includes(g) ? '1px solid var(--border-accent)' : '1px solid var(--border)',
                    background: selectedGoals.includes(g) ? 'var(--accent-dim)' : 'var(--bg-elevated)',
                    color: selectedGoals.includes(g) ? 'var(--accent-light)' : 'var(--text-secondary)',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
            <Button id="settings-save" type="submit" loading={isSubmitting}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>

      {/* Preferences */}
      <div className="glass-card" style={{ padding: '28px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          🎨 Preferences
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>
              {darkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Toggle between dark and light themes
            </div>
          </div>
          <button
            id="settings-theme-toggle"
            onClick={toggleTheme}
            style={{
              width: 52,
              height: 28,
              borderRadius: 99,
              background: darkMode ? 'var(--gradient-accent)' : 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              cursor: 'pointer',
              position: 'relative',
              transition: 'background 0.3s',
            }}
          >
            <div style={{
              width: 22,
              height: 22,
              borderRadius: '50%',
              background: '#fff',
              position: 'absolute',
              top: 2,
              left: darkMode ? 26 : 2,
              transition: 'left 0.3s',
              boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
            }} />
          </button>
        </div>
      </div>

      {/* Danger zone */}
      <div className="glass-card" style={{ padding: '28px', background: 'var(--danger-dim)', border: '1px solid var(--danger)' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: 'var(--danger)' }}>
          ⚠️ Account
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>Log out</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Sign out of your account on this device</div>
          </div>
          <Button
            id="settings-logout"
            variant="danger"
            loading={loggingOut}
            onClick={handleLogout}
          >
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
