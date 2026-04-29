import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { googleLogin, loginUser } from '../api/authApi';
import { addNotification } from '../utils/notifications';
import logo from "../assets/logo-UniCore.png"

import './Auth.css';

const getErrorMessage = (err) => {
  if (err.response?.data?.message) {
    const message = err.response.data.message;
    if (typeof message === 'string') {
      return message;
    }
    if (typeof message === 'object') {
      return Object.values(message).join(', ');
    }
  }

  if (err.message === 'Network Error') {
    return 'Cannot reach backend server. Please start Spring Boot backend on port 8081.';
  }

  return 'Login failed. Please try again.';
};

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuthSuccess = async (data) => {
    localStorage.setItem('flexitUser', JSON.stringify(data));
    localStorage.setItem('userId', data.userId || data.id);
    localStorage.setItem('name', data.userName || data.fullName || data.name);
    localStorage.setItem('email', data.email);
    localStorage.setItem('role', data.role);

    const resolvedRole = String(data.role || '').toUpperCase();
    const resolvedUserId = data.userId || data.id;
    const resolvedName = data.userName || data.fullName || data.name || 'User';


    if (resolvedUserId) {
      await addNotification({
        userId: resolvedUserId,
        title: `👋 Welcome back, ${resolvedName}!`,
        message: `You have successfully logged in to your UniCore workspace.`,
        type: "LOGIN",
      });
    }

    if (resolvedRole === 'ADMIN') {
      navigate('/admin');
    } else if (resolvedRole === 'TECHNICIAN') {
      navigate('/technician/tickets');
    } else {
      navigate('/user/dashboard');
    }

  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.email || !formData.password) {
        setError('Please fill in all fields');
        return;
      }

      const data = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      await handleAuthSuccess(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse?.credential) {
      setError("Google authentication failed");
      return;
    }

    try {
      // 🔥 decode JWT token
      const payload = JSON.parse(atob(credentialResponse.credential.split(".")[1]));

      const data = await googleLogin({
        email: payload.email,
        name: payload.name,
      });

      await handleAuthSuccess(data);

    } catch (err) {
      console.error(err);
      setError("Google login failed");
    }
  };

  return (
    <div className="auth-page login-page">
      <div className="auth-container login-layout">
        <section className="auth-info-section" aria-label="UniCore overview">
          <div className="brand-lockup" aria-label="UniCore">
            <span className="brand-mark">
              <img src={logo} alt="" />
              <img src={logo} alt="" />
            </span>
            <span className="brand-name">UniCore</span>
          </div>

          <div className="auth-copy">
            <p className="eyebrow">Smart Campus Workspace</p>
            <h1 className="info-title">Welcome back to your campus command center.</h1>
            <p className="info-desc">
              Sign in to manage resources, view updates, and keep daily campus work moving from one simple dashboard.
            </p>
          </div>

          <div className="mini-cards-container">
            <div className="mini-card">
              <div className="mini-card-icon">01</div>
              <div className="mini-card-text">
                <h3>Fast access</h3>
                <p>Continue to your dashboard without unnecessary steps.</p>
              </div>
            </div>

            <div className="mini-card">
              <div className="mini-card-icon">02</div>
              <div className="mini-card-text">
                <h3>Secure sessions</h3>
                <p>Your account data stays protected while you work.</p>
              </div>
            </div>

            <div className="mini-card">
              <div className="mini-card-icon">03</div>
              <div className="mini-card-text">
                <h3>Clear updates</h3>
                <p>See campus activity and resource status at a glance.</p>
              </div>
            </div>
          </div>
        </section>

        <main className="auth-card" aria-label="Sign in form">
          <div className="auth-card-header">
            <p className="eyebrow">Account login</p>
            <h2>Sign in</h2>
            <p className="auth-subtitle">Use your registered email and password to continue.</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <div className="social-login">
            <div className="social-btn-wrapper">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google authentication failed. Please try again.')}
                text="signin_with"
                shape="rectangular"
                width="100%"
              />
            </div>
          </div>

          <p className="auth-footer">
            New to UniCore?{' '}
            <a
              href="#signup"
              onClick={(e) => {
                e.preventDefault();
                navigate('/signup');
              }}
            >
              Create an account
            </a>
          </p>
        </main>
      </div>
    </div>
  );
}

export default Login;