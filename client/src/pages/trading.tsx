import { WalletConnect } from '../components/trading/wallet-connect';
import { NetworkSelector } from '../components/trading/network-selector';
import { ThemeToggle } from '../components/ui/theme-toggle';
import { SwapInterface } from '../components/trading/swap-interface';
import { OrderBook } from '../components/trading/order-book';
import { MarketData } from '../components/trading/market-data';
import { GasTracker } from '../components/trading/gas-tracker';
import { PortfolioOverview } from '../components/trading/portfolio-overview';
import { TransactionHistory } from '../components/trading/transaction-history';
import { DonationWidget } from '../components/trading/donation-widget';
import { ArrowLeftRight } from 'lucide-react';

export default function Trading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Navigation */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center">
                  <ArrowLeftRight className="text-white text-lg" />
                </div>
                <span className="text-2xl font-bold gradient-text">CREATEFI</span>
              </div>
              
              <nav className="hidden md:flex space-x-6">
                <button className="text-foreground hover:text-secondary-500 transition-colors px-3 py-2 rounded-lg hover:bg-muted/50">
                  Trade
                </button>
                <button className="text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-muted/50">
                  Pool
                </button>
                <button className="text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-muted/50">
                  Earn
                </button>
                <button className="text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-muted/50">
                  NFT
                </button>
              </nav>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-4">
              <NetworkSelector />
              <ThemeToggle />
              <WalletConnect />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* Main Trading Panel */}
          <div className="xl:col-span-5 space-y-6">
            <SwapInterface />
          </div>

          {/* Orderbook and Market Data */}
          <div className="xl:col-span-4 space-y-6">
            <OrderBook />
            <MarketData />
            <GasTracker />
          </div>

          {/* Portfolio and History */}
          <div className="xl:col-span-3 space-y-6">
            <PortfolioOverview />
            <TransactionHistory />
          </div>
        </div>
      </div>

      {/* Donation Widget */}
      <DonationWidget />
    </div>
  );
}
