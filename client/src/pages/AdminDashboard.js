import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizAPI, authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import { Plus, BarChart3, Users, BookOpen, Eye, Edit, Trash2, FileText, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [users, setUsers] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [stats, setStats] = useState({ 
    totalQuizzes: 0, 
    totalUsers: 0,
    totalAttempts: 0,
    averageScore: 0
  });
  const [loading, setLoading] = useState(true);
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      toast.error('Access denied. Admin privileges required.');
      navigate('/');
      return;
    }
    loadDashboardData();
  }, [isAdmin, navigate]);

  const loadDashboardData = async () => {
    try {
      // Load quizzes
      const quizzesResponse = await quizAPI.getAllQuizzesForAdmin();
      setQuizzes(quizzesResponse.data);
      
      // Load users
      const usersResponse = await authAPI.getAllUsers();
      setUsers(usersResponse.data);
      
      // Load attempts
      const attemptsResponse = await quizAPI.getAllAttempts();
      setAttempts(attemptsResponse.data);
      
      // Calculate stats
      const totalAttempts = attemptsResponse.data.length;
      const averageScore = totalAttempts > 0 
        ? Math.round(
            attemptsResponse.data.reduce((acc, attempt) => 
              acc + (attempt.score / attempt.maxScore) * 100, 0
            ) / totalAttempts
          )
        : 0;
      
      setStats({
        totalQuizzes: quizzesResponse.data.length,
        totalUsers: usersResponse.data.length,
        totalAttempts,
        averageScore
      });
    } catch (error) {
      console.error('Dashboard load error:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuiz = () => {
    navigate('/admin/create-quiz');
  };

  const handleViewUsers = () => {
    navigate('/admin/users');
  };

  const handleViewAllAttempts = () => {
    navigate('/admin/attempts');
  };

  const handleViewAttempts = (quizId) => {
    navigate(`/admin/quiz/${quizId}/attempts`);
  };

  const handleEditQuiz = (quizId) => {
    navigate(`/admin/quiz/${quizId}/edit`);
  };

  const handleDeleteQuiz = async (quizId, quizTitle) => {
    if (window.confirm(`Are you sure you want to delete "${quizTitle}"? This action cannot be undone.`)) {
      try {
        await quizAPI.deleteQuiz(quizId);
        toast.success('Quiz deleted successfully');
        loadDashboardData(); // Reload the dashboard
      } catch (error) {
        console.error('Delete error:', error);
        toast.error('Failed to delete quiz');
      }
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="dashboard-loading">
          <div className="loading-spinner" />
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">
            <BarChart3 className="title-icon" />
            Admin Dashboard
          </h1>
          <p className="dashboard-subtitle">
            Welcome back, {user?.name}! Manage your quizzes and monitor user activity.
          </p>
        </div>
        
        <div className="header-actions">
          <Button 
            onClick={handleViewUsers}
            variant="outline"
            icon={<Users size={18} />}
          >
            Manage Users
          </Button>
          <Button 
            onClick={handleViewAllAttempts}
            variant="outline"
            icon={<FileText size={18} />}
          >
            View Attempts
          </Button>
          <Button 
            onClick={handleCreateQuiz}
            icon={<Plus size={20} />}
            size="lg"
          >
            Create Quiz
          </Button>
        </div>
      </div>

      <div className="dashboard-stats">
        <Card className="stat-card">
          <div className="stat-icon">
            <BookOpen className="icon" />
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.totalQuizzes}</h3>
            <p className="stat-label">Total Quizzes</p>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon">
            <Users className="icon" />
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.totalUsers}</h3>
            <p className="stat-label">Registered Users</p>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon">
            <FileText className="icon" />
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.totalAttempts}</h3>
            <p className="stat-label">Quiz Attempts</p>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon">
            <BarChart3 className="icon" />
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.averageScore}%</h3>
            <p className="stat-label">Average Score</p>
          </div>
        </Card>
      </div>

      <div className="dashboard-content">
        <div className="content-header">
          <h2>Your Quizzes</h2>
          <p>Manage and monitor your quiz collection</p>
        </div>

        {quizzes.length === 0 ? (
          <Card className="empty-state">
            <BookOpen size={64} className="empty-icon" />
            <h3>No quizzes yet</h3>
            <p>Create your first quiz to get started</p>
            <Button 
              onClick={handleCreateQuiz}
              icon={<Plus size={20} />}
              size="lg"
            >
              Create Your First Quiz
            </Button>
          </Card>
        ) : (
          <div className="quiz-grid">
            {quizzes.map((quiz) => (
              <Card key={quiz.id} className="quiz-admin-card">
                <div className="quiz-header">
                  <h3 className="quiz-title">{quiz.title}</h3>
                  {quiz.tags && quiz.tags.length > 0 && (
                    <div className="quiz-tags">
                      {quiz.tags.slice(0, 2).map((tag, index) => (
                        <span key={index} className="quiz-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <p className="quiz-description">
                  {quiz.description || 'No description provided'}
                </p>

                <div className="quiz-meta">
                  <span className="meta-item">
                    Created: {new Date(quiz.createdAt).toLocaleDateString()}
                  </span>
                  <span className="meta-item">
                    Status: {quiz.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="quiz-actions">
                  <Button 
                    onClick={() => handleViewAttempts(quiz.id)}
                    variant="outline"
                    size="sm"
                    icon={<Eye size={16} />}
                  >
                    View Attempts
                  </Button>
                  <Button 
                    onClick={() => handleEditQuiz(quiz.id)}
                    variant="outline"
                    size="sm"
                    icon={<Edit size={16} />}
                  >
                    Edit
                  </Button>
                  <Button 
                    onClick={() => handleDeleteQuiz(quiz.id, quiz.title)}
                    variant="outline"
                    size="sm"
                    icon={<Trash2 size={16} />}
                    className="delete-btn"
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;