'use client'
import { useEffect, useState } from 'react';

export default function AttemptsTracker() {
  const [attemptsLeft, setAttemptsLeft] = useState(5);

  useEffect(() => {
    const freeAttempts = document.cookie
      .split('; ')
      .find((row) => row.startsWith('freeAttempts='))
      ?.split('=')[1];

    setAttemptsLeft(5 - (freeAttempts ? parseInt(freeAttempts, 10) : 0));
  }, []);

  return <p>{attemptsLeft} free attempts left!</p>;
}