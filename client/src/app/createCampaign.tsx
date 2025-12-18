'use client'

import { useState } from 'react';

export function CreateCampaign({ onCreate }: { onCreate: (campaignName: string, campaignGoal: string, campaignDuration: string) => void }) {
    const [campaignName, setCampaignName] = useState('');
    const [campaignGoal, setCampaignGoal] = useState('');
    const [campaignDuration, setCampaignDuration] = useState('');

    return (
        <div>
            <h2>Creating campaign</h2>
            <input placeholder="Campaign name" value={campaignName} onChange={(e) => setCampaignName(e.target.value)} />
            <input placeholder="Campaign goal" value={campaignGoal} onChange={(e) => setCampaignGoal(e.target.value)} />
            <input placeholder="Campaign duration(days)" value={campaignDuration} onChange={(e) => setCampaignDuration(e.target.value)} />
            <button className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-900 transition-colors mt-2" onClick={() => { onCreate(campaignName, campaignGoal, campaignDuration) }}>Create campaign</button>
        </div>
    )
}