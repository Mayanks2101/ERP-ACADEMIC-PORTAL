import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getUserProfile } from '../../store/AuthReducer';

export default function OAuth2Redirect() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    const error = searchParams.get('error');

    // Handle error case
    if (error) {
      console.error('OAuth2 authentication failed:', error);
      navigate('/login?error=oauth_failed', { replace: true });
      return;
    }

    // Handle success case
    if (token) {
      try {
        // Store JWT token in localStorage
        localStorage.setItem('jwt', token);
        
        // Optionally store email
        if (email) {
          localStorage.setItem('userEmail', email);
        }

        // Fetch user profile with the token
        dispatch(getUserProfile(token));

        // Redirect to home page
        navigate('/', { replace: true });
      } catch (err) {
        console.error('Error processing OAuth2 callback:', err);
        navigate('/login?error=oauth_processing_failed', { replace: true });
      }
    } else {
      // No token found in callback
      console.error('No token received from OAuth2 callback');
      navigate('/login?error=no_token', { replace: true });
    }
  }, [searchParams, navigate, dispatch]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h2>Processing authentication...</h2>
        <p>Please wait while we sign you in.</p>
      </div>
    </div>
  );
}
