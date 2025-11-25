import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import './CreateQuiz.css';

const CreateQuiz = () => {
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    tags: '',
    questions: [
      {
        questionText: '',
        options: [{ text: '' }, { text: '' }, { text: '' }, { text: '' }],
        correctOptionIndex: 0,
      },
    ],
  });
  const [loading, setLoading] = useState(false);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isAdmin) {
      toast.error('Access denied. Admin privileges required.');
      navigate('/');
    }
  }, [isAdmin, navigate]);

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
    setQuizData({
      ...quizData,
      questions: [
        ...quizData.questions,
        {
          questionText: '',
          options: [{ text: '' }, { text: '' }, { text: '' }, { text: '' }],
          correctOptionIndex: 0,
        },
      ],
    });
  };

  const removeQuestion = (questionIndex) => {
    if (quizData.questions.length > 1) {
      const newQuestions = quizData.questions.filter((_, index) => index !== questionIndex);
      setQuizData({ ...quizData, questions: newQuestions });
    }
  };

  const validateQuiz = () => {
    if (!quizData.title.trim()) {
      toast.error('Please enter a quiz title');
      return false;
    }

    if (quizData.questions.length === 0) {
      toast.error('Please add at least one question');
      return false;
    }

    for (let i = 0; i < quizData.questions.length; i++) {
      const question = quizData.questions[i];
      
      if (!question.questionText.trim()) {
        toast.error(`Please enter text for question ${i + 1}`);
        return false;
      }

      const filledOptions = question.options.filter(option => option.text.trim());
      if (filledOptions.length < 2) {
        toast.error(`Question ${i + 1} must have at least 2 options`);
        return false;
      }

      if (!question.options[question.correctOptionIndex]?.text.trim()) {
        toast.error(`Please select a valid correct answer for question ${i + 1}`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateQuiz()) return;

    setLoading(true);
    try {
      const submitData = {
        ...quizData,
        tags: quizData.tags
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0),
        questions: quizData.questions.map(q => ({
          ...q,
          options: q.options.filter(option => option.text.trim())
        }))
      };

      await quizAPI.createQuiz(submitData);
      toast.success('Quiz created successfully!');
      navigate('/admin');
    } catch (error) {
      toast.error('Failed to create quiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-quiz-container">
      <div className="create-quiz-header">
        <Button 
          onClick={() => navigate('/admin')}
          variant="ghost"
          icon={<ArrowLeft size={20} />}
        >
          Back to Dashboard
        </Button>
        
        <h1 className="page-title">Create New Quiz</h1>
      </div>

      <form onSubmit={handleSubmit} className="create-quiz-form">
        <Card className="quiz-info-section">
          <h2 className="section-title">Quiz Information</h2>
          
          <div className="form-grid">
            <Input
              label="Quiz Title"
              type="text"
              value={quizData.title}
              onChange={(e) => handleQuizChange('title', e.target.value)}
              placeholder="Enter quiz title"
              required
            />
            
            <Input
              label="Tags (comma-separated)"
              type="text"
              value={quizData.tags}
              onChange={(e) => handleQuizChange('tags', e.target.value)}
              placeholder="e.g., JavaScript, Programming, Beginner"
            />
          </div>
          
          <div className="form-group">
            <label className="input-label">Description</label>
            <textarea
              className="quiz-textarea"
              value={quizData.description}
              onChange={(e) => handleQuizChange('description', e.target.value)}
              placeholder="Enter quiz description (optional)"
              rows="3"
            />
          </div>
        </Card>

        <div className="questions-section">
          <div className="section-header">
            <h2 className="section-title">Questions</h2>
            <Button
              type="button"
              onClick={addQuestion}
              icon={<Plus size={20} />}
              variant="outline"
            >
              Add Question
            </Button>
          </div>

          {quizData.questions.map((question, questionIndex) => (
            <Card key={questionIndex} className="question-card">
              <div className="question-header">
                <h3 className="question-number">Question {questionIndex + 1}</h3>
                {quizData.questions.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeQuestion(questionIndex)}
                    variant="danger"
                    size="sm"
                    icon={<Trash2 size={16} />}
                  >
                    Remove
                  </Button>
                )}
              </div>

              <div className="form-group">
                <Input
                  label="Question Text"
                  type="text"
                  value={question.questionText}
                  onChange={(e) => handleQuestionChange(questionIndex, 'questionText', e.target.value)}
                  placeholder="Enter your question"
                  required
                />
              </div>

              <div className="options-section">
                <label className="input-label">Answer Options</label>
                {question.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="option-input">
                    <input
                      type="radio"
                      name={`correct-${questionIndex}`}
                      checked={question.correctOptionIndex === optionIndex}
                      onChange={() => handleQuestionChange(questionIndex, 'correctOptionIndex', optionIndex)}
                      className="radio-input"
                    />
                    <Input
                      placeholder={`Option ${optionIndex + 1}`}
                      value={option.text}
                      onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)}
                      className="option-text"
                    />
                  </div>
                ))}
                <p className="option-help">Select the radio button next to the correct answer</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="form-actions">
          <Button
            type="button"
            onClick={() => navigate('/admin')}
            variant="outline"
            size="lg"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
            icon={<Save size={20} />}
            size="lg"
          >
            Create Quiz
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateQuiz;