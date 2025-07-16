import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { oneInchAPI } from '../lib/1inch-api';
import { useToast } from './use-toast';
import { apiRequest } from '../lib/queryClient';

export function useTokens(chainId: number) {
  return useQuery({
    queryKey: ['tokens', chainId],
    queryFn: () => oneInchAPI.getTokens(chainId),
    enabled: !!chainId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useQuote(
  chainId: number,
  fromToken: string,
  toToken: string,
  amount: string
) {
  return useQuery({
    queryKey: ['quote', chainId, fromToken, toToken, amount],
    queryFn: () => oneInchAPI.getQuote(chainId, fromToken, toToken, amount),
    enabled: !!chainId && !!fromToken && !!toToken && !!amount && amount !== '0',
    refetchInterval: 10000, // Refetch every 10 seconds
    staleTime: 5000, // Consider stale after 5 seconds
  });
}

export function useSwapTransaction() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      chainId: number;
      fromToken: string;
      toToken: string;
      amount: string;
      fromAddress: string;
      slippage: number;
    }) => {
      return oneInchAPI.getSwapTransaction(
        params.chainId,
        params.fromToken,
        params.toToken,
        params.amount,
        params.fromAddress,
        params.slippage
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast({
        title: 'Swap Successful',
        description: 'Your tokens have been swapped successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Swap Failed',
        description: error.message || 'Failed to execute swap',
        variant: 'destructive',
      });
    },
  });
}

export function usePortfolio(chainId: number, address: string) {
  return useQuery({
    queryKey: ['portfolio', chainId, address],
    queryFn: () => oneInchAPI.getPortfolio(chainId, address),
    enabled: !!chainId && !!address,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

export function useTransactionHistory(
  chainId: number,
  address: string,
  limit: number = 50
) {
  return useQuery({
    queryKey: ['transactions', chainId, address, limit],
    queryFn: () => oneInchAPI.getTransactionHistory(chainId, address, limit),
    enabled: !!chainId && !!address,
    staleTime: 60000, // 1 minute
  });
}

export function useGasPrice(chainId: number) {
  return useQuery({
    queryKey: ['gas-price', chainId],
    queryFn: () => oneInchAPI.getGasPrice(chainId),
    enabled: !!chainId,
    refetchInterval: 15000, // Refetch every 15 seconds
  });
}

export function useSpotPrices(chainId: number, addresses: string[]) {
  return useQuery({
    queryKey: ['spot-prices', chainId, addresses],
    queryFn: () => oneInchAPI.getSpotPrices(chainId, addresses),
    enabled: !!chainId && addresses.length > 0,
    refetchInterval: 60000, // Refetch every minute
  });
}

export function useAllowance(
  chainId: number,
  tokenAddress: string,
  walletAddress: string
) {
  return useQuery({
    queryKey: ['allowance', chainId, tokenAddress, walletAddress],
    queryFn: () => oneInchAPI.getAllowance(chainId, tokenAddress, walletAddress),
    enabled: !!chainId && !!tokenAddress && !!walletAddress,
  });
}

export function useCreateLimitOrder() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderData: {
      userAddress: string;
      fromToken: string;
      toToken: string;
      fromAmount: string;
      targetPrice: string;
      chainId: number;
      expiresAt?: Date;
    }) => {
      return apiRequest('POST', '/api/limit-orders', orderData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['limit-orders'] });
      toast({
        title: 'Order Created',
        description: 'Your limit order has been created successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Order Creation Failed',
        description: error.message || 'Failed to create limit order',
        variant: 'destructive',
      });
    },
  });
}

export function useLimitOrders(userAddress: string) {
  return useQuery({
    queryKey: ['limit-orders', userAddress],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/limit-orders/${userAddress}`);
      return response.json();
    },
    enabled: !!userAddress,
  });
}
