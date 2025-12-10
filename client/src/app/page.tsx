'use client'

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useWriteContract } from 'wagmi';
import { useState } from "react";
import { CreateCampaign } from "./createCampaign"
import { CAMPAIGN_FACTORY_ADDRESS, CAMPAIGN_FACTORY_ABI } from "./contracts";

export default function Home() {
  const { address } = useAccount();
  const [isCreating, setIsCreating] = useState(false);
  const { writeContract, isSuccess } = useWriteContract();
  const onCreate = (campaignName: string, campaignGoal: string, campaignDuration: string) => {
    setIsCreating(false)
    writeContract({
      address: CAMPAIGN_FACTORY_ADDRESS,
      abi: CAMPAIGN_FACTORY_ABI,
      functionName: 'createCampaign',
      args: [campaignName, campaignGoal, campaignDuration]
    })
  }
  return (
    <div>
      <ConnectButton showBalance={true} />
      <h1>Tranche Raise</h1>
      <p>Tranche Raise is a platform for raising funds for campaigns</p>
      <p>{`Connected address: ${address}` || 'Not connected'}</p>
      {address && <button onClick={() => setIsCreating(true)}>Create Campaign</button>}
      {isCreating && <CreateCampaign onCreate={onCreate} />}
      {isSuccess && <p>Campaign created successfully</p>}
    </div>
  );
}
