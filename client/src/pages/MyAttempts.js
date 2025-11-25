import React, { useState, useEffect } from 'react';
import { quizAPI } from '../services/api';
import Card from '../components/Card';
import { Clock, CheckCircle, XCircle, BookOpen, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import './MyAttempts.css';

const MyAttempts = () => {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAttempts: 0,
    averageScore: 0,
    bestScore: 0,
    totalCorrect: 0,
    totalQuestions: 0
  });

  useEffect(() => {
    loadAttempts();
  }, []);

  const loadAttempts = async () => {
    try {
      const response = await quizAPI.getMyAttempts();
      const attemptData = response.data;
      setAttempts(attemptData);
      
      // Calculate stats
      if (attemptData.length > 0) {
        const totalCorrect = attemptData.reduce((sum, attempt) => sum + attempt.score, 0);
        const totalQuestions = attemptData.reduce((sum, attempt) => sum + attempt.maxScore, 0);
        const averageScore = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;
        const bestScore = Math.max(...attemptData.map(attempt => (attempt.score / attempt.maxScore) * 100));
        
        setStats({
          totalAttempts: attemptData.length,
          averageScore,
          bestScore,
          totalCorrect,
          totalQuestions
        });
      }
    } catch (error) {
      toast.error('Failed to load attempts');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score, maxScore) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'score-excellent';
    if (percentage >= 60) return 'score-good';
    if (percentage >= 40) return 'score-average';
    return 'score-poor';
  };

  const getScoreIcon = (score, maxScore) => {
    const percentage = (score / maxScore) * 100;
    return percentage >= 60 ? 
      <CheckCircle className="score-icon success" /> : 
      <XCircle className="score-icon error" />;
  };

  if (loading) {
    return (
      <div className="attempts-container">
        <div className="attempts-loading">
          <div className="loading-spinner" />
          <p>Loading your attempts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="attempts-container">
      <div className="attempts-header">
        <div className="header-content">
          <h1 className="page-title">
            <BookOpen className="title-icon" />
            My Quiz Attempts
          </h1>
          <p className="page-subtitle">
            Track your progress and review your quiz performance
          </p>
        </div>
      </div>

      {attempts.length === 0 ? (
        <Card className="empty-state">
          <BookOpen size={64} className="empty-icon" />
          <h2>No attempts yet</h2>
          <p>You haven't taken any quizzes yet. Start with your first quiz!</p>
          <a href="/quizzes" className="empty-cta">
            Browse Quizzes
          </a>
        </Card>
      ) : (
        <>
          {/* Stats Section */}
          <div className="stats-grid">
            <Card className="stat-card">
              <div className="stat-icon">
                <BookOpen className="icon" />
              </div>
              <div className="stat-content">
                <h3 className="stat-number">{stats.totalAttempts}</h3>
                <p className="stat-label">Total Attempts</p>
              </div>
            </Card>

            <Card className="stat-card">
              <div className="stat-icon">
                <TrendingUp className="icon" />
              </div>
              <div className="stat-content">
                <h3 className="stat-number">{Math.round(stats.averageScore)}%</h3>
                <p className="stat-label">Average Score</p>
              </div>
            </Card>

            <Card className="stat-card">
              <div className="stat-icon">
                <CheckCircle className="icon" />
              </div>
              <div className="stat-content">
                <h3 className="stat-number">{Math.round(stats.bestScore)}%</h3>
                <p className="stat-label">Best Score</p>
              </div>
            </Card>

            <Card className="stat-card">
              <div className="stat-icon">
                <XCircle className="icon" />
              </div>
              <div className="stat-content">
                <h3 className="stat-number">
                  {stats.totalCorrect}/{stats.totalQuestions}
                </h3>
                <p className="stat-label">Correct Answers</p>
              </div>
            </Card>
          </div>

          {/* Attempts List */}
          <div className="attempts-section">
            <h2 className="section-title">Recent Attempts</h2>
            
            <div className="attempts-list">
              {attempts.map((attempt) => (
                <Card key={attempt._id} className="attempt-card">
                  <div className="attempt-header">
                    <div className="attempt-info">
                      <h3 className="quiz-title">{attempt.quiz?.title || 'Quiz'}</h3>
                      <div className="attempt-meta">
                        <span className="attempt-date">
                          <Clock size={16} />
                          {new Date(attempt.submittedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                    
                    <div className="attempt-score">
                      {getScoreIcon(attempt.score, attempt.maxScore)}
                      <div className="score-details">
                        <div className={`score-value ${getScoreColor(attempt.score, attempt.maxScore)}`}>
                          {attempt.score}/{attempt.maxScore}
                        </div>
                        <div className="score-percentage">
                          {Math.round((attempt.score / attempt.maxScore) * 100)}%
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="progress-bar">
                    <div 
                      className={`progress-fill ${getScoreColor(attempt.score, attempt.maxScore)}`}
                      style={{ width: `${(attempt.score / attempt.maxScore) * 100}%` }}
                    />
                  </div>
                  
                  <div className="attempt-summary">
                    <div className="summary-item">
                      <CheckCircle className="summary-icon success" />
                      <span>Correct: {attempt.score}</span>
                    </div>
                    <div className="summary-item">
                      <XCircle className="summary-icon error" />
                      <span>Incorrect: {attempt.maxScore - attempt.score}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MyAttempts;