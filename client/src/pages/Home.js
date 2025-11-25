import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import { BookOpen, Users, Trophy, ArrowRight, Play, UserPlus, LogIn } from 'lucide-react';
import './Home.css';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/quizzes');
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-shape hero-shape-1" />
          <div className="hero-shape hero-shape-2" />
          <div className="hero-shape hero-shape-3" />
        </div>
        
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title fade-in">
              Test Your Knowledge with
              <span className="hero-highlight"> Interactive Quizzes</span>
            </h1>
            <p className="hero-subtitle slide-up">
              Challenge yourself, learn new things, and track your progress with our 
              comprehensive quiz platform designed for learners of all levels.
            </p>
            
            <div className="hero-actions slide-up">
              <Button 
                onClick={handleGetStarted}
                size="lg"
                icon={isAuthenticated ? <Play size={20} /> : <UserPlus size={20} />}
              >
                {isAuthenticated ? 'Start Quiz' : 'Get Started Free'}
              </Button>
              
              {!isAuthenticated && (
                <Link to="/login">
                  <Button 
                    variant="outline"
                    size="lg"
                    icon={<LogIn size={20} />}
                  >
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
          
          <div className="hero-image fade-in">
            <div className="hero-card">
              <BookOpen size={80} className="hero-icon" />
              <div className="hero-stats">
                <div className="stat">
                  <div className="stat-number">500+</div>
                  <div className="stat-label">Questions</div>
                </div>
                <div className="stat">
                  <div className="stat-number">50+</div>
                  <div className="stat-label">Topics</div>
                </div>
                <div className="stat">
                  <div className="stat-number">1000+</div>
                  <div className="stat-label">Users</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-header">
          <h2 className="features-title">Why Choose Quizify?</h2>
          <p className="features-subtitle">
            Discover the features that make learning engaging and effective
          </p>
        </div>
        
        <div className="features-grid">
          <Card className="feature-card" hover>
            <div className="feature-icon">
              <BookOpen className="icon" />
            </div>
            <h3 className="feature-title">Diverse Topics</h3>
            <p className="feature-description">
              From programming to general knowledge, explore quizzes across 
              multiple subjects and difficulty levels.
            </p>
          </Card>
          
          <Card className="feature-card" hover>
            <div className="feature-icon">
              <Trophy className="icon" />
            </div>
            <h3 className="feature-title">Track Progress</h3>
            <p className="feature-description">
              Monitor your performance with detailed analytics and see how 
              you improve over time.
            </p>
          </Card>
          
          <Card className="feature-card" hover>
            <div className="feature-icon">
              <Users className="icon" />
            </div>
            <h3 className="feature-title">Community Driven</h3>
            <p className="feature-description">
              Join a community of learners and compete with others to enhance 
              your learning experience.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Start Learning?</h2>
          <p className="cta-subtitle">
            Join thousands of learners who are already improving their skills with Quizify
          </p>
          <Button 
            onClick={handleGetStarted}
            size="lg"
            icon={<ArrowRight size={20} />}
          >
            {isAuthenticated ? 'Browse Quizzes' : 'Sign Up Now'}
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;