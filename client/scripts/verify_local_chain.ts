import { createPublicClient, http } from 'viem'
import { foundry } from 'viem/chains'
import { CAMPAIGN_FACTORY_ABI, CAMPAIGN_FACTORY_ADDRESSES } from '../src/app/contracts'

async function main() {
    const client = createPublicClient({
        chain: foundry,
        transport: http('http://127.0.0.1:8545')
    })

    // Use the address from contracts.ts or default
    const address = CAMPAIGN_FACTORY_ADDRESSES[31337]

    console.log(`Checking Factory at ${address}...`)

    const code = await client.getBytecode({ address })
    if (!code || code === '0x') {
        console.error('No code found at factory address!')
        process.exit(1)
    }
    console.log('Factory contract found.')

    const campaigns = await client.readContract({
        address,
        abi: CAMPAIGN_FACTORY_ABI,
        functionName: 'getAllCampaigns'
    })

    console.log(`Current campaigns count: ${campaigns.length}`)
    console.log('Verification successful!')
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})
