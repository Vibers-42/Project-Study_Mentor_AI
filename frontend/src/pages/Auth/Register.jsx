import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button, Input, Card } from '../../components';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const passwordValue = watch('password');

  const onSubmit = (data) => {
    setIsSubmitting(true);
    // Mock registration delay (no backend API call)
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <Card className="p-6 sm:p-8 shadow-xl border-slate-200/80 dark:border-slate-800 transition-all duration-300">
      {/* Header */}
      <div className="mb-6 text-center sm:text-left">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
          Create Your Account
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Start your personalized AI study & interview journey today.
        </p>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Full Name Field */}
        <Input
          label="Full Name"
          type="text"
          placeholder="Alex Rivera"
          required
          autoComplete="name"
          error={errors.name?.message}
          leftIcon={
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          }
          {...register('name', {
            required: 'Full name is required.',
            minLength: {
              value: 2,
              message: 'Name must be at least 2 characters long.',
            },
          })}
        />

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
          autoComplete="new-password"
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

        {/* Confirm Password Field */}
        <Input
          label="Confirm Password"
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder="••••••••"
          required
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          leftIcon={
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          }
          rightIcon={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none"
              aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
            >
              {showConfirmPassword ? (
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
          {...register('confirmPassword', {
            required: 'Please confirm your password.',
            validate: (value) =>
              value === passwordValue || 'Passwords do not match.',
          })}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isSubmitting}
          className="mt-4 shadow-md hover:scale-[1.01] transition-all"
        >
          {isSubmitting ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>

      {/* Footer Link to Login */}
      <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/80 text-center text-sm text-slate-600 dark:text-slate-400">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
        >
          Sign In
        </Link>
      </div>
    </Card>
  );
};

export default Register;
