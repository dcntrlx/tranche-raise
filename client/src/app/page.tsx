'use client'

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useWriteContract } from 'wagmi';
import { useState } from "react";
import { CreateCampaign } from "./createCampaign"

export default function Home() {
  const { address } = useAccount();
  const [isCreating, setIsCreating] = useState(false);
  const onCreate = (campaignName: string, campaignGoal: string, campaignDuration: string) => { setIsCreating(false) }
  return (
    <div>
      <ConnectButton showBalance={true} />
      <h1>Tranche Raise</h1>
      <p>Tranche Raise is a platform for raising funds for campaigns</p>
      <p>{`Connected address: ${address}` || 'Not connected'}</p>
      {address && <button onClick={() => setIsCreating(true)}>Create Campaign</button>}
      {isCreating && <CreateCampaign onCreate={onCreate} />}
    </div>
  );
}
