'use client'

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from 'wagmi';

export default function Home() {
  const { address } = useAccount();
  return (
    <div>
      <ConnectButton />
      <h1>Tranche Raise</h1>
      <p>Tranche Raise is a platform for raising funds for campaigns</p>
      <p>{`Connected address: ${address}` || 'Not connected'}</p>
    </div>
  );
}
