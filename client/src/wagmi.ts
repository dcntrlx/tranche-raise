import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
    arbitrum,
    arbitrumSepolia,
    sei,
    seiTestnet,
    foundry,
} from 'wagmi/chains';

const seiWithIcon = {
    ...sei,
    iconUrl: '/sei-icon.png',
};

const seiTestnetWithIcon = {
    ...seiTestnet,
    iconUrl: '/sei-icon.png',
};

// Use testnets in development, mainnets in production
const isDev = process.env.NODE_ENV === 'development';

const chains = isDev
    ? [foundry, arbitrumSepolia, seiTestnetWithIcon] as const
    : [arbitrum, seiWithIcon] as const;

export const config = getDefaultConfig({
    appName: 'Tranche Raise',
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
    chains,
    ssr: false,
});
