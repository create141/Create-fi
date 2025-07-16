import { useState } from 'react';
import { Button } from '../ui/button';
import { useWallet } from '../../hooks/use-wallet';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { SUPPORTED_CHAINS } from '../../lib/constants';

export function NetworkSelector() {
  const { chainId, switchChain } = useWallet();
  
  const currentChain = SUPPORTED_CHAINS.find(chain => chain.id === chainId);

  const handleChainSwitch = async (newChainId: number) => {
    await switchChain(newChainId);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="hidden sm:flex items-center space-x-2 bg-muted/50 border-border"
        >
          <div className="w-5 h-5 rounded-full bg-blue-500" />
          <span className="text-sm">
            {currentChain?.name || 'Select Network'}
          </span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {SUPPORTED_CHAINS.map((chain) => (
          <DropdownMenuItem
            key={chain.id}
            onClick={() => handleChainSwitch(chain.id)}
            className="flex items-center space-x-2"
          >
            <div className="w-4 h-4 rounded-full bg-blue-500" />
            <span>{chain.name}</span>
            {chainId === chain.id && (
              <span className="text-xs text-green-400">●</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
