import { Request, Response } from 'express';
import prisma from '../db';
import { OrderStatus } from '@prisma/client';

// Get Orders for this Provider's Meals

export const getProviderOrders = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    
    // 1. Get Provider Profile ID
    const providerProfile = await prisma.providerProfile.findUnique({
        where: { userId: userId }
    });

    if (!providerProfile) {
        res.status(404).json({ error: "Provider profile not found" });
        return;
    }

    // 2. Find orders containing items from this provider
    const orders = await prisma.order.findMany({
      where: {
        items: {
          some: {
            meal: {
              providerId: providerProfile.id
            }
          }
        }
      },
      include: {
        items: { include: { meal: true } },
        customer: { select: { name: true, email: true } }
      }
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};
