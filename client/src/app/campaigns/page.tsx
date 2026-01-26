'use client'

import { useAccount, useReadContract, useReadContracts, useChainId } from "wagmi";
import { CAMPAIGN_FACTORY_ADDRESSES, CAMPAIGN_FACTORY_ABI, CAMPAIGN_ABI } from "../contracts";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import { CampaignsDropdown } from "../components/CampaignsDropdown";
import { Header } from "../components/Header";
import { formatEther } from "viem";
import { CountdownTimer } from "../components/CountdownTimer";
import { ProgressBar } from "../components/ProgressBar";
import { useNativeToken } from "../hooks/useNativeToken";

import { NetworkBackground } from "../components/NetworkBackground";

export default function Campaigns() {
    return (
        <Suspense>
            <CampaignsContent />
        </Suspense>
    )
}

function CampaignsContent() {
    const { address } = useAccount();
    const chainId = useChainId();
    const factoryAddress = CAMPAIGN_FACTORY_ADDRESSES[chainId] || CAMPAIGN_FACTORY_ADDRESSES[31337];
    const tokenSymbol = useNativeToken();
    const searchParams = useSearchParams();
    const statusFilter = searchParams.get('status');
    const ownerFilter = searchParams.get('owner');
    const backerFilter = searchParams.get('backer');

    const { data: campaigns = [] } = useReadContract({
        address: factoryAddress,
        abi: CAMPAIGN_FACTORY_ABI,
        functionName: 'getAllCampaigns'
    })

    const { data: campaignsDataRaw, isLoading: isLoadingCampaigns } = useReadContracts({
        contracts: campaigns?.flatMap((campaign) => [
            { address: campaign, abi: CAMPAIGN_ABI, functionName: 'campaignTitle' },
            { address: campaign, abi: CAMPAIGN_ABI, functionName: 'state' },
            { address: campaign, abi: CAMPAIGN_ABI, functionName: 'totalRaised' },
            { address: campaign, abi: CAMPAIGN_ABI, functionName: 'totalDistributed' },
            { address: campaign, abi: CAMPAIGN_ABI, functionName: 'CAMPAIGN_GOAL' },
            { address: campaign, abi: CAMPAIGN_ABI, functionName: 'campaignEnd' },
            { address: campaign, abi: CAMPAIGN_ABI, functionName: 'metadataCID' },
            { address: campaign, abi: CAMPAIGN_ABI, functionName: 'isCancelled' },
            { address: campaign, abi: CAMPAIGN_ABI, functionName: 'OWNER' },
        ]) || []
    })

    const { data: backerDataRaw } = useReadContracts({
        contracts: backerFilter ? campaigns?.map((campaign) => ({
            address: campaign,
            abi: CAMPAIGN_ABI,
            functionName: 'backersRaises',
            args: [backerFilter as `0x${string}`]
        })) || [] : []
    })

    const campaignsData = campaigns?.map((campaign, index) => {
        const offset = index * 9;
        return {
            campaignAddress: campaign,
            campaignTitle: campaignsDataRaw?.[offset]?.result,
            campaignState: campaignsDataRaw?.[offset + 1]?.result,
            campaignRaised: campaignsDataRaw?.[offset + 2]?.result,
            campaignDistributed: campaignsDataRaw?.[offset + 3]?.result,
            campaignGoal: campaignsDataRaw?.[offset + 4]?.result,
            campaignEnd: campaignsDataRaw?.[offset + 5]?.result,
            metadataCID: campaignsDataRaw?.[offset + 6]?.result,
            isCancelled: campaignsDataRaw?.[offset + 7]?.result,
            owner: campaignsDataRaw?.[offset + 8]?.result,
            backerContribution: backerDataRaw?.[index]?.result,
        };
    }) || [];

    const filteredCampaigns = campaignsData.filter(campaign => {
        // Filter by owner
        if (ownerFilter) {
            return campaign.owner?.toString().toLowerCase() === ownerFilter.toLowerCase();
        }

        // Filter by backer (user has contributed)
        if (backerFilter) {
            const contribution = campaign.backerContribution as bigint | undefined;
            return contribution !== undefined && contribution > 0n;
        }

        // Filter by status
        if (!statusFilter) return true;

        const state = Number(campaign.campaignState);
        // 0: Fundraising, 1: Vesting, 2: Finished, 3: Rejected
        if (statusFilter === 'fundraising') return state === 0;
        if (statusFilter === 'vesting') return state === 1;
        if (statusFilter === 'finished') return state === 2;
        if (statusFilter === 'failed') return state === 3;

        return true;
    });

    const getTitle = () => {
        if (ownerFilter) return 'My';
        if (backerFilter) return 'Backed';
        if (statusFilter === 'fundraising') return 'Fundraising';
        if (statusFilter === 'vesting') return 'Vesting';
        if (statusFilter === 'finished') return 'Finished';
        if (statusFilter === 'failed') return 'Failed';
        return 'All';
    }

    // Fetch descriptions
    const [descriptions, setDescriptions] = useState<Record<string, string>>({});

    useEffect(() => {
        const fetchDescriptions = async () => {
            const newDescriptions: Record<string, string> = {};
            const usePinata = process.env.NEXT_PUBLIC_USE_PINATA === 'true';

            // Only fetch for campaigns that have a CID and we haven't fetched yet
            const promises = campaignsData.map(async (campaign) => {
                const cid = campaign.metadataCID as string;
                if (cid && !descriptions[cid]) {
                    try {
                        let url;
                        if (usePinata) {
                            url = `https://gateway.pinata.cloud/ipfs/${cid}`;
                        } else {
                            // Local mock fetch
                            url = `/ipfs/${cid}.json`;
                        }

                        const res = await fetch(url);
                        if (res.ok) {
                            const data = await res.json();
                            if (data.description) {
                                newDescriptions[cid] = data.description;
                            }
                        }
                    } catch (e) {
                        console.error("Failed to fetch description for", cid, e);
                    }
                }
            });

            await Promise.all(promises);

            if (Object.keys(newDescriptions).length > 0) {
                setDescriptions(prev => ({ ...prev, ...newDescriptions }));
            }
        };

        if (campaignsData.length > 0) {
            fetchDescriptions();
        }
    }, [campaignsData]); // Dependency could be refined to avoid loops, but campaignsData changes when data loads

    const getDescription = () => {
        if (ownerFilter) return "Campaigns you have created. Track their progress and manage tranches.";
        if (backerFilter) return "Campaigns you have invested in. Monitor your contributions and vote on tranches.";
        if (statusFilter === 'failed') return "These ideas haven't found enough attention or was cancelled by community. Maybe you can improve these ideas?";
        if (statusFilter === 'finished') return "These ideas have successfully finished. You can find your inspiration here.";
        if (statusFilter === 'vesting') return "These ideas found their investors. Now we are closely watching them become reality.";
        return "Browse ideas currently fundraising and calmly back those you believe in. Your funds are protected by the milestone-based funds distribution process.";
    }

    return (
        <div className="relative min-h-screen">
            <NetworkBackground />

            <Header>
                <CampaignsDropdown />
                <Link href="/about" className="px-5 py-2.5 rounded-full bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-600 text-zinc-300 hover:text-white transition-all backdrop-blur-md">
                    About
                </Link>
            </Header>

            <div className="relative z-10 max-w-7xl mx-auto px-8">
                <header className="mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
                        {getTitle()} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Campaigns</span>
                    </h2>
                    <p className="text-zinc-400 max-w-2xl text-lg">
                        {getDescription()}
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-24">
                    {filteredCampaigns?.map((campaign) => (
                        <div key={campaign.campaignAddress} className="group relative glass glass-hover p-8 rounded-3xl overflow-hidden flex flex-col h-full transform transition-all duration-300 hover:-translate-y-2">
                            {/* Glow Effect */}
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 blur-[80px] group-hover:bg-blue-500/20 transition-all duration-500" />

                            <div className="flex justify-between items-start mb-6">
                                <Link
                                    href={`campaigns/${campaign.campaignAddress}`}
                                    className="text-2xl font-bold text-white hover:text-cyan-400 transition-colors leading-tight line-clamp-2 pr-4"
                                >
                                    {campaign.campaignTitle as string}
                                </Link>

                                {campaign.campaignState === 0 && (
                                    <span className="shrink-0 px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-widest rounded-full border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                                        Fundraising
                                    </span>
                                )}
                                {campaign.campaignState === 1 && (
                                    <span className="shrink-0 px-3 py-1 bg-amber-500/10 text-amber-400 text-[10px] font-bold uppercase tracking-widest rounded-full border border-amber-500/20 shadow-[0_0_15px_rgba(251,191,36,0.1)]">
                                        Vesting
                                    </span>
                                )}
                                {campaign.campaignState === 2 && (
                                    <span className="shrink-0 px-3 py-1 bg-zinc-500/10 text-zinc-400 text-[10px] font-bold uppercase tracking-widest rounded-full border border-zinc-500/20">
                                        Finished
                                    </span>
                                )}
                                {campaign.campaignState === 3 && (
                                    <span className="shrink-0 px-3 py-1 bg-red-500/10 text-red-400 text-[10px] font-bold uppercase tracking-widest rounded-full border border-red-500/20">
                                        {campaign.isCancelled ? "Cancelled" : "Failed"}
                                    </span>
                                )}
                            </div>

                            <p className="text-zinc-400 text-sm line-clamp-3 mb-6">
                                {descriptions[campaign.metadataCID as string] || "Loading description..."}
                            </p>

                            <div className="flex-grow space-y-8">
                                {campaign.campaignState === 0 && (
                                    <div className="space-y-4">
                                        <ProgressBar
                                            current={campaign.campaignRaised ? BigInt(campaign.campaignRaised as unknown as bigint) : 0n}
                                            total={campaign.campaignGoal ? BigInt(campaign.campaignGoal as unknown as bigint) : 0n}
                                            variant="blue"
                                            label="Funding Progress"
                                            tokenSymbol={tokenSymbol}
                                        />
                                        <div className="flex items-center justify-between text-zinc-500 text-xs font-mono">
                                            <span>TIME REMAINING</span>
                                            {!!campaign.campaignEnd && <CountdownTimer targetDate={campaign.campaignEnd as unknown as bigint} />}
                                        </div>
                                    </div>
                                )}

                                {campaign.campaignState === 1 && (
                                    <div className="space-y-4">
                                        <ProgressBar
                                            current={campaign.campaignRaised ? BigInt(campaign.campaignRaised as unknown as bigint) : 0n}
                                            total={campaign.campaignRaised ? BigInt(campaign.campaignRaised as unknown as bigint) : 0n}
                                            variant="blue"
                                            overlayCurrent={campaign.campaignDistributed ? BigInt(campaign.campaignDistributed as unknown as bigint) : 0n}
                                            overlayVariant="gold"
                                            label="Distribution Progress"
                                            tokenSymbol={tokenSymbol}
                                        />
                                        <div className="flex items-center justify-between text-zinc-500 text-xs font-mono">
                                            <span>VESTING STARTED</span>
                                            <span className="text-zinc-300">Active Stage</span>
                                        </div>
                                    </div>
                                )}

                                {(campaign.campaignState === 2 || campaign.campaignState === 3) && (
                                    <div className="space-y-4">
                                        <ProgressBar
                                            current={campaign.campaignRaised ? BigInt(campaign.campaignRaised as unknown as bigint) : 0n}
                                            total={campaign.campaignGoal ? BigInt(campaign.campaignGoal as unknown as bigint) : 0n}
                                            variant="blue"
                                            label="Final Results"
                                            tokenSymbol={tokenSymbol}
                                        />
                                        <div className="flex items-center justify-between text-zinc-400 text-sm">
                                            <span>Goal: {campaign.campaignGoal ? formatEther(campaign.campaignGoal as bigint) : '0'} {tokenSymbol}</span>
                                            <span className={campaign.campaignState === 2 ? 'text-green-400' : 'text-red-400'}>
                                                {campaign.campaignState === 2 ? 'Goal Met' : campaign.isCancelled ? 'Cancelled' : 'Not Reached'}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-10">
                                <Link
                                    href={`campaigns/${campaign.campaignAddress}`}
                                    className="w-full h-14 flex items-center justify-center bg-zinc-100 hover:bg-white text-black font-bold rounded-2xl transition-all active:scale-[0.98] shadow-lg group-hover:shadow-white/10"
                                >
                                    {campaign.campaignState === 0 ? 'Invest Now' : 'View Details'}
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}