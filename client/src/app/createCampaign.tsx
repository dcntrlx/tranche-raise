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
            <input placeholder="Campaign duration" value={campaignDuration} onChange={(e) => setCampaignDuration(e.target.value)} />
            <button onClick={() => { onCreate(campaignName, campaignGoal, campaignDuration) }}>Create campaign</button>
        </div>
    )
}