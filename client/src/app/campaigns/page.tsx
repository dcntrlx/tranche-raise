'use client'

import { useAccount, useReadContract, useReadContracts } from "wagmi";
import { CAMPAIGN_FACTORY_ADDRESS, CAMPAIGN_FACTORY_ABI, CAMPAIGN_ABI } from "../contracts";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { formatEther } from "viem";
import { CountdownTimer } from "../components/CountdownTimer";
import { ProgressBar } from "../components/ProgressBar";

export default function Campaigns() {
    const { address } = useAccount();

    const { data: campaigns = [] } = useReadContract({
        address: CAMPAIGN_FACTORY_ADDRESS,
        abi: CAMPAIGN_FACTORY_ABI,
        functionName: 'getAllCampaigns'
    })

    const { data: campaignsFetchedStates } = useReadContracts({
        contracts: campaigns?.map((campaign) => ({
            address: campaign,
            abi: CAMPAIGN_ABI,
            functionName: 'state'
        })) || []
    })

    const { data: campaignsFetchedNames } = useReadContracts({
        contracts: campaigns?.map((campaign) => ({
            address: campaign,
            abi: CAMPAIGN_ABI,
            functionName: 'campaignTitle'
        })) || []
    })

    const { data: campaignsFetchedRaised } = useReadContracts({
        contracts: campaigns?.map((campaign) => ({
            address: campaign,
            abi: CAMPAIGN_ABI,
            functionName: 'totalRaised'
        })) || []
    })

    const { data: campaignsFetchedDistributed } = useReadContracts({
        contracts: campaigns?.map((campaign) => ({
            address: campaign,
            abi: CAMPAIGN_ABI,
            functionName: 'totalDistributed'
        })) || []
    })

    const { data: campaignsFetchedGoal } = useReadContracts({
        contracts: campaigns?.map((campaign) => ({
            address: campaign,
            abi: CAMPAIGN_ABI,
            functionName: 'CAMPAIGN_GOAL'
        })) || []
    })

    const { data: campaignsFetchedEnd } = useReadContracts({
        contracts: campaigns?.map((campaign) => ({
            address: campaign,
            abi: CAMPAIGN_ABI,
            functionName: 'campaignEnd'
        })) || []
    })

    const campaignsData = campaignsFetchedNames?.map((data, index) => ({
        campaignAddress: campaigns[index],
        campaignTitle: data.result,
        campaignState: campaignsFetchedStates?.[index].result,
        campaignRaised: campaignsFetchedRaised?.[index].result,
        campaignDistributed: campaignsFetchedDistributed?.[index].result,
        campaignGoal: campaignsFetchedGoal?.[index].result,
        campaignEnd: campaignsFetchedEnd?.[index].result,
    })) ?? []

    console.log(campaignsData);

    return (
        <div>
            <nav>
                <Link href="/">Home</Link>
            </nav>
            <ConnectButton showBalance={true} />
            <h1 className="text-4xl font-bold mb-8">Active campaigns</h1>
            {campaignsData?.map((campaign) => (
                <li className="mb-10">
                    <Link key={campaign.campaignAddress} href={`campaigns/${campaign.campaignAddress}`} className="text-2xl font-bold hover:underline mb-2 block">{campaign.campaignTitle}</Link>
                    {campaign.campaignState === 0 && <div>
                        <p className="mb-1">Fundraising</p>
                        <ProgressBar current={campaign.campaignRaised ? BigInt(campaign.campaignRaised as unknown as bigint) : 0n} total={campaign.campaignGoal ? BigInt(campaign.campaignGoal as unknown as bigint) : 0n} variant="blue" label="Raised" />
                        <p><CountdownTimer targetDate={campaign.campaignEnd as unknown as bigint} /></p>
                    </div>}
                    {campaign.campaignState === 1 && <div>
                        <p className="mb-1">Vesting</p>
                        <div className="mt-2">
                            <ProgressBar
                                current={campaign.campaignRaised ? BigInt(campaign.campaignRaised as unknown as bigint) : 0n}
                                total={campaign.campaignGoal ? BigInt(campaign.campaignGoal as unknown as bigint) : 0n}
                                variant="blue"
                                overlayCurrent={campaign.campaignDistributed ? BigInt(campaign.campaignDistributed as unknown as bigint) : 0n}
                                overlayVariant="gold"
                                label="Distribution"
                            />
                        </div>
                    </div>}
                    {campaign.campaignState === 2 && <div>
                        <p>Finished</p>
                        <ProgressBar current={campaign.campaignRaised ? BigInt(campaign.campaignRaised as unknown as bigint) : 0n} total={campaign.campaignGoal ? BigInt(campaign.campaignGoal as unknown as bigint) : 0n} variant="blue" label="Total Raised" />
                    </div>}
                    {campaign.campaignState === 3 && <div>
                        <p>rejected</p>
                        <p>goal: {campaign.campaignGoal ? formatEther(campaign.campaignGoal as bigint) : '0'} ETH</p>
                    </div>}
                </li>
            ))}
        </div>
    )
}