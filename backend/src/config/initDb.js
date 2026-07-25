const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

const initDb = async () => {
  if (!process.env.DATABASE_URL) {
    logger.warn('DATABASE_URL not set — skipping auto DB init');
    return;
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();

    // Check if tables already exist — skip if they do
    const { rows } = await client.query(`
      SELECT COUNT(*) AS count FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'users'
    `);

    if (parseInt(rows[0].count) > 0) {
      logger.info('Database already initialized — skipping schema setup');
      return;
    }

    const sql = fs.readFileSync(
      path.join(__dirname, '../models/schema.sql'),
      'utf8'
    );
    await client.query(sql);
    logger.info('Database schema initialized successfully');
  } catch (err) {
    logger.error(`DB init error (non-fatal): ${err.message}`);
  } finally {
    await client.end();
  }
};

module.exports = initDb;
