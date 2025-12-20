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
            <div className="flex justify-between items-center mb-10 pt-4 px-4">
                <div className="flex items-center gap-6">
                    <h1 className="text-4xl font-bold">Active campaigns</h1>
                    <nav>
                        <Link href="/" className="px-4 py-2 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors inline-block">
                            Home
                        </Link>
                    </nav>
                </div>
                <ConnectButton showBalance={true} />
            </div>
            <div className="px-[3%]">
                {
                    campaignsData?.map((campaign) => (
                        <div key={campaign.campaignAddress} className="mb-4 bg-zinc-900 border border-zinc-800 p-6 rounded-xl hover:border-zinc-700 transition-colors">
                            <Link href={`campaigns/${campaign.campaignAddress}`} className="text-2xl font-bold hover:underline mb-4 block text-white">{campaign.campaignTitle}</Link>

                            <div className="flex flex-col gap-4">
                                {campaign.campaignState === 0 && <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="px-3 py-1 bg-blue-900/30 text-blue-400 text-sm font-medium rounded-full border border-blue-800/50">Fundraising</span>
                                        <span className="text-sm text-zinc-500 font-mono">
                                            Ends: {(new Date(Number(campaign.campaignEnd) * 1000)).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <ProgressBar current={campaign.campaignRaised ? BigInt(campaign.campaignRaised as unknown as bigint) : 0n} total={campaign.campaignGoal ? BigInt(campaign.campaignGoal as unknown as bigint) : 0n} variant="blue" label="Raised" />
                                    <div className="mt-2 text-sm text-zinc-400">
                                        <CountdownTimer targetDate={campaign.campaignEnd as unknown as bigint} />
                                    </div>
                                </div>}

                                {campaign.campaignState === 1 && <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="px-3 py-1 bg-amber-900/30 text-amber-400 text-sm font-medium rounded-full border border-amber-800/50">Vesting</span>
                                    </div>
                                    <ProgressBar
                                        current={campaign.campaignRaised ? BigInt(campaign.campaignRaised as unknown as bigint) : 0n}
                                        total={campaign.campaignGoal ? BigInt(campaign.campaignGoal as unknown as bigint) : 0n}
                                        variant="blue"
                                        overlayCurrent={campaign.campaignDistributed ? BigInt(campaign.campaignDistributed as unknown as bigint) : 0n}
                                        overlayVariant="gold"
                                        label="Distribution Progress"
                                    />
                                </div>}

                                {campaign.campaignState === 2 && <div>
                                    <div className="mb-2">
                                        <span className="px-3 py-1 bg-zinc-800 text-zinc-400 text-sm font-medium rounded-full">Finished</span>
                                    </div>
                                    <ProgressBar current={campaign.campaignRaised ? BigInt(campaign.campaignRaised as unknown as bigint) : 0n} total={campaign.campaignGoal ? BigInt(campaign.campaignGoal as unknown as bigint) : 0n} variant="blue" label="Total Raised" />
                                </div>}

                                {campaign.campaignState === 3 && <div>
                                    <div className="mb-2">
                                        <span className="px-3 py-1 bg-red-900/30 text-red-400 text-sm font-medium rounded-full border border-red-800/50">Rejected</span>
                                    </div>
                                    <p className="text-zinc-500">Goal was: {campaign.campaignGoal ? formatEther(campaign.campaignGoal as bigint) : '0'} ETH</p>
                                </div>}
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}