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
            <div className="flex justify-between items-center mb-8 pt-4 px-4">
                <div className="flex items-center gap-6">
                    <h1 className="text-4xl font-bold">Campaign: {campaignTitle}</h1>
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
            <div className="px-[3%]">
                <div className="flex flex-wrap gap-x-12 gap-y-4 mb-8 pb-8 border-b border-zinc-800 items-baseline">
                    <div>
                        <span className="text-zinc-500 mr-2">Goal</span>
                        <span className="text-xl font-bold text-white">{formatEther(campaignGoal)} ETH</span>
                    </div>
                    <div>
                        <span className="text-zinc-500 mr-2">Raised</span>
                        <span className="text-xl font-bold text-white">{totalRaised ? formatEther(totalRaised as bigint) : "0"} ETH</span>
                    </div>
                    <div>
                        <span className="text-zinc-500 mr-2">Distributed</span>
                        <span className="text-xl font-bold text-white">{totalDistributed ? formatEther(totalDistributed as bigint) : "0"} ETH</span>
                    </div>
                    <div>
                        <span className="text-zinc-500 mr-2">Duration</span>
                        <span className="text-xl font-bold text-white">{(Number(campaignDuration) / 86400).toFixed(0)} Days</span>
                    </div>
                    <div>
                        <span className="text-zinc-500 mr-2">Start</span>
                        <span className="text-white font-medium">{campaignStart ? (new Date(Number(campaignStart) * 1000)).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <div>
                        <span className="text-zinc-500 mr-2">End</span>
                        <span className="text-white font-medium">{campaignEnd ? (new Date(Number(campaignEnd) * 1000)).toLocaleDateString() : 'N/A'}</span>
                        {isFundraising && campaignEnd && <span className="ml-2 text-blue-400 font-mono text-sm"><CountdownTimer targetDate={campaignEnd as bigint} /></span>}
                    </div>
                    <div>
                        <span className="text-zinc-500 mr-2">Owner</span>
                        <span className="font-mono text-zinc-400 text-sm">{(owner as string)?.slice(0, 6)}...{(owner as string)?.slice(-4)}</span>
                    </div>
                </div>

                {isFundraising && <div>
                    <h2 className="text-xl font-bold mb-2">Fundraising</h2>
                    <ProgressBar current={totalRaised ? BigInt(totalRaised as unknown as bigint) : 0n} total={campaignGoal ? BigInt(campaignGoal as unknown as bigint) : 0n} variant="blue" label="Raised" />
                    <div className="flex gap-2 mt-4 max-w-md">
                        <input className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white flex-1" placeholder="Amount (ETH)" value={value} onChange={(e) => setValue(e.target.value)} />
                        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-500 transition-colors font-bold" onClick={fund}>Fund</button>
                    </div>
                </div>}

                {isVesting && <div>
                    <div className="flex items-center gap-4 mb-2">
                        <h2 className="text-xl font-bold">Vesting Status</h2>
                        <span className="px-3 py-1 bg-amber-900/30 text-amber-400 text-xs font-bold rounded-full border border-amber-800/50">ACTIVE</span>
                    </div>
                    <ProgressBar
                        current={totalDistributed ? BigInt(totalDistributed as unknown as bigint) : 0n}
                        total={totalRaised ? BigInt(totalRaised as unknown as bigint) : 0n}
                        variant="gold"
                        label="Distribution Progress"
                    />
                    <h3 className="text-lg font-bold">Tranches panel</h3>
                    <div className="flex flex-col gap-4">
                        {tranches.map((tranche, index) =>
                            <div key={tranche.trancheName} className="mb-4 bg-zinc-900 border border-zinc-800 p-6 rounded-xl hover:border-zinc-700 transition-colors">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 className="text-xl font-bold text-white mb-1">{tranche.trancheName}</h4>
                                        <p className="text-sm text-zinc-500 font-mono">To: {tranche.recepient}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${tranche.state === 1 ? 'bg-blue-900/30 text-blue-400 border-blue-800/50' :
                                            tranche.state === 2 ? 'bg-green-900/30 text-green-400 border-green-800/50' :
                                                tranche.state === 3 ? 'bg-red-900/30 text-red-400 border-red-800/50' :
                                                    'bg-zinc-800 text-zinc-400 border-zinc-700'
                                            }`}>
                                            {tranche.state === 1 ? "Voting" : tranche.state === 2 ? "Executed" : tranche.state === 3 ? "Rejected" : "Pending"}
                                        </span>
                                        <p className="font-bold text-white mt-2 text-lg">{tranche.trancheAmount ? formatEther(tranche.trancheAmount as bigint) : '0'} ETH</p>
                                    </div>
                                </div>

                                {tranche.state === 1 && <div className="mt-4 pt-4 border-t border-zinc-800">
                                    <div className="flex justify-between text-sm text-zinc-400 mb-4">
                                        <span>Votes For: <span className="text-green-400">{tranche.votesFor ? formatEther(tranche.votesFor as bigint) : "0"}</span></span>
                                        <span>Votes Against: <span className="text-red-400">{tranche.votesAgainst ? formatEther(tranche.votesAgainst as bigint) : "0"}</span></span>
                                    </div>
                                    <div className="flex gap-3">
                                        <button className="flex-1 bg-green-900/20 text-green-400 border border-green-900/50 px-4 py-2 rounded-lg hover:bg-green-900/40 transition-colors font-medium" onClick={() => voteTranche(BigInt(index), true)}>Vote For</button>
                                        <button className="flex-1 bg-red-900/20 text-red-400 border border-red-900/50 px-4 py-2 rounded-lg hover:bg-red-900/40 transition-colors font-medium" onClick={() => voteTranche(BigInt(index), false)}>Vote Against</button>
                                    </div>
                                </div>}
                                {tranche.state === 2 && <div className="mt-2 text-green-500 text-sm">Tranche executed successfully</div>}
                                {tranche.state === 3 && <div className="mt-2 text-red-500 text-sm">Tranche rejected by community</div>}
                            </div>
                        )}
                    </div>
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
        </div>
    )
}