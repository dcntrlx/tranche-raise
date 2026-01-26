'use client'

import { useReadContract, useReadContracts, useWriteContract, useWaitForTransactionReceipt, useChainId } from "wagmi";
import { use, useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { Header } from "../../components/Header";
import { useAccount } from "wagmi";
import { CAMPAIGN_ABI } from "../../contracts";
import Link from "next/link";
import { formatEther, parseEther } from "viem"

import { CountdownTimer } from "../../components/CountdownTimer";
import { ProgressBar } from "../../components/ProgressBar";
import { NetworkBackground } from "../../components/NetworkBackground";

export default function CampaignDetails({ params }: { params: Promise<{ address: string }> }) {
    const { address: addressStr } = use(params);
    const campaignAddress = addressStr as `0x${string}`;

    const { address } = useAccount();
    const queryClient = useQueryClient();

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
            { address: campaignAddress, abi: CAMPAIGN_ABI, functionName: 'metadataCID' },
            { address: campaignAddress, abi: CAMPAIGN_ABI, functionName: 'isCancelled' },
            { address: campaignAddress, abi: CAMPAIGN_ABI, functionName: 'cancelVotes' },
            { address: campaignAddress, abi: CAMPAIGN_ABI, functionName: 'votedToCancel', args: [address || '0x0000000000000000000000000000000000000000'] },
            { address: campaignAddress, abi: CAMPAIGN_ABI, functionName: 'backersRaises', args: [address || '0x0000000000000000000000000000000000000000'] },
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
        campaignState,
        metadataCID,
        isCancelledResult,
        cancelVotes,
        hasVotedToCancel,
        userInvestment
    ] = campaignData?.map(data => data.result) ?? []

    const isCancelled = isCancelledResult as boolean || false;

    // Match contract's floor-division math exactly
    const thresholdMet = cancelVotes !== undefined && totalRaised !== undefined && BigInt(totalRaised as bigint) > 0n && (BigInt(cancelVotes as bigint) >= (BigInt(totalRaised as bigint) * 60n) / 100n);
    const isFundraising = campaignState === 0;
    const isVesting = (campaignState === 1 || campaignState === 2) && !isCancelled && !thresholdMet;
    const isFinished = campaignState === 2 && !thresholdMet;
    const isRejected = campaignState === 3 || isCancelled || thresholdMet;

    // Proportional refund is available if rejected and user has skin in the game
    const canClaimRefund = isRejected && (userInvestment as bigint || 0n) > 0n;

    const { data: tranchesData, refetch: refetchTranchesData } = useReadContract({
        address: campaignAddress,
        abi: CAMPAIGN_ABI,
        functionName: 'getAllTranches'
    })

    const tranches = tranchesData ?? [];

    const { writeContract, data: hash } = useWriteContract();
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

    const revokeInvestment = () => {
        writeContract({
            address: campaignAddress,
            abi: CAMPAIGN_ABI,
            functionName: 'revokeFunds',
        })
    }

    const voteToCancelProject = () => {
        writeContract({
            address: campaignAddress,
            abi: CAMPAIGN_ABI,
            functionName: 'voteToCancel',
        })
    }

    const claimRefund = () => {
        writeContract({
            address: campaignAddress,
            abi: CAMPAIGN_ABI,
            functionName: 'refund',
        })
    }

    useEffect(() => {
        if (isConfirmed) {
            refetchCampaignData();
            refetchTranchesData();
            queryClient.invalidateQueries();
        }
    }, [isConfirmed, queryClient, refetchCampaignData, refetchTranchesData])

    const [description, setDescription] = useState<string | null>(null);

    useEffect(() => {
        if (metadataCID) {
            const usePinata = process.env.NEXT_PUBLIC_USE_PINATA === 'true';
            let url;
            if (usePinata) {
                url = `https://gateway.pinata.cloud/ipfs/${metadataCID}`;
            } else {
                // Local mock fetch
                url = `/ipfs/${metadataCID}.json`;
            }

            fetch(url)
                .then(res => res.json())
                .then(data => {
                    if (data.description) setDescription(data.description);
                })
                .catch(err => console.error("Failed to fetch IPFS metadata", err));
        }
    }, [metadataCID]);

    if (isLoadingCampaignData) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                    <span className="text-zinc-500 font-medium">Loading campaign details...</span>
                </div>
            </div>
        )
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

    const StatCard = ({ label, value, subValue, icon }: { label: string; value: string; subValue?: string; icon?: string }) => (
        <div className="glass p-6 rounded-3xl space-y-2">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">{label}</span>
            <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">{value}</span>
                {subValue && <span className="text-sm text-zinc-500 font-mono">{subValue}</span>}
            </div>
        </div>
    )

    return (
        <div className="relative min-h-screen">
            <NetworkBackground />

            {/* Header */}
            <Header>
                <Link href="/campaigns" className="px-5 py-2.5 rounded-full bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-600 text-zinc-300 hover:text-white transition-all backdrop-blur-md">
                    Back to Campaigns
                </Link>
            </Header>

            <div className="relative z-10 max-w-7xl mx-auto px-8 pb-32">
                {/* Hero Section */}
                <header className="mb-16 relative">
                    {/* Ambient Glow */}
                    <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                        <div className="max-w-3xl">
                            <div className="flex items-center gap-3 mb-6">
                                {isFundraising && <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-widest rounded-full border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]">Active Fundraising</span>}
                                {isVesting && <span className="px-3 py-1 bg-amber-500/10 text-amber-400 text-[10px] font-bold uppercase tracking-widest rounded-full border border-amber-500/20 shadow-[0_0_15px_rgba(251,191,36,0.1)]">Vesting Strategy</span>}
                                {isFinished && <span className="px-3 py-1 bg-zinc-500/10 text-zinc-400 text-[10px] font-bold uppercase tracking-widest rounded-full border border-zinc-500/20">Closed</span>}
                                {isRejected && <span className="px-3 py-1 bg-red-500/10 text-red-400 text-[10px] font-bold uppercase tracking-widest rounded-full border border-red-500/20">{isCancelled || thresholdMet ? "Cancelled" : "Failed"}</span>}
                                <span className="text-zinc-600 font-mono text-xs tracking-tight">{(campaignAddress as string)}</span>
                            </div>
                            <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-tight">
                                <span className={isFundraising ? "text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-blue-200" : "text-white"}>
                                    {campaignTitle as string}
                                </span>
                            </h2>
                            <p className="text-zinc-400 text-xl font-light leading-relaxed mb-8 max-w-2xl">
                                {description || (metadataCID ? "Fetching project description..." : "No project description provided.")}
                            </p>



                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Progress Panel */}
                        <section className="glass p-10 rounded-3xl space-y-8 border-white/5 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500/50 to-blue-500/50 opacity-20" />
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                    Capital Flow
                                    <span className="text-xs font-normal text-zinc-500 px-2 py-0.5 rounded-full border border-white/10">Live Analytics</span>
                                    <button
                                        onClick={() => {
                                            refetchCampaignData();
                                            refetchTranchesData();
                                        }}
                                        className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-600 hover:text-blue-400 transition-all active:rotate-180"
                                        title="Refresh Data"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                            <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.45a.75.75 0 000-1.5H4.5a.75.75 0 00-.75.75v3.75a.75.75 0 001.5 0v-2.109l.311.312a7 7 0 0011.707-4.914 1.25 1.25 0 00-2.5 0zM4.688 8.576a5.5 5.5 0 019.201-2.466l.312.311h-2.45a.75.75 0 000 1.5h3.75a.75.75 0 00.75-.75V3.5a.75.75 0 00-1.5 0v2.109l-.311-.312a7 7 0 00-11.707 4.914 1.25 1.25 0 002.5 0z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </h3>
                                <ProgressBar
                                    current={totalRaised ? BigInt(totalRaised as unknown as bigint) : 0n}
                                    total={isFundraising ? (campaignGoal ? BigInt(campaignGoal as unknown as bigint) : 0n) : (totalRaised ? BigInt(totalRaised as unknown as bigint) : 0n)}
                                    variant="blue"
                                    label="Fundraising Progress"
                                />
                                {isFundraising && campaignEnd && (
                                    <div className="flex items-center justify-between text-zinc-500 text-xs font-mono pt-4 border-t border-white/5">
                                        <span className="uppercase tracking-widest">Time Remaining</span>
                                        <div className="text-lg font-bold text-white"><CountdownTimer targetDate={campaignEnd as bigint} /></div>
                                    </div>
                                )}
                            </div>

                            {isVesting && (
                                <ProgressBar
                                    current={totalDistributed ? BigInt(totalDistributed as unknown as bigint) : 0n}
                                    total={totalRaised ? BigInt(totalRaised as unknown as bigint) : 0n}
                                    variant="gold"
                                    label="Total Distribution to Project"
                                />
                            )}

                            {isVesting && (address === owner || (userInvestment as bigint || 0n) === 0n) && (
                                <div className="pt-6 border-t border-white/5 space-y-3">
                                    <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                        <span>Community Cancellation Progress</span>
                                        <span className="text-zinc-400">Threshold: 60%</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-grow h-2 bg-zinc-950 rounded-full overflow-hidden border border-white/5">
                                            <div
                                                className="h-full bg-red-500/50 transition-all duration-1000"
                                                style={{ width: `${Math.min((Number(cancelVotes || 0n) / Number(totalRaised || 1n) * 100) / 0.6, 100)}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-bold text-white min-w-[3rem] text-right">
                                            {(Number(cancelVotes || 0n) / Number(totalRaised || 1n) * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-zinc-600 leading-tight italic">
                                        If this bar reaches 60% threshold, the project will be automatically cancelled by the community.
                                    </p>
                                </div>
                            )}
                            {isRejected && (
                                <div className="pt-6 border-t border-red-500/20 space-y-3">
                                    <div className="flex justify-between text-[10px] font-bold text-red-400 uppercase tracking-widest">
                                        <span>Project Status</span>
                                        <span>Cancelled by Community</span>
                                    </div>
                                    <div className="h-2 w-full bg-red-500 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <p className="text-[10px] text-zinc-400 italic flex-grow">
                                            Investors can now reclaim their proportional share of the remaining funds.
                                        </p>
                                        {(userInvestment as bigint || 0n) > 0n && (
                                            <button
                                                className="px-6 py-2.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 hover:text-green-300 border border-green-500/20 hover:border-green-500/40 font-bold text-xs rounded-xl transition-all shadow-[0_0_20px_rgba(74,222,128,0.1)] active:scale-95 shrink-0 uppercase tracking-wide"
                                                onClick={claimRefund}
                                            >
                                                Revoke funds
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* Tranches Section */}
                        <section className="space-y-6">
                            <div className="flex items-center justify-between px-2">
                                <h3 className="text-2xl font-bold text-white">Project Tranches</h3>
                                <span className="text-zinc-500 font-mono text-sm px-3 py-1 rounded-full bg-white/5 border border-white/5">{tranches.length} Requests</span>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                {tranches.map((tranche, index) => (
                                    <div key={tranche.trancheName} className="glass p-8 rounded-3xl hover:border-white/20 transition-all group relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-800/20 blur-[60px] rounded-full pointer-events-none group-hover:bg-zinc-700/20 transition-colors" />

                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 relative z-10">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h4 className="text-2xl font-bold text-white group-hover:text-cyan-100 transition-colors">{tranche.trancheName}</h4>
                                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${tranche.state === 1 ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]' :
                                                        tranche.state === 2 ? 'bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_10px_rgba(74,222,128,0.1)]' :
                                                            tranche.state === 3 ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                                'bg-zinc-800/50 text-zinc-500 border-zinc-700/50'
                                                        }`}>
                                                        {tranche.state === 1 ? "Voting Active" : tranche.state === 2 ? "Executed" : tranche.state === 3 ? "Rejected" : "Pending"}
                                                    </span>
                                                </div>
                                                <p className="text-zinc-500 font-mono text-xs flex items-center gap-2">
                                                    Recipient:
                                                    <span className="px-2 py-0.5 rounded-md bg-zinc-900 border border-white/5 text-zinc-400">
                                                        {(tranche.recepient as string)?.slice(0, 10)}...{(tranche.recepient as string)?.slice(-8)}
                                                    </span>
                                                </p>
                                            </div>
                                            <div className="text-left md:text-right">
                                                <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest block mb-1">Requested Amount</span>
                                                <span className="text-3xl font-bold text-white tracking-tight">{tranche.trancheAmount ? formatEther(tranche.trancheAmount as bigint) : '0'} <span className="text-lg font-medium opacity-50 text-cyan-200">ETH</span></span>
                                            </div>
                                        </div>

                                        {tranche.state === 1 && (
                                            <div className="bg-zinc-950/30 rounded-2xl p-6 space-y-6 border border-white/5 relative z-10">
                                                <div className="flex justify-between items-end">
                                                    <div className="space-y-2 w-full">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Community Consensus</span>
                                                            <span className="text-xs font-mono text-zinc-400">Voting Power Check</span>
                                                        </div>
                                                        <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden flex">
                                                            {/* Visual bar just for flavor since we don't have total token supply easily here, usually would be % of supply */}
                                                            <div className="h-full bg-green-500/50 w-1/2" />
                                                            <div className="h-full bg-red-500/50 w-1/4" />
                                                        </div>
                                                        <div className="flex items-baseline gap-4 pt-1">
                                                            <span className="text-green-400 font-bold flex items-center gap-2">
                                                                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
                                                                {tranche.votesFor ? formatEther(tranche.votesFor as bigint) : "0"} YES
                                                            </span>
                                                            <span className="text-zinc-600 text-xs text-opacity-50">|</span>
                                                            <span className="text-red-400 font-bold flex items-center gap-2">
                                                                <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(248,113,113,0.5)]" />
                                                                {tranche.votesAgainst ? formatEther(tranche.votesAgainst as bigint) : "0"} NO
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-4 pt-2">
                                                    <button
                                                        className="flex-1 h-12 bg-green-500/5 hover:bg-green-500/10 text-green-400 hover:text-green-300 border border-green-500/20 hover:border-green-500/40 rounded-xl transition-all font-bold text-sm uppercase tracking-wide hover:shadow-[0_0_20px_rgba(74,222,128,0.1)]"
                                                        onClick={() => voteTranche(BigInt(index), true)}
                                                    >
                                                        Approve Release
                                                    </button>
                                                    <button
                                                        className="flex-1 h-12 bg-red-500/5 hover:bg-red-500/10 text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 rounded-xl transition-all font-bold text-sm uppercase tracking-wide hover:shadow-[0_0_20px_rgba(248,113,113,0.1)]"
                                                        onClick={() => voteTranche(BigInt(index), false)}
                                                    >
                                                        Deny Release
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {tranche.state === 2 && (
                                            <div className="flex items-center gap-3 text-green-400/90 font-medium text-sm bg-green-500/5 px-4 py-3 rounded-xl border border-green-500/10 relative z-10">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.6)]" />
                                                Funds have been successfully released to the recipient.
                                            </div>
                                        )}
                                        {tranche.state === 3 && (
                                            <div className="flex items-center gap-3 text-red-400/90 font-medium text-sm bg-red-500/5 px-4 py-3 rounded-xl border border-red-500/10 relative z-10">
                                                <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                                                Community rejected this funding request.
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {tranches.length === 0 && (
                                    <div className="glass p-16 rounded-3xl text-center space-y-6 border-zinc-800/50 border-dashed">
                                        <div className="text-6xl opacity-20 filter grayscale">🗒️</div>
                                        <div className="space-y-2">
                                            <h4 className="text-lg font-bold text-zinc-300">No Tranches Requested</h4>
                                            <p className="text-zinc-500 max-w-sm mx-auto">This project hasn't requested any specific funding releases yet.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    <div className="space-y-8">
                        {isFundraising && (
                            <div className="glass p-8 rounded-3xl w-full space-y-6 border-blue-500/20 relative overflow-hidden group shadow-[0_0_50px_rgba(59,130,246,0.05)]">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[60px] rounded-full pointer-events-none" />

                                <div className="space-y-3 relative z-10">
                                    <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                        <span>Contribution</span>
                                        <span>ETH</span>
                                    </div>
                                    <div className="relative">
                                        <input
                                            className="w-full bg-zinc-950/50 border border-white/10 rounded-2xl px-6 py-4 text-2xl font-bold text-white focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-zinc-700 font-mono"
                                            placeholder="1.5"
                                            value={value}
                                            onChange={(e) => setValue(e.target.value)}
                                        />
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <span className="text-zinc-500 text-sm font-bold">ETH</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    className="w-full h-16 bg-blue-600 hover:bg-blue-500 text-white text-xl font-bold rounded-2xl transition-all shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:shadow-[0_0_40px_rgba(37,99,235,0.5)] active:scale-95 relative z-10 flex items-center justify-center gap-2 group-hover:gap-3"
                                    onClick={fund}
                                >
                                    Fund Campaign
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 transition-all">
                                        <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                                    </svg>
                                </button>

                                {(userInvestment as bigint) > 0n && (
                                    <button
                                        className="w-full py-4 text-zinc-500 hover:text-red-400 text-sm font-bold rounded-2xl transition-all border border-white/5 hover:border-red-500/20 hover:bg-red-500/5 active:scale-95"
                                        onClick={revokeInvestment}
                                    >
                                        Revoke My Investment ({formatEther(userInvestment as bigint)} ETH)
                                    </button>
                                )}
                            </div>
                        )}

                        {address === owner && !isFundraising && (
                            <section className="glass p-8 rounded-3xl border-blue-500/20 sticky top-12 shadow-[0_0_50px_rgba(59,130,246,0.05)] h-fit">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[50px] rounded-full pointer-events-none" />
                                <h3 className="text-xl font-bold text-white mb-6 relative z-10">Management Panel</h3>

                                {isVesting ? (
                                    <div className="space-y-6 relative z-10">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block ml-1">Tranche Goal/Title</label>
                                                <input className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-colors placeholder:text-zinc-700" placeholder="e.g. Q1 Marketing" value={trancheTitle} onChange={(e) => setTrancheTitle(e.target.value)} />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block ml-1">Amount (ETH)</label>
                                                    <input className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-colors placeholder:text-zinc-700" placeholder="0.5" value={trancheGoal} onChange={(e) => setTrancheGoal(e.target.value)} />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block ml-1">Recipient</label>
                                                    <input className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-colors placeholder:text-zinc-700 font-mono text-sm" placeholder="0x..." value={trancheRecepient} onChange={(e) => setTrancheRecepient(e.target.value)} />
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                                            onClick={createTranche}
                                        >
                                            <span className="text-lg">+</span> Request Tranche
                                        </button>
                                        <p className="text-[10px] text-zinc-500 text-center uppercase tracking-tighter">Only project owner can request tranches</p>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 space-y-4">
                                        <div className="text-2xl text-zinc-700">🔒</div>
                                        <p className="text-zinc-500 text-sm">Tranche management will unlock once the funding goal is met.</p>
                                    </div>
                                )}
                            </section>
                        )}

                        {isVesting && ((userInvestment as bigint || 0n) > 0n || address === owner) && (
                            <div className="glass p-8 rounded-3xl border-red-500/10 bg-red-500/5 space-y-6 relative overflow-hidden">
                                <div className="space-y-2 relative z-10">
                                    <h4 className="text-xl font-bold text-white flex items-center gap-2">
                                        Project Governance
                                        <span className="text-[10px] font-normal px-2 py-0.5 rounded-full border text-red-400 border-red-500/20">
                                            Critical Access
                                        </span>
                                    </h4>
                                    <p className="text-zinc-500 text-xs leading-relaxed">
                                        If the project is not delivering as promised, investors can vote to stop the funding.
                                    </p>
                                </div>

                                <div className="space-y-3 relative z-10">
                                    <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                        <span>Cancellation Progress</span>
                                        <span>{(Number(cancelVotes || 0n) / Number(totalRaised || 1n) * 100).toFixed(1)}% / 60%</span>
                                    </div>
                                </div>

                                <button
                                    className={`w-full py-4 font-bold rounded-xl transition-all active:scale-95 relative z-10 ${((userInvestment as bigint) === 0n && address !== owner)
                                        ? "bg-zinc-800 text-zinc-600 cursor-not-allowed border border-white/5"
                                        : hasVotedToCancel
                                            ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5"
                                            : "bg-red-600/20 hover:bg-red-500/40 text-red-400 border border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.1)]"
                                        }`}
                                    onClick={() => !hasVotedToCancel && ((userInvestment as bigint) > 0n || address === owner) && voteToCancelProject()}
                                    disabled={hasVotedToCancel as boolean || ((userInvestment as bigint) === 0n && address !== owner)}
                                >
                                    {((userInvestment as bigint) === 0n && address !== owner)
                                        ? "Only Investors Can Vote"
                                        : hasVotedToCancel
                                            ? "Voted to Stop"
                                            : "Vote to stop Project"}
                                </button>
                            </div>
                        )}

                        {!isFundraising && !isVesting && !isRejected && address !== owner && (
                            <div className="glass p-8 rounded-3xl text-center space-y-6 border-white/5 bg-gradient-to-b from-white/5 to-transparent">
                                <div>
                                    <h4 className="font-bold text-white text-xl mb-2">Fundraising Finished</h4>
                                    <p className="text-zinc-400 text-sm leading-relaxed max-w-sm mx-auto">
                                        Oops, this project seems to have already finished fundraising. But, you can find other fascinating projects to invest in.
                                    </p>
                                </div>
                                <Link
                                    href="/campaigns?status=fundraising"
                                    className="inline-block px-8 py-3 bg-zinc-100 hover:bg-white text-black font-bold rounded-full transition-all shadow-lg active:scale-95"
                                >
                                    Fundraising Campaigns
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}