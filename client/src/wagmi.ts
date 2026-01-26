import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
    arbitrum,
    sei,
} from 'wagmi/chains';

const seiWithIcon = {
    ...sei,
    iconUrl: '/sei-icon.png',
};

const chains = [
    arbitrum,
    seiWithIcon,
] as const;

export const config = getDefaultConfig({
    appName: 'Tranche Raise',
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
    chains,
    ssr: false,
});
