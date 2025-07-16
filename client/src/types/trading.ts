export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
}

export interface TokenBalance {
  token: Token;
  balance: string;
  usdValue: string;
}

export interface SwapQuote {
  fromToken: Token;
  toToken: Token;
  fromAmount: string;
  toAmount: string;
  estimatedGas: string;
  gasPrice: string;
  protocols: Array<{
    name: string;
    part: number;
    fromTokenAddress: string;
    toTokenAddress: string;
  }>;
}

export interface SwapTransaction {
  id: number;
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
  txHash: string | null;
  chainId: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}

export interface LimitOrder {
  id: number;
  fromToken: string;
  toToken: string;
  fromAmount: string;
  targetPrice: string;
  chainId: number;
  status: 'active' | 'filled' | 'cancelled' | 'expired';
  expiresAt: Date | null;
  createdAt: Date;
}

export interface GasPrice {
  slow: string;
  standard: string;
  fast: string;
  instant: string;
}

export interface Chain {
  id: number;
  name: string;
  symbol: string;
  logoURI?: string;
  rpcUrl: string;
  blockExplorerUrl: string;
}

export interface PortfolioData {
  totalValue: string;
  change24h: string;
  tokens: TokenBalance[];
}

export interface MarketData {
  address: string;
  symbol: string;
  name: string;
  price: string;
  change24h: string;
  logoURI?: string;
}
