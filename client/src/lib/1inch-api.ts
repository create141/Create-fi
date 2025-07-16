import { apiRequest } from './queryClient';
import { Token, SwapQuote, GasPrice, PortfolioData, MarketData } from '../types/trading';

export class OneInchAPI {
  private baseUrl = '/api/1inch';

  async getTokens(chainId: number): Promise<Record<string, Token>> {
    const response = await apiRequest('GET', `${this.baseUrl}/tokens/${chainId}`);
    return response.json();
  }

  async getQuote(
    chainId: number,
    fromToken: string,
    toToken: string,
    amount: string
  ): Promise<SwapQuote> {
    const response = await apiRequest(
      'GET',
      `${this.baseUrl}/quote/${chainId}?src=${fromToken}&dst=${toToken}&amount=${amount}`
    );
    return response.json();
  }

  async getSwapTransaction(
    chainId: number,
    fromToken: string,
    toToken: string,
    amount: string,
    fromAddress: string,
    slippage: number = 1
  ): Promise<any> {
    const response = await apiRequest(
      'GET',
      `${this.baseUrl}/swap/${chainId}?src=${fromToken}&dst=${toToken}&amount=${amount}&from=${fromAddress}&slippage=${slippage}`
    );
    return response.json();
  }

  async getAllowance(
    chainId: number,
    tokenAddress: string,
    walletAddress: string
  ): Promise<{ allowance: string }> {
    const response = await apiRequest(
      'GET',
      `${this.baseUrl}/allowance/${chainId}?tokenAddress=${tokenAddress}&walletAddress=${walletAddress}`
    );
    return response.json();
  }

  async getApproveTransaction(
    chainId: number,
    tokenAddress: string,
    amount?: string
  ): Promise<any> {
    const url = `${this.baseUrl}/approve/${chainId}?tokenAddress=${tokenAddress}${
      amount ? `&amount=${amount}` : ''
    }`;
    const response = await apiRequest('GET', url);
    return response.json();
  }

  async getPortfolio(chainId: number, address: string): Promise<PortfolioData> {
    const response = await apiRequest(
      'GET',
      `${this.baseUrl}/portfolio/${chainId}/${address}`
    );
    return response.json();
  }

  async getTransactionHistory(
    chainId: number,
    address: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<any> {
    const response = await apiRequest(
      'GET',
      `${this.baseUrl}/history/${chainId}/${address}?limit=${limit}&offset=${offset}`
    );
    return response.json();
  }

  async getGasPrice(chainId: number): Promise<GasPrice> {
    const response = await apiRequest('GET', `${this.baseUrl}/gas-price/${chainId}`);
    return response.json();
  }

  async getSpotPrices(chainId: number, addresses: string[]): Promise<Record<string, string>> {
    const response = await apiRequest(
      'GET',
      `${this.baseUrl}/spot-price/${chainId}?addresses=${addresses.join(',')}`
    );
    return response.json();
  }
}

export const oneInchAPI = new OneInchAPI();
