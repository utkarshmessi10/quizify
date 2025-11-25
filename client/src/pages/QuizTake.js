import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizAPI } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import { CheckCircle, XCircle, Clock, ArrowRight, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import './QuizTake.css';

const QuizTake = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadQuiz();
  }, [id]);

  const loadQuiz = async () => {
    try {
      const response = await quizAPI.getQuiz(id);
      setQuiz(response.data);
      setAnswers(new Array(response.data.questions.length).fill(null));
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.message === 'Already attempted') {
        toast.error('You have already attempted this quiz');
        navigate('/quizzes');
      } else {
        toast.error('Failed to load quiz');
        navigate('/quizzes');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (answers.some(answer => answer === null)) {
      toast.error('Please answer all questions before submitting');
      return;
    }

    setSubmitting(true);
    try {
      const formattedAnswers = answers.map((selectedOptionIndex, questionIndex) => ({
        questionIndex,
        selectedOptionIndex,
      }));

      const response = await quizAPI.submitAttempt(id, formattedAnswers);
      setResults(response.data);
      setShowResults(true);
      toast.success('Quiz submitted successfully!');
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.message === 'Already attempted') {
        toast.error('You have already attempted this quiz');
      } else {
        toast.error('Failed to submit quiz');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const getProgressPercentage = () => {
    const answeredQuestions = answers.filter(answer => answer !== null).length;
    return (answeredQuestions / quiz.questions.length) * 100;
  };

  const goToQuestion = (index) => {
    setCurrentQuestion(index);
  };

  if (loading) {
    return (
      <div className="quiz-take-container">
        <div className="quiz-loading">
          <div className="quiz-loading-spinner" />
          <p>Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (showResults && results) {
    return (
      <div className="quiz-take-container">
        <Card className="quiz-results fade-in">
          <div className="results-header">
            <div className="results-icon">
              {results.score / results.maxScore >= 0.7 ? (
                <CheckCircle size={64} className="success-icon" />
              ) : (
                <XCircle size={64} className="error-icon" />
              )}
            </div>
            <h1 className="results-title">Quiz Completed!</h1>
            <p className="results-subtitle">{quiz.title}</p>
          </div>

          <div className="results-score">
            <div className="score-circle">
              <div className="score-value">
                {results.score}/{results.maxScore}
              </div>
              <div className="score-percentage">
                {Math.round((results.score / results.maxScore) * 100)}%
              </div>
            </div>
          </div>

          <div className="results-breakdown">
            <div className="breakdown-item">
              <CheckCircle className="breakdown-icon success" />
              <span>Correct: {results.score}</span>
            </div>
            <div className="breakdown-item">
              <XCircle className="breakdown-icon error" />
              <span>Incorrect: {results.maxScore - results.score}</span>
            </div>
          </div>

          <div className="results-actions">
            <Button 
              onClick={() => navigate('/quizzes')}
              variant="outline"
              size="lg"
            >
              Back to Quizzes
            </Button>
            <Button 
              onClick={() => navigate('/attempts')}
              size="lg"
            >
              View All Attempts
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!quiz) return null;

  const question = quiz.questions[currentQuestion];

  return (
    <div className="quiz-take-container">
      <div className="quiz-header">
        <div className="quiz-info">
          <h1 className="quiz-title">{quiz.title}</h1>
          <p className="quiz-progress">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </p>
        </div>
        
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
      </div>

      <div className="quiz-content">
        <div className="quiz-navigation">
          <div className="question-grid">
            {quiz.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => goToQuestion(index)}
                className={`question-dot ${
                  index === currentQuestion ? 'active' : ''
                } ${answers[index] !== null ? 'answered' : ''}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        <Card className="question-card">
          <div className="question-header">
            <span className="question-number">
              Q{currentQuestion + 1}
            </span>
            <h2 className="question-text">{question.questionText}</h2>
          </div>

          <div className="options-list">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(currentQuestion, index)}
                className={`option ${
                  answers[currentQuestion] === index ? 'selected' : ''
                }`}
              >
                <div className="option-indicator">
                  <div className="option-circle" />
                </div>
                <span className="option-text">{option.text}</span>
              </button>
            ))}
          </div>
        </Card>

        <div className="quiz-controls">
          <Button 
            onClick={handlePrev}
            variant="outline"
            disabled={currentQuestion === 0}
            icon={<ArrowLeft size={16} />}
          >
            Previous
          </Button>
          
          <div className="quiz-actions">
            {currentQuestion === quiz.questions.length - 1 ? (
              <Button 
                onClick={handleSubmit}
                variant="success"
                size="lg"
                loading={submitting}
                disabled={answers.some(answer => answer === null)}
              >
                Submit Quiz
              </Button>
            ) : (
              <Button 
                onClick={handleNext}
                disabled={currentQuestion === quiz.questions.length - 1}
                icon={<ArrowRight size={16} />}
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizTake;