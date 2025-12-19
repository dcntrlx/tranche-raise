'use client';

import { formatEther } from "viem";

interface ProgressBarProps {
    current: bigint | number;
    total: bigint | number;
    variant: 'blue' | 'gold';
    label?: string;
}

export function ProgressBar({ current, total, variant, label }: ProgressBarProps) {
    const currentNum = Number(current);
    const totalNum = Number(total);
    const percentage = totalNum > 0 ? Math.min((currentNum / totalNum) * 100, 100) : 0;

    const colorClass = variant === 'blue' ? 'bg-blue-600' : 'bg-yellow-500';

    return (
        <div className="w-[10vw]">
            {label && <div className="flex justify-between text-sm mb-1">
                <span>{label}</span>
                <span>{formatEther(BigInt(current))} / {formatEther(BigInt(total))} ETH</span>
            </div>}
            <div className="w-full bg-zinc-700 rounded-full h-2.5 dark:bg-zinc-700">
                <div
                    className={`${colorClass} h-2.5 rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
            {!label && <div className="text-right text-xs mt-1 text-zinc-400">
                {formatEther(BigInt(current))} / {formatEther(BigInt(total))} ETH
            </div>}
        </div>
    );
}
