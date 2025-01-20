'use client';
import { useState } from "react";
import Image from "next/image";

export default function Home() {
  // State variables
  const [clickBalance] = useState(1); // Default value for clicks (read-only)
  const [multiplier, setMultiplier] = useState(1); // Default multiplier
  const [balance, setBalance] = useState(0); // Total balance

  // Handler function for click
  const handleClick = () => {
    const newBalance = balance + clickBalance * multiplier;
    setBalance(newBalance);
    console.log(`New Balance: ${newBalance}`);
  };

  const upgrade = () => {
    if (balance >= 100) {
      setMultiplier(multiplier * 1.5);
      setBalance(balance - multiplier * 100);
      console.log(`Multiplier upgraded to ${multiplier * 1.5}`);
    } else {
      console.log("Not enough balance to upgrade!");
    }
  };

  // Check if enough balance for styling
  const isAffordable = balance >= multiplier * 100;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-6xl mb-10 font-bold">Balance: ${balance.toFixed(2)}</h1>
      <button
        onClick={handleClick}
        className="mb-6 p-4 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 transition-all shadow-lg"
      >
        <Image src="/globe.svg" alt="Globe" width={200} height={200} />
      </button>
      <button
        onClick={upgrade}
        className={`mt-4 px-6 py-3 rounded-lg text-lg font-medium shadow-md transition-all ${
          isAffordable
            ? "bg-green-600 hover:bg-green-500 text-white"
            : "bg-red-600 text-gray-200 cursor-not-allowed"
        }`}
        disabled={!isAffordable}
      >
        Upgrade Multiplier (Cost: ${multiplier * 200})
      </button>
    </div>
  );
}
