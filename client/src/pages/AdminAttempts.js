import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { quizAPI } from '../services/api';
import Card from '../components/Card';
import { FileText, User, BookOpen, Clock, Award, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import './AdminAttempts.css';

const AdminAttempts = () => {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (isAdmin) {
      loadAttempts();
    }
  }, [isAdmin]);

  const loadAttempts = async () => {
    try {
      const response = await quizAPI.getAllAttempts();
      setAttempts(response.data);
    } catch (error) {
      console.error('Failed to load attempts:', error);
      toast.error('Failed to load attempts');
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="admin-attempts">
        <div className="access-denied">
          <h2>Access Denied</h2>
          <p>You don't have permission to view this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-attempts">
        <div className="loading">
          <div className="loading-spinner" />
          <p>Loading attempts...</p>
        </div>
      </div>
    );
  }

  const getScoreColor = (score, maxScore) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'score-excellent';
    if (percentage >= 60) return 'score-good';
    if (percentage >= 40) return 'score-average';
    return 'score-poor';
  };

  const getScoreText = (score, maxScore) => {
    const percentage = Math.round((score / maxScore) * 100);
    return `${score}/${maxScore} (${percentage}%)`;
  };

  return (
    <div className="admin-attempts">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">
            <FileText className="title-icon" />
            Quiz Attempts
          </h1>
          <p className="page-subtitle">
            Monitor all quiz attempts and user performance
          </p>
        </div>
      </div>

      <div className="attempts-stats">
        <Card className="stat-card">
          <div className="stat-icon">
            <FileText className="icon" />
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{attempts.length}</h3>
            <p className="stat-label">Total Attempts</p>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon">
            <Award className="icon" />
          </div>
          <div className="stat-content">
            <h3 className="stat-number">
              {attempts.length > 0 
                ? Math.round((attempts.reduce((acc, att) => acc + (att.score / att.maxScore) * 100, 0) / attempts.length))
                : 0}%
            </h3>
            <p className="stat-label">Average Score</p>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon">
            <User className="icon" />
          </div>
          <div className="stat-content">
            <h3 className="stat-number">
              {new Set(attempts.map(att => att.user?.id).filter(Boolean)).size}
            </h3>
            <p className="stat-label">Unique Users</p>
          </div>
        </Card>
      </div>

      <div className="attempts-section">
        <h2 className="section-title">
          Recent Quiz Attempts ({attempts.length})
        </h2>
        
        {attempts.length === 0 ? (
          <Card className="empty-state">
            <FileText size={48} className="empty-icon" />
            <h3>No attempts found</h3>
            <p>Quiz attempts will appear here as users take quizzes</p>
          </Card>
        ) : (
          <div className="attempts-list">
            {attempts.map((attempt) => (
              <Card key={attempt.id} className="attempt-card">
                <div className="attempt-header">
                  <div className="attempt-info">
                    <h3 className="quiz-title">
                      <BookOpen size={18} className="quiz-icon" />
                      {attempt.quiz?.title || 'Unknown Quiz'}
                    </h3>
                    <div className="user-info">
                      <User size={16} className="user-icon" />
                      <span className="user-name">
                        {attempt.user?.name || 'Unknown User'}
                      </span>
                      <span className="user-email">
                        ({attempt.user?.email || 'unknown@email.com'})
                      </span>
                    </div>
                  </div>
                  
                  <div className={`score-badge ${getScoreColor(attempt.score, attempt.maxScore)}`}>
                    <Award size={16} className="score-icon" />
                    <span className="score-text">
                      {getScoreText(attempt.score, attempt.maxScore)}
                    </span>
                  </div>
                </div>
                
                <div className="attempt-details">
                  <div className="attempt-meta">
                    <div className="meta-item">
                      <Clock size={14} className="meta-icon" />
                      <span className="meta-text">
                        Submitted: {new Date(attempt.submittedAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="meta-item">
                      <FileText size={14} className="meta-icon" />
                      <span className="meta-text">
                        Questions: {attempt.totalQuestions}
                      </span>
                    </div>
                  </div>

                  <div className="score-breakdown">
                    <div className="score-bar">
                      <div 
                        className="score-fill"
                        style={{ 
                          width: `${(attempt.score / attempt.maxScore) * 100}%`,
                          backgroundColor: `var(--${getScoreColor(attempt.score, attempt.maxScore).replace('score-', '')}-color)`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAttempts;