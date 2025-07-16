import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Clock, X } from 'lucide-react';
import { useLimitOrders } from '../../hooks/use-1inch';
import { useWallet } from '../../hooks/use-wallet';
import { LimitOrder } from '../../types/trading';
import { formatDistanceToNow } from 'date-fns';

export function OrderBook() {
  const { account } = useWallet();
  const { data: orders, isLoading } = useLimitOrders(account || '');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'filled':
        return 'bg-blue-500';
      case 'cancelled':
        return 'bg-red-500';
      case 'expired':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'filled':
        return 'Filled';
      case 'cancelled':
        return 'Cancelled';
      case 'expired':
        return 'Expired';
      default:
        return status;
    }
  };

  if (!account) {
    return (
      <Card className="trading-card">
        <CardHeader>
          <CardTitle>Active Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Connect wallet to view orders</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="trading-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Active Orders</CardTitle>
        <Button variant="ghost" size="sm" className="text-secondary-500">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-muted/40 rounded-lg p-4 animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : !orders || orders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No active orders</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order: LimitOrder) => (
              <div
                key={order.id}
                className="bg-muted/40 rounded-lg p-4 border border-border/30"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(order.status)}`} />
                    <span className="text-sm font-medium">
                      {order.fromToken} → {order.toToken}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {getStatusText(order.status)}
                  </Badge>
                </div>
                
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>Amount: {order.fromAmount}</div>
                  <div>Price: {order.targetPrice}</div>
                  {order.expiresAt && (
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>
                        Expires {formatDistanceToNow(new Date(order.expiresAt), { addSuffix: true })}
                      </span>
                    </div>
                  )}
                </div>

                {order.status === 'active' && (
                  <div className="flex justify-end mt-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300"
                    >
                      <X className="w-3 h-3 mr-1" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
