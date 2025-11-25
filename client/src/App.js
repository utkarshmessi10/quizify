import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import QuizList from './pages/QuizList';
import QuizTake from './pages/QuizTake';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminAttempts from './pages/AdminAttempts';
import CreateQuiz from './pages/CreateQuiz';
import EditQuiz from './pages/EditQuiz';
import MyAttempts from './pages/MyAttempts';
import Home from './pages/Home';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route path="/quizzes" element={
                <ProtectedRoute>
                  <QuizList />
                </ProtectedRoute>
              } />
              
              <Route path="/quiz/:id" element={
                <ProtectedRoute>
                  <QuizTake />
                </ProtectedRoute>
              } />
              
              <Route path="/attempts" element={
                <ProtectedRoute>
                  <MyAttempts />
                </ProtectedRoute>
              } />
              
              {/* Admin Routes */}
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
              
              <Route path="/admin/users" element={
                <AdminRoute>
                  <AdminUsers />
                </AdminRoute>
              } />
              
              <Route path="/admin/attempts" element={
                <AdminRoute>
                  <AdminAttempts />
                </AdminRoute>
              } />
              
              <Route path="/admin/create-quiz" element={
                <AdminRoute>
                  <CreateQuiz />
                </AdminRoute>
              } />
              
              <Route path="/admin/quiz/:id/edit" element={
                <AdminRoute>
                  <EditQuiz />
                </AdminRoute>
              } />
            </Routes>
          </main>
          
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;