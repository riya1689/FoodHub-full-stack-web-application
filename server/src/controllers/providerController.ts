import { Request, Response } from 'express';
import prisma from '../db';

import { OrderStatus } from '@prisma/client';

// Get Provider Dashboard Stats (Private)
export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    
    const profile = await prisma.providerProfile.findUnique({
      where: { userId: userId }
    });

    if (!profile) {
      res.status(404).json({ error: "Provider profile not found" });
      return;
    }

    // Count active meals
    const mealsCount = await prisma.meal.count({
      where: { providerId: profile.id }
    });

    // Find orders containing this provider's meals
    const orders = await prisma.order.findMany({
      where: {
        items: { some: { meal: { providerId: profile.id } } }
      },
      include: {
        items: {
          where: { meal: { providerId: profile.id } } // Only include THIS provider's items
        }
      }
    });

    //  Calculate Revenue (Only from this provider's items)
    const revenue = orders.reduce((total, order) => {
      const orderRevenue = order.items.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
      return total + orderRevenue;
    }, 0);

    res.json({
      totalOrders: orders.length,
      activeMeals: mealsCount,
      revenue: revenue
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
};

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

// Update Order Status
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    //Validation status
    if (!Object.values(OrderStatus).includes(status)) {
        res.status(400).json({ error: "Invalid status value" });
        return;
    }

    const updatedOrder = await prisma.order.update({
      where: { id: Number(id) },
      data: { status: status as OrderStatus }
    });

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status' });
  }
};

// Get All Providers (Restaurants)
export const getAllProviders = async (req: Request, res: Response) => {
  try {
    const providers = await prisma.providerProfile.findMany({
      include: { 
         user: { select: { name: true } } 
      }
    });
    res.json(providers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch providers" });
  }
};

// Get Single Provider with Menu
export const getProviderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const provider = await prisma.providerProfile.findUnique({
      where: { id: Number(id) },
      include: {
        meals: {
          include: { category: true }
        },
        user: { select: { name: true } }
      }
    });

    if (!provider) {
       res.status(404).json({ error: "Provider not found" });
       return;
    }
    res.json(provider);
  } catch (error) {
    res.status(500).json({ error: "Error fetching provider" });
  }
};

// Add a new Meal (Provider Only)
export const addMeal = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const profile = await prisma.providerProfile.findUnique({ where: { userId } });
    
    if (!profile) { 
      res.status(404).json({ error: "Provider profile not found" }); 
      return; 
    }

    const { name, description, price, imageUrl, dietaryPref, categoryId } = req.body;
    
    const meal = await prisma.meal.create({
      data: {
        name, 
        description, 
        price, 
        imageUrl: imageUrl || "https://placehold.co/600x400?text=New+Meal", 
        dietaryPref,
        categoryId: Number(categoryId),
        providerId: profile.id
      }
    });
    
    res.status(201).json({ message: "Meal added successfully", meal });
  } catch (error) { 
    console.error(error);
    res.status(500).json({ error: "Failed to add meal" }); 
  }
};

// Delete a Meal (Provider Only)
export const deleteMeal = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.meal.delete({ where: { id: Number(id) } });
    res.json({ message: "Meal deleted successfully" });
  } catch (error) { 
    res.status(500).json({ error: "Failed to delete meal. It might be linked to an order." }); 
  }
};