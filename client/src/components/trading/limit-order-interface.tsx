import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CalendarIcon, Plus } from 'lucide-react';
import { TokenSelector } from './token-selector';
import { useWallet } from '../../hooks/use-wallet';
import { useCreateLimitOrder } from '../../hooks/use-1inch';
import { useToast } from '../../hooks/use-toast';
import { Token } from '../../types/trading';
import { format } from 'date-fns';

interface LimitOrderInterfaceProps {
  fromToken?: Token | null;
  toToken?: Token | null;
}

export function LimitOrderInterface({ fromToken: initialFromToken, toToken: initialToToken }: LimitOrderInterfaceProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [fromToken, setFromToken] = useState<Token | null>(initialFromToken || null);
  const [toToken, setToToken] = useState<Token | null>(initialToToken || null);
  const [fromAmount, setFromAmount] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [expiresAt, setExpiresAt] = useState<Date | undefined>(undefined);
  
  const { account, chainId } = useWallet();
  const { toast } = useToast();
  const createOrderMutation = useCreateLimitOrder();

  const handleCreateOrder = async () => {
    if (!account || !fromToken || !toToken || !fromAmount || !targetPrice || !chainId) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      await createOrderMutation.mutateAsync({
        userAddress: account,
        fromToken: fromToken.address,
        toToken: toToken.address,
        fromAmount,
        targetPrice,
        chainId,
        expiresAt,
      });

      toast({
        title: 'Limit Order Created',
        description: 'Your limit order has been successfully created',
      });

      // Reset form
      setFromAmount('');
      setTargetPrice('');
      setExpiresAt(undefined);
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to create limit order:', error);
      toast({
        title: 'Error',
        description: 'Failed to create limit order',
        variant: 'destructive',
      });
    }
  };

  const isFormValid = fromToken && toToken && fromAmount && targetPrice && account;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
          <Plus className="w-4 h-4 mr-1" />
          Limit Order
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]" aria-describedby="limit-order-description">
        <DialogHeader>
          <DialogTitle>Create Limit Order</DialogTitle>
          <div id="limit-order-description" className="sr-only">
            Create a limit order to automatically execute a trade when the target price is reached
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* From Token */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">From</Label>
            <div className="flex items-center space-x-2">
              <TokenSelector
                selectedToken={fromToken}
                onTokenSelect={setFromToken}
                label="From"
              />
              <Input
                type="number"
                placeholder="Amount"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          {/* To Token */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">To</Label>
            <TokenSelector
              selectedToken={toToken}
              onTokenSelect={setToToken}
              label="To"
            />
          </div>

          {/* Target Price */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">
              Target Price ({toToken?.symbol || 'Token'} per {fromToken?.symbol || 'Token'})
            </Label>
            <Input
              type="number"
              placeholder="0.0"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              step="0.000001"
            />
          </div>

          {/* Expiration Date (Optional) */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Expiration Date (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {expiresAt ? format(expiresAt, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={expiresAt}
                  onSelect={setExpiresAt}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Order Summary */}
          {isFormValid && (
            <div className="p-4 bg-muted/20 rounded-lg space-y-2">
              <h4 className="font-medium">Order Summary</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>Sell: {fromAmount} {fromToken?.symbol}</div>
                <div>For: {toToken?.symbol} at {targetPrice} rate</div>
                <div>
                  Estimated Receive: {fromAmount && targetPrice ? (parseFloat(fromAmount) * parseFloat(targetPrice)).toFixed(6) : '0'} {toToken?.symbol}
                </div>
                {expiresAt && (
                  <div>Expires: {format(expiresAt, "PPP")}</div>
                )}
              </div>
            </div>
          )}

          {/* Create Order Button */}
          <Button
            onClick={handleCreateOrder}
            disabled={!isFormValid || createOrderMutation.isPending}
            className="w-full bg-secondary-500 hover:bg-secondary-600"
          >
            {createOrderMutation.isPending ? 'Creating Order...' : 'Create Limit Order'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}