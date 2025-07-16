import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Flame, Zap, Clock } from 'lucide-react';
import { useGasPrice } from '../../hooks/use-1inch';
import { useWallet } from '../../hooks/use-wallet';

export function GasTracker() {
  const { chainId } = useWallet();
  const { data: gasPrice, isLoading } = useGasPrice(chainId || 1);

  // Mock gas data for demonstration
  const mockGasData = [
    {
      speed: 'Slow',
      price: '25',
      usdCost: '3.50',
      icon: <Clock className="w-4 h-4 text-green-400" />,
      color: 'text-green-400',
    },
    {
      speed: 'Standard',
      price: '35',
      usdCost: '4.90',
      icon: <Zap className="w-4 h-4 text-yellow-400" />,
      color: 'text-yellow-400',
    },
    {
      speed: 'Fast',
      price: '50',
      usdCost: '7.00',
      icon: <Flame className="w-4 h-4 text-red-400" />,
      color: 'text-red-400',
    },
  ];

  return (
    <Card className="trading-card">
      <CardHeader>
        <CardTitle>Gas Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex justify-between items-center animate-pulse">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded w-16" />
                </div>
                <div className="h-4 bg-muted rounded w-20" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {mockGasData.map((gas) => (
              <div key={gas.speed} className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  {gas.icon}
                  <span className="text-sm text-muted-foreground">{gas.speed}</span>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${gas.color}`}>
                    {gas.price} gwei
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ~${gas.usdCost}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
