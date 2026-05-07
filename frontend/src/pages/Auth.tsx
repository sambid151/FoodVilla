import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '' });
  const [errors, setErrors] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '' });
  const [touched, setTouched] = useState({ firstName: false, lastName: false, email: false, phone: false, password: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Allowed domains for email validation
  const ALLOWED_DOMAINS = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'live.com'];

  const showToastAndNavigate = (msg: string, type: 'success' | 'error' = 'success', callback?: () => void) => {
    setToastMsg(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMsg('');
      if (callback) callback();
    }, 2500);
  };

  // Validation Functions
  const validateFirstName = (name: string) => {
    if (!name.trim()) return "First name is required.";
    return "";
  };

  const validateLastName = (name: string) => {
    if (!name.trim()) return "Last name is required.";
    return "";
  };

  const validatePhone = (phone: string) => {
    if (!phone.trim()) return "Phone number is required.";
    const phoneRegex = /^\+91[6-9]\d{9}$/;
    if (!phoneRegex.test(phone.trim())) {
      return "Enter valid Indian mobile number with +91 followed by 10 digits";
    }
    return "";
  };

  const validateEmail = (email: string) => {
    if (!email.trim()) return "Email is required.";
    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail.includes(' ')) return "Email cannot contain spaces.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return "Invalid email format.";
    }
    const domain = cleanEmail.split('@')[1];
    if (!ALLOWED_DOMAINS.includes(domain)) {
      return "Only Gmail, Yahoo, Outlook, Hotmail, or Live email addresses are allowed";
    }
    return "";
  };

  const validatePassword = (password: string) => {
    if (!password) return "Password is required.";
    if (password.includes(' ')) return "Password cannot contain spaces.";
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[^\s]{10,}$/;
    if (!passwordRegex.test(password)) {
      return "Password must be at least 10 characters and include letters and numbers";
    }
    return "";
  };

  // Run validation on all fields
  const validateForm = () => {
    const newErrors = {
      firstName: isLogin ? "" : validateFirstName(formData.firstName),
      lastName: isLogin ? "" : validateLastName(formData.lastName),
      phone: isLogin ? "" : validatePhone(formData.phone),
      email: validateEmail(formData.email),
      password: isLogin ? (formData.password ? "" : "Password is required.") : validatePassword(formData.password)
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(err => err !== "");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for that field when typing
    if (touched[name as keyof typeof touched]) {
      let error = "";
      if (name === 'firstName' && !isLogin) error = validateFirstName(value);
      if (name === 'lastName' && !isLogin) error = validateLastName(value);
      if (name === 'phone' && !isLogin) error = validatePhone(value);
      if (name === 'email') error = validateEmail(value);
      if (name === 'password') error = isLogin ? (value ? "" : "Password is required.") : validatePassword(value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    let error = "";
    if (name === 'firstName' && !isLogin) error = validateFirstName(value);
    if (name === 'lastName' && !isLogin) error = validateLastName(value);
    if (name === 'phone' && !isLogin) error = validatePhone(value);
    if (name === 'email') error = validateEmail(value);
    if (name === 'password') error = isLogin ? (value ? "" : "Password is required.") : validatePassword(value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  useEffect(() => {
    // Reset errors, touched state, and failure state when switching
    setErrors({ firstName: '', lastName: '', email: '', phone: '', password: '' });
    setTouched({ firstName: false, lastName: false, email: false, phone: false, password: false });
    setLoginFailed(false);
  }, [isLogin]);

  const processPendingCart = (token: string) => {
    // This will be implemented in the future when real cart persistence is added
    console.log("Processing pending cart for token", token);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched to show errors on submit
    setTouched({ firstName: true, lastName: true, email: true, phone: true, password: true });
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    // Data cleaning for submission
    const cleanEmail = formData.email.trim().toLowerCase();
    const cleanFirstName = formData.firstName.trim();
    const cleanLastName = formData.lastName.trim();
    const fullName = `${cleanFirstName} ${cleanLastName}`.trim();
    const cleanPhone = formData.phone.trim();
    const password = formData.password; // already checked no spaces

    if (isLogin) {
      // Phase 2: Rate Limiting Check
      const lockoutTime = localStorage.getItem(`lockout_${cleanEmail}`);
      if (lockoutTime && Date.now() < parseInt(lockoutTime)) {
        const remainingSeconds = Math.ceil((parseInt(lockoutTime) - Date.now()) / 1000);
        showToastAndNavigate(`Account locked. Try again in ${remainingSeconds}s.`, 'error');
        setIsSubmitting(false);
        return;
      }

      try {
        const formDataObj = new URLSearchParams();
        formDataObj.append('username', cleanEmail);
        formDataObj.append('password', password);
        
        const response = await axios.post('http://localhost:8000/auth/login', formDataObj, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        
        localStorage.removeItem(`failedAttempts_${cleanEmail}`);
        localStorage.removeItem(`lockout_${cleanEmail}`);
        localStorage.setItem('token', response.data.access_token);
        
        showToastAndNavigate(`Welcome back, ${response.data.user_name || cleanEmail}! Logged in successfully.`, 'success', () => {
          processPendingCart(response.data.access_token);
          navigate('/cart');
        });
      } catch (error: any) {
        setIsSubmitting(false);
        if (error.response) {
          // Backend responded with an error (e.g., 401 Unauthorized)
          showToastAndNavigate(error.response.data.detail || 'Login failed. Please check your credentials.', 'error');
        } else {
          // Network error or server offline
          showToastAndNavigate('Cannot connect to server. Please check if the backend is running.', 'error');
        }
      }
    } else {
      try {
        await axios.post('http://localhost:8000/auth/signup', {
          name: fullName,
          email: cleanEmail,
          phone: cleanPhone,
          password: password
        });
        showToastAndNavigate(`${cleanFirstName} signed up successfully!`, 'success', () => {
          setIsLogin(true);
          setIsSubmitting(false);
        });
        return; // wait for toast
      } catch (error: any) {
        setIsSubmitting(false);
        if (error.response) {
          // Backend responded with an error (e.g., 400 Email already registered)
          showToastAndNavigate(error.response.data.detail || 'Signup failed.', 'error');
        } else {
          // Network error or server offline
          showToastAndNavigate('Cannot connect to server. Please check if the backend is running.', 'error');
        }
      }
    }
  };

  const hasErrors = Object.values(errors).some(err => err !== "");

  return (
    <div className="page-wrapper fade-in">
      <div className="auth-container" style={{maxWidth: '500px'}}>
        <h2 className="auth-title">{isLogin ? 'Welcome Back!' : 'Join FoodVilla'}</h2>
        <form onSubmit={handleSubmit} noValidate>
          {!isLogin && (
            <p style={{fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '1.5rem'}}>
              Fields marked with <span style={{color: 'var(--accent)'}}>*</span> are mandatory to fill.
            </p>
          )}
          {!isLogin && (
            <div style={{display: 'flex', gap: '1rem'}}>
              <div className="form-group" style={{flex: 1}}>
                <label className="form-label">First Name <span style={{color: 'var(--accent)'}}>*</span></label>
                <input 
                  type="text" 
                  name="firstName" 
                  className={`form-control ${errors.firstName ? 'input-error' : ''}`}
                  value={formData.firstName}
                  onChange={handleChange} 
                  onBlur={handleBlur}
                />
                {errors.firstName && <span style={{color: 'var(--accent)', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block'}}>{errors.firstName}</span>}
              </div>
              <div className="form-group" style={{flex: 1}}>
                <label className="form-label">Last Name <span style={{color: 'var(--accent)'}}>*</span></label>
                <input 
                  type="text" 
                  name="lastName" 
                  className={`form-control ${errors.lastName ? 'input-error' : ''}`}
                  value={formData.lastName}
                  onChange={handleChange} 
                  onBlur={handleBlur}
                />
                {errors.lastName && <span style={{color: 'var(--accent)', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block'}}>{errors.lastName}</span>}
              </div>
            </div>
          )}
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Phone Number <span style={{color: 'var(--accent)'}}>*</span></label>
              <input 
                type="text" 
                name="phone" 
                placeholder="+91XXXXXXXXXX"
                className={`form-control ${errors.phone ? 'input-error' : ''}`}
                value={formData.phone}
                onChange={handleChange} 
                onBlur={handleBlur}
              />
              {errors.phone && <span style={{color: 'var(--accent)', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block'}}>{errors.phone}</span>}
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Email Address <span style={{color: 'var(--accent)'}}>*</span></label>
            <input 
              type="text" 
              name="email" 
              className={`form-control ${errors.email ? 'input-error' : ''}`}
              value={formData.email}
              onChange={handleChange} 
              onBlur={handleBlur}
            />
            {errors.email && <span style={{color: 'var(--accent)', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block'}}>{errors.email}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Password <span style={{color: 'var(--accent)'}}>*</span></label>
            <div className="password-input-wrapper">
              <input 
                type={showPassword ? "text" : "password"} 
                name="password" 
                className={`form-control ${errors.password ? 'input-error' : ''}`}
                value={formData.password}
                onChange={handleChange} 
                onBlur={handleBlur}
                style={{ paddingRight: '3rem' }}
              />
              <button 
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.password && <span style={{color: 'var(--accent)', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block'}}>{errors.password}</span>}
            
            {isLogin && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button 
                  type="button" 
                  onClick={() => navigate('/reset-password', { state: { email: formData.email } })}
                  style={{ background: 'none', border: 'none', color: 'var(--text-light)', fontSize: '0.85rem', cursor: 'pointer', padding: 0 }}
                  className="hover-underline"
                >
                  Forgot Password?
                </button>
              </div>
            )}
          </div>

          {isLogin && loginFailed && (
            <div className="fade-in" style={{ 
              background: 'rgba(239, 68, 68, 0.05)', 
              border: '1px dashed var(--accent)', 
              padding: '0.75rem', 
              borderRadius: '8px', 
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              <p style={{ color: 'var(--accent)', fontSize: '0.9rem', fontWeight: '500' }}>
                Can't remember your password? 
                <button 
                  type="button"
                  onClick={() => navigate('/reset-password', { state: { email: formData.email } })}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 'bold', cursor: 'pointer', marginLeft: '0.5rem' }}
                >
                  Reset it here
                </button>
              </p>
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{width: '100%', marginBottom: '1rem', padding: '1rem', opacity: (isSubmitting || hasErrors) ? 0.7 : 1, display: 'flex', justifyContent: 'center'}}
            disabled={isSubmitting || hasErrors}
          >
            {isSubmitting ? <div className="spinner"></div> : (isLogin ? 'Log In' : 'Sign Up')}
          </button>
        </form>
        <p style={{textAlign: 'center', color: 'var(--text-light)'}}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)} 
            disabled={isSubmitting}
            style={{background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 'bold', cursor: isSubmitting ? 'not-allowed' : 'pointer'}}
          >
            {isLogin ? 'Sign up here' : 'Login here'}
          </button>
        </p>
      </div>

      <div className={`toast-popup ${toastMsg ? 'show' : ''} ${toastType === 'success' ? 'toast-success' : 'toast-error'}`}>
        <div className="toast-icon">{toastType === 'success' ? '✓' : '✕'}</div>
        <div className="toast-message">{toastMsg}</div>
      </div>
    </div>
  );
};

export default Auth;
