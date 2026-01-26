'use client'

import { useChainId } from 'wagmi';

const NATIVE_TOKENS: Record<number, string> = {
    42161: 'ETH',  // Arbitrum
    1329: 'SEI',   // Sei
};

export function useNativeToken() {
    const chainId = useChainId();
    return NATIVE_TOKENS[chainId] || 'ETH';
}
