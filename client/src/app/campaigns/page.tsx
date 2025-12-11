'use client'

import { useAccount, useReadContract } from "wagmi";
import { CAMPAIGN_FACTORY_ADDRESS, CAMPAIGN_FACTORY_ABI } from "../contracts";

export default function Campaigns() {
    const { address } = useAccount();

    const { data: campaigns = [] } = useReadContract({
        address: CAMPAIGN_FACTORY_ADDRESS,
        abi: CAMPAIGN_FACTORY_ABI,
        functionName: 'getAllCampaigns'
    })



    console.log(campaigns)
    return (
        <div>
            <h1>Campaigns</h1>
            {campaigns?.map((campaign) => (
                <p key={campaign}>{campaign}</p>
            ))}
        </div>
    )
}