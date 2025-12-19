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
      <div className="flex justify-between items-center mb-8 pt-4">
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
      <p>Tranche Raise is a platform for raising funds for campaigns</p>
      <p>{`Connected address: ${address}` || 'Not connected'}</p>
      {address && <button className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-900 transition-colors" onClick={() => setIsCreating(true)}>Create Campaign</button>}
      {isCreating && <CreateCampaign onCreate={onCreate} />}
      {isSuccess && <p>Campaign created successfully</p>}
    </div>
  );
}
