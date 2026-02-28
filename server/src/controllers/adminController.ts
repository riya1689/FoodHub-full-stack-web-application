import { Request, Response } from 'express';
import prisma from '../db';

// Get Admin Dashboard Stats
export const getAdminStats = async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Verify the user is actually an ADMIN
    const userId = req.user?.userId;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    if (user?.role !== 'ADMIN') {
       res.status(403).json({ error: "Access denied. Admin privileges required." });
       return;
    }

    // 2. Gather platform-wide statistics
    const totalUsers = await prisma.user.count();
    const totalCustomers = await prisma.user.count({ where: { role: 'CUSTOMER' } });
    const totalProviders = await prisma.user.count({ where: { role: 'PROVIDER' } });
    const totalOrders = await prisma.order.count();
    
    // 3. Calculate total platform revenue
    const orders = await prisma.order.findMany();
    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);

    res.json({
      totalUsers,
      totalCustomers,
      totalProviders,
      totalOrders,
      totalRevenue
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ error: "Failed to fetch admin stats" });
  }
};

// Get All Users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Get All Orders (Platform wide)
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: { 
        customer: { select: { name: true, email: true } },
        items: { include: { meal: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};