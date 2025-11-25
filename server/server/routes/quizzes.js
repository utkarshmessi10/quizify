const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const quizController = require('../controllers/quizController');
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');

router.get('/', quizController.listQuizzes);

router.get('/admin/all', requireAuth, requireRole("admin"), quizController.getAllQuizzesForAdmin);

router.get('/admin/attempts', requireAuth, requireRole("admin"), quizController.getAllAttempts);

router.get('/me/attempts', requireAuth, quizController.getMyAttempts);

router.get('/:id', requireAuth, quizController.getQuizForAttempt);

/* Admin create quiz */
router.post('/',
  requireAuth,
  requireRole("admin"),
  body('title').isLength({ min: 3 }),
  body('questions').isArray({ min: 1 }),
  quizController.createQuiz
);

/* Admin update quiz */
router.put('/:id',
  requireAuth,
  requireRole("admin"),
  body('title').isLength({ min: 3 }),
  quizController.updateQuiz
);

/* Admin delete quiz */
router.delete('/:id',
  requireAuth,
  requireRole("admin"),
  quizController.deleteQuiz
);

router.get('/:id/admin', requireAuth, requireRole("admin"), quizController.getQuizForAdmin);

router.post('/:id/attempt', requireAuth, quizController.submitAttempt);

router.get('/:id/attempts', requireAuth, requireRole("admin"), quizController.getAttemptsForQuiz);

module.exports = router;
