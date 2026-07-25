import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Badge, Avatar } from '../../components';

const Landing = () => {
  const features = [
    {
      id: 'doubt-solver',
      title: 'AI Doubt Solver',
      description: 'Get instant, step-by-step explanations for complex math, coding, science, and logic questions 24/7.',
      badge: 'Instant Help',
      badgeVariant: 'primary',
      icon: (
        <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 shadow-xs">
          <svg className="w-6 h-6 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M12 18h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      ),
    },
    {
      id: 'mock-interview',
      title: 'Mock Interview Practice',
      description: 'Practice realistic technical, behavioral, and academic interviews with immediate AI scoring, feedback, and critique.',
      badge: 'Interactive',
      badgeVariant: 'secondary',
      icon: (
        <div className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-4 shadow-xs">
          <svg className="w-6 h-6 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        </div>
      ),
    },
    {
      id: 'progress-tracking',
      title: 'Progress Tracking',
      description: 'Monitor your study velocity, streak counts, and topic mastery levels through clean, visual analytics dashboards.',
      badge: 'Analytics',
      badgeVariant: 'success',
      icon: (
        <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 shadow-xs">
          <svg className="w-6 h-6 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
          </svg>
        </div>
      ),
    },
    {
      id: 'personalized-learning',
      title: 'Personalized Learning',
      description: 'Receive custom-curated study roadmaps and adaptive practice queues tailored to your specific goals.',
      badge: 'Adaptive',
      badgeVariant: 'info',
      icon: (
        <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-4 shadow-xs">
          <svg className="w-6 h-6 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18c-2.305 0-4.408.867-6 2.292m0-14.25v14.25" />
          </svg>
        </div>
      ),
    },
  ];

  const steps = [
    {
      number: '1',
      title: 'Sign Up',
      description: 'Create your free account in seconds and select your target subjects, exams, or interview goals.',
    },
    {
      number: '2',
      title: 'Ask Questions',
      description: 'Submit complex doubts or upload problems to receive clear, step-by-step AI solutions instantly.',
    },
    {
      number: '3',
      title: 'Practice Interviews',
      description: 'Launch interactive AI mock interview sessions with real-time feedback, tone analysis, and performance scoring.',
    },
    {
      number: '4',
      title: 'Track Progress',
      description: 'Review detailed performance analytics and master weak concepts faster with personalized revision queues.',
    },
  ];

  const benefits = [
    {
      title: '24/7 AI Assistance',
      description: 'Get instant, accurate explanations anytime without waiting for office hours, tutors, or study groups.',
      icon: (
        <svg className="w-6 h-6 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Personalized Feedback',
      description: 'Receive deep breakdowns of your reasoning, code efficiency, and response delivery to fix gaps fast.',
      icon: (
        <svg className="w-6 h-6 text-violet-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Interview Readiness',
      description: 'Build real-world confidence with timed AI mock sessions tailored to top tech and academic standards.',
      icon: (
        <svg className="w-6 h-6 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      ),
    },
    {
      title: 'Smart Learning Analytics',
      description: 'Track topic mastery levels, velocity, and weak areas with automated, intuitive visual charts.',
      icon: (
        <svg className="w-6 h-6 text-sky-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      ),
    },
  ];

  const testimonials = [
    {
      name: 'Alex Rivera',
      role: 'Computer Science Student @ Stanford',
      initials: 'AR',
      rating: 5,
      quote: 'Study Mentor AI helped me ace my algorithms midterm and land my dream software engineering internship! The AI mock interview feedback was remarkably insightful.',
    },
    {
      name: 'Priya Sharma',
      role: 'Electrical Engineering Senior',
      initials: 'PS',
      rating: 5,
      quote: 'The AI Doubt Solver is like having a patient professor available 24/7. It breaks down complex calculus and signal processing problems step-by-step!',
    },
    {
      name: 'Marcus Chen',
      role: 'Pre-Med Student',
      initials: 'MC',
      rating: 5,
      quote: 'The progress tracking dashboard keeps me accountable every single day. My study consistency and retention have improved drastically since using Study Mentor AI.',
    },
  ];

  return (
    <div className="w-full space-y-24 sm:space-y-32 py-8 sm:py-12">
      
      {/* 1. HERO SECTION */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-12 overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-500/20 blur-3xl rounded-full pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Text Content */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-200 dark:border-indigo-800/60 bg-indigo-50/80 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs sm:text-sm font-medium shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
              ✨ Next-Gen AI Learning & Interview Platform
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 leading-[1.15]">
              Supercharge Your Learning with{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-500 dark:from-indigo-400 dark:via-violet-400 dark:to-indigo-300 bg-clip-text text-transparent">
                Study Mentor AI
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Instant 24/7 AI doubt solving, realistic mock interview practice, and personalized progress analytics built for student success.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link to="/register" className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  className="shadow-md shadow-indigo-500/20 hover:scale-[1.02] transition-transform duration-200"
                  rightIcon={
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  }
                >
                  Get Started
                </Button>
              </Link>

              <Link to="/question" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  fullWidth
                  className="hover:scale-[1.02] transition-transform duration-200"
                  leftIcon={
                    <svg className="w-5 h-5 fill-current text-indigo-500" viewBox="0 0 20 20">
                      <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z" />
                    </svg>
                  }
                >
                  Try AI Mentor
                </Button>
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800/80 grid grid-cols-3 gap-4 text-center lg:text-left">
              <div>
                <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">24/7</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Instant AI Help</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-indigo-600 dark:text-indigo-400">99.4%</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Accuracy Rate</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-violet-600 dark:text-violet-400">10k+</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Active Students</div>
              </div>
            </div>
          </div>

          {/* Right Column: AI/Education Illustration */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md shadow-2xl p-2 group transition-all duration-300 hover:scale-[1.01]">
              <img
                src="/hero_ai_study_mentor.png"
                alt="Study Mentor AI Platform"
                className="w-full h-auto rounded-xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURES SECTION */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-12 sm:mb-16">
          <Badge variant="primary" size="lg">Core Features</Badge>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Powered by Cutting-Edge AI
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">
            Designed to bridge the gap between complex textbook theory and practical real-world mastery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat) => (
            <Card
              key={feat.id}
              hoverable
              className="h-full flex flex-col justify-between p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl border-slate-200/80 dark:border-slate-800"
            >
              <div>
                {feat.icon}
                <div className="mb-2">
                  <Badge variant={feat.badgeVariant} size="sm">{feat.badge}</Badge>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  {feat.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feat.description}
                </p>
              </div>

              <div className="pt-6">
                <Link
                  to={feat.id === 'mock-interview' ? '/interview' : '/question'}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 group"
                >
                  <span>Try feature</span>
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-12 sm:mb-16">
          <Badge variant="secondary" size="lg">Simple Workflow</Badge>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            How Study Mentor AI Works
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">
            Start solving doubts and practicing mock interviews in 4 simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <Card
              key={step.number}
              className="relative p-6 space-y-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border-slate-200/80 dark:border-slate-800"
            >
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-extrabold flex items-center justify-center text-lg shadow-md">
                {step.number}
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {step.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {step.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* 4. WHY CHOOSE STUDY MENTOR AI SECTION */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-12 sm:mb-16">
          <Badge variant="info" size="lg">Why Us</Badge>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Why Choose Study Mentor AI
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">
            Engineered specifically to help students excel academically and crack competitive interviews.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {benefits.map((ben, i) => (
            <Card
              key={i}
              className="p-6 flex items-start gap-4 transition-all duration-300 hover:scale-[1.01] hover:shadow-md border-slate-200/80 dark:border-slate-800"
            >
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0">
                {ben.icon}
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {ben.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {ben.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 5. TESTIMONIALS SECTION */}
      <section id="testimonials" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-12 sm:mb-16">
          <Badge variant="success" size="lg">Student Success Stories</Badge>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Loved by Students Everywhere
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">
            Hear how Study Mentor AI is helping students master tough subjects and land dream offers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <Card
              key={idx}
              className="p-6 flex flex-col justify-between space-y-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl border-slate-200/80 dark:border-slate-800"
            >
              <div className="space-y-3">
                {/* Star Rating */}
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(t.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
                  "{t.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Avatar name={t.name} size="md" status="online" />
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{t.name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{t.role}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 6. CALL TO ACTION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 text-white p-8 sm:p-14 lg:p-16 overflow-hidden shadow-2xl">
          {/* Decorative glows */}
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-violet-400/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6 text-center mx-auto">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Ready to Begin Learning with Study Mentor AI?
            </h2>
            <p className="text-indigo-100 text-base sm:text-xl leading-relaxed max-w-2xl mx-auto">
              Join thousands of students mastering complex subjects and passing technical interviews today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link to="/register" className="w-full sm:w-auto">
                <Button
                  variant="secondary"
                  size="lg"
                  className="!bg-white !text-indigo-700 hover:!bg-slate-100 active:!bg-slate-200 border-none font-bold shadow-lg hover:scale-[1.02] transition-transform duration-200"
                >
                  Create Free Account
                </Button>
              </Link>
              <Link to="/login" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10 hover:scale-[1.02] transition-transform duration-200"
                >
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Anchor targets for Legal modals/sections */}
      <div id="privacy" className="sr-only" />
      <div id="terms" className="sr-only" />

    </div>
  );
};

export default Landing;
