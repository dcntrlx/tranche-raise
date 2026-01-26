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

    const colorClass = variant === 'blue' ? 'bg-gradient-to-r from-blue-600 to-cyan-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-gradient-to-r from-amber-600 to-yellow-400 shadow-[0_0_15px_rgba(251,191,36,0.5)]';
    const overlayColorClass = overlayVariant === 'blue' ? 'bg-gradient-to-r from-blue-600 to-cyan-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-gradient-to-r from-amber-600 to-yellow-400 shadow-[0_0_15px_rgba(251,191,36,0.5)]';

    return (
        <div className="w-full">
            {label && <div className="flex justify-between items-end text-sm mb-2.5">
                <span className="text-zinc-400 font-medium tracking-wide uppercase text-[10px]">{label}</span>
                <span className="text-white font-bold opacity-90">{formatEther(BigInt(current))} <span className="text-zinc-500 font-normal">/ {formatEther(BigInt(total))} ETH</span></span>
            </div>}
            <div className="w-full bg-zinc-800/50 rounded-full h-3 relative overflow-hidden ring-1 ring-white/5 shadow-inner">
                <div
                    className={`${colorClass} h-3 rounded-full transition-all duration-700 ease-out absolute top-0 left-0 z-10`}
                    style={{ width: `${percentage}%` }}
                ></div>
                {overlayCurrent !== undefined && (
                    <div
                        className={`${overlayColorClass} h-3 rounded-full transition-all duration-700 ease-out absolute top-0 left-0 z-20`}
                        style={{ width: `${overlayPercentage}%` }}
                    ></div>
                )}
            </div>
            {!label && <div className="text-right text-xs mt-2 text-zinc-500 font-medium">
                {formatEther(BigInt(current))} <span className="opacity-50">/ {formatEther(BigInt(total))} ETH</span>
            </div>}
        </div>
    );
}
