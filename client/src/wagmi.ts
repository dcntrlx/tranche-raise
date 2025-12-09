import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
    mainnet,
    sepolia,
    baseSepolia,
    foundry,
} from 'wagmi/chains';

export const config = getDefaultConfig({
    appName: 'Tranche Raise',
    projectId: 'YOUR_PROJECT_ID',
    chains: [
        foundry,
        mainnet,
        sepolia,
        baseSepolia,
    ],
    ssr: false,
});
