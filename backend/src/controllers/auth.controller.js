const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { supabaseAdmin } = require('../config/supabase');
const { success, created, error } = require('../utils/apiResponse');

const generateToken = (user) => jwt.sign(
  { id: user.id, email: user.email, full_name: user.full_name },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);

const register = async (req, res, next) => {
  try {
    const { email, password, full_name } = req.body;

    // Check for existing user
    const { data: existing } = await supabaseAdmin
      .from('users').select('id').eq('email', email).single();
    if (existing) return error(res, 'An account with this email already exists. Please log in.', 400);

    const password_hash = await bcrypt.hash(password, 12);
    const { data: user, error: dbError } = await supabaseAdmin
      .from('users')
      .insert([{ email, password_hash, full_name }])
      .select('id, email, full_name')
      .single();

    if (dbError) return error(res, 'Registration failed. Please try again.', 500);

    const token = generateToken(user);
    return created(res, {
      user: { id: user.id, email: user.email, full_name: user.full_name },
      session: { access_token: token, token_type: 'bearer' },
    }, 'Account created successfully');
  } catch (err) { next(err); }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { data: user } = await supabaseAdmin
      .from('users').select('*').eq('email', email).single();

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return error(res, 'Invalid email or password.', 401);
    }

    const token = generateToken(user);
    return success(res, {
      user: { id: user.id, email: user.email, full_name: user.full_name },
      session: { access_token: token, token_type: 'bearer' },
    }, 'Login successful');
  } catch (err) { next(err); }
};

const logout = async (req, res) => success(res, null, 'Logged out successfully');

const me = async (req, res, next) => {
  try {
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('id, email, full_name, job_role, skill_level, xp, level, badges')
      .eq('id', req.user.id)
      .single();
    if (!user) return error(res, 'User not found.', 404);
    return success(res, user);
  } catch (err) { next(err); }
};

const updateProfile = async (req, res, next) => {
  try {
    const { full_name, job_role, skill_level, learning_goals } = req.body;
    const updates = {};
    if (full_name !== undefined) updates.full_name = full_name;
    if (job_role !== undefined) updates.job_role = job_role;
    if (skill_level !== undefined) updates.skill_level = skill_level;
    if (learning_goals !== undefined) updates.learning_goals = learning_goals;
    updates.updated_at = new Date().toISOString();

    const { data, error: dbError } = await supabaseAdmin
      .from('users').update(updates).eq('id', req.user.id)
      .select('id, email, full_name, job_role, skill_level').single();

    if (dbError) return error(res, 'Failed to update profile.', 500);
    return success(res, data, 'Profile updated successfully');
  } catch (err) { next(err); }
};

module.exports = { register, login, logout, me, updateProfile };
