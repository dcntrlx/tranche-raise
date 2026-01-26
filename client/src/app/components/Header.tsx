'use client';

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useAccount, useWriteContract, useChainId, useWaitForTransactionReceipt } from 'wagmi';
import { useQueryClient } from "@tanstack/react-query";
import { parseEther } from 'viem';
import { CreateCampaign } from "../createCampaign";
import { CAMPAIGN_FACTORY_ADDRESSES, CAMPAIGN_FACTORY_ABI } from "../contracts";

export function Header({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isHome = pathname === "/";
    const { isConnected } = useAccount();
    const chainId = useChainId();
    const queryClient = useQueryClient();
    const factoryAddress = CAMPAIGN_FACTORY_ADDRESSES[chainId] || CAMPAIGN_FACTORY_ADDRESSES[31337];

    const [isCreating, setIsCreating] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const { writeContract, data: hash } = useWriteContract();

    const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash,
    });

    useEffect(() => {
        if (isConfirmed) {
            setShowSuccess(true);
            queryClient.invalidateQueries();
            const timer = setTimeout(() => setShowSuccess(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [isConfirmed, queryClient]);

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

        writeContract({
            address: factoryAddress,
            abi: CAMPAIGN_FACTORY_ABI,
            functionName: 'createCampaign',
            args: [campaignName, metadataCID, parseEther(campaignGoal), duration]
        })
    }

    return (
        <>
            <div className="relative z-50 flex justify-between items-center mb-8 pt-6 px-8">
                <div className="flex items-center gap-8">
                    <Link href="/">
                        <h1 className="text-3xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)] cursor-pointer hover:opacity-80 transition-opacity">
                            Tranche Raise
                        </h1>
                    </Link>
                    <nav className="flex gap-4">
                        {children}
                        {!isHome && (
                            <button
                                className={`px-5 py-2.5 rounded-full border transition-all backdrop-blur-md ${isConnected
                                    ? "bg-blue-600/20 border-blue-500/50 text-blue-300 hover:bg-blue-600/40 hover:text-white hover:border-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.2)]"
                                    : "bg-zinc-900/50 border-zinc-800 text-zinc-500 cursor-not-allowed"
                                    }`}
                                onClick={() => isConnected && setIsCreating(true)}
                            >
                                Start Campaign
                            </button>
                        )}
                    </nav>
                </div>
                <ConnectButton showBalance={true} />
            </div>

            {isCreating && <CreateCampaign onCreate={onCreate} onCancel={() => setIsCreating(false)} />}
            {showSuccess && (
                <div className="fixed bottom-8 right-8 bg-green-900/40 border border-green-500/50 text-green-100 px-6 py-4 rounded-xl shadow-2xl backdrop-blur-md animate-fade-in-up z-50">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <div className="font-semibold">Campaign created successfully!</div>
                    </div>
                </div>
            )}
        </>
    );
}
