import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import { usePortfolio } from '../../hooks/use-1inch';
import { useWallet } from '../../hooks/use-wallet';
import { TokenBalance } from '../../types/trading';

export function PortfolioOverview() {
  const { account, chainId } = useWallet();
  const { data: portfolio, isLoading, refetch } = usePortfolio(
    chainId || 1,
    account || ''
  );

  if (!account) {
    return (
      <Card className="trading-card">
        <CardHeader>
          <CardTitle>Portfolio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Connect wallet to view portfolio</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalValue = portfolio?.totalValue || '0';
  const change24h = portfolio?.change24h || '0';
  const isPositive = parseFloat(change24h) >= 0;

  return (
    <Card className="trading-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Portfolio</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => refetch()}
          disabled={isLoading}
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="text-3xl font-bold mb-1">
            ${parseFloat(totalValue).toLocaleString()}
          </div>
          <div className={`text-sm flex items-center space-x-1 ${
            isPositive ? 'text-green-400' : 'text-red-400'
          }`}>
            {isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>
              {isPositive ? '+' : ''}${Math.abs(parseFloat(change24h)).toFixed(2)} (
              {((parseFloat(change24h) / parseFloat(totalValue)) * 100).toFixed(2)}%)
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center justify-between animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-muted rounded-full" />
                  <div className="space-y-1">
                    <div className="h-4 bg-muted rounded w-12" />
                    <div className="h-3 bg-muted rounded w-16" />
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="h-4 bg-muted rounded w-20" />
                  <div className="h-3 bg-muted rounded w-12" />
                </div>
              </div>
            ))}
          </div>
        ) : portfolio?.tokens && portfolio.tokens.length > 0 ? (
          <div className="space-y-3">
            {portfolio.tokens.map((tokenBalance: TokenBalance, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-white">
                      {tokenBalance.token.symbol.slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium">{tokenBalance.token.symbol}</div>
                    <div className="text-xs text-muted-foreground">
                      {parseFloat(tokenBalance.balance).toFixed(4)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">
                    ${parseFloat(tokenBalance.usdValue).toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {((parseFloat(tokenBalance.usdValue) / parseFloat(totalValue)) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No tokens found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
