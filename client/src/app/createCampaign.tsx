'use client'

import { useState } from 'react';

interface CreateCampaignProps {
    onCreate: (campaignName: string, campaignDescription: string, campaignGoal: string, campaignDuration: string) => void;
    onCancel: () => void;
}

export function CreateCampaign({ onCreate, onCancel }: CreateCampaignProps) {
    const [campaignName, setCampaignName] = useState('');
    const [campaignDescription, setCampaignDescription] = useState('');
    const [campaignGoal, setCampaignGoal] = useState('');
    const [campaignDuration, setCampaignDuration] = useState('');

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 max-w-md w-full shadow-2xl overflow-y-auto max-h-[90vh]">
                <h2 className="text-2xl font-bold mb-6 text-white">Create New Campaign</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">Title</label>
                        <input
                            className="w-full bg-zinc-800 border-zinc-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all"
                            placeholder="e.g. Save the Ocean"
                            value={campaignName}
                            onChange={(e) => setCampaignName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">Description</label>
                        <textarea
                            className="w-full bg-zinc-800 border-zinc-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all min-h-[100px]"
                            placeholder="Tell us more about your project..."
                            value={campaignDescription}
                            onChange={(e) => setCampaignDescription(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">Goal (ETH)</label>
                        <input
                            className="w-full bg-zinc-800 border-zinc-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all"
                            placeholder="e.g. 10.5"
                            value={campaignGoal}
                            onChange={(e) => setCampaignGoal(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">Duration (Days)</label>
                        <input
                            className="w-full bg-zinc-800 border-zinc-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all"
                            placeholder="e.g. 30"
                            value={campaignDuration}
                            onChange={(e) => setCampaignDuration(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex gap-3 mt-8">
                    <button
                        className="flex-1 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-colors"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button
                        className="flex-1 px-4 py-3 bg-blue-800 hover:bg-blue-900 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-900/20"
                        onClick={() => { onCreate(campaignName, campaignDescription, campaignGoal, campaignDuration) }}
                    >
                        Create Campaign
                    </button>
                </div>
            </div>
        </div>
    )
}