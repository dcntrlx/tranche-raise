import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
    arbitrum,
    arbitrumSepolia,
    base,
    baseSepolia,
    foundry,
    mainnet,
    optimism,
    optimismSepolia,
    polygon,
    polygonAmoy,
    sei,
    seiTestnet,
} from 'wagmi/chains';

const chains = [
    arbitrum,
    arbitrumSepolia,
    base,
    baseSepolia,
    foundry,
    mainnet,
    optimism,
    optimismSepolia,
    polygon,
    polygonAmoy,
    sei,
    seiTestnet,
] as const;

export const config = getDefaultConfig({
    appName: 'Tranche Raise',
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
    chains,
    ssr: false,
});
