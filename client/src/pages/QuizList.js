import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizAPI } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import { BookOpen, Clock, Users, Play, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import './QuizList.css';

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      const response = await quizAPI.getQuizzes();
      setQuizzes(response.data);
    } catch (error) {
      toast.error('Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  const getAllTags = () => {
    const tags = new Set();
    quizzes.forEach(quiz => {
      quiz.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  };

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quiz.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || quiz.tags?.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const handleStartQuiz = (quizId) => {
    navigate(`/quiz/${quizId}`);
  };

  if (loading) {
    return (
      <div className="quiz-list-container">
        <div className="quiz-list-loading">
          <div className="quiz-list-skeleton">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="quiz-card-skeleton" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-list-container">
      <div className="quiz-list-header">
        <div className="quiz-list-title">
          <BookOpen className="quiz-list-icon" />
          <h1>Available Quizzes</h1>
        </div>
        <p className="quiz-list-subtitle">
          Test your knowledge with our interactive quizzes
        </p>
      </div>

      <div className="quiz-list-filters">
        <div className="search-input">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search quizzes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-field"
          />
        </div>
        
        <div className="tag-filter">
          <Filter className="filter-icon" />
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="tag-select"
          >
            <option value="">All Categories</option>
            {getAllTags().map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredQuizzes.length === 0 ? (
        <div className="quiz-list-empty">
          <BookOpen size={64} className="empty-icon" />
          <h2>No quizzes found</h2>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="quiz-list-grid">
          {filteredQuizzes.map((quiz) => (
            <Card key={quiz.id} className="quiz-card" hover>
              <div className="quiz-card-header">
                <h3 className="quiz-title">{quiz.title}</h3>
                {quiz.tags && quiz.tags.length > 0 && (
                  <div className="quiz-tags">
                    {quiz.tags.slice(0, 2).map((tag, index) => (
                      <span key={index} className="quiz-tag">
                        {tag}
                      </span>
                    ))}
                    {quiz.tags.length > 2 && (
                      <span className="quiz-tag quiz-tag-more">
                        +{quiz.tags.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>
              
              <p className="quiz-description">
                {quiz.description || 'No description available'}
              </p>
              
              <div className="quiz-card-footer">
                <div className="quiz-meta">
                  <span className="quiz-meta-item">
                    <Clock size={16} />
                    {new Date(quiz.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <Button 
                  onClick={() => handleStartQuiz(quiz.id)}
                  size="sm"
                  icon={<Play size={16} />}
                >
                  Start Quiz
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizList;