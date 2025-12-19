'use client';

import { formatEther } from "viem";

interface ProgressBarProps {
    current: bigint | number;
    total: bigint | number;
    variant: 'blue' | 'gold';
    label?: string;
    overlayCurrent?: bigint | number;
    overlayVariant?: 'blue' | 'gold';
}

export function ProgressBar({ current, total, variant, label, overlayCurrent, overlayVariant }: ProgressBarProps) {
    const currentNum = Number(current);
    const totalNum = Number(total);
    const overlayNum = overlayCurrent !== undefined ? Number(overlayCurrent) : 0;

    const percentage = totalNum > 0 ? Math.min((currentNum / totalNum) * 100, 100) : 0;
    const overlayPercentage = totalNum > 0 ? Math.min((overlayNum / totalNum) * 100, 100) : 0;

    const colorClass = variant === 'blue' ? 'bg-blue-800' : 'bg-amber-400';
    const overlayColorClass = overlayVariant === 'blue' ? 'bg-blue-800' : 'bg-amber-400';

    return (
        <div className="w-[10vw]">
            {label && <div className="flex justify-between text-sm mb-1">
                <span>{label}</span>
                <span>{formatEther(BigInt(current))} / {formatEther(BigInt(total))} ETH</span>
            </div>}
            <div className="w-full bg-zinc-700 rounded-full h-2.5 dark:bg-zinc-700 relative overflow-hidden">
                <div
                    className={`${colorClass} h-2.5 rounded-full transition-all duration-500 absolute top-0 left-0 z-10`}
                    style={{ width: `${percentage}%` }}
                ></div>
                {overlayCurrent !== undefined && (
                    <div
                        className={`${overlayColorClass} h-2.5 rounded-full transition-all duration-500 absolute top-0 left-0 z-20`}
                        style={{ width: `${overlayPercentage}%` }}
                    ></div>
                )}
            </div>
            {!label && <div className="text-right text-xs mt-1 text-zinc-400">
                {formatEther(BigInt(current))} / {formatEther(BigInt(total))} ETH
            </div>}
        </div>
    );
}
