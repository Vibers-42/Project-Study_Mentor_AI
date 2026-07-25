import { jsPDF } from 'jspdf';

/* ─────────────────────────────────────────────────────────────
   Design tokens (all dimensions in mm on an A4 page 210×297)
   ───────────────────────────────────────────────────────────── */
const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 18;
const CONTENT_W = PAGE_W - MARGIN * 2;

const COLORS = {
  primary:    [109,  40, 217],  // #6d28d9 – deep violet
  accent:     [139,  92, 246],  // #8b5cf6
  dark:       [ 15,  17,  23],  // #0f1117
  heading:    [ 30,  32,  44],  // panel bg equivalent for text
  body:       [ 50,  50,  70],
  muted:      [120, 130, 150],
  border:     [220, 220, 235],
  white:      [255, 255, 255],
  success:    [ 22, 163,  74],
  warning:    [202, 138,   4],
  danger:     [185,  28,  28],
};

/* ─────────────────────────────────────────────────────────────
   Helpers
   ───────────────────────────────────────────────────────────── */

/** Return a colour mapped to a 0–100 score */
function scoreColor(score) {
  if (score >= 75) return COLORS.success;
  if (score >= 50) return COLORS.warning;
  return COLORS.danger;
}

/** Format ISO string → "Jul 25, 2026 · 12:05 PM" */
function fmtDateTime(iso) {
  if (!iso) return 'N/A';
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

/** Format elapsed seconds → "Xm Ys" */
function fmtDuration(secs) {
  if (!secs && secs !== 0) return 'N/A';
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  if (m === 0) return `${s}s`;
  return s === 0 ? `${m}m` : `${m}m ${s}s`;
}

/** Wrap long text into lines that fit within maxWidth */
function splitText(doc, text, maxWidth) {
  return doc.splitTextToSize(String(text ?? ''), maxWidth);
}

/** Draw a filled rounded rectangle */
function fillRoundRect(doc, x, y, w, h, r, rgb) {
  doc.setFillColor(...rgb);
  doc.roundedRect(x, y, w, h, r, r, 'F');
}

/** Draw a horizontal rule */
function hRule(doc, y, rgb = COLORS.border) {
  doc.setDrawColor(...rgb);
  doc.setLineWidth(0.25);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
}

/**
 * Draw a section heading bar (coloured pill + label)
 * Returns the new cursor Y after the heading.
 */
function sectionHeading(doc, y, label, pageCheck) {
  y = pageCheck(doc, y, 14);
  fillRoundRect(doc, MARGIN, y, CONTENT_W, 9, 2, COLORS.primary);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.white);
  doc.text(label.toUpperCase(), MARGIN + 4, y + 6);
  return y + 14;
}

/**
 * Draw a key-value row.
 * Returns new cursor Y.
 */
function kvRow(doc, y, key, value, pageCheck, { bold = false } = {}) {
  y = pageCheck(doc, y, 7);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.muted);
  doc.text(key, MARGIN, y);

  doc.setFont('helvetica', bold ? 'bold' : 'normal');
  doc.setTextColor(...COLORS.body);
  doc.text(String(value ?? 'N/A'), MARGIN + 55, y);

  return y + 7;
}

/**
 * Add a new page and return the refreshed cursor position.
 */
function addPage(doc) {
  doc.addPage();
  return MARGIN + 4;
}

/**
 * Return y (unchanged) if there is room, or move to a new page.
 * Keeps a minimum bottom margin of 20 mm.
 */
function ensureSpace(doc, y, needed) {
  if (y + needed > PAGE_H - 20) {
    return addPage(doc);
  }
  return y;
}

/* ─────────────────────────────────────────────────────────────
   Main exported function
   ───────────────────────────────────────────────────────────── */

/**
 * generateInterviewReport(sessionData) → jsPDF instance
 *
 * @param {Object} sessionData
 * @param {string}  sessionData.candidateName
 * @param {string}  sessionData.date
 * @param {number}  sessionData.interviewDuration   Seconds
 * @param {number}  sessionData.questionsAnswered
 * @param {number}  sessionData.totalQuestions
 * @param {Object}  sessionData.voiceResponses      { [questionIdx]: any }
 * @param {Object}  sessionData.textResponses        { [questionIdx]: string }
 * @param {number}  sessionData.score                0–100
 * @param {string}  sessionData.feedback
 * @param {string[]} sessionData.suggestions
 * @param {string}  sessionData.startTime            ISO string
 * @param {string}  sessionData.endTime              ISO string
 * @returns {jsPDF}
 */
export function generateInterviewReport(sessionData = {}) {
  const {
    candidateName   = 'Anonymous Candidate',
    date            = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    interviewDuration = 0,
    questionsAnswered = 0,
    totalQuestions  = 0,
    voiceResponses  = {},
    textResponses   = {},
    score           = null,
    feedback        = '',
    suggestions     = [],
    startTime       = null,
    endTime         = null,
  } = sessionData;

  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });

  // Convenience wrapper so every placement can call pageCheck
  const pageCheck = (d, y, needed) => ensureSpace(d, y, needed);

  /* ── PAGE 1: Cover strip + title ── */
  // Deep violet header strip
  fillRoundRect(doc, 0, 0, PAGE_W, 52, 0, COLORS.dark);

  // Brand accent line
  doc.setFillColor(...COLORS.accent);
  doc.rect(0, 50, PAGE_W, 2, 'F');

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(...COLORS.white);
  doc.text('AI Study Mentor', MARGIN, 22);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(180, 160, 255);
  doc.text('Interview Report', MARGIN, 31);

  // Generation date (top-right)
  doc.setFontSize(8);
  doc.setTextColor(140, 140, 180);
  doc.text(`Generated: ${fmtDateTime(new Date().toISOString())}`, PAGE_W - MARGIN, 22, { align: 'right' });

  let y = 64;

  /* ══════════════════════════════════════
     SECTION 1 — Candidate Information
     ══════════════════════════════════════ */
  y = sectionHeading(doc, y, '1. Candidate Information', pageCheck);

  // Candidate name in a pill
  fillRoundRect(doc, MARGIN, y, CONTENT_W, 14, 3, [245, 243, 255]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...COLORS.primary);
  doc.text(candidateName, MARGIN + 5, y + 9.5);
  y += 20;

  y = kvRow(doc, y, 'Report Date',   date,          pageCheck);
  y = kvRow(doc, y, 'Session Start', fmtDateTime(startTime), pageCheck);
  y = kvRow(doc, y, 'Session End',   fmtDateTime(endTime),   pageCheck);
  y += 4;

  /* ══════════════════════════════════════
     SECTION 2 — Interview Summary
     ══════════════════════════════════════ */
  y = sectionHeading(doc, y, '2. Interview Summary', pageCheck);

  y = kvRow(doc, y, 'Duration',           fmtDuration(interviewDuration), pageCheck);
  y = kvRow(doc, y, 'Questions Answered', `${questionsAnswered} / ${totalQuestions}`, pageCheck, { bold: true });
  y = kvRow(doc, y, 'Voice Responses',    Object.keys(voiceResponses).length, pageCheck);
  y = kvRow(doc, y, 'Text Responses',     Object.keys(textResponses).length,  pageCheck);

  const completion = totalQuestions > 0
    ? Math.round((questionsAnswered / totalQuestions) * 100)
    : 0;
  y = kvRow(doc, y, 'Completion',         `${completion}%`, pageCheck, { bold: true });

  // Compact progress bar
  y = pageCheck(doc, y, 12);
  y += 2;
  doc.setFillColor(...COLORS.border);
  doc.roundedRect(MARGIN + 55, y - 4, CONTENT_W - 55, 5, 1.5, 1.5, 'F');
  const fillW = ((CONTENT_W - 55) * completion) / 100;
  if (fillW > 0) {
    doc.setFillColor(...COLORS.accent);
    doc.roundedRect(MARGIN + 55, y - 4, fillW, 5, 1.5, 1.5, 'F');
  }
  y += 8;

  /* ══════════════════════════════════════
     SECTION 3 — Questions Answered
     ══════════════════════════════════════ */
  y = sectionHeading(doc, y, '3. Questions & Responses', pageCheck);

  const allIdx = Array.from(
    new Set([...Object.keys(textResponses), ...Object.keys(voiceResponses)])
  ).sort((a, b) => Number(a) - Number(b));

  if (allIdx.length === 0) {
    y = pageCheck(doc, y, 8);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.muted);
    doc.text('No responses recorded.', MARGIN, y);
    y += 10;
  } else {
    for (const idx of allIdx) {
      const qNum     = parseInt(idx, 10) + 1;
      const text     = textResponses[idx] || null;
      const hasVoice = !!voiceResponses[idx];

      // Estimate block height
      const textLines = text ? splitText(doc, text, CONTENT_W - 8) : [];
      const blockH    = 8 + (text ? textLines.length * 5 : 6) + 4;

      y = pageCheck(doc, y, blockH + 4);

      // Card background
      fillRoundRect(doc, MARGIN, y, CONTENT_W, blockH, 2.5, [248, 247, 255]);

      // Question number chip
      fillRoundRect(doc, MARGIN + 2, y + 2, 22, 6.5, 1.5, COLORS.primary);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(...COLORS.white);
      doc.text(`Q ${qNum}`, MARGIN + 5, y + 6.8);

      // Voice badge
      if (hasVoice) {
        fillRoundRect(doc, MARGIN + 26, y + 2, 18, 6.5, 1.5, [237, 233, 254]);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(...COLORS.accent);
        doc.text('VOICE', MARGIN + 29.5, y + 6.8);
      }

      // Response text
      const textY = y + 11;
      if (text) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(...COLORS.body);
        doc.text(textLines, MARGIN + 4, textY);
      } else {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8.5);
        doc.setTextColor(...COLORS.muted);
        doc.text('No text response recorded.', MARGIN + 4, textY);
      }

      y += blockH + 5;
    }
  }

  /* ══════════════════════════════════════
     SECTION 4 — Overall Score
     ══════════════════════════════════════ */
  y = sectionHeading(doc, y, '4. Overall Score', pageCheck);
  y = pageCheck(doc, y, 22);

  if (score !== null && score !== undefined) {
    const scoreRgb = scoreColor(Number(score));
    const label    = score >= 75 ? 'Excellent' : score >= 50 ? 'Good' : 'Needs Improvement';

    // Score circle (approximated with a filled rect + text)
    fillRoundRect(doc, MARGIN, y, 28, 18, 4, scoreRgb);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(...COLORS.white);
    doc.text(`${score}`, MARGIN + 14, y + 12, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...scoreRgb);
    doc.text(label, MARGIN + 33, y + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...COLORS.muted);
    doc.text('/ 100', MARGIN + 33, y + 15);

    y += 24;
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.muted);
    doc.text('Score not yet evaluated.', MARGIN, y);
    y += 10;
  }

  /* ══════════════════════════════════════
     SECTION 5 — AI Feedback
     ══════════════════════════════════════ */
  y = sectionHeading(doc, y, '5. AI Feedback', pageCheck);

  const feedbackText = feedback?.trim() || 'No AI feedback available for this session.';
  const feedbackLines = splitText(doc, feedbackText, CONTENT_W - 8);
  const fbBlockH      = feedbackLines.length * 5.5 + 8;

  y = pageCheck(doc, y, fbBlockH + 4);
  fillRoundRect(doc, MARGIN, y, CONTENT_W, fbBlockH, 3, [245, 243, 255]);

  doc.setFont('helvetica', feedback ? 'normal' : 'italic');
  doc.setFontSize(9);
  doc.setTextColor(feedback ? COLORS.body[0] : COLORS.muted[0], feedback ? COLORS.body[1] : COLORS.muted[1], feedback ? COLORS.body[2] : COLORS.muted[2]);
  doc.text(feedbackLines, MARGIN + 4, y + 6.5);
  y += fbBlockH + 8;

  /* ══════════════════════════════════════
     SECTION 6 — Suggestions for Improvement
     ══════════════════════════════════════ */
  y = sectionHeading(doc, y, '6. Suggestions for Improvement', pageCheck);

  const suggList = Array.isArray(suggestions) && suggestions.length > 0
    ? suggestions
    : ['No suggestions at this time.'];

  for (let i = 0; i < suggList.length; i++) {
    const suggLines = splitText(doc, suggList[i], CONTENT_W - 14);
    const sH = suggLines.length * 5 + 6;

    y = pageCheck(doc, y, sH + 3);

    // Bullet chip
    fillRoundRect(doc, MARGIN, y, 6, 6, 1.5, COLORS.accent);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(...COLORS.white);
    doc.text(`${i + 1}`, MARGIN + 2.5, y + 4.8, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.body);
    doc.text(suggLines, MARGIN + 10, y + 4.5);

    y += sH + 3;
  }

  /* ══════════════════════════════════════
     Footer — all pages
     ══════════════════════════════════════ */
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);

    // Footer bar
    doc.setFillColor(...COLORS.dark);
    doc.rect(0, PAGE_H - 12, PAGE_W, 12, 'F');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(140, 140, 180);
    doc.text(
      `AI Study Mentor  ·  Confidential Interview Report  ·  ${fmtDateTime(new Date().toISOString())}`,
      MARGIN,
      PAGE_H - 4.5
    );
    doc.text(`Page ${p} of ${totalPages}`, PAGE_W - MARGIN, PAGE_H - 4.5, { align: 'right' });
  }

  return doc;
}

/**
 * Convenience wrapper: generate and immediately trigger browser download.
 *
 * @param {Object} sessionData  Same shape as generateInterviewReport()
 * @param {string} [filename]
 */
export function downloadInterviewReport(sessionData, filename = 'Interview_Report.pdf') {
  try {
    const doc = generateInterviewReport(sessionData);
    doc.save(filename);
    return { success: true };
  } catch (error) {
    console.error('[pdfService] Failed to generate report:', error);
    return { success: false, error: error.message };
  }
}

export default { generateInterviewReport, downloadInterviewReport };
