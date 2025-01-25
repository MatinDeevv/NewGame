
'use client';
import supabase from '@/suppabaseClient';
import { useState, useEffect } from 'react';
export default function GamePage() {
  const [balance, setBalance] = useState(0); // User balance
  const [multiplier, setMultiplier] = useState(1); // Click multiplier
  const [user, setUser] = useState<any>(null); // Authenticated user
  const [loading, setLoading] = useState(true);

  // Fetch user info and balance
  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error('Error fetching user:', error.message);
        return;
      }

      setUser(user);

      if (user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('balance, multiplier')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError.message);
        } else {
          setBalance(profile.balance || 0);
          setMultiplier(profile.multiplier || 1);
        }
      }

      setLoading(false);
    };

    fetchUserData();
  }, []);

  // Handle click to increment balance
  const handleClick = async () => {
    const newBalance = balance + multiplier;
    setBalance(newBalance);

    // Update balance in the database
    const { error } = await supabase
      .from('profiles')
      .update({ balance: newBalance })
      .eq('id', user.id);

    if (error) {
      console.error('Error updating balance:', error.message);
    }
  };

  // Handle multiplier upgrade
  const handleUpgrade = async () => {
    const upgradeCost = multiplier * 100;

    if (balance >= upgradeCost) {
      const newMultiplier = multiplier * 1.5;
      const newBalance = balance - upgradeCost;

      setMultiplier(newMultiplier);
      setBalance(newBalance);

      // Update multiplier and balance in the database
      const { error } = await supabase
        .from('profiles')
        .update({ multiplier: newMultiplier, balance: newBalance })
        .eq('id', user.id);

      if (error) {
        console.error('Error upgrading multiplier:', error.message);
      }
    } else {
      console.log('Not enough balance to upgrade!');
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">Welcome, {user?.email}</h1>
      <h2 className="text-3xl font-semibold mb-4">Balance: ${balance.toFixed(2)}</h2>
      <h3 className="text-xl mb-8">Multiplier: x{multiplier.toFixed(2)}</h3>

      <button
        onClick={handleClick}
        className="mb-6 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-500 transition-all"
      >
        Click to Earn ${multiplier.toFixed(2)}
      </button>

      <button
        onClick={handleUpgrade}
        disabled={balance < multiplier * 100}
        className={`px-6 py-3 rounded-md text-lg font-medium transition-all ${
          balance >= multiplier * 100
            ? 'bg-blue-600 text-white hover:bg-blue-500'
            : 'bg-red-600 text-gray-300 cursor-not-allowed'
        }`}
      >
        Upgrade Multiplier (Cost: ${multiplier * 100})
      </button>
    </div>
  );
}
