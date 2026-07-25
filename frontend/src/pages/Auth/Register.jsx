import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const Register = () => {
  const { register: registerUser } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
  const password = watch('password');

  const onSubmit = async (data) => {
    const result = await registerUser(data.email, data.password, data.full_name);
    if (result.success) {
      toast.success('Account created! Welcome aboard 🚀');
      navigate('/dashboard');
    } else {
      toast.error(result.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="animate-fade-in-up">
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '8px' }}>Create your account</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Start your AI-powered learning journey today
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Input
          id="register-name"
          label="Full name"
          type="text"
          placeholder="Jane Doe"
          error={errors.full_name?.message}
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          }
          {...register('full_name', { required: 'Full name is required', minLength: { value: 2, message: 'Name too short' } })}
        />

        <Input
          id="register-email"
          label="Email address"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          }
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email address' },
          })}
        />

        <Input
          id="register-password"
          label="Password"
          type={showPw ? 'text' : 'password'}
          placeholder="Min. 8 characters"
          error={errors.password?.message}
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
          }
          iconRight={
            <button type="button" onClick={() => setShowPw(p => !p)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--text-muted)' }}>
              {showPw
                ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              }
            </button>
          }
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 8, message: 'Minimum 8 characters' },
          })}
        />

        <Input
          id="register-confirm-password"
          label="Confirm password"
          type={showPw ? 'text' : 'password'}
          placeholder="Re-enter your password"
          error={errors.confirm_password?.message}
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
          }
          {...register('confirm_password', {
            required: 'Please confirm your password',
            validate: v => v === password || 'Passwords do not match',
          })}
        />

        <Button id="register-submit" type="submit" fullWidth loading={isSubmitting} size="lg" style={{ marginTop: '8px' }}>
          Create Account
        </Button>
      </form>

      <div style={{ marginTop: '28px', textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)' }}>
        Already have an account?{' '}
        <Link
          to="/login"
          style={{ color: 'var(--accent-light)', fontWeight: 600 }}
          onMouseEnter={e => e.target.style.textDecoration = 'underline'}
          onMouseLeave={e => e.target.style.textDecoration = 'none'}
        >
          Log in
        </Link>
      </div>
    </div>
  );
};

export default Register;
