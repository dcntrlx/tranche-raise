'use client'

import { useChainId } from 'wagmi';

const NATIVE_TOKENS: Record<number, string> = {
    // Mainnets
    42161: 'ETH',   // Arbitrum
    1329: 'SEI',    // Sei
    // Testnets
    421614: 'ETH',  // Arbitrum Sepolia
    1328: 'SEI',    // Sei Testnet
};

export function useNativeToken() {
    const chainId = useChainId();
    return NATIVE_TOKENS[chainId] || 'ETH';
}
