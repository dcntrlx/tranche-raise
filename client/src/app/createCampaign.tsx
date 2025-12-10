'use client'

export function CreateCampaign({ onCreate }: { onCreate: () => void }) {
    return (
        <div>
            <h2>Creating campaign</h2>
            <input placeholder="Campaign name"></input>
            <input placeholder="Campaign description"></input>
            <input placeholder="Campaign goal"></input>
            <input placeholder="Campaign duration"></input>
            <button onClick={() => { onCreate() }}>Create campaign</button>
        </div>
    )
}