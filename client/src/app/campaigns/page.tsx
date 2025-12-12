'use client'

import { useAccount, useReadContract } from "wagmi";
import { CAMPAIGN_FACTORY_ADDRESS, CAMPAIGN_FACTORY_ABI } from "../contracts";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";

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
            <nav>
                <Link href="/">Home</Link>
            </nav>
            <ConnectButton showBalance={true} />
            <h1>Campaigns</h1>
            {campaigns?.map((campaign) => (
                <Link key={campaign} href={`campaigns/${campaign}`}>{campaign}</Link>
            ))}
        </div>
    )
}