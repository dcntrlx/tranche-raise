'use client'

import { use } from "react";
import { useReadContract, useReadContracts } from "wagmi";
import { notFound } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { CAMPAIGN_ABI } from "../../contracts";
import Link from "next/link";

export default function CampaignDetails({ params }: { params: Promise<{ address: string }> }) {
    const campaignAddress = (use(params)).address as `0x${string}`;

    const { address } = useAccount();

    const { data: campaignData, isLoading: isLoadingCampaignData } = useReadContracts({
        contracts: [
            { address: campaignAddress, abi: CAMPAIGN_ABI, functionName: 'campaignTitle' },
            { address: campaignAddress, abi: CAMPAIGN_ABI, functionName: 'CAMPAIGN_GOAL' },
            { address: campaignAddress, abi: CAMPAIGN_ABI, functionName: 'CAMPAIGN_DURATION' },
            { address: campaignAddress, abi: CAMPAIGN_ABI, functionName: 'campaignStart' },
            { address: campaignAddress, abi: CAMPAIGN_ABI, functionName: 'campaignEnd' },
            { address: campaignAddress, abi: CAMPAIGN_ABI, functionName: 'OWNER' },
            { address: campaignAddress, abi: CAMPAIGN_ABI, functionName: 'totalDistributed' },
            { address: campaignAddress, abi: CAMPAIGN_ABI, functionName: 'totalRaised' },
        ]
    })

    const [
        campaignTitle,
        campaignGoal,
        campaignDuration,
        campaignStart,
        campaignEnd,
        owner,
        totalDistributed,
        totalRaised
    ] = campaignData?.map(data => data.result) ?? []

    console.log(campaignData)
    if (isLoadingCampaignData) {
        return <div>Loading campaign details...</div>
    }

    if (!campaignTitle) {
        return notFound();
    }

    return (
        <div>
            <nav>
                <Link href="/">Home</Link>
                <Link href="/campaigns">Campaigns</Link>
            </nav>
            <ConnectButton showBalance={true} />
            <h2 className="text-xl font-bold">Campaign Details:</h2>
            <p>campaignTitle: {campaignTitle}</p>
            <p>campaignGoal: {campaignGoal}</p>
            <p>campaignDuration: {campaignDuration}</p>
            <p>campaignStart: {(new Date(Number(campaignStart) * 1000)).toLocaleString()}</p>
            <p>campaignEnd: {(new Date(Number(campaignEnd) * 1000)).toLocaleString()}</p>
            <p>owner: {owner}</p>
            <p>totalDistributed: {totalDistributed}</p>
            <p>totalRaised: {totalRaised}</p>
            {address === owner && <div>
                <h2 className="text-xl font-bold">Campaign Owner Panel</h2>
            </div>}
        </div>
    )
}