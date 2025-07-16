import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Heart, Copy, Check } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { DONATION_ADDRESS } from '../../lib/constants';

export function DonationWidget() {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(DONATION_ADDRESS);
      setCopied(true);
      toast({
        title: 'Address Copied',
        description: 'Donation address copied to clipboard',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: 'Copy Failed',
        description: 'Failed to copy address to clipboard',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <Card className="glass-card max-w-sm">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 gradient-bg rounded-full flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-medium">Support CREATEFI</div>
              <div className="text-xs text-muted-foreground">
                Help us grow the platform
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex-1 text-xs font-mono bg-muted/40 p-2 rounded border truncate">
              {DONATION_ADDRESS}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="flex-shrink-0"
            >
              {copied ? (
                <Check className="w-3 h-3 text-green-400" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
