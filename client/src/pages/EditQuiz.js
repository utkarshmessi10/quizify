import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { quizAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import './CreateQuiz.css';

const EditQuiz = () => {
  const { id } = useParams();
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    tags: '',
    difficulty: 'medium',
    duration: 30,
    category: '',
    isActive: true,
    questions: [],
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      toast.error('Access denied. Admin privileges required.');
      navigate('/');
      return;
    }
    loadQuizData();
  }, [isAdmin, navigate, id]);

  const loadQuizData = async () => {
    try {
      setInitialLoading(true);
      const response = await quizAPI.getQuizForAdmin(id);
      const quiz = response.data;
      
      setQuizData({
        title: quiz.title || '',
        description: quiz.description || '',
        tags: Array.isArray(quiz.tags) ? quiz.tags.join(', ') : '',
        difficulty: quiz.difficulty || 'medium',
        duration: quiz.duration || 30,
        category: quiz.category || '',
        isActive: quiz.isActive !== undefined ? quiz.isActive : true,
        questions: quiz.questions || [],
      });
    } catch (error) {
      console.error('Load quiz error:', error);
      toast.error('Failed to load quiz data');
      navigate('/admin');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleQuizChange = (field, value) => {
    setQuizData({ ...quizData, [field]: value });
  };

  const handleQuestionChange = (questionIndex, field, value) => {
    const newQuestions = [...quizData.questions];
    newQuestions[questionIndex][field] = value;
    setQuizData({ ...quizData, questions: newQuestions });
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const newQuestions = [...quizData.questions];
    newQuestions[questionIndex].options[optionIndex].text = value;
    setQuizData({ ...quizData, questions: newQuestions });
  };

  const addQuestion = () => {
    const newQuestion = {
      questionText: '',
      options: [{ text: '' }, { text: '' }, { text: '' }, { text: '' }],
      correctOptionIndex: 0,
    };
    setQuizData({
      ...quizData,
      questions: [...quizData.questions, newQuestion],
    });
  };

  const removeQuestion = (questionIndex) => {
    const newQuestions = quizData.questions.filter((_, index) => index !== questionIndex);
    setQuizData({ ...quizData, questions: newQuestions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!quizData.title.trim()) {
      toast.error('Quiz title is required');
      return;
    }
    
    if (quizData.questions.length === 0) {
      toast.error('At least one question is required');
      return;
    }
    
    for (let i = 0; i < quizData.questions.length; i++) {
      const question = quizData.questions[i];
      if (!question.questionText.trim()) {
        toast.error(`Question ${i + 1} text is required`);
        return;
      }
      
      for (let j = 0; j < question.options.length; j++) {
        if (!question.options[j].text.trim()) {
          toast.error(`Question ${i + 1}, Option ${j + 1} is required`);
          return;
        }
      }
    }

    setLoading(true);
    
    try {
      const submitData = {
        ...quizData,
        tags: quizData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        duration: parseInt(quizData.duration) || 30,
      };
      
      await quizAPI.updateQuiz(id, submitData);
      toast.success('Quiz updated successfully!');
      navigate('/admin');
    } catch (error) {
      console.error('Update quiz error:', error);
      toast.error(error.response?.data?.message || 'Failed to update quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/admin');
  };

  if (initialLoading) {
    return (
      <div className="create-quiz">
        <div className="quiz-loading">
          <div className="loading-spinner" />
          <p>Loading quiz data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="create-quiz">
      <div className="quiz-header">
        <Button
          onClick={handleBack}
          variant="ghost"
          icon={<ArrowLeft size={20} />}
        >
          Back to Dashboard
        </Button>
        <h1>Edit Quiz</h1>
      </div>

      <form onSubmit={handleSubmit} className="quiz-form">
        <Card className="quiz-basic-info">
          <h2>Basic Information</h2>
          
          <Input
            label="Quiz Title"
            value={quizData.title}
            onChange={(e) => handleQuizChange('title', e.target.value)}
            placeholder="Enter quiz title"
            required
          />
          
          <Input
            label="Description"
            value={quizData.description}
            onChange={(e) => handleQuizChange('description', e.target.value)}
            placeholder="Brief description of the quiz"
            multiline
            rows={3}
          />
          
          <div className="form-row">
            <Input
              label="Category"
              value={quizData.category}
              onChange={(e) => handleQuizChange('category', e.target.value)}
              placeholder="e.g., Programming, Science, History"
            />
            
            <div className="form-group">
              <label>Difficulty</label>
              <select
                value={quizData.difficulty}
                onChange={(e) => handleQuizChange('difficulty', e.target.value)}
                className="form-select"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            
            <Input
              label="Duration (minutes)"
              type="number"
              value={quizData.duration}
              onChange={(e) => handleQuizChange('duration', e.target.value)}
              min="1"
              placeholder="30"
            />
          </div>
          
          <Input
            label="Tags (comma-separated)"
            value={quizData.tags}
            onChange={(e) => handleQuizChange('tags', e.target.value)}
            placeholder="javascript, programming, web development"
          />
          
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={quizData.isActive}
                onChange={(e) => handleQuizChange('isActive', e.target.checked)}
              />
              <span>Quiz is active</span>
            </label>
          </div>
        </Card>

        <Card className="quiz-questions">
          <div className="questions-header">
            <h2>Questions ({quizData.questions.length})</h2>
            <Button
              type="button"
              onClick={addQuestion}
              icon={<Plus size={20} />}
            >
              Add Question
            </Button>
          </div>
          
          {quizData.questions.map((question, questionIndex) => (
            <Card key={questionIndex} className="question-card">
              <div className="question-header">
                <h3>Question {questionIndex + 1}</h3>
                {quizData.questions.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeQuestion(questionIndex)}
                    variant="ghost"
                    icon={<Trash2 size={16} />}
                    className="delete-question-btn"
                  >
                    Remove
                  </Button>
                )}
              </div>
              
              <Input
                label="Question Text"
                value={question.questionText}
                onChange={(e) => handleQuestionChange(questionIndex, 'questionText', e.target.value)}
                placeholder="Enter your question here"
                multiline
                rows={2}
                required
              />
              
              <div className="options-section">
                <h4>Answer Options</h4>
                {question.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="option-row">
                    <label className="option-radio">
                      <input
                        type="radio"
                        name={`correct-${questionIndex}`}
                        checked={question.correctOptionIndex === optionIndex}
                        onChange={() => handleQuestionChange(questionIndex, 'correctOptionIndex', optionIndex)}
                      />
                      <span>Correct</span>
                    </label>
                    <Input
                      label={`Option ${optionIndex + 1}`}
                      value={option.text}
                      onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)}
                      placeholder={`Enter option ${optionIndex + 1}`}
                      required
                    />
                  </div>
                ))}
              </div>
            </Card>
          ))}
          
          {quizData.questions.length === 0 && (
            <div className="empty-questions">
              <p>No questions added yet. Click "Add Question" to get started.</p>
            </div>
          )}
        </Card>

        <div className="form-actions">
          <Button
            type="button"
            onClick={handleBack}
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
            icon={<Save size={20} />}
          >
            {loading ? 'Updating...' : 'Update Quiz'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditQuiz;