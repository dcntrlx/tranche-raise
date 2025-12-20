'use client'

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useWriteContract } from 'wagmi';
import { useState } from "react";
import { CreateCampaign } from "./createCampaign"
import { CAMPAIGN_FACTORY_ADDRESS, CAMPAIGN_FACTORY_ABI } from "./contracts";
import Link from "next/link";
import { parseEther } from 'viem';

export default function Home() {
  const { address } = useAccount();
  const [isCreating, setIsCreating] = useState(false);
  const { writeContract, isSuccess } = useWriteContract();
  const onCreate = (campaignName: string, campaignGoal: string, campaignDurationInput: string) => {
    setIsCreating(false)
    const duration = BigInt(campaignDurationInput) * 86400n
    writeContract({
      address: CAMPAIGN_FACTORY_ADDRESS,
      abi: CAMPAIGN_FACTORY_ABI,
      functionName: 'createCampaign',
      args: [campaignName, parseEther(campaignGoal), duration]
    })
  }
  return (
    <div>
      <div className="flex justify-between items-center mb-8 pt-4 px-4">
        <div className="flex items-center gap-6">
          <h1 className="text-4xl font-bold">Tranche Raise</h1>
          <nav>
            <Link href="/campaigns" className="px-4 py-2 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors inline-block">
              Campaigns
            </Link>
          </nav>
        </div>
        <ConnectButton showBalance={true} />
      </div>
      <div className="max-w-5xl mx-auto px-8 py-24 text-center">
        <p className="text-xl md:text-2xl font-medium leading-tight text-zinc-400 mb-12">
          Tranche Raise is a platform for raising funds for campaigns and their future distribution during the campaign's vesting period where all decisions are made by backers
        </p>

        {address && (
          <button
            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white text-lg font-bold rounded-xl transition-all shadow-lg hover:shadow-blue-500/30"
            onClick={() => setIsCreating(true)}
          >
            Create Campaign
          </button>
        )}
      </div>

      {isCreating && <CreateCampaign onCreate={onCreate} onCancel={() => setIsCreating(false)} />}
      {isSuccess && (
        <div className="fixed bottom-8 right-8 bg-green-900/90 border border-green-500 text-green-100 px-6 py-4 rounded-xl shadow-2xl backdrop-blur-sm animate-fade-in-up">
          <div className="flex items-center gap-3">
            <div className="font-semibold">Campaign created successfully!</div>
          </div>
        </div>
      )}
    </div>
  );
}
