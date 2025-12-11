'use client'

import { use } from "react";
import { useReadContract, useReadContracts } from "wagmi";
import { notFound } from "next/navigation";

import { CAMPAIGN_ABI } from "../../contracts";

export default function CampaignDetails({ params }: { params: Promise<{ address: string }> }) {
    const address = (use(params)).address as `0x${string}`;

    const { data: campaignData, isLoading: isLoadingCampaignData } = useReadContracts({
        contracts: [
            { address, abi: CAMPAIGN_ABI, functionName: 'campaignTitle' },
            { address, abi: CAMPAIGN_ABI, functionName: 'CAMPAIGN_GOAL' },
            { address, abi: CAMPAIGN_ABI, functionName: 'CAMPAIGN_DURATION' },
            { address, abi: CAMPAIGN_ABI, functionName: 'campaignStart' },
            { address, abi: CAMPAIGN_ABI, functionName: 'campaignEnd' },
            { address, abi: CAMPAIGN_ABI, functionName: 'OWNER' },
            { address, abi: CAMPAIGN_ABI, functionName: 'totalDistributed' },
            { address, abi: CAMPAIGN_ABI, functionName: 'totalRaised' },
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
            <h1>Campaign Details:</h1>
            <p>campaignTitle: {campaignTitle}</p>
            <p>campaignGoal: {campaignGoal}</p>
            <p>campaignDuration: {campaignDuration}</p>
            <p>campaignStart: {campaignStart}</p>
            <p>campaignEnd: {campaignEnd}</p>
            <p>owner: {owner}</p>
            <p>totalDistributed: {totalDistributed}</p>
            <p>totalRaised: {totalRaised}</p>
        </div>
    )
}