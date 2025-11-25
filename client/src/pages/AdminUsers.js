import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import Card from '../components/Card';
import { Users, Mail, Calendar, Crown, User as UserIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import './AdminUsers.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
    }
  }, [isAdmin]);

  const loadUsers = async () => {
    try {
      const response = await authAPI.getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to load users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="admin-users">
        <div className="access-denied">
          <h2>Access Denied</h2>
          <p>You don't have permission to view this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-users">
        <div className="loading">
          <div className="loading-spinner" />
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  const adminUsers = users.filter(user => user.role === 'admin');
  const regularUsers = users.filter(user => user.role === 'user');

  return (
    <div className="admin-users">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">
            <Users className="title-icon" />
            User Management
          </h1>
          <p className="page-subtitle">
            Monitor user registrations and manage user accounts
          </p>
        </div>
      </div>

      <div className="users-stats">
        <Card className="stat-card">
          <div className="stat-icon">
            <Users className="icon" />
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{users.length}</h3>
            <p className="stat-label">Total Users</p>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon">
            <Crown className="icon" />
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{adminUsers.length}</h3>
            <p className="stat-label">Administrators</p>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon">
            <UserIcon className="icon" />
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{regularUsers.length}</h3>
            <p className="stat-label">Regular Users</p>
          </div>
        </Card>
      </div>

      <div className="users-sections">
        {/* Admin Users Section */}
        <div className="users-section">
          <h2 className="section-title">
            <Crown className="section-icon" />
            Administrators ({adminUsers.length})
          </h2>
          
          {adminUsers.length === 0 ? (
            <Card className="empty-state">
              <Crown size={48} className="empty-icon" />
              <p>No administrator accounts found</p>
            </Card>
          ) : (
            <div className="users-grid">
              {adminUsers.map((user) => (
                <Card key={user.id} className="user-card admin-user">
                  <div className="user-header">
                    <div className="user-avatar">
                      <Crown size={20} />
                    </div>
                    <div className="user-info">
                      <h3 className="user-name">{user.name}</h3>
                      <span className="user-role admin-role">Administrator</span>
                    </div>
                  </div>
                  
                  <div className="user-details">
                    <div className="user-detail">
                      <Mail size={16} className="detail-icon" />
                      <span className="detail-text">{user.email}</span>
                    </div>
                    <div className="user-detail">
                      <Calendar size={16} className="detail-icon" />
                      <span className="detail-text">
                        Joined {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Regular Users Section */}
        <div className="users-section">
          <h2 className="section-title">
            <UserIcon className="section-icon" />
            Users ({regularUsers.length})
          </h2>
          
          {regularUsers.length === 0 ? (
            <Card className="empty-state">
              <UserIcon size={48} className="empty-icon" />
              <p>No user accounts found</p>
            </Card>
          ) : (
            <div className="users-grid">
              {regularUsers.map((user) => (
                <Card key={user.id} className="user-card">
                  <div className="user-header">
                    <div className="user-avatar">
                      <UserIcon size={20} />
                    </div>
                    <div className="user-info">
                      <h3 className="user-name">{user.name}</h3>
                      <span className="user-role">User</span>
                    </div>
                  </div>
                  
                  <div className="user-details">
                    <div className="user-detail">
                      <Mail size={16} className="detail-icon" />
                      <span className="detail-text">{user.email}</span>
                    </div>
                    <div className="user-detail">
                      <Calendar size={16} className="detail-icon" />
                      <span className="detail-text">
                        Joined {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;