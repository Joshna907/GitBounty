import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      // quick dev: store token (not for production)
      localStorage.setItem('token', token);
      return navigate('/', { replace: true });
    }

    // If backend set an httpOnly cookie, call /api/me to get profile
    fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/me`, {
      credentials: 'include',
    })
      .then((r) => {
        if (!r.ok) throw new Error('not authenticated');
        return r.json();
      })
      .then((user) => {
        // store minimal info or set app state
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/', { replace: true });
      })
      .catch(() => {
        // fallback
        navigate('/sign-in', { replace: true });
      });
  }, [navigate]);

  return <div className="min-h-screen flex items-center justify-center text-white">Signing in…</div>;
};

export default AuthSuccess;