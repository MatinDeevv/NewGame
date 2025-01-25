'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/suppabaseClient';

const LoginPage = () => {
  const router = useRouter();

  // State for login/signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Check for user session on load
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data, error } = await supabase
          .from('players')
          .select('username')
          .eq('id', session.user.id)
          .single();

        if (error || !data?.username) {
          router.push('/choose-username');
        } else {
          router.push('/game');
        }
      }
    };
    checkSession();
  }, [router]);

  // Handle Google Login
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) setErrorMessage(error.message);
  };

  // Handle Email Signup
  const handleEmailSignup = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      setErrorMessage(error.message);
    } else {
      alert('Signup successful! You can now log in.');
    }
  };

  // Handle Email Login
  const handleEmailLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMessage(error.message);
    } else {
      const session = await supabase.auth.getSession();
      if (session.data?.session) {
        const { data, error } = await supabase
          .from('players')
          .select('username')
          .eq('id', session.data.session.user.id)
          .single();

        if (error || !data?.username) {
          router.push('/choose-username');
        } else {
          router.push('/');
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Welcome Back
        </h1>

        {errorMessage && (
          <div className="mb-4 text-red-600 text-center">
            {errorMessage}
          </div>
        )}

        <div className="mb-6">
          <label className="block mb-2 text-gray-600">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-gray-600">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
          />
        </div>

        <div className="mb-6 flex items-center">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="mr-2"
          />
          <label className="text-gray-600">Remember Me</label>
        </div>

        <button
          onClick={handleEmailSignup}
          className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition mb-4"
        >
          Sign Up
        </button>

        <button
          onClick={handleEmailLogin}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition mb-4"
        >
          Log In
        </button>

        <button
          onClick={handleGoogleLogin}
          className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
