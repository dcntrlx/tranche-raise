'use client'

import { useAccount, useReadContract, useReadContracts } from "wagmi";
import { CAMPAIGN_FACTORY_ADDRESS, CAMPAIGN_FACTORY_ABI, CAMPAIGN_ABI } from "../contracts";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { formatEther } from "viem";

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
            <h1>Campaigns</h1>
            {campaignsData?.map((campaign) => (
                <li>
                    <Link key={campaign.campaignAddress} href={`campaigns/${campaign.campaignAddress}`}>{campaign.campaignTitle}</Link>
                    {campaign.campaignState === 0 && <div>
                        <p>fundraising</p>
                        <p>goal: {campaign.campaignGoal ? formatEther(campaign.campaignGoal as bigint) : '0'} ETH</p>
                        <p>raised: {campaign.campaignRaised ? formatEther(campaign.campaignRaised as bigint) : '0'} ETH</p>
                        <p>ends: {(new Date(Number(campaign.campaignEnd) * 1000)).toLocaleString()}</p>
                    </div>}
                    {campaign.campaignState === 1 && <div>
                        <p>vesting</p>
                        <p>raised: {campaign.campaignRaised ? formatEther(campaign.campaignRaised as bigint) : '0'} ETH</p>
                        <p>goal: {campaign.campaignGoal ? formatEther(campaign.campaignGoal as bigint) : '0'} ETH</p>
                        <p>distributed: {campaign.campaignDistributed ? formatEther(campaign.campaignDistributed as bigint) : '0'} ETH</p>
                    </div>}
                    {campaign.campaignState === 2 && <div>
                        <p>finished</p>
                        <p>raised: {campaign.campaignRaised ? formatEther(campaign.campaignRaised as bigint) : '0'} ETH</p>
                        <p>goal: {campaign.campaignGoal ? formatEther(campaign.campaignGoal as bigint) : '0'} ETH</p>
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