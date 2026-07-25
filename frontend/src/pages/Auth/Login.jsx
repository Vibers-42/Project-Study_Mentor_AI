import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button, Input, Checkbox, Card } from '../../components';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forgotMsg, setForgotMsg] = useState('');
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  });

  const onSubmit = (data) => {
    setIsSubmitting(true);
    // Mock authentication delay (no backend API call)
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/dashboard');
    }, 1000);
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setForgotMsg('Password reset link sent to your email (simulated).');
    setTimeout(() => setForgotMsg(''), 4000);
  };

  return (
    <Card className="p-6 sm:p-8 shadow-xl border-slate-200/80 dark:border-slate-800 transition-all duration-300">
      {/* Header */}
      <div className="mb-6 text-center sm:text-left">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
          Welcome Back
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Sign in to your Study Mentor AI account to resume your progress.
        </p>
      </div>

      {forgotMsg && (
        <div className="mb-4 p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 text-xs font-medium border border-indigo-200 dark:border-indigo-800 animate-in fade-in duration-200">
          {forgotMsg}
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* Email Field */}
        <Input
          label="Email Address"
          type="email"
          placeholder="name@example.com"
          required
          autoComplete="email"
          error={errors.email?.message}
          leftIcon={
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
          }
          {...register('email', {
            required: 'Email address is required.',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Please enter a valid email address.',
            },
          })}
        />

        {/* Password Field */}
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          required
          autoComplete="current-password"
          error={errors.password?.message}
          leftIcon={
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          }
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
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
          }
          {...register('password', {
            required: 'Password is required.',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters long.',
            },
          })}
        />

        {/* Remember Me & Forgot Password Row */}
        <div className="flex items-center justify-between gap-2 pt-1 text-sm">
          <Checkbox
            label="Remember me"
            {...register('remember')}
          />
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors shrink-0"
          >
            Forgot password?
          </button>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isSubmitting}
          className="mt-2 shadow-md hover:scale-[1.01] transition-all"
        >
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      {/* Footer Link to Register */}
      <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/80 text-center text-sm text-slate-600 dark:text-slate-400">
        Don't have an account?{' '}
        <Link
          to="/register"
          className="font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
        >
          Create Free Account
        </Link>
      </div>
    </Card>
  );
};

export default Login;
