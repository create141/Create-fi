import { 
  users, 
  swapTransactions, 
  limitOrders, 
  portfolioSnapshots,
  type User, 
  type InsertUser,
  type SwapTransaction,
  type InsertSwapTransaction,
  type LimitOrder,
  type InsertLimitOrder,
  type PortfolioSnapshot
} from "@shared/schema";

export interface IStorage {
  // User management
  getUser(address: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Swap transactions
  createSwapTransaction(transaction: InsertSwapTransaction & { userId: number }): Promise<SwapTransaction>;
  getSwapTransactions(userId: number): Promise<SwapTransaction[]>;
  updateSwapTransactionStatus(id: number, status: string, txHash?: string): Promise<void>;
  
  // Limit orders
  createLimitOrder(order: InsertLimitOrder & { userId: number }): Promise<LimitOrder>;
  getLimitOrders(userId: number): Promise<LimitOrder[]>;
  updateLimitOrderStatus(id: number, status: string): Promise<void>;
  
  // Portfolio snapshots
  createPortfolioSnapshot(snapshot: { userId: number; totalValue: string; tokens: any; chainId: number }): Promise<PortfolioSnapshot>;
  getLatestPortfolioSnapshot(userId: number, chainId: number): Promise<PortfolioSnapshot | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private swapTransactions: Map<number, SwapTransaction> = new Map();
  private limitOrders: Map<number, LimitOrder> = new Map();
  private portfolioSnapshots: Map<number, PortfolioSnapshot> = new Map();
  
  private currentUserId = 1;
  private currentSwapId = 1;
  private currentOrderId = 1;
  private currentSnapshotId = 1;

  async getUser(address: string): Promise<User | undefined> {
    return this.users.get(address.toLowerCase());
  }

  async createUser(user: InsertUser): Promise<User> {
    const newUser: User = {
      id: this.currentUserId++,
      address: user.address.toLowerCase(),
      createdAt: new Date(),
    };
    this.users.set(newUser.address, newUser);
    return newUser;
  }

  async createSwapTransaction(transaction: InsertSwapTransaction & { userId: number }): Promise<SwapTransaction> {
    const newTransaction: SwapTransaction = {
      id: this.currentSwapId++,
      userId: transaction.userId,
      fromToken: transaction.fromToken,
      toToken: transaction.toToken,
      fromAmount: transaction.fromAmount,
      toAmount: transaction.toAmount,
      txHash: null,
      chainId: transaction.chainId,
      status: 'pending',
      createdAt: new Date(),
    };
    this.swapTransactions.set(newTransaction.id, newTransaction);
    return newTransaction;
  }

  async getSwapTransactions(userId: number): Promise<SwapTransaction[]> {
    return Array.from(this.swapTransactions.values()).filter(tx => tx.userId === userId);
  }

  async updateSwapTransactionStatus(id: number, status: string, txHash?: string): Promise<void> {
    const transaction = this.swapTransactions.get(id);
    if (transaction) {
      transaction.status = status;
      if (txHash) transaction.txHash = txHash;
    }
  }

  async createLimitOrder(order: InsertLimitOrder & { userId: number }): Promise<LimitOrder> {
    const newOrder: LimitOrder = {
      id: this.currentOrderId++,
      userId: order.userId,
      fromToken: order.fromToken,
      toToken: order.toToken,
      fromAmount: order.fromAmount,
      targetPrice: order.targetPrice,
      chainId: order.chainId,
      status: 'active',
      expiresAt: order.expiresAt || null,
      createdAt: new Date(),
    };
    this.limitOrders.set(newOrder.id, newOrder);
    return newOrder;
  }

  async getLimitOrders(userId: number): Promise<LimitOrder[]> {
    return Array.from(this.limitOrders.values()).filter(order => order.userId === userId);
  }

  async updateLimitOrderStatus(id: number, status: string): Promise<void> {
    const order = this.limitOrders.get(id);
    if (order) {
      order.status = status;
    }
  }

  async createPortfolioSnapshot(snapshot: { userId: number; totalValue: string; tokens: any; chainId: number }): Promise<PortfolioSnapshot> {
    const newSnapshot: PortfolioSnapshot = {
      id: this.currentSnapshotId++,
      userId: snapshot.userId,
      totalValue: snapshot.totalValue,
      tokens: snapshot.tokens,
      chainId: snapshot.chainId,
      createdAt: new Date(),
    };
    this.portfolioSnapshots.set(newSnapshot.id, newSnapshot);
    return newSnapshot;
  }

  async getLatestPortfolioSnapshot(userId: number, chainId: number): Promise<PortfolioSnapshot | undefined> {
    return Array.from(this.portfolioSnapshots.values())
      .filter(snapshot => snapshot.userId === userId && snapshot.chainId === chainId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))[0];
  }
}

export const storage = new MemStorage();
