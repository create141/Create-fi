import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertSwapTransactionSchema, insertLimitOrderSchema } from "@shared/schema";
import axios from "axios";

const INCH_API_BASE = "https://api.1inch.dev";
const INCH_API_KEY = process.env.INCH_API_KEY || "q9kVkdW9TVkayWpGv3bcWZoMiqWFz78q";
const WALLET_ADDRESS = "0x26452dD8f0458846504544856775175Ab2724f87";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      let user = await storage.getUser(userData.address);
      if (!user) {
        user = await storage.createUser(userData);
      }
      
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'User creation failed' });
    }
  });

  app.get("/api/users/:address", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.address);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch user' });
    }
  });

  // 1inch API proxy routes
  app.get("/api/1inch/tokens/:chainId", async (req, res) => {
    try {
      const { chainId } = req.params;
      const response = await axios.get(`${INCH_API_BASE}/token/v1.2/${chainId}`, {
        headers: {
          'Authorization': `Bearer ${INCH_API_KEY}`,
        },
      });
      res.json(response.data);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch tokens" });
    }
  });

  app.get("/api/1inch/quote/:chainId", async (req, res) => {
    try {
      const { chainId } = req.params;
      const { src, dst, amount } = req.query;
      
      if (!src || !dst || !amount) {
        return res.status(400).json({ error: "Missing required parameters" });
      }

      const response = await axios.get(`${INCH_API_BASE}/swap/v5.2/${chainId}/quote`, {
        headers: {
          'Authorization': `Bearer ${INCH_API_KEY}`,
        },
        params: {
          src,
          dst,
          amount,
          includeTokensInfo: true,
          includeProtocols: true,
        },
      });
      res.json(response.data);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to get quote" });
    }
  });

  app.get("/api/1inch/swap/:chainId", async (req, res) => {
    try {
      const { chainId } = req.params;
      const { src, dst, amount, from, slippage = 1 } = req.query;
      
      if (!src || !dst || !amount || !from) {
        return res.status(400).json({ error: "Missing required parameters" });
      }

      const response = await axios.get(`${INCH_API_BASE}/swap/v5.2/${chainId}/swap`, {
        headers: {
          'Authorization': `Bearer ${INCH_API_KEY}`,
        },
        params: {
          src,
          dst,
          amount,
          from,
          slippage,
          referrer: WALLET_ADDRESS, // Commission integration
          includeTokensInfo: true,
          includeProtocols: true,
        },
      });
      res.json(response.data);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to get swap data" });
    }
  });

  app.get("/api/1inch/allowance/:chainId", async (req, res) => {
    try {
      const { chainId } = req.params;
      const { tokenAddress, walletAddress } = req.query;
      
      if (!tokenAddress || !walletAddress) {
        return res.status(400).json({ error: "Missing required parameters" });
      }

      const response = await axios.get(`${INCH_API_BASE}/swap/v5.2/${chainId}/approve/allowance`, {
        headers: {
          'Authorization': `Bearer ${INCH_API_KEY}`,
        },
        params: {
          tokenAddress,
          walletAddress,
        },
      });
      res.json(response.data);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to get allowance" });
    }
  });

  app.get("/api/1inch/approve/:chainId", async (req, res) => {
    try {
      const { chainId } = req.params;
      const { tokenAddress, amount } = req.query;
      
      if (!tokenAddress) {
        return res.status(400).json({ error: "Missing token address" });
      }

      const response = await axios.get(`${INCH_API_BASE}/swap/v5.2/${chainId}/approve/transaction`, {
        headers: {
          'Authorization': `Bearer ${INCH_API_KEY}`,
        },
        params: {
          tokenAddress,
          amount,
        },
      });
      res.json(response.data);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to get approve transaction" });
    }
  });

  // Portfolio API
  app.get("/api/1inch/portfolio/:chainId/:address", async (req, res) => {
    try {
      const { chainId, address } = req.params;
      const response = await axios.get(`${INCH_API_BASE}/portfolio/portfolio/v4/overview/erc20/current`, {
        headers: {
          'Authorization': `Bearer ${INCH_API_KEY}`,
        },
        params: {
          addresses: address,
          chainId,
        },
      });
      res.json(response.data);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to get portfolio data" });
    }
  });

  // History API
  app.get("/api/1inch/history/:chainId/:address", async (req, res) => {
    try {
      const { chainId, address } = req.params;
      const { limit = 50, offset = 0 } = req.query;
      
      const response = await axios.get(`${INCH_API_BASE}/history/v2.0/history/${address}/events`, {
        headers: {
          'Authorization': `Bearer ${INCH_API_KEY}`,
        },
        params: {
          chainId,
          limit,
          offset,
        },
      });
      res.json(response.data);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to get transaction history" });
    }
  });

  // Gas Price API
  app.get("/api/1inch/gas-price/:chainId", async (req, res) => {
    try {
      const { chainId } = req.params;
      const response = await axios.get(`${INCH_API_BASE}/gas-price/v1.4/${chainId}`, {
        headers: {
          'Authorization': `Bearer ${INCH_API_KEY}`,
        },
      });
      res.json(response.data);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to get gas prices" });
    }
  });

  // Spot Price API
  app.get("/api/1inch/spot-price/:chainId", async (req, res) => {
    try {
      const { chainId } = req.params;
      const { addresses } = req.query;
      
      if (!addresses) {
        return res.status(400).json({ error: "Missing token addresses" });
      }

      const response = await axios.get(`${INCH_API_BASE}/price/v1.1/${chainId}`, {
        headers: {
          'Authorization': `Bearer ${INCH_API_KEY}`,
        },
        params: {
          addresses,
        },
      });
      res.json(response.data);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to get spot prices" });
    }
  });

  // Swap transaction routes
  app.post("/api/swap-transactions", async (req, res) => {
    try {
      const { userAddress, ...transactionData } = req.body;
      
      let user = await storage.getUser(userAddress);
      if (!user) {
        user = await storage.createUser({ address: userAddress });
      }

      const validatedData = insertSwapTransactionSchema.parse(transactionData);
      const transaction = await storage.createSwapTransaction({
        ...validatedData,
        userId: user.id,
      });
      
      res.json(transaction);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to create swap transaction' });
    }
  });

  app.get("/api/swap-transactions/:userAddress", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.userAddress);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const transactions = await storage.getSwapTransactions(user.id);
      res.json(transactions);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch transactions' });
    }
  });

  app.put("/api/swap-transactions/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status, txHash } = req.body;
      
      await storage.updateSwapTransactionStatus(parseInt(id), status, txHash);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to update transaction status' });
    }
  });

  // Limit order routes
  app.post("/api/limit-orders", async (req, res) => {
    try {
      const { userAddress, ...orderData } = req.body;
      
      let user = await storage.getUser(userAddress);
      if (!user) {
        user = await storage.createUser({ address: userAddress });
      }

      const validatedData = insertLimitOrderSchema.parse(orderData);
      const order = await storage.createLimitOrder({
        ...validatedData,
        userId: user.id,
      });
      
      res.json(order);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to create limit order' });
    }
  });

  app.get("/api/limit-orders/:userAddress", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.userAddress);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const orders = await storage.getLimitOrders(user.id);
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch limit orders' });
    }
  });

  app.put("/api/limit-orders/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      await storage.updateLimitOrderStatus(parseInt(id), status);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to update order status' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}