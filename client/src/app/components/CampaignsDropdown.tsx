'use client';

import Link from "next/link";
import { ChevronDown } from "lucide-react";

export function CampaignsDropdown() {
    return (
        <div className="relative group z-50">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-600 text-zinc-300 hover:text-white transition-all backdrop-blur-md cursor-default">
                Campaigns
                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
            </button>

            <div className="absolute top-full left-0 mt-2 w-48 py-2 bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left z-50">
                <Link href="/campaigns?status=fundraising" className="block px-4 py-2 text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-colors">
                    Fundraising
                </Link>
                <Link href="/campaigns?status=vesting" className="block px-4 py-2 text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-colors">
                    Vesting
                </Link>
                <Link href="/campaigns?status=finished" className="block px-4 py-2 text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-colors">
                    Finished Campaigns
                </Link>
                <Link href="/campaigns?status=failed" className="block px-4 py-2 text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-colors">
                    Failed Campaigns
                </Link>
            </div>
        </div>
    );
}
