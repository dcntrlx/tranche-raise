'use client'

import { CampaignsDropdown } from "./components/CampaignsDropdown";
import { Header } from "./components/Header";
import { useAccount, useWriteContract, useChainId, useWaitForTransactionReceipt } from 'wagmi';
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CreateCampaign } from "./createCampaign"
import { CAMPAIGN_FACTORY_ADDRESSES, CAMPAIGN_FACTORY_ABI } from "./contracts";
import Link from "next/link";
import { parseEther } from 'viem';
import { NetworkBackground } from "./components/NetworkBackground";
import { Mail } from "lucide-react";
import { Footer } from "./components/Footer";

export default function Home() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const queryClient = useQueryClient();
  const factoryAddress = CAMPAIGN_FACTORY_ADDRESSES[chainId] || CAMPAIGN_FACTORY_ADDRESSES[31337];
  const [isCreating, setIsCreating] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { writeContract, data: hash } = useWriteContract();

  useEffect(() => {
    setMounted(true);
  }, []);

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
      console.log("Uploading metadata to IPFS...", { campaignName, campaignDescription });
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
      console.log("Uploaded to IPFS: ", metadataCID);
    } catch (e) {
      console.error("IPFS upload failed", e);
      // Fallback or alert user - for now we just log
      alert("Failed to upload campaign description to IPFS. Please try again.");
      setIsCreating(true); // Keep modal open
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
    <div className="relative min-h-screen">
      <NetworkBackground />

      <Header>
        <CampaignsDropdown />
        <Link href="/about" className="px-5 py-2.5 rounded-full bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-600 text-zinc-300 hover:text-white transition-all backdrop-blur-md">
          About
        </Link>
      </Header>

      <div className="relative z-10 max-w-5xl mx-auto px-8 py-32 text-center">
        <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 text-white drop-shadow-2xl">
          Decentralized Fundraising <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Reimagined
          </span>
        </h2>

        <div className="max-w-2xl mx-auto p-8">
          <p className="text-xl md:text-2xl font-light leading-relaxed text-zinc-300 mb-10">
            A platform for raising funds with automated vesting and milestone-based distribution. All decisions are powered by the backers.
          </p>

          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <Link
              href="/campaigns?status=fundraising"
              className="px-10 py-5 bg-zinc-100 hover:bg-white text-black text-xl font-bold rounded-full transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95"
            >
              Invest
            </Link>

            <div className="relative group/btn">
              {mounted && !isConnected && showTooltip && (
                <div className="absolute -top-14 left-1/2 -translate-x-1/2 px-4 py-2 bg-zinc-800/90 backdrop-blur-md border border-zinc-700/50 rounded-xl text-zinc-100 text-sm font-medium whitespace-nowrap shadow-xl animate-in fade-in zoom-in slide-in-from-bottom-2 duration-200 z-50">
                  Connect wallet first
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-800 border-r border-b border-zinc-700/50 rotate-45" />
                </div>
              )}
              <button
                className={`px-10 py-5 text-xl font-bold rounded-full transition-all active:scale-95 ${mounted && isConnected
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] hover:scale-105"
                  : "bg-zinc-800/40 text-zinc-500 border border-zinc-700/50 cursor-not-allowed opacity-60 backdrop-blur-sm"
                  }`}
                onClick={() => mounted && isConnected && setIsCreating(true)}
                onMouseEnter={() => mounted && !isConnected && setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                Start a Campaign
              </button>
            </div>
          </div>
        </div>
      </div>

      {isCreating && <CreateCampaign onCreate={onCreate} onCancel={() => setIsCreating(false)} />}
      {showSuccess && (
        <div className="fixed bottom-8 right-8 bg-green-900/40 border border-green-500/50 text-green-100 px-6 py-4 rounded-xl shadow-2xl backdrop-blur-md animate-fade-in-up">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <div className="font-semibold">Campaign created successfully!</div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
