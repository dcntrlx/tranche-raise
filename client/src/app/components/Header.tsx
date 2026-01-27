'use client';

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useAccount, useWriteContract, useChainId } from 'wagmi';
import { parseEther } from 'viem';
import { CreateCampaign } from "../createCampaign";
import { CAMPAIGN_FACTORY_ADDRESSES, CAMPAIGN_FACTORY_ABI } from "../contracts";

export function Header({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isHome = pathname === "/";
    const { isConnected, address } = useAccount();
    const chainId = useChainId();
    const factoryAddress = CAMPAIGN_FACTORY_ADDRESSES[chainId] || CAMPAIGN_FACTORY_ADDRESSES[31337];

    const [isCreating, setIsCreating] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { writeContractAsync } = useWriteContract();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Use mounted check to prevent hydration mismatch
    const walletConnected = mounted && isConnected;

    const onCreate = async (campaignName: string, campaignDescription: string, campaignGoal: string, campaignDurationInput: string) => {
        setIsCreating(false)
        const duration = BigInt(campaignDurationInput) * 86400n

        // IPFS Upload via Server API
        let metadataCID = "";
        try {
            console.log("Uploading metadata to IPFS from Header...", { campaignName, campaignDescription });
            const res = await fetch("/api/files", {
                method: "POST",
                body: JSON.stringify({
                    title: campaignName,
                    description: campaignDescription
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const uploadData = await res.json();
            if (!res.ok) throw new Error(uploadData.error || "Upload failed");
            metadataCID = uploadData.ipfsHash;
            console.log("Uploaded to IPFS from Header: ", metadataCID);
        } catch (e) {
            console.error("IPFS upload failed from Header", e);
            alert("Failed to upload campaign description to IPFS. Please try again.");
            setIsCreating(true);
            return;
        }

        try {
            await writeContractAsync({
                address: factoryAddress,
                abi: CAMPAIGN_FACTORY_ABI,
                functionName: 'createCampaign',
                args: [campaignName, metadataCID, parseEther(campaignGoal), duration]
            });
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 5000);
        } catch (e) {
            console.error("Transaction failed:", e);
        }
    }

    return (
        <>
            <div className="relative z-50 flex justify-between items-center mb-4 md:mb-8 pt-4 md:pt-6 px-4 md:px-8">
                {/* Logo + Desktop Navigation */}
                <div className="flex items-center gap-4 lg:gap-8">
                    <Link href="/">
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)] cursor-pointer hover:opacity-80 transition-opacity">
                            Tranche Raise
                        </h1>
                    </Link>

                    {/* Desktop Navigation - next to logo */}
                    <nav className="hidden md:flex items-center gap-3 lg:gap-4">
                        {children}
                        {!isHome && (
                            <button
                                className={`px-4 lg:px-5 py-2 lg:py-2.5 rounded-full border transition-all backdrop-blur-md text-sm lg:text-base ${walletConnected
                                    ? "bg-blue-600/20 border-blue-500/50 text-blue-300 hover:bg-blue-600/40 hover:text-white hover:border-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.2)]"
                                    : "bg-zinc-900/50 border-zinc-800 text-zinc-500 cursor-not-allowed"
                                    }`}
                                onClick={() => walletConnected && setIsCreating(true)}
                            >
                                Start Campaign
                            </button>
                        )}
                    </nav>
                </div>

                {/* Desktop Connect Button - on the right */}
                <div className="hidden md:block">
                    <ConnectButton showBalance={true} />
                </div>

                {/* Mobile Menu Button */}
                <div className="flex md:hidden items-center gap-3">
                    <ConnectButton showBalance={false} accountStatus="avatar" chainStatus="icon" />
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 rounded-lg bg-zinc-900/50 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 transition-colors"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
                <div className="md:hidden fixed inset-x-0 top-[60px] z-40 bg-zinc-950/95 backdrop-blur-lg border-b border-zinc-800 px-4 py-4 space-y-2 animate-fade-in max-h-[80vh] overflow-y-auto">
                    <nav className="flex flex-col gap-1" onClick={() => setMobileMenuOpen(false)}>
                        {/* Campaigns Section - Expanded */}
                        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-3 pt-2 pb-1">Campaigns</div>
                        <Link href="/campaigns?status=fundraising" className="block px-4 py-2.5 text-zinc-300 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors text-sm">
                            Fundraising
                        </Link>
                        <Link href="/campaigns?status=vesting" className="block px-4 py-2.5 text-zinc-300 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors text-sm">
                            Vesting
                        </Link>
                        <Link href="/campaigns?status=finished" className="block px-4 py-2.5 text-zinc-300 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors text-sm">
                            Finished
                        </Link>
                        <Link href="/campaigns?status=failed" className="block px-4 py-2.5 text-zinc-300 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors text-sm">
                            Failed
                        </Link>

                        {walletConnected && address && (
                            <>
                                <Link href={`/campaigns?owner=${address}`} className="block px-4 py-2.5 text-zinc-300 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors text-sm">
                                    My Campaigns
                                </Link>
                                <Link href={`/campaigns?backer=${address}`} className="block px-4 py-2.5 text-zinc-300 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors text-sm">
                                    Backed Campaigns
                                </Link>
                            </>
                        )}

                        <div className="border-t border-zinc-800 my-2" />

                        {/* About Link */}
                        <Link href="/about" className="block px-4 py-2.5 text-zinc-300 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors text-sm">
                            About
                        </Link>

                        {/* Start Campaign Button */}
                        {!isHome && (
                            <button
                                className={`w-full px-4 py-3 mt-2 rounded-xl border transition-all text-sm font-medium ${walletConnected
                                    ? "bg-blue-600/20 border-blue-500/50 text-blue-300 hover:bg-blue-600/40"
                                    : "bg-zinc-900/50 border-zinc-800 text-zinc-500 cursor-not-allowed"
                                    }`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (walletConnected) {
                                        setMobileMenuOpen(false);
                                        setIsCreating(true);
                                    }
                                }}
                            >
                                Start Campaign
                            </button>
                        )}
                    </nav>
                </div>
            )}

            {isCreating && <CreateCampaign onCreate={onCreate} onCancel={() => setIsCreating(false)} />}
            {showSuccess && (
                <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 bg-green-900/40 border border-green-500/50 text-green-100 px-4 md:px-6 py-3 md:py-4 rounded-xl shadow-2xl backdrop-blur-md animate-fade-in-up z-50">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <div className="font-semibold text-sm md:text-base">Campaign created!</div>
                    </div>
                </div>
            )}
        </>
    );
}
