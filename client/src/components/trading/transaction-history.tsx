import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ArrowUpRight, ArrowDownLeft, Clock, ExternalLink } from 'lucide-react';
import { useTransactionHistory } from '../../hooks/use-1inch';
import { useWallet } from '../../hooks/use-wallet';
import { formatDistanceToNow } from 'date-fns';

export function TransactionHistory() {
  const { account, chainId } = useWallet();
  const { data: transactions, isLoading } = useTransactionHistory(
    chainId || 1,
    account || ''
  );

  if (!account) {
    return (
      <Card className="trading-card">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Connect wallet to view activity</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'swap':
        return <ArrowUpRight className="w-4 h-4 text-green-400" />;
      case 'receive':
        return <ArrowDownLeft className="w-4 h-4 text-blue-400" />;
      case 'limit_order':
        return <Clock className="w-4 h-4 text-purple-400" />;
      default:
        return <ArrowUpRight className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Mock data for demonstration
  const mockTransactions = [
    {
      id: 1,
      type: 'swap',
      description: 'Swap USDC → ETH',
      amount: '+0.235 ETH',
      value: '$669.50',
      status: 'completed',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      hash: '0x123...abc',
    },
    {
      id: 2,
      type: 'limit_order',
      description: 'Limit Order Placed',
      amount: 'ETH → USDC',
      value: 'Pending',
      status: 'pending',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      hash: null,
    },
    {
      id: 3,
      type: 'receive',
      description: 'Received LINK',
      amount: '+125.0 LINK',
      value: '$1,858.75',
      status: 'completed',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      hash: '0x456...def',
    },
  ];

  return (
    <Card className="trading-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Activity</CardTitle>
        <Button variant="ghost" size="sm" className="text-secondary-500">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3 p-3 bg-muted/20 rounded-lg animate-pulse">
                <div className="w-8 h-8 bg-muted rounded-full" />
                <div className="flex-1 space-y-1">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
                <div className="text-right space-y-1">
                  <div className="h-4 bg-muted rounded w-16" />
                  <div className="h-3 bg-muted rounded w-12" />
                </div>
              </div>
            ))}
          </div>
        ) : mockTransactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No recent transactions</p>
          </div>
        ) : (
          <div className="space-y-3">
            {mockTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center space-x-3 p-3 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors"
              >
                <div className="w-8 h-8 bg-muted/50 rounded-full flex items-center justify-center">
                  {getTransactionIcon(tx.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{tx.description}</span>
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(tx.status)}`} />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDistanceToNow(tx.timestamp, { addSuffix: true })}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{tx.amount}</div>
                  <div className="text-xs text-muted-foreground">{tx.value}</div>
                </div>
                {tx.hash && (
                  <Button variant="ghost" size="sm" className="p-1">
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
