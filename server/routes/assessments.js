const express = require('express');
const auth = require('../middleware/auth');
const { Assessment, AssessmentAttempt } = require('../models');
const router = express.Router();

// Get all assessments (paginated)
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const { count, rows } = await Assessment.findAndCountAll({
      limit, offset, order: [['createdAt', 'DESC']]
    });
    res.json({ data: rows, pagination: { page, limit, total: count, totalPages: Math.ceil(count / limit) } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const item = await Assessment.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create
router.post('/', auth, async (req, res) => {
  try {
    const item = await Assessment.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update
router.put('/:id', auth, async (req, res) => {
  try {
    const item = await Assessment.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    await item.update(req.body);
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Assessment.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    await item.destroy();
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit assessment answers - auto-graded
router.post('/:id/submit', auth, async (req, res) => {
  try {
    const { answers } = req.body; // [{ questionIndex, selected }]
    const assessment = await Assessment.findByPk(req.params.id);
    if (!assessment) return res.status(404).json({ error: 'Assessment not found' });

    const questions = assessment.questions;
    if (!Array.isArray(questions)) {
      return res.status(400).json({ error: 'Assessment has no structured questions to grade' });
    }

    let score = 0;
    const totalPoints = assessment.totalPoints || assessment.maxScore || 100;
    const feedback = [];

    questions.forEach((q, idx) => {
      const answer = answers?.find(a => a.questionIndex === idx);
      const selected = answer?.selected;
      const correct = selected === q.correct_answer;
      const pts = q.points || Math.round(totalPoints / questions.length);
      if (correct) score += pts;
      feedback.push({
        questionIndex: idx,
        question: q.question,
        selected,
        correct_answer: q.correct_answer,
        correct,
        points_earned: correct ? pts : 0,
        points_possible: pts,
        explanation: q.explanation || ''
      });
    });

    const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;
    const userId = req.user?.id || req.user?.userId;

    const attempt = await AssessmentAttempt.create({
      assessmentId: assessment.id,
      userId,
      answers,
      score,
      totalPoints,
      percentage,
      completedAt: new Date()
    });

    res.json({ score, total_points: totalPoints, percentage, feedback, attemptId: attempt.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
