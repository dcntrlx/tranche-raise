'use client'

import { use } from "react";
import { useReadContract } from "wagmi";
import { notFound } from "next/navigation";

import { CAMPAIGN_ABI } from "../../contracts";

export default function CampaignDetails({ params }: { params: Promise<{ address: string }> }) {
    const address = (use(params)).address as `0x${string}`;

    const { data: campaignTitle, isLoading: isLoadingCampaignTitle } = useReadContract({
        address,
        abi: CAMPAIGN_ABI,
        functionName: 'campaignTitle'
    })

    if (isLoadingCampaignTitle) {
        return <div>Loading campaign details...</div>
    }

    if (!campaignTitle) {
        return notFound();
    }

    return (
        <div>
            <h1>Campaign Details:</h1>
            <p>{campaignTitle}</p>
            <p>{address}</p>
        </div>
    )
}