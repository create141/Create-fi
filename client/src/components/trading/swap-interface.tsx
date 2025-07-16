import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { ArrowUpDown, Settings } from 'lucide-react';
import { TokenSelector } from './token-selector';
import { LimitOrderInterface } from './limit-order-interface';
import { useWallet } from '../../hooks/use-wallet';
import { useQuote, useSwapTransaction } from '../../hooks/use-1inch';
import { useToast } from '../../hooks/use-toast';
import { Token } from '../../types/trading';
import { SLIPPAGE_OPTIONS } from '../../lib/constants';

export function SwapInterface() {
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [fromAmount, setFromAmount] = useState('');
  const [slippage, setSlippage] = useState(1.0);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState<'swap' | 'limit' | 'dca'>('swap');
  
  const { account, chainId, sendTransaction } = useWallet();
  const { toast } = useToast();
  const swapMutation = useSwapTransaction();
  
  const { data: quote, isLoading: isQuoteLoading } = useQuote(
    chainId || 1,
    fromToken?.address || '',
    toToken?.address || '',
    fromAmount ? (parseFloat(fromAmount) * Math.pow(10, fromToken?.decimals || 18)).toString() : ''
  );

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
  };

  const handleSwap = async () => {
    if (!account || !fromToken || !toToken || !fromAmount || !chainId) {
      toast({
        title: 'Missing Information',
        description: 'Please connect wallet and select tokens',
        variant: 'destructive',
      });
      return;
    }

    try {
      const amount = (parseFloat(fromAmount) * Math.pow(10, fromToken.decimals)).toString();
      
      const swapData = await swapMutation.mutateAsync({
        chainId,
        fromToken: fromToken.address,
        toToken: toToken.address,
        amount,
        fromAddress: account,
        slippage,
      });

      // Send transaction through wallet
      const txHash = await sendTransaction(swapData.tx);
      
      toast({
        title: 'Transaction Sent',
        description: `Transaction hash: ${txHash}`,
      });
    } catch (error) {
      console.error('Swap failed:', error);
    }
  };

  const estimatedOutput = quote?.toAmount 
    ? (parseFloat(quote.toAmount) / Math.pow(10, toToken?.decimals || 18)).toFixed(6)
    : '0.0';

  return (
    <Card className="trading-card">
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex space-x-1">
            <Button 
              variant={activeTab === 'swap' ? 'default' : 'ghost'}
              className={activeTab === 'swap' ? 'bg-secondary-500 hover:bg-secondary-600' : 'text-muted-foreground hover:text-foreground'}
              onClick={() => setActiveTab('swap')}
            >
              Swap
            </Button>
            <LimitOrderInterface fromToken={fromToken} toToken={toToken} />
            <Button 
              variant="ghost" 
              className="text-muted-foreground hover:text-foreground"
              onClick={() => setActiveTab('dca')}
            >
              DCA
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="space-y-4 p-4 bg-muted/20 rounded-lg">
            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">
                Slippage Tolerance
              </Label>
              <div className="flex space-x-2">
                {SLIPPAGE_OPTIONS.map((option) => (
                  <Button
                    key={option}
                    variant={slippage === option ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSlippage(option)}
                  >
                    {option}%
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* From Token */}
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">From</Label>
          <div className="token-input">
            <div className="flex items-center justify-between mb-3">
              <TokenSelector
                selectedToken={fromToken}
                onTokenSelect={setFromToken}
                label="From"
              />
              <span className="token-balance">
                Balance: 0.0
              </span>
            </div>
            <Input
              type="number"
              placeholder="0.0"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              className="text-2xl font-medium bg-transparent border-none p-0 focus-visible:ring-0"
            />
          </div>
        </div>

        {/* Swap Direction Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleSwapTokens}
            className="swap-direction-btn"
            disabled={!fromToken || !toToken}
          >
            <ArrowUpDown className="w-4 h-4 text-secondary-500" />
          </Button>
        </div>

        {/* To Token */}
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">To</Label>
          <div className="token-input">
            <div className="flex items-center justify-between mb-3">
              <TokenSelector
                selectedToken={toToken}
                onTokenSelect={setToToken}
                label="To"
              />
              <span className="token-balance">
                Balance: 0.0
              </span>
            </div>
            <div className="text-2xl font-medium text-foreground">
              {isQuoteLoading ? (
                <div className="animate-pulse">Loading...</div>
              ) : (
                estimatedOutput
              )}
            </div>
          </div>
        </div>

        {/* Trade Details */}
        {quote && (
          <div className="bg-muted/20 rounded-xl p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Rate</span>
              <span>
                1 {fromToken?.symbol} = {(parseFloat(estimatedOutput) / parseFloat(fromAmount || '1')).toFixed(6)} {toToken?.symbol}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Slippage Tolerance</span>
              <span className="text-secondary-500">{slippage}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Gas Fee</span>
              <span>~${(parseFloat(quote.estimatedGas) * 0.000000001 * 2000).toFixed(2)}</span>
            </div>
            {quote.protocols && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Route</span>
                <span className="text-xs text-muted-foreground">
                  {quote.protocols.slice(0, 2).map(p => p.name).join(' • ')}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Swap Button */}
        <Button
          onClick={handleSwap}
          disabled={!account || !fromToken || !toToken || !fromAmount || swapMutation.isPending}
          className="w-full gradient-bg hover:opacity-90 py-4 text-lg font-semibold"
        >
          {swapMutation.isPending ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              <span>Swapping...</span>
            </div>
          ) : !account ? (
            'Connect Wallet'
          ) : !fromToken || !toToken ? (
            'Select Tokens'
          ) : !fromAmount ? (
            'Enter Amount'
          ) : (
            'Swap'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
