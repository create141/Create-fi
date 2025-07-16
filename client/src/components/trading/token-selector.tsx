import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { ChevronDown, Search } from 'lucide-react';
import { useTokens } from '../../hooks/use-1inch';
import { useWallet } from '../../hooks/use-wallet';
import { Token } from '../../types/trading';
import { POPULAR_TOKENS } from '../../lib/constants';

interface TokenSelectorProps {
  selectedToken: Token | null;
  onTokenSelect: (token: Token) => void;
  label: string;
}

export function TokenSelector({ selectedToken, onTokenSelect, label }: TokenSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { chainId } = useWallet();
  const { data: tokens, isLoading } = useTokens(chainId || 1);

  const popularTokens = POPULAR_TOKENS[chainId as keyof typeof POPULAR_TOKENS] || [];

  const filteredTokens = tokens 
    ? Object.values(tokens).filter(token =>
        token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.address.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleTokenSelect = (token: Token) => {
    onTokenSelect(token);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 bg-muted/50 hover:bg-muted/70 px-3 py-2"
      >
        <div className="w-6 h-6 rounded-full bg-blue-500" />
        <span className="font-medium">
          {selectedToken?.symbol || 'Select Token'}
        </span>
        <ChevronDown className="w-4 h-4" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Select {label} Token</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, symbol, or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Popular Tokens */}
            {!searchQuery && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Popular Tokens</h4>
                <div className="flex flex-wrap gap-2">
                  {popularTokens.map((token) => (
                    <Badge
                      key={token.address}
                      variant="secondary"
                      className="cursor-pointer hover:bg-secondary/80"
                      onClick={() => handleTokenSelect(token)}
                    >
                      {token.symbol}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Token List */}
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {isLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto" />
                  <p className="text-sm text-muted-foreground mt-2">Loading tokens...</p>
                </div>
              ) : filteredTokens.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">No tokens found</p>
                </div>
              ) : (
                filteredTokens.map((token) => (
                  <div
                    key={token.address}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => handleTokenSelect(token)}
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                      <span className="text-xs font-medium text-white">
                        {token.symbol.slice(0, 2)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{token.symbol}</div>
                      <div className="text-sm text-muted-foreground">{token.name}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
