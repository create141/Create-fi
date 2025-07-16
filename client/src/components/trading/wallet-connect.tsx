import { useState } from 'react';
import { Button } from '../ui/button';
import { useWallet } from '../../hooks/use-wallet';
import { Wallet, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export function WalletConnect() {
  const { account, isConnecting, isConnected, connect, disconnect } = useWallet();

  if (isConnected && account) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="gradient-bg hover:opacity-90 px-6 py-2.5">
            <Wallet className="w-4 h-4 mr-2" />
            {account.slice(0, 6)}...{account.slice(-4)}
            <ChevronDown className="w-4 h-4 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(account)}
          >
            Copy Address
          </DropdownMenuItem>
          <DropdownMenuItem onClick={disconnect}>
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button
      onClick={connect}
      disabled={isConnecting}
      className="gradient-bg hover:opacity-90 px-6 py-2.5"
    >
      {isConnecting ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
          Connecting...
        </>
      ) : (
        <>
          <Wallet className="w-4 h-4 mr-2" />
          Connect Wallet
        </>
      )}
    </Button>
  );
}
