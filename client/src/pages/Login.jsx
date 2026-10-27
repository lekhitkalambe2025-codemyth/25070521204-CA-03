import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  const redirectUrl = new URLSearchParams(location.search).get('redirect') || '/';

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectUrl === '/login' ? '/' : redirectUrl, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectUrl]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both your email address and password');
      return;
    }

    try {
      setLoading(true);
      const res = await login(email.trim(), password);

      if (res.success) {
        navigate(redirectUrl === '/login' ? '/' : redirectUrl, { replace: true });
      } else {
        setErrorMessage(res.error || 'Invalid email or password');
      }
    } catch (err) {
      setErrorMessage(err.message || 'An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container container">
      <div className="auth-card">
        <div className="auth-header text-center">
          <span className="brand-badge">TATVA NUTRITION</span>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to manage your orders, wishlist, and cart</p>
        </div>

        {errorMessage && (
          <div className="alert alert-error" role="alert">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              required
              placeholder="e.g. athlete@tatvanutrition.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-text"
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <div className="label-row flex-between">
              <label htmlFor="password">Password</label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="btn-toggle-pw"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="Enter your account password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-text"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary btn-large btn-block"
          >
            {loading ? 'Signing In...' : 'Sign In to Account →'}
          </button>
        </form>

        <div className="auth-footer text-center">
          <p>
            Don't have an account yet?{' '}
            <Link to={`/register?redirect=${encodeURIComponent(redirectUrl)}`} className="link-highlight">
              Create an account
            </Link>
          </p>
          <div className="demo-credentials-box">
            <small>
              <strong>Demo Administrator Login:</strong><br />
              Email: <code>admin@tatvanutrition.com</code><br />
              Password: <code>Admin@Tatva2026!</code> (seeded via <code>npm run seed:admin</code>)
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
