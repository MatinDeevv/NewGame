'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/suppabaseClient';

export default function ChooseUsernamePage() {
  const [username, setUsername] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  // Refresh JWT token when it expires
  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'TOKEN_REFRESHED' && session) {
          console.log('Token refreshed successfully');
        } else if (event === 'SIGNED_OUT') {
          router.push('/login'); // Redirect to login if user signs out
        }
      }
    );

    return () => {
      subscription?.subscription.unsubscribe();
    };
  }, [router]);

  const handleUsernameSubmit = async () => {
    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        setErrorMessage('No authenticated user found. Please log in again.');
        router.push('/login');
        return;
      }

      const user = session.user;

      if (!username.trim()) {
        setErrorMessage('Username cannot be empty.');
        return;
      }

      // Update or insert the username in the database
      const { error } = await supabase.from('players').upsert({
        id: user.id, // Use the authenticated user's ID
        username,
      });

      if (error) {
        setErrorMessage(error.message);
      } else {
        setSuccessMessage('Username saved successfully! Redirecting to the game...');
        setTimeout(() => {
          router.push('/'); // Redirect to the game page
        }, 2000);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(`An unexpected error occurred: ${err.message}`);
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Choose a Username
        </h1>

        {errorMessage && (
          <div className="mb-4 text-red-600 text-center">{errorMessage}</div>
        )}

        {successMessage && (
          <div className="mb-4 text-green-600 text-center">{successMessage}</div>
        )}

        <div className="mb-6">
          <label className="block mb-2 text-gray-600">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your username"
          />
        </div>

        <button
          onClick={handleUsernameSubmit}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          Save Username
        </button>
      </div>
    </div>
  );
}
