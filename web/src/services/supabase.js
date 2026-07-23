import axios from 'axios';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://agkytyjwmigamkbjusqr.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFna3l0eWp3bWlnYW1rYmp1c3FyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3ODAxMDEsImV4cCI6MjEwMDM1NjEwMX0.dOpC0SrscJ8XKdsGFjAHvVtjTQ1ZAgz0k-6RVtLBUhI';

export const signIn = async (email, password) => {
  try {
    const response = await axios.post(
      `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
      { email, password },
      { headers: { apikey: SUPABASE_ANON_KEY, 'Content-Type': 'application/json' } }
    );
    return {
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
      user_id: response.data.user.id,
      email: response.data.user.email
    };
  } catch (err) {
    return { error: err.response?.data?.error_description || err.response?.data?.msg || 'Sign in failed.' };
  }
};

export const signUp = async (email, password) => {
  try {
    const response = await axios.post(
      `${SUPABASE_URL}/auth/v1/signup`,
      { email, password },
      { headers: { apikey: SUPABASE_ANON_KEY, 'Content-Type': 'application/json' } }
    );
    if (!response.data.access_token) {
      return { pending_confirmation: true, email };
    }
    return {
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
      user_id: response.data.user.id,
      email: response.data.user.email
    };
  } catch (err) {
    return { error: err.response?.data?.msg || 'Sign up failed.' };
  }
};

export const googleOAuthUrl = async () => {
  const redirectUrl = window.location.origin;
  return {
    url: `${SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirectUrl)}`
  };
};
