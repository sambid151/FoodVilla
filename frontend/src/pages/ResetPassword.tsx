import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const showToast = (msg: string, type: 'success' | 'error' = 'success', callback?: () => void) => {
    setToastMsg(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMsg('');
      if (callback) callback();
    }, 2500);
  };

  // If we navigated here from Auth with an email state, pre-fill it.
  React.useEffect(() => {
    if (location.state && location.state.email) {
      setEmail(location.state.email);
    }
  }, [location]);

  const validatePassword = (password: string) => {
    if (!password) return "Password is required.";
    if (password.includes(' ')) return "Password cannot contain spaces.";
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[^\s]{10,}$/;
    if (!passwordRegex.test(password)) {
      return "Password must be at least 10 characters and include letters and numbers";
    }
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Email is required.');
      return;
    }

    const pwdError = validatePassword(newPassword);
    if (pwdError) {
      setError(pwdError);
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post('http://localhost:8000/auth/reset-password', {
        email: email.trim().toLowerCase(),
        new_password: newPassword
      });
      setSuccess(true);
      showToast('Password updated successfully! Redirecting to login...', 'success', () => {
        navigate('/auth');
      });
      
      // Clear any failed attempts or lockout from localStorage for this user
      const cleanEmail = email.trim().toLowerCase();
      localStorage.removeItem(`failedAttempts_${cleanEmail}`);
      localStorage.removeItem(`lockout_${cleanEmail}`);
    } catch (err: any) {
      if (err.response) {
        // Backend responded with an error (e.g., 404 User not found)
        showToast(err.response.data.detail || 'Reset failed.', 'error');
      } else {
        // Network error or server offline
        showToast('Cannot connect to server. Please check if the backend is running.', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-wrapper fade-in">
      <div className="auth-container" style={{maxWidth: '500px'}}>
        <h2 className="auth-title">Reset Password</h2>
        
        {success ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ fontSize: '3rem', color: 'var(--primary)', marginBottom: '1rem' }}>✓</div>
            <h3 style={{ marginBottom: '1rem' }}>Password Reset Successfully!</h3>
            <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>You can now login with your new password.</p>
            <Link to="/auth" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>Go to Login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem', textAlign: 'center' }}>
              Please enter your email address and your new password.
            </p>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input 
                type="text" 
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                disabled={!!(location.state && location.state.email)} // disable if pre-filled
              />
            </div>

            <div className="form-group">
              <label className="form-label">New Password</label>
              <div className="password-input-wrapper">
                <input 
                  type={showNewPassword ? "text" : "password"} 
                  className="form-control"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)} 
                  style={{ paddingRight: '3rem' }}
                />
                <button 
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  aria-label={showNewPassword ? "Hide password" : "Show password"}
                >
                  {showNewPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <div className="password-input-wrapper">
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  className="form-control"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  style={{ paddingRight: '3rem' }}
                />
                <button 
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ color: 'var(--accent)', fontSize: '0.9rem', marginBottom: '1rem', textAlign: 'center' }}>
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{width: '100%', marginBottom: '1rem', padding: '1rem', opacity: isSubmitting ? 0.7 : 1, display: 'flex', justifyContent: 'center'}}
              disabled={isSubmitting}
            >
              {isSubmitting ? <div className="spinner"></div> : 'Reset Password'}
            </button>
            
            <p style={{textAlign: 'center'}}>
              <Link to="/auth" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Back to Login</Link>
            </p>
          </form>
        )}
      </div>

      <div className={`toast-popup ${toastMsg ? 'show' : ''} ${toastType === 'success' ? 'toast-success' : 'toast-error'}`}>
        <div className="toast-icon">{toastType === 'success' ? '✓' : '✕'}</div>
        <div className="toast-message">{toastMsg}</div>
      </div>
    </div>
  );
};

export default ResetPassword;
