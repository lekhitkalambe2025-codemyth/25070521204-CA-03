import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, isAuthenticated } = useAuth();

  const redirectUrl = new URLSearchParams(location.search).get('redirect') || '/';

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectUrl === '/register' ? '/' : redirectUrl, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectUrl]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!name.trim() || !email.trim() || !password) {
      setErrorMessage('All fields are required');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify both fields.');
      return;
    }

    try {
      setLoading(true);
      const res = await register(name.trim(), email.trim(), password);

      if (res.success) {
        setSuccessMessage('Registration successful! Unlocking store catalogue...');
        setTimeout(() => {
          navigate(redirectUrl === '/register' ? '/' : redirectUrl, { replace: true });
        }, 800);
      } else {
        setErrorMessage(res.error || 'Registration failed');
      }
    } catch (err) {
      setErrorMessage(err.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container container">
      <div className="auth-card">
        <div className="auth-header text-center">
          <span className="brand-badge">TATVA NUTRITION</span>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join TATVA for clean nutrition, order tracking, and wishlist access</p>
        </div>

        {errorMessage && (
          <div className="alert alert-error" role="alert">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success" role="alert">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="regName">Full Name</label>
            <input
              id="regName"
              type="text"
              required
              placeholder="e.g. Vikram Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-text"
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="regEmail">Email Address</label>
            <input
              id="regEmail"
              type="email"
              required
              placeholder="e.g. vikram@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-text"
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <div className="label-row flex-between">
              <label htmlFor="regPassword">Password (Min 6 Characters)</label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="btn-toggle-pw"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <input
              id="regPassword"
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="Create a secure password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-text"
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="regConfirm">Confirm Password</label>
            <input
              id="regConfirm"
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="Re-enter password to confirm"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-text"
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading || Boolean(successMessage)}
            className="btn-primary btn-large btn-block"
          >
            {loading ? 'Creating Account...' : 'Complete Registration →'}
          </button>
        </form>

        <div className="auth-footer text-center">
          <p>
            Already have an account?{' '}
            <Link to={`/login?redirect=${encodeURIComponent(redirectUrl)}`} className="link-highlight">
              Sign In here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
