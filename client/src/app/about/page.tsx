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
                        <h3 className="text-2xl font-semibold mb-4 text-cyan-100">Our Mission</h3>
                        <p className="text-zinc-300 mb-6 leading-relaxed">
                            Tranche Raise is dedicated to revolutionizing the way projects are funded. By introducing milestone-based capital release, we ensure that investors are protected and projects remain accountable to their roadmap.
                        </p>

                        <h3 className="text-2xl font-semibold mb-4 text-cyan-100">How It Works</h3>
                        <div className="space-y-6 text-zinc-300 mb-8">
                            <p>
                                Tranche Raise changes the dynamic between investors and projects. Instead of "pray and spray" investing, where you hand over money and hope for the best, we introduce a system of accountability.
                            </p>

                            <div>
                                <h4 className="text-xl text-white font-medium mb-2">1. Campaign Creation & Goal Setting</h4>
                                <p>
                                    Project creators launch a campaign with a specific fundraising goal and a timeline. They define what they plan to achieve and how much capital they need.
                                </p>
                            </div>

                            <div>
                                <h4 className="text-xl text-white font-medium mb-2">2. The Tranche System</h4>
                                <p>
                                    When you invest, your funds are not immediately given to the project. Instead, they are held in a smart contract. The project only receives an initial "seed" tranche to get started. The rest of the funds are locked.
                                </p>
                            </div>

                            <div>
                                <h4 className="text-xl text-white font-medium mb-2">3. Milestone-Based Voting</h4>
                                <p>
                                    To unlock subsequent tranches of funds, the project must demonstrate progress. Token holders (investors) vote on whether to release the next tranche.
                                    <br />
                                    <span className="italic text-zinc-400">If the community is happy with the progress:</span> They vote YES, and funds are released.
                                    <br />
                                    <span className="italic text-zinc-400">If the project has stalled or failed:</span> They vote NO.
                                </p>
                            </div>

                            <div>
                                <h4 className="text-xl text-white font-medium mb-2">4. Protection via Refunds</h4>
                                <p>
                                    If a vote for a tranche fails, the remaining funds in the smart contract are not lost. They are returned to the investors proportionally. This ensures that if a project fails to deliver, you recover your unspent capital.
                                </p>
                            </div>
                        </div>

                        <h3 className="text-2xl font-semibold mb-4 text-cyan-100">Documentation</h3>
                        <p className="text-zinc-300 mb-12">
                            Detailed technical documentation and user guides will be available here soon. We are building a future where transparency is the standard, not the exception.
                        </p>

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
