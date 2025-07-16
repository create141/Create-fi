import { SUPPORTED_CHAINS } from './constants';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export class WalletManager {
  private provider: any = null;
  private account: string | null = null;
  private chainId: number | null = null;

  async connect(): Promise<string> {
    if (!window.ethereum) {
      throw new Error('MetaMask not found. Please install MetaMask to continue.');
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      
      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      this.provider = window.ethereum;
      this.account = accounts[0];
      const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
      this.chainId = parseInt(chainIdHex || '0x1', 16);

      // Setup event listeners
      this.setupEventListeners();

      return this.account!;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    this.provider = null;
    this.account = null;
    this.chainId = null;
  }

  async switchChain(chainId: number): Promise<void> {
    if (!this.provider) {
      throw new Error('Wallet not connected');
    }

    const chain = SUPPORTED_CHAINS.find(c => c.id === chainId);
    if (!chain) {
      throw new Error('Unsupported chain');
    }

    try {
      await this.provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (error: any) {
      if (error.code === 4902) {
        // Chain not added to wallet, add it
        await this.addChain(chain);
      } else {
        throw error;
      }
    }
  }

  private async addChain(chain: any): Promise<void> {
    await this.provider.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: `0x${chain.id.toString(16)}`,
          chainName: chain.name,
          nativeCurrency: {
            name: chain.symbol,
            symbol: chain.symbol,
            decimals: 18,
          },
          rpcUrls: [chain.rpcUrl],
          blockExplorerUrls: [chain.blockExplorerUrl],
        },
      ],
    });
  }

  async sendTransaction(transaction: any): Promise<string> {
    if (!this.provider) {
      throw new Error('Wallet not connected');
    }

    try {
      const txHash = await this.provider.request({
        method: 'eth_sendTransaction',
        params: [transaction],
      });
      return txHash;
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    }
  }

  private setupEventListeners(): void {
    if (!this.provider) return;

    this.provider.on('accountsChanged', (accounts: string[]) => {
      if (accounts.length === 0) {
        this.disconnect();
      } else {
        this.account = accounts[0];
      }
    });

    this.provider.on('chainChanged', (chainId: string) => {
      this.chainId = parseInt(chainId, 16);
      window.location.reload();
    });

    this.provider.on('disconnect', () => {
      this.disconnect();
    });
  }

  getAccount(): string | null {
    return this.account;
  }

  getChainId(): number | null {
    return this.chainId;
  }

  isConnected(): boolean {
    return this.provider !== null && this.account !== null;
  }
}

export const walletManager = new WalletManager();
