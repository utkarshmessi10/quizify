const Quiz = require('../models/Quiz');
const Attempt = require('../models/Attempt');

/* Admin create quiz */
exports.createQuiz = async (req, res) => {
  try {
    const data = req.body;
    data.createdBy = req.user.id;

    const quiz = new Quiz(data);
    await quiz.save();
    res.json(quiz);
  } catch (err) {
    console.error('Create quiz error:', err);
    res.status(500).json({ message: "Error creating quiz" });
  }
};

/* List quizzes (for users) */
exports.listQuizzes = async (req, res) => {
  try {
    const allQuizzes = Quiz.getAllQuizzes();
    const activeQuizzes = allQuizzes.filter(quiz => quiz.isActive === true);
    
    const safeQuizzes = activeQuizzes.map(quiz => ({
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      tags: quiz.tags,
      difficulty: quiz.difficulty,
      duration: quiz.duration,
      createdAt: quiz.createdAt
    }));
    res.json(safeQuizzes);
  } catch (err) {
    console.error('List quizzes error:', err);
    res.status(500).json({ message: "Error fetching quizzes" });
  }
};

/* List all quizzes for admin */
exports.getAllQuizzesForAdmin = async (req, res) => {
  try {
    const allQuizzes = Quiz.getAllQuizzes();
    res.json(allQuizzes);
  } catch (err) {
    console.error('Get admin quizzes error:', err);
    res.status(500).json({ message: "Error fetching quizzes" });
  }
};

/* Update quiz (admin) */
exports.updateQuiz = async (req, res) => {
  try {
    const quizId = req.params.id;
    const updateData = req.body;
    
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    // Update quiz properties
    Object.assign(quiz, updateData);
    quiz.updatedAt = new Date();

    const allQuizzes = Quiz.getAllQuizzes();
    const quizIndex = allQuizzes.findIndex(q => q.id === quizId);
    if (quizIndex !== -1) {
      allQuizzes[quizIndex] = quiz;
      Quiz.saveQuizzes(allQuizzes);
    }

    res.json(quiz);
  } catch (err) {
    console.error('Update quiz error:', err);
    res.status(500).json({ message: "Error updating quiz" });
  }
};

/* Delete quiz (admin) */
exports.deleteQuiz = async (req, res) => {
  try {
    const quizId = req.params.id;
    
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    const allQuizzes = Quiz.getAllQuizzes();
    const filteredQuizzes = allQuizzes.filter(q => q.id !== quizId);
    Quiz.saveQuizzes(filteredQuizzes);

    res.json({ message: "Quiz deleted successfully" });
  } catch (err) {
    console.error('Delete quiz error:', err);
    res.status(500).json({ message: "Error deleting quiz" });
  }
};

/* Get quiz for attempt (strip answer keys) */
exports.getQuizForAttempt = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    const safeQuiz = {
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      tags: quiz.tags,
      duration: quiz.duration,
      questions: quiz.questions.map(q => ({
        questionText: q.questionText,
        options: q.options
      }))
    };

    res.json(safeQuiz);
  } catch (err) {
    console.error('Get quiz error:', err);
    res.status(500).json({ message: "Error fetching quiz" });
  }
};

/* Get quiz with answers (admin) */
exports.getQuizForAdmin = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    res.json(quiz);
  } catch (err) {
    console.error('Get admin quiz error:', err);
    res.status(500).json({ message: "Error fetching quiz" });
  }
};

/* Submit user attempt */
exports.submitAttempt = async (req, res) => {
  try {
    const { answers } = req.body;
    const userId = req.user.id;
    const quizId = req.params.id;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    // Check if user already attempted this quiz
    const allAttempts = Attempt.getAllAttempts();
    const existingAttempts = allAttempts.filter(attempt => 
      attempt.user === userId && attempt.quiz === quizId
    );
    
    if (existingAttempts.length > 0) {
      return res.status(400).json({ message: "Already attempted" });
    }

    let score = 0;
    const resultQuestions = quiz.questions.map((q, i) => {
      const ans = answers.find(a => a.questionIndex === i);
      const correct = ans && ans.selectedOptionIndex === q.correctOptionIndex;
      if (correct) score++;
      return { questionIndex: i, correct };
    });

    const attempt = new Attempt({
      user: userId,
      quiz: quizId,
      answers,
      score,
      maxScore: quiz.questions.length,
      totalQuestions: quiz.questions.length
    });
    await attempt.save();

    res.json({
      score,
      maxScore: quiz.questions.length,
      perQuestion: resultQuestions
    });

  } catch (err) {
    console.error('Submit attempt error:', err);
    res.status(500).json({ message: "Error submitting attempt" });
  }
};

/* Get user's attempts */
exports.getMyAttempts = async (req, res) => {
  try {
    const allAttempts = Attempt.getAllAttempts();
    const userAttempts = allAttempts.filter(attempt => attempt.user === req.user.id);
    
    // Get quiz details for each attempt
    const attemptsWithQuizzes = [];
    for (const attempt of userAttempts) {
      const quiz = await Quiz.findById(attempt.quiz);
      attemptsWithQuizzes.push({
        ...attempt,
        quiz: quiz ? { id: quiz.id, title: quiz.title } : null
      });
    }

    // Sort by submission date (most recent first)
    attemptsWithQuizzes.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

    res.json(attemptsWithQuizzes);
  } catch (err) {
    console.error('Get attempts error:', err);
    res.status(500).json({ message: "Error fetching attempts" });
  }
};

/* Admin view attempts */
exports.getAttemptsForQuiz = async (req, res) => {
  try {
    const allAttempts = Attempt.getAllAttempts();
    const quizAttempts = allAttempts.filter(attempt => attempt.quiz === req.params.id);
    
    // Get user details for each attempt
    const User = require('../models/User');
    const attemptsWithUsers = [];
    for (const attempt of quizAttempts) {
      const user = await User.findById(attempt.user);
      attemptsWithUsers.push({
        ...attempt,
        user: user ? { id: user.id, name: user.name, email: user.email } : null
      });
    }

    // Sort by submission date (most recent first)
    attemptsWithUsers.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

    res.json(attemptsWithUsers);
  } catch (err) {
    console.error('Get quiz attempts error:', err);
    res.status(500).json({ message: "Error fetching attempts" });
  }
};

/* Admin view all attempts */
exports.getAllAttempts = async (req, res) => {
  try {
    const allAttempts = Attempt.getAllAttempts();
    
    // Get user and quiz details for each attempt
    const User = require('../models/User');
    const Quiz = require('../models/Quiz');
    const attemptsWithDetails = [];
    
    for (const attempt of allAttempts) {
      const user = await User.findById(attempt.user);
      const quiz = await Quiz.findById(attempt.quiz);
      attemptsWithDetails.push({
        ...attempt,
        user: user ? { id: user.id, name: user.name, email: user.email } : null,
        quiz: quiz ? { id: quiz.id, title: quiz.title } : null
      });
    }

    // Sort by submission date (most recent first)
    attemptsWithDetails.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

    res.json(attemptsWithDetails);
  } catch (err) {
    console.error('Get all attempts error:', err);
    res.status(500).json({ message: "Error fetching attempts" });
  }
};
