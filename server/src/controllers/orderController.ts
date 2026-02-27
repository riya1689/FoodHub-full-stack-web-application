import { Request, Response } from 'express';
import prisma from '../db';

// Create a New Order
export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { items, address } = req.body; // items = [{ mealId: 1, quantity: 2 }]
    const userId = req.user?.userId;

    if (!items || items.length === 0) {
      res.status(400).json({ error: "Cart is empty" });
      return;
    }

    // Calculate Total Price & Verify Items exist
    let totalAmount = 50;
    const orderItemsData = [];

    for (const item of items) {
      const meal = await prisma.meal.findUnique({ where: { id: item.mealId } });
      if (!meal) {
         res.status(404).json({ error: `Meal with ID ${item.mealId} not found` });
         return;
      }
      const itemTotal = Number(meal.price) * item.quantity;
      totalAmount += itemTotal;

      orderItemsData.push({
        mealId: item.mealId,
        quantity: item.quantity,
        price: meal.price 
      });
    }

    // Create Order in Database (Transaction)
    const order = await prisma.order.create({
      data: {
        customerId: userId!,
        totalAmount,
        address,
        status: 'PENDING',
        items: {
          create: orderItemsData
        }
      },
      include: { items: true }
    });

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to place order' });
  }
};

// Get My Orders (Customer)
export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const orders = await prisma.order.findMany({
      where: { customerId: userId },
      include: { items: { include: { meal: true } } }, // Include meal details
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};