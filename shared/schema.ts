import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  address: text("address").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const swapTransactions = pgTable("swap_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  fromToken: text("from_token").notNull(),
  toToken: text("to_token").notNull(),
  fromAmount: decimal("from_amount", { precision: 78, scale: 18 }).notNull(),
  toAmount: decimal("to_amount", { precision: 78, scale: 18 }).notNull(),
  txHash: text("tx_hash"),
  chainId: integer("chain_id").notNull(),
  status: text("status").notNull(), // pending, completed, failed
  createdAt: timestamp("created_at").defaultNow(),
});

export const limitOrders = pgTable("limit_orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  fromToken: text("from_token").notNull(),
  toToken: text("to_token").notNull(),
  fromAmount: decimal("from_amount", { precision: 78, scale: 18 }).notNull(),
  targetPrice: decimal("target_price", { precision: 78, scale: 18 }).notNull(),
  chainId: integer("chain_id").notNull(),
  status: text("status").notNull(), // active, filled, cancelled, expired
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const portfolioSnapshots = pgTable("portfolio_snapshots", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  totalValue: decimal("total_value", { precision: 78, scale: 18 }).notNull(),
  tokens: jsonb("tokens").notNull(), // Array of token balances
  chainId: integer("chain_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  address: true,
});

export const insertSwapTransactionSchema = createInsertSchema(swapTransactions).pick({
  fromToken: true,
  toToken: true,
  fromAmount: true,
  toAmount: true,
  chainId: true,
});

export const insertLimitOrderSchema = createInsertSchema(limitOrders).pick({
  fromToken: true,
  toToken: true,
  fromAmount: true,
  targetPrice: true,
  chainId: true,
  expiresAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertSwapTransaction = z.infer<typeof insertSwapTransactionSchema>;
export type SwapTransaction = typeof swapTransactions.$inferSelect;

export type InsertLimitOrder = z.infer<typeof insertLimitOrderSchema>;
export type LimitOrder = typeof limitOrders.$inferSelect;

export type PortfolioSnapshot = typeof portfolioSnapshots.$inferSelect;
