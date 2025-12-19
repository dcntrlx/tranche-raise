'use client';

import { useState, useEffect } from 'react';

export function CountdownTimer({ targetDate }: { targetDate: number | bigint }) {
    const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number } | null>(null);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = Number(targetDate) * 1000 - Date.now();

            if (difference > 0) {
                return {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                };
            } else {
                return null; // Time passed
            }
        };

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        // Initial calculation
        setTimeLeft(calculateTimeLeft());

        return () => clearInterval(timer);
    }, [targetDate]);

    if (!timeLeft) {
        return <span>Ended</span>;
    }

    return (
        <span className="font-mono text-indigo-400 font-bold">
            {timeLeft.days}d {timeLeft.hours}h left
        </span>
    );
}
