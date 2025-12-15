'use client'

import { use, useState, useEffect } from "react";
import { useReadContract, useReadContracts, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { notFound } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { CAMPAIGN_ABI } from "../../contracts";
import Link from "next/link";
import { parseEther } from "viem"

export default function CampaignDetails({ params }: { params: Promise<{ address: string }> }) {
    const campaignAddress = (use(params)).address as `0x${string}`;

    const { address } = useAccount();

    const { data: campaignData, isLoading: isLoadingCampaignData, refetch: refetchCampaignData } = useReadContracts({
        contracts: [
            { address: campaignAddress, abi: CAMPAIGN_ABI, functionName: 'campaignTitle' },
            { address: campaignAddress, abi: CAMPAIGN_ABI, functionName: 'CAMPAIGN_GOAL' },
            { address: campaignAddress, abi: CAMPAIGN_ABI, functionName: 'CAMPAIGN_DURATION' },
            { address: campaignAddress, abi: CAMPAIGN_ABI, functionName: 'campaignStart' },
            { address: campaignAddress, abi: CAMPAIGN_ABI, functionName: 'campaignEnd' },
            { address: campaignAddress, abi: CAMPAIGN_ABI, functionName: 'OWNER' },
            { address: campaignAddress, abi: CAMPAIGN_ABI, functionName: 'totalDistributed' },
            { address: campaignAddress, abi: CAMPAIGN_ABI, functionName: 'totalRaised' },
            { address: campaignAddress, abi: CAMPAIGN_ABI, functionName: 'state' },
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
        totalRaised,
        campaignState
    ] = campaignData?.map(data => data.result) ?? []

    const isFundraising = campaignState === 0
    const isVesting = campaignState === 1

    console.log(campaignData)
    const { writeContract, isSuccess, data: hash } = useWriteContract();
    const [value, setValue] = useState("0.0");

    const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash: hash
    })

    useEffect(() => {
        refetchCampaignData()
    }, [isConfirmed]);

    useEffect(() => {
        setTrancheTitle('');
        setTrancheGoal('');
        setTrancheRecepient('');
    }, [isSuccess]);


    const [trancheTitle, setTrancheTitle] = useState('');
    const [trancheGoal, setTrancheGoal] = useState('');
    const [trancheRecepient, setTrancheRecepient] = useState('');

    const createTranche = () => {
        writeContract({
            address: campaignAddress,
            abi: CAMPAIGN_ABI,
            functionName: 'requestTranche',
            args: [trancheTitle, parseEther(trancheGoal), trancheRecepient as `0x${string}`]
        },)
    }

    if (isLoadingCampaignData) {
        return <div>Loading campaign details...</div>
    }

    if (!campaignTitle) {
        return notFound();
    }


    const fund = () => {
        writeContract({
            address: campaignAddress,
            abi: CAMPAIGN_ABI,
            functionName: 'fund',
            value: parseEther(value)
        })
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
            {isFundraising && <div>
                <h2 className="text-xl font-bold">Fundraising</h2>
                <h3 className="text-lg font-bold">Raised: {totalRaised}/{campaignGoal}</h3>
                <input placeholder="Enter summ(ETH)" value={value} onChange={(e) => setValue(e.target.value)} />
                <button onClick={fund}>Fund</button>
            </div>}
            {isVesting && <div>
                <h2 className="text-xl font-bold">Vesting</h2>
                <h3 className="text-lg font-bold">Distributed: {totalDistributed}/{campaignGoal}</h3>
                <h3 className="text-lg font-bold">Tranches panel</h3>
                {address === owner && <div>
                    <input placeholder="Tranche title" value={trancheTitle} onChange={(e) => setTrancheTitle(e.target.value)} />
                    <input placeholder="Tranche goal" value={trancheGoal} onChange={(e) => setTrancheGoal(e.target.value)} />
                    <input placeholder="Tranche recepient" value={trancheRecepient} onChange={(e) => setTrancheRecepient(e.target.value)} />
                    <button onClick={createTranche}>Create Tranche</button>
                </div>}
            </div>}
            {address === owner && <div>
                <h2 className="text-xl font-bold">Campaign Owner Panel</h2>
            </div>}
        </div>
    )
}