const logger = require('./logger');

/**
 * Extract JSON from Claude's text response.
 * Handles markdown code fences and raw JSON in the text.
 */
const parseClaudeJSON = (text) => {
  if (!text) return null;

  // Try JSON inside a markdown code fence first
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    try {
      return JSON.parse(fenceMatch[1].trim());
    } catch {
      logger.debug('Failed to parse JSON from code fence');
    }
  }

  // Try finding the outermost JSON object or array
  const objectMatch = text.match(/\{[\s\S]*\}/);
  if (objectMatch) {
    try {
      return JSON.parse(objectMatch[0]);
    } catch {
      logger.debug('Failed to parse raw JSON object');
    }
  }

  // Try parsing the full text
  try {
    return JSON.parse(text.trim());
  } catch {
    logger.debug('Failed to parse full text as JSON');
    return null;
  }
};

/**
 * Extract only text blocks from a Claude message (strips thinking blocks).
 */
const extractTextContent = (message) => {
  if (!message?.content) return '';
  return message.content
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('\n');
};

module.exports = { parseClaudeJSON, extractTextContent };
