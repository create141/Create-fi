import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useSpotPrices } from '../../hooks/use-1inch';
import { useWallet } from '../../hooks/use-wallet';

export function MarketData() {
  const { chainId } = useWallet();
  
  // Mock market data for demonstration
  const mockMarketData = [
    {
      symbol: 'ETH',
      name: 'Ethereum',
      price: '2847.92',
      change24h: '2.34',
      isPositive: true,
    },
    {
      symbol: 'UNI',
      name: 'Uniswap',
      price: '6.84',
      change24h: '-1.47',
      isPositive: false,
    },
    {
      symbol: 'LINK',
      name: 'Chainlink',
      price: '14.87',
      change24h: '5.23',
      isPositive: true,
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      price: '1.00',
      change24h: '0.01',
      isPositive: true,
    },
    {
      symbol: 'AAVE',
      name: 'Aave',
      price: '89.42',
      change24h: '-3.12',
      isPositive: false,
    },
  ];

  return (
    <Card className="trading-card">
      <CardHeader>
        <CardTitle>Market Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockMarketData.map((token) => (
            <div key={token.symbol} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-white">
                    {token.symbol.slice(0, 2)}
                  </span>
                </div>
                <div>
                  <div className="font-medium">{token.name}</div>
                  <div className="text-sm text-muted-foreground">{token.symbol}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">
                  ${parseFloat(token.price).toLocaleString()}
                </div>
                <div className={`text-sm flex items-center space-x-1 ${
                  token.isPositive ? 'text-green-400' : 'text-red-400'
                }`}>
                  {token.isPositive ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>
                    {token.isPositive ? '+' : ''}{token.change24h}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
