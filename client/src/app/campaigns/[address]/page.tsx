import { use } from "react";

export default function CampaignDetails({ params }: { params: Promise<{ address: string }> }) {
    const address = (use(params)).address as `0x${string}`;
    return (
        <div>
            <h1>Campaign Details:</h1>
            <p>{address}</p>
        </div>
    )
}