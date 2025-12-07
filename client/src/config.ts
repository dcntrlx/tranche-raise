import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import { sepolia, foundry } from 'wagmi/chains';

export const config = getDefaultConfig({
    appName: 'Tranche Raise',
    projectId: 'YOUR_PROJECT_ID', // Get one at https://cloud.walletconnect.com
    chains: [foundry, sepolia],
    transports: {
        [foundry.id]: http(),
        [sepolia.id]: http(),
    },
    ssr: true, // Server Side Rendering support
});