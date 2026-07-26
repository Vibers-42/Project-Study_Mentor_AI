/**
 * Seed script — populates sample data into Supabase tables.
 * Uses auth.admin.createUser to generate synchronized user IDs across auth.users & public.users.
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
);

const log = (msg) => console.log(`[seed] ${msg}`);
const err = (msg, e) => console.error(`[seed] ERROR: ${msg}`, e?.message || e);

async function seedUsers() {
  log('Seeding users (auth.users + public.users)...');

  const testAccounts = [
    {
      email: 'test@studymentor.ai',
      password: 'Test@1234',
      full_name: 'Alex Johnson',
      job_role: 'Full Stack Developer',
      skill_level: 'intermediate',
      learning_goals: ['React', 'Node.js', 'System Design'],
      xp: 2450,
      level: 5,
      badges: ['first_session', 'streak_7', 'perfect_score'],
      total_sessions: 18,
    },
    {
      email: 'demo@studymentor.ai',
      password: 'Demo@1234',
      full_name: 'Sarah Chen',
      job_role: 'Frontend Engineer',
      skill_level: 'advanced',
      learning_goals: ['TypeScript', 'Performance Optimization', 'Accessibility'],
      xp: 4200,
      level: 8,
      badges: ['first_session', 'streak_7', 'streak_30', 'perfect_score', 'topic_master'],
      total_sessions: 42,
    },
  ];

  const readyUsers = [];

  for (const account of testAccounts) {
    let userId;

    // 1. Create or fetch from auth.users
    const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
      email: account.email,
      password: account.password,
      email_confirm: true,
      user_metadata: { full_name: account.full_name },
    });

    if (authErr) {
      if (authErr.message.includes('already been registered')) {
        // Fetch existing auth user list
        const { data: userList } = await supabase.auth.admin.listUsers();
        const existingAuth = userList?.users?.find(u => u.email === account.email);
        userId = existingAuth?.id;
        log(`  Auth user ${account.email} already exists (${userId})`);
      } else {
        err(`Failed creating auth user ${account.email}`, authErr);
        continue;
      }
    } else {
      userId = authData.user.id;
      log(`  Created auth user ${account.email} (${userId})`);
    }

    if (!userId) continue;

    // 2. Ensure public.users has matching record with same ID
    const password_hash = await bcrypt.hash(account.password, 12);
    const userPayload = {
      id: userId,
      email: account.email,
      password_hash,
      full_name: account.full_name,
      job_role: account.job_role,
      skill_level: account.skill_level,
      learning_goals: account.learning_goals,
      xp: account.xp,
      level: account.level,
      badges: account.badges,
      total_sessions: account.total_sessions,
    };

    const { error: publicErr } = await supabase
      .from('users')
      .upsert([userPayload], { onConflict: 'email' });

    if (publicErr) {
      err(`Failed upserting public.user ${account.email}`, publicErr);
    } else {
      log(`  Upserted public.users ${account.email} ✓`);
    }

    readyUsers.push({ ...account, id: userId });
  }

  return readyUsers;
}

async function seedQuestions() {
  log('Seeding questions...');

  const questions = [
    {
      topic: 'React',
      job_role: 'Frontend Engineer',
      difficulty: 'beginner',
      question_type: 'conceptual',
      question_text: 'Explain the difference between state and props in React. When would you use each?',
      hints: ['Think about data ownership', 'Consider mutability'],
      expected_concepts: ['immutability', 'unidirectional data flow', 'component re-rendering'],
      follow_up_questions: ['How does lifting state up work?', 'What is prop drilling?'],
    },
    {
      topic: 'React',
      job_role: 'Frontend Engineer',
      difficulty: 'intermediate',
      question_type: 'practical',
      question_text: 'How would you optimize a React application that has slow rendering performance? Walk me through your debugging process.',
      hints: ['React DevTools Profiler', 'Memoization techniques'],
      expected_concepts: ['React.memo', 'useMemo', 'useCallback', 'virtualization', 'code splitting'],
      follow_up_questions: ['When should you NOT use useMemo?', 'Explain React Compiler.'],
    },
    {
      topic: 'Node.js',
      job_role: 'Backend Engineer',
      difficulty: 'intermediate',
      question_type: 'conceptual',
      question_text: 'Explain the Node.js event loop and how it handles asynchronous operations.',
      hints: ['Think about the phases', 'Consider microtasks vs macrotasks'],
      expected_concepts: ['call stack', 'callback queue', 'microtask queue', 'non-blocking I/O'],
      follow_up_questions: ['What is the difference between setImmediate and setTimeout?'],
    },
    {
      topic: 'System Design',
      job_role: 'Full Stack Developer',
      difficulty: 'advanced',
      question_type: 'scenario',
      question_text: 'Design a real-time collaborative document editor like Google Docs. Focus on conflict resolution and data synchronization.',
      hints: ['Consider CRDTs or OT', 'Think about WebSocket connections'],
      expected_concepts: ['CRDT', 'operational transformation', 'WebSockets', 'eventual consistency'],
      follow_up_questions: ['How would you handle offline mode?', 'How do you scale WebSocket connections?'],
    },
    {
      topic: 'JavaScript',
      job_role: 'Frontend Engineer',
      difficulty: 'beginner',
      question_type: 'conceptual',
      question_text: 'What is the difference between var, let, and const in JavaScript? Explain with examples.',
      hints: ['Think about scoping', 'Consider hoisting behavior'],
      expected_concepts: ['block scoping', 'hoisting', 'temporal dead zone', 'reassignment'],
      follow_up_questions: ['What happens when you use const with objects?'],
    },
    {
      topic: 'Database',
      job_role: 'Backend Engineer',
      difficulty: 'advanced',
      question_type: 'practical',
      question_text: 'How would you design a database schema for a multi-tenant SaaS application? What are the trade-offs of different approaches?',
      hints: ['Shared vs. separate schemas', 'Row-level security'],
      expected_concepts: ['multi-tenancy patterns', 'row-level security', 'schema isolation', 'connection pooling'],
      follow_up_questions: ['How do you handle tenant-specific migrations?'],
    },
  ];

  const { data: existing } = await supabase.from('questions').select('id').limit(1);
  if (existing && existing.length > 0) {
    log('  Questions already seeded — skipping');
    return;
  }

  const { data, error } = await supabase.from('questions').insert(questions).select('id');
  if (error) err('Failed to seed questions', error);
  else log(`  Inserted ${data.length} questions ✓`);
}

async function seedProgress(users) {
  log('Seeding user_progress...');
  if (!users.length) return [];

  const alex = users.find(u => u.email === 'test@studymentor.ai') || users[0];

  const sessions = [
    {
      user_id: alex.id,
      topic: 'React',
      job_role: 'Full Stack Developer',
      session_data: [
        { question: 'Explain React hooks', answer: 'Hooks are functions...', score: 8.5, topic: 'React', type: 'conceptual' },
        { question: 'What is useEffect?', answer: 'useEffect handles side effects...', score: 7.0, topic: 'React', type: 'practical' },
      ],
      overall_score: 7.8,
      questions_count: 2,
      duration_minutes: 15,
    },
    {
      user_id: alex.id,
      topic: 'Node.js',
      job_role: 'Full Stack Developer',
      session_data: [
        { question: 'Explain event loop', answer: 'The event loop...', score: 9.0, topic: 'Node.js', type: 'conceptual' },
        { question: 'What is middleware?', answer: 'Middleware functions...', score: 8.0, topic: 'Node.js', type: 'practical' },
      ],
      overall_score: 8.5,
      questions_count: 2,
      duration_minutes: 20,
    },
  ];

  const { data, error } = await supabase.from('user_progress').insert(sessions).select('id, topic');
  if (error) err('Failed to seed progress', error);
  else log(`  Inserted ${data?.length || 0} sessions ✓`);
  return data || [];
}

async function seedAnswers(users, sessions) {
  log('Seeding user_answers...');
  if (!users.length) return;

  const alex = users.find(u => u.email === 'test@studymentor.ai') || users[0];

  const answers = [
    {
      user_id: alex.id,
      session_id: sessions[0]?.id || null,
      question_text: 'Explain the difference between state and props in React.',
      user_answer_text: 'State is mutable data owned by component; props are immutable data passed down.',
      score: 8.5,
      grade: 'A',
      strengths: ['Clear explanation of ownership', 'Mentioned immutability'],
      weaknesses: ['Could elaborate on re-rendering'],
      missing_concepts: ['Context API'],
      better_answer: 'State represents mutable internal data...',
    },
    {
      user_id: alex.id,
      session_id: sessions[1]?.id || null,
      question_text: 'Explain the Node.js event loop.',
      user_answer_text: 'The event loop processes asynchronous callbacks in phases.',
      score: 9.0,
      grade: 'A',
      strengths: ['Good phase breakdown'],
      weaknesses: [],
      missing_concepts: [],
      better_answer: null,
    },
  ];

  const { data, error } = await supabase.from('user_answers').insert(answers).select('id');
  if (error) err('Failed to seed answers', error);
  else log(`  Inserted ${data?.length || 0} answers ✓`);
}

async function seedLeaderboard(users) {
  log('Seeding leaderboard...');
  if (!users.length) return;

  const entries = users.map(u => ({
    user_id: u.id,
    full_name: u.full_name,
    xp: u.xp,
    level: u.level,
    average_score: u.email === 'test@studymentor.ai' ? 8.2 : 9.1,
    total_sessions: u.total_sessions,
    badges: u.badges,
  }));

  const { data, error } = await supabase.from('leaderboard').upsert(entries, { onConflict: 'user_id' }).select('full_name, xp');
  if (error) err('Failed to seed leaderboard', error);
  else log(`  Inserted/Updated ${data?.length || 0} leaderboard entries ✓`);
}

async function main() {
  log('========================================');
  log('  AI Study Mentor — Database Seed');
  log('========================================');
  log('');

  const users = await seedUsers();
  await seedQuestions();
  const sessions = await seedProgress(users);
  await seedAnswers(users, sessions);
  await seedLeaderboard(users);

  log('');
  log('========================================');
  log('  Seeding complete!');
  log('========================================');
  log('Test accounts available:');
  log('  Email: test@studymentor.ai  |  Password: Test@1234');
  log('  Email: demo@studymentor.ai  |  Password: Demo@1234');
  log('');
}

main().catch((e) => {
  err('Seed script failed', e);
  process.exit(1);
});
