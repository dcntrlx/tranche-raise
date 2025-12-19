'use client'

import { use, useState, useEffect } from "react";
import { useReadContract, useReadContracts, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { notFound } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { CAMPAIGN_ABI } from "../../contracts";
import Link from "next/link";
import { formatEther, parseEther, parseUnits } from "viem"

import { CountdownTimer } from "../../components/CountdownTimer";
import { ProgressBar } from "../../components/ProgressBar";

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
    const isFinished = campaignState === 2
    const isRejected = campaignState === 3

    const { data: tranchesData, refetch: refetchTranchesData, error: tranchesError } = useReadContract({
        address: campaignAddress,
        abi: CAMPAIGN_ABI,
        functionName: 'getAllTranches'
    })

    console.log(tranchesError);
    const tranches = tranchesData ?? [];

    const { writeContract, isSuccess, data: hash, error: writeError } = useWriteContract();
    const [value, setValue] = useState("0.0");

    const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash: hash
    })

    useEffect(() => {
        setTrancheTitle('');
        setTrancheGoal('');
        setTrancheRecepient('');

        refetchTranchesData();
    }, [isConfirmed]);


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

    const voteTranche = (_trancheIndex: bigint, _voteFor: boolean) => {
        writeContract({
            address: campaignAddress,
            abi: CAMPAIGN_ABI,
            functionName: "voteForTranche",
            args: [_trancheIndex, _voteFor]
        })
    }

    useEffect(() => {
        refetchCampaignData();
    }, [isConfirmed])

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
            <div className="flex justify-between items-center mb-8 pt-4">
                <div className="flex items-center gap-6">
                    <h2 className="text-xl font-bold">Campaign: {campaignTitle}</h2>
                    <nav className="flex gap-4">
                        <Link href="/" className="px-4 py-2 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors inline-block">
                            Home
                        </Link>
                        <Link href="/campaigns" className="px-4 py-2 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors inline-block">
                            Campaigns
                        </Link>
                    </nav>
                </div>
                <ConnectButton showBalance={true} />
            </div>
            <p>Goal: {formatEther(campaignGoal)}</p>
            <p>Duration: {campaignDuration}</p>
            <p>Start: {campaignStart ? (new Date(Number(campaignStart) * 1000)).toLocaleString() : 'N/A'}</p>
            <p>End: {campaignEnd ? (new Date(Number(campaignEnd) * 1000)).toLocaleString() : 'N/A'} {isFundraising && campaignEnd && <span className="ml-2">(<CountdownTimer targetDate={campaignEnd as bigint} />)</span>}</p>
            <p>Owner: {owner}</p>
            <p>totalDistributed: {totalDistributed ? formatEther(totalDistributed as bigint) : "0"} ETH</p>
            <p>totalRaised: {totalRaised ? formatEther(totalRaised as bigint) : "0"} ETH</p>
            {isFundraising && <div>
                <h2 className="text-xl font-bold mb-2">Fundraising</h2>
                <ProgressBar current={totalRaised ? BigInt(totalRaised as unknown as bigint) : 0n} total={campaignGoal ? BigInt(campaignGoal as unknown as bigint) : 0n} variant="blue" label="Raised" />
                <input placeholder="Enter summ(ETH)" value={value} onChange={(e) => setValue(e.target.value)} />
                <button className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-900 transition-colors mt-2" onClick={fund}>Fund</button>
            </div>}
            {isVesting && <div>
                <h2 className="text-xl font-bold mb-2">Vesting</h2>
                <ProgressBar
                    current={totalRaised ? BigInt(totalRaised as unknown as bigint) : 0n}
                    total={campaignGoal ? BigInt(campaignGoal as unknown as bigint) : 0n}
                    variant="blue"
                    overlayCurrent={totalDistributed ? BigInt(totalDistributed as unknown as bigint) : 0n}
                    overlayVariant="gold"
                    label="Distribution Progress"
                />
                <h3 className="text-lg font-bold">Tranches panel</h3>
                <ul>
                    {tranches.map((tranche, index) =>
                        <li key={tranche.trancheName}>
                            <h4 className="text-lg font-bold">Tranche name: {tranche.trancheName}</h4>
                            <p>Tranche recepient: {tranche.recepient}</p>
                            <p>Tranche amount: {tranche.trancheAmount ? formatEther(tranche.trancheAmount as bigint) : "0"} ETH</p>
                            {tranche.state === 1 && <div>
                                <p>Tranche votes for: {tranche.votesFor ? formatEther(tranche.votesFor as bigint) : "0"}</p>
                                <p>Tranche votes against: {tranche.votesAgainst ? formatEther(tranche.votesAgainst as bigint) : "0"}</p>
                                <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors mr-2" onClick={() => voteTranche(BigInt(index), true)}>Vote for</button>
                                <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors" onClick={() => voteTranche(BigInt(index), false)}>Vote against</button>
                            </div>
                            }
                            {tranche.state === 2 && <p>Tranche executed</p>}
                            {tranche.state === 3 && <p>Tranche rejected</p>}
                        </li>
                    )}
                </ul>
                {address === owner && <div>
                    <input placeholder="Tranche title" value={trancheTitle} onChange={(e) => setTrancheTitle(e.target.value)} />
                    <input placeholder="Tranche goal" value={trancheGoal} onChange={(e) => setTrancheGoal(e.target.value)} />
                    <input placeholder="Tranche recepient" value={trancheRecepient} onChange={(e) => setTrancheRecepient(e.target.value)} />
                    <button className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-900 transition-colors mt-2" onClick={createTranche}>Create Tranche</button>
                </div>}
            </div>}
            {isFinished && <div>
                <h2 className="text-xl font-bold">Campaign finished</h2>
            </div>}
            {isRejected && <div>
                <h2 className="text-xl font-bold">Campaign rejected</h2>
            </div>}
            {address === owner && <div>
                <h2 className="text-xl font-bold">Campaign Manager Panel</h2>
            </div>}
        </div>
    )
}