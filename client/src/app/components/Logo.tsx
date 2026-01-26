'use client';

export function Logo() {
    return (
        <div className="flex items-center gap-3 group px-2 py-1 rounded-2xl hover:bg-white/5 transition-all duration-500">
            <div className="relative w-10 h-10 flex items-center justify-center">
                {/* Background Glow */}
                <div className="absolute inset-0 bg-blue-500/20 blur-xl group-hover:bg-blue-500/40 transition-all duration-500 rounded-full" />

                {/* SVG Monogram */}
                <svg viewBox="0 0 100 100" className="w-full h-full relative z-10 filter drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]">
                    <defs>
                        <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#60A5FA" />
                            <stop offset="100%" stopColor="#22D3EE" />
                        </linearGradient>
                    </defs>

                    {/* The "T" and "R" abstract block form */}
                    {/* Top Tranche */}
                    <path
                        d="M20 25 L80 25 L75 40 L15 40 Z"
                        fill="url(#logo-grad)"
                        className="transition-transform duration-500 group-hover:-translate-y-1"
                    />

                    {/* Middle Tranche (Offset) */}
                    <path
                        d="M25 45 L85 45 L80 60 L20 60 Z"
                        fill="url(#logo-grad)"
                        fillOpacity="0.8"
                        className="transition-transform duration-500 group-hover:translate-x-1"
                    />

                    {/* Bottom Tranche */}
                    <path
                        d="M30 65 L90 65 L85 80 L25 80 Z"
                        fill="url(#logo-grad)"
                        fillOpacity="0.6"
                        className="transition-transform duration-500 group-hover:translate-y-1"
                    />
                </svg>
            </div>

            <div className="flex flex-col">
                <span className="text-xl font-black tracking-tighter text-white leading-none">
                    TRANCHE
                </span>
                <span className="text-[10px] font-bold tracking-[0.3em] text-cyan-400 leading-none mt-1 uppercase">
                    Raise
                </span>
            </div>
        </div>
    );
}
