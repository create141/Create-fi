import { useState, useEffect } from 'react';
import { walletManager } from '../lib/wallet';
import { useToast } from './use-toast';

export function useWallet() {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if already connected
    if (walletManager.isConnected()) {
      setAccount(walletManager.getAccount());
      setChainId(walletManager.getChainId());
    }
  }, []);

  const connect = async () => {
    setIsConnecting(true);
    try {
      const connectedAccount = await walletManager.connect();
      setAccount(connectedAccount);
      setChainId(walletManager.getChainId());
      toast({
        title: 'Wallet Connected',
        description: `Connected to ${connectedAccount.slice(0, 6)}...${connectedAccount.slice(-4)}`,
      });
    } catch (error: any) {
      toast({
        title: 'Connection Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    await walletManager.disconnect();
    setAccount(null);
    setChainId(null);
    toast({
      title: 'Wallet Disconnected',
      description: 'Your wallet has been disconnected.',
    });
  };

  const switchChain = async (newChainId: number) => {
    try {
      await walletManager.switchChain(newChainId);
      setChainId(newChainId);
    } catch (error: any) {
      toast({
        title: 'Network Switch Failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const sendTransaction = async (transaction: any) => {
    try {
      return await walletManager.sendTransaction(transaction);
    } catch (error: any) {
      toast({
        title: 'Transaction Failed',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  return {
    account,
    chainId,
    isConnecting,
    isConnected: account !== null,
    connect,
    disconnect,
    switchChain,
    sendTransaction,
  };
}
