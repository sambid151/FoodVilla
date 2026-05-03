import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '' });
  const [errors, setErrors] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '' });
  const [touched, setTouched] = useState({ firstName: false, lastName: false, email: false, phone: false, password: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const navigate = useNavigate();

  // Allowed domains for email validation
  const ALLOWED_DOMAINS = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'live.com'];

  const showToastAndNavigate = (msg: string, callback: () => void) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg('');
      callback();
    }, 1500);
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
    // Reset errors and touched state when switching between login and signup
    setErrors({ firstName: '', lastName: '', email: '', phone: '', password: '' });
    setTouched({ firstName: false, lastName: false, email: false, phone: false, password: false });
  }, [isLogin]);

  const processPendingCart = (token: string) => {
    const pendingItems = JSON.parse(localStorage.getItem('pendingCartItems') || '[]');
    if (pendingItems.length > 0) {
      const mockCart = JSON.parse(localStorage.getItem(`mockCart_${token}`) || '[]');
      pendingItems.forEach((item: any) => {
         mockCart.push({ id: Date.now() + Math.random(), menu_item_id: item.menu_item_id, quantity: item.quantity, menu_item: { id: item.menu_item_id, name: "Pending Menu Item", price: 40, image_url: "https://images.unsplash.com/photo-1544256661-d7031daabf2e?w=100" } });
      });
      localStorage.setItem(`mockCart_${token}`, JSON.stringify(mockCart));
      localStorage.removeItem('pendingCartItems');
      alert("Items from your guest session were added to your cart!");
    }
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
        alert(`Account locked due to too many failed attempts. Try again in ${remainingSeconds} second(s).`);
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
        
        showToastAndNavigate(`Welcome back, ${cleanEmail}! Logged in successfully.`, () => {
          processPendingCart(response.data.access_token);
          navigate('/cart');
        });
      } catch (error) {
        console.warn("Backend API not reachable. Using mock local authentication.");
        const users = JSON.parse(localStorage.getItem('mockUsers') || '[]');
        const user = users.find((u: any) => u.email === cleanEmail && u.password === password);
        
        if (user) {
          localStorage.removeItem(`failedAttempts_${cleanEmail}`);
          localStorage.removeItem(`lockout_${cleanEmail}`);
          localStorage.setItem('token', 'mock_token_123');
          
          showToastAndNavigate(`${user.name} logged in successfully!`, () => {
            processPendingCart('mock_token_123');
            navigate('/cart');
          });
        } else {
          let attempts = parseInt(localStorage.getItem(`failedAttempts_${cleanEmail}`) || '0');
          attempts += 1;
          
          if (attempts >= 3) {
            localStorage.setItem(`lockout_${cleanEmail}`, (Date.now() + 60000).toString());
            alert('Too many failed attempts. Account locked for 1 minute.');
          } else {
            localStorage.setItem(`failedAttempts_${cleanEmail}`, attempts.toString());
            alert(`Invalid email or password. Attempt ${attempts} of 3.`);
          }
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
        showToastAndNavigate(`${cleanFirstName} signed up successfully!`, () => {
          setIsLogin(true);
          setIsSubmitting(false);
        });
        return; // wait for toast
      } catch (error) {
        console.warn("Backend API not reachable. Using mock local authentication.");
        const users = JSON.parse(localStorage.getItem('mockUsers') || '[]');
        
        if (users.find((u: any) => u.email === cleanEmail)) {
          alert('Email already registered. Please login.');
          setIsSubmitting(false);
          return;
        }
        if (users.find((u: any) => u.phone === cleanPhone)) {
          alert('Phone already registered. Please login.');
          setIsSubmitting(false);
          return;
        }
        
        users.push({
          name: fullName,
          email: cleanEmail,
          phone: cleanPhone,
          password: password // In mock, plaintext. Backend handles hashing.
        });
        localStorage.setItem('mockUsers', JSON.stringify(users));
        
        showToastAndNavigate(`${cleanFirstName} signed up successfully!`, () => {
          setIsLogin(true);
          setFormData({ firstName: '', lastName: '', email: '', phone: '', password: '' });
          setIsSubmitting(false);
        });
        return; // wait for toast
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
            <input 
              type="password" 
              name="password" 
              className={`form-control ${errors.password ? 'input-error' : ''}`}
              value={formData.password}
              onChange={handleChange} 
              onBlur={handleBlur}
            />
            {errors.password && <span style={{color: 'var(--accent)', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block'}}>{errors.password}</span>}
          </div>
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

      <div className={`toast-popup ${toastMsg ? 'show' : ''}`}>
        <div className="toast-icon">✓</div>
        <div>{toastMsg}</div>
      </div>
    </div>
  );
};

export default Auth;
