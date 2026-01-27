'use client'

import Link from "next/link";
import { NetworkBackground } from "../components/NetworkBackground";
import { Header } from "../components/Header";
import { CampaignsDropdown } from "../components/CampaignsDropdown";
import { Footer } from "../components/Footer";

export default function About() {
    return (
        <div className="relative min-h-screen">
            <NetworkBackground />

            <Header>
                <CampaignsDropdown />
            </Header>

            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-16">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold tracking-tight mb-8 md:mb-12 text-white drop-shadow-2xl text-center">
                    About <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                        The Project
                    </span>
                </h2>

                <div className="p-2 sm:p-4 md:p-8">
                    <div className="prose prose-invert max-w-none">
                        <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-cyan-100">Why TrancheRaise?</h3>
                        <div className="grid md:grid-cols-2 gap-4 md:gap-8 mb-8 md:mb-12">
                            <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/20 border border-blue-500/20 rounded-xl md:rounded-2xl p-4 md:p-6">
                                <h4 className="text-base md:text-xl font-bold text-blue-400 mb-3 md:mb-4">For Founders</h4>
                                <ul className="space-y-2 md:space-y-3 text-zinc-300 text-sm md:text-base">
                                    <li className="flex items-start gap-2 md:gap-3">
                                        <span className="text-cyan-400 mt-0.5 md:mt-1">&#10003;</span>
                                        <span><strong className="text-white">Decentralized Funding Access</strong> - Raise capital without intermediaries or geographic restrictions.</span>
                                    </li>
                                    <li className="flex items-start gap-2 md:gap-3">
                                        <span className="text-cyan-400 mt-0.5 md:mt-1">&#10003;</span>
                                        <span><strong className="text-white">Build Investor Trust</strong> - The milestone-based system signals credibility.</span>
                                    </li>
                                    <li className="flex items-start gap-2 md:gap-3">
                                        <span className="text-cyan-400 mt-0.5 md:mt-1">&#10003;</span>
                                        <span><strong className="text-white">Aligned Incentives</strong> - Your success unlocks your funding.</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/20 border border-amber-500/20 rounded-xl md:rounded-2xl p-4 md:p-6">
                                <h4 className="text-base md:text-xl font-bold text-amber-400 mb-3 md:mb-4">For Backers</h4>
                                <ul className="space-y-2 md:space-y-3 text-zinc-300 text-sm md:text-base">
                                    <li className="flex items-start gap-2 md:gap-3">
                                        <span className="text-amber-400 mt-0.5 md:mt-1">&#10003;</span>
                                        <span><strong className="text-white">Protected Capital</strong> - Funds are released in stages. If a project fails, unspent capital is returned.</span>
                                    </li>
                                    <li className="flex items-start gap-2 md:gap-3">
                                        <span className="text-amber-400 mt-0.5 md:mt-1">&#10003;</span>
                                        <span><strong className="text-white">Full Refund Control</strong> - Withdraw anytime during fundraising. Vote to cancel during vesting.</span>
                                    </li>
                                    <li className="flex items-start gap-2 md:gap-3">
                                        <span className="text-amber-400 mt-0.5 md:mt-1">&#10003;</span>
                                        <span><strong className="text-white">Direct Influence</strong> - Vote on every tranche release.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 md:mb-4 text-cyan-100">How It Works?</h3>
                        <div className="space-y-4 md:space-y-6 text-zinc-300 text-sm md:text-base mb-6 md:mb-8">
                            <p>
                                TrancheRaise provides the possibility for investors to back projects safely, improving credibility of founders.
                            </p>

                            <div>
                                <h4 className="text-base md:text-xl text-white font-medium mb-2">1. Fundraising</h4>
                                <ul className="list-disc list-inside space-y-1.5 md:space-y-2 text-sm md:text-base">
                                    <li>Creators launch a campaign with a goal and deadline</li>
                                    <li>Investors contribute funds to support the project</li>
                                    <li>If goal is met, campaign moves to vesting. If not, funds are returned</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-base md:text-xl text-white font-medium mb-2">2. Tranche System & Voting</h4>
                                <p className="mb-2 md:mb-3 text-sm md:text-base">
                                    Funds are released through tranches:
                                </p>
                                <ul className="list-disc list-inside space-y-1.5 md:space-y-2 text-sm md:text-base">
                                    <li>Team requests a tranche for a specific goal</li>
                                    <li>Investors vote. If &gt;50% approve, funds are sent. Otherwise, money stays in campaign</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-base md:text-xl text-white font-medium mb-2">3. Protection via Refunds</h4>
                                <ul className="list-disc list-inside space-y-1.5 md:space-y-2 text-sm md:text-base">
                                    <li>If fundraising fails, all funds are returned</li>
                                    <li>Investors can revoke funds anytime during fundraising</li>
                                    <li>During vesting, 60%+ vote cancels campaign and returns remaining funds</li>
                                </ul>
                            </div>
                        </div>

                        <div className="flex justify-center pt-6 md:pt-8">
                            <Link
                                href="/campaigns"
                                className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 bg-zinc-100 hover:bg-white text-black text-base md:text-xl font-bold rounded-full transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 text-center"
                            >
                                Explore Campaigns
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
