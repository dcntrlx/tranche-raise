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

            <div className="relative z-10 max-w-4xl mx-auto px-8 py-16">
                <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-12 text-white drop-shadow-2xl text-center">
                    About <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                        The Project
                    </span>
                </h2>

                <div className="p-8">
                    <div className="prose prose-invert max-w-none">
                        <h3 className="text-2xl font-semibold mb-6 text-cyan-100">Why TrancheRaise?</h3>
                        <div className="grid md:grid-cols-2 gap-8 mb-12">
                            <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/20 border border-blue-500/20 rounded-2xl p-6">
                                <h4 className="text-xl font-bold text-blue-400 mb-4">For Founders</h4>
                                <ul className="space-y-3 text-zinc-300">
                                    <li className="flex items-start gap-3">
                                        <span className="text-cyan-400 mt-1">&#10003;</span>
                                        <span><strong className="text-white">Decentralized Funding Access</strong> - Raise capital without intermediaries, geographic restrictions, or traditional gatekeepers.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-cyan-400 mt-1">&#10003;</span>
                                        <span><strong className="text-white">Build Investor Trust</strong> - The milestone-based system signals credibility. Investors are more likely to back projects when they know their funds are protected.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-cyan-400 mt-1">&#10003;</span>
                                        <span><strong className="text-white">Aligned Incentives</strong> - Focus on delivering real progress, not just marketing. Your success unlocks your funding.</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/20 border border-amber-500/20 rounded-2xl p-6">
                                <h4 className="text-xl font-bold text-amber-400 mb-4">For Backers</h4>
                                <ul className="space-y-3 text-zinc-300">
                                    <li className="flex items-start gap-3">
                                        <span className="text-amber-400 mt-1">&#10003;</span>
                                        <span><strong className="text-white">Protected Capital</strong> - Your funds are released in stages. If a project fails, unspent capital is returned to you proportionally.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-amber-400 mt-1">&#10003;</span>
                                        <span><strong className="text-white">Full Refund Control</strong> - Withdraw your contribution anytime during fundraising. During vesting, if 60% of backers vote to cancel, the campaign ends and remaining funds are refunded proportionally.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-amber-400 mt-1">&#10003;</span>
                                        <span><strong className="text-white">Direct Influence</strong> - Vote on every tranche release. Your voice determines whether the project continues receiving funds.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <h3 className="text-2xl font-semibold mb-4 text-cyan-100">How It Works?</h3>
                        <div className="space-y-6 text-zinc-300 mb-8">
                            <p>
                                TrancheRaise provides the possibility for investors to back projects safely, therefore improving credibility of founders.
                            </p>

                            <div>
                                <h4 className="text-xl text-white font-medium mb-2">1. Fundraising</h4>
                                <ul className="list-disc list-inside space-y-2">
                                    <li>Project creators launch a campaign with a fundraising goal and deadline</li>
                                    <li>Investors contribute funds to support the project</li>
                                    <li>If the goal is met, the campaign moves to vesting stage. If not, all funds are returned to investors</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-xl text-white font-medium mb-2">2. The Tranche System and Milestone Voting</h4>
                                <p className="mb-3">
                                    Project team doesn't get full access to money as soon as fundraising goal is met. Funds are released through tranches:
                                </p>
                                <ul className="list-disc list-inside space-y-2">
                                    <li>Project team requests a tranche for a specific goal</li>
                                    <li>Investors vote on the tranche. If more than 50% vote in favor, it gets approved and funds are sent to the project team. Otherwise, the tranche fails and money stays in the campaign</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-xl text-white font-medium mb-2">3. Protection via Refunds</h4>
                                <ul className="list-disc list-inside space-y-2">
                                    <li>If fundraising fails, all funds are returned to investors</li>
                                    <li>Investors can revoke funds at any time during the fundraising stage</li>
                                    <li>During vesting, investors can vote for refund. If more than 60% vote in favor, remaining funds are returned proportionally</li>
                                </ul>
                            </div>
                        </div>

                        <div className="flex justify-center pt-8">
                            <Link
                                href="/campaigns"
                                className="px-10 py-5 bg-zinc-100 hover:bg-white text-black text-xl font-bold rounded-full transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95"
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
